const fs = require("fs");
const csv = require("csv-parser");
const { v4: uuidv4 } = require("uuid");
const { spawn } = require("child_process");
const path = require("path");
const SalesRecord = require("../models/SalesRecord");
const AnalyticsSummary = require("../models/AnalyticsSummary");

// Field name normalization map
const FIELD_MAP = {
  date: ["date", "Date", "DATE", "order_date", "OrderDate", "sale_date"],
  customer: [
    "customer",
    "Customer",
    "customer_name",
    "CustomerName",
    "client",
    "buyer",
  ],
  category: [
    "category",
    "Category",
    "CATEGORY",
    "product_category",
    "type",
    "Type",
  ],
  revenue: [
    "revenue",
    "Revenue",
    "REVENUE",
    "amount",
    "Amount",
    "total",
    "Total",
    "sales",
    "price",
  ],
  city: ["city", "City", "CITY", "location", "Location", "region"],
  quantity: ["quantity", "Quantity", "qty", "Qty", "QTY", "count"],
  orderId: ["order_id", "OrderId", "orderId", "id", "ID"],
};

function normalizeRow(row) {
  const normalized = {};
  for (const [target, aliases] of Object.entries(FIELD_MAP)) {
    for (const alias of aliases) {
      if (
        row[alias] !== undefined &&
        row[alias] !== null &&
        row[alias] !== ""
      ) {
        normalized[target] = row[alias];
        break;
      }
    }
  }
  return normalized;
}

function parseDate(str) {
  if (!str) return null;
  const d = new Date(str);
  if (!isNaN(d.getTime())) return d;
  // Try DD/MM/YYYY
  const parts = str.split(/[\/\-]/);
  if (parts.length === 3) {
    const attempt = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
    if (!isNaN(attempt.getTime())) return attempt;
  }
  return null;
}

exports.uploadCSV = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const uploadId = uuidv4();
  const filePath = req.file.path;
  const records = [];

  try {
    // Parse CSV
    await new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (row) => {
          const norm = normalizeRow(row);
          const date = parseDate(norm.date);
          const revenue = parseFloat(norm.revenue);

          if (!date || isNaN(revenue) || !norm.customer || !norm.category)
            return;

          records.push({
            uploadId,
            date,
            customer: String(norm.customer).trim(),
            category: String(norm.category).trim(),
            revenue,
            city: norm.city ? String(norm.city).trim() : "Unknown",
            quantity: norm.quantity ? parseInt(norm.quantity) || 1 : 1,
            orderId: norm.orderId ? String(norm.orderId) : "",
          });
        })
        .on("end", resolve)
        .on("error", reject);
    });

    if (records.length === 0) {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        error:
          "No valid records found. Ensure CSV has: date, customer, category, revenue columns.",
      });
    }

    // Bulk insert into MongoDB
    await SalesRecord.insertMany(records, { ordered: false });

    // Trigger Python ML processing asynchronously
    runMLPipeline(uploadId, filePath, records);

    res.json({
      success: true,
      uploadId,
      recordCount: records.length,
      message: "Data uploaded. Analytics processing started.",
    });
  } catch (err) {
    console.error("Upload error:", err);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res
      .status(500)
      .json({ error: "Upload processing failed", details: err.message });
  }
};

function runMLPipeline(uploadId, filePath, records) {
  const jsonPath = path
    .join(require("os").tmpdir(), `${uploadId}.json`)
    .replace(/\\/g, "/");
  fs.writeFileSync(jsonPath, JSON.stringify(records));

  const pythonPath = process.env.PYTHON_PATH || "python";
  const mlDir = path.join(__dirname, "../../ml-service");
  const scriptPath = path.join(mlDir, "main.py");

  console.log(`[ML] Starting Python...`);
  console.log(`[ML] Script: ${scriptPath}`);
  console.log(`[ML] JSON: ${jsonPath}`);
  console.log(`[ML] CWD: ${mlDir}`);

  const py = spawn(pythonPath, [scriptPath, uploadId, jsonPath], {
    cwd: mlDir,
    shell: true,
  });

  let output = "";
  let errorOutput = "";

  py.stdout.on("data", (data) => {
    output += data.toString();
    console.log("[Python stdout]", data.toString());
  });

  py.stderr.on("data", (data) => {
    errorOutput += data.toString();
    console.error("[Python stderr]", data.toString());
  });

  py.on("error", (err) => {
    console.error("[Python spawn error]", err.message);
  });

  py.on("close", async (code) => {
    console.log(`[ML] Python exited with code: ${code}`);
    console.log(`[ML] Raw output: ${output}`);

    if (fs.existsSync(jsonPath)) fs.unlinkSync(jsonPath);

    if (code === 0 && output.trim()) {
      try {
        const result = JSON.parse(output.trim());
        await AnalyticsSummary.findOneAndUpdate(
          { uploadId },
          { ...result, uploadId },
          { upsert: true, new: true },
        );
        console.log(`✅ ML pipeline done for ${uploadId}`);
      } catch (e) {
        console.error("[ML] JSON parse error:", e.message);
        console.error("[ML] Output was:", output);
      }
    } else {
      console.error("[ML] Python failed. Error:", errorOutput);
    }
  });
}

exports.getUploadStatus = async (req, res) => {
  const { uploadId } = req.params;
  const summary = await AnalyticsSummary.findOne({ uploadId });
  res.json({ ready: !!summary, uploadId });
};

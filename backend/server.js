const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Routes
app.use("/api/upload", require("./routes/upload"));
app.use("/api/analytics", require("./routes/analytics"));
app.use("/api/forecast", require("./routes/forecast"));
app.use("/api/insights", require("./routes/insights"));
app.use("/api/chat", require("./routes/chat"));

// Health check
app.get("/", (req, res) => {
  res.json({ status: "SmartSales AI Backend Running", version: "1.0.0" });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

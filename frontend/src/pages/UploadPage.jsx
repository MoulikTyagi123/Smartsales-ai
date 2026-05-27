import { useState, useRef } from "react";
import { Upload, FileText, CheckCircle, AlertCircle, CloudUpload } from "lucide-react";
import { uploadCSV } from "../utils/api";

const SAMPLE_FORMAT = `date,customer,category,revenue,city,quantity
2024-01-15,Alice Corp,Electronics,1250.00,Mumbai,3
2024-01-16,Bob Ltd,Food & Beverage,340.50,Delhi,8
2024-01-17,Carol Inc,Clothing,890.00,Bangalore,2`;

export default function UploadPage({ onSuccess }) {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const inputRef = useRef();

  const handleFile = (f) => {
    if (f && f.name.endsWith(".csv")) {
      setFile(f);
      setError(null);
    } else {
      setError("Please upload a .csv file");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) return;
    setUploading(true);
    setError(null);
    setProgress(0);
    try {
      const res = await uploadCSV(file, setProgress);
      onSuccess(res.data.uploadId);
    } catch (err) {
      setError(err.response?.data?.error || "Upload failed. Please try again.");
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: "42rem", margin: "0 auto" }}>
      {/* Header */}
      <div className="mb-8">
        <div className="tag mb-3">Step 1 of 3</div>
        <h1 className="font-bold mb-2" style={{ fontFamily: "Syne", fontSize: "clamp(1.6rem, 6vw, 2.5rem)" }}>
          Upload your sales data
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "clamp(0.85rem, 3vw, 1rem)" }}>
          Drop a CSV file and let SmartSales AI clean, analyze, and forecast your data automatically.
        </p>
      </div>

      {/* Drop Zone */}
      <div
        className={`relative rounded-2xl text-center transition-all cursor-pointer ${dragging ? "gradient-border" : ""}`}
        style={{
          padding: "clamp(1.5rem, 6vw, 2.5rem)",
          border: dragging
            ? "2px dashed var(--accent)"
            : file
            ? "2px dashed rgba(74,222,128,0.5)"
            : "2px dashed var(--border-bright)",
          background: dragging ? "var(--accent-muted)" : "var(--bg-card)",
        }}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => !file && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />

        {file ? (
          <div className="fade-up">
            <CheckCircle size={36} className="mx-auto mb-3" style={{ color: "var(--accent)" }} />
            <p className="font-semibold mb-1" style={{ color: "var(--text-primary)", fontSize: "clamp(0.95rem, 3vw, 1.1rem)" }}>
              {file.name}
            </p>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {(file.size / 1024).toFixed(1)} KB · Ready to process
            </p>
            <button
              onClick={(e) => { e.stopPropagation(); setFile(null); }}
              className="mt-4 text-xs px-4 py-2 rounded-xl"
              style={{ background: "var(--bg-card-hover)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
            >
              Choose different file
            </button>
          </div>
        ) : (
          <div>
            <CloudUpload size={36} className="mx-auto mb-3" style={{ color: "var(--text-muted)" }} />
            <p className="font-semibold mb-1" style={{ color: "var(--text-primary)", fontSize: "clamp(0.95rem, 3vw, 1.1rem)" }}>
              Drop your CSV file here
            </p>
            <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
              or tap to browse
            </p>
            <span className="tag">CSV files up to 50MB</span>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 flex items-center gap-2 p-3 rounded-xl" style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.25)" }}>
          <AlertCircle size={15} style={{ color: "#f87171" }} />
          <p className="text-sm" style={{ color: "#f87171" }}>{error}</p>
        </div>
      )}

      {/* Upload button */}
      {file && !uploading && (
        <button
          onClick={handleSubmit}
          className="w-full mt-4 py-4 rounded-2xl font-semibold transition-all fade-up"
          style={{
            background: "var(--accent)",
            color: "#0a0f0d",
            fontFamily: "Syne",
            fontSize: "clamp(0.9rem, 3vw, 1rem)",
          }}
        >
          Process Data →
        </button>
      )}

      {/* Progress */}
      {uploading && (
        <div className="mt-4 fade-up">
          <div className="flex justify-between text-sm mb-2" style={{ color: "var(--text-muted)" }}>
            <span>Uploading & processing...</span>
            <span className="num">{progress}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--border)" }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${progress}%`, background: "var(--accent)" }}
            />
          </div>
          <p className="text-xs mt-2 text-center" style={{ color: "var(--text-muted)" }}>
            Running ML pipeline → MongoDB → Forecasting model...
          </p>
        </div>
      )}

      {/* Sample format */}
      <div className="mt-6 card p-4">
        <div className="flex items-center gap-2 mb-3">
          <FileText size={13} style={{ color: "var(--accent)" }} />
          <span className="text-sm font-semibold" style={{ color: "var(--text-secondary)" }}>
            Expected CSV format
          </span>
        </div>
        <pre
          className="text-xs overflow-x-auto rounded-xl p-3"
          style={{
            background: "var(--bg-primary)",
            color: "var(--accent)",
            border: "1px solid var(--border)",
            fontFamily: "JetBrains Mono",
            lineHeight: 1.7,
            fontSize: "clamp(9px, 2.5vw, 12px)",
          }}
        >
          {SAMPLE_FORMAT}
        </pre>
        <p className="text-xs mt-3" style={{ color: "var(--text-muted)" }}>
          Column names are flexible — the pipeline auto-detects common variations (e.g. "amount", "total", "sale_date")
        </p>
      </div>
    </div>
  );
}
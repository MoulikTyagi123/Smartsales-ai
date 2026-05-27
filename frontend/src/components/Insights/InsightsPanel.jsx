import { useState } from "react";
import { Sparkles, RefreshCw, Lightbulb } from "lucide-react";
import { getInsights } from "../../utils/api";

export default function InsightsPanel({ uploadId }) {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetched, setFetched] = useState(false);

  const fetchInsights = async () => {
    if (!uploadId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await getInsights(uploadId);
      setInsights(res.data.insights || []);
      setFetched(true);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to generate insights");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <Sparkles size={16} style={{ color: "var(--accent)" }} />
          <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
            AI Business Insights
          </h3>
        </div>
        <button
          onClick={fetchInsights}
          disabled={loading}
          className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl font-semibold transition-all"
          style={{
            background: loading ? "var(--bg-card-hover)" : "var(--accent-muted)",
            color: loading ? "var(--text-muted)" : "var(--accent)",
            border: "1px solid rgba(74,222,128,0.25)",
            cursor: loading ? "not-allowed" : "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {loading ? (
            <>
              <RefreshCw size={12} className="animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles size={12} />
              {fetched ? "Regenerate" : "Generate"}
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="text-sm p-3 rounded-xl" style={{ background: "rgba(248,113,113,0.1)", color: "#f87171" }}>
          {error}
        </div>
      )}

      {!fetched && !loading && (
        <div className="text-center py-6" style={{ color: "var(--text-muted)" }}>
          <Lightbulb size={28} className="mx-auto mb-3 opacity-40" />
          <p className="text-xs">Click "Generate" to get AI-powered analysis of your sales data</p>
        </div>
      )}

      {insights.length > 0 && (
        <div className="space-y-3">
          {insights.map((insight, i) => (
            <div
              key={i}
              className="flex gap-3 p-3 rounded-xl fade-up"
              style={{
                background: "var(--bg-card-hover)",
                border: "1px solid var(--border)",
                animationDelay: `${i * 80}ms`,
              }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 num text-xs font-bold"
                style={{ background: "var(--accent-muted)", color: "var(--accent)", border: "1px solid rgba(74,222,128,0.3)" }}
              >
                {i + 1}
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {insight}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
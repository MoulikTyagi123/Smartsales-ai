import { RefreshCw } from "lucide-react";
import { useAnalytics } from "../hooks/useAnalytics";
import StatCards from "../components/Dashboard/StatCards";
import {
  RevenueLineChart,
  ForecastLineChart,
  CategoryBarChart,
  CityBarChart,
  SegmentPieChart,
} from "../components/Charts";
import InsightsPanel from "../components/Insights/InsightsPanel";

export default function DashboardPage({ uploadId }) {
  const { analytics, loading, error } = useAnalytics(uploadId);

  if (!uploadId) {
    return (
      <div className="flex items-center justify-center h-64">
        <p style={{ color: "var(--text-muted)" }}>Upload data first to view dashboard.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <RefreshCw size={28} className="animate-spin" style={{ color: "var(--accent)" }} />
        <div className="text-center">
          <p className="font-semibold" style={{ color: "var(--text-primary)" }}>Processing your data</p>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Running ML pipeline · Cleaning · Forecasting...
          </p>
        </div>
        <div className="flex gap-1 mt-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full pulse-dot"
              style={{ background: "var(--accent)", animationDelay: `${i * 300}ms` }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p style={{ color: "#f87171" }}>{error}</p>
      </div>
    );
  }

  if (!analytics) return null;

  return (
    <div className="space-y-6 fade-up">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ fontFamily: "Syne" }}>
            Sales Dashboard
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Upload ID: <span className="num text-xs">{uploadId}</span>
          </p>
        </div>
        <div className="tag">Live</div>
      </div>

      {/* KPI Cards */}
      <StatCards analytics={analytics} />

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RevenueLineChart data={analytics.monthlyRevenue} />
        <ForecastLineChart
          historical={analytics.monthlyRevenue}
          forecast={analytics.forecastData}
        />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <CategoryBarChart data={analytics.topCategories} />
        <CityBarChart data={analytics.topCities} />
        <SegmentPieChart segments={analytics.customerSegments} />
      </div>

      {/* AI Insights */}
      <InsightsPanel uploadId={uploadId} />
    </div>
  );
}

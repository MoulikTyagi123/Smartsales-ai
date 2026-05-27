import { DollarSign, ShoppingCart, Users, TrendingUp, TrendingDown, UserCheck } from "lucide-react";
import { fmt } from "../../utils/format";

const METRICS = [
  {
    key: "totalRevenue",
    label: "Total Revenue",
    icon: DollarSign,
    format: fmt.currency,
    color: "#4ade80",
  },
  {
    key: "totalOrders",
    label: "Total Orders",
    icon: ShoppingCart,
    format: fmt.number,
    color: "#60a5fa",
  },
  {
    key: "uniqueCustomers",
    label: "Unique Customers",
    icon: Users,
    format: fmt.number,
    color: "#f472b6",
  },
  {
    key: "avgOrderValue",
    label: "Avg Order Value",
    icon: TrendingUp,
    format: fmt.currency,
    color: "#fb923c",
  },
  {
    key: "repeatCustomers",
    label: "Repeat Customers",
    icon: UserCheck,
    format: fmt.number,
    color: "#a78bfa",
  },
  {
    key: "revenueGrowth",
    label: "Revenue Growth",
    icon: TrendingUp,
    format: fmt.percent,
    isGrowth: true,
    color: "#4ade80",
  },
];

function StatCard({ metric, value }) {
  const Icon = metric.icon;
  const isGrowth = metric.isGrowth;
  const isNeg = isGrowth && value < 0;
  const GrowthIcon = isNeg ? TrendingDown : TrendingUp;

  return (
    <div
      className="card p-4 fade-up"
      style={{ animationDelay: `${METRICS.indexOf(metric) * 60}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `${metric.color}18`, border: `1px solid ${metric.color}30` }}
        >
          {isGrowth ? (
            <GrowthIcon size={16} style={{ color: metric.color }} />
          ) : (
            <Icon size={16} style={{ color: metric.color }} />
          )}
        </div>
        {isGrowth && (
          <span
            className="text-xs font-semibold px-2 py-1 rounded-full"
            style={{
              background: isNeg ? "rgba(248,113,113,0.12)" : "rgba(74,222,128,0.12)",
              color: isNeg ? "#f87171" : "#4ade80",
              border: `1px solid ${isNeg ? "rgba(248,113,113,0.25)" : "rgba(74,222,128,0.25)"}`,
            }}
          >
            MoM
          </span>
        )}
      </div>
      <div className="num font-bold mb-1" style={{ color: "var(--text-primary)", fontSize: "clamp(1.1rem, 4vw, 1.5rem)" }}>
        {metric.format(value)}
      </div>
      <div className="text-xs" style={{ color: "var(--text-muted)" }}>
        {metric.label}
      </div>
    </div>
  );
}

export default function StatCards({ analytics }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
      {METRICS.map((metric) => (
        <StatCard key={metric.key} metric={metric} value={analytics[metric.key]} />
      ))}
    </div>
  );
}
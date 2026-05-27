import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { fmt } from "../../utils/format";

const TOOLTIP_STYLE = {
  background: "#1e2e23",
  border: "1px solid #344d3a",
  borderRadius: "10px",
  padding: "10px 14px",
  color: "#e8f5ec",
  fontFamily: "DM Sans",
  fontSize: 13,
};

const LABEL_STYLE = { fill: "#e8f5ec", fontSize: 11, fontFamily: "DM Sans" };

const CAT_COLORS = ["#4ade80", "#60a5fa", "#f472b6", "#fb923c", "#a78bfa", "#fbbf24", "#34d399", "#f87171"];
const CITY_COLORS = ["#60a5fa", "#f472b6", "#fb923c", "#a78bfa", "#fbbf24", "#34d399", "#f87171", "#4ade80"];
const PIE_COLORS = ["#4ade80", "#60a5fa", "#f472b6"];

function ChartCard({ title, subtitle, children }) {
  return (
    <div className="card p-4">
      <div className="mb-3">
        <h3 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          {title}
        </h3>
        {subtitle && (
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label, formatter }) => {
  if (active && payload && payload.length) {
    return (
      <div style={TOOLTIP_STYLE}>
        <p style={{ color: "#9db8a4", marginBottom: 4, fontSize: 12 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: "#e8f5ec", fontWeight: 600 }}>
            {formatter ? formatter(p.value, p.name) : `${p.name}: ${p.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Responsive chart height hook via CSS trick
const CHART_H = 200;

export function RevenueLineChart({ data }) {
  const formatted = (data || []).map((d) => ({
    ...d,
    month: fmt.shortMonth(d.month),
  }));

  return (
    <ChartCard title="Monthly Revenue" subtitle="Historical revenue trend">
      <ResponsiveContainer width="100%" height={CHART_H}>
        <LineChart data={formatted}>
          <CartesianGrid strokeDasharray="3 3" stroke="#263a2c" />
          <XAxis dataKey="month" tick={LABEL_STYLE} interval="preserveStartEnd" />
          <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={LABEL_STYLE} width={44} />
          <Tooltip content={<CustomTooltip formatter={(v) => fmt.currency(v)} />} />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#4ade80"
            strokeWidth={2.5}
            dot={{ fill: "#4ade80", r: 3, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: "#4ade80" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function ForecastLineChart({ historical, forecast }) {
  const hist = (historical || []).slice(-6).map((d) => ({
    month: fmt.shortMonth(d.month),
    actual: d.revenue,
  }));
  const fore = (forecast || []).map((d) => ({
    month: fmt.shortMonth(d.month),
    forecast: d.predicted,
  }));
  const combined = [...hist, ...fore];

  return (
    <ChartCard title="Revenue Forecast" subtitle="Next 6 months (Linear Regression)">
      <ResponsiveContainer width="100%" height={CHART_H}>
        <LineChart data={combined}>
          <CartesianGrid strokeDasharray="3 3" stroke="#263a2c" />
          <XAxis dataKey="month" tick={LABEL_STYLE} interval="preserveStartEnd" />
          <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={LABEL_STYLE} width={44} />
          <Tooltip content={<CustomTooltip formatter={(v, n) => `${n === "actual" ? "Actual" : "Forecast"}: ${fmt.currency(v)}`} />} />
          <Legend wrapperStyle={{ color: "#9db8a4", fontSize: 11 }} />
          <Line type="monotone" dataKey="actual" stroke="#4ade80" strokeWidth={2} dot={false} name="Actual" />
          <Line type="monotone" dataKey="forecast" stroke="#60a5fa" strokeWidth={2} strokeDasharray="6 3" dot={{ fill: "#60a5fa", r: 3, strokeWidth: 0 }} name="Forecast" />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function CategoryBarChart({ data }) {
  return (
    <ChartCard title="Revenue by Category" subtitle="Top performing categories">
      <ResponsiveContainer width="100%" height={CHART_H}>
        <BarChart data={(data || []).slice(0, 7)} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#263a2c" />
          <XAxis type="number" tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={LABEL_STYLE} width={44} />
          <YAxis type="category" dataKey="name" width={85} tick={{ ...LABEL_STYLE, fontSize: 10 }} />
          <Tooltip content={<CustomTooltip formatter={(v) => fmt.currency(v)} />} />
          <Bar dataKey="revenue" radius={[0, 6, 6, 0]}>
            {(data || []).slice(0, 7).map((_, i) => (
              <Cell key={i} fill={CAT_COLORS[i % CAT_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function CityBarChart({ data }) {
  const formatted = (data || []).slice(0, 6).map(d => ({
    ...d,
    shortName: d.name.length > 8 ? d.name.slice(0, 8) : d.name,
  }));

  return (
    <ChartCard title="Revenue by City" subtitle="Geographic distribution">
      <ResponsiveContainer width="100%" height={CHART_H}>
        <BarChart data={formatted}>
          <CartesianGrid strokeDasharray="3 3" stroke="#263a2c" />
          <XAxis
            dataKey="name"
            tick={{ ...LABEL_STYLE, fontSize: 9 }}
            interval={0}
            angle={-20}
            textAnchor="end"
            height={40}
          />
          <YAxis tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} tick={LABEL_STYLE} width={40} />
          <Tooltip content={<CustomTooltip formatter={(v) => fmt.currency(v)} />} />
          <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
            {formatted.map((_, i) => (
              <Cell key={i} fill={CITY_COLORS[i % CITY_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function SegmentPieChart({ segments }) {
  const data = [
    { name: "High Value", value: segments?.highValue || 0 },
    { name: "Medium Value", value: segments?.mediumValue || 0 },
    { name: "Low Value", value: segments?.lowValue || 0 },
  ].filter((d) => d.value > 0);

  return (
    <ChartCard title="Customer Segments" subtitle="Revenue-based segmentation">
      <ResponsiveContainer width="100%" height={CHART_H}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={45}
            outerRadius={72}
            paddingAngle={4}
            dataKey="value"
            label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((_, i) => (
              <Cell key={i} fill={PIE_COLORS[i]} />
            ))}
          </Pie>
          <Tooltip
            content={<CustomTooltip formatter={(v, n) => `${n}: ${v} customers`} />}
          />
          <Legend
            wrapperStyle={{ color: "#e8f5ec", fontSize: 11 }}
            formatter={(value) => <span style={{ color: "#e8f5ec" }}>{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
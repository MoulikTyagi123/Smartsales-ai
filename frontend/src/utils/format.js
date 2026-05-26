export const fmt = {
  currency: (n) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n || 0),
  number: (n) =>
    new Intl.NumberFormat("en-US").format(n || 0),
  percent: (n) => `${n >= 0 ? "+" : ""}${(n || 0).toFixed(1)}%`,
  shortMonth: (str) => {
    if (!str) return "";
    const parts = str.split("-");
    if (parts.length >= 2) {
      const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
      return `${months[parseInt(parts[1]) - 1]} '${parts[0].slice(2)}`;
    }
    return str;
  },
};

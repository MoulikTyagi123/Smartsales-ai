const mongoose = require("mongoose");

const AnalyticsSummarySchema = new mongoose.Schema(
  {
    uploadId: { type: String, required: true, unique: true },
    totalRevenue: Number,
    totalOrders: Number,
    avgOrderValue: Number,
    topCategories: [{ name: String, revenue: Number }],
    topCities: [{ name: String, revenue: Number }],
    monthlyRevenue: [{ month: String, revenue: Number }],
    customerSegments: {
      highValue: Number,
      mediumValue: Number,
      lowValue: Number,
    },
    repeatCustomers: Number,
    uniqueCustomers: Number,
    revenueGrowth: Number,
    forecastData: [{ month: String, predicted: Number }],
    aiInsights: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("AnalyticsSummary", AnalyticsSummarySchema);

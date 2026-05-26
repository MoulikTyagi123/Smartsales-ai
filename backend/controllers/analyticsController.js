const AnalyticsSummary = require("../models/AnalyticsSummary");
const SalesRecord = require("../models/SalesRecord");

exports.getAnalytics = async (req, res) => {
  const { uploadId } = req.params;

  try {
    const summary = await AnalyticsSummary.findOne({ uploadId });
    if (!summary) {
      return res.status(202).json({ processing: true, message: "Analytics still processing..." });
    }
    res.json(summary);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRecentUploads = async (req, res) => {
  try {
    const summaries = await AnalyticsSummary.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("uploadId totalRevenue totalOrders createdAt");
    res.json(summaries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

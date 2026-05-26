const express = require("express");
const router = express.Router();
const AnalyticsSummary = require("../models/AnalyticsSummary");

router.get("/:uploadId", async (req, res) => {
  const summary = await AnalyticsSummary.findOne({ uploadId: req.params.uploadId });
  if (!summary) return res.status(404).json({ error: "Not found" });
  res.json({ forecastData: summary.forecastData });
});

module.exports = router;

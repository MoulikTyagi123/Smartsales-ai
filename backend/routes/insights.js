const express = require("express");
const router = express.Router();
const { generateInsights } = require("../controllers/insightsController");

router.get("/:uploadId", generateInsights);

module.exports = router;

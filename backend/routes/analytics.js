const express = require("express");
const router = express.Router();
const { getAnalytics, getRecentUploads } = require("../controllers/analyticsController");

router.get("/recent", getRecentUploads);
router.get("/:uploadId", getAnalytics);

module.exports = router;

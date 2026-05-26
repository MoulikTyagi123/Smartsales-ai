// routes/upload.js
const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { uploadCSV, getUploadStatus } = require("../controllers/uploadController");

router.post("/", upload.single("file"), uploadCSV);
router.get("/status/:uploadId", getUploadStatus);

module.exports = router;

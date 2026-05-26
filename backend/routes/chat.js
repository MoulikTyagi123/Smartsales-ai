const express = require("express");
const router = express.Router();
const { chatQuery } = require("../controllers/insightsController");

router.post("/", chatQuery);

module.exports = router;

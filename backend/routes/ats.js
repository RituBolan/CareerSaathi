const express = require("express");
const { requireAuth } = require("../middlewares/requireAuth");
const { handleATSAnalysis } = require("../controllers/ats");

const router = express.Router();

router.post("/analyze", requireAuth, handleATSAnalysis);

module.exports = router;

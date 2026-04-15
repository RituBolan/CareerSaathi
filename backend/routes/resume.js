const express = require("express");
const upload = require("../middlewares/upload");
const { requireAuth } = require("../middlewares/requireAuth");
const {
  handleUserResumeUpload,
  getUserResume,
  getResumeAnalysis,
} = require("../controllers/resume");

const router = express.Router();

router.get("/", requireAuth, getUserResume);
router.get("/analysis", requireAuth, getResumeAnalysis);
router.post("/upload", requireAuth, upload.single("resume"), handleUserResumeUpload);

module.exports = router;

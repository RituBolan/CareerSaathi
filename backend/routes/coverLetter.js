const express = require("express");
const { requireAuth } = require("../middlewares/requireAuth");
const { createCoverLetter, listCoverLetters } = require("../controllers/coverLetter");

const router = express.Router();

router.get("/", requireAuth, listCoverLetters);
router.post("/generate", requireAuth, createCoverLetter);

module.exports = router;

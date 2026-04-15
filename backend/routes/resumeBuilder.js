const express = require("express");
const { requireAuth } = require("../middlewares/requireAuth");
const { fetchResumeDraft, updateResumeDraft } = require("../controllers/resumeBuilder");

const router = express.Router();

router.get("/", requireAuth, fetchResumeDraft);
router.post("/", requireAuth, updateResumeDraft);
router.patch("/", requireAuth, updateResumeDraft);

module.exports = router;

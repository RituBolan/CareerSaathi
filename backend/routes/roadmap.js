const express = require("express");
const { requireAuth } = require("../middlewares/requireAuth");
const { createRoadmap, fetchRoadmap } = require("../controllers/roadmap");

const router = express.Router();

router.get("/", requireAuth, fetchRoadmap);
router.post("/generate", requireAuth, createRoadmap);

module.exports = router;

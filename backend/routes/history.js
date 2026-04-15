const express = require("express");
const { requireAuth } = require("../middlewares/requireAuth");
const { getHistory, getHistoryItem } = require("../controllers/history");

const router = express.Router();

router.get("/", requireAuth, getHistory);
router.get("/:id", requireAuth, getHistoryItem);

module.exports = router;

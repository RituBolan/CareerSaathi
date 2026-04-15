const ScanHistory = require("../models/scanHistory");

async function getHistory(req, res) {
  const history = await ScanHistory.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(history);
}

async function getHistoryItem(req, res) {
  const item = await ScanHistory.findOne({
    _id: req.params.id,
    userId: req.user._id,
  });

  if (!item) {
    return res.status(404).json({ message: "History item not found" });
  }

  res.json(item);
}

module.exports = { getHistory, getHistoryItem };

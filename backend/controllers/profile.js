const User = require("../models/user");
const { sanitizeUser } = require("../services/user");

async function getProfile(req, res) {
  const user = await User.findById(req.user._id);
  res.json(sanitizeUser(user));
}

async function updateProfile(req, res) {
  const allowed = ["name", "phone", "gender", "bio", "location", "targetRole", "skills"];
  const updates = {};

  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
  res.json(sanitizeUser(user));
}

module.exports = { getProfile, updateProfile };

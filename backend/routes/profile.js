const express = require("express");
const { requireAuth } = require("../middlewares/requireAuth");
const { getProfile, updateProfile } = require("../controllers/profile");

const router = express.Router();

router.get("/", requireAuth, getProfile);
router.patch("/", requireAuth, updateProfile);

module.exports = router;

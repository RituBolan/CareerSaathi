const express = require("express");
const {
  handleUserSignUp,
  handleUserSignIn,
  handleUserLogout,
} = require("../controllers/user");

const router = express.Router();

router.get("/me", (req, res) => {
  res.json({ user: req.user || null });
});

router.get("/logout", handleUserLogout);
router.post("/signup", handleUserSignUp);
router.post("/login", handleUserSignIn);

module.exports = router;

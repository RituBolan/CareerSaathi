function requireAuth(req, res, next) {
  if (!req.user?._id) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
}

module.exports = { requireAuth };

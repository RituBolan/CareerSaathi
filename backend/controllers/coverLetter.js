const { generateCoverLetter, getCoverLetters } = require("../services/coverLetter");

async function createCoverLetter(req, res) {
  try {
    const letter = await generateCoverLetter(req.user._id, req.body);
    res.status(201).json(letter);
  } catch (error) {
    res.status(400).json({ message: error.message || "Failed to generate cover letter" });
  }
}

async function listCoverLetters(req, res) {
  const letters = await getCoverLetters(req.user._id);
  res.json(letters);
}

module.exports = {
  createCoverLetter,
  listCoverLetters,
};

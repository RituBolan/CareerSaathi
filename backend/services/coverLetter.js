const CoverLetter = require("../models/coverLetter");
const { getResumeByUser } = require("./resume");
const { generateCoverLetterAI } = require("./ai");

async function generateCoverLetter(userId, payload) {
  const resume = await getResumeByUser(userId);
  if (!resume) {
    throw new Error("Upload a resume first");
  }

  const content = await generateCoverLetterAI({
    name: payload.name || "",
    companyName: payload.companyName || "",
    jobTitle: payload.jobTitle || "",
    jobDescription: payload.jobDescription || "",
    resumeText: resume.parsedText || "",
  });

  const letter = await CoverLetter.create({
    userId,
    candidateName: payload.name || "",
    companyName: payload.companyName || "",
    jobTitle: payload.jobTitle || "",
    jobDescription: payload.jobDescription || "",
    content,
  });

  return letter;
}

async function getCoverLetters(userId) {
  return CoverLetter.find({ userId }).sort({ createdAt: -1 });
}

module.exports = {
  generateCoverLetter,
  getCoverLetters,
};

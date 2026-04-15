const { fullAts } = require("../services/ats");
const { getResumeByUser } = require("../services/resume");
const ScanHistory = require("../models/scanHistory");

async function handleATSAnalysis(req, res) {
  const jobDescription = req.body?.jobDescription?.trim();
  if (!jobDescription) {
    return res.status(400).json({ message: "Job description is required" });
  }

  const resume = await getResumeByUser(req.user._id);
  if (!resume) {
    return res.status(404).json({ message: "Upload a resume first" });
  }

  const result = await fullAts(resume.parsedText, jobDescription);

  await ScanHistory.create({
    userId: req.user._id,
    resumeId: resume._id,
    jobDescription,
    score: result.score,
    matchedSkills: result.matchedSkills || [],
    missing: result.missing || [],
    verdict: result.verdict || "",
    nextSteps: result.nextSteps || [],
    aiSuggestions: result.aiSuggestions || "",
  });

  res.json(result);
}

module.exports = { handleATSAnalysis };

const { resumeUpload, getResumeByUser } = require("../services/resume");

async function handleUserResumeUpload(req, res) {
  if (!req.user?._id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const result = await resumeUpload(req.user._id, req.file);
  if (!result.success) {
    return res.status(400).json({ message: result.message });
  }

  res.status(201).json({ message: "Resume uploaded successfully", resume: result.resume });
}

async function getUserResume(req, res) {
  if (!req.user?._id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const resume = await getResumeByUser(req.user._id);
  res.json(resume);
}

async function getResumeAnalysis(req, res) {
  if (!req.user?._id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const resume = await getResumeByUser(req.user._id);
  if (!resume) {
    return res.status(404).json({ message: "Resume not found" });
  }

  res.json({
    skills: resume.skills || [],
    score: 70,
  });
}

module.exports = { handleUserResumeUpload, getUserResume, getResumeAnalysis };

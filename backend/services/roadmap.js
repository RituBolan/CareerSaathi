const Roadmap = require("../models/roadmap");
const User = require("../models/user");
const { extractSkillsAI, generateRoadmapAI } = require("./ai");
const { getResumeByUser } = require("./resume");

async function generateRoadmap(userId, payload) {
  const user = await User.findById(userId);
  const resume = await getResumeByUser(userId);

  if (!resume) {
    throw new Error("Upload a resume first");
  }

  const targetRole = (payload.targetRole || user?.targetRole || "").trim();
  const jobDescription = (payload.jobDescription || "").trim();

  if (!targetRole) {
    throw new Error("Target role is required");
  }

  const resumeSkills = resume.parsedText?.trim()
    ? await extractSkillsAI(resume.parsedText)
    : Array.isArray(resume.skills)
      ? resume.skills
      : [];

  const jdSkills = jobDescription ? await extractSkillsAI(jobDescription) : [];
  const resumeSkillKeys = new Set(
    (Array.isArray(resumeSkills) ? resumeSkills : []).map((skill) => String(skill).toLowerCase())
  );
  const missingSkills = jdSkills.filter(
    (skill) => !resumeSkillKeys.has(String(skill).toLowerCase())
  );

  const items = await generateRoadmapAI({
    targetRole,
    currentSkills: resumeSkills,
    jobDescription,
    missingSkills,
  });

  const roadmap = await Roadmap.findOneAndUpdate(
    { userId },
    {
      userId,
      targetRole,
      jobDescription,
      currentSkills: resumeSkills,
      missingSkills,
      items,
    },
    { upsert: true, new: true }
  );

  return roadmap;
}

async function getRoadmap(userId) {
  return Roadmap.findOne({ userId });
}

module.exports = {
  generateRoadmap,
  getRoadmap,
};

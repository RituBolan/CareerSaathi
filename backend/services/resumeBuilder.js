const ResumeDraft = require("../models/resumeDraft");

async function getResumeDraft(userId) {
  let draft = await ResumeDraft.findOne({ userId });

  if (!draft) {
    draft = await ResumeDraft.create({ userId });
  }

  return draft;
}

async function saveResumeDraft(userId, payload) {
  const draft = await ResumeDraft.findOneAndUpdate(
    { userId },
    {
      userId,
      fullName: payload.fullName || "",
      email: payload.email || "",
      phone: payload.phone || "",
      summary: payload.summary || "",
      experience: Array.isArray(payload.experience) ? payload.experience : [],
      education: Array.isArray(payload.education) ? payload.education : [],
      skills: Array.isArray(payload.skills) ? payload.skills : [],
    },
    { upsert: true, new: true }
  );

  return draft;
}

module.exports = {
  getResumeDraft,
  saveResumeDraft,
};

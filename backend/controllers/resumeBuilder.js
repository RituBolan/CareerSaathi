const { getResumeDraft, saveResumeDraft } = require("../services/resumeBuilder");

async function fetchResumeDraft(req, res) {
  const draft = await getResumeDraft(req.user._id);
  res.json(draft);
}

async function updateResumeDraft(req, res) {
  const draft = await saveResumeDraft(req.user._id, req.body);
  res.json(draft);
}

module.exports = {
  fetchResumeDraft,
  updateResumeDraft,
};

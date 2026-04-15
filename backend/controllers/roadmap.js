const { generateRoadmap, getRoadmap } = require("../services/roadmap");

async function createRoadmap(req, res) {
  try {
    const roadmap = await generateRoadmap(req.user._id, req.body);
    res.status(201).json(roadmap);
  } catch (error) {
    res.status(400).json({ message: error.message || "Failed to generate roadmap" });
  }
}

async function fetchRoadmap(req, res) {
  const roadmap = await getRoadmap(req.user._id);
  res.json(roadmap);
}

module.exports = {
  createRoadmap,
  fetchRoadmap,
};

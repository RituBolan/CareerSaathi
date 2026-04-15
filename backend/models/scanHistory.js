const mongoose = require("mongoose");

const scanHistorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    resumeId: { type: mongoose.Schema.Types.ObjectId, ref: "resume", required: true },
    jobDescription: { type: String, required: true },
    score: { type: Number, required: true },
    matchedSkills: { type: [String], default: [] },
    missing: { type: [String], default: [] },
    verdict: { type: String, default: "" },
    nextSteps: { type: [String], default: [] },
    aiSuggestions: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("scanHistory", scanHistorySchema);

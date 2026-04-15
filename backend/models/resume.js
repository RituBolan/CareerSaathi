const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    resumeURL: { type: String, required: true },
    parsedText: { type: String, default: "" },
    skills: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("resume", resumeSchema);

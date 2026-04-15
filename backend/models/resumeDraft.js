const mongoose = require("mongoose");

const resumeDraftSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      unique: true,
    },
    fullName: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    summary: { type: String, default: "" },
    experience: {
      type: [
        {
          company: { type: String, default: "" },
          role: { type: String, default: "" },
          duration: { type: String, default: "" },
          description: { type: String, default: "" },
        },
      ],
      default: [],
    },
    education: {
      type: [
        {
          institution: { type: String, default: "" },
          degree: { type: String, default: "" },
          year: { type: String, default: "" },
        },
      ],
      default: [],
    },
    skills: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const ResumeDraft= mongoose.model("ResumeDraft", resumeDraftSchema);

module.exports = ResumeDraft;

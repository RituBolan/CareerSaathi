const mongoose = require("mongoose");

const coverLetterSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    candidateName: {
      type: String,
      default: "",
    },
    companyName: {
      type: String,
      default: "",
    },
    jobTitle: {
      type: String,
      default: "",
    },
    jobDescription: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("coverLetter", coverLetterSchema);

const Resume = require("../models/resume");
const { uploadToCloudinary } = require("../utils/cloudinaryUpload");
const { extractTextFromPdf } = require("../utils/pdf");
const { extractSkillsAI } = require("./ai");

async function resumeUpload(userId, file) {
  try {
    if (!file?.buffer) {
      return { success: false, message: "Uploaded file is invalid" };
    }

    const parsedText = await extractTextFromPdf(file.buffer);
    if (!parsedText?.trim()) {
      return { success: false, message: "Could not extract text from the PDF" };
    }

    const skills = await extractSkillsAI(parsedText);
    const uploadResult = await uploadToCloudinary(file.buffer);

    const resume = await Resume.findOneAndUpdate(
      { userId },
      {
        userId,
        resumeURL: uploadResult.secure_url,
        parsedText,
        skills,
      },
      { upsert: true, new: true }
    );

    return { success: true, resume };
  } catch (err) {
    console.log("Upload error:", err);

    if (err?.code === "insufficient_quota") {
      return {
        success: false,
        message: "AI processing failed because the OpenAI quota is exhausted",
      };
    }

    if (err?.status === 401) {
      return {
        success: false,
        message: "AI processing failed because the OpenAI API key is invalid",
      };
    }

    return {
      success: false,
      message: err?.message || "Upload failed",
    };
  }
}

async function getResumeByUser(userId) {
  return Resume.findOne({ userId });
}

module.exports = { resumeUpload, getResumeByUser };

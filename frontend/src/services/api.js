import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export const getCurrentUser = () => API.get("/auth/me");
export const loginUser = (payload) => API.post("/auth/login", payload);
export const signupUser = (payload) => API.post("/auth/signup", payload);
export const logoutUser = () => API.get("/auth/logout");
export const getProfile = () => API.get("/profile");
export const updateProfile = (payload) => API.patch("/profile", payload);
export const uploadResume = (data) => API.post("/resume/upload", data);
export const getResume = () => API.get("/resume");
export const getResumeAnalysis = () => API.get("/resume/analysis");
export const analyzeATS = (jobDescription) =>
  API.post("/ats/analyze", { jobDescription });
export const getCoverLetters = () => API.get("/cover-letter");
export const generateCoverLetter = (payload) =>
  API.post("/cover-letter/generate", payload);
export const getRoadmap = () => API.get("/roadmap");
export const generateRoadmap = (payload) =>
  API.post("/roadmap/generate", payload);
export const getResumeDraft = () => API.get("/resume-builder");
export const saveResumeDraft = (payload) => API.patch("/resume-builder", payload);
export const getHistory = () => API.get("/history");
export const getHistoryItem = (id) => API.get(`/history/${id}`);

export default API;

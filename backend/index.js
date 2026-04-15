require("dotenv").config();
const cors = require("cors");

const mongoose = require("mongoose");
const express = require("express");
const cookieParser = require("cookie-parser");

const userRouter = require("./routes/user");
const profileRouter = require("./routes/profile");
const resumeRouter = require("./routes/resume");
const atsRouter = require("./routes/ats");
const historyRouter = require("./routes/history");
const coverLetterRouter = require("./routes/coverLetter");
const roadmapRouter = require("./routes/roadmap");
const resumeBuilderRouter = require("./routes/resumeBuilder");
const { checkForAuthenticationCookie } = require("./middlewares/authentication");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;

mongoose
  .connect(MONGO_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection failed", err));

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.use("/api/auth", userRouter);
app.use("/api/profile", profileRouter);
app.use("/api/cover-letter", coverLetterRouter);
app.use("/api/roadmap", roadmapRouter);
app.use("/api/resume-builder", resumeBuilderRouter);
app.use("/api/resume", resumeRouter);
app.use("/api/ats", atsRouter);
app.use("/api/history", historyRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server started at http://localhost:${PORT}`);
});

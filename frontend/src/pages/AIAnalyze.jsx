import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import ProgressCircle from "../components/ui/ProgressCircle";
import { analyzeATS, getResume, uploadResume } from "../services/api";

export default function AIAnalyze() {
  const [resume, setResume] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState("");

  useEffect(() => {
    const loadResume = async () => {
      try {
        const { data } = await getResume();
        setResume(data || null);
      } catch (err) {
        setResume(null);
        setUploadError(err.response?.data?.message || "Failed to load your latest resume.");
      } finally {
        setResumeLoading(false);
      }
    };

    loadResume();
  }, []);

  const hasUploadedResume = Boolean(resume);
  const hasPendingUpload = Boolean(selectedFile);
  const formattedResumeDate = resume?.updatedAt
    ? new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(resume.updatedAt))
    : "";

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setFileInputKey((current) => current + 1);
    setUploadError("");
    setUploadMessage("");
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    setUploadError("");
    setUploadMessage("");
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError("Choose a resume PDF first.");
      return;
    }

    try {
      setUploadLoading(true);
      setUploadError("");
      setUploadMessage("");

      const formData = new FormData();
      formData.append("resume", selectedFile);

      const { data } = await uploadResume(formData);
      setResume(data.resume || null);
      setResult(null);
      setAnalysisError("");
      setUploadMessage("Resume uploaded successfully. Your latest uploaded resume will be used for AI Analyze.");
      setSelectedFile(null);
      setFileInputKey((current) => current + 1);
    } catch (err) {
      setUploadError(err.response?.data?.message || "Resume upload failed.");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleAnalyze = async () => {
    if (!hasUploadedResume) {
      setAnalysisError("Upload a resume first. Once you have uploaded one, your latest resume will be used automatically for AI Analyze.");
      return;
    }

    if (hasPendingUpload) {
      setAnalysisError("Upload the selected resume first, or use your latest uploaded resume before running AI Analyze.");
      return;
    }

    if (!jobDescription.trim()) {
      setAnalysisError("Please type or paste the job description first.");
      return;
    }

    try {
      setLoading(true);
      setAnalysisError("");
      const { data } = await analyzeATS(jobDescription);
      setResult(data);
    } catch (err) {
      setResult(null);
      setAnalysisError(err.response?.data?.message || "ATS analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-6">
        <Card title="1. Resume Upload">
          <div className="space-y-5">
            <div
              className={`rounded-2xl border p-5 ${
                hasUploadedResume
                  ? "border-emerald-400/20 bg-emerald-500/10"
                  : "border-amber-400/20 bg-amber-500/10"
              }`}
            >
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
                {resumeLoading
                  ? "Checking resume status"
                  : hasUploadedResume
                    ? "Latest resume ready"
                    : "Resume required"}
              </p>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                {resumeLoading
                  ? "Loading your latest uploaded resume."
                  : hasUploadedResume
                    ? "If you do not upload a new resume now, AI Analyze will use your latest uploaded resume automatically."
                    : "You need to upload a resume before AI Analyze can check your skill match against a job description."}
              </p>
              {formattedResumeDate ? (
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-400">
                  Last uploaded: {formattedResumeDate}
                </p>
              ) : null}
              {resume?.resumeURL ? (
                <a
                  href={resume.resumeURL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex text-sm font-medium text-blue-300 transition hover:text-blue-200"
                >
                  View latest uploaded resume
                </a>
              ) : null}
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <label
                htmlFor="resume-upload"
                className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300"
              >
                Upload a new resume (PDF)
              </label>
              <input
                key={fileInputKey}
                id="resume-upload"
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="mt-4 block w-full rounded-2xl border border-dashed border-white/15 bg-slate-950/40 px-4 py-4 text-sm text-slate-200 file:mr-4 file:rounded-xl file:border-0 file:bg-blue-500/20 file:px-4 file:py-2 file:font-semibold file:text-blue-200 hover:file:bg-blue-500/30"
              />
              <p className="mt-3 text-sm text-slate-400">
                {selectedFile
                  ? `Selected file: ${selectedFile.name}`
                  : "Upload only if you want to replace the latest resume saved for AI Analyze."}
              </p>

              <div className="mt-5 flex flex-wrap gap-3">
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || uploadLoading || resumeLoading}
                >
                  {uploadLoading
                    ? "Uploading..."
                    : hasUploadedResume
                      ? "Upload New Resume"
                      : "Upload Resume"}
                </Button>

                {selectedFile ? (
                  <Button
                    variant="secondary"
                    onClick={clearSelectedFile}
                    disabled={uploadLoading}
                  >
                    Use Latest Uploaded Resume
                  </Button>
                ) : null}
              </div>

              {uploadMessage ? (
                <p className="mt-4 text-sm text-emerald-400">{uploadMessage}</p>
              ) : null}
              {uploadError ? (
                <p className="mt-4 text-sm text-rose-400">{uploadError}</p>
              ) : null}
            </div>
          </div>
        </Card>

        <Card title="2. Type Or Paste Job Description">
          <textarea
            rows="10"
            value={jobDescription}
            onChange={(e) => {
              setJobDescription(e.target.value);
              if (analysisError) {
                setAnalysisError("");
              }
            }}
            placeholder="Type or paste the job description here."
            className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-slate-200 outline-none placeholder:text-slate-500"
          />
          <p className="mt-4 text-sm leading-6 text-slate-400">
            Paste the JD after your resume is ready. AI Analyze will compare the saved resume against this job description.
          </p>
        </Card>

        <Card title="3. AI Analyze">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
              Ready check
            </p>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <p>
                Resume:{" "}
                <span className={hasUploadedResume ? "text-emerald-300" : "text-amber-300"}>
                  {hasUploadedResume ? "Latest uploaded resume will be used." : "Upload required before analysis."}
                </span>
              </p>
              <p>
                Job description:{" "}
                <span className={jobDescription.trim() ? "text-emerald-300" : "text-amber-300"}>
                  {jobDescription.trim() ? "Added and ready for analysis." : "Type or paste the JD first."}
                </span>
              </p>
              {hasPendingUpload ? (
                <p className="text-amber-300">
                  A new resume is selected but not uploaded yet. Upload it first, or use your latest uploaded resume.
                </p>
              ) : null}
            </div>

            <div className="mt-5">
              <Button
                onClick={handleAnalyze}
                disabled={
                  loading ||
                  uploadLoading ||
                  resumeLoading ||
                  !hasUploadedResume ||
                  !jobDescription.trim() ||
                  hasPendingUpload
                }
                className="w-full"
              >
                {loading ? "Analyzing..." : "Analyze Skill Match"}
              </Button>
            </div>

            {analysisError ? (
              <p className="mt-4 text-sm text-rose-400">{analysisError}</p>
            ) : null}
          </div>
        </Card>
      </div>

      <Card title="Skill Match Result">
        {result ? (
          <div className="space-y-5">
            <ProgressCircle score={result.score || 0} />

            <div>
              <h3 className="mb-2 text-sm uppercase tracking-[0.2em] text-slate-500">
                Matched Skills
              </h3>
              {result.matchedSkills?.length ? (
                <ul className="list-disc space-y-2 pl-5 text-slate-300">
                  {result.matchedSkills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-300">No matched skills returned.</p>
              )}
            </div>

            <div>
              <h3 className="mb-2 text-sm uppercase tracking-[0.2em] text-slate-500">
                Missing Skills
              </h3>
              {result.missing?.length ? (
                <ul className="list-disc space-y-2 pl-5 text-slate-300">
                  {result.missing.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-300">No missing skills returned.</p>
              )}
            </div>

            <div>
              <h3 className="mb-2 text-sm uppercase tracking-[0.2em] text-slate-500">
                Verdict
              </h3>
              <p className="whitespace-pre-wrap text-slate-300">
                {result.verdict || "No verdict returned."}
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-sm uppercase tracking-[0.2em] text-slate-500">
                Next Steps
              </h3>
              {result.nextSteps?.length ? (
                <ul className="list-disc space-y-2 pl-5 text-slate-300">
                  {result.nextSteps.map((step, index) => (
                    <li key={`${index}-${step}`}>{step}</li>
                  ))}
                </ul>
              ) : result.aiSuggestions ? (
                <p className="whitespace-pre-wrap text-slate-300">{result.aiSuggestions}</p>
              ) : (
                <p className="text-slate-300">No next steps returned.</p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-slate-400">
            Upload or confirm your latest resume, paste the job description, and run AI Analyze to see the skill match result here.
          </p>
        )}
      </Card>
    </div>
  );
}

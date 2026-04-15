import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { generateRoadmap, getResume, getRoadmap, uploadResume } from "../services/api";

export default function Roadmap() {
  const [resume, setResume] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPage = async () => {
      try {
        const { data } = await getRoadmap();
        setRoadmap(data);
        if (data?.targetRole) {
          setTargetRole(data.targetRole);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load roadmap.");
      } finally {
        setLoading(false);
      }

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

    loadPage();
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
      setSelectedFile(null);
      setFileInputKey((current) => current + 1);
      setError("");
      setUploadMessage("Resume uploaded successfully. Your latest uploaded resume will be used for roadmap generation.");
    } catch (err) {
      setUploadError(err.response?.data?.message || "Resume upload failed.");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleGenerate = async (event) => {
    event.preventDefault();

    if (!hasUploadedResume) {
      setError("Upload a resume first. Once you have uploaded one, your latest resume will be used automatically for the roadmap.");
      return;
    }

    if (hasPendingUpload) {
      setError("Upload the selected resume first, or use your latest uploaded resume before generating the roadmap.");
      return;
    }

    if (!targetRole.trim()) {
      setError("Please enter the target role first.");
      return;
    }

    setGenerating(true);
    setError("");

    try {
      const { data } = await generateRoadmap({
        targetRole,
      });
      setRoadmap(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate roadmap.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
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
                    ? "If you do not upload a new resume now, the latest uploaded resume will be used automatically for roadmap generation."
                    : "You need to upload a resume before generating a roadmap."}
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
                htmlFor="roadmap-resume-upload"
                className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300"
              >
                Upload a new resume (PDF)
              </label>
              <input
                key={fileInputKey}
                id="roadmap-resume-upload"
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="mt-4 block w-full rounded-2xl border border-dashed border-white/15 bg-slate-950/40 px-4 py-4 text-sm text-slate-200 file:mr-4 file:rounded-xl file:border-0 file:bg-blue-500/20 file:px-4 file:py-2 file:font-semibold file:text-blue-200 hover:file:bg-blue-500/30"
              />
              <p className="mt-3 text-sm text-slate-400">
                {selectedFile
                  ? `Selected file: ${selectedFile.name}`
                  : "Upload only if you want to replace the latest resume used for roadmap generation."}
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

        <Card title="2. Enter Target Role">
          <input
            value={targetRole}
            onChange={(e) => {
              setTargetRole(e.target.value);
              if (error) {
                setError("");
              }
            }}
            placeholder="Target role, e.g. Full Stack Developer"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500"
          />
          <p className="mt-4 text-sm leading-6 text-slate-400">
            Enter the role you want. There is no need to type your current skills here because the roadmap will use your latest uploaded resume as the starting point.
          </p>
        </Card>

        <Card title="3. Generate Roadmap">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
              Ready check
            </p>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <p>
                Resume:{" "}
                <span className={hasUploadedResume ? "text-emerald-300" : "text-amber-300"}>
                  {hasUploadedResume ? "Latest uploaded resume will be used." : "Upload required before generation."}
                </span>
              </p>
              <p>
                Target role:{" "}
                <span className={targetRole.trim() ? "text-emerald-300" : "text-amber-300"}>
                  {targetRole.trim() ? "Role added and ready." : "Enter the role first."}
                </span>
              </p>
              {hasPendingUpload ? (
                <p className="text-amber-300">
                  A new resume is selected but not uploaded yet. Upload it first, or use your latest uploaded resume.
                </p>
              ) : null}
            </div>

            {error ? <p className="mt-4 text-sm text-rose-400">{error}</p> : null}

            <div className="mt-5">
              <Button
                onClick={handleGenerate}
                disabled={
                  generating ||
                  loading ||
                  uploadLoading ||
                  resumeLoading ||
                  !hasUploadedResume ||
                  !targetRole.trim() ||
                  hasPendingUpload
                }
                className="w-full"
              >
                {generating ? "Generating..." : "Generate Roadmap"}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Roadmap">
        {loading ? (
          <p className="text-slate-400">Loading roadmap...</p>
        ) : roadmap?.items?.length ? (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                Target Role
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {roadmap.targetRole || "Not specified"}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Generated from your latest uploaded resume.
              </p>
            </div>

            <ol className="space-y-4">
              {roadmap.items.map((item, index) => (
                <li
                  key={`${item}-${index}`}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-slate-200"
                >
                  <span className="mr-3 text-blue-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <p className="text-slate-400">
            Upload or confirm your latest resume, enter the target role, and generate a roadmap here.
          </p>
        )}
      </Card>
    </div>
  );
}

import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { generateCoverLetter, getCoverLetters, getResume, uploadResume } from "../services/api";
import { useApp } from "../context/AppContext";

export default function AICoverLetter() {
  const { user } = useApp();
  const [resume, setResume] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [form, setForm] = useState({
    name: "",
    companyName: "",
    jobTitle: "",
    jobDescription: "",
  });
  const [letters, setLetters] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [activePreview, setActivePreview] = useState("cover-letter");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPage = async () => {
      try {
        const { data } = await getCoverLetters();
        setLetters(data);
        setSelectedLetter(data[0] || null);
        setActivePreview("cover-letter");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load cover letters.");
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

      setForm((current) => ({
        ...current,
        name: user?.name || "",
      }));
    };

    loadPage();
  }, [user?.name]);

  const hasUploadedResume = Boolean(resume);
  const hasPendingUpload = Boolean(selectedFile);
  const formattedResumeDate = resume?.updatedAt
    ? new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(resume.updatedAt))
    : "";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

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
      setUploadMessage("Resume uploaded successfully. Your latest uploaded resume will be used for cover letter generation.");
    } catch (err) {
      setUploadError(err.response?.data?.message || "Resume upload failed.");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleGenerate = async (event) => {
    event.preventDefault();

    if (!hasUploadedResume) {
      setError("Upload a resume first. Once you have uploaded one, your latest resume will be used automatically for the cover letter.");
      return;
    }

    if (hasPendingUpload) {
      setError("Upload the selected resume first, or use your latest uploaded resume before generating a cover letter.");
      return;
    }

    if (!form.name.trim()) {
      setError("Please confirm your name first.");
      return;
    }

    if (!form.companyName.trim()) {
      setError("Please enter the company name.");
      return;
    }

    if (!form.jobTitle.trim()) {
      setError("Please enter the job title.");
      return;
    }

    if (!form.jobDescription.trim()) {
      setError("Please type or paste the job description first.");
      return;
    }

    setGenerating(true);
    setError("");

    try {
      const { data } = await generateCoverLetter(form);
      setLetters((current) => [data, ...current]);
      setSelectedLetter(data);
      setActivePreview("cover-letter");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate cover letter.");
    } finally {
      setGenerating(false);
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
                    ? "If you do not upload a new resume now, the latest uploaded resume will be used automatically for the cover letter."
                    : "You need to upload a resume before generating an AI cover letter."}
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
                htmlFor="cover-letter-resume-upload"
                className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-300"
              >
                Upload a new resume (PDF)
              </label>
              <input
                key={fileInputKey}
                id="cover-letter-resume-upload"
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
                className="mt-4 block w-full rounded-2xl border border-dashed border-white/15 bg-slate-950/40 px-4 py-4 text-sm text-slate-200 file:mr-4 file:rounded-xl file:border-0 file:bg-blue-500/20 file:px-4 file:py-2 file:font-semibold file:text-blue-200 hover:file:bg-blue-500/30"
              />
              <p className="mt-3 text-sm text-slate-400">
                {selectedFile
                  ? `Selected file: ${selectedFile.name}`
                  : "Upload only if you want to replace the latest resume used for cover letter generation."}
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

        <Card title="2. Add Role Details And Job Description">
          <form className="space-y-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500"
            />
            <input
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
              placeholder="Company name"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500"
            />
            <input
              name="jobTitle"
              value={form.jobTitle}
              onChange={handleChange}
              placeholder="Job title"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500"
            />
            <textarea
              name="jobDescription"
              rows="9"
              value={form.jobDescription}
              onChange={handleChange}
              placeholder="Type or paste the job description here."
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500"
            />
            <p className="text-sm leading-6 text-slate-400">
              Add the role details and JD after your resume is ready. The latest uploaded resume will be used to tailor the cover letter.
            </p>
          </form>
        </Card>

        <Card title="3. Generate Cover Letter">
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
                Role details:{" "}
                <span
                  className={
                    form.companyName.trim() && form.jobTitle.trim() && form.name.trim()
                      ? "text-emerald-300"
                      : "text-amber-300"
                  }
                >
                  {form.companyName.trim() && form.jobTitle.trim() && form.name.trim()
                    ? "Candidate, company, and role details are ready."
                    : "Add your name, company, and job title first."}
                </span>
              </p>
              <p>
                Job description:{" "}
                <span className={form.jobDescription.trim() ? "text-emerald-300" : "text-amber-300"}>
                  {form.jobDescription.trim() ? "Added and ready for generation." : "Type or paste the JD first."}
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
                  !form.name.trim() ||
                  !form.companyName.trim() ||
                  !form.jobTitle.trim() ||
                  !form.jobDescription.trim() ||
                  hasPendingUpload
                }
                className="w-full"
              >
                {generating ? "Generating..." : "Generate Cover Letter"}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Generated Letters">
        {loading ? (
          <p className="text-slate-400">Loading cover letters...</p>
        ) : letters.length ? (
          <div className="space-y-5">
            <div className="max-h-[260px] space-y-3 overflow-y-auto pr-2">
              {letters.map((letter) => (
                <button
                  key={letter._id}
                  type="button"
                  onClick={() => {
                    setSelectedLetter(letter);
                    setActivePreview("cover-letter");
                  }}
                  className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                    selectedLetter?._id === letter._id
                      ? "border-blue-400/40 bg-blue-500/10 text-white"
                      : "border-white/10 bg-white/5 text-slate-300"
                  }`}
                >
                  <p className="font-medium">{letter.jobTitle || "Untitled role"}</p>
                  <p className="mt-1 text-sm text-slate-400">{letter.companyName || "Unknown company"}</p>
                </button>
              ))}
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="headline-font text-xl font-semibold text-white">
                    {selectedLetter?.jobTitle || "Select a cover letter"}
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    {selectedLetter?.companyName || "Generated content will appear here"}
                  </p>
                </div>

                <div className="inline-flex rounded-2xl border border-white/10 bg-slate-950/50 p-1">
                  <button
                    type="button"
                    onClick={() => setActivePreview("details")}
                    className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                      activePreview === "details"
                        ? "bg-white text-slate-900"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    Uploaded Details
                  </button>
                  <button
                    type="button"
                    onClick={() => setActivePreview("cover-letter")}
                    className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                      activePreview === "cover-letter"
                        ? "bg-white text-slate-900"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    Cover Letter
                  </button>
                </div>
              </div>

              {activePreview === "details" ? (
                <div className="mt-5 space-y-5 text-slate-300">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                        Candidate
                      </p>
                      <p className="mt-2 text-base text-white">
                        {selectedLetter?.candidateName || form.name || user?.name || "Not provided"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                        Company
                      </p>
                      <p className="mt-2 text-base text-white">
                        {selectedLetter?.companyName || "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                      Job Title
                    </p>
                    <p className="mt-2 text-base text-white">
                      {selectedLetter?.jobTitle || "Not provided"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                      Job Description
                    </p>
                    <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-300">
                      {selectedLetter?.jobDescription || "No job description stored for this letter."}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                      Resume Source
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {resume
                        ? `Latest uploaded resume was used${formattedResumeDate ? ` (${formattedResumeDate})` : ""}.`
                        : "Resume information is not available in this view."}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="mt-5 whitespace-pre-wrap leading-7 text-slate-300">
                  {selectedLetter?.content || "Generate a cover letter to see real backend content here."}
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-slate-400">No cover letters yet. Use the steps on the left to generate your first one.</p>
        )}
      </Card>
    </div>
  );
}

import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import ProgressCircle from "../components/ui/ProgressCircle";
import TaskList from "../components/ui/TaskList";
import { getResume, getResumeAnalysis } from "../services/api";
import { useApp } from "../context/AppContext";

export default function Dashboard() {
  const { user } = useApp();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const resumeResponse = await getResume();
        setResume(resumeResponse.data);

        if (resumeResponse.data) {
          const analysisResponse = await getResumeAnalysis();
          setAnalysis(analysisResponse.data);
        }
      } catch (error) {
        setResume(null);
        setAnalysis(null);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-10 md:gap-12">
      <section className="section-card dashboard-hero rounded-[32px] px-8 pt-12 pb-20 md:px-12 md:pt-14 md:pb-24 lg:px-16 lg:pt-16 lg:pb-28">
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <span className="eyebrow">Career growth system for serious builders</span>

          <h1 className="headline-font mt-10 text-5xl font-bold leading-[0.98] tracking-tight text-white md:text-7xl">
            Build a <span className="text-gradient">job-winning profile</span>
            <br />
            with smarter career tools
          </h1>

          <p className="mx-auto mt-8 max-w-4xl text-base leading-7 text-slate-400 md:text-xl md:leading-9">
            Analyze resumes, map next-step skills, and generate stronger applications from one polished workspace.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 px-2 text-sm font-medium text-slate-300 md:text-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-400" />
              ATS-ready analysis
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-400" />
              AI-assisted writing
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 size={18} className="text-emerald-400" />
              Clear growth roadmap
            </div>
          </div>

          <div className="hero-actions mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button onClick={() => navigate("/ai-analyze")}>Start Resume Review</Button>
            <Button variant="secondary" onClick={() => navigate("/roadmap")}>Explore Roadmap</Button>
          </div>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="card min-h-[320px]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-slate-500">
                Profile strength
              </p>
              <h2 className="headline-font mt-2 text-2xl font-semibold text-white">
                {user?.name ? `${user.name}'s Score` : "Readiness Score"}
              </h2>
            </div>
            <span className="inline-flex items-center justify-center whitespace-nowrap rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-center text-xs font-semibold uppercase leading-none tracking-[0.18em] text-blue-300">
              {loading ? "Loading" : resume ? "Resume Found" : "No Resume"}
            </span>
          </div>
          <ProgressCircle score={analysis?.score || 0} />
          <p className="mt-4 text-center text-slate-400">
            {loading
              ? "Loading backend data..."
              : analysis
                ? `Skills detected: ${analysis.skills?.join(", ") || "None"}`
                : "Upload a resume to populate this card from the backend."}
          </p>
        </div>

        <div className="card min-h-[320px]">
          <div className="mb-5">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">
              Execution
            </p>
            <h2 className="headline-font mt-2 text-2xl font-semibold text-white">
              Priority Tasks
            </h2>
          </div>
          {loading ? (
            <p className="text-slate-400">Loading task status...</p>
          ) : (
            <TaskList
              items={[
                { text: "Upload Resume", done: Boolean(resume) },
                { text: "Extract Skills", done: Boolean(analysis?.skills?.length) },
                { text: "Run ATS Analysis", done: Boolean(analysis?.score) },
              ]}
            />
          )}
        </div>
      </section>
    </div>
  );
}

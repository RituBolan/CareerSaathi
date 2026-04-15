import { useEffect, useState } from "react";
import Card from "../components/ui/Card";
import { getHistory, getHistoryItem } from "../services/api";

export default function ScanHistory() {
  const [history, setHistory] = useState([]);
  const [selectedScan, setSelectedScan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState("");

  const formatScanTimestamp = (value) => {
    if (!value) {
      return "Unknown scan time";
    }

    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  };

  const formatScanDate = (value) => {
    if (!value) {
      return "Unknown date";
    }

    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
    }).format(new Date(value));
  };

  const formatScanTime = (value) => {
    if (!value) {
      return "Unknown time";
    }

    return new Intl.DateTimeFormat(undefined, {
      timeStyle: "short",
    }).format(new Date(value));
  };

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const { data } = await getHistory();
        setHistory(data);
        if (data.length) {
          setSelectedScan(data[0]);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load scan history.");
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const handleSelect = async (id) => {
    try {
      setDetailLoading(true);
      const { data } = await getHistoryItem(id);
      setSelectedScan(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load scan details.");
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[380px_minmax(0,1fr)]">
      <Card title="Previous Scans">
        {loading ? (
          <p className="text-slate-400">Loading scan history...</p>
        ) : history.length ? (
          <div>
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                  Recent ATS Runs
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Click a scan to open the full result on the right.
                </p>
              </div>
              <span className="inline-flex min-w-[88px] items-center justify-center rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
                {history.length} Scans
              </span>
            </div>

            <div className="max-h-[620px] space-y-4 overflow-y-auto pr-2">
              {history.map((item) => {
                const isSelected = selectedScan?._id === item._id;

                return (
                  <button
                    key={item._id}
                    type="button"
                    onClick={() => handleSelect(item._id)}
                    className={`group w-full rounded-[28px] border px-5 py-5 text-left transition duration-200 ${
                      isSelected
                        ? "border-blue-400/40 bg-[linear-gradient(180deg,rgba(22,48,93,0.9),rgba(10,19,40,0.92))] text-white shadow-[0_18px_40px_rgba(20,54,120,0.22)]"
                        : "border-white/10 bg-white/[0.04] text-slate-300 hover:-translate-y-0.5 hover:border-white/15 hover:bg-white/[0.07]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
                          Scan Entry
                        </p>
                        <p className="mt-2 text-lg font-semibold text-white">
                          Match Score
                        </p>
                      </div>

                      <span
                        className={`inline-flex min-h-[54px] min-w-[72px] items-center justify-center rounded-2xl border px-3 text-lg font-semibold ${
                          isSelected
                            ? "border-blue-300/30 bg-blue-400/10 text-blue-100"
                            : "border-white/10 bg-slate-950/50 text-white"
                        }`}
                      >
                        {item.score}%
                      </span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium tracking-[0.04em] text-slate-300">
                        {formatScanDate(item.createdAt)}
                      </span>
                      <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium tracking-[0.04em] text-slate-300">
                        {formatScanTime(item.createdAt)}
                      </span>
                    </div>

                    <p className="mt-4 text-sm text-slate-400 transition group-hover:text-slate-300">
                      {isSelected ? "Viewing this scan" : "Open scan details"}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <p className="text-slate-400">No ATS scans saved yet.</p>
        )}
      </Card>

      <Card title="Scan Details">
        {error ? <p className="mb-4 text-sm text-rose-400">{error}</p> : null}
        {detailLoading ? (
          <p className="text-slate-400">Loading scan details...</p>
        ) : selectedScan ? (
          <div className="space-y-5 text-slate-300">
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4">
              <span className="inline-flex rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-200">
                Score: {selectedScan.score}%
              </span>
              <span className="text-sm text-slate-400">
                {formatScanTimestamp(selectedScan.createdAt)}
              </span>
            </div>
            <div>
              <h3 className="mb-2 text-sm uppercase tracking-[0.2em] text-slate-500">Matched Skills</h3>
              {selectedScan.matchedSkills?.length ? (
                <ul className="list-disc space-y-2 pl-5">
                  {selectedScan.matchedSkills.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              ) : (
                <p>No matched skills stored.</p>
              )}
            </div>
            <div>
              <h3 className="mb-2 text-sm uppercase tracking-[0.2em] text-slate-500">Missing Skills</h3>
              {selectedScan.missing?.length ? (
                <ul className="list-disc space-y-2 pl-5">
                  {selectedScan.missing.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              ) : (
                <p>No missing skills stored.</p>
              )}
            </div>
            <div>
              <h3 className="mb-2 text-sm uppercase tracking-[0.2em] text-slate-500">Verdict</h3>
              <p className="whitespace-pre-wrap">{selectedScan.verdict || "No verdict stored."}</p>
            </div>
            <div>
              <h3 className="mb-2 text-sm uppercase tracking-[0.2em] text-slate-500">Next Steps</h3>
              {selectedScan.nextSteps?.length ? (
                <ul className="list-disc space-y-2 pl-5">
                  {selectedScan.nextSteps.map((step, index) => (
                    <li key={`${index}-${step}`}>{step}</li>
                  ))}
                </ul>
              ) : selectedScan.aiSuggestions ? (
                <p className="whitespace-pre-wrap">{selectedScan.aiSuggestions}</p>
              ) : (
                <p>No next steps stored.</p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-slate-400">Select a scan to view its backend data.</p>
        )}
      </Card>
    </div>
  );
}

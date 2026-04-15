import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { getResumeDraft, saveResumeDraft } from "../services/api";

const emptyExperience = { company: "", role: "", duration: "", description: "" };
const emptyEducation = { institution: "", degree: "", year: "" };

export default function ResumeBuilder() {
  const [draft, setDraft] = useState({
    fullName: "",
    email: "",
    phone: "",
    summary: "",
    skills: "",
    experience: [{ ...emptyExperience }],
    education: [{ ...emptyEducation }],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDraft = async () => {
      try {
        const { data } = await getResumeDraft();
        setDraft({
          fullName: data.fullName || "",
          email: data.email || "",
          phone: data.phone || "",
          summary: data.summary || "",
          skills: Array.isArray(data.skills) ? data.skills.join(", ") : "",
          experience: data.experience?.length ? data.experience : [{ ...emptyExperience }],
          education: data.education?.length ? data.education : [{ ...emptyEducation }],
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load resume draft.");
      } finally {
        setLoading(false);
      }
    };

    loadDraft();
  }, []);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setDraft((current) => ({ ...current, [name]: value }));
  };

  const handleArrayChange = (section, index, key, value) => {
    setDraft((current) => ({
      ...current,
      [section]: current[section].map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item
      ),
    }));
  };

  const addItem = (section, template) => {
    setDraft((current) => ({
      ...current,
      [section]: [...current[section], { ...template }],
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      await saveResumeDraft({
        ...draft,
        skills: draft.skills.split(",").map((skill) => skill.trim()).filter(Boolean),
      });
      setMessage("Resume draft saved successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save resume draft.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Card title="Resume Builder"><p className="text-slate-400">Loading resume draft...</p></Card>;
  }

  return (
    <Card title="Resume Builder">
      <form onSubmit={handleSave} className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2">
          <input name="fullName" value={draft.fullName} onChange={handleFieldChange} placeholder="Full name" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500" />
          <input name="email" value={draft.email} onChange={handleFieldChange} placeholder="Email" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500" />
          <input name="phone" value={draft.phone} onChange={handleFieldChange} placeholder="Phone" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500" />
          <input name="skills" value={draft.skills} onChange={handleFieldChange} placeholder="Skills, comma separated" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500" />
        </div>

        <textarea name="summary" rows="5" value={draft.summary} onChange={handleFieldChange} placeholder="Professional summary" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500" />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="headline-font text-xl font-semibold text-white">Experience</h3>
            <Button type="button" variant="secondary" onClick={() => addItem("experience", emptyExperience)}>Add Experience</Button>
          </div>
          {draft.experience.map((item, index) => (
            <div key={`experience-${index}`} className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 md:grid-cols-2">
              <input value={item.company} onChange={(e) => handleArrayChange("experience", index, "company", e.target.value)} placeholder="Company" className="w-full rounded-2xl border border-white/10 bg-[#0b1120] px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500" />
              <input value={item.role} onChange={(e) => handleArrayChange("experience", index, "role", e.target.value)} placeholder="Role" className="w-full rounded-2xl border border-white/10 bg-[#0b1120] px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500" />
              <input value={item.duration} onChange={(e) => handleArrayChange("experience", index, "duration", e.target.value)} placeholder="Duration" className="w-full rounded-2xl border border-white/10 bg-[#0b1120] px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 md:col-span-2" />
              <textarea value={item.description} onChange={(e) => handleArrayChange("experience", index, "description", e.target.value)} rows="4" placeholder="Description" className="w-full rounded-2xl border border-white/10 bg-[#0b1120] px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 md:col-span-2" />
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="headline-font text-xl font-semibold text-white">Education</h3>
            <Button type="button" variant="secondary" onClick={() => addItem("education", emptyEducation)}>Add Education</Button>
          </div>
          {draft.education.map((item, index) => (
            <div key={`education-${index}`} className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 md:grid-cols-3">
              <input value={item.institution} onChange={(e) => handleArrayChange("education", index, "institution", e.target.value)} placeholder="Institution" className="w-full rounded-2xl border border-white/10 bg-[#0b1120] px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500" />
              <input value={item.degree} onChange={(e) => handleArrayChange("education", index, "degree", e.target.value)} placeholder="Degree" className="w-full rounded-2xl border border-white/10 bg-[#0b1120] px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500" />
              <input value={item.year} onChange={(e) => handleArrayChange("education", index, "year", e.target.value)} placeholder="Year" className="w-full rounded-2xl border border-white/10 bg-[#0b1120] px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500" />
            </div>
          ))}
        </div>

        {error ? <p className="text-sm text-rose-400">{error}</p> : null}
        {message ? <p className="text-sm text-emerald-400">{message}</p> : null}

        <Button type="submit" disabled={saving} className={saving ? "opacity-70" : ""}>
          {saving ? "Saving..." : "Save Resume Draft"}
        </Button>
      </form>
    </Card>
  );
}

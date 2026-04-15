import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import { useApp } from "../context/AppContext";
import { getProfile, updateProfile } from "../services/api";

export default function Profile() {
  const { userLoading, refreshUser } = useApp();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    bio: "",
    location: "",
    targetRole: "",
    skills: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await getProfile();
        setForm({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          gender: data.gender || "",
          bio: data.bio || "",
          location: data.location || "",
          targetRole: data.targetRole || "",
          skills: Array.isArray(data.skills) ? data.skills.join(", ") : "",
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      await updateProfile({
        name: form.name,
        phone: form.phone,
        gender: form.gender,
        bio: form.bio,
        location: form.location,
        targetRole: form.targetRole,
        skills: form.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
      });
      await refreshUser();
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (userLoading || loading) {
    return <Card title="User Profile"><p className="text-slate-400">Loading profile...</p></Card>;
  }

  return (
    <Card title="User Profile">
      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm text-slate-400">Name</span>
          <input name="name" value={form.name} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none" />
        </label>

        <label className="space-y-2">
          <span className="text-sm text-slate-400">Email</span>
          <input name="email" value={form.email} readOnly className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-500 outline-none" />
        </label>

        <label className="space-y-2">
          <span className="text-sm text-slate-400">Phone</span>
          <input name="phone" value={form.phone} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none" />
        </label>

        <label className="space-y-2">
          <span className="text-sm text-slate-400">Gender</span>
          <input name="gender" value={form.gender} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none" />
        </label>

        <label className="space-y-2">
          <span className="text-sm text-slate-400">Location</span>
          <input name="location" value={form.location} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none" />
        </label>

        <label className="space-y-2">
          <span className="text-sm text-slate-400">Target Role</span>
          <input name="targetRole" value={form.targetRole} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none" />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm text-slate-400">Skills</span>
          <input name="skills" value={form.skills} onChange={handleChange} placeholder="React, Node.js, MongoDB" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500" />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm text-slate-400">Bio</span>
          <textarea name="bio" rows="5" value={form.bio} onChange={handleChange} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none" />
        </label>

        {error ? <p className="md:col-span-2 text-sm text-rose-400">{error}</p> : null}
        {message ? <p className="md:col-span-2 text-sm text-emerald-400">{message}</p> : null}

        <div className="md:col-span-2">
          <Button type="submit" disabled={saving} className={saving ? "opacity-70" : ""}>
            {saving ? "Saving..." : "Save Profile"}
          </Button>
        </div>
      </form>
    </Card>
  );
}

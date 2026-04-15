import { NavLink } from "react-router-dom";
import {
  Home,
  Brain,
  FileText,
  Map,
  User,
  History,
  FileEdit,
} from "lucide-react";

const menu = [
  { name: "Dashboard", path: "/", icon: <Home size={20} /> },
  { name: "AI Analyze", path: "/ai-analyze", icon: <Brain size={20} /> },
  { name: "Cover Letter", path: "/ai-cover-letter", icon: <FileText size={20} /> },
  { name: "Roadmap", path: "/roadmap", icon: <Map size={20} /> },
  { name: "Resume Builder", path: "/resume-builder", icon: <FileEdit size={20} /> },
  { name: "History", path: "/scan-history", icon: <History size={20} /> },
  { name: "Profile", path: "/profile", icon: <User size={20} /> },
];

export default function Sidebar({ collapsed, mobileOpen, setMobileOpen }) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex h-screen flex-col border-r border-white/8 bg-[#070b14]/95 py-6 transition-all duration-300
${mobileOpen ? "translate-x-0" : "-translate-x-full"} w-64 px-4 backdrop-blur-xl
md:static md:h-auto md:min-h-[calc(100vh-3rem)] md:self-start md:translate-x-0 md:rounded-[30px] md:border md:border-white/10 ${collapsed ? "md:w-24 md:px-3" : "md:w-[19rem] md:px-5"}`}
    >
      <div className="mb-10 px-2 pt-3 md:pt-4">
        {(!collapsed || mobileOpen) && (
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
              Workspace
            </p>
            <h1 className="headline-font text-2xl font-bold tracking-tight text-white">
              CareerSaathi
            </h1>
          </div>
        )}
      </div>

      <div className="flex w-full flex-col gap-3">
        {menu.map((item, i) => (
          <NavLink
            key={i}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-medium transition-all duration-200
              ${
                isActive
                  ? "border border-blue-400/30 bg-gradient-to-r from-blue-500/20 to-fuchsia-500/15 text-white shadow-[0_10px_30px_rgba(37,99,235,0.16)]"
                  : "text-slate-300 hover:border hover:border-white/8 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-white/5 text-slate-100">
              {item.icon}
            </span>

            {(!collapsed || mobileOpen) && <span>{item.name}</span>}
          </NavLink>
        ))}
      </div>

      <div className="mt-auto px-3 pb-4 pt-8">
        {(!collapsed || mobileOpen) && (
          <div className="rounded-3xl border border-white/8 bg-white/5 px-6 py-6 text-sm text-slate-300">
            <p className="headline-font text-base font-semibold text-white">
              Build Faster
            </p>
            <p className="mt-3 pr-2 leading-7 text-slate-400">
              Track scans, generate smarter resumes, and keep every career move in one place.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}

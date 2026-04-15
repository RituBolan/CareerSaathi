import { LogOut, Menu, UserCircle2, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../../context/AppContext";

export default function TopBar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) {
  const { user, logout } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuClick = () => {
    if (window.innerWidth < 768) {
      setMobileOpen(!mobileOpen);
      return;
    }

    setCollapsed(!collapsed);
  };

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
  };

  return (
    <div className="layout-topbar relative z-[70] overflow-visible">
      <div className="mx-auto flex w-full items-center justify-between rounded-[28px] border border-white/10 bg-white/8 px-4 py-3 shadow-[0_20px_80px_rgba(0,0,0,0.3)] backdrop-blur-xl md:px-6 md:py-3.5">
        <div className="flex items-center gap-4">
          <button
            onClick={handleMenuClick}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-gray-200 transition hover:bg-white/10 hover:text-white"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>

          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
              Career Platform
            </p>
            <h1 className="headline-font text-lg font-bold tracking-tight text-white md:text-xl">
              CareerSaathi
            </h1>
          </div>
        </div>

        <div className="relative z-[80] flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex items-center gap-3 rounded-2xl px-2 py-1 text-left hover:bg-white/5"
          >
            <span className="hidden text-sm font-medium text-slate-300 sm:block">
              {user?.name || "Guest"}
            </span>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-fuchsia-500 text-sm font-semibold text-white">
              {(user?.name || "G").charAt(0)}
            </div>
          </button>

          {menuOpen ? (
            <div className="absolute right-0 top-14 z-50 w-56 rounded-2xl border border-white/10 bg-[#111827] p-2 shadow-2xl">
              {user ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-200 hover:bg-white/5"
                  >
                    <UserCircle2 size={18} />
                    Profile
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-rose-300 hover:bg-white/5"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-xl px-3 py-3 text-sm text-slate-200 hover:bg-white/5"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-xl px-3 py-3 text-sm text-slate-200 hover:bg-white/5"
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

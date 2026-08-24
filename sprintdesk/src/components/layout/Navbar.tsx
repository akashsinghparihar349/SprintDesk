import { useNavigate } from "react-router-dom";

import { useAuthStore } from "../../stores/auth.store";
import { useThemeStore } from "../../stores/theme.store";
import { useNotifications } from "../../hooks/useNotifications";

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const navigate = useNavigate();

  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();

  const { data: notifications = [] } = useNotifications();

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  function handleNotifications() {
    navigate("/notifications");
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 dark:border-slate-800 dark:bg-slate-900 md:px-6">
      {/* Left Side */}
      <div className="flex items-center">
        {/* Hamburger - Mobile Only */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="mr-3 rounded-lg border border-slate-200 px-3 py-2 text-lg text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 md:hidden"
        >
          ☰
        </button>

        {/* Welcome */}
        <div>
          <p className="text-sm text-slate-500">Welcome back,</p>

          <p className="font-semibold text-slate-900 dark:text-white">
            {user?.firstName || user?.username || "User"}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        {/* Notifications */}
        <button
          type="button"
          onClick={handleNotifications}
          aria-label="Notifications"
          className="relative rounded-lg border border-slate-200 px-3 py-2 transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          🔔

          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-red-500 px-1.5 py-0.5 text-center text-[10px] font-bold text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>

        {/* Logout */}
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-600 sm:px-4"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
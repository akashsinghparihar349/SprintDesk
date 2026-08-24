import { NavLink } from "react-router-dom";

import { useNotifications } from "../../hooks/useNotifications";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const links = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: "⌂",
  },
  {
    label: "Sprint Board",
    path: "/board",
    icon: "▦",
  },
  {
    label: "Notifications",
    path: "/notifications",
    icon: "🔔",
  },
  {
    label: "Analytics",
    path: "/analytics",
    icon: "◩",
  },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { data: notifications = [] } = useNotifications();

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  return (
    <aside
      className={`
        fixed
        inset-y-0
        left-0
        z-50
        w-64
        shrink-0
        border-r
        border-slate-200
        bg-white
        transition-transform
        duration-300
        dark:border-slate-800
        dark:bg-slate-900
        md:static
        md:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <div className="flex min-h-screen flex-col">
        {/* Logo */}

        <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                SprintDesk
              </h1>

              <p className="mt-1 text-xs text-slate-500">Sprint Management</p>
            </div>

            {/* Close Button - Mobile */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="rounded-lg p-2 text-lg text-slate-500 transition hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Navigation */}

        <nav className="flex-1 space-y-2 p-4">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{link.icon}</span>

                    <span>{link.label}</span>
                  </div>

                  {link.path === "/notifications" && unreadCount > 0 && (
                    <span
                      className={`min-w-6 rounded-full px-2 py-0.5 text-center text-xs font-bold ${
                        isActive
                          ? "bg-white text-blue-600"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}

        <div className="border-t border-slate-200 p-4 dark:border-slate-800">
          <p className="text-xs text-slate-400">SprintDesk v1.0</p>
        </div>
      </div>
    </aside>
  );
}

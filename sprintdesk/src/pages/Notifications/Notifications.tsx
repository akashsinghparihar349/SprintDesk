import { useState } from "react";

import { markNotificationAsRead } from "../../services/notification.service";
import { useNotifications } from "../../hooks/useNotifications";
import { useNotificationStore } from "../../stores/notification.store";

export default function Notifications() {
  const { data: notifications = [] } = useNotifications();

  const markAsRead = useNotificationStore((state) => state.markAsRead);

  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);

  const [updatingId, setUpdatingId] = useState<number | null>(null);

  async function handleMarkAsRead(id: number) {
    try {
      setUpdatingId(id);

      await markNotificationAsRead(id);

      markAsRead(id);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    } finally {
      setUpdatingId(null);
    }
  }

  function handleMarkAllAsRead() {
    markAllAsRead();
  }

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Notifications
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Stay updated with your project activity.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllAsRead}
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Notification Count */}

      {notifications.length > 0 && (
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm dark:border-slate-800 dark:bg-slate-900">
          <span className="text-slate-500">Total notifications:</span>

          <span className="ml-1 font-semibold text-slate-900 dark:text-white">
            {notifications.length}
          </span>

          <span className="mx-2 text-slate-300">|</span>

          <span className="text-slate-500">Unread:</span>

          <span className="ml-1 font-semibold text-blue-600">
            {unreadCount}
          </span>
        </div>
      )}

      {/* Notifications List */}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {notifications.length === 0 ? (
          <div className="p-10 text-center">
            <div className="text-4xl">🔔</div>

            <p className="mt-3 font-medium text-slate-700 dark:text-slate-300">
              No notifications
            </p>

            <p className="mt-1 text-sm text-slate-500">You're all caught up.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-800">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`flex items-start justify-between gap-4 p-5 transition ${
                  notification.read
                    ? "bg-white dark:bg-slate-900"
                    : "bg-blue-50/50 dark:bg-blue-950/20"
                }`}
              >
                {/* Left Side */}

                <div className="flex min-w-0 gap-4">
                  {/* Status Dot */}

                  <div className="pt-1.5">
                    <div
                      className={`h-2.5 w-2.5 rounded-full ${
                        notification.read ? "bg-slate-300" : "bg-blue-600"
                      }`}
                    />
                  </div>

                  {/* Content */}

                  <div className="min-w-0">
                    <h3 className="font-medium text-slate-900 dark:text-white">
                      {notification.title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                      {notification.message}
                    </p>

                    <p className="mt-2 text-xs text-slate-400">
                      {new Date(notification.createdAt).toLocaleString()}
                    </p>

                    <p className="mt-1 text-xs">
                      {notification.read ? (
                        <span className="text-slate-400">Read</span>
                      ) : (
                        <span className="font-medium text-blue-600">
                          Unread
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                {/* Mark as Read */}

                {!notification.read && (
                  <button
                    type="button"
                    onClick={() => handleMarkAsRead(notification.id)}
                    disabled={updatingId === notification.id}
                    className="shrink-0 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {updatingId === notification.id
                      ? "Updating..."
                      : "Mark as read"}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

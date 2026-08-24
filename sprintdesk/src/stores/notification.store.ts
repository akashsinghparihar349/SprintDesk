import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AppNotification {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

interface NotificationStore {
  notifications: AppNotification[];

  addNotification: (notification: AppNotification) => void;
  addNotifications: (notifications: AppNotification[]) => void;

  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

export const useNotificationStore =
  create<NotificationStore>()(
    persist(
      (set) => ({
        notifications: [],

        addNotification: (notification) =>
          set((state) => {
            const exists = state.notifications.some(
              (item) => item.id === notification.id,
            );

            if (exists) {
              return state;
            }

            return {
              notifications: [
                notification,
                ...state.notifications,
              ].slice(0, 20),
            };
          }),

        addNotifications: (notifications) =>
          set((state) => {
            const existingIds = new Set(
              state.notifications.map(
                (notification) => notification.id,
              ),
            );

            const newNotifications =
              notifications.filter(
                (notification) =>
                  !existingIds.has(notification.id),
              );

            return {
              notifications: [
                ...newNotifications,
                ...state.notifications,
              ]
                .sort(
                  (a, b) =>
                    new Date(b.createdAt).getTime() -
                    new Date(a.createdAt).getTime(),
                )
                .slice(0, 20),
            };
          }),

        markAsRead: (id) =>
          set((state) => ({
            notifications:
              state.notifications.map(
                (notification) =>
                  notification.id === id
                    ? {
                      ...notification,
                      read: true,
                    }
                    : notification,
              ),
          })),

        markAllAsRead: () =>
          set((state) => ({
            notifications:
              state.notifications.map(
                (notification) => ({
                  ...notification,
                  read: true,
                }),
              ),
          })),

        clearNotifications: () =>
          set({
            notifications: [],
          }),
      }),

      {
        name: "sprintdesk-notifications",
      },
    ),
  );
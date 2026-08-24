import { useEffect } from "react";

import { getNotifications } from "../services/notification.service";
import { useNotificationStore } from "../stores/notification.store";

export function useNotificationPolling() {
  const addNotifications = useNotificationStore(
    (state) => state.addNotifications,
  );

  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null =
      null;

    async function pollNotifications() {
      if (document.hidden) {
        return;
      }

      try {
        // Fetch latest 20 notifications
        const posts = await getNotifications(1, 20);

        const currentNotifications =
          useNotificationStore.getState().notifications;

        const existingIds = new Set(
          currentNotifications.map(
            (notification) => notification.id,
          ),
        );

        const newNotifications = posts
          .filter((post) => !existingIds.has(post.id))
          .map((post) => ({
            id: post.id,
            title: post.title,
            message: post.body,
            createdAt: new Date().toISOString(),
            read: false,
          }));

        if (newNotifications.length > 0) {
          addNotifications(newNotifications);
        }
      } catch (error) {
        console.error(
          "Notification polling failed:",
          error,
        );
      }
    }

    function stopPolling() {
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
    }

    function startPolling() {
      stopPolling();

      void pollNotifications();

      intervalId = setInterval(() => {
        void pollNotifications();
      }, 10000);
    }

    function handleVisibilityChange() {
      if (document.hidden) {
        stopPolling();
      } else {
        startPolling();
      }
    }

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );

    startPolling();

    return () => {
      stopPolling();

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
    };
  }, [addNotifications]);
}
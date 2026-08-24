import { useNotificationStore } from "../stores/notification.store";

export function useNotifications() {
  const notifications = useNotificationStore(
    (state) => state.notifications,
  );

  return {
    data: notifications,
    isLoading: false,
    isError: false,
    error: null,
  };
}
import AppRoutes from "./routes/AppRoutes";
import Toast from "./components/ui/Toast";

import { useToast } from "./hooks/useToast";
import { useNotificationPolling } from "./hooks/useNotificationPolling";

function App() {
  const { toasts, removeToast } = useToast();

  // Start notification polling
  useNotificationPolling();

  return (
    <>
      <AppRoutes />

      <Toast toasts={toasts} onRemove={removeToast} />
    </>
  );
}

export default App;

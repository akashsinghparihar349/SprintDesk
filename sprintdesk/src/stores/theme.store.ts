import { create } from "zustand";

interface ThemeState {
  theme: "light" | "dark";
  toggleTheme: () => void;
}

const savedTheme =
  (localStorage.getItem("sprintdesk_theme") as
    | "light"
    | "dark"
    | null) || "light";

if (savedTheme === "dark") {
  document.documentElement.classList.add("dark");
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: savedTheme,

  toggleTheme: () => {
    set((state) => {
      const nextTheme =
        state.theme === "light" ? "dark" : "light";

      document.documentElement.classList.toggle(
        "dark",
        nextTheme === "dark"
      );

      localStorage.setItem(
        "sprintdesk_theme",
        nextTheme
      );

      return {
        theme: nextTheme,
      };
    });
  },
}));
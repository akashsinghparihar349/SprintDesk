import { create } from "zustand";

import { loginUser } from "../services/auth.service";
import { refreshAccessToken } from "../services/api";

import type {
  AuthState,
  LoginCredentials,
  User,
} from "../types/auth.types";

const REFRESH_TOKEN_KEY = "sprintdesk_refresh_token";
const USER_KEY = "sprintdesk_user";

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  // Access token stays in memory
  accessToken: null,

  // Refresh token is persisted
  refreshToken: null,

  isAuthenticated: false,

  // Initial session validation
  isLoading: true,

  login: async (credentials: LoginCredentials) => {
    try {
      const data = await loginUser(credentials);

      const user: User = {
        id: data.id,
        username: data.username,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        image: data.image,
      };

      localStorage.setItem(
        REFRESH_TOKEN_KEY,
        data.refreshToken,
      );

      localStorage.setItem(
        USER_KEY,
        JSON.stringify(user),
      );

      set({
        user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      });

      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem(
      REFRESH_TOKEN_KEY,
    );

    localStorage.removeItem(USER_KEY);

    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  initializeAuth: () => {
    set({
      isLoading: true,
    });

    const refreshToken = localStorage.getItem(
      REFRESH_TOKEN_KEY,
    );

    const storedUser = localStorage.getItem(
      USER_KEY,
    );

    // No persisted session
    if (!refreshToken || !storedUser) {
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      });

      return;
    }

    let user: User;

    try {
      user = JSON.parse(storedUser) as User;
    } catch {
      localStorage.removeItem(
        REFRESH_TOKEN_KEY,
      );

      localStorage.removeItem(USER_KEY);

      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      });

      return;
    }

    // Restore basic session information first
    set({
      user,
      refreshToken,
      isAuthenticated: false,
      isLoading: true,
    });

    // Validate refresh token silently
    void (async () => {
      const refreshed = await refreshAccessToken();

      if (refreshed) {
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        });

        return;
      }

      // Refresh token invalid/expired
      localStorage.removeItem(
        REFRESH_TOKEN_KEY,
      );

      localStorage.removeItem(USER_KEY);

      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    })();
  },
}));
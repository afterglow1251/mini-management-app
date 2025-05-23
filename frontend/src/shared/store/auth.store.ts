import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  getAccessToken,
  removeAccessToken,
  setAccessToken,
} from "../utils/accessToken.utils";
import { parseAccessToken } from "../utils/jwtParser.utils";

interface AuthState {
  isAuthenticated: boolean;
  userId: number | null;
  userEmail: string | null;
  login: (token: string) => void;
  logout: () => void;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      userId: null,
      userEmail: null,

      login: (token: string) => {
        setAccessToken(token);
        const parsed = parseAccessToken(token);

        if (!parsed.expired) {
          set({
            isAuthenticated: true,
            userId: parsed.userId,
            userEmail: parsed.email,
          });
        } else {
          removeAccessToken();
          set({ isAuthenticated: false, userId: null, userEmail: null });
        }
      },

      logout: () => {
        removeAccessToken();
        set({ isAuthenticated: false, userId: null, userEmail: null });
      },

      checkAuth: () => {
        const token = getAccessToken();
        const parsed = token ? parseAccessToken(token) : null;

        if (!token || !parsed || parsed.expired) {
          removeAccessToken();
          set({ isAuthenticated: false, userId: null, userEmail: null });
        } else {
          set({
            isAuthenticated: true,
            userId: parsed.userId,
            userEmail: parsed.email,
          });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        userId: state.userId,
        userEmail: state.userEmail,
      }),
    }
  )
);

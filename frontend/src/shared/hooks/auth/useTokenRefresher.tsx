import { useEffect } from "react";
import { authService } from "../../services/auth.service";
import { getAccessToken } from "../../utils/accessToken.utils";
import { useAuthStore } from "../../store/auth.store";
import { setInterval, clearInterval } from "worker-timers";

export function useTokenRefresher() {
  const { login, logout } = useAuthStore();

  useEffect(() => {
    const refreshInterval = setInterval(async () => {
      const token = getAccessToken();
      if (!token) return;

      try {
        const { access_token } = await authService.refresh();
        login(access_token);
      } catch {
        logout();
      }
    }, Number(import.meta.env.VITE_ACCESS_TOKEN_REFRESH_INTERVAL_MS));

    return () => clearInterval(refreshInterval);
  }, [login, logout]);
}

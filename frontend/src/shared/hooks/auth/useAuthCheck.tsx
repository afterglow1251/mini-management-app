import { useEffect } from "react";
import { useAuthStore } from "../../store/auth.store";

export function useAuthCheck() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
}

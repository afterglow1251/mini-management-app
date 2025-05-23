import { Navigate } from "react-router";
import { ROUTES } from "../../constants/routing/routes.constants";
import type { JSX } from "react";
import { useAuthStore } from "../../store/auth.store";

export function PublicRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAuthStore();

  return isAuthenticated ? <Navigate to={ROUTES.HOME} replace /> : children;
}

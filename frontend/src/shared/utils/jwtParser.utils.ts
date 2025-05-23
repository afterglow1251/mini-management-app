import { jwtDecode } from "jwt-decode";
import type { DecodedToken, ParsedResult } from "../types/auth/jwt.types";

export const parseAccessToken = (token: string): ParsedResult => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const now = Date.now() / 1000;

    return {
      expired: decoded.exp < now,
      userId: decoded.sub ?? null,
      email: decoded.email ?? null,
    };
  } catch {
    return {
      expired: true,
      userId: null,
      email: null,
    };
  }
};

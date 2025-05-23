export interface DecodedToken {
  sub: number;
  email: string;
  exp: number;
}

export interface ParsedResult {
  expired: boolean;
  userId: number | null;
  email: string | null;
}

export type JwtPayload = {
  email: string;
  sub: number;
  iat?: number;
  exp?: number;
};

export type AuthTokens = {
  access_token: string;
  refresh_token: string;
};

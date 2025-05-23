import type { LoginDto, SignupDto } from "../types/auth/dto.types";
import type { AuthTokens } from "../types/auth/tokens.types";
import type { User } from "../types/user/user.types";
import { HttpService } from "./http.service";

export class AuthService {
  private readonly http = new HttpService();

  async login(dto: LoginDto): Promise<AuthTokens> {
    const res = await this.http.post<AuthTokens>({
      url: "auth/login",
      data: dto,
      withCredentials: true,
      withAuth: false,
    });
    return res.data;
  }

  async signup(dto: SignupDto): Promise<AuthTokens> {
    const res = await this.http.post<AuthTokens>({
      url: "auth/signup",
      data: dto,
      withCredentials: true,
      withAuth: false,
    });
    return res.data;
  }

  async logout(): Promise<void> {
    await this.http.post<void>({
      url: "auth/logout",
      withCredentials: true,
    });
  }

  async refresh(): Promise<AuthTokens> {
    const res = await this.http.post<AuthTokens>({
      url: "auth/refresh",
      withCredentials: true,
      withAuth: false,
    });
    return res.data;
  }

  async getProfile(): Promise<User> {
    const res = await this.http.get<User>({
      url: "auth/profile",
    });
    return res.data;
  }
}

export const authService = new AuthService();

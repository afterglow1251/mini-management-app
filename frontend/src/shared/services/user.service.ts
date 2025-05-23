import type { CreateUserDto, UpdateUserDto } from "../types/user/dto.types";
import type { User } from "../types/user/user.types";
import { HttpService } from "./http.service";

export class UserService {
  private readonly http = new HttpService();

  async create(dto: CreateUserDto): Promise<User> {
    const res = await this.http.post<User>({
      url: "users",
      data: dto,
      withCredentials: true,
      withAuth: true,
    });
    return res.data;
  }

  async findAll(): Promise<User[]> {
    const res = await this.http.get<User[]>({
      url: "users",
      withCredentials: true,
      withAuth: true,
    });
    return res.data;
  }

  async findOne(id: number): Promise<User> {
    const res = await this.http.get<User>({
      url: `users/${id}`,
      withCredentials: true,
      withAuth: true,
    });
    return res.data;
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    const res = await this.http.patch<User>({
      url: `users/${id}`,
      data: dto,
      withCredentials: true,
      withAuth: true,
    });
    return res.data;
  }

  async delete(id: number): Promise<void> {
    await this.http.delete<void>({
      url: `users/${id}`,
      withCredentials: true,
      withAuth: true,
    });
  }
}

export const userService = new UserService();

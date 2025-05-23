import type { CreateTaskDto, UpdateTaskDto } from "../types/task/dto.types";
import type { Task } from "../types/task/task.types";
import { HttpService } from "./http.service";

class TaskService {
  private readonly http = new HttpService();

  async getAll(): Promise<Task[]> {
    const res = await this.http.get<Task[]>({ url: "tasks" });
    return res.data;
  }

  async getOne(id: number): Promise<Task> {
    const res = await this.http.get<Task>({ url: `tasks/${id}` });
    return res.data;
  }

  async create(dto: CreateTaskDto): Promise<Task> {
    const res = await this.http.post<Task>({
      url: "tasks",
      data: dto,
    });
    return res.data;
  }

  async update(id: number, dto: UpdateTaskDto): Promise<Task> {
    const res = await this.http.patch<Task>({
      url: `tasks/${id}`,
      data: dto,
    });
    return res.data;
  }

  async delete(id: number): Promise<void> {
    await this.http.delete({ url: `tasks/${id}` });
  }

  async getByProjectId(
    projectId: number,
    order: "asc" | "desc" = "asc"
  ): Promise<Task[]> {
    const res = await this.http.get<Task[]>({
      url: `projects/${projectId}/tasks`,
      params: { order },
    });
    return res.data;
  }
}

export const taskService = new TaskService();

import type {
  CreateProjectDto,
  UpdateProjectDto,
} from "../types/project/dto.types";
import type { Project } from "../types/project/project.types";
import { HttpService } from "./http.service";

class ProjectService {
  private readonly http = new HttpService();

  async getAll(): Promise<Project[]> {
    const res = await this.http.get<Project[]>({ url: "projects" });
    return res.data;
  }

  async getOne(id: number): Promise<Project> {
    const res = await this.http.get<Project>({ url: `projects/${id}` });
    return res.data;
  }

  async create(dto: CreateProjectDto): Promise<Project> {
    const res = await this.http.post<Project>({
      url: "projects",
      data: dto,
    });
    return res.data;
  }

  async update(id: number, dto: UpdateProjectDto): Promise<Project> {
    const res = await this.http.patch<Project>({
      url: `projects/${id}`,
      data: dto,
    });
    return res.data;
  }

  async delete(id: number): Promise<void> {
    await this.http.delete({ url: `projects/${id}` });
  }
}

export const projectService = new ProjectService();

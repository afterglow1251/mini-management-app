import type { TaskStatus } from "./task.types";

export interface CreateTaskDto {
  title: string;
  description?: string;
  projectId: number;
  assignedToId?: number;
  status?: TaskStatus;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  assignedToId?: number | null;
}

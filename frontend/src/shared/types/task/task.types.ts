import type { Project } from "../project/project.types";
import type { User } from "../user/user.types";

export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
}

export interface Task {
  id: number;
  title: string;
  description: string;
  project: Project;
  assignedTo: User | null;
  status: TaskStatus;
}

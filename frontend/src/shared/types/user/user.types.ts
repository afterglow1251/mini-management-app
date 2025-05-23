import type { Project } from "../project/project.types";
import type { Task } from "../task/task.types";

export interface User {
  id: number;
  name: string;
  email: string;
  projects?: Project[];
  assignedTasks?: Task[];
}

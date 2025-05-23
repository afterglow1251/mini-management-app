import type { Task } from "../task/task.types";
import type { User } from "../user/user.types";

export interface Project {
  id: number;
  title: string;
  description: string;
  owner: User;
  tasks?: Task[];
}

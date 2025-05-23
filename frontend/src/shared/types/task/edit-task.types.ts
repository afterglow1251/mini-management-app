import type { TaskStatus } from "./task.types";

export interface EditedTask {
  title?: string;
  description?: string;
  status?: TaskStatus;
  assignedToId?: number | null;
}

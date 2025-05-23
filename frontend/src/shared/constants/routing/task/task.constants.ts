import { TaskStatus } from "../../../types/task/task.types";

export const TASK_STATUS_OPTIONS = [
  { value: TaskStatus.TODO, label: "Todo" },
  { value: TaskStatus.IN_PROGRESS, label: "In Progress" },
  { value: TaskStatus.DONE, label: "Done" },
];

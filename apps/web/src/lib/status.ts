import type { JobStatus, TaskStatus } from "@url-jobs/schemas";
import type { ClassValue } from "clsx";

type Status = JobStatus | TaskStatus;

export const TERMINAL_STAUTUS = new Set<JobStatus | TaskStatus>([
  "failed",
  "completed",
  "cancelled",
  "error",
]);

export const STATUS_CONFIG: Record<
  Status,
  { label: string; className: ClassValue; dotClassname: ClassValue }
> = {
  pending: {
    label: "Ожидание",
    className: "bg-gray-100 text-gray-600",
    dotClassname: "bg-gray-400",
  },
  in_progress: {
    label: "В процессе",
    className: "bg-blue-100 text-blue-600",
    dotClassname: "bg-blue-400 animate-pulse",
  },
  sucess: {
    label: "Успешно",
    className: "bg-green-100 text-green-600",
    dotClassname: "bg-green-400",
  },
  completed: {
    label: "Завершено",
    className: "bg-green-100 text-green-600",
    dotClassname: "bg-green-400",
  },
  cancelled: {
    label: "Отменено",
    className: "bg-amber-100 text-amber-600",
    dotClassname: "bg-amber-400",
  },
  error: {
    label: "Ошибка",
    className: "bg-red-100 text-red-600",
    dotClassname: "bg-red-400",
  },
  failed: {
    label: "Сбой выполнения",
    className: "bg-red-100 text-red-600",
    dotClassname: "bg-red-400",
  },
};

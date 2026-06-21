import type { JobStatus, TaskStatus } from "@url-jobs/schemas";
import { STATUS_CONFIG } from "../lib/status";
import { cn } from "../utils/cn";

interface Props {
  status: JobStatus | TaskStatus;
  size: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: Props) {
  const config = STATUS_CONFIG[status];
  const sizeClasses =
    size === "sm" ? "px-1.5 py-0.5 text-[11px]" : "px-2 py-1 text-xs";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium",
        sizeClasses,
        config.className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dotClassname)} />
      {config.label}
    </span>
  );
}

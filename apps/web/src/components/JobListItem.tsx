import type { JobDetails } from "@url-jobs/schemas";
import { useJobsStore } from "../store/jobs.store";
import { StatusBadge } from "./StatusBadge";
import { formatRelativeTime } from "../lib/formatTime";
import { cn } from "../utils/cn";

interface Props {
  job: JobDetails;
}

export function JobListItem({ job }: Props) {
  const isActive = useJobsStore((s) => s.activeJobId === job.id);
  const setActive = useJobsStore((s) => s.setActiveJob);

  return (
    <button
      type="button"
      onClick={() => setActive(job.id)}
      className={cn(
        "flex w-full items-center justify-between px-4 py-3 text-left transition-colors hover:bg-gray-50",
        isActive
          ? "bg-blue-50 border-l-2 border-l-blue-600"
          : "border-l-2 border-l-transparent",
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium text-gray-900">
            {job.id}
            <StatusBadge status={job.status} size="sm" />
          </span>
        </div>
        <div className="mt-0.5 text-xs text-gray-500">
          {job.createdAt && formatRelativeTime(job.createdAt.toISOString())}{" "}
          {job.totalUrls} URL
        </div>
      </div>
      <div className="ml-3 shrink-0 text-right text-xs">
        <span className="text-green-600">{job.successCount}✓</span>
        {job.errorCount > 0 && (
          <span className="ml-1.5 text-red-500">{job.errorCount}✗</span>
        )}
      </div>
    </button>
  );
}

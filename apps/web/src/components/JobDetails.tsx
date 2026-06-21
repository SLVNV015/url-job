import { useJobPolling } from "../hooks/useJobPolling";
import { TERMINAL_STAUTUS } from "../lib/status";
import { useJobsStore } from "../store/jobs.store";
import { StatusBadge } from "./StatusBadge";
import { UrlStatusRow } from "./UrlStatusRow";

export function JobDetails(): React.ReactElement {
  const activeJobId = useJobsStore((s) => s.activeJobId);
  const detais = useJobsStore((s) => s.activeJobDetaild);
  const cancelActiveJob = useJobsStore((s) => s.cancelJob);
  const isActive = TERMINAL_STAUTUS.has(detais?.status || "pending");

  useJobPolling(activeJobId);

  if (!activeJobId) return <></>;

  if (!detais) return <span>Loading...</span>;

  const done = detais.successCount + detais.errorCount;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <StatusBadge size="md" status={detais.status} />
          <span className="ml-2 text-sm text-gray-500">
            {done} из {detais.totalUrls} обработано
          </span>
        </div>
        {isActive && (
          <button className="rounded-lg border border-amber-600 px-3 py-2 text-sm text-gray-900">
            Отменить выполнение задания
          </button>
        )}
      </div>
      <div>
        {detais.urls.map((u, i) => (
          <UrlStatusRow key={i} result={u} />
        ))}
      </div>
    </div>
  );
}

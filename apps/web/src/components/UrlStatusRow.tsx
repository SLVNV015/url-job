import type { TaskResult } from "@url-jobs/schemas";
import { StatusBadge } from "./StatusBadge";

interface Props {
  result: TaskResult;
}

export function UrlStatusRow({ result }: Props) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3">
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm text-gray-900" title={result.url}>
          {result.url}
        </div>
        {result.errorMessage && (
          <div
            className="mt-0.5 truncate text-xs text-red-500"
            title={result.errorMessage}
          >
            {result.errorMessage}
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-3 text-xs text-gray-500">
        {result.httpStatus !== null && (
          <span
            className={`font-mono ${result.httpStatus >= 400 ? "text-red-500" : "text-gray-600"}`}
            title="Статус код запроса"
          >
            {result.httpStatus}
          </span>
        )}
        {result.durationsMs !== null && (
          <span className="font-mono" title="Время выполнения">
            {result.durationsMs.toFixed(2)} ms
          </span>
        )}
        <StatusBadge status={result.status} size="sm" />
      </div>
    </div>
  );
}

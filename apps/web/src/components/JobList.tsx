import { useEffect } from "react";
import { useJobsStore } from "../store/jobs.store";
import { JobListItem } from "./JobListItem";

export function JobList() {
  const jobs = useJobsStore((s) => s.jobs);
  const isLoading = useJobsStore((s) => s.isLoadingList);
  const fetchJobs = useJobsStore((s) => s.fetchJobs);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  if (isLoading && jobs.length === 0) {
    return <div className="p-4 text-sm text-gray-400">Загрузка заданий...</div>;
  }

  if (jobs.length === 0) {
    return <div className="p-4 text-sm text-gray-400">Заданий пока нет</div>;
  }

  return (
    <div className="divide-y divide-gray-100 rounded-lg border border-gray-200">
      {jobs.map((job) => (
        <JobListItem key={job.id} job={job} />
      ))}
    </div>
  );
}

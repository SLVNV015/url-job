import { useEffect } from "react";
import { useJobsStore } from "../store/jobs.store";
import { jobsApi } from "../api/jobs.api";
import { TERMINAL_STAUTUS } from "../lib/status";

const POLLING_INTERVAL = 1000;

export function useJobPolling(jobId: string | null) {
  const setActiveJobDetails = useJobsStore((s) => s.setActiveJobDetails);
  const fetchJobs = useJobsStore((s) => s.fetchJobs);

  useEffect(() => {
    if (!jobId) return;

    let canceled = false;
    let timeOutID: ReturnType<typeof setTimeout> | null = null;

    const poll = async () => {
      try {
        const detaids = await jobsApi.getOne(jobId);

        if (canceled || useJobsStore.getState().activeJobId !== jobId) {
          return;
        }

        setActiveJobDetails(detaids);

        //если статус завершен, то перестаем поллить
        if (TERMINAL_STAUTUS.has(detaids.status)) {
          await fetchJobs();
          return;
        }

        timeOutID = setTimeout(poll, POLLING_INTERVAL);
      } catch (error) {
        if (!canceled) {
          return;
        }
        timeOutID = setTimeout(poll, POLLING_INTERVAL);
      }
    };
    poll();

    return () => {
      canceled = true;
      if (timeOutID) {
        clearTimeout(timeOutID);
      }
    };
  }, [jobId, setActiveJobDetails, fetchJobs]);
}

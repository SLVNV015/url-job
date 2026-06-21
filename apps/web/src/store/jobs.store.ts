import type { JobDetails } from "@url-jobs/schemas";
import { create } from "zustand";
import { jobsApi } from "../api/jobs.api";

interface JobState {
  jobs: JobDetails[];
  activeJobId: string | null;
  activeJobDetaild: JobDetails | null;

  isLoadingList: boolean;
  isLoadingDetail: boolean;
  isSubitting: boolean;
  error: string | null;

  fetchJobs: () => Promise<void>;
  createJob: (urls: string[]) => Promise<void>;
  setActiveJob: (id: string) => void;
  setActiveJobDetails: (job: JobDetails) => void;
  cancelJob: (id: string) => Promise<void>;
  patchJobInList(job: JobDetails): void;
}

export const useJobsStore = create<JobState>((set, get) => ({
  jobs: [],
  activeJobId: null,
  activeJobDetaild: null,

  isLoadingList: false,
  isLoadingDetail: false,
  isSubitting: false,
  error: null,

  fetchJobs: async () => {
    set({ isLoadingList: true, error: null });
    try {
      const jobs = await jobsApi.list();
      set({ jobs, isLoadingList: false });
    } catch (error) {
      set({ error: toMessage(error), isLoadingList: false });
    }
  },

  createJob: async (urls: string[]) => {
    set({ isSubitting: true, error: null });
    try {
      const job = await jobsApi.create(urls);
      set({
        isSubitting: false,
        activeJobId: job.jobId,
        activeJobDetaild: null,
      });
      await get().fetchJobs();
    } catch (error) {
      set({ error: toMessage(error), isSubitting: false });
    }
  },

  setActiveJob: (id: string) => {
    set({ activeJobId: id, activeJobDetaild: null });
  },

  setActiveJobDetails: (job: JobDetails) => {
    set({ activeJobDetaild: job });
  },

  cancelJob: async (id: string) => {
    const { activeJobId } = get();
    if (!activeJobId) return;
    try {
      await jobsApi.cancel(id);
      await get().fetchJobs();
    } catch (error) {
      set({ error: toMessage(error) });
    }
  },
  patchJobInList(detail: JobDetails) {
    set((state) => ({
      jobs: state.jobs.map((job) =>
        job.id === detail.id ? { ...job, ...detail } : job,
      ),
    }));
  },
}));

function toMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Unknown error";
}

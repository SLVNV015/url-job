import {
  createJobRequestSchema,
  createJobResponseSchema,
  jobDetailsSchema,
  type JobCreateResponse,
  type JobDetails,
} from "@url-jobs/schemas";
import { HttpClient } from "./httpClient";
import z from "zod";

const client = new HttpClient({
  baseUrl: import.meta.env.VITE_API_URL ?? "http://localhost:3000/api",
});
export const jobsApi = {
  create: async (urls: string[]): Promise<JobCreateResponse> => {
    const dto = createJobRequestSchema.parse({ urls });
    const res = await client.post("/jobs", dto);
    return createJobResponseSchema.parse(res);
  },
  list: async (): Promise<JobDetails[]> => {
    const data = await client.get("/jobs");
    return z.array(jobDetailsSchema).parse(data);
  },
  getOne: async (id: string): Promise<JobDetails> => {
    const data = await client.get(`/jobs/${id}`);
    return jobDetailsSchema.parse(data);
  },
  cancel: async (id: string): Promise<void> => {
    await client.delete(`/jobs/${id}`);
  },
};

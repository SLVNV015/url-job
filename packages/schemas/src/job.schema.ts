import { z } from "zod";

export const createJobRequestSchema = z.object({
  urls: z.array(z.url()),
});

export type JobCreateDto = z.infer<typeof createJobRequestSchema>;

export const createJobResponseSchema = z.object({
  jobId: z.string(),
});

export type JobCreateResponse = z.infer<typeof createJobResponseSchema>;

export const statusScema = z.enum([
  "pending",
  "in_progress",
  "completed",
  "cancelled",
  "failed",
]);

export type JobStatus = z.infer<typeof statusScema>;

export const jobSummarySchema = z.object({
  id: z.string(),
  createdAt: z.iso.datetime().pipe(z.coerce.date()),
  status: statusScema,
  totalUrls: z.number(),
  successCount: z.number(),
  errorCount: z.number(),
});

export const taskStatusSchema = z.enum([
  "pending",
  "in_progress",
  "sucess",
  "cancelled",
  "error",
]);
export type TaskStatus = z.infer<typeof taskStatusSchema>;

export const taskResultSchema = z.object({
  url: z.string(),
  status: taskStatusSchema,
  httpStatus: z.number().nullable(),
  errorMessage: z.string().nullable(),
  startedAt: z.iso.datetime().pipe(z.coerce.date()).nullable(),
  finishedAt: z.iso.datetime().pipe(z.coerce.date()).nullable(),
  durationsMs: z.number().nullable(),
});

export const jobDetailsSchema = jobSummarySchema.extend({
  urls: z.array(taskResultSchema),
});

export type JobSummary = z.infer<typeof jobSummarySchema>;
export type JobDetails = z.infer<typeof jobDetailsSchema>;
export type TaskResult = z.infer<typeof taskResultSchema>;

import {
  createJobRequestSchema,
  createJobResponseSchema,
  jobDetailsSchema,
} from '@url-jobs/schemas';
import { createZodDto } from 'nestjs-zod';
import z from 'zod';

export class JobCreateDtoApi extends createZodDto(createJobRequestSchema) {}
export class JobCreateResponseApi extends createZodDto(
  createJobResponseSchema,
) {}

export class JobDetailsREsponseApi extends createZodDto(jobDetailsSchema) {}

export const idPramSchema = z.uuid();

export const voidOkResult = z.object({
  result: z.literal('ok'),
});

export class VoidOkResult extends createZodDto(voidOkResult) {}

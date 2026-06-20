import { HttpException, Injectable } from '@nestjs/common';
import { Job } from 'src/jobs/domain/job.entity';

export interface JobsRepository {
  create(job: Job): void;
  findById(id: string): Job | undefined;
  findAll(): Job[];
  update(id: string, patch: Partial<Job>): void;
}

@Injectable()
export class JobsRepositoryImpl implements JobsRepository {
  private jobs = new Map<string, Job>();
  create(job: Job): void {
    const candidate = this.findById(job.id);
    if (candidate) {
      throw new HttpException('Job already exists', 400);
    }
    this.jobs.set(job.id, job);
  }
  findById(id: string): Job | undefined {
    return this.jobs.get(id);
  }
  findAll(): Job[] {
    return Array.from(this.jobs.values());
  }
  update(id: string, patch: Job): void {
    const job = this.findById(id);
    if (!job) {
      throw new HttpException('Job not found', 404);
    }
    this.jobs.set(id, patch);
  }
}

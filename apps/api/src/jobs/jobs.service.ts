import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleDestroy,
} from '@nestjs/common';
import { Task } from 'src/jobs/domain/task-result.entity';
import { JobsRepositoryImpl } from 'src/jobs/jobs.repository';
import { ConcurrentQueueService } from 'src/queue/concurrent-queue.service';
import { UrlCheckerService } from 'src/url-checker/url-checker.service';
import { JobDetails, TaskResult } from '@url-jobs/schemas';
import { Job } from 'src/jobs/domain/job.entity';
import { randomUUID } from 'crypto';
import { ConfigService } from '@nestjs/config';
import {
  JobCreateDtoApi,
  JobCreateResponseApi,
  JobDetailsREsponseApi,
} from 'src/jobs/domain/dto/dtos';

@Injectable()
export class JobsService implements OnModuleDestroy {
  constructor(
    private readonly jobsRepository: JobsRepositoryImpl,
    private readonly urlCheckerService: UrlCheckerService,
    private readonly queueService: ConcurrentQueueService<Task, Task>,
    private readonly configService: ConfigService,
  ) {
    this.CONCURRENCY_RATE =
      this.configService.get<number>('CONCURRENCY_RATE') || 5;
  }

  onModuleDestroy() {
    const jobs = this.jobsRepository
      .findAll()
      .filter((j) => j.status === 'pending' || j.status === 'in_progress');

    for (const job of jobs) {
      job.setFailed();
      this.jobsRepository.update(job.id, job);
    }
  }

  private readonly logger = new Logger(JobsService.name);
  private CONCURRENCY_RATE: number;

  public async createJob(dto: JobCreateDtoApi): Promise<JobCreateResponseApi> {
    const job = new Job(randomUUID(), dto.urls);
    this.jobsRepository.create(job);
    this.logger.debug(`Job with id ${job.id} created`);

    this.queueService
      .process(
        job.id,
        job.tasks,
        async (task) => {
          this.logger.debug(
            `Task with id ${task.id} started for url: ${task.url}`,
          );
          return await this.chekUrlAndDelay(task, job);
        },
        this.CONCURRENCY_RATE,
      )
      .subscribe({
        error: async (err) => {
          this.logger.error(err);
          job.setFailed();
          this.jobsRepository.update(job.id, job);
        },
        complete: async () => {
          job.setCompleted();
          this.jobsRepository.update(job.id, job);
          this.logger.debug(`Job with id ${job.id} completed`);
        },
      });

    return {
      jobId: job.id,
    } as JobCreateResponseApi;
  }

  public getJobById(id: string): JobDetails {
    const job = this.jobsRepository.findById(id);
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    return this.parseDetaild(job);
  }

  public getAllJobs(): JobDetails[] {
    const jobs = this.jobsRepository.findAll();
    return jobs.map((job) => this.parseDetaild(job));
  }

  public cancelJob(id: string): void {
    const job = this.jobsRepository.findById(id);
    if (!job) {
      throw new NotFoundException('Job not found');
    }
    job.setCompleted();

    this.queueService.cancel(job.id);
    this.jobsRepository.update(job.id, job);

    this.logger.debug(`Job with id ${job.id} canceled, all tasks canceled`);
  }

  private async chekUrlAndDelay(task: Task, job: Job): Promise<Task> {
    const startedAt = new Date();
    task.setInProgress(startedAt);
    job.updateResult(task);

    this.jobsRepository.update(job.id, job);
    const result = await this.urlCheckerService.checkUrl(task.url);

    await this.sleep(Math.random() * 10_000);
    task.setResult(result.success, new Date(), result.message, result.status);

    this.logger.debug(`Task result is ${task.status}`);

    this.jobsRepository.update(job.id, job);
    return task;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private parseDetaild(job: Job): JobDetailsREsponseApi {
    const urls: TaskResult[] = job.tasks.map(
      (task) =>
        ({
          url: task.url,
          status: task.status,
          startedAt: task.startedAt,
          finishedAt: task.finishedAt,
          httpStatus: task.httpStatus,
          errorMessage: task.errorMessage,
          durationsMs: task.durationsMs,
        }) as TaskResult,
    );
    const details: JobDetails = {
      id: job.id,
      status: job.status,
      createdAt: job.createdAt,
      urls: urls,
      totalUrls: job.tasks.length,
      errorCount: job.tasks.filter((task) => task.status === 'error').length,
      successCount: job.tasks.filter((task) => task.status === 'sucess').length,
    };
    return details;
  }
}

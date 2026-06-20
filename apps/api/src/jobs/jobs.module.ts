import { Module } from '@nestjs/common';
import { JobsController } from 'src/jobs/jobs.controller';
import { JobsRepositoryImpl } from 'src/jobs/jobs.repository';
import { JobsService } from 'src/jobs/jobs.service';
import { ConcurrentQueueModule } from 'src/queue/concurrent-queue.module';
import { UrlCheckerModule } from 'src/url-checker/url-checker.module';

@Module({
  imports: [ConcurrentQueueModule, UrlCheckerModule],
  controllers: [JobsController],
  providers: [JobsService, JobsRepositoryImpl],
})
export class JobsModule {}

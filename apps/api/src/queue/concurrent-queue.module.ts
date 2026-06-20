import { Module } from '@nestjs/common';
import { ConcurrentQueueService } from 'src/queue/concurrent-queue.service';

@Module({
  providers: [ConcurrentQueueService],
  exports: [ConcurrentQueueService],
})
export class ConcurrentQueueModule {}

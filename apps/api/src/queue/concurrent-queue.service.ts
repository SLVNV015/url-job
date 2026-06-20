import { Injectable, OnModuleDestroy } from '@nestjs/common';
import {
  finalize,
  from,
  last,
  map,
  mergeMap,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';

@Injectable()
export class ConcurrentQueueService<TTask, TResult> implements OnModuleDestroy {
  private cancelSignals = new Map<string, Subject<void>>();

  public process(
    queueId: string,
    tasks: TTask[],
    processor: (tast: TTask) => Promise<TResult>,
    concurrency = 5,
  ): Observable<void> {
    const $cancel = new Subject<void>();
    this.cancelSignals.set(queueId, $cancel);

    return from(tasks).pipe(
      mergeMap(
        (task) => from(processor(task)).pipe(takeUntil($cancel)),
        concurrency,
      ),
      takeUntil($cancel),
      map(() => undefined),
      last(undefined, undefined),
      finalize(() => this.cancelSignals.delete(queueId)),
    );
  }

  public cancel(queueId: string): void {
    this.cancelSignals.get(queueId)?.next();
  }

  onModuleDestroy() {
    for (const $cancel of this.cancelSignals.values()) {
      $cancel.next();
      $cancel.complete();
    }
    this.cancelSignals.clear();
  }
}

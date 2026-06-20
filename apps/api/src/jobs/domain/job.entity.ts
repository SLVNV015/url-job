import { Task } from 'src/jobs/domain/task-result.entity';

export type JobStatus =
  | 'pending'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'failed';

export class Job {
  private _id: string;
  private _status: JobStatus;
  private _createdAt: Date;
  private _canceledReuest: boolean;
  private _tasks: Map<string, Task>;

  constructor(id: string, urls: string[]) {
    this._id = id;
    this._status = 'pending';
    this._createdAt = new Date();
    this._canceledReuest = false;
    this._tasks = new Map<string, Task>();
    for (const url of urls) {
      const taskResult = new Task(url);
      this._tasks.set(taskResult.id, taskResult);
    }
  }

  get id(): string {
    return this._id;
  }

  get status(): JobStatus {
    return this._status;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get canceledRequest(): boolean {
    return this._canceledReuest;
  }

  get tasks(): Task[] {
    return Array.from(this._tasks.values());
  }

  public setInProgress(): void {
    this._status = 'in_progress';
  }

  public updateResult(result: Task): void {
    this._tasks.set(result.id, result);
  }

  public setFailed(): void {
    this._status = 'failed';
    for (const task of this.tasks) {
      if (task.status === 'pending' || task.status === 'in_progress') {
        task.setCancelled();
      }
    }
  }

  public setCompleted(): void {
    this._status = 'completed';
  }

  public setCanceled(): void {
    this._canceledReuest = true;
    this._status = 'cancelled';

    for (const task of this.tasks) {
      if (task.status === 'pending' || task.status === 'in_progress') {
        task.setCancelled();
      }
    }
  }
}

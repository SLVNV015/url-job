import { randomUUID } from 'crypto';

export type UrlCheckStatus =
  | 'pending'
  | 'in_progress'
  | 'sucess'
  | 'cancelled'
  | 'error';

export class Task {
  private _id: string;
  private _url: string;
  private _status: UrlCheckStatus;
  private _httpStatus: number | null;
  private _errorMessage: string | null;
  private _startedAt: Date | null;
  private _finishedAt: Date | null;
  private _durationsMs: number | null;

  constructor(url: string) {
    this._id = randomUUID();
    this._url = url;
    this._status = 'pending';
    this._httpStatus = null;
    this._errorMessage = null;
    this._startedAt = null;
    this._finishedAt = null;
    this._durationsMs = null;
  }

  public get id(): string {
    return this._id;
  }
  public get url(): string {
    return this._url;
  }
  public get status(): UrlCheckStatus {
    return this._status;
  }
  public get httpStatus(): number | null {
    return this._httpStatus;
  }
  public get errorMessage(): string | null {
    return this._errorMessage;
  }
  public get startedAt(): Date | null {
    return this._startedAt;
  }
  public get finishedAt(): Date | null {
    return this._finishedAt;
  }
  public get durationsMs(): number | null {
    return this._durationsMs;
  }

  public setInProgress(startedAt: Date): void {
    this._status = 'in_progress';
    this._startedAt = startedAt;
  }

  public setResult(
    sucess: boolean,
    finishedAt: Date,
    errorMessage: string | null = null,
    httpStatus: number | null = null,
  ): void {
    this._status = sucess ? 'sucess' : 'error';
    this._finishedAt = finishedAt;
    this._errorMessage = errorMessage ? errorMessage : null;
    this._httpStatus = httpStatus ? httpStatus : null;
    this._durationsMs = this.startedAt
      ? finishedAt.getTime() - this.startedAt.getTime()
      : null;
  }

  public setCancelled(): void {
    this._status = 'cancelled';
  }
}

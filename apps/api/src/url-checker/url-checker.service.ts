import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { isAxiosError } from 'axios';
import { firstValueFrom, retry, timer } from 'rxjs';

interface CheckUrlResponse {
  status: number | null;
  success: boolean;
  message?: string;
}

@Injectable()
export class UrlCheckerService {
  constructor(private readonly httpService: HttpService) {}

  async checkUrl(url: string): Promise<CheckUrlResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.head(url, { timeout: 10_000 }).pipe(
          retry({
            count: 3,
            delay: (_err, att) => timer(this.backoffMs(att)),
          }),
        ),
      );
      return {
        status: response.status,
        success: true,
      };
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        return {
          status: error.response.status,
          success: false,
          message: error.message,
        };
      }
      return {
        status: null,
        success: false,
        message: error.message,
      };
    }
  }

  private backoffMs(attempt: number): number {
    const base = 300 * 2 ** (attempt - 1);
    const jitter = Math.random() * 100;
    return base + jitter;
  }
}

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ZodError } from 'zod/v3';

interface IError {
  statusCode: number;
  message: string;
  error: string;
  method: string;
  path: string;
  timestamp: number;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: Response = ctx.getResponse();
    const request: Request = ctx.getRequest();

    if (exception instanceof ZodError) {
      const zodErr: IError = {
        statusCode: 400,
        message: exception.message,
        error: exception.name,
        method: request.method,
        path: request.url,
        timestamp: new Date().getTime(),
      };
      this.logger.error(zodErr);
      response.status(400).json(zodErr);
      return;
    }

    if (exception instanceof HttpException) {
      const err: IError = {
        statusCode: exception.getStatus(),
        message: exception.message,
        error: exception.name,
        method: request.method,
        path: request.url,
        timestamp: new Date().getTime(),
      };
      this.logger.error(err);
      response.status(exception.getStatus()).json(err);
      return;
    }

    this.logger.error(exception);
    response.status(500).json({
      statusCode: 500,
      message: exception.message || 'Internal Server Error',
      error: exception.name || 'Internal Server Error',
      method: request.method,
      path: request.url,
      timestamp: new Date().getTime(),
    } as IError);
  }
}

import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const requestIdHeader = request.headers['x-request-id'];
    const requestId = Array.isArray(requestIdHeader)
      ? requestIdHeader[0]
      : requestIdHeader;
    const path = request.originalUrl.split('?')[0];
    const isProduction = process.env.NODE_ENV === 'production';

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const payload = exception.getResponse();

      if (typeof payload === 'object' && payload !== null) {
        message =
          (payload as { message?: string | string[] }).message ??
          exception.message;
        error = (payload as { error?: string }).error ?? exception.name;
      } else {
        message = String(payload);
        error = exception.name;
      }
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      status = this.getPrismaStatus(exception.code);
      message = this.getPrismaMessage(exception);
      error = 'Database Error';
    }

    if (isProduction && status === HttpStatus.INTERNAL_SERVER_ERROR) {
      message = 'Internal server error';
      error = 'Internal Server Error';
    }

    const logPayload = JSON.stringify({
      event: 'http.exception',
      requestId: requestId ?? undefined,
      method: request.method,
      path,
      statusCode: status,
      error,
      message,
      exceptionName:
        exception instanceof Error ? exception.name : 'UnknownError',
    });

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        logPayload,
        exception instanceof Error ? exception.stack : undefined,
      );
    } else {
      this.logger.warn(logPayload);
    }

    response.status(status).json({
      statusCode: status,
      error,
      message,
      path,
      requestId: requestId ?? undefined,
      timestamp: new Date().toISOString(),
    });
  }

  private getPrismaStatus(code: string): number {
    switch (code) {
      case 'P2002':
        return HttpStatus.CONFLICT;
      case 'P2025':
        return HttpStatus.NOT_FOUND;
      default:
        return HttpStatus.BAD_REQUEST;
    }
  }

  private getPrismaMessage(
    error: Prisma.PrismaClientKnownRequestError,
  ): string {
    switch (error.code) {
      case 'P2002':
        return 'Unique constraint violation';
      case 'P2025':
        return 'Record not found';
      default:
        return 'Database request failed';
    }
  }
}

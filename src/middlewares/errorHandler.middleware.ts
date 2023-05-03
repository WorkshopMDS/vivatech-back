import type { Response } from 'express';

import { HttpStatusCodes, HttpStatusCodesDescriptions } from '../environments/httpStatusCodes.environment';
import { ApiResponse } from '../responses/api.response';
import type { IErrorResponse } from '../types/errorResponse.type';

class ErrorHandler {
  private error = false;

  private errorResponse: IErrorResponse | undefined;

  private isTrustedError(error: Error | ApiResponse): boolean {
    if (error instanceof ApiResponse) {
      this.error = error.isOperational;
    }

    return this.error;
  }

  public handleError(error: Error | ApiResponse, response?: Response): void {
    if (this.isTrustedError(error) && response) {
      this.handleTrustedError(error as ApiResponse, response);
    } else {
      this.handleCriticalError(error, response);
    }
  }

  public handleTrustedError(error: ApiResponse, response: Response): void {
    const err = JSON.parse(error.toJson());
    const errResponse = this.buildErrorResponse(err.name, err.httpStatusCode, err.description, err.isOperational);
    response.status(error.httpStatusCode).json(errResponse);
  }

  private handleCriticalError(error: Error | ApiResponse, response?: Response): void {
    if (response) {
      if (error instanceof ApiResponse) {
        const err = JSON.parse(error.toJson());
        const errResponse = this.buildErrorResponse(err.name, err.httpStatusCode, err.description, err.isOperational);
        response.status(error.httpStatusCode).json(errResponse);
      } else {
        const errResponse = this.buildErrorResponse(
          'Error',
          HttpStatusCodes.INTERNAL_SERVER,
          HttpStatusCodesDescriptions.INTERNAL_SERVER,
          false
        );
        response.status(HttpStatusCodes.INTERNAL_SERVER).json(errResponse);
      }
    }
  }

  private buildErrorResponse(
    name: string,
    httpStatusCode: number,
    description?: string,
    isOperational = true
  ): IErrorResponse {
    this.errorResponse = {
      name,
      httpStatusCode,
      description,
      isOperational,
      timestamp: Date.now(),
    };
    return this.errorResponse;
  }
}

export const errorHandler = new ErrorHandler();

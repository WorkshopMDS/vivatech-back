import { Response } from 'express';
import { ApiResponse } from '../responses/api.response';
import { ErrorResponse } from '../types/errorResponse.type';
import { HttpStatusCodes, HttpStatusCodesDescriptions } from '../environments/httpStatusCodes.environment';

class ErrorHandler {
  private isTrustedError(error: Error | ApiResponse): boolean {
    if (error instanceof ApiResponse) {
      return error.isOperational;
    }

    return false;
  };

  public handleError(error: Error | ApiResponse, response?: Response): void {
    if (this.isTrustedError(error) && response) {
      this.handleTrustedError(error as ApiResponse, response);
    } else {
      this.handleCriticalError(error, response);
    }
  };

  public handleTrustedError(error: ApiResponse, response: Response): void {
    const err = JSON.parse(error.toJson());
    const errResponse = this.buildErrorResponse(err.name, err.httpStatusCode, err.description, err.isOperational);
    response.status(error.httpStatusCode).json(errResponse);
  };

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
  };

  private buildErrorResponse(name: string, httpStatusCode: number, description?: string, isOperational = true): ErrorResponse {
    return {
      name,
      httpStatusCode,
      description,
      isOperational,
      timestamp: Date.now(),
    };
  }
};

export const errorHandler = new ErrorHandler();

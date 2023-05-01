import { Response } from 'express';
import { ApiResponse } from '../responses/api.response';
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
    response.status(error.httpStatusCode).json({
          name: err.name,
          httpStatusCode: err.httpStatusCode,
          description: err.description,
          isOperational: err.isOperational,
          timestamp: err.timestamp,
    });
  };

  private handleCriticalError(error: Error | ApiResponse, response?: Response): void {
    console.log(error, error instanceof ApiResponse);
    if (response) {
      if (error instanceof ApiResponse) {
        const err = JSON.parse(error.toJson());
        response.status(error.httpStatusCode).json({
          name: err.name,
          httpStatusCode: err.httpStatusCode,
          description: err.description,
          isOperational: err.isOperational,
          timestamp: err.timestamp,
        });
      } else {
        response
          .status(HttpStatusCodes.INTERNAL_SERVER)
          .json({ 
            name: 'Error',
            httpStatusCode: HttpStatusCodes.INTERNAL_SERVER,
            message: HttpStatusCodesDescriptions.INTERNAL_SERVER,
            isOperational: false,
            timestamp: Date.now(),
          });
      }
    }
  };
};

export const errorHandler = new ErrorHandler();

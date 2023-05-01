import { Response } from 'express';
import { ApiError } from '../errors/base.error';
import { HttpStatusCodes, HttpStatusCodesDescriptions } from '../environments/httpStatusCodes.environment';

class ErrorHandler {
  private isTrustedError(error: Error): boolean {
    if (error instanceof ApiError) {
      return error.isOperational;
    }

    return false;
  }

  public handleError(error: Error | ApiError, response?: Response): void {
    if (this.isTrustedError(error) && response) {
      this.handleTrustedError(error as ApiError, response);
    } else {
      this.handleCriticalError(error, response);
    }
  }

  private handleTrustedError(error: ApiError, response: Response): void {
    response.status(error.httpStatusCode).json({ message: error.message });
  }

  private handleCriticalError(error: Error | ApiError, response?: Response): void {
    if (response) {
      response
        .status(HttpStatusCodes.INTERNAL_SERVER)
        .json({ message: HttpStatusCodesDescriptions.INTERNAL_SERVER });
    }
  }
}

export const errorHandler = new ErrorHandler();

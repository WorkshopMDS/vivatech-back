import type { Response } from 'express';

import { HttpStatusCodes } from '../environments/httpStatusCodes.environment';
import type { HttpStatusCodesDescriptions } from '../environments/httpStatusCodes.environment';
import type { IApiResponse } from '../types/global.type';

export class ApiResponse extends Error {
  public readonly name: string;

  public readonly httpStatusCode: HttpStatusCodes;

  public readonly description: HttpStatusCodesDescriptions;

  public readonly isOperational: boolean;

  public readonly data?: object;

  public readonly timestamp: number;

  constructor(res: Response, args: IApiResponse, error?: any) {
    super(args.description);

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = args.name;
    this.httpStatusCode = args.httpStatusCode;
    this.description = args.description;
    this.isOperational = args.isOperational ?? true;
    this.timestamp = Date.now();
    this.data = args.data ?? undefined;

    if (args.isOperational !== undefined) {
      this.isOperational = args.isOperational;
    }

    Error.captureStackTrace(this);

    if (process.env.NODE_ENV !== 'production' && this.httpStatusCode === HttpStatusCodes.INTERNAL_SERVER) {
      this.data = error;
    }

    this.sendResponse(res);
  }

  sendResponse(res: Response): void {
    res.status(this.httpStatusCode).json({
      name: this.name,
      httpStatusCode: this.httpStatusCode,
      description: this.description,
      isOperational: this.isOperational,
      timestamp: this.timestamp,
      data: this.data,
    });
  }

  toJson(): string {
    return JSON.stringify({
      name: this.name,
      httpStatusCode: this.httpStatusCode,
      description: this.description,
      isOperational: this.isOperational,
      timestamp: this.timestamp,
      data: this.data,
    });
  }
}

import { HttpStatusCodes, HttpStatusCodesDescriptions } from "../environments/httpStatusCodes.environment";

interface ApiErrorArgs {
  name?: string;
  httpStatusCode: HttpStatusCodes;
  description: string;
  isOperational?: boolean;
}

export class ApiError extends Error {
  public readonly name: string;
  public readonly httpStatusCode: HttpStatusCodes;
  public readonly isOperational: boolean = true;

  constructor(args: ApiErrorArgs) {
    super(args.description);

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = args.name || 'Error';
    this.httpStatusCode = args.httpStatusCode;

    if (args.isOperational !== undefined) {
      this.isOperational = args.isOperational;
    }

    Error.captureStackTrace(this);
  }
}
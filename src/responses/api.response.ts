import { HttpStatusCodes, HttpStatusCodesDescriptions } from "../environments/httpStatusCodes.environment";
import { ApiResponseInterface } from "../types/apiReponse.type";

export class ApiResponse extends Error {
  public readonly name: string;
  public readonly httpStatusCode: HttpStatusCodes;
  public readonly description: HttpStatusCodesDescriptions;
  public readonly isOperational: boolean;
  public readonly data?: object;
  public readonly timestamp: number;

  constructor(args: ApiResponseInterface) {
    super(args.description);

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = args.name;
    this.httpStatusCode = args.httpStatusCode;
    this.description = args.description;
    this.isOperational = args.isOperational ?? true;
    this.timestamp = Date.now();
    this.data = args.data ?? {};

    if (args.isOperational !== undefined) {
      this.isOperational = args.isOperational;
    }

    Error.captureStackTrace(this);
  };

  toJson(): string {
    return JSON.stringify({
      name: this.name,
      httpStatusCode: this.httpStatusCode,
      description: this.description,
      isOperational: this.isOperational,
      timestamp: this.timestamp,
      data: this.data,
    });
  };
}

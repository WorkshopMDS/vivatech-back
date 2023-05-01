import { HttpStatusCodes, HttpStatusCodesDescriptions } from "../environments/httpStatusCodes.environment";
import { ApiError } from "./base.error";

export class Error503 extends ApiError {
  constructor (
    name?: string,
    statusCode: HttpStatusCodes = HttpStatusCodes.UNAVAILABLE,
    description: HttpStatusCodesDescriptions = HttpStatusCodesDescriptions.UNAVAILABLE,
    isOperational?: boolean,
  ) {
    super({httpStatusCode: statusCode, description: description})
  }
};

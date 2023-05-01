import { HttpStatusCodes, HttpStatusCodesDescriptions } from "../environments/httpStatusCodes.environment";
import { ApiError } from "./base.error";

export class Error403 extends ApiError {
  constructor (
    name?: string,
    statusCode: HttpStatusCodes = HttpStatusCodes.FORBIDDEN,
    description: HttpStatusCodesDescriptions = HttpStatusCodesDescriptions.FORBIDDEN,
    isOperational?: boolean,
  ) {
    super({httpStatusCode: statusCode, description: description})
  }
};

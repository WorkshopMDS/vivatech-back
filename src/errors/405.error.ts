import { HttpStatusCodes, HttpStatusCodesDescriptions } from "../environments/httpStatusCodes.environment";
import { ApiError } from "./base.error";

export class Error405 extends ApiError {
  constructor (
    name?: string,
    statusCode: HttpStatusCodes = HttpStatusCodes.METHOD_NOT_ALLOWED,
    description: HttpStatusCodesDescriptions = HttpStatusCodesDescriptions.METHOD_NOT_ALLOWED,
    isOperational?: boolean,
  ) {
    super({httpStatusCode: statusCode, description: description})
  }
};

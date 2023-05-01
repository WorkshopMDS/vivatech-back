import { HttpStatusCodes, HttpStatusCodesDescriptions } from "../environments/httpStatusCodes.environment";
import { ApiError } from "./base.error";

export class Error401 extends ApiError {
  constructor (
    name?: string,
    statusCode: HttpStatusCodes = HttpStatusCodes.UNAUTHORIZED,
    description: HttpStatusCodesDescriptions = HttpStatusCodesDescriptions.UNAUTHORIZED,
    isOperational?: boolean,
  ) {
    super({httpStatusCode: statusCode, description: description})
  }
};

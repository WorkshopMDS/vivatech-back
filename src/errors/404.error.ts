import { HttpStatusCodes, HttpStatusCodesDescriptions } from "../environments/httpStatusCodes.environment";
import { ApiError } from "./base.error";

export class Error404 extends ApiError {
  constructor (
    name?: string,
    statusCode: HttpStatusCodes = HttpStatusCodes.NOT_FOUND,
    description: HttpStatusCodesDescriptions = HttpStatusCodesDescriptions.NOT_FOUND,
    isOperational?: boolean,
  ) {
    super({httpStatusCode: statusCode, description: description})
  }
};

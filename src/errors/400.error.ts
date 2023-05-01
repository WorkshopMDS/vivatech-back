import { HttpStatusCodes, HttpStatusCodesDescriptions } from "../environments/httpStatusCodes.environment";
import { ApiError } from "./base.error";

export class Error400 extends ApiError {
  constructor (
    name?: string,
    statusCode: HttpStatusCodes = HttpStatusCodes.BAD_REQUEST,
    description: HttpStatusCodesDescriptions = HttpStatusCodesDescriptions.BAD_REQUEST,
    isOperational?: boolean,
  ) {
    super({httpStatusCode: statusCode, description: description})
  }
};
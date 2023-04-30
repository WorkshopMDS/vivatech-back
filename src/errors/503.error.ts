import { HttpStatusCodes, HttpStatusCodesDescriptions } from "../environments/httpStatusCodes.environment";
import { ApiError } from "./base.error";

class Error503 extends ApiError {
  constructor (
    name?: string,
    statusCode: number = HttpStatusCodes.UNAVAILABLE,
    description: string = HttpStatusCodesDescriptions.UNAVAILABLE,
    isOperational?: boolean,
  ) {
    super({httpStatusCode: statusCode, description: description})
  }
};

module.exports = Error503;
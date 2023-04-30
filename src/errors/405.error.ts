import { HttpStatusCodes, HttpStatusCodesDescriptions } from "../environments/httpStatusCodes.environment";
import { ApiError } from "./base.error";

class Error405 extends ApiError {
  constructor (
    name?: string,
    statusCode: number = HttpStatusCodes.METHOD_NOT_ALLOWED,
    description: string = HttpStatusCodesDescriptions.METHOD_NOT_ALLOWED,
    isOperational?: boolean,
  ) {
    super({httpStatusCode: statusCode, description: description})
  }
};

module.exports = Error405;
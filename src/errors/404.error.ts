import { HttpStatusCodes, HttpStatusCodesDescriptions } from "../environments/httpStatusCodes.environment";
import { ApiError } from "./base.error";

class Error404 extends ApiError {
  constructor (
    name?: string,
    statusCode: number = HttpStatusCodes.NOT_FOUND,
    description: string = HttpStatusCodesDescriptions.NOT_FOUND,
    isOperational?: boolean,
  ) {
    super({httpStatusCode: statusCode, description: description})
  }
};

module.exports = Error404;
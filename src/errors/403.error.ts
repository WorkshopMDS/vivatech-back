import { HttpStatusCodes, HttpStatusCodesDescriptions } from "../environments/httpStatusCodes.environment";
import { ApiError } from "./base.error";

class Error403 extends ApiError {
  constructor (
    name?: string,
    statusCode: number = HttpStatusCodes.FORBIDDEN,
    description: string = HttpStatusCodesDescriptions.FORBIDDEN,
    isOperational?: boolean,
  ) {
    super({httpStatusCode: statusCode, description: description})
  }
};

module.exports = Error403;
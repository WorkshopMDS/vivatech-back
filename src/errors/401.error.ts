import { HttpStatusCodes, HttpStatusCodesDescriptions } from "../environments/httpStatusCodes.environment";
import { ApiError } from "./base.error";

class Error401 extends ApiError {
  constructor (
    name?: string,
    statusCode: number = HttpStatusCodes.UNAUTHORIZED,
    description: string = HttpStatusCodesDescriptions.UNAUTHORIZED,
    isOperational?: boolean,
  ) {
    super({httpStatusCode: statusCode, description: description})
  }
};

module.exports = Error401;
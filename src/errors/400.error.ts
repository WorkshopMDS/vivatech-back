import { HttpStatusCodes, HttpStatusCodesDescriptions } from "../environments/httpStatusCodes.environment";
import { ApiError } from "./base.error";

class Error400 extends ApiError {
  constructor (
    name?: string,
    statusCode: number = HttpStatusCodes.BAD_REQUEST,
    description: string = HttpStatusCodesDescriptions.BAD_REQUEST,
    isOperational?: boolean,
  ) {
    super({httpStatusCode: statusCode, description: description})
  }
};

module.exports = Error400;
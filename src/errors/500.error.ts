import { HttpStatusCodes, HttpStatusCodesDescriptions } from "../environments/httpStatusCodes.environment";
import { ApiError } from "./base.error";

class Error500 extends ApiError {
  constructor (
    name?: string,
    statusCode: number = HttpStatusCodes.INTERNAL_SERVER,
    description: string = HttpStatusCodesDescriptions.INTERNAL_SERVER,
    isOperational?: boolean,
  ) {
    super({httpStatusCode: statusCode, description: description})
  }
};

module.exports = Error500;
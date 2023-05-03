import { HttpStatusCodes, HttpStatusCodesDescriptions } from "./httpStatusCodes.environment";
import { ApiResponseInterface } from "../types/apiReponse.type";

const name: string = 'Error';

function createErrorResponse(httpStatusCode: HttpStatusCodes, description: HttpStatusCodesDescriptions): ApiResponseInterface {
  return {
    name: name,
    httpStatusCode: httpStatusCode,
    description: description,
  };
}

export const Errors = {
  BAD_REQUEST_RESPONSE: createErrorResponse(HttpStatusCodes.BAD_REQUEST, HttpStatusCodesDescriptions.BAD_REQUEST),
  UNAUTHORIZED_RESPONSE: createErrorResponse(HttpStatusCodes.UNAUTHORIZED, HttpStatusCodesDescriptions.UNAUTHORIZED),
  FORBIDDEN_RESPONSE: createErrorResponse(HttpStatusCodes.FORBIDDEN, HttpStatusCodesDescriptions.FORBIDDEN),
  NOT_FOUND_RESPONSE: createErrorResponse(HttpStatusCodes.NOT_FOUND, HttpStatusCodesDescriptions.NOT_FOUND),
  METHOD_NOT_ALLOWED_RESPONSE: createErrorResponse(HttpStatusCodes.METHOD_NOT_ALLOWED, HttpStatusCodesDescriptions.METHOD_NOT_ALLOWED),
  INTERNAL_SERVER_RESPONSE: createErrorResponse(HttpStatusCodes.INTERNAL_SERVER, HttpStatusCodesDescriptions.INTERNAL_SERVER),
  UNAVAILABLE: createErrorResponse(HttpStatusCodes.UNAVAILABLE, HttpStatusCodesDescriptions.UNAVAILABLE),
};
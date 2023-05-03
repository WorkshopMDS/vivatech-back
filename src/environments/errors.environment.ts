import { HttpStatusCodes, HttpStatusCodesDescriptions } from './httpStatusCodes.environment';
import type { IApiResponseInterface } from '../types/apiReponse.type';

const name = 'Error';

function createErrorResponse(
  httpStatusCode: HttpStatusCodes,
  description: HttpStatusCodesDescriptions
): IApiResponseInterface {
  return {
    name,
    httpStatusCode,
    description,
  };
}

export const Errors = {
  BAD_REQUEST_RESPONSE: createErrorResponse(HttpStatusCodes.BAD_REQUEST, HttpStatusCodesDescriptions.BAD_REQUEST),
  UNAUTHORIZED_RESPONSE: createErrorResponse(HttpStatusCodes.UNAUTHORIZED, HttpStatusCodesDescriptions.UNAUTHORIZED),
  FORBIDDEN_RESPONSE: createErrorResponse(HttpStatusCodes.FORBIDDEN, HttpStatusCodesDescriptions.FORBIDDEN),
  NOT_FOUND_RESPONSE: createErrorResponse(HttpStatusCodes.NOT_FOUND, HttpStatusCodesDescriptions.NOT_FOUND),
  METHOD_NOT_ALLOWED_RESPONSE: createErrorResponse(
    HttpStatusCodes.METHOD_NOT_ALLOWED,
    HttpStatusCodesDescriptions.METHOD_NOT_ALLOWED
  ),
  INTERNAL_SERVER_RESPONSE: createErrorResponse(
    HttpStatusCodes.INTERNAL_SERVER,
    HttpStatusCodesDescriptions.INTERNAL_SERVER
  ),
  UNAVAILABLE: createErrorResponse(HttpStatusCodes.UNAVAILABLE, HttpStatusCodesDescriptions.UNAVAILABLE),
};

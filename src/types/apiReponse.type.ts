import { HttpStatusCodes, HttpStatusCodesDescriptions } from "../environments/httpStatusCodes.environment";

export interface ApiResponseInterface {
  name: string;
  httpStatusCode: HttpStatusCodes;
  description: HttpStatusCodesDescriptions;
  isOperational?: boolean;
  data?: object | undefined;
};
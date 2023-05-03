import type { HttpStatusCodes, HttpStatusCodesDescriptions } from '../environments/httpStatusCodes.environment';

export interface IApiResponseInterface {
  name: string;
  httpStatusCode: HttpStatusCodes;
  description: HttpStatusCodesDescriptions;
  isOperational?: boolean;
  data?: object | undefined;
}

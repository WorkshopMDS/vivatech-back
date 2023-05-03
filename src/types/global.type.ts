import type { Request } from 'express';

import type { IUser } from './user.type';
import type { HttpStatusCodes, HttpStatusCodesDescriptions } from '../environments/httpStatusCodes.environment';

export interface IRequest extends Request {
  user?: Pick<IUser, 'id' | 'email' | 'role'>;
}

export interface ILinks {
  type: {
    type: string;
    enum: ['facebook', 'twitter', 'instagram', 'linkedin', 'github', 'website', 'other'];
  };
  url: String;
}

export interface IApiResponse {
  name: string;
  httpStatusCode: HttpStatusCodes;
  description: HttpStatusCodesDescriptions;
  isOperational?: boolean;
  data?: object | undefined;
}

export interface IErrorResponse extends IApiResponse {
  message?: string;
  timestamp: number;
}

import type { Request } from 'express';

import type { IUser } from './user.type';

export interface IRequest extends Request {
  user?: Pick<IUser, 'id' | 'email' | 'role'>;
}

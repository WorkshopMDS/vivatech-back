import type { Request } from 'express';

import type { IUser } from './user.type';

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

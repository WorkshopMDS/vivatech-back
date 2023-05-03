import type { Document } from 'mongoose';

import type { IUser } from './user.type';

export interface ITicket extends Document {
  ticketId: string;
  user: IUser;
  validityPeriod: Date[];
  buyDate: Date;
  updatedAt: Date;
}

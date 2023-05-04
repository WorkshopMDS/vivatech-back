import type { Document } from 'mongoose';

import type { IUser } from './user.type';

export interface ITalk extends Document {
  title: string;
  description: string;
  speaker: IUser;
  startDate: Date;
  endDate: Date;
  stage: number;
}

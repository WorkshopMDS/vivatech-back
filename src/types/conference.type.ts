import type { Document } from 'mongoose';

import type { IUpdatedBy, ITimestamp } from './global.type';
import type { IUser } from './user.type';

export interface IConference extends Document, ITimestamp {
  title: string;
  slug: string;
  description?: string;
  speaker: IUser;
  startDate?: Date;
  endDate?: Date;
  stage?: number;
  createdBy?: IUser | string;
  updatedBy?: IUpdatedBy[];
  isPublished: boolean;
}

import type { Document } from 'mongoose';

import type { IUser } from './user.type';

export interface IConference extends Document {
  title: string;
  slug: string;
  description?: string;
  speaker: IUser;
  startDate?: Date;
  endDate?: Date;
  stage?: number;
  isPublished: boolean;
}

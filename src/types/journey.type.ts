import type { Document } from 'mongoose';

import type { IUpdatedBy, ITimestamp } from './global.type';
import type { IInterest } from './interest.type';
import type { IUser } from './user.type';

export interface IAnswer {
  value: number;
  description: string;
}

export interface IQuestion {
  question: string;
  description: string;
  image: string;
  answers: IAnswer[];
  correctAnswers: number[];
}

export interface IJourney extends Document, ITimestamp {
  title: string;
  description?: string;
  interests: IInterest[];
  questions: IQuestion[];
  createdBy: IUser | string;
  editedBy: IUpdatedBy[];
}

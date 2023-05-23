import type { Document } from 'mongoose';

import type { IInterest } from './interest.type';

export interface IExhibitor extends Document {
  name: String;
  picture: String;
  place: String;
  sectors: String[];
  interests: IInterest[];
}

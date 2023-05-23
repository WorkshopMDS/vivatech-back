import type { Document } from 'mongoose';

import type { ITimestamp } from './global.type';
import type { IInterest } from './interest.type';

export interface IExhibitor extends Document, ITimestamp {
  name: String;
  picture: String;
  place: String;
  sectors: String[];
  interests: IInterest[];
}

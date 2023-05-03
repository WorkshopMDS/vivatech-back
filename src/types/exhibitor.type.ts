import type { Document } from 'mongoose';

export interface IExhibitor extends Document {
  name: String;
  picture: String;
  place: String;
  sectors: Array<String>;
  interests: Array<String>;
}

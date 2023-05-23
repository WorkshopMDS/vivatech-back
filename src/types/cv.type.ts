import type { Document } from 'mongoose';

export interface ICV extends Document {
  base64: string;
}

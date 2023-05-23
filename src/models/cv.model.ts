import { model, Schema } from 'mongoose';

import type { ICV } from '../types/cv.type';

const cvSchema: Schema = new Schema(
  {
    base64: String,
  },
  { timestamps: true }
);

cvSchema.set('toJSON', {
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

export default model<ICV>('CV', cvSchema);

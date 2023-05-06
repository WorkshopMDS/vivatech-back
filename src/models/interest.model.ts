import { model, Schema } from 'mongoose';

import type { IInterest } from '../types/interest.type';

const interestSchema: Schema = new Schema({
  label: {
    type: String,
    required: true,
  },
});

interestSchema.set('toJSON', {
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

export default model<IInterest>('Interests', interestSchema);

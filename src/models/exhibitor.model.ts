import { model, Schema } from 'mongoose';

import type { IExhibitor } from '../types/exhibitor.type';

const exhibitorSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  picture: String,
  place: String,
  sectors: Array<String>,
  interests: {
    type: Schema.Types.ObjectId,
    ref: 'Interests',
  },
});

exhibitorSchema.set('toJSON', {
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

export default model<IExhibitor>('Exhibitor', exhibitorSchema);

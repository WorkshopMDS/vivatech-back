import { model, Schema } from 'mongoose';

import type { ITalk } from '../types/talk.type';

const talkSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    speaker: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    startDate: {
      type: Schema.Types.Date,
      required: true,
    },
    endDate: {
      type: Schema.Types.Date,
      required: true,
    },
    stage: {
      type: Number,
      required: true,
      default: null,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
    },
  },
  { timestamps: true }
);

talkSchema.set('toJSON', {
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

export default model<ITalk>('Talks', talkSchema);

import { model, Schema } from 'mongoose';

import type { ITalk } from '../types/talk.type';
import { generateSlug } from '../utils/functions';

const talkSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    description: String,
    speaker: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    startAt: Schema.Types.Date,
    endAt: Schema.Types.Date,
    stage: Number,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

talkSchema.pre('save', async function (this, next) {
  this.slug = generateSlug(this.title);
  next();
});

talkSchema.set('toJSON', {
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

export default model<ITalk>('Talks', talkSchema);

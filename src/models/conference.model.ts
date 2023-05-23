import { model, Schema } from 'mongoose';

import type { IConference } from '../types/conference.type';
import { generateSlug } from '../utils/functions';

const conferenceSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      unique: true,
      editable: false,
    },
    description: String,
    speaker: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Users',
      },
    ],
    startAt: Schema.Types.Date,
    endAt: Schema.Types.Date,
    stage: Number,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
      editable: false,
    },
    updatedBy: [
      {
        time: {
          type: Date,
          default: new Date(),
          editable: false,
        },
        user: {
          type: Schema.Types.ObjectId,
          ref: 'Users',
          required: true,
        },
      },
    ],
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

conferenceSchema.pre('save', async function (this, next) {
  this.slug = generateSlug(this.title);
  next();
});

conferenceSchema.pre('findOneAndUpdate', async function (this, next) {
  const update: any = { ...this.getUpdate() };
  if (!update.$set.title) return next();

  try {
    const slug = generateSlug(update.$set.title);
    this.updateOne({}, { $set: { slug } });
  } catch (error: any) {
    return next(error);
  }
  return next();
});

conferenceSchema.set('toJSON', {
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

export default model<IConference>('Conferences', conferenceSchema);

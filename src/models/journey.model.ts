import { model, Schema } from 'mongoose';

import type { IJourney } from '../types/journey.type';

const journeySchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    interests: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Interests',
        required: true,
      },
    ],
    questions: [
      {
        question: String,
        description: String,
        image: String,
        answers: [
          {
            value: Number,
            description: String,
          },
        ],
        correctAnswers: [Number],
      },
    ],
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    editedBy: [
      {
        date: {
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
  {
    timestamps: true,
  }
);

journeySchema.set('toJSON', {
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

export default model<IJourney>('Journeys', journeySchema);

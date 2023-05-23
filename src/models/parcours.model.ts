import { model, Schema } from 'mongoose';

import type { IParcours } from '../types/parcours.type';

const parcoursSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    interests: {
      type: String, // TODO: change this to ObjectId and link it to interests model
    },
    questions: [
      {
        question: String,
        description: String,
        image: String,
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

parcoursSchema.set('toJSON', {
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

export default model<IParcours>('Parcours', parcoursSchema);

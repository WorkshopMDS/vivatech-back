import { model, Schema } from 'mongoose';

import type { IExhibitor } from '../types/exhibitor';

const exhibitorSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    picture: {
      type: String,
    },
    place: {
      type: String,
    },
    sectors: {
      type: Array<String>,
    },
    interests: {
      type: Array<String>,
    }
  }
);

export default model<IExhibitor>('Exhibitor', exhibitorSchema);

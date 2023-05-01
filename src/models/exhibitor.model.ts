import { model, Schema } from 'mongoose';

import type { IExhibitor } from '../types/exhibitor.type';

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

const ExhibitorModel = model<IExhibitor>('Exhibitor', exhibitorSchema);

export default ExhibitorModel;

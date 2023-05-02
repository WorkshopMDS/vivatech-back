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
  interests: Array<String>,
});

const ExhibitorModel = model<IExhibitor>('Exhibitor', exhibitorSchema);

export default ExhibitorModel;

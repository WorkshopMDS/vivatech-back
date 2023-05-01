import { model, Schema } from 'mongoose';

import type { IUser } from '../types/user.type';

const userSchema: Schema = new Schema(
  {
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    email: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default model<IUser>('User', userSchema);

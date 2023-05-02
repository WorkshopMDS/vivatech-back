import bcrypt from 'bcrypt';
import { model, Schema } from 'mongoose';

import type { IUserDocument } from '../types/user.type';
import { Roles } from '../utils/roles';

const userSchema: Schema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      required: [true, 'Email not provided'],
      validate: {
        validator(value: string) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: '{VALUE} is not a valid email!',
      },
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    firstname: String,
    lastname: String,
    role: {
      type: Number,
      enum: Roles,
      default: Roles.USER,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', function (this, next) {
  if (!this.isModified('password')) return next();

  return bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    return bcrypt.hash(this.password, salt, (error, hash) => {
      if (error) {
        return next(error);
      }
      this.password = hash;
      return next();
    });
  });
});

userSchema.methods.isPasswordValid = function (password: string) {
  return bcrypt.compareSync(password, this.password);
};

export default model<IUserDocument>('Users', userSchema);

import bcrypt from 'bcrypt';
import { model, Schema } from 'mongoose';

import type { IUserDocument } from '../types/user.type';
import { hashPassword } from '../utils/functions';
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

userSchema.pre('save', async function (this, next) {
  if (!this.isModified('password')) return next();
  try {
    this.password = await hashPassword(this.password);
  } catch (error: any) {
    return next(error);
  }
  return next();
});

userSchema.pre('findOneAndUpdate', async function (this, next) {
  const update: any = { ...this.getUpdate() };
  if (!update.$set.password) return next();

  try {
    const hashedPassword = await hashPassword(update.$set.password);
    this.updateOne({}, { $set: { password: hashedPassword } });
  } catch (error: any) {
    return next(error);
  }
  return next();
});

userSchema.methods.isPasswordValid = function (password: string) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.set('toJSON', {
  transform(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

export default model<IUserDocument>('Users', userSchema);

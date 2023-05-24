import type { Document, Schema } from 'mongoose';

import type { ILinks, ITimestamp } from './global.type';
import type { IInterest } from './interest.type';

export interface IUser extends ITimestamp {
  id: string;
  email: string;
  password: string;
  firstname?: string;
  lastname?: string;
  role: number;
  picture?: string;
  biography?: string;
  links?: ILinks[];
  company?: {
    name: string;
    title: string;
  };
  accessToken?: string;
  refreshToken?: string;
  isSpeaker?: boolean;
  cv?: {
    type: Schema.Types.ObjectId;
    ref: 'CV';
  };
  cvScanned?: [
    {
      type: Schema.Types.ObjectId;
      ref: 'CV';
    }
  ];
  interests?: IInterest[];
}

export interface IUserDocument extends IUser, Omit<Document, 'id'> {
  isPasswordValid: (password: string) => Promise<boolean>;
}

export interface IUserData extends Pick<IUser, 'id' | 'email' | 'role' | 'firstname' | 'lastname' | 'cv'> {}

import type { Document, Schema } from 'mongoose';

import type { ILinks } from './global.type';

export interface IUser {
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
}

export interface IUserDocument extends IUser, Omit<Document, 'id'> {
  isPasswordValid: (password: string) => Promise<boolean>;
}

export interface IUserData extends Pick<IUser, 'id' | 'email' | 'role' | 'firstname' | 'lastname' | 'cv'> {}

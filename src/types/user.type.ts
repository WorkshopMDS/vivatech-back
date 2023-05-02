import type { Document } from 'mongoose';

export interface IUser {
  id: string;
  email: string;
  password: string;
  firstname: string;
  lastname: string;
  role: number;
  accessToken: string;
  refreshToken: string;
}

export interface IUserDocument extends IUser, Omit<Document, 'id'> {
  isPasswordValid: (password: string) => Promise<boolean>;
}

export interface IUserData extends Pick<IUser, 'id' | 'email' | 'role'> {}

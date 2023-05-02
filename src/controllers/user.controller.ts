import type { Response, Request } from 'express';

import User from '../models/user.model';
import type { IUser } from '../types/user.type';

export const getUsers = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users: IUser[] = await User.find();
    res.status(200).json({ users });
  } catch (error) {
    throw error;
  }
};

export const registerUser = () => {};
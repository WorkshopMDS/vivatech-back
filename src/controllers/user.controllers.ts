import type { Response, Request } from 'express';
import type { Secret } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

import User from '../models/user.model';
import type { IRequest } from '../types/global.type';
import type { IUser, IUserData, IUserDocument } from '../types/user.type';
import { errorFormatter, ErrorMessages } from '../utils/errors';

export const generateAccessToken = (user: IUserData) =>
  jwt.sign(user, process.env.ACCESS_TOKEN_SECRET as Secret, { expiresIn: '1800s' });
export const generateRefreshToken = (user: IUserData) =>
  jwt.sign(user, process.env.REFRESH_TOKEN_SECRET as Secret, { expiresIn: '1y' });

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstname, lastname, email, password } = req.body;

    if (!email || !password) {
      errorFormatter(res, 400, ErrorMessages.MALFORMED_DATA);
      return;
    }

    const isEmailExist = await User.exists({ email });
    if (isEmailExist) {
      errorFormatter(res, 409, ErrorMessages.ALREADY_EXIST);
      return;
    }

    const user: IUserDocument = new User({
      firstname,
      lastname,
      email,
      password,
    });
    await user.save();

    const returnedData = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    res.status(201).json({
      accessToken: generateAccessToken(returnedData),
      refreshToken: generateRefreshToken(returnedData),
    });
  } catch (error) {
    errorFormatter(res, 400, ErrorMessages.SERVER_ERROR, error);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      errorFormatter(res, 400, ErrorMessages.MALFORMED_DATA);
      return;
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      errorFormatter(res, 400, ErrorMessages.CONNECTION_ERROR);
      return;
    }

    const isValid = await user.isPasswordValid(password);
    if (!isValid) {
      errorFormatter(res, 400, ErrorMessages.CONNECTION_ERROR);
      return;
    }

    const returnedData = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    res.status(200).json({
      accessToken: generateAccessToken(returnedData),
      refreshToken: generateRefreshToken(returnedData),
    });
  } catch (error) {
    errorFormatter(res, 400, ErrorMessages.SERVER_ERROR, error);
  }
};

export const getUsers = async (_: Request, res: Response): Promise<void> => {
  try {
    const users: IUser[] = await User.find().select(['-__v', '-_id']);
    res.status(200).json({ users });
  } catch (error) {
    throw error;
  }
};

export const getUser = async (req: IRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!userId && !req.user?.id) {
      errorFormatter(res, 400, ErrorMessages.MALFORMED_DATA);
      return;
    }

    const user: IUser | null = await User.findById(userId || req.user?.id).select(['-__v', '-_id']);
    if (!user) {
      errorFormatter(res, 400, ErrorMessages.MALFORMED_DATA);
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    errorFormatter(res, 400, ErrorMessages.SERVER_ERROR, error);
  }
};

export const deleteUser = async (req: IRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    if (!userId && !req.user?.id) {
      errorFormatter(res, 400, ErrorMessages.MALFORMED_DATA);
      return;
    }

    const user: IUser | null = await User.findByIdAndDelete(userId || req.user?.id).select(['-__v', '-_id']);
    if (!user) {
      errorFormatter(res, 400, ErrorMessages.NOT_FOUND);
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    errorFormatter(res, 400, ErrorMessages.SERVER_ERROR, error);
  }
};

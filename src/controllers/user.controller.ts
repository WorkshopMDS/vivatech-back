import type { Response, Request } from 'express';
import type { Secret } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

import User from '../models/user.model';
import type { IRequest } from '../types/global.type';
import type { IUser, IUserData, IUserDocument } from '../types/user.type';
import { errorFormatter, ErrorMessages } from '../utils/errors';
import { Roles } from '../utils/roles';

export const generateAccessToken = (user: IUserData) =>
  jwt.sign(user, process.env.ACCESS_TOKEN_SECRET as Secret, { expiresIn: '1800s' });
export const generateRefreshToken = (user: IUserData) =>
  jwt.sign(user, process.env.REFRESH_TOKEN_SECRET as Secret, { expiresIn: '1y' });

export const register = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { firstname, lastname, email, password } = req.body;

    if (!email || !password) {
      return errorFormatter(res, 400, ErrorMessages.MALFORMED_DATA);
    }

    const isEmailExist = await User.exists({ email });
    if (isEmailExist) {
      return errorFormatter(res, 400, ErrorMessages.ALREADY_EXIST);
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

    return res.status(201).json({
      accessToken: generateAccessToken(returnedData),
      refreshToken: generateRefreshToken(returnedData),
    });
  } catch (error) {
    return errorFormatter(res, 400, ErrorMessages.SERVER_ERROR, error);
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorFormatter(res, 400, ErrorMessages.MALFORMED_DATA);
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return errorFormatter(res, 400, ErrorMessages.CONNECTION_ERROR);
    }

    const isValid = await user.isPasswordValid(password);
    if (!isValid) {
      return errorFormatter(res, 400, ErrorMessages.CONNECTION_ERROR);
    }

    const returnedData = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    return res.status(200).json({
      accessToken: generateAccessToken(returnedData),
      refreshToken: generateRefreshToken(returnedData),
    });
  } catch (error) {
    return errorFormatter(res, 400, ErrorMessages.SERVER_ERROR, error);
  }
};

export const getUsers = async (_: Request, res: Response): Promise<Response> => {
  try {
    const users: IUser[] = await User.find().select('-id');
    return res.status(200).json({ users });
  } catch (error) {
    return errorFormatter(res, 400, ErrorMessages.SERVER_ERROR, error);
  }
};

export const getUser = async (req: IRequest, res: Response): Promise<Response> => {
  try {
    const { userId } = req.params;

    if (!userId && !req.user?.id) {
      return errorFormatter(res, 400, ErrorMessages.MALFORMED_DATA);
    }

    const user: IUser | null = await User.findById(userId || req.user?.id);
    if (!user) {
      return errorFormatter(res, 400, ErrorMessages.MALFORMED_DATA);
    }

    return res.status(200).json(user);
  } catch (error) {
    return errorFormatter(res, 400, ErrorMessages.SERVER_ERROR, error);
  }
};

export const updateUser = async (req: IRequest, res: Response): Promise<Response> => {
  try {
    const { userId } = req.params;
    const { firstname, lastname, email, password, role } = req.body;

    if ((!userId && !req.user?.id) || req.body === null) {
      return errorFormatter(res, 400, ErrorMessages.MALFORMED_DATA);
    }

    const update = {
      firstname,
      lastname,
      email,
      password,
      ...(req.user?.role === Roles.ADMIN && { role }),
    };

    const user: IUser | null = await User.findByIdAndUpdate(
      userId || req.user?.id,
      { $set: update },
      { returnDocument: 'after' }
    ).select('-id');
    if (!user) {
      return errorFormatter(res, 400, ErrorMessages.NOT_FOUND);
    }

    return res.status(200).json(user);
  } catch (error) {
    return errorFormatter(res, 400, ErrorMessages.SERVER_ERROR, error);
  }
};

export const deleteUser = async (req: IRequest, res: Response): Promise<Response> => {
  try {
    const { userId } = req.params;

    if (!userId && !req.user?.id) {
      return errorFormatter(res, 400, ErrorMessages.MALFORMED_DATA);
    }

    const user: IUser | null = await User.findByIdAndDelete(userId || req.user?.id).select('-id');
    if (!user) {
      return errorFormatter(res, 400, ErrorMessages.NOT_FOUND);
    }

    return res.status(200).json(user);
  } catch (error) {
    return errorFormatter(res, 400, ErrorMessages.SERVER_ERROR, error);
  }
};

export const refreshAccessToken = async (req: Request, res: Response): Promise<Response> => {
  const authHeader = req.headers.authorization;
  const refreshToken = authHeader && authHeader.split(' ')[1];

  if (refreshToken == null) {
    return errorFormatter(res, 401, ErrorMessages.UNAUTHORIZED);
  }

  try {
    const jwtData = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as Secret) as jwt.JwtPayload;
    delete jwtData.iat;
    delete jwtData.exp;
    const user = jwtData as IUserData;

    const isUserExist = await User.exists({ email: user.email });
    if (!isUserExist) {
      return errorFormatter(res, 400, ErrorMessages.TOKEN_ERROR);
    }

    return res.status(200).json({ accessToken: generateAccessToken(user) });
  } catch (error) {
    return errorFormatter(res, 400, ErrorMessages.SERVER_ERROR, error);
  }
};

/**
 * SPEAKERS
 */

export const getSpeakers = async (_: Request, res: Response): Promise<Response> => {
  try {
    const speakers: IUser[] = await User.find({ role: Roles.SPEAKER });
    return res.status(200).json({ speakers });
  } catch (error) {
    return errorFormatter(res, 400, ErrorMessages.SERVER_ERROR, error);
  }
};

export const setUserAsSpeaker = async (req: IRequest, res: Response): Promise<Response> => {
  try {
    const { email, firstname, lastname, password } = req.body;

    const updateSpeaker: IUser | null = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          role: Roles.SPEAKER,
        },
      },
      { returnDocument: 'after' }
    ).select('-id');
    if (!updateSpeaker) {
      const speaker: IUserDocument = new User({
        firstname,
        lastname,
        email,
        password,
        role: Roles.SPEAKER,
      });
      await speaker.save();

      return res.status(201).json(speaker);
    }

    return res.status(200).json(updateSpeaker);
  } catch (error) {
    return errorFormatter(res, 400, ErrorMessages.SERVER_ERROR, error);
  }
};

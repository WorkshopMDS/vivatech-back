import type { Response, Request } from 'express';
import type { Secret } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

import { Errors } from '../environments/errors.environment';
import { HttpStatusCodes, HttpStatusCodesDescriptions } from '../environments/httpStatusCodes.environment';
import User from '../models/user.model';
import type { IRequest } from '../types/global.type';
import type { IUser, IUserData, IUserDocument } from '../types/user.type';
import { ApiResponse } from '../utils/apiResponse';
import { Roles } from '../utils/roles';

export const generateAccessToken = (user: IUserData) =>
  jwt.sign(user, process.env.ACCESS_TOKEN_SECRET as Secret, { expiresIn: '1800s' });
export const generateRefreshToken = (user: IUserData) =>
  jwt.sign(user, process.env.REFRESH_TOKEN_SECRET as Secret, { expiresIn: '1y' });

export const register = async (req: Request, res: Response): Promise<ApiResponse> => {
  try {
    const { firstname, lastname, email, password } = req.body;

    if (!email || !password) {
      return new ApiResponse(res, Errors.BAD_REQUEST_RESPONSE);
    }

    const isEmailExist = await User.exists({ email });
    if (isEmailExist) {
      return new ApiResponse(res, Errors.BAD_REQUEST_RESPONSE);
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

    return new ApiResponse(res, {
      name: 'Success',
      httpStatusCode: HttpStatusCodes.CREATED,
      description: HttpStatusCodesDescriptions.CREATED,
      data: {
        accessToken: generateAccessToken(returnedData),
        refreshToken: generateRefreshToken(returnedData),
      },
    });
  } catch (error) {
    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, error);
  }
};

export const login = async (req: Request, res: Response): Promise<ApiResponse> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return new ApiResponse(res, Errors.BAD_REQUEST_RESPONSE);
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return new ApiResponse(res, Errors.BAD_REQUEST_RESPONSE);
    }

    const isValid = await user.isPasswordValid(password);
    if (!isValid) {
      return new ApiResponse(res, Errors.BAD_REQUEST_RESPONSE);
    }

    const returnedData = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    return new ApiResponse(res, {
      name: 'Success',
      httpStatusCode: HttpStatusCodes.SUCCESS,
      description: HttpStatusCodesDescriptions.SUCCESS,
      data: {
        accessToken: generateAccessToken(returnedData),
        refreshToken: generateRefreshToken(returnedData),
      },
    });
  } catch (error) {
    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, error);
  }
};

export const getUsers = async (_: Request, res: Response): Promise<ApiResponse> => {
  try {
    const users: IUser[] = await User.find().populate('interests').select('-id');
    return new ApiResponse(res, {
      name: 'Success',
      httpStatusCode: HttpStatusCodes.SUCCESS,
      description: HttpStatusCodesDescriptions.SUCCESS,
      data: users,
    });
  } catch (error) {
    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, error);
  }
};

export const getUser = async (req: IRequest, res: Response): Promise<ApiResponse> => {
  try {
    const { userId } = req.params;

    if (!userId && !req.user?.id) {
      return new ApiResponse(res, Errors.BAD_REQUEST_RESPONSE);
    }

    const user: IUser | null = await User.findById(userId || req.user?.id).populate('interests');
    if (!user) {
      return new ApiResponse(res, Errors.BAD_REQUEST_RESPONSE);
    }

    return new ApiResponse(res, {
      name: 'Success',
      httpStatusCode: HttpStatusCodes.SUCCESS,
      description: HttpStatusCodesDescriptions.SUCCESS,
      data: user,
    });
  } catch (error) {
    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, error);
  }
};

export const updateUser = async (req: IRequest, res: Response): Promise<ApiResponse> => {
  try {
    const { userId } = req.params;
    const { firstname, lastname, email, password, role, ...rest } = req.body;

    if ((!userId && !req.user?.id) || req.body === null) {
      return new ApiResponse(res, Errors.BAD_REQUEST_RESPONSE);
    }

    const update = {
      firstname,
      lastname,
      email,
      password,
      ...(req.user?.role === Roles.ADMIN && { role }),
      ...rest,
    };

    const user: IUser | null = await User.findByIdAndUpdate(
      userId || req.user?.id,
      { $set: update },
      { returnDocument: 'after' }
    ).select('-id');
    if (!user) {
      return new ApiResponse(res, Errors.NOT_FOUND_RESPONSE);
    }

    return new ApiResponse(res, {
      name: 'Success',
      httpStatusCode: HttpStatusCodes.SUCCESS,
      description: HttpStatusCodesDescriptions.SUCCESS,
      data: user,
    });
  } catch (error) {
    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, error);
  }
};

export const deleteUser = async (req: IRequest, res: Response): Promise<ApiResponse> => {
  try {
    const { userId } = req.params;

    if (!userId && !req.user?.id) {
      return new ApiResponse(res, Errors.BAD_REQUEST_RESPONSE);
    }

    const user: IUser | null = await User.findByIdAndDelete(userId || req.user?.id).select('-id');
    if (!user) {
      return new ApiResponse(res, Errors.NOT_FOUND_RESPONSE);
    }

    return new ApiResponse(res, {
      name: 'Success',
      httpStatusCode: HttpStatusCodes.SUCCESS,
      description: HttpStatusCodesDescriptions.SUCCESS,
      data: user,
    });
  } catch (error) {
    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, error);
  }
};

export const refreshAccessToken = async (req: Request, res: Response): Promise<ApiResponse> => {
  const authHeader = req.headers.authorization;
  const refreshToken = authHeader && authHeader.split(' ')[1];

  if (refreshToken == null) {
    return new ApiResponse(res, Errors.UNAUTHORIZED_RESPONSE);
  }

  try {
    const jwtData = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as Secret) as jwt.JwtPayload;
    delete jwtData.iat;
    delete jwtData.exp;
    const user = jwtData as IUserData;

    const isUserExist = await User.exists({ email: user.email });
    if (!isUserExist) {
      return new ApiResponse(res, Errors.NOT_FOUND_RESPONSE);
    }

    return new ApiResponse(res, {
      name: 'Success',
      httpStatusCode: HttpStatusCodes.SUCCESS,
      description: HttpStatusCodesDescriptions.SUCCESS,
      data: { accessToken: generateAccessToken(user) },
    });
  } catch (error) {
    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, error);
  }
};

/**
 * SPEAKERS
 */

export const getSpeaker = async (req: IRequest, res: Response): Promise<ApiResponse> => {
  try {
    const { speakerId } = req.params;

    if (!speakerId) {
      return new ApiResponse(res, Errors.BAD_REQUEST_RESPONSE);
    }

    const speaker: IUser | null = await User.findById(speakerId).select([
      'firstname',
      'lastname',
      'biography',
      'picture',
      'company',
      'links',
    ]);
    if (!speaker) {
      return new ApiResponse(res, Errors.NOT_FOUND_RESPONSE);
    }

    return new ApiResponse(res, {
      name: 'Success',
      httpStatusCode: HttpStatusCodes.SUCCESS,
      description: HttpStatusCodesDescriptions.SUCCESS,
      data: speaker,
    });
  } catch (error) {
    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, error);
  }
};

export const getSpeakers = async (_: Request, res: Response): Promise<ApiResponse> => {
  try {
    const speakers: IUser[] = await User.find({ role: Roles.SPEAKER }).select([
      'firstname',
      'lastname',
      'biography',
      'picture',
      'company',
      'links',
    ]);
    return new ApiResponse(res, {
      name: 'Success',
      httpStatusCode: HttpStatusCodes.SUCCESS,
      description: HttpStatusCodesDescriptions.SUCCESS,
      data: speakers,
    });
  } catch (error) {
    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, error);
  }
};

export const setUserAsSpeaker = async (req: IRequest, res: Response): Promise<ApiResponse> => {
  try {
    const { email, firstname, lastname, company, ...rest } = req.body;

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
      if (!firstname || !lastname || !company) {
        return new ApiResponse(res, Errors.BAD_REQUEST_RESPONSE);
      }

      const speaker: IUserDocument = new User({
        firstname,
        lastname,
        email,
        company,
        ...rest,
        role: Roles.SPEAKER,
      });
      await speaker.save();

      return new ApiResponse(res, {
        name: 'Success',
        httpStatusCode: HttpStatusCodes.CREATED,
        description: HttpStatusCodesDescriptions.CREATED,
        data: speaker,
      });
    }

    return new ApiResponse(res, {
      name: 'Success',
      httpStatusCode: HttpStatusCodes.SUCCESS,
      description: HttpStatusCodesDescriptions.SUCCESS,
      data: updateSpeaker,
    });
  } catch (error) {
    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, error);
  }
};

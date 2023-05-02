import type { NextFunction, Response } from 'express';
import type { Secret } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';

import { generateAccessToken } from '../controllers/user.controllers';
import UserModel from '../models/user.model';
import type { IRequest } from '../types/global.type';
import type { IUserData } from '../types/user.type';
import { errorFormatter, ErrorMessages } from '../utils/errors';
import { generateComplexPassword } from '../utils/functions';

export const createUserIfNotExist = async (req: IRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  // Use user account if is connected
  if (token != null) return next();

  try {
    const newUser = new UserModel({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: generateComplexPassword(),
    });
    await newUser.save();

    // Set an access token to use API
    req.headers.authorization = `Bearer ${generateAccessToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    })}`;

    return next();
  } catch (error) {
    return errorFormatter(res, 401, ErrorMessages.SERVER_ERROR, error);
  }
};

export const isAuthenticated = (req: IRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return errorFormatter(res, 401, 'Unauthorized');
  try {
    const jwtReturn = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as Secret) as jwt.JwtPayload;
    delete jwtReturn.iat;
    delete jwtReturn.exp;

    req.user = jwtReturn as IUserData;
    return next();
  } catch (error) {
    return errorFormatter(res, 401, ErrorMessages.NOT_AUTHORIZED, error);
  }
};

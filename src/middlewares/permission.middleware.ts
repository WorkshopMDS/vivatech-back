import type { NextFunction, Response } from 'express';
import mongoose from 'mongoose';

import type { IRequest } from '../types/global.type';
import { errorFormatter, ErrorMessages } from '../utils/errors';
import { Roles } from '../utils/roles';

export const isInGroup = (rolesGranted: number[]) => (req: IRequest, res: Response, next: NextFunction) => {
  if (!req.user?.role) return errorFormatter(res, 401, ErrorMessages.UNAUTHORIZED);

  const roles = [...rolesGranted];

  const isGranted = roles.includes(req.user?.role);
  if (!isGranted) return errorFormatter(res, 403, ErrorMessages.FORBIDDEN);

  return next();
};

export const checkOwnership =
  (modelName: string, paramName: string, ownerIdPath: string) =>
  async (req: IRequest, res: Response, next: NextFunction) => {
    try {
      const dataId = req.params[paramName];
      const userId = req.user?.id;
      const role = req.user?.role;
      const isValidObjectId = mongoose.Types.ObjectId.isValid(dataId);
      if (!isValidObjectId) {
        return errorFormatter(res, 400, ErrorMessages.MALFORMED_DATA);
      }

      const model = mongoose.model(modelName);
      const doc = await model.findById(dataId);

      if (!doc) {
        return errorFormatter(res, 404, ErrorMessages.NOT_FOUND);
      }

      const ownerId = doc.get(ownerIdPath);

      if (userId !== ownerId.toString() && role !== Roles.ADMIN) {
        return errorFormatter(res, 403, ErrorMessages.NOT_AUTHORIZED);
      }

      return next();
    } catch (err) {
      return errorFormatter(res, 500, ErrorMessages.SERVER_ERROR, err);
    }
  };

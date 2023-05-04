import type { NextFunction, Response } from 'express';
import mongoose from 'mongoose';

import { Errors } from '../environments/errors.environment';
import type { IRequest } from '../types/global.type';
import { ApiResponse } from '../utils/apiResponse';
import { Roles } from '../utils/roles';

export const isInGroup = (rolesGranted: number[]) => (req: IRequest, res: Response, next: NextFunction) => {
  if (!req.user?.role) return new ApiResponse(res, Errors.UNAUTHORIZED_RESPONSE);

  const roles = [...rolesGranted];

  const isGranted = roles.includes(req.user?.role);
  if (!isGranted) return new ApiResponse(res, Errors.FORBIDDEN_RESPONSE);

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
        return new ApiResponse(res, Errors.BAD_REQUEST_RESPONSE);
      }

      const model = mongoose.model(modelName);
      const doc = await model.findById(dataId);

      if (!doc) {
        return new ApiResponse(res, Errors.NOT_FOUND_RESPONSE);
      }

      const ownerId = doc.get(ownerIdPath);

      if (userId !== ownerId.toString() && role !== Roles.ADMIN) {
        return new ApiResponse(res, Errors.FORBIDDEN_RESPONSE);
      }

      return next();
    } catch (err) {
      return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, err);
    }
  };

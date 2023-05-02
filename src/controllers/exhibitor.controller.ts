import type { Response, Request } from 'express';

import Exhibitor from '../models/exhibitor.model';
import type { IExhibitor } from '../types/exhibitor.type';
import { HttpStatusCodes, HttpStatusCodesDescriptions } from '../environments/httpStatusCodes.environment';
import ExhibitorModel from '../models/exhibitor.model';
import { ApiResponse } from '../responses/api.response';
import { Errors } from '../environments/errors.environment';
import { Error } from 'mongoose';

export const getExhibitors = async (_req: Request, res: Response): Promise<void> => {
  try {
    const exhibitors: IExhibitor[] = await Exhibitor.find();
    new ApiResponse(res, {
        name: 'Success',
        httpStatusCode: HttpStatusCodes.SUCCESS,
        description: HttpStatusCodesDescriptions.SUCCESS,
        data: exhibitors,
      });
    return;
  } catch (e) {
    new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, e);
    return;
  }
};

export const getExhibitor = async (req: Request, res: Response): Promise<void> => {
  try {
    const exhibitor: IExhibitor | null = await Exhibitor.findById(req.params.id);

    if (!exhibitor) {
      new ApiResponse(res, Errors.NOT_FOUND_RESPONSE);
      return;
    }

    new ApiResponse(res, {
      name: 'Success',
      httpStatusCode: HttpStatusCodes.SUCCESS,
      description: HttpStatusCodesDescriptions.SUCCESS,
      data: exhibitor,
    });
    return;
  } catch (e) {
    new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, e);
    return;
  }
};

export const addExhibitor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, picture, place, sectors, interests }: IExhibitor = req.body

    if (!name || !picture || !place || !sectors || !interests) {
      new ApiResponse(res, Errors.BAD_REQUEST_RESPONSE);
      return;
    }

    const exhibitor: IExhibitor = new ExhibitorModel({
      name,
      picture,
      place,
      sectors,
      interests,
    });

    await exhibitor.save();
    new ApiResponse(res, {
      name: 'Success',
      httpStatusCode: HttpStatusCodes.CREATED,
      description: HttpStatusCodesDescriptions.CREATED,
      data: exhibitor,
    });
    return;
  } catch (e) {
    new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, e);
    return;
  }
};

export const updateExhibitor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, picture, place, sectors, interests }: IExhibitor = req.body

    if (!name || !picture || !place || !sectors || !interests) {
      new ApiResponse(res, Errors.BAD_REQUEST_RESPONSE);
      return;
    }

    const exhibitor: IExhibitor | null = await Exhibitor.findByIdAndUpdate(
      req.params.id,
      {name, picture, place, sectors, interests},
      {new: true}
    ).select(['-__v']);

    if (!exhibitor) {
      new ApiResponse(res, Errors.NOT_FOUND_RESPONSE);
      return;
    }

    new ApiResponse(res, {
      name: 'Success',
      httpStatusCode: HttpStatusCodes.SUCCESS,
      description: HttpStatusCodesDescriptions.SUCCESS,
      data: exhibitor,
    });
    return;
  } catch (e) {
    new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, e);
    return;
  }
};

export const deleteExhibitor = async (req: Request, res: Response): Promise<void> => {
  try {
    const exhibitor: IExhibitor | null = await Exhibitor.findByIdAndRemove(req.params.id);

    if (!exhibitor) {
      new ApiResponse(res, Errors.NOT_FOUND_RESPONSE);
      return;
    }

    new ApiResponse(res, {
      name: 'Success',
      httpStatusCode: HttpStatusCodes.SUCCESS,
      description: HttpStatusCodesDescriptions.SUCCESS,
    });

    return;
  } catch (e) {
    new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, e);
    return;
  }
};

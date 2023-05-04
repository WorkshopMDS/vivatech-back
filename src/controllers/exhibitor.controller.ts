import type { Response, Request } from 'express';

import { Errors } from '../environments/errors.environment';
import { HttpStatusCodes, HttpStatusCodesDescriptions } from '../environments/httpStatusCodes.environment';
import Exhibitor from '../models/exhibitor.model';
import type { IExhibitor } from '../types/exhibitor.type';
import { ApiResponse } from '../utils/apiResponse';

export const getExhibitors = async (_req: Request, res: Response): Promise<ApiResponse> => {
  try {
    const exhibitors: IExhibitor[] = await Exhibitor.find();
    return new ApiResponse(res, {
      name: 'Success',
      httpStatusCode: HttpStatusCodes.SUCCESS,
      description: HttpStatusCodesDescriptions.SUCCESS,
      data: exhibitors,
    });
  } catch (e) {
    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, e);
  }
};

export const getExhibitor = async (req: Request, res: Response): Promise<ApiResponse> => {
  try {
    const exhibitor: IExhibitor | null = await Exhibitor.findById(req.params.id);

    if (!exhibitor) {
      return new ApiResponse(res, Errors.NOT_FOUND_RESPONSE);
    }

    return new ApiResponse(res, {
      name: 'Success',
      httpStatusCode: HttpStatusCodes.SUCCESS,
      description: HttpStatusCodesDescriptions.SUCCESS,
      data: exhibitor,
    });
  } catch (e) {
    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, e);
  }
};

export const addExhibitor = async (req: Request, res: Response): Promise<ApiResponse> => {
  try {
    const { name, picture, place, sectors, interests }: IExhibitor = req.body;

    if (!name || !picture || !place || !sectors || !interests) {
      return new ApiResponse(res, Errors.BAD_REQUEST_RESPONSE);
    }

    const exhibitor: IExhibitor = new Exhibitor({
      name,
      picture,
      place,
      sectors,
      interests,
    });

    await exhibitor.save();
    return new ApiResponse(res, {
      name: 'Success',
      httpStatusCode: HttpStatusCodes.CREATED,
      description: HttpStatusCodesDescriptions.CREATED,
      data: exhibitor,
    });
  } catch (e) {
    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, e);
  }
};

export const updateExhibitor = async (req: Request, res: Response): Promise<ApiResponse> => {
  try {
    const { name, picture, place, sectors, interests }: IExhibitor = req.body;

    if (!name || !picture || !place || !sectors || !interests) {
      return new ApiResponse(res, Errors.BAD_REQUEST_RESPONSE);
    }

    const exhibitor: IExhibitor | null = await Exhibitor.findByIdAndUpdate(
      req.params.id,
      { name, picture, place, sectors, interests },
      { new: true }
    ).select(['-__v']);

    if (!exhibitor) {
      return new ApiResponse(res, Errors.NOT_FOUND_RESPONSE);
    }

    return new ApiResponse(res, {
      name: 'Success',
      httpStatusCode: HttpStatusCodes.SUCCESS,
      description: HttpStatusCodesDescriptions.SUCCESS,
      data: exhibitor,
    });
  } catch (e) {
    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, e);
  }
};

export const deleteExhibitor = async (req: Request, res: Response): Promise<ApiResponse> => {
  try {
    const exhibitor: IExhibitor | null = await Exhibitor.findByIdAndRemove(req.params.id);

    if (!exhibitor) {
      return new ApiResponse(res, Errors.NOT_FOUND_RESPONSE);
    }

    return new ApiResponse(res, {
      name: 'Success',
      httpStatusCode: HttpStatusCodes.SUCCESS,
      description: HttpStatusCodesDescriptions.SUCCESS,
    });
  } catch (e) {
    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, e);
  }
};

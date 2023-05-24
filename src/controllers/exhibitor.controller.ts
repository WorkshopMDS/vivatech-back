import type { Response, Request } from 'express';
import NodeCache from 'node-cache';

import { FOURDAYSTOSECONDS, SUCCESS } from '../environments/constants.environment';
import { Errors } from '../environments/errors.environment';
import { HttpStatusCodes, HttpStatusCodesDescriptions } from '../environments/httpStatusCodes.environment';
import Exhibitor from '../models/exhibitor.model';
import type { IExhibitor } from '../types/exhibitor.type';
import { ApiResponse } from '../utils/apiResponse';

const cache = new NodeCache({ stdTTL: FOURDAYSTOSECONDS });

export const getExhibitors = async (_req: Request, res: Response): Promise<ApiResponse> => {
  try {
    const cachedExhibitorsFetched: IExhibitor[] | undefined = cache.get('exhibitors');

    if (cachedExhibitorsFetched) {
      SUCCESS.data = cachedExhibitorsFetched;
      return new ApiResponse(res, SUCCESS);
    }

    const exhibitors: IExhibitor[] = await Exhibitor.find().populate('interests');
    const cachedExhibitors: boolean = cache.set('exhibitors', exhibitors);
    if (cachedExhibitors) {
      SUCCESS.data = exhibitors;
      return new ApiResponse(res, SUCCESS);
    }

    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, 'Can not cache data.');
  } catch (e: any) {
    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, e.message);
  }
};

export const getExhibitor = async (req: Request, res: Response): Promise<ApiResponse> => {
  try {
    const { id } = req.params;

    if (!id) {
      return new ApiResponse(res, Errors.BAD_REQUEST_RESPONSE);
    }

    const cachedExhibitorFetched: IExhibitor | undefined = cache.get(`exhibitor_${id}`);

    if (cachedExhibitorFetched) {
      SUCCESS.data = cachedExhibitorFetched;
      return new ApiResponse(res, SUCCESS);
    }

    const exhibitor: IExhibitor | null = await Exhibitor.findById(id).populate('interests');

    if (!exhibitor) {
      return new ApiResponse(res, Errors.NOT_FOUND_RESPONSE);
    }

    const cachedExhibitor: boolean = cache.set(`exhibitor_${id}`, exhibitor);
    if (cachedExhibitor) {
      SUCCESS.data = exhibitor;
      return new ApiResponse(res, SUCCESS);
    }

    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, 'Can not cache data.');
  } catch (e: any) {
    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, e.message);
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
      data: await exhibitor.populate('interests'),
    });
  } catch (e: any) {
    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, e.message);
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

    SUCCESS.data = await exhibitor.populate('interests');
    return new ApiResponse(res, SUCCESS);
  } catch (e: any) {
    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, e.message);
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
  } catch (e: any) {
    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, e.message);
  }
};

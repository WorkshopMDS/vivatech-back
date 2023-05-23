import type { Response, Request } from 'express';
import NodeCache from 'node-cache';

import { FOURDAYSTOSECONDS, SUCCESS } from '../environments/constants.environment';
import { Errors } from '../environments/errors.environment';
import { HttpStatusCodes, HttpStatusCodesDescriptions } from '../environments/httpStatusCodes.environment';
import Cv from '../models/cv.model';
import type { ICV } from '../types/cv.type';
import { ApiResponse } from '../utils/apiResponse';

const cache = new NodeCache({ stdTTL: FOURDAYSTOSECONDS });

export const getCVs = async (_req: Request, res: Response): Promise<ApiResponse> => {
  try {
    const cachedCVsFetched: ICV | undefined = cache.get('CVs');

    if (cachedCVsFetched) {
      SUCCESS.data = cachedCVsFetched;
      return new ApiResponse(res, SUCCESS);
    }

    const cvs: ICV[] = await Cv.find();
    const cachedCVs: boolean = cache.set('CVs', cvs);

    if (cachedCVs) {
      SUCCESS.data = cvs;
      return new ApiResponse(res, SUCCESS);
    }

    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, 'Can not cache data.');
  } catch (e: any) {
    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, e.message);
  }
};

export const getCV = async (req: Request, res: Response): Promise<ApiResponse> => {
  try {
    const { id } = req.params;

    if (!id) {
      return new ApiResponse(res, Errors.BAD_REQUEST_RESPONSE);
    }

    const cachedCVFetched: ICV | undefined = cache.get(`CV_${id}`);

    if (cachedCVFetched) {
      SUCCESS.data = cachedCVFetched;
      return new ApiResponse(res, SUCCESS);
    }

    const cv: ICV | null = await Cv.findById(req.params.id);
    if (!cv) {
      return new ApiResponse(res, Errors.NOT_FOUND_RESPONSE);
    }

    const cachedCV: boolean = cache.set(`CV_${id}`, cv);
    if (cachedCV) {
      SUCCESS.data = cv;
      return new ApiResponse(res, SUCCESS);
    }

    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, 'Can not cache data.');
  } catch (e: any) {
    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, e.message);
  }
};

export const addCv = async (req: Request, res: Response): Promise<ApiResponse> => {
  try {
    const { base64 }: ICV = req.body;

    if (!base64) {
      return new ApiResponse(res, Errors.BAD_REQUEST_RESPONSE);
    }

    const cv: ICV = new Cv({
      base64,
    });

    await cv.save();
    return new ApiResponse(res, {
      name: 'Success',
      httpStatusCode: HttpStatusCodes.CREATED,
      description: HttpStatusCodesDescriptions.CREATED,
      data: cv,
    });
  } catch (e: any) {
    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, e.message);
  }
};

export const updateCV = async (req: Request, res: Response): Promise<ApiResponse> => {
  try {
    const { base64 }: ICV = req.body;

    if (!base64) {
      return new ApiResponse(res, Errors.BAD_REQUEST_RESPONSE);
    }

    const cv: ICV | null = await Cv.findByIdAndUpdate(req.params.id, { base64 }, { new: true }).select(['-__v']);

    if (!cv) {
      return new ApiResponse(res, Errors.NOT_FOUND_RESPONSE);
    }

    SUCCESS.data = cv;
    return new ApiResponse(res, SUCCESS);
  } catch (e: any) {
    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, e.message);
  }
};

export const deleteCV = async (req: Request, res: Response): Promise<ApiResponse> => {
  try {
    const cv: ICV | null = await Cv.findByIdAndRemove(req.params.id);

    if (!cv) {
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

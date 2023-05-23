import type { Response, Request } from 'express';

import { Errors } from '../environments/errors.environment';
import { HttpStatusCodes, HttpStatusCodesDescriptions } from '../environments/httpStatusCodes.environment';
import Cv from '../models/cv.model';
import type { ICV } from '../types/cv.type';
import { ApiResponse } from '../utils/apiResponse';

const success = {
  name: 'Success',
  httpStatusCode: HttpStatusCodes.SUCCESS,
  description: HttpStatusCodesDescriptions.SUCCESS,
  data: {},
};

export const getCVs = async (_req: Request, res: Response): Promise<ApiResponse> => {
  try {
    const cvs: ICV[] = await Cv.find();

    success.data = cvs;
    return new ApiResponse(res, success);
  } catch (e: any) {
    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, e.message);
  }
};

export const getCV = async (req: Request, res: Response): Promise<ApiResponse> => {
  try {
    const cv: ICV | null = await Cv.findById(req.params.id);
    if (!cv) {
      return new ApiResponse(res, Errors.NOT_FOUND_RESPONSE);
    }

    success.data = cv;
    return new ApiResponse(res, success);
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

    success.data = cv;
    return new ApiResponse(res, success);
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

import type { Response, Request } from 'express';
import NodeCache from 'node-cache';

import { FOURDAYSTOSECONDS, SUCCESS } from '../environments/constants.environment';
import { Errors } from '../environments/errors.environment';
import { HttpStatusCodes, HttpStatusCodesDescriptions } from '../environments/httpStatusCodes.environment';
import Interest from '../models/interest.model';
import type { IInterest } from '../types/interest.type';
import { ApiResponse } from '../utils/apiResponse';

const cache = new NodeCache({ stdTTL: FOURDAYSTOSECONDS });

export const getInterests = async (_req: Request, res: Response): Promise<ApiResponse> => {
  try {
    const cachedInterestsFetched: IInterest[] | undefined = cache.get('interests');

    if (cachedInterestsFetched) {
      SUCCESS.data = cachedInterestsFetched;
      return new ApiResponse(res, SUCCESS);
    }

    const interests: IInterest[] = await Interest.find();
    const cachedInterests: boolean = cache.set('interests', interests);

    if (cachedInterests) {
      SUCCESS.data = interests;
      return new ApiResponse(res, SUCCESS);
    }

    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, 'Can not cache data.');
  } catch (e: any) {
    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, e.message);
  }
};

export const getInterest = async (req: Request, res: Response): Promise<ApiResponse> => {
  try {
    const interest: IInterest | null = await Interest.findById(req.params.id);

    if (!interest) {
      return new ApiResponse(res, Errors.NOT_FOUND_RESPONSE);
    }

    SUCCESS.data = interest;
    return new ApiResponse(res, SUCCESS);
  } catch (e: any) {
    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, e.message);
  }
};

export const addInterest = async (req: Request, res: Response): Promise<ApiResponse> => {
  try {
    const { label }: IInterest = req.body;

    if (!label) {
      return new ApiResponse(res, Errors.BAD_REQUEST_RESPONSE);
    }

    const interest: IInterest = new Interest({
      label,
    });

    await interest.save();
    return new ApiResponse(res, {
      name: 'Success',
      httpStatusCode: HttpStatusCodes.CREATED,
      description: HttpStatusCodesDescriptions.CREATED,
      data: interest,
    });
  } catch (e: any) {
    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, e.message);
  }
};

export const updateInterest = async (req: Request, res: Response): Promise<ApiResponse> => {
  try {
    const { label }: IInterest = req.body;

    if (!label) {
      return new ApiResponse(res, Errors.BAD_REQUEST_RESPONSE);
    }

    const interest: IInterest | null = await Interest.findByIdAndUpdate(req.params.id, { label }, { new: true }).select(
      ['-__v']
    );

    if (!interest) {
      return new ApiResponse(res, Errors.NOT_FOUND_RESPONSE);
    }

    SUCCESS.data = interest;
    return new ApiResponse(res, SUCCESS);
  } catch (e: any) {
    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, e.message);
  }
};

export const deleteInterest = async (req: Request, res: Response): Promise<ApiResponse> => {
  try {
    const interest: IInterest | null = await Interest.findByIdAndRemove(req.params.id);

    if (!interest) {
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

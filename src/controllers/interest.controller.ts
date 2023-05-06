import type { Response, Request } from 'express';

import { Errors } from '../environments/errors.environment';
import { HttpStatusCodes, HttpStatusCodesDescriptions } from '../environments/httpStatusCodes.environment';
import Interest from '../models/interest.model';
import type { IInterest } from '../types/interest.type';
import { ApiResponse } from '../utils/apiResponse';

const success = {
  name: 'Success',
  httpStatusCode: HttpStatusCodes.SUCCESS,
  description: HttpStatusCodesDescriptions.SUCCESS,
  data: {},
};

export const getInterests = async (_req: Request, res: Response): Promise<ApiResponse> => {
  try {
    const interests: IInterest[] = await Interest.find();

    success.data = interests;
    return new ApiResponse(res, success);
  } catch (e) {
    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, e);
  }
};
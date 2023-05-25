import type { Request, Response } from 'express';
import NodeCache from 'node-cache';

import { ApiResponse } from './apiResponse';
import { FOURDAYSTOSECONDS } from '../environments/constants.environment';
import { Errors } from '../environments/errors.environment';
import { HttpStatusCodes, HttpStatusCodesDescriptions } from '../environments/httpStatusCodes.environment';

let cache: NodeCache | undefined;

const createCache = (): NodeCache => new NodeCache({ stdTTL: FOURDAYSTOSECONDS });

export const getCache = (): NodeCache => {
  if (!cache) {
    cache = createCache();
  }

  return cache;
};

export const cacheClear = async (_req: Request, res: Response): Promise<ApiResponse> => {
  try {
    if (cache) {
      const keys = cache.keys();

      cache.del(keys);

      return new ApiResponse(res, {
        name: 'Success',
        httpStatusCode: HttpStatusCodes.SUCCESS,
        description: HttpStatusCodesDescriptions.SUCCESS,
      });
    }

    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, 'No cache found.');
  } catch (e: any) {
    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, e.message);
  }
};

import type { Response, Request } from 'express';
import type NodeCache from 'node-cache';

import { SUCCESS } from '../environments/constants.environment';
import { Errors } from '../environments/errors.environment';
import { HttpStatusCodes, HttpStatusCodesDescriptions } from '../environments/httpStatusCodes.environment';
import Conference from '../models/conference.model';
import type { IConference } from '../types/conference.type';
import type { IRequest } from '../types/global.type';
import { ApiResponse } from '../utils/apiResponse';
import { getCache } from '../utils/cacheClear';

const cache: NodeCache = getCache();

export const getConference = async (req: Request, res: Response): Promise<ApiResponse> => {
  try {
    const { conferenceId } = req.params;

    if (!conferenceId) {
      return new ApiResponse(res, Errors.BAD_REQUEST_RESPONSE);
    }

    const cachedConferenceFetched: IConference | undefined = cache.get(`conference_${conferenceId}`);

    if (cachedConferenceFetched) {
      SUCCESS.data = cachedConferenceFetched;
      return new ApiResponse(res, SUCCESS);
    }

    const conference: IConference | null = await Conference.findById(conferenceId).populate('speaker', [
      'firstname',
      'lastname',
      'links',
      'biography',
      'picture',
      'company',
    ]);
    if (!conference) {
      return new ApiResponse(res, Errors.NOT_FOUND_RESPONSE);
    }

    const cachedConference: boolean = cache.set(`conference_${conferenceId}`, conference);

    if (cachedConference) {
      SUCCESS.data = conference;
      return new ApiResponse(res, SUCCESS);
    }

    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, 'Can not cache data.');
  } catch (error) {
    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, error);
  }
};

export const getConferences = async (_req: Request, res: Response): Promise<ApiResponse> => {
  try {
    const cachedConferencesFetched: IConference[] | undefined = cache.get('conferences');

    if (cachedConferencesFetched) {
      SUCCESS.data = cachedConferencesFetched;
      return new ApiResponse(res, SUCCESS);
    }

    const conferences: IConference[] = await Conference.find()
      .populate('interests')
      .populate('speaker', ['firstname', 'lastname', 'links', 'biography', 'picture', 'company']);
    const cachedConferences: boolean = cache.set('conferences', conferences);

    if (cachedConferences) {
      SUCCESS.data = conferences;
      return new ApiResponse(res, SUCCESS);
    }

    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, 'Can not cache data.');
  } catch (error) {
    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, error);
  }
};

export const addConference = async (req: IRequest, res: Response): Promise<ApiResponse> => {
  try {
    const { title, speaker, ...rest } = req.body;

    if (!title) {
      return new ApiResponse(res, Errors.BAD_REQUEST_RESPONSE);
    }

    const conference: IConference = new Conference({
      createdBy: req.user?.id,
      title,
      ...rest,
    });
    await conference.save();

    return new ApiResponse(res, {
      name: 'Success',
      httpStatusCode: HttpStatusCodes.CREATED,
      description: HttpStatusCodesDescriptions.CREATED,
      data: conference,
    });
  } catch (error) {
    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, error);
  }
};

export const updateConference = async (req: IRequest, res: Response): Promise<ApiResponse> => {
  try {
    const { conferenceId } = req.params;

    if (!conferenceId) {
      return new ApiResponse(res, Errors.BAD_REQUEST_RESPONSE);
    }

    const update = {
      ...req.body,
    };

    const updateActions = {
      $set: update,
      $push: {
        updatedBy: { user: req.user?.id },
      },
    };

    const conference: IConference | null = await Conference.findByIdAndUpdate(conferenceId, updateActions, {
      returnDocument: 'after',
    }).select(['-_id']);
    if (!conference) {
      return new ApiResponse(res, Errors.NOT_FOUND_RESPONSE);
    }

    SUCCESS.data = conference;
    return new ApiResponse(res, SUCCESS);
  } catch (error) {
    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, error);
  }
};

export const deleteConference = async (req: Request, res: Response): Promise<ApiResponse> => {
  try {
    const { conferenceId } = req.params;

    if (!conferenceId) {
      return new ApiResponse(res, Errors.BAD_REQUEST_RESPONSE);
    }

    const conference: IConference | null = await Conference.findByIdAndDelete(conferenceId).select(['-_id']);
    if (!conference) {
      return new ApiResponse(res, Errors.NOT_FOUND_RESPONSE);
    }

    return new ApiResponse(res, {
      name: 'Success',
      httpStatusCode: HttpStatusCodes.SUCCESS,
      description: HttpStatusCodesDescriptions.SUCCESS,
      data: conference,
    });
  } catch (error) {
    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, error);
  }
};

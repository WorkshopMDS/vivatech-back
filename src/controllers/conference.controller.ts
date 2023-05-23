import type { Response, Request } from 'express';

import { Errors } from '../environments/errors.environment';
import { HttpStatusCodes, HttpStatusCodesDescriptions } from '../environments/httpStatusCodes.environment';
import Conference from '../models/conference.model';
import type { IConference } from '../types/conference.type';
import type { IRequest } from '../types/global.type';
import { ApiResponse } from '../utils/apiResponse';

export const getConference = async (req: Request, res: Response): Promise<ApiResponse> => {
  try {
    const { conferenceId } = req.params;

    if (!conferenceId) {
      return new ApiResponse(res, Errors.BAD_REQUEST_RESPONSE);
    }

    const conference: IConference | null = await Conference.findById(conferenceId)
      .select(['-_id'])
      .populate('speaker', ['firstname', 'lastname', 'links', 'biography', 'picture', 'company']);
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

export const getConferences = async (_: Request, res: Response): Promise<ApiResponse> => {
  try {
    const conferences: IConference[] = await Conference.find()
      .select(['-_id'])
      .populate('speaker', ['firstname', 'lastname', 'links', 'biography', 'picture', 'company']);

    return new ApiResponse(res, {
      name: 'Success',
      httpStatusCode: HttpStatusCodes.SUCCESS,
      description: HttpStatusCodesDescriptions.SUCCESS,
      data: conferences,
    });
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

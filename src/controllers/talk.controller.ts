import type { Response, Request } from 'express';

import { Errors } from '../environments/errors.environment';
import { HttpStatusCodes, HttpStatusCodesDescriptions } from '../environments/httpStatusCodes.environment';
import Talk from '../models/talk.model';
import type { IRequest } from '../types/global.type';
import type { ITalk } from '../types/talk.type';
import { ApiResponse } from '../utils/apiResponse';

export const getTalk = async (req: Request, res: Response): Promise<ApiResponse> => {
  try {
    const { talkId } = req.params;

    if (!talkId) {
      return new ApiResponse(res, Errors.BAD_REQUEST_RESPONSE);
    }

    const talk: ITalk | null = await Talk.findById(talkId)
      .select(['-_id'])
      .populate('speaker', ['firstname', 'lastname', 'links', 'biography', 'picture', 'company']);
    if (!talk) {
      return new ApiResponse(res, Errors.NOT_FOUND_RESPONSE);
    }

    return new ApiResponse(res, {
      name: 'Success',
      httpStatusCode: HttpStatusCodes.SUCCESS,
      description: HttpStatusCodesDescriptions.SUCCESS,
      data: talk,
    });
  } catch (error) {
    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, error);
  }
};

export const getTalks = async (_: Request, res: Response): Promise<ApiResponse> => {
  try {
    const talks: ITalk[] = await Talk.find()
      .select(['-_id'])
      .populate('speaker', ['firstname', 'lastname', 'links', 'biography', 'picture', 'company']);

    return new ApiResponse(res, {
      name: 'Success',
      httpStatusCode: HttpStatusCodes.SUCCESS,
      description: HttpStatusCodesDescriptions.SUCCESS,
      data: talks,
    });
  } catch (error) {
    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, error);
  }
};

export const addTalk = async (req: IRequest, res: Response): Promise<ApiResponse> => {
  try {
    const { title, speaker, ...rest } = req.body;

    if (!title) {
      return new ApiResponse(res, Errors.BAD_REQUEST_RESPONSE);
    }

    const talk: ITalk = new Talk({
      createdBy: req.user?.id,
      title,
      ...rest,
    });
    await talk.save();

    return new ApiResponse(res, {
      name: 'Success',
      httpStatusCode: HttpStatusCodes.CREATED,
      description: HttpStatusCodesDescriptions.CREATED,
      data: talk,
    });
  } catch (error) {
    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, error);
  }
};

export const updateTalk = async (req: IRequest, res: Response): Promise<ApiResponse> => {
  try {
    const { talkId } = req.params;

    if (!talkId) {
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

    const talk: ITalk | null = await Talk.findByIdAndUpdate(talkId, updateActions, { returnDocument: 'after' }).select([
      '-_id',
    ]);
    if (!talk) {
      return new ApiResponse(res, Errors.NOT_FOUND_RESPONSE);
    }

    return new ApiResponse(res, {
      name: 'Success',
      httpStatusCode: HttpStatusCodes.SUCCESS,
      description: HttpStatusCodesDescriptions.SUCCESS,
      data: talk,
    });
  } catch (error) {
    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, error);
  }
};

export const deleteTalk = async (req: Request, res: Response): Promise<ApiResponse> => {
  try {
    const { talkId } = req.params;

    if (!talkId) {
      return new ApiResponse(res, Errors.BAD_REQUEST_RESPONSE);
    }

    const talk = await Talk.findByIdAndDelete(talkId).select(['-_id']);
    if (!talk) {
      return new ApiResponse(res, Errors.NOT_FOUND_RESPONSE);
    }

    return new ApiResponse(res, {
      name: 'Success',
      httpStatusCode: HttpStatusCodes.SUCCESS,
      description: HttpStatusCodesDescriptions.SUCCESS,
      data: talk,
    });
  } catch (error) {
    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, error);
  }
};

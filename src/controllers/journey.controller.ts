import type { Request, Response } from 'express';
import type NodeCache from 'node-cache';

import { SUCCESS } from '../environments/constants.environment';
import { Errors } from '../environments/errors.environment';
import { HttpStatusCodes, HttpStatusCodesDescriptions } from '../environments/httpStatusCodes.environment';
import Journey from '../models/journey.model';
import type { IRequest } from '../types/global.type';
import type { IJourney } from '../types/journey.type';
import { ApiResponse } from '../utils/apiResponse';
import { getCache } from '../utils/cacheClear';

const cache: NodeCache = getCache();

export const getJourneys = async (_req: Request, res: Response): Promise<ApiResponse> => {
  try {
    const cachedJourneysFetched: string | undefined = cache.get('journeys');

    if (cachedJourneysFetched) {
      SUCCESS.data = JSON.parse(cachedJourneysFetched);
      return new ApiResponse(res, SUCCESS);
    }

    const journeys: IJourney[] = await Journey.find()
      .populate('interests')
      .populate('createdBy')
      .populate('editedBy.user');
    const cachedJourneys: boolean = cache.set('journeys', JSON.stringify(journeys));

    if (cachedJourneys) {
      SUCCESS.data = journeys;
      return new ApiResponse(res, SUCCESS);
    }

    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, 'Can not cache data.');
  } catch (e: any) {
    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, e.message);
  }
};

export const getJourney = async (req: Request, res: Response): Promise<ApiResponse> => {
  try {
    const { id } = req.params;

    if (!id) {
      return new ApiResponse(res, Errors.BAD_REQUEST_RESPONSE);
    }

    const cachedJourneyFetched: IJourney | undefined = cache.get(`journey_${id}`);

    if (cachedJourneyFetched) {
      SUCCESS.data = cachedJourneyFetched;
      return new ApiResponse(res, SUCCESS);
    }

    const journey: IJourney | null = await Journey.findById(id).populate(['interests', 'createdBy', 'editedBy']);

    if (!journey) {
      return new ApiResponse(res, Errors.NOT_FOUND_RESPONSE);
    }

    const cachedJourney: boolean = cache.set(`journey_${id}`, JSON.stringify(journey));

    if (cachedJourney) {
      SUCCESS.data = journey;
      return new ApiResponse(res, SUCCESS);
    }

    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, 'Can not cache data.');
  } catch (e: any) {
    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, e.message);
  }
};

export const addJourney = async (req: IRequest, res: Response): Promise<ApiResponse> => {
  try {
    const { title, description, interests, questions }: IJourney = req.body;

    if (!title || !description || !interests || !questions) {
      return new ApiResponse(res, Errors.BAD_REQUEST_RESPONSE);
    }

    const journey: IJourney = new Journey({
      title,
      description,
      interests,
      questions,
      createdBy: req.user?.id,
    });

    await journey.save();
    return new ApiResponse(res, {
      name: 'Success',
      httpStatusCode: HttpStatusCodes.CREATED,
      description: HttpStatusCodesDescriptions.CREATED,
      data: await journey.populate(['interests', { path: 'createdBy', select: 'email' }]),
    });
  } catch (e: any) {
    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, e.message);
  }
};

export const updateJourney = async (req: IRequest, res: Response): Promise<ApiResponse> => {
  try {
    const { title, description, interests, questions }: IJourney = req.body;

    if (!title || !description || !interests || !questions) {
      return new ApiResponse(res, Errors.BAD_REQUEST_RESPONSE);
    }

    const journey: IJourney | null = await Journey.findByIdAndUpdate(
      req.params.id,
      { $set: { title, description, interests, questions }, $push: { editedBy: { user: req.user?.id } } },
      { new: true }
    ).select(['-__v']);

    if (!journey) {
      return new ApiResponse(res, Errors.NOT_FOUND_RESPONSE);
    }

    SUCCESS.data = await journey.populate(['interests']);
    return new ApiResponse(res, SUCCESS);
  } catch (e: any) {
    return new ApiResponse(res, Errors.INTERNAL_SERVER_RESPONSE, e.message);
  }
};

export const deleteJourney = async (req: Request, res: Response): Promise<ApiResponse> => {
  try {
    const journey: IJourney | null = await Journey.findByIdAndRemove(req.params.id);

    if (!journey) {
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

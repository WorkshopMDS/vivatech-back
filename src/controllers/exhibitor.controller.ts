import type { Response, Request } from 'express';

import Exhibitor from '../models/exhibitor.model';
import type { IExhibitor } from '../types/exhibitor.type';
import { HttpStatusCodes, HttpStatusCodesDescriptions } from '../environments/httpStatusCodes.environment';
import ExhibitorModel from '../models/exhibitor.model';
import { ApiResponse } from '../responses/api.response';

export const getExhibitors = async (_req: Request, res: Response): Promise<void> => {
  try {
    const exhibitors: IExhibitor[] = await Exhibitor.find();
    const apiResponse: ApiResponse = new ApiResponse({
        name: 'Success', 
        httpStatusCode: HttpStatusCodes.SUCCESS,
        description: HttpStatusCodesDescriptions.SUCCESS,
        data: exhibitors,
      });
    res.status(HttpStatusCodes.SUCCESS).json(apiResponse);
    return;
  } catch (e) {
    const error: ApiResponse = new ApiResponse({
      name: 'Error', 
      httpStatusCode: HttpStatusCodes.INTERNAL_SERVER,
      description: HttpStatusCodesDescriptions.INTERNAL_SERVER,
    });
    res.status(HttpStatusCodes.INTERNAL_SERVER).json(error);
    return;
  }
};

export const getExhibitor = async (req: Request, res: Response): Promise<void> => {
  try {
    const exhibitor: IExhibitor | null = await Exhibitor.findById(req.params.id);

    if (!exhibitor) {
      const error: ApiResponse = new ApiResponse({
      name: 'Error', 
      httpStatusCode: HttpStatusCodes.NOT_FOUND,
      description: HttpStatusCodesDescriptions.NOT_FOUND,
    });
      res.status(HttpStatusCodes.NOT_FOUND).json(error);
      return;
    }

    const apiResponse: ApiResponse = new ApiResponse({
      name: 'Success', 
      httpStatusCode: HttpStatusCodes.SUCCESS,
      description: HttpStatusCodesDescriptions.SUCCESS,
      data: exhibitor,
    });
    res.status(HttpStatusCodes.SUCCESS).json(apiResponse);
    return;
  } catch (e) {
    const error: ApiResponse = new ApiResponse({
      name: 'Error', 
      httpStatusCode: HttpStatusCodes.INTERNAL_SERVER,
      description: HttpStatusCodesDescriptions.INTERNAL_SERVER,
    });
    res.status(HttpStatusCodes.INTERNAL_SERVER).json(error);
    return;
  }
};

export const addExhibitor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, picture, place, sectors, interests }: IExhibitor = req.body

    if (!name || !picture || !place || !sectors || !interests) {
      const apiResponse: ApiResponse = new ApiResponse({
        name: 'Error',
        httpStatusCode: HttpStatusCodes.BAD_REQUEST,
        description: HttpStatusCodesDescriptions.BAD_REQUEST,
      });
      res.status(HttpStatusCodes.BAD_REQUEST).json(apiResponse);
      return;
    }

    const exhibitor: IExhibitor = new ExhibitorModel({
      name,
      picture,
      place,
      sectors,
      interests,
    });

    await exhibitor.save();
    const apiResponse: ApiResponse = new ApiResponse({
      name: 'Success',
      httpStatusCode: HttpStatusCodes.CREATED,
      description: HttpStatusCodesDescriptions.CREATED,
      data: exhibitor,
    });
    res.status(HttpStatusCodes.CREATED).json(apiResponse);
    return;
  } catch (e) {
    const error: ApiResponse = new ApiResponse({
      name: 'Error',
      httpStatusCode: HttpStatusCodes.INTERNAL_SERVER,
      description: HttpStatusCodesDescriptions.INTERNAL_SERVER,
    });
    res.status(HttpStatusCodes.INTERNAL_SERVER).json(error);
    return;
  }
};

export const updateExhibitor = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, picture, place, sectors, interests }: IExhibitor = req.body

    if (!name || !picture || !place || !sectors || !interests) {
      const apiResponse: ApiResponse = new ApiResponse({
        name: 'Error',
        httpStatusCode: HttpStatusCodes.BAD_REQUEST,
        description: HttpStatusCodesDescriptions.BAD_REQUEST,
      });
      res.status(HttpStatusCodes.BAD_REQUEST).json(apiResponse);
      return;
    }

    const exhibitor: IExhibitor | null = await Exhibitor.findOneAndUpdate(
      {"_id": req.params.id},
      req.body,
      {new: true}
    ).select(['-__v']);

    if (!exhibitor) {
      const error: ApiResponse = new ApiResponse({
        name: 'Error', 
        httpStatusCode: HttpStatusCodes.NOT_FOUND,
        description: HttpStatusCodesDescriptions.NOT_FOUND,
      });
        res.status(HttpStatusCodes.NOT_FOUND).json(error);
        return;
    }

    const apiResponse: ApiResponse = new ApiResponse({
      name: 'Success',
      httpStatusCode: HttpStatusCodes.SUCCESS,
      description: HttpStatusCodesDescriptions.SUCCESS,
      data: exhibitor,
    });
    res.status(HttpStatusCodes.SUCCESS).json(apiResponse);
    return;
  } catch (e) {
    const error: ApiResponse = new ApiResponse({
      name: 'Error',
      httpStatusCode: HttpStatusCodes.INTERNAL_SERVER,
      description: HttpStatusCodesDescriptions.INTERNAL_SERVER,
    });
    res.status(HttpStatusCodes.INTERNAL_SERVER).json(error);
    return;
  }
};

export const deleteExhibitor = async (req: Request, res: Response): Promise<void> => {
  try {
    const exhibitor: IExhibitor | null = await Exhibitor.findOneAndRemove({"_id": req.params.id});

    if (!exhibitor) {
      const error: ApiResponse = new ApiResponse({
        name: 'Error', 
        httpStatusCode: HttpStatusCodes.NOT_FOUND,
        description: HttpStatusCodesDescriptions.NOT_FOUND,
      });
        res.status(HttpStatusCodes.NOT_FOUND).json(error);
        return;
    }

    const apiResponse: ApiResponse = new ApiResponse({
      name: 'Success',
      httpStatusCode: HttpStatusCodes.SUCCESS,
      description: HttpStatusCodesDescriptions.SUCCESS,
    });
    res.status(HttpStatusCodes.SUCCESS).json(apiResponse);
    return;
  } catch (e) {
    const error: ApiResponse = new ApiResponse({
      name: 'Error',
      httpStatusCode: HttpStatusCodes.INTERNAL_SERVER,
      description: HttpStatusCodesDescriptions.INTERNAL_SERVER,
    });
    res.status(HttpStatusCodes.INTERNAL_SERVER).json(error);
    return;
  }
};

import type { Response, Request } from 'express';

import Exhibitor from '../models/exhibitor.model';
import type { IExhibitor } from '../types/exhibitor';
import { Error404 } from '../errors/404.error';
import { Error500 } from '../errors/500.error';
import { HttpStatusCodes } from '../environments/httpStatusCodes.environment';

export const getExhibitors = async (_req: Request, res: Response): Promise<void> => {
  try {
    const exhibitors: IExhibitor[] = await Exhibitor.find();
    res.status(200).json({exhibitors});
  } catch (e) {
    const error: Error500 = new Error500();
    res.status(HttpStatusCodes.INTERNAL_SERVER).json({error});
  }
};

export const getExhibitor = async (req: Request, res: Response): Promise<void> => {
  try {
    const exhibitor: IExhibitor | null = await Exhibitor.findById(req.params.id);
  
    if (!exhibitor) {
      const error: Error404 = new Error404();
      res.status(HttpStatusCodes.NOT_FOUND).json({error});
    }

    res.status(200).json({exhibitor})
  } catch (e) {
    const error: Error500 = new Error500();
    res.status(HttpStatusCodes.INTERNAL_SERVER).json({error});
  }
};

export const registerExhibitor = () => {};

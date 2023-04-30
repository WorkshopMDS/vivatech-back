import type { Response, Request } from 'express';

import Exhibitor from '../models/exhibitor.model';
import type { IExhibitor } from '../types/exhibitor';

export const getExhibitors = async (_req: Request, res: Response): Promise<void> => {
  try {
    const exhibitors: IExhibitor[] = await Exhibitor.find();
    res.status(200).json({ exhibitors });
  } catch (error) {
    throw error;
  }
};

export const registerExhibitor = () => {};

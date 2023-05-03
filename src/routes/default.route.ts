import type { Request, Response, NextFunction } from 'express';
import { Router } from 'express';

import { HttpStatusCodes, HttpStatusCodesDescriptions } from '../environments/httpStatusCodes.environment';
import { errorHandler } from '../middlewares/errorHandler.middleware';
import { ApiResponse } from '../responses/api.response';

export const defaultRoutes = Router();

defaultRoutes.use((_req: Request, res: Response, next: NextFunction) => {
  next(
    new ApiResponse(res as Response, {
      name: 'Error',
      httpStatusCode: HttpStatusCodes.NOT_FOUND,
      description: HttpStatusCodesDescriptions.NOT_FOUND,
    })
  );
});

defaultRoutes.use((error: Error | ApiResponse, _req: Request, res: Response) => {
  errorHandler.handleError(error, res);
});

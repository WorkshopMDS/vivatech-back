import { Router, Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../responses/api.response';
import { errorHandler } from '../middlewares/errorHandler.middleware';
import { HttpStatusCodes, HttpStatusCodesDescriptions } from '../environments/httpStatusCodes.environment';


export const defaultRoutes = Router();

defaultRoutes.use((_req: Request, res: Response, next: NextFunction) => {
  next(new ApiResponse(res as Response, {
    name: 'Error', 
    httpStatusCode: HttpStatusCodes.NOT_FOUND,
    description: HttpStatusCodesDescriptions.NOT_FOUND,
  }));
});

defaultRoutes.use((error: Error | ApiResponse, _req: Request, res: Response, _next: NextFunction) => {
  errorHandler.handleError(error, res);
});
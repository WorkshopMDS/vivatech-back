import { NextFunction, Router, Request, Response } from 'express';
import { errorHandler } from './middlewares/errorHandler.middleware';
import routes from './routes';
import { ApiResponse } from './responses/api.response';
import { HttpStatusCodes, HttpStatusCodesDescriptions } from './environments/httpStatusCodes.environment';

const router = Router();

router.use('/', routes.userRoutes);
router.use('/', routes.exhibitorRoutes);
router.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new ApiResponse({
    name: 'Error', 
    httpStatusCode: HttpStatusCodes.NOT_FOUND,
    description: HttpStatusCodesDescriptions.NOT_FOUND,
  }));
});

router.use((error: Error | ApiResponse, _req: Request, res: Response, _next: NextFunction) => {
  errorHandler.handleError(error, res);
});

export default router;

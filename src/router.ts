import routes from './routes';
import { NextFunction, Router, Request, Response } from 'express';
import { errorHandler } from './middlewares/errorHandler.middleware';

const router = Router();

router.use('/', routes.userRoutes);
router.use('/', routes.ticketRoutes);
router.use((error: Error, _request: Request, response: Response, _next: NextFunction) => {
  errorHandler.handleError(error, response);
});

export default router;

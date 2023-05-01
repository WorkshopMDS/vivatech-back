import { NextFunction, Router, Request, Response } from 'express';
import { errorHandler } from './middlewares/errorHandler.middleware';
import { Error404 } from '../src/errors/404.error';
import routes from './routes';

const router = Router();

router.use('/users', routes.userRoutes);
router.use('/exhibitors', routes.exhibitorRoutes);
router.use((_request: Request, _response: Response, _next: NextFunction) => {
  throw new Error404();
});
router.use((error: Error, _request: Request, response: Response, _next: NextFunction) => {
  errorHandler.handleError(error, response);
});

export default router;

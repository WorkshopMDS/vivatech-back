import { Router } from 'express';

import routes from './routes';

const router = Router();

router.use('/users', routes.userRoutes);

export default router;

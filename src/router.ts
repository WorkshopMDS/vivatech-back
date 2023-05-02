import { Router } from 'express';

import routes from './routes';

const router = Router();

router.use('/', routes.userRoutes);
router.use('/', routes.ticketRoutes);

export default router;

import { Router } from 'express';

import routes from './routes';

const router = Router();

router.use('/', routes.userRoutes);
router.use('/', routes.ticketRoutes);
router.use('/', routes.exhibitorRoutes);
router.use('/', routes.talkRoutes);
router.use('/', routes.interestRoutes);
router.use(routes.defaultRoutes);

export default router;

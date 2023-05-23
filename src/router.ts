import { Router } from 'express';

import routes from './routes';

const router = Router();

router.use('/', routes.userRoutes);
router.use('/', routes.ticketRoutes);
router.use('/', routes.exhibitorRoutes);
router.use('/', routes.interestRoutes);
router.use('/', routes.conferenceRoutes);
router.use('/', routes.cvRoutes);
router.use(routes.defaultRoutes);

export default router;

import { Router } from 'express';

import { isAuthenticated } from './middlewares/auth.middleware';
import { isInGroup } from './middlewares/permission.middleware';
import routes from './routes';
import { cacheClear } from './utils/cacheClear';
import { Roles } from './utils/roles';

const router = Router();

router.use('/', routes.userRoutes);
router.use('/', routes.ticketRoutes);
router.use('/', routes.exhibitorRoutes);
router.use('/', routes.interestRoutes);
router.use('/', routes.conferenceRoutes);
router.use('/', routes.cvRoutes);
router.get('/cache-clear', isAuthenticated, isInGroup([Roles.ADMIN]), cacheClear);
router.use(routes.defaultRoutes);

export default router;

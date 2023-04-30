import { Router } from 'express';

import routes from './routes';

const router = Router();

router.use('/users', routes.userRoutes);
router.use('/exhibitors', routes.exhibitorRoutes);

export default router;

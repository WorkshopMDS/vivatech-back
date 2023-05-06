import { Router } from 'express';

import { getInterests } from '../controllers/interest.controller';
// import { isAuthenticated } from '../middlewares/auth.middleware';
// import { isInGroup } from '../middlewares/permission.middleware';
// import { Roles } from '../utils/roles';

export const interestRoutes: Router = Router();

interestRoutes.get('/interests', getInterests);

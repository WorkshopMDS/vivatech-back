import { Router } from 'express';

import {
  getInterests,
  getInterest,
  addInterest,
  updateInterest,
  deleteInterest,
} from '../controllers/interest.controller';
import { isAuthenticated } from '../middlewares/auth.middleware';
import { isInGroup } from '../middlewares/permission.middleware';
import { Roles } from '../utils/roles';

export const interestRoutes: Router = Router();

interestRoutes.get('/interests', getInterests);
interestRoutes.get('/interest/:id', getInterest);
interestRoutes.post('/interest', isAuthenticated, isInGroup([Roles.ADMIN]), addInterest);
interestRoutes.patch('/interest/:id', isAuthenticated, isInGroup([Roles.ADMIN]), updateInterest);
interestRoutes.delete('/interest/:id', isAuthenticated, isInGroup([Roles.ADMIN]), deleteInterest);

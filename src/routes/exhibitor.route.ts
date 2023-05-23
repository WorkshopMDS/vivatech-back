import { Router } from 'express';

import {
  getExhibitors,
  getExhibitor,
  addExhibitor,
  updateExhibitor,
  deleteExhibitor,
  cacheClear,
} from '../controllers/exhibitor.controller';
import { isAuthenticated } from '../middlewares/auth.middleware';
import { isInGroup } from '../middlewares/permission.middleware';
import { Roles } from '../utils/roles';

export const exhibitorRoutes: Router = Router();

exhibitorRoutes.get('/exhibitors', getExhibitors);
exhibitorRoutes.get('/exhibitor/:id', getExhibitor);
exhibitorRoutes.post('/exhibitor', isAuthenticated, isInGroup([Roles.ADMIN]), addExhibitor);
exhibitorRoutes.patch('/exhibitor/:id', isAuthenticated, isInGroup([Roles.ADMIN]), updateExhibitor);
exhibitorRoutes.delete('/exhibitor/:id', isAuthenticated, isInGroup([Roles.ADMIN]), deleteExhibitor);
exhibitorRoutes.get('/clear-exhibitor', isAuthenticated, isInGroup([Roles.ADMIN]), cacheClear);

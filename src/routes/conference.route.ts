import { Router } from 'express';

import {
  addConference,
  deleteConference,
  getConference,
  getConferences,
  updateConference,
} from '../controllers/conference.controller';
import { isAuthenticated } from '../middlewares/auth.middleware';
import { isInGroup } from '../middlewares/permission.middleware';
import { Roles } from '../utils/roles';

export const conferenceRoutes: Router = Router();

conferenceRoutes.post('/conference', isAuthenticated, isInGroup([Roles.ADMIN]), addConference);
conferenceRoutes.get('/conferences', getConferences);
conferenceRoutes.get('/conference/:conferenceId', getConference);
conferenceRoutes.patch('/conference/:conferenceId', isAuthenticated, isInGroup([Roles.ADMIN]), updateConference);
conferenceRoutes.delete('/conference/:conferenceId', isAuthenticated, isInGroup([Roles.ADMIN]), deleteConference);

import { Router } from 'express';

import { getJourneys, getJourney, addJourney, updateJourney, deleteJourney } from '../controllers/journey.controller';
import { isAuthenticated } from '../middlewares/auth.middleware';
import { isInGroup } from '../middlewares/permission.middleware';
import { Roles } from '../utils/roles';

export const journeyRoutes: Router = Router();

journeyRoutes.get('/journeys', getJourneys);
journeyRoutes.get('/journey/:id', getJourney);
journeyRoutes.post('/journey', isAuthenticated, isInGroup([Roles.ADMIN]), addJourney);
journeyRoutes.patch('/journey/:id', isAuthenticated, isInGroup([Roles.ADMIN]), updateJourney);
journeyRoutes.delete('/journey/:id', isAuthenticated, isInGroup([Roles.ADMIN]), deleteJourney);

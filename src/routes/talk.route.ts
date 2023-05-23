import { Router } from 'express';

import { addTalk, deleteTalk, getTalk, getTalks, updateTalk } from '../controllers/talk.controller';
import { isAuthenticated } from '../middlewares/auth.middleware';
import { isInGroup } from '../middlewares/permission.middleware';
import { Roles } from '../utils/roles';

export const talkRoutes: Router = Router();

talkRoutes.post('/talk', isAuthenticated, isInGroup([Roles.ADMIN]), addTalk);
talkRoutes.get('/talks', getTalks);
talkRoutes.get('/talk/:talkId', getTalk);
talkRoutes.patch('/talk/:talkId', isAuthenticated, isInGroup([Roles.ADMIN]), updateTalk);
talkRoutes.delete('/talk/:talkId', isAuthenticated, isInGroup([Roles.ADMIN]), deleteTalk);

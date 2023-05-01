import { Router } from 'express';

import { getExhibitors, getExhibitor, addExhibitor } from '../controllers/exhibitor.controller';

export const exhibitorRoutes: Router = Router();

exhibitorRoutes.get('/exhibitors', getExhibitors);
exhibitorRoutes.get('/exhibitor/:id', getExhibitor);
exhibitorRoutes.post('/exhibitor/add', addExhibitor);
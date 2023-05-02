import { Router } from 'express';

import { getExhibitors, getExhibitor, addExhibitor, updateExhibitor } from '../controllers/exhibitor.controller';

export const exhibitorRoutes: Router = Router();

exhibitorRoutes.get('/exhibitors', getExhibitors);
exhibitorRoutes.get('/exhibitor/:id', getExhibitor);
exhibitorRoutes.post('/exhibitor/add', addExhibitor);
exhibitorRoutes.patch('/exhibitor/update/:id', updateExhibitor);
import { Router } from 'express';

import { getExhibitors, getExhibitor } from '../controllers/exhibitor.controller';

export const exhibitorRoutes: Router = Router();

exhibitorRoutes.get('/', getExhibitors);
exhibitorRoutes.get('/:id', getExhibitor)
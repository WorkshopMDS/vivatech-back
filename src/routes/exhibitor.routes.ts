import { Router } from 'express';

import { getExhibitors } from '../controllers/exhibitor.controller';

export const exhibitorRoutes: Router = Router();

exhibitorRoutes.get('/', getExhibitors);

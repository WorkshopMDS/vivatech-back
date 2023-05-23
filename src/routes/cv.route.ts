import { Router } from 'express';

import { addCv, deleteCV, getCV, getCVs, updateCV } from '../controllers/cv.controller';
import { isAuthenticated } from '../middlewares/auth.middleware';

export const cvRoutes: Router = Router();

cvRoutes.get('/cv', getCVs);
cvRoutes.get('/cv/:id', getCV);
cvRoutes.post('/cv', isAuthenticated, addCv);
cvRoutes.patch('/cv/:id', isAuthenticated, updateCV);
cvRoutes.delete('/cv/:id', isAuthenticated, deleteCV);

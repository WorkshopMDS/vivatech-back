import { Router } from 'express';

import { getUsers } from '../controllers/users';

export const userRoutes: Router = Router();

userRoutes.get('/users', getUsers);

import { Router } from 'express';

import { getUsers } from '../controllers';

export const userRoutes: Router = Router();

userRoutes.get('/', getUsers);

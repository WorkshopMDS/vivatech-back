import { Router } from 'express';

import { deleteUser, getUser, getUsers, login, register } from '../controllers/user.controllers';
import { isAuthenticated } from '../middlewares/auth.middleware';
import { checkOwnership, isInGroup } from '../middlewares/permission.middleware';
import { Roles } from '../utils/roles';

export const userRoutes: Router = Router();

userRoutes.post('/register', register);
userRoutes.post('/login', login);
userRoutes.get('/users', isAuthenticated, isInGroup([Roles.ADMIN]), getUsers);
userRoutes.get('/user', isAuthenticated, getUser);
userRoutes.get('/user/:userId', isAuthenticated, checkOwnership('Users', 'userId', '_id'), getUser);
userRoutes.delete('/user', isAuthenticated, deleteUser);
userRoutes.delete('/user/:userId', isAuthenticated, checkOwnership('Users', 'userId', '_id'), deleteUser);

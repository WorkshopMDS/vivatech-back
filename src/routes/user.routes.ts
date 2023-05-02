import { Router } from 'express';

import {
  deleteUser,
  getSpeakers,
  getUser,
  getUsers,
  login,
  refreshAccessToken,
  register,
  setUserAsSpeaker,
  updateUser,
} from '../controllers/user.controllers';
import { isAuthenticated } from '../middlewares/auth.middleware';
import { checkOwnership, isInGroup } from '../middlewares/permission.middleware';
import { Roles } from '../utils/roles';

export const userRoutes: Router = Router();

userRoutes.post('/register', register);
userRoutes.post('/login', login);
userRoutes.post('/refreshToken', refreshAccessToken);
userRoutes.get('/users', isAuthenticated, isInGroup([Roles.ADMIN]), getUsers);
userRoutes.get('/user', isAuthenticated, getUser);
userRoutes.get('/user/:userId', isAuthenticated, checkOwnership('Users', 'userId', '_id'), getUser);
userRoutes.patch('/user', isAuthenticated, updateUser);
userRoutes.patch('/user/:userId', isAuthenticated, checkOwnership('Users', 'userId', '_id'), updateUser);
userRoutes.delete('/user', isAuthenticated, deleteUser);
userRoutes.delete('/user/:userId', isAuthenticated, checkOwnership('Users', 'userId', '_id'), deleteUser);

// Speakers
userRoutes.get('/speakers', getSpeakers);
userRoutes.post('/speaker', isAuthenticated, isInGroup([Roles.ADMIN]), setUserAsSpeaker);

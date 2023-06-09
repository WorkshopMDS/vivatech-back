import { Router } from 'express';

import {
  deleteUser,
  getSpeaker,
  getSpeakers,
  getUser,
  getUsers,
  login,
  refreshAccessToken,
  register,
  setUserAsSpeaker,
  updateCvScanned,
  updateUser,
  updateUserJourneys,
} from '../controllers/user.controller';
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
userRoutes.patch('/user/:userId/cv', isAuthenticated, isInGroup([Roles.ADMIN]), updateCvScanned);
userRoutes.patch('/user/:userId/journeys', isAuthenticated, isInGroup([Roles.ADMIN]), updateUserJourneys);

userRoutes.delete('/user', isAuthenticated, deleteUser);
userRoutes.delete('/user/:userId', isAuthenticated, checkOwnership('Users', 'userId', '_id'), deleteUser);

// Speakers
userRoutes.get('/speakers', getSpeakers);
userRoutes.get('/speaker/:speakerId', getSpeaker);
userRoutes.post('/speaker', isAuthenticated, isInGroup([Roles.ADMIN]), setUserAsSpeaker);

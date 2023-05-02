import { Router } from 'express';

import { checkTicket, deleteTicket, getTickets, addTicket, getTicket } from '../controllers';
import { createUserIfNotExist, isAuthenticated } from '../middlewares/auth.middleware';
import { isInGroup } from '../middlewares/permission.middleware';
import { Roles } from '../utils/roles';

export const ticketRoutes: Router = Router();

ticketRoutes.post('/ticket', createUserIfNotExist, isAuthenticated, addTicket);
ticketRoutes.get('/tickets', isAuthenticated, isInGroup([Roles.ADMIN]), getTickets);
ticketRoutes.get('/ticket/:ticketId', isAuthenticated, isInGroup([Roles.ADMIN]), getTicket);
ticketRoutes.get('/ticket/validation/:ticketId', checkTicket);
ticketRoutes.delete('/ticket/:ticketId', isAuthenticated, isInGroup([Roles.ADMIN]), deleteTicket);

import type { Response, Request } from 'express';

import Ticket from '../models/ticket.model';
import type { IRequest } from '../types/global.type';
import type { ITicket } from '../types/ticket.type';
import { errorFormatter, ErrorMessages } from '../utils/errors';

export const getTicket = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { ticketId } = req.params;

    if (!ticketId) {
      return errorFormatter(res, 400, ErrorMessages.MALFORMED_DATA);
    }

    const ticket: ITicket | null = await Ticket.findOne({ ticketId }).select(['-__v', '-_id']).populate('user');
    if (!ticket) {
      return errorFormatter(res, 400, ErrorMessages.NOT_FOUND);
    }

    return res.status(200).json(ticket);
  } catch (error) {
    return errorFormatter(res, 400, ErrorMessages.SERVER_ERROR, error);
  }
};

export const getTickets = async (_: Request, res: Response): Promise<Response> => {
  try {
    const tickets: ITicket[] = await Ticket.find().select(['-__v', '-_id']).populate('user');
    return res.status(200).json({ tickets });
  } catch (error) {
    return errorFormatter(res, 400, ErrorMessages.SERVER_ERROR, error);
  }
};

export const checkTicket = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { ticketId } = req.params;

    if (!ticketId) {
      return errorFormatter(res, 400, ErrorMessages.MALFORMED_DATA);
    }

    const ticket: ITicket | null = await Ticket.findOne({ ticketId }).select(['-__v', '-_id']);
    if (!ticket) {
      return errorFormatter(res, 400, ErrorMessages.NOT_FOUND);
    }

    return res.status(200).send();
  } catch (error) {
    return errorFormatter(res, 400, ErrorMessages.SERVER_ERROR, error);
  }
};

export const addTicket = async (req: IRequest, res: Response): Promise<Response> => {
  try {
    const { validityPeriod } = req.body;

    if (!validityPeriod || (!validityPeriod[0] && !validityPeriod[1])) {
      return errorFormatter(res, 400, ErrorMessages.MALFORMED_DATA);
    }

    const ticket: ITicket = new Ticket({
      user: req.user?.id,
      validityPeriod,
    });
    await ticket.save();

    // Return accessToken if user has been generated by us to let him
    // use our API and avoid spamming
    return res.status(201).json({
      ticketId: ticket.ticketId,
      accessToken: req.headers.authorization?.split(' ')[1],
    });
  } catch (error) {
    return errorFormatter(res, 400, ErrorMessages.SERVER_ERROR, error);
  }
};

export const deleteTicket = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { ticketId } = req.params;

    if (!ticketId) {
      return errorFormatter(res, 400, ErrorMessages.MALFORMED_DATA);
    }

    const ticket = await Ticket.findOneAndDelete({ ticketId }).select(['-__v', '-_id']);
    if (!ticket) {
      return errorFormatter(res, 400, ErrorMessages.NOT_FOUND);
    }

    return res.status(200).json(ticket);
  } catch (error) {
    return errorFormatter(res, 400, ErrorMessages.SERVER_ERROR, error);
  }
};

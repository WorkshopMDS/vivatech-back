import type { Response } from 'express';

export const ErrorMessages = {
  MALFORMED_DATA: 'Request malformed.',
  SERVER_ERROR: 'Something went wrong.',
  CONNECTION_ERROR: 'Error during login.',
  NOT_FOUND: 'Data not found.',
  NOT_AUTHORIZED: 'You are not authorized to access to this data.',
  UNAUTHORIZED: 'Authentification required.',
  FORBIDDEN: 'Access denied.',
  ALREADY_EXIST: 'Data already exist.',
};

export const errorFormatter = (res: Response, code: number, message: string, error?: any) => {
  if (process.env.NODE_ENV === 'production') {
    res.status(code).json({
      error: true,
      message,
    });
  } else {
    res.status(code).json({
      error: true,
      message,
      debug: error,
    });
  }
};

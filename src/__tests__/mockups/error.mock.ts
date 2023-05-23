import type { IError } from '../../types/global.type';

export const error: IError = {
  400: {
    name: 'Error',
    httpStatusCode: 400,
    description: 'Bad request.',
    isOperational: true,
  },
  401: {
    name: 'Error',
    httpStatusCode: 401,
    description: 'Must be authenticated.',
    isOperational: true,
  },
  403: {
    name: 'Error',
    httpStatusCode: 403,
    description: "You don't have the right access to execute this request.",
    isOperational: true,
  },
  404: {
    name: 'Error',
    httpStatusCode: 404,
    description: 'Resource not found.',
    isOperational: true,
  },
  500: {
    name: 'Error',
    httpStatusCode: 500,
    description: 'Internal server error.',
    isOperational: true,
  },
};

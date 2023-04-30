export enum HttpStatusCodes {
  SUCCESS = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  INTERNAL_SERVER = 500,
  UNAVAILABLE = 503,
};

export enum HttpStatusCodesDescriptions {
  SUCCESS = 'Success.',
  CREATED = 'Successfully created.',
  BAD_REQUEST = 'Bad request.',
  UNAUTHORIZED = 'Must be authenticated.',
  FORBIDDEN = 'You don\'t have the right access to execute this request.',
  NOT_FOUND = 'Resource not found.',
  METHOD_NOT_ALLOWED = 'Unauthorized request method.',
  INTERNAL_SERVER = 'Internal server error.',
  UNAVAILABLE = 'Service unavailable.',
};
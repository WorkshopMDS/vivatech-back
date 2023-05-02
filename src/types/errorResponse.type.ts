export interface ErrorResponse {
  name: string;
  httpStatusCode: number;
  description?: string;
  message?: string;
  isOperational: boolean;
  timestamp: number;
};

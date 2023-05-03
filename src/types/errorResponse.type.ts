export interface IErrorResponse {
  name: string;
  httpStatusCode: number;
  description?: string;
  message?: string;
  isOperational: boolean;
  timestamp: number;
}

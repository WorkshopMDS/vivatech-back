import _ from 'lodash';
import type request from 'supertest';

import { generateAccessToken } from '../../controllers/user.controller';
import UserModel from '../../models/user.model';
import type { ApiResponse } from '../../utils/apiResponse';
import { error } from '../mockups/error.mock';

export const generateUser = async (role?: number) => {
  const user = new UserModel({
    email: `eric.dali+${new Date().toISOString()}@example.com`,
    role,
  });
  await user.save();

  const userAccessToken = generateAccessToken({ id: user.id, email: user.email, role: user.role });

  return {
    user,
    accessToken: userAccessToken,
  };
};

export const omitTimestamp = (response: ApiResponse) => {
  _.unset(response, 'timestamp');
  return response;
};

export const expectError = (response: request.Response, errorCode: number) => {
  const expected = JSON.stringify(error[errorCode]);

  expect(response.status).toBe(errorCode);
  _.unset(response.body, 'data');
  expect(JSON.stringify(omitTimestamp(response.body))).toBe(expected);
};

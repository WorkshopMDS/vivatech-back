import _ from 'lodash';

import { generateAccessToken } from '../../controllers/user.controller';
import InterestModel from '../../models/interest.model';
import UserModel from '../../models/user.model';
import type { ApiResponse } from '../../utils/apiResponse';

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

export const generateInterest = async () => {
  const interest = new InterestModel({
    label: 'TestInterest',
  });

  await interest.save();

  return {
    interest,
  };
};

export const omitTimestamp = (response: ApiResponse) => {
  _.unset(response, 'timestamp');
  return response;
};

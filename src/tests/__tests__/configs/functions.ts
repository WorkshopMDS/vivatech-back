import { generateAccessToken } from '../../controllers/user.controllers';
import UserModel from '../../models/user.model';

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

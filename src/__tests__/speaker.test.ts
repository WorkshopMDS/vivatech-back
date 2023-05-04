import { afterAll } from '@jest/globals';
import request from 'supertest';

import { generateUser } from './configs/functions';
import * as db from './configs/setup';
import app from '../app';
import type { IUser, IUserDocument } from '../types/user.type';
import { Roles } from '../utils/roles';

describe('test_speaker_feature_routes', () => {
  let user: IUser;
  let userAccessToken: string;
  let adminUser: IUserDocument;
  let adminAccessToken: string;

  beforeAll(async () => {
    await db.connect();
    ({ user, accessToken: userAccessToken } = await generateUser());
    ({ user: adminUser, accessToken: adminAccessToken } = await generateUser(Roles.ADMIN));
  });

  afterAll(async () => {
    await db.closeDatabase();
  });

  describe('POST /speaker', () => {
    it("should create a user if is not exist and I'm admin", async () => {
      const response = await request(app).post('/speaker').set('Authorization', `Bearer ${adminAccessToken}`).send({
        email: 'new+speaker@example.com',
      });

      expect(response.status).toBe(201);
      expect(response.body.data.role).toBe(Roles.SPEAKER);
    });

    it("should update a user if is exist and I'm admin", async () => {
      const response = await request(app).post('/speaker').set('Authorization', `Bearer ${adminAccessToken}`).send({
        email: user.email,
      });

      expect(response.status).toBe(200);
      expect(response.body.data.role).toBe(Roles.SPEAKER);
    });

    it('should return 403 if common user try to create a user with speaker role', async () => {
      const response = await request(app).post('/speaker').set('Authorization', `Bearer ${userAccessToken}`).send({
        email: 'speaker@example.com',
      });

      expect(response.status).toBe(403);
    });

    it('should return 403 if common user try to set user role to speaker', async () => {
      const response = await request(app).post('/speaker').set('Authorization', `Bearer ${userAccessToken}`).send({
        email: adminUser.id,
      });

      expect(response.status).toBe(403);
    });
  });

  describe('GET /speakers', () => {
    it('should return all users who have role speaker', async () => {
      const response = await request(app).get('/speakers');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(2);
    });
  });
});

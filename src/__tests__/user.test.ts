import { afterAll } from '@jest/globals';
import request from 'supertest';

import { generateUser } from './configs/functions';
import * as db from './configs/setup';
import app from '../app';
import { generateRefreshToken } from '../controllers/user.controller';
import type { IUser, IUserDocument } from '../types/user.type';
import { Roles } from '../utils/roles';

describe('Users routes', () => {
  let user: IUser;
  let userAccessToken: string;
  let userRefreshToken: string;
  let adminUser: IUserDocument;
  let adminAccessToken: string;

  beforeAll(async () => {
    await db.connect();
    ({ user: adminUser, accessToken: adminAccessToken } = await generateUser(Roles.ADMIN));
  });

  afterAll(async () => {
    await db.closeDatabase();
  });

  describe('POST /register', () => {
    it('should register a new user', async () => {
      const response = await request(app).post('/register').send({
        firstname: 'Jane',
        lastname: 'Doe',
        email: `jane.doe@example.com`,
        password: 'password',
      });
      userAccessToken = response.body.accessToken;
      userRefreshToken = response.body.refreshToken;

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
    });

    it('should return an error if email and password is missing', async () => {
      const response = await request(app).post('/register').send({
        firstname: 'Jane',
        lastname: 'Doe',
      });

      expect(response.status).toBe(400);
    });

    it('should return an error if email is already exist in database', async () => {
      const response = await request(app).post('/register').send({
        email: 'jane.doe@example.com',
      });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /user', () => {
    it('should let user get is own informations', async () => {
      const response = await request(app).get('/user').set('Authorization', `Bearer ${userAccessToken}`);
      user = response.body;

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('firstname');
      expect(response.body).toHaveProperty('lastname');
      expect(response.body).toHaveProperty('email');
      expect(response.body).not.toHaveProperty('password');
      expect(response.body).toHaveProperty('role');
      expect(response.body.role).toBe(1930);
    });

    it('should return an error if no access token is provided', async () => {
      const response = await request(app).get('/user');
      expect(response.status).toBe(401);
    });
  });

  describe('POST /login', () => {
    it('should log in an existing user', async () => {
      const response = await request(app).post('/login').send({
        email: user.email,
        password: 'password',
      });
      userAccessToken = response.body.accessToken;
      userRefreshToken = response.body.refreshToken;

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body).toHaveProperty('refreshToken');
    });

    it('should return an error if password is missing', async () => {
      const response = await request(app).post('/login').send({
        email: 'jane.doe@example.com',
      });

      expect(response.status).toBe(400);
    });

    it('should return an error if user does not exist', async () => {
      const response = await request(app).post('/login').send({
        email: 'nonexistent.user@example.com',
        password: 'password',
      });

      expect(response.status).toBe(400);
    });

    it('should return an error if password is incorrect', async () => {
      const response = await request(app).post('/login').send({
        email: 'jane.doe@example.com',
        password: 'wrongpassword',
      });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /users', () => {
    it('should return a list of users', async () => {
      const response = await request(app).get('/users').set('Authorization', `Bearer ${adminAccessToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.users)).toBe(true);
      expect(response.body.users).toHaveLength(2);
    });

    it('should return an error if user is not admin', async () => {
      const response = await request(app).get('/users').set('Authorization', `Bearer ${userAccessToken}`);

      expect(response.status).toBe(403);
      expect(response.body).not.toHaveProperty('users');
    });

    it('should return an error if no access token is provided', async () => {
      const response = await request(app).get('/user').send();

      expect(response.status).toBe(401);
      expect(response.body).not.toHaveProperty('users');
    });
  });

  describe('POST /refreshToken', () => {
    it('should generate a new access token with refresh token', async () => {
      const response = await request(app).post('/refreshToken').set('Authorization', `Bearer ${userRefreshToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('accessToken');
    });

    it('should return 401 if no token is provided', async () => {
      const response = await request(app).post('/refreshToken');

      expect(response.status).toBe(401);
      expect(response.body).not.toHaveProperty('accessToken');
    });

    it('should return 400 if refresh token not exist', async () => {
      const falseRefreshToken = generateRefreshToken({ id: 'wrongId', email: 'not-exit', role: 0 });
      const response = await request(app).post('/refreshToken').set('Authorization', `Bearer ${falseRefreshToken}`);

      expect(response.status).toBe(400);
      expect(response.body).not.toHaveProperty('accessToken');
    });

    it('should return 400 if refresh token is wrong format', async () => {
      const response = await request(app)
        .post('/refreshToken')
        .set(
          'Authorization',
          `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`
        );

      expect(response.status).toBe(400);
      expect(response.body).not.toHaveProperty('accessToken');
    });
  });

  describe('PATCH /user', () => {
    it('should let user update is own account', async () => {
      const response = await request(app).patch('/user').set('Authorization', `Bearer ${userAccessToken}`).send({
        firstname: 'Edited',
      });

      expect(response.status).toBe(200);
      expect(response.body.firstname).toBe('Edited');
    });

    it('should not add unknown field', async () => {
      const response = await request(app).patch('/user').set('Authorization', `Bearer ${userAccessToken}`).send({
        unknown: 'Edited',
      });

      expect(response.status).toBe(200);
      expect(response.body).not.toHaveProperty('unknown');
    });

    it('should return an error when user wants to update other accounts', async () => {
      const response = await request(app)
        .patch(`/user/${adminUser.id}`)
        .set('Authorization', `Bearer ${userAccessToken}`);

      expect(response.status).toBe(403);
    });

    it('should let admin update other accounts', async () => {
      const response = await request(app)
        .patch(`/user/${user.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          firstname: 'Edited',
        });

      expect(response.status).toBe(200);
      expect(response.body.firstname).toBe('Edited');
    });
  });

  describe('DELETE /user', () => {
    it('should let user delete is own account', async () => {
      const response = await request(app).delete('/user').set('Authorization', `Bearer ${userAccessToken}`);
      expect(response.status).toBe(200);
    });

    it('should return an error when user wants to delete other accounts', async () => {
      const response = await request(app)
        .delete(`/user/${adminUser.id}`)
        .set('Authorization', `Bearer ${userAccessToken}`);

      expect(response.status).toBe(403);
    });

    it('should let admin delete other accounts', async () => {
      const { user: tempUser } = await generateUser();

      const response = await request(app)
        .delete(`/user/${tempUser.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`);

      expect(response.status).toBe(200);
    });
  });
});

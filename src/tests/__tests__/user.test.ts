import { afterAll } from '@jest/globals';
import request from 'supertest';

import * as db from './configs/setup';
import app from '../../app';
import { generateAccessToken } from '../../controllers/user.controllers';
import UserModel from '../../models/user.model';
import type { IUser, IUserDocument } from '../../types/user.type';

describe('Users routes', () => {
  let user: IUser;
  let userAccessToken: string;
  let adminUser: IUserDocument;
  let adminAccessToken: string;

  beforeAll(async () => {
    await db.connect();
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
  });

  describe('GET /user', () => {
    it('should let user get is own informations', async () => {
      const response = await request(app).get('/user').set('Authorization', `Bearer ${userAccessToken}`);
      user = response.body;

      expect(response.status).toBe(200);
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
      // Generate an admin user
      adminUser = new UserModel({
        firstname: 'Admin',
        email: `admin+${new Date().toISOString()}@example.com`,
        password: 'adminPassword',
        role: 19518,
      });
      await adminUser.save();
      adminAccessToken = generateAccessToken({ id: adminUser.id, email: adminUser.email, role: adminUser.role });

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
      const tempUser = new UserModel({
        firstname: 'temp',
        email: 'temp@example.com',
        password: 'temp',
      });
      await tempUser.save();
      const response = await request(app)
        .delete(`/user/${tempUser.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`);

      expect(response.status).toBe(200);
    });
  });
});

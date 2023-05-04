import { afterAll } from '@jest/globals';
import request from 'supertest';

import { generateUser } from './configs/functions';
import * as db from './configs/setup';
import app from '../app';
import type { ITalk } from '../types/talk.type';
import type { IUser, IUserDocument } from '../types/user.type';
import { Roles } from '../utils/roles';

describe('Talks routes', () => {
  let user: IUser;
  let userAccessToken: string;
  let adminUser: IUserDocument;
  let adminAccessToken: string;

  let talk: ITalk;

  beforeAll(async () => {
    await db.connect();
    ({ user, accessToken: userAccessToken } = await generateUser());
    ({ user: adminUser, accessToken: adminAccessToken } = await generateUser(Roles.ADMIN));
  });

  afterAll(async () => {
    await db.closeDatabase();
  });

  describe('POST /talk', () => {
    it('should create a new talk', async () => {
      const response = await request(app)
        .post('/talk')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          title: 'Beautifull talk',
          userId: user.id,
          startDate: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          endDate: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
        });

      expect(response.status).toBe(201);
      expect(response.body.createdBy).toBe(adminUser.id);
    });

    it('should return a 400 if admin user pass wrong data', async () => {
      const response = await request(app).post(`/talk`).set('Authorization', `Bearer ${adminAccessToken}`).send({
        unknown: 'unknown',
      });
      expect(response.status).toBe(400);
    });

    it('should return a 400 if required data is not set', async () => {
      const response = await request(app).post('/speaker').set('Authorization', `Bearer ${userAccessToken}`);
      expect(response.status).toBe(400);
    });

    it('should return a 401 if user is not connected', async () => {
      const response = await request(app).post('/speaker');
      expect(response.status).toBe(401);
    });

    it('should return a 403 if user try to add a talk', async () => {
      const response = await request(app).post('/talk').set('Authorization', `Bearer ${userAccessToken}`);
      expect(response.status).toBe(403);
    });
  });

  describe('GET /talks', () => {
    it('should return all talks', async () => {
      const response = await request(app).get('/talks');

      expect(response.status).toBe(200);
      expect(response.body.talks).toHaveLength(1);
    });
  });

  describe('GET /talk/:talkId', () => {
    it('should return a specific talk', async () => {
      const response = await request(app).get(`/talk/${talk.id}`);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe(talk.title);
    });

    it('should return a 400 if talk does not exist', async () => {
      const response = await request(app).get(`/talk/unknown-id`);
      expect(response.status).toBe(400);
    });

    it('should return a 400 error if route no id provided', async () => {
      const response = await request(app).get(`/talk`);
      expect(response.status).toBe(400);
    });
  });

  describe('PATCH /talk/:talkId', () => {
    it('should edit a talk as admin', async () => {
      const newTitle = 'New talk title';
      const response = await request(app)
        .patch(`/talk/${talk.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          title: newTitle,
        });

      expect(response.status).toBe(200);
      expect(response.body.title).not.toBe(talk.title);
      expect(response.body.title).toBe(newTitle);
    });

    it('should return a 400 if admin user pass wrong data', async () => {
      const response = await request(app).patch(`/talk`).set('Authorization', `Bearer ${adminAccessToken}`).send({
        unknown: 'unknown',
      });
      expect(response.status).toBe(400);
    });

    it('should return a 400 if talk does not exist', async () => {
      const response = await request(app).patch(`/talk/unknown-id`);
      expect(response.status).toBe(400);
    });

    it('should return a 401 if user trying to edit a talk', async () => {
      const newTitle = 'Other talk title';
      const response = await request(app)
        .patch(`/talk/${talk.id}`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({
          title: newTitle,
        });

      expect(response.status).toBe(401);
      expect(response.body.title).toBe('New talk title'); // Changed in previous test
      expect(response.body.title).not.toBe(newTitle);
    });
  });

  describe('DELETE /talk/:talkId', () => {
    it('should delete a specific talk if user is admin', async () => {
      const response = await request(app).delete(`/talk/${talk.id}`).set('Authorization', `Bearer ${adminAccessToken}`);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe(talk.title);
    });

    it('should return a 400 if talk does not exist', async () => {
      const response = await request(app).delete(`/talk/unknown-id`);
      expect(response.status).toBe(400);
    });

    it('should return a 401 if not accessToken provided', async () => {
      const response = await request(app).delete(`/talk/${talk.id}`);
      expect(response.status).toBe(401);
    });

    it('should return a 403 if non-admin user trying to delete a talk', async () => {
      const response = await request(app).delete(`/talk/${talk.id}`).set('Authorization', `Bearer ${userAccessToken}`);
      expect(response.status).toBe(403);
    });
  });
});

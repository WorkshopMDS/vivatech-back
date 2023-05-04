import { afterAll } from '@jest/globals';
import _ from 'lodash';
import request from 'supertest';

import { UNKNOWN_ID } from './configs/constants';
import { expectError, generateUser } from './configs/functions';
import * as db from './configs/setup';
import app from '../app';
import type { ITalk } from '../types/talk.type';
import type { IUser, IUserDocument } from '../types/user.type';
import { Roles } from '../utils/roles';

describe('test_talk_feature_routes', () => {
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
          speaker: user.id,
          startDate: new Date(new Date().setDate(new Date().getDate() + 1)), // tomorrow
          endDate: new Date(new Date().setDate(new Date().getDate() + 7)), // Next week
        });
      talk = response.body.data;

      expect(response.status).toBe(201);
      expect(response.body.data.createdBy).toBe(adminUser.id);
    });

    it('should return a 400 if required data is not set', async () => {
      const response = await request(app).post(`/talk`).set('Authorization', `Bearer ${adminAccessToken}`).send({
        unknown: 'unknown',
        // Missing title
      });
      expectError(response, 400);
    });

    it('should return a 401 if user is not connected', async () => {
      const response = await request(app).post('/talk');
      expectError(response, 401);
    });

    it('should return a 403 if user try to add a talk', async () => {
      const response = await request(app).post('/talk').set('Authorization', `Bearer ${userAccessToken}`);
      expectError(response, 403);
    });
  });

  describe('GET /talks', () => {
    it('should return all talks', async () => {
      const response = await request(app).get('/talks');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
    });
  });

  describe('GET /talk/:talkId', () => {
    it('should return a specific talk', async () => {
      const response = await request(app).get(`/talk/${talk.id}`);

      expect(response.status).toBe(200);
      expect(response.body.data.title).toBe(talk.title);
    });

    it('should return a 404 error if no id provided', async () => {
      const response = await request(app).get(`/talk`);
      expectError(response, 404);
    });

    it('should return a 404 if talk does not exist', async () => {
      const response = await request(app).get(`/talk/${UNKNOWN_ID}`);
      expectError(response, 404);
    });

    it('should return a 500 error if id is incorrect', async () => {
      const response = await request(app).get(`/talk/ddd`);
      expectError(response, 500);
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
      expect(response.body.data.title).toBe(newTitle);
    });

    it('should return a 403 if user trying to edit a talk', async () => {
      const response = await request(app)
        .patch(`/talk/${talk.id}`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({
          title: 'Other talk title',
        });

      expectError(response, 403);
    });

    it('should return a 404 if talk does not exist', async () => {
      const response = await request(app)
        .patch(`/talk/${UNKNOWN_ID}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          title: 'Other talk title',
        });
      expectError(response, 404);
    });

    it('should return a 500 if id is unknown', async () => {
      const response = await request(app)
        .patch(`/talk/unknown`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          title: 'Other talk title',
        });
      expectError(response, 500);
    });
  });

  describe('DELETE /talk/:talkId', () => {
    it('should delete a specific talk if user is admin', async () => {
      const response = await request(app).delete(`/talk/${talk.id}`).set('Authorization', `Bearer ${adminAccessToken}`);
      expect(response.status).toBe(200);
    });

    it('should return a 401 if not accessToken provided', async () => {
      const response = await request(app).delete(`/talk/${talk.id}`);
      expectError(response, 401);
    });

    it('should return a 403 if non-admin user trying to delete a talk', async () => {
      const response = await request(app).delete(`/talk/${talk.id}`).set('Authorization', `Bearer ${userAccessToken}`);
      expectError(response, 403);
    });

    it('should return a 404 if talk does not exist', async () => {
      const response = await request(app)
        .delete(`/talk/${UNKNOWN_ID}`)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      expectError(response, 404);
    });

    it('should return a 500 if id is unknown', async () => {
      const response = await request(app).delete(`/talk/unknown`).set('Authorization', `Bearer ${adminAccessToken}`);
      expectError(response, 500);
    });
  });
});

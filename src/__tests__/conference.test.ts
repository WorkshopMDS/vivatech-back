import { afterAll } from '@jest/globals';
import request from 'supertest';

import { UNKNOWN_ID } from './configs/constants';
import { expectError, generateUser } from './configs/functions';
import * as db from './configs/setup';
import app from '../app';
import type { IConference } from '../types/conference.type';
import type { IUser, IUserDocument } from '../types/user.type';
import { Roles } from '../utils/roles';

describe('test_conference_feature_routes', () => {
  let user: IUser;
  let userAccessToken: string;
  let adminUser: IUserDocument;
  let adminAccessToken: string;

  let conference: IConference;

  beforeAll(async () => {
    await db.connect();
    ({ user, accessToken: userAccessToken } = await generateUser());
    ({ user: adminUser, accessToken: adminAccessToken } = await generateUser(Roles.ADMIN));
  });

  afterAll(async () => {
    await db.closeDatabase();
  });

  describe('POST /conference', () => {
    it('should create a new conference', async () => {
      const response = await request(app)
        .post('/conference')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          title: 'Beautifull conference',
          speaker: user.id,
          startDate: new Date(new Date().setDate(new Date().getDate() + 1)), // tomorrow
          endDate: new Date(new Date().setDate(new Date().getDate() + 7)), // Next week
        });
      conference = response.body.data;

      expect(response.status).toBe(201);
      expect(response.body.data.createdBy).toBe(adminUser.id);
    });

    it('should return a 400 if required data is not set', async () => {
      const response = await request(app).post(`/conference`).set('Authorization', `Bearer ${adminAccessToken}`).send({
        unknown: 'unknown',
        // Missing title
      });
      expectError(response, 400);
    });

    it('should return a 401 if user is not connected', async () => {
      const response = await request(app).post('/conference');
      expectError(response, 401);
    });

    it('should return a 403 if user try to add a conference', async () => {
      const response = await request(app).post('/conference').set('Authorization', `Bearer ${userAccessToken}`);
      expectError(response, 403);
    });
  });

  describe('GET /conferences', () => {
    it('should return all conferences', async () => {
      const response = await request(app).get('/conferences');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
    });
  });

  describe('GET /conference/:conferenceId', () => {
    it('should return a specific conference', async () => {
      const response = await request(app).get(`/conference/${conference.id}`);

      expect(response.status).toBe(200);
      expect(response.body.data.title).toBe(conference.title);
    });

    it('should return a 404 error if no id provided', async () => {
      const response = await request(app).get(`/conference`);
      expectError(response, 404);
    });

    it('should return a 404 if conference does not exist', async () => {
      const response = await request(app).get(`/conference/${UNKNOWN_ID}`);
      expectError(response, 404);
    });

    it('should return a 500 error if id is incorrect', async () => {
      const response = await request(app).get(`/conference/ddd`);
      expectError(response, 500);
    });
  });

  describe('PATCH /conference/:conferenceId', () => {
    it('should edit a conference as admin', async () => {
      const newTitle = 'New conference title';
      const response = await request(app)
        .patch(`/conference/${conference.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          title: newTitle,
        });

      expect(response.status).toBe(200);
      expect(response.body.data.title).toBe(newTitle);
    });

    it('should return a 403 if user trying to edit a conference', async () => {
      const response = await request(app)
        .patch(`/conference/${conference.id}`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({
          title: 'Other conference title',
        });

      expectError(response, 403);
    });

    it('should return a 404 if conference does not exist', async () => {
      const response = await request(app)
        .patch(`/conference/${UNKNOWN_ID}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          title: 'Other conference title',
        });
      expectError(response, 404);
    });

    it('should return a 500 if id is unknown', async () => {
      const response = await request(app)
        .patch(`/conference/unknown`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          title: 'Other conference title',
        });
      expectError(response, 500);
    });
  });

  describe('DELETE /conference/:conferenceId', () => {
    it('should delete a specific conference if user is admin', async () => {
      const response = await request(app)
        .delete(`/conference/${conference.id}`)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      expect(response.status).toBe(200);
    });

    it('should return a 401 if not accessToken provided', async () => {
      const response = await request(app).delete(`/conference/${conference.id}`);
      expectError(response, 401);
    });

    it('should return a 403 if non-admin user trying to delete a conference', async () => {
      const response = await request(app)
        .delete(`/conference/${conference.id}`)
        .set('Authorization', `Bearer ${userAccessToken}`);
      expectError(response, 403);
    });

    it('should return a 404 if conference does not exist', async () => {
      const response = await request(app)
        .delete(`/conference/${UNKNOWN_ID}`)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      expectError(response, 404);
    });

    it('should return a 500 if id is unknown', async () => {
      const response = await request(app)
        .delete(`/conference/unknown`)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      expectError(response, 500);
    });
  });
});

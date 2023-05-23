import { afterAll } from '@jest/globals';
import _ from 'lodash';
import request from 'supertest';

import { expectError, generateInterest, generateUser, omitTimestamp } from './configs/functions';
import * as db from './configs/setup';
import { error } from './mockups/error.mock';
import { exhibitor } from './mockups/exhibitor.mock';
import app from '../app';
import type { IInterest } from '../types/interest.type';
import { Roles } from '../utils/roles';

describe('test_exhibitor_feature_routes', () => {
  let exhibitorId: string;
  let userAccessToken: string;
  let adminAccessToken: string;
  const generatedInterest: object[] = [];
  let interest: IInterest;

  beforeAll(async () => {
    await db.connect();
    ({ accessToken: userAccessToken } = await generateUser());
    ({ accessToken: adminAccessToken } = await generateUser(Roles.ADMIN));
    ({ interest } = await generateInterest());
    generatedInterest.push(interest);
  });

  afterAll(async () => {
    await db.closeDatabase();
  });

  describe('POST /exhibitor', () => {
    it("should create a new exhibitor and return the exhibitor's data", async () => {
      exhibitor.add.interests = interest._id;
      const response = await request(app)
        .post('/exhibitor')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(exhibitor.add);
      exhibitorId = response.body.data.id;
      exhibitor.addResponse.data.interests.push(generatedInterest[0]);
      const expected = JSON.stringify(exhibitor.addResponse);

      expect(response.status).toBe(201);

      expect(typeof response.body).toBe('object');
      expect(typeof response.body.data).toBe('object');

      _.unset(response.body, 'data.id');
      expect(JSON.stringify(omitTimestamp(response.body))).toBe(expected);
    });

    it('should return an object of the error 400 if there is a missing value in body request.', async () => {
      const response = await request(app)
        .post('/exhibitor')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(exhibitor.invalidAdd);
      const expected = JSON.stringify(error[400]);

      expect(response.status).toBe(400);
      expect(JSON.stringify(omitTimestamp(response.body))).toBe(expected);
    });

    it('should return an 401 if user is not connected', async () => {
      const response = await request(app).post('/exhibitor').send(exhibitor.invalidAdd);
      const expected = JSON.stringify(error[401]);

      expect(response.status).toBe(401);
      expect(JSON.stringify(omitTimestamp(response.body))).toBe(expected);
    });

    it('should return an 403 if non-admin user try to add an exhibitor', async () => {
      const response = await request(app)
        .post('/exhibitor')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send(exhibitor.invalidAdd);
      const expected = JSON.stringify(error[403]);

      expect(response.status).toBe(403);
      expect(JSON.stringify(omitTimestamp(response.body))).toBe(expected);
    });
  });

  describe('GET /exhibitors', () => {
    it('should return a list with 1 exhibitor', async () => {
      const response = await request(app).get('/exhibitors');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
    });

    it('should return the correct value of the first exhibitor', async () => {
      const response = await request(app).get('/exhibitors');
      exhibitor.firstArrayKey.interests.push(generatedInterest[0]);
      const expected = JSON.stringify(exhibitor.firstArrayKey);

      expect(response.status).toBe(200);
      expect(typeof response.body).toBe('object');
      expect(typeof response.body.data).toBe('object');

      _.unset(response.body.data[0], 'id');
      expect(JSON.stringify(_.omit(response.body.data[0], 'timestamp'))).toBe(expected);
    });
  });

  describe('GET /exhibitor/:exhibitorId', () => {
    it('should return the correct types of each value', async () => {
      const response = await request(app).get(`/exhibitor/${exhibitorId}`);
      exhibitor.firstId.data.interests.push(generatedInterest[0]);
      const expected = JSON.stringify(exhibitor.firstId);

      expect(response.status).toBe(200);

      expect(typeof response.body).toBe('object');
      expect(typeof response.body.data).toBe('object');

      _.unset(response.body, 'data.id');
      expect(JSON.stringify(omitTimestamp(response.body))).toBe(expected);
    });

    it('should return an object of the error 404 if the exhibitor has not been found.', async () => {
      const response = await request(app).get('/exhibitor/644e7dd0ddf96d369a6dd9c9');
      expectError(response, 404);
    });

    it("should return an object of the error 500 if the exhibitor's id is greater or less than 24 characters.", async () => {
      const response = await request(app).get('/exhibitor/644e7dd0ddf96d366a6dd8c20');
      expectError(response, 500);
    });
  });

  describe('PATCH /exhibitor/update', () => {
    it("should update an exhibitor and return the exhibitor's data", async () => {
      exhibitor.update.interests = interest._id;
      const response = await request(app)
        .patch(`/exhibitor/${exhibitorId}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(exhibitor.update);
      exhibitor.updateResponse.data.interests.push(generatedInterest[0]);
      const expected = JSON.stringify(exhibitor.updateResponse);

      expect(response.status).toBe(200);

      expect(typeof response.body).toBe('object');
      expect(typeof response.body.data).toBe('object');

      _.unset(response.body, 'data.id');
      expect(JSON.stringify(omitTimestamp(response.body))).toBe(expected);
    });

    it('should return an object of the error 400 if there is a missing value in body request.', async () => {
      const response = await request(app)
        .patch(`/exhibitor/${exhibitorId}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(exhibitor.invalidUpdate);
      expectError(response, 400);
    });

    it('should return an object of the error 401 for non-authenticated user', async () => {
      const response = await request(app).patch(`/exhibitor/${exhibitorId}`).send(exhibitor.update);
      expectError(response, 401);
    });

    it('should return an object of the error 403 for non-admin user', async () => {
      const response = await request(app)
        .patch(`/exhibitor/${exhibitorId}`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send(exhibitor.update);
      expectError(response, 403);
    });

    it('should return an object of the error 404 if exhibitor has not been found.', async () => {
      const response = await request(app)
        .patch(`/exhibitor/123456789098123456789098`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(exhibitor.update);
      expectError(response, 404);
    });

    it('should return an object of the error 500 if the id is not correct.', async () => {
      const response = await request(app)
        .patch(`/exhibitor/12345678909812345678909`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(exhibitor.update);
      expectError(response, 500);
    });
  });

  describe('DELETE /exhibitor/delete', () => {
    it('should delete an exhibitor and return success.', async () => {
      const response = await request(app)
        .delete(`/exhibitor/${exhibitorId}`)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const expected = JSON.stringify(exhibitor.deleteResponse);

      expect(response.status).toBe(200);
      expect(typeof response.body).toBe('object');
      expect(JSON.stringify(omitTimestamp(response.body))).toBe(expected);
    });

    it('should return an object of the error 401 for non-authenticated user', async () => {
      const response = await request(app).delete(`/exhibitor/${exhibitorId}`);
      expectError(response, 401);
    });

    it('should return an object of the error 403 for non-admin user', async () => {
      const response = await request(app)
        .delete(`/exhibitor/${exhibitorId}`)
        .set('Authorization', `Bearer ${userAccessToken}`);
      expectError(response, 403);
    });

    it('should return an object of the error 404 if exhibitor has not been found.', async () => {
      const response = await request(app)
        .delete(`/exhibitor/123456789098123456789098`)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      expectError(response, 404);
    });

    it('should return an object of the error 500 if the id is not correct.', async () => {
      const response = await request(app)
        .delete(`/exhibitor/12345678909812345678909`)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      expectError(response, 500);
    });
  });
});

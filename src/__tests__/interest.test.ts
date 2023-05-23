import { afterAll } from '@jest/globals';
import _ from 'lodash';
import request from 'supertest';

import { generateUser, omitTimestamp } from './configs/functions';
import * as db from './configs/setup';
import { error } from './mockups/error.mock';
import { interest } from './mockups/interest.mock';
import app from '../app';
import { Roles } from '../utils/roles';

describe('test_interest_feature_routes', () => {
  let interestId: string;
  let userAccessToken: string;
  let adminAccessToken: string;

  beforeAll(async () => {
    await db.connect();
    ({ accessToken: userAccessToken } = await generateUser());
    ({ accessToken: adminAccessToken } = await generateUser(Roles.ADMIN));
  });

  afterAll(async () => {
    await db.closeDatabase();
  });

  describe('POST /interest', () => {
    it("should create a new interest and return the interest's data", async () => {
      const response = await request(app)
        .post('/interest')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(interest.add);
      interestId = response.body.data.id;
      const expected = JSON.stringify(interest.addResponse);

      expect(response.status).toBe(201);

      expect(typeof response.body).toBe('object');
      expect(typeof response.body.data).toBe('object');

      _.unset(response.body, 'data.id');
      expect(JSON.stringify(omitTimestamp(response.body))).toBe(expected);
    });

    it('should return an object of the error 400 if there is a missing value in body request.', async () => {
      const response = await request(app)
        .post('/interest')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(interest.invalidAdd);
      const expected = JSON.stringify(error[400]);

      expect(response.status).toBe(400);
      expect(JSON.stringify(omitTimestamp(response.body))).toBe(expected);
    });

    it('should return an 401 if user is not connected', async () => {
      const response = await request(app).post('/interest').send(interest.invalidAdd);
      const expected = JSON.stringify(error[401]);

      expect(response.status).toBe(401);
      expect(JSON.stringify(omitTimestamp(response.body))).toBe(expected);
    });

    it('should return an 403 if non-admin user try to add an interest', async () => {
      const response = await request(app)
        .post('/interest')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send(interest.invalidAdd);
      const expected = JSON.stringify(error[403]);

      expect(response.status).toBe(403);
      expect(JSON.stringify(omitTimestamp(response.body))).toBe(expected);
    });
  });

  describe('GET /interests', () => {
    it('should return a list with 1 interest', async () => {
      const response = await request(app).get('/interests');

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
    });

    it('should return the correct value of the first interest', async () => {
      const response = await request(app).get('/interests');
      const expected = JSON.stringify(interest.firstArrayKey);

      expect(response.status).toBe(200);
      expect(typeof response.body).toBe('object');
      expect(typeof response.body.data).toBe('object');

      _.unset(response.body.data[0], 'id');
      expect(JSON.stringify(_.omit(response.body.data[0], 'timestamp'))).toBe(expected);
    });
  });

  describe('GET /interest/:interestId', () => {
    it('should return the correct types of each value', async () => {
      const response = await request(app).get(`/interest/${interestId}`);
      const expected = JSON.stringify(interest.firstId);

      expect(response.status).toBe(200);

      expect(typeof response.body).toBe('object');
      expect(typeof response.body.data).toBe('object');

      _.unset(response.body, 'data.id');
      expect(JSON.stringify(omitTimestamp(response.body))).toBe(expected);
    });

    it('should return an object of the error 404 if the interest has not been found.', async () => {
      const response = await request(app).get('/interest/644e7dd0ddf96d369a6dd9c9');
      const expected = JSON.stringify(error[404]);

      expect(typeof response.body).toBe('object');
      expect(JSON.stringify(omitTimestamp(response.body))).toBe(expected);
    });

    it("should return an object of the error 500 if the interest's id is greater or less than 24 characters.", async () => {
      const response = await request(app).get('/interest/644e7dd0ddf96d366a6dd8c20');
      const expected = JSON.stringify(error[500]);

      expect(typeof response.body).toBe('object');
      expect(JSON.stringify(_.omit(response.body, ['timestamp', 'data']))).toBe(expected);
    });
  });

  describe('PATCH /interest/update', () => {
    it("should update an interest and return the interest's data", async () => {
      const response = await request(app)
        .patch(`/interest/${interestId}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(interest.update);
      const expected = JSON.stringify(interest.updateResponse);

      expect(response.status).toBe(200);

      expect(typeof response.body).toBe('object');
      expect(typeof response.body.data).toBe('object');

      _.unset(response.body, 'data.id');
      expect(JSON.stringify(omitTimestamp(response.body))).toBe(expected);
    });

    it('should return an object of the error 400 if there is a missing value in body request.', async () => {
      const response = await request(app)
        .patch(`/interest/${interestId}`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(interest.invalidUpdate);
      const expected = JSON.stringify(error[400]);

      expect(JSON.stringify(omitTimestamp(response.body))).toBe(expected);
    });

    it('should return an object of the error 401 for non-authenticated user', async () => {
      const response = await request(app).patch(`/interest/${interestId}`).send(interest.update);
      const expected = JSON.stringify(error[401]);

      expect(response.status).toBe(401);
      expect(JSON.stringify(omitTimestamp(response.body))).toBe(expected);
    });

    it('should return an object of the error 403 for non-admin user', async () => {
      const response = await request(app)
        .patch(`/interest/${interestId}`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send(interest.update);
      const expected = JSON.stringify(error[403]);

      expect(response.status).toBe(403);
      expect(JSON.stringify(omitTimestamp(response.body))).toBe(expected);
    });

    it('should return an object of the error 404 if interest has not been found.', async () => {
      const response = await request(app)
        .patch(`/interest/123456789098123456789098`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(interest.update);
      const expected = JSON.stringify(error[404]);

      expect(JSON.stringify(omitTimestamp(response.body))).toBe(expected);
    });

    it('should return an object of the error 500 if the id is not correct.', async () => {
      const response = await request(app)
        .patch(`/interest/12345678909812345678909`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send(interest.update);
      const expected = JSON.stringify(error[500]);

      expect(JSON.stringify(_.omit(response.body, ['timestamp', 'data']))).toBe(expected);
    });
  });

  describe('DELETE /interest/delete', () => {
    it('should delete an interest and return success.', async () => {
      const response = await request(app)
        .delete(`/interest/${interestId}`)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const expected = JSON.stringify(interest.deleteResponse);

      expect(response.status).toBe(200);
      expect(typeof response.body).toBe('object');
      expect(JSON.stringify(omitTimestamp(response.body))).toBe(expected);
    });

    it('should return an object of the error 401 for non-authenticated user', async () => {
      const response = await request(app).delete(`/interest/${interestId}`);
      const expected = JSON.stringify(error[401]);

      expect(response.status).toBe(401);
      expect(JSON.stringify(omitTimestamp(response.body))).toBe(expected);
    });

    it('should return an object of the error 403 for non-admin user', async () => {
      const response = await request(app)
        .delete(`/interest/${interestId}`)
        .set('Authorization', `Bearer ${userAccessToken}`);
      const expected = JSON.stringify(error[403]);

      expect(response.status).toBe(403);
      expect(JSON.stringify(omitTimestamp(response.body))).toBe(expected);
    });

    it('should return an object of the error 404 if interest has not been found.', async () => {
      const response = await request(app)
        .delete(`/interest/123456789098123456789098`)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const expected = JSON.stringify(error[404]);

      expect(JSON.stringify(omitTimestamp(response.body))).toBe(expected);
    });

    it('should return an object of the error 500 if the id is not correct.', async () => {
      const response = await request(app)
        .delete(`/interest/12345678909812345678909`)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      const expected = JSON.stringify(error[500]);

      expect(JSON.stringify(_.omit(response.body, ['timestamp', 'data']))).toBe(expected);
    });
  });
});

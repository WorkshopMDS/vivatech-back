import { afterAll } from '@jest/globals';
import _ from 'lodash';
import request from 'supertest';

import * as db from './configs/setup';
import app from '../app';
import { exhibitor } from './mockups/exhibitor.mock';
import { error } from './mockups/error.mock';

let id: string | undefined = '';
describe('GET /exhibitors', () => {
  beforeAll(async () => {
    await db.connect();
  });

  afterAll(async () => {
    await db.closeDatabase();
  });

  describe('POST /exhibitor/add', () => {
    it("should create a new exhibitor and return the exhibitor's data", async () => {
      const response = await request(app).post('/exhibitor/add').send(exhibitor.add);
      const expected = JSON.stringify(exhibitor.addResponse);

      expect(response.status).toBe(201);
      expect(typeof response.body).toBe('object');
      id = response.body.data._id;
      _.unset(response.body, 'data._id');
      expect(JSON.stringify(_.omit(response.body, ['timestamp']))).toBe(expected);
      expect(typeof response.body.data).toBe('object');
    });

    it('should return an object of the error 400 if there is a missing value in body request.', async () => {
      const response = await request(app).post('/exhibitor/add').send(exhibitor.invalidAdd);
      const expected = JSON.stringify(error[400]);

      expect(JSON.stringify(_.omit(response.body, 'timestamp'))).toBe(expected);
    });
  });

  it('should return the correct value of the first exhibitor', async () => {
    const response = await request(app).get('/exhibitors');
    const expected = JSON.stringify(exhibitor.firstArrayKey);

    expect(response.status).toBe(200);
    expect(typeof response.body).toBe('object');
    expect(typeof response.body.data).toBe('object');
    _.unset(response.body.data[0], '_id');
    _.unset(response.body.data[0], '__v');
    expect(JSON.stringify(_.omit(response.body.data[0], 'timestamp'))).toBe(expected);
  });

  describe('GET /exhibitor/644e7dd0ddf96d366a6dd8c2', () => {
    it('should return the correct types of each value', async () => {
      const response = await request(app).get(`/exhibitor/${id}`);
      const expected = JSON.stringify(exhibitor.firstId);

      expect(response.status).toBe(200);
      expect(typeof response.body).toBe('object');
      expect(typeof response.body.data).toBe('object');
      _.unset(response.body, 'data._id');
      _.unset(response.body, 'data.__v');
      expect(JSON.stringify(_.omit(response.body, 'timestamp'))).toBe(expected);
    });

    it('should return an object of the error 404 if the exhibitor has not been found.', async () => {
      const response = await request(app).get('/exhibitor/644e7dd0ddf96d369a6dd9c9');
      const expected = JSON.stringify(error[404]);

      expect(typeof response.body).toBe('object');
      expect(JSON.stringify(_.omit(response.body, ['timestamp']))).toBe(expected);
    });

    it("should return an object of the error 500 if the exhibitor's id is greater or less than 24 characters.", async () => {
      const response = await request(app).get('/exhibitor/644e7dd0ddf96d366a6dd8c20');
      const expected = JSON.stringify(error[500]);

      expect(typeof response.body).toBe('object');
      expect(JSON.stringify(_.omit(response.body, ['timestamp', 'data']))).toBe(expected);
    });
  });

  describe('PATCH /exhibitor/update', () => {
    it("should update an exhibitor and return the exhibitor's data", async () => {
      const response = await request(app).patch(`/exhibitor/update/${id}`).send(exhibitor.update);
      const expected = JSON.stringify(exhibitor.updateResponse);

      expect(response.status).toBe(200);
      expect(typeof response.body).toBe('object');
      _.unset(response.body, 'data._id');
      expect(JSON.stringify(_.omit(response.body, ['timestamp']))).toBe(expected);
      expect(typeof response.body.data).toBe('object');
    });

    it('should return an object of the error 400 if there is a missing value in body request.', async () => {
      const response = await request(app).patch(`/exhibitor/update/${id}`).send(exhibitor.invalidUpdate);
      const expected = JSON.stringify(error[400]);

      expect(JSON.stringify(_.omit(response.body, 'timestamp'))).toBe(expected);
    });

    it('should return an object of the error 404 if exhibitor has not been found.', async () => {
      const response = await request(app).patch(`/exhibitor/update/123456789098123456789098`).send(exhibitor.update);
      const expected = JSON.stringify(error[404]);

      expect(JSON.stringify(_.omit(response.body, 'timestamp'))).toBe(expected);
    });

    it('should return an object of the error 500 if the id is not correct.', async () => {
      const response = await request(app).patch(`/exhibitor/update/12345678909812345678909`).send(exhibitor.update);
      const expected = JSON.stringify(error[500]);

      expect(JSON.stringify(_.omit(response.body, ['timestamp', 'data']))).toBe(expected);
    });
  });

  describe('DELETE /exhibitor/delete', () => {
    it('should delete an exhibitor and return success.', async () => {
      const response = await request(app).delete(`/exhibitor/delete/${id}`);
      const expected = JSON.stringify(exhibitor.deleteResponse);

      expect(response.status).toBe(200);
      expect(typeof response.body).toBe('object');
      expect(JSON.stringify(_.omit(response.body, ['timestamp']))).toBe(expected);
    });

    it('should return an object of the error 404 if exhibitor has not been found.', async () => {
      const response = await request(app).patch(`/exhibitor/update/123456789098123456789098`).send(exhibitor.update);
      const expected = JSON.stringify(error[404]);

      expect(JSON.stringify(_.omit(response.body, 'timestamp'))).toBe(expected);
    });

    it('should return an object of the error 500 if the id is not correct.', async () => {
      const response = await request(app).patch(`/exhibitor/update/12345678909812345678909`).send(exhibitor.update);
      const expected = JSON.stringify(error[500]);

      expect(JSON.stringify(_.omit(response.body, ['timestamp', 'data']))).toBe(expected);
    });
  });
});

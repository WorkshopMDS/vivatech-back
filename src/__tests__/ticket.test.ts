import { afterAll } from '@jest/globals';
import request from 'supertest';

import { generateUser } from './configs/functions';
import * as db from './configs/setup';
import app from '../app';
import { Roles } from '../utils/roles';

describe('test_ticket_feature_routes', () => {
  let ticketId: string;
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

  describe('POST /ticket', () => {
    it('should create a new ticket as offline user', async () => {
      const newTicket = {
        firstname: 'John',
        lastname: 'Doe',
        email: `john.doe+${new Date().toISOString()}@example.com`,
        validityPeriod: [
          new Date(new Date().getTime() + 5 * 60 * 1000),
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        ], // current date and 7 days in the future
      };
      const response = await request(app).post('/ticket').send(newTicket);
      ticketId = response.body.data.ticketId;

      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('ticketId');
      expect(response.body.data).toHaveProperty('accessToken');
    });

    it('should create a new ticket as connected user', async () => {
      const newTicket = {
        validityPeriod: [
          new Date(new Date().getTime() + 5 * 60 * 1000),
          new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        ], // current date and 7 days in the future
      };
      const response = await request(app)
        .post('/ticket')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send(newTicket);

      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('ticketId');
      expect(response.body.data).toHaveProperty('accessToken');
    });

    it('should return 400 if request body is malformed', async () => {
      const malformedTicket = {
        // missing required fields
      };

      const response = await request(app)
        .post('/ticket')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send(malformedTicket);

      expect(response.status).toBe(400);
    });

    it('should return 400 if ticket could not be saved', async () => {
      const invalidTicket = {
        validityPeriod: [], // missing required validityPeriod dates
      };

      const response = await request(app)
        .post('/ticket')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send(invalidTicket);

      expect(response.status).toBe(400);
    });

    it('should return 400 if validityPeriod is in past', async () => {
      const invalidTicket = {
        firstname: 'John',
        lastname: 'Doe',
        email: `john.doe+${new Date().toISOString()}@example.com`,
        validityPeriod: [
          new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          new Date(new Date().getTime() - 24 * 60 * 60 * 1000), // 1 day ago
        ], // wrong validityPeriod dates
      };

      const response = await request(app)
        .post('/ticket')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send(invalidTicket);

      expect(response.status).toBe(500);
    });
  });

  describe('GET /tickets', () => {
    it('should return an array of tickets', async () => {
      const response = await request(app).get('/tickets').set('Authorization', `Bearer ${adminAccessToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data).toHaveLength(2);
    });

    it('should return unauthorized for non-admin users', async () => {
      const response = await request(app).get('/tickets').set('Authorization', `Bearer ${userAccessToken}`);

      expect(response.status).toBe(403);
      expect(response.body).not.toHaveProperty('data');
    });
  });

  describe('GET /ticket/:ticketId', () => {
    it('should return 403 when user try to get a ticket', async () => {
      const response = await request(app).get(`/ticket/${ticketId}`).set('Authorization', `Bearer ${userAccessToken}`);
      expect(response.status).toBe(403);
    });

    it('should get ticket as admin', async () => {
      const response = await request(app).get(`/ticket/${ticketId}`).set('Authorization', `Bearer ${adminAccessToken}`);
      expect(response.status).toBe(200);
    });

    it('should return 400 if ticket is not found', async () => {
      const response = await request(app).get('/ticket/unknown').set('Authorization', `Bearer ${adminAccessToken}`);
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /ticket/:ticketId', () => {
    it('should delete ticket as admin', async () => {
      const response = await request(app)
        .delete(`/ticket/${ticketId}`)
        .set('Authorization', `Bearer ${adminAccessToken}`);
      expect(response.status).toBe(200);
    });

    it('should return 403 when user try to remove a ticket', async () => {
      const response = await request(app)
        .delete(`/ticket/${ticketId}`)
        .set('Authorization', `Bearer ${userAccessToken}`);
      expect(response.status).toBe(403);
    });

    it('should return 404 if ticket is not found', async () => {
      const response = await request(app).delete('/ticket/unknown').set('Authorization', `Bearer ${adminAccessToken}`);
      expect(response.status).toBe(404);
    });
  });
});

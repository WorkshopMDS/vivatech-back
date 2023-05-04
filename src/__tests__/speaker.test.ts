import { afterAll } from '@jest/globals';
import _ from 'lodash';
import request from 'supertest';

import { UNKNOWN_ID } from './configs/constants';
import { expectError, generateUser, omitTimestamp } from './configs/functions';
import * as db from './configs/setup';
import { speakers } from './mockups/speaker.mock';
import app from '../app';
import type { IUser, IUserDocument } from '../types/user.type';
import { Roles } from '../utils/roles';

describe('test_speaker_feature_routes', () => {
  let user: IUser;
  let userAccessToken: string;
  let adminUser: IUserDocument;
  let adminAccessToken: string;

  let speaker: IUser;

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
      const response = await request(app)
        .post('/speaker')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .send({
          email: 'new+speaker@example.com',
          firstname: 'Speaker',
          lastname: 'Example',
          company: {
            name: 'Speaker Company',
            title: 'CE0',
          },
          biography: "I'm a speaker",
          picture: 'https://example.com/speaker.jpg',
        });
      speaker = response.body.data;

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

    it('should return 401 if unauthenticated user try to add a speaker', async () => {
      const response = await request(app).post('/speaker').send({
        email: 'speaker@example.com',
      });
      expectError(response, 401);
    });

    it('should return 403 if common user try to create a user with speaker role', async () => {
      const response = await request(app).post('/speaker').set('Authorization', `Bearer ${userAccessToken}`).send({
        email: 'speaker@example.com',
      });
      expectError(response, 403);
    });

    it('should return 403 if common user try to set user role to speaker', async () => {
      const response = await request(app).post('/speaker').set('Authorization', `Bearer ${userAccessToken}`).send({
        email: adminUser.id,
      });
      expectError(response, 403);
    });
  });

  describe('GET /speakers', () => {
    it('should return all users who have role speaker', async () => {
      const response = await request(app).get('/speakers');
      const expected = JSON.stringify(speakers.speakerReturn);

      expect(response.status).toBe(200);

      _.unset(response.body.data[1], 'id');
      expect(JSON.stringify(omitTimestamp(response.body.data[1]))).toBe(expected);
    });
  });

  describe('GET /speaker', () => {
    it('should return speaker with specific id', async () => {
      const response = await request(app).get(`/speaker/${speaker.id}`);
      const expected = JSON.stringify(speakers.getSpeaker);

      expect(response.status).toBe(200);

      _.unset(response.body, 'data.id');
      expect(JSON.stringify(omitTimestamp(response.body))).toBe(expected);
    });

    it('should return 404 if speaker id not exist', async () => {
      const response = await request(app).get(`/speaker/${UNKNOWN_ID}`);
      expectError(response, 404);
    });

    it('should return 500 if id is malformed', async () => {
      const response = await request(app).get(`/speaker/unknown`);
      expectError(response, 500);
    });
  });
});

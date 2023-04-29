import mongoose from 'mongoose';
import request from 'supertest';

import app from '../app';

describe('GET /users', () => {
  beforeEach(async () => {
    await mongoose.connect(process.env.MONGO_URI as string);
  });

  afterEach(async () => {
    await mongoose.connection.close();
  });

  it('should return a status code 200', async () => {
    const response = await request(app).get('/users');

    expect(response.status).toBe(200);
  });
});

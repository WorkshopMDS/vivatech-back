import mongoose from 'mongoose';
import request from 'supertest';

import app from '../app';

const URI = `mongodb+srv://${process.env.MONGO_ATLAS_USERNAME}:${process.env.MONGO_ATLAS_PASSWORD}@${process.env.MONGO_ATLAS_ADDRESS}/${process.env.MONGO_ATLAS_DATABASE}?retryWrites=true&w=majority`;

describe('GET /users', () => {
  beforeEach(async () => {
    await mongoose.connect(URI);
  });

  afterEach(async () => {
    await mongoose.connection.close();
  });

  it('should return a status code 200', async () => {
    const response = await request(app).get('/users');

    expect(response.status).toBe(200);
  });
});

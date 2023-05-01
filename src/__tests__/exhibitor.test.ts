import mongoose from 'mongoose';
import request from 'supertest';

import app from '../app';
import { json } from 'stream/consumers';
import { stringify } from 'querystring';

const URI = `mongodb+srv://${process.env.MONGO_ATLAS_USERNAME}:${process.env.MONGO_ATLAS_PASSWORD}@${process.env.MONGO_ATLAS_ADDRESS}/${process.env.MONGO_ATLAS_DATABASE}?retryWrites=true&w=majority`;

describe('GET /exhibitors', () => {
  beforeEach(async () => {
    await mongoose.connect(URI);
  });

  afterEach(async () => {
    await mongoose.connection.close();
  });

  it('should return a status code 200', async () => {
    const response = await request(app).get('/exhibitors');

    expect(response.status).toBe(200);
  });

  it('should return an object as body type', async () => {
    const response = await request(app).get('/exhibitors');

    expect(typeof(response.body)).toBe("object");
  })

  it('should return an object as the first value.', async () => {
    const response = await request(app).get('/exhibitors');

    expect(typeof(response.body.exhibitors)).toBe("object")
  })

  it('should return the correct value of the first exhibitor', async() => {
    const response = await request(app).get('/exhibitors');
    const expected = JSON.stringify(
      {
        "_id": "644e7dd0ddf96d366a6dd8c2",
        "name": "inwink",
        "picture": "https://storageprdv2inwink.blob.core.windows.net/abf9dc9e-3c12-4999-b77b-9e1614c9760d/d993fa2d-690b-45f9-bf9a-ae96209d5ce51",
        "place": "",
        "sectors": [
          "['Software Development', 'Cloud services']"
        ],
        "interests": [
          "['Saas']"
        ]
      }
    );

    expect(JSON.stringify(response.body.exhibitors[0])).toBe(expected);
  })
});
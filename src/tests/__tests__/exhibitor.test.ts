import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../app';
import { exhibitor } from '../mockups/exhibitor.mock';

import _ from 'lodash';
const URI = `mongodb+srv://${process.env.MONGO_ATLAS_USERNAME}:${process.env.MONGO_ATLAS_PASSWORD}@${process.env.MONGO_ATLAS_ADDRESS}/${process.env.MONGO_ATLAS_DATABASE}?retryWrites=true&w=majority`;

describe('GET /exhibitors', () => {
  beforeEach(async () => {
    await mongoose.connect(URI);
  });

  afterEach(async () => {
    await mongoose.connection.close();
  });

  it('should return the correct value of the first exhibitor', async() => {
    const response = await request(app).get('/exhibitors');
    const expected = JSON.stringify(exhibitor.firstArrayKey);

    expect(response.status).toBe(200);
    expect(typeof(response.body)).toBe("object");
    expect(typeof(response.body.data)).toBe("object")
    expect(JSON.stringify(response.body.data[0])).toBe(expected);
  })

  describe('GET /exhibitor/644e7dd0ddf96d366a6dd8c2', () => {
    it('should return the correct types of each value', async() => {
      const response = await request(app).get('/exhibitor/644e7dd0ddf96d366a6dd8c2');
      const expected = JSON.stringify(exhibitor.firstId);
  
      expect(response.status).toBe(200);
      expect(typeof(response.body)).toBe("object");
      expect(JSON.stringify(_.omit(response.body, 'timestamp'))).toBe(expected);
      expect(typeof(response.body.data)).toBe("object")
    });
  
    it('should return an object of the error 404 if the exhibitor has not been found.', async() => {
      const response = await request(app).get('/exhibitor/644e7dd0ddf96d369a6dd9c9');
      const expected = JSON.stringify(exhibitor.error404);
  
      expect(typeof(response.body)).toBe("object");
      expect(JSON.stringify(_.omit(response.body, 'timestamp'))).toBe(expected);
    });
  
    it('should return an object of the error 500 if the exhibitor\'s id is greater or less than 12 characters.', async() => {
      const response = await request(app).get('/exhibitor/644e7dd0ddf96d366a6dd8c20');
      const expected = JSON.stringify(exhibitor.error500);
  
      expect(typeof(response.body)).toBe("object");
      expect(JSON.stringify(_.omit(response.body, 'timestamp'))).toBe(expected);
    });
  });

  describe('POST /exhibitor/add', () => {
    it('should create a new exhibitor and return the exhibitor\s data', async() => {
      const response = await request(app).post('/exhibitor/add').send(exhibitor.add);
      const expected = JSON.stringify(exhibitor.addResponse);

      expect(response.status).toBe(201);
      expect(typeof(response.body)).toBe("object");
      _.unset(response.body, 'data._id');
      expect(JSON.stringify(_.omit(response.body, ['timestamp']))).toBe(expected);
      expect(typeof(response.body.data)).toBe("object");
    });

    it('should return an object of the error 400 if there is a missing value in body request.', async() => {
      const response = await request(app).post('/exhibitor/add').send(exhibitor.invalidAdd);
      const expected = JSON.stringify(exhibitor.error400);

      expect(JSON.stringify(_.omit(response.body, 'timestamp'))).toBe(expected);
    });
  })
});



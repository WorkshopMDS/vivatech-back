import mongoose from 'mongoose';
import request from 'supertest';
import app from '../../app';
import { exhibitor } from '../expectations/exhibitor';

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
    const expected = JSON.stringify(exhibitor.firstId);

    expect(response.status).toBe(200);
    expect(typeof(response.body)).toBe("object");
    expect(typeof(response.body.exhibitors)).toBe("object")
    expect(JSON.stringify(response.body.exhibitors[0])).toBe(expected);
  })
});

describe('GET /exhibitors/644e7dd0ddf96d366a6dd8c2', () => {
  beforeEach(async () => {
    await mongoose.connect(URI);
  });

  afterEach(async () => {
    await mongoose.connection.close();
  });

  it('should return the correct types of each value', async() => {
    const response = await request(app).get('/exhibitors/644e7dd0ddf96d366a6dd8c2');
    const expected = JSON.stringify(exhibitor.firstId);

    expect(response.status).toBe(200);
    expect(typeof(response.body)).toBe("object");
    expect(typeof(response.body.exhibitor)).toBe("object")
    expect(JSON.stringify(response.body.exhibitor)).toBe(expected);
    expect(typeof(response.body.exhibitor._id)).toBe("string");
    expect(typeof(response.body.exhibitor.name)).toBe("string");
    expect(typeof(response.body.exhibitor.picture)).toBe("string");
    expect(typeof(response.body.exhibitor.place)).toBe("string");
    expect(typeof(response.body.exhibitor.sectors)).toBe("object");
    expect(typeof(response.body.exhibitor.sectors[0])).toBe("string");
    expect(typeof(response.body.exhibitor.interests)).toBe("object");
    expect(typeof(response.body.exhibitor.interests[0])).toBe("string");
  });

  it('should return an object of the error 404 if the exhibitor has not been found.', async() => {
    const response = await request(app).get('/exhibitors/644e7dd0ddf96d369a6dd9c9');
    const expected = JSON.stringify(exhibitor.error404);

    expect(typeof(response.body)).toBe("object");
    expect(typeof(response.body.error)).toBe("object");
    expect(typeof(response.body.error.isOperational)).toBe("boolean");
    expect(typeof(response.body.error.name)).toBe("string");
    expect(typeof(response.body.error.httpStatusCode)).toBe("number");
    expect(typeof(response.body.error.description)).toBe("string");
    expect(JSON.stringify(response.body)).toBe(expected);
  });

  it('should return an object of the error 500 if the exhibitor\'s id is greater or less than 12 characters.', async() => {
    const response = await request(app).get('/exhibitors/644e7dd0ddf96d366a6dd8c20');
    const expected = JSON.stringify(exhibitor.error500);

    expect(typeof(response.body)).toBe("object");
    expect(typeof(response.body.error)).toBe("object");
    expect(typeof(response.body.error.isOperational)).toBe("boolean");
    expect(typeof(response.body.error.name)).toBe("string");
    expect(typeof(response.body.error.httpStatusCode)).toBe("number");
    expect(typeof(response.body.error.description)).toBe("string");
    expect(JSON.stringify(response.body)).toBe(expected);
  });
})

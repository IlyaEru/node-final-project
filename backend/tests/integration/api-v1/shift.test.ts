import request from 'supertest';

import app from '../../../src/app';
import { faker } from '@faker-js/faker';
import setUpTestDb from '../../utils/setupTestDb';
import mongoose from 'mongoose';
import Shift from '../../../src/api/v1/shift/shift.model';
import dayjs from 'dayjs';

setUpTestDb();

const userData = {
  username: faker.internet.userName(),
  email: faker.internet.email(),
  fullName: faker.name.fullName(),
};
const shiftDate = dayjs(faker.date.past()).toISOString();
const shiftData = {
  date: shiftDate,
  startTime: dayjs(shiftDate).add(1, 'hour'),
  endTime: dayjs(shiftDate).add(2, 'hour'),
};

describe('Shift API', () => {
  let accessToken: string;
  beforeEach(async () => {
    await request(app).post('/api/v1/auth/register').send(userData).expect(201);
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ username: userData.username, email: userData.email })
      .expect(200);
    accessToken = res.body.tokens.access.token;
  });
  describe('GET /api/v1/shifts', () => {
    it('should return an array of shifts', async () => {
      const resp = await request(app)
        .get('/api/v1/shifts')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
      expect(resp.body).toBeDefined();
      expect(resp.body.shifts).toBeDefined();
    });

    it('should return 403 without token', async () => {
      await request(app).get('/api/v1/shifts').expect(403);
    });
  });

  describe('POST /api/v1/shifts', () => {
    it('should create a shift', async () => {
      const resp = await request(app)
        .post('/api/v1/shifts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(shiftData)
        .expect(201);

      expect(resp.body).toBeDefined();
      expect(resp.body.shift).toBeDefined();
      expect(resp.body.shift._id).toBeDefined();
      expect(resp.body.shift.date).toEqual(
        new Date(shiftData.date).toISOString(),
      );
      expect(resp.body.shift.startTime).toEqual(
        shiftData.startTime.toISOString(),
      );
      expect(resp.body.shift.endTime).toEqual(shiftData.endTime.toISOString());

      const dbShift = await Shift.findOne({ _id: resp.body.shift._id });
      expect(dbShift).toBeDefined();
    });

    it('should return 403 without token', async () => {
      await request(app).post('/api/v1/shifts').send(shiftData).expect(403);
    });

    it('should return 400 if date is not provided', async () => {
      const resp = await request(app)
        .post('/api/v1/shifts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ...shiftData, date: undefined });

      expect(resp.status).toEqual(400);
      expect(resp.body.error.message).toContain('date is required');
    });

    it('should return 400 if startTime is not provided', async () => {
      const resp = await request(app)
        .post('/api/v1/shifts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ...shiftData, startTime: undefined });

      expect(resp.status).toEqual(400);
      expect(resp.body.error.message).toContain('startTime is required');
    });

    it('should return 400 if endTime is not provided', async () => {
      const resp = await request(app)
        .post('/api/v1/shifts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ...shiftData, endTime: undefined });

      expect(resp.status).toEqual(400);
      expect(resp.body.error.message).toEqual('endTime is required');
    });

    it('should return 400 if date is a bad type', async () => {
      const resp = await request(app)
        .post('/api/v1/shifts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ...shiftData, date: 123 });

      expect(resp.status).toEqual(400);

      expect(resp.body.error.message).toEqual('date must be a valid date');
    });

    it('should return 400 if startTime is a bad type', async () => {
      const resp = await request(app)
        .post('/api/v1/shifts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ...shiftData, startTime: 123 });

      expect(resp.status).toEqual(400);
      expect(resp.body.error.message).toEqual('startTime must be a valid date');
    });

    it('should return 400 if endTime is a bad type', async () => {
      const resp = await request(app)
        .post('/api/v1/shifts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ ...shiftData, endTime: 123 });

      expect(resp.status).toEqual(400);
      expect(resp.body.error.message).toEqual('endTime must be a valid date');
    });

    it('should return 400 if startTime is after endTime', async () => {
      const resp = await request(app)
        .post('/api/v1/shifts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          ...shiftData,
          startTime: shiftData.endTime,
          endTime: shiftData.startTime,
        });

      expect(resp.status).toEqual(400);
      expect(resp.body.error.message).toEqual(
        'endTime must be greater than or equal to ref:startTime',
      );
    });

    it('should return 400 if startTime is before date', async () => {
      const resp = await request(app)
        .post('/api/v1/shifts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          ...shiftData,
          startTime: new Date('2020-01-01T00:00:00.000Z'),
        });

      expect(resp.status).toEqual(400);
      expect(resp.body.error.message).toEqual(
        'startTime must be greater than or equal to ref:date',
      );
    });
  });

  describe('GET /api/v1/shifts/:id', () => {
    let shiftId: string;

    beforeEach(async () => {
      const resp = await request(app)
        .post('/api/v1/shifts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(shiftData)
        .expect(201);

      shiftId = resp.body.shift._id;
    });

    it('should return a shift', async () => {
      const resp = await request(app)
        .get(`/api/v1/shifts/${shiftId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(resp.body).toBeDefined();
      expect(resp.body.shift).toBeDefined();
      expect(resp.body.shift.date).toEqual(
        new Date(shiftData.date).toISOString(),
      );
      expect(resp.body.shift.startTime).toEqual(
        shiftData.startTime.toISOString(),
      );
      expect(resp.body.shift.endTime).toEqual(shiftData.endTime.toISOString());
    });

    it('should return 403 without token', async () => {
      await request(app).get(`/api/v1/shifts/${shiftId}`).expect(403);
    });

    it('should return 400 if id is not a valid id', async () => {
      const resp = await request(app)
        .get(`/api/v1/shifts/123`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400);

      expect(resp.body.error.message).toEqual('Invalid id');
    });

    it('should return 404 if id is not found', async () => {
      const resp = await request(app)
        .get(`/api/v1/shifts/5f9f1b9f9f9f9f9f9f9f9f9f`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404);

      expect(resp.body.error.message).toEqual('shift not found');
    });
  });

  describe('PUT /api/v1/shifts/:id', () => {
    let shiftId: string;
    beforeEach(async () => {
      const resp = await request(app)
        .post('/api/v1/shifts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(shiftData)
        .expect(201);

      shiftId = resp.body.shift._id;
    });

    it('should update a shift', async () => {
      const preUpdateResp = await request(app)
        .get(`/api/v1/shifts/${shiftId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(preUpdateResp.body.shift.date).toEqual(
        new Date(shiftData.date).toISOString(),
      );
      const resp = await request(app)
        .put(`/api/v1/shifts/${shiftId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ date: '2020-11-11' })
        .expect(200);
      expect(resp.body.updatedShift).toBeDefined();
      expect(resp.body.updatedShift.date).toEqual('2020-11-11T00:00:00.000Z');

      const postUpdateResp = await request(app)
        .get(`/api/v1/shifts/${shiftId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(postUpdateResp.body.shift.date).toEqual(
        '2020-11-11T00:00:00.000Z',
      );
    });
    it('should return 403 without token', async () => {
      await request(app)
        .put(`/api/v1/shifts/${shiftId}`)
        .send({ date: '2020-11-11' })
        .expect(403);
    });

    it('should return 400 if id is not a valid id', async () => {
      const resp = await request(app)
        .put('/api/v1/shifts/123')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ date: '2020-11-11' })
        .expect(400);

      expect(resp.body.error.message).toEqual('Invalid id');
    });

    it('should return 404 if shift is not found', async () => {
      const resp = await request(app)
        .put(`/api/v1/shifts/${new mongoose.Types.ObjectId()}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ date: '2020-11-11' })
        .expect(404);

      expect(resp.body.error.message).toEqual('Shift not found');
    });

    it('should return 400 if date is a bad type', async () => {
      const resp = await request(app)
        .put(`/api/v1/shifts/${shiftId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ date: 123 })
        .expect(400);

      expect(resp.body.error.message).toEqual('date must be a valid date');
    });
    it('should return 400 if startTime is a bad type', async () => {
      const resp = await request(app)
        .put(`/api/v1/shifts/${shiftId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ startTime: 123 })
        .expect(400);

      expect(resp.body.error.message).toEqual('startTime must be a valid date');
    });
    it('should return 400 if endTime is a bad type', async () => {
      const resp = await request(app)
        .put(`/api/v1/shifts/${shiftId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ endTime: 123 })
        .expect(400);

      expect(resp.body.error.message).toEqual('endTime must be a valid date');
    });

    it('should return 400 if startTime is after endTime', async () => {
      const resp = await request(app)
        .put(`/api/v1/shifts/${shiftId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          startTime: '2020-11-11T12:00:00.000Z',
          endTime: '2020-11-11T11:00:00.000Z',
        })
        .expect(400);

      expect(resp.body.error.message).toEqual(
        'endTime must be greater than startTime',
      );
    });

    it('should return 400 if endTime is before startTime', async () => {
      const resp = await request(app)
        .put(`/api/v1/shifts/${shiftId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          endTime: '2000-11-11T11:00:00.000Z',
        })
        .expect(400);

      expect(resp.body.error.message).toEqual(
        'end Time must be greater than start Time',
      );
    });

    it('should return 400 if startTime is before date', async () => {
      const resp = await request(app)
        .put(`/api/v1/shifts/${shiftId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          startTime: '2000-11-11T11:00:00.000Z',
        })
        .expect(400);

      expect(resp.body.error.message).toEqual(
        'start Time must be greater than date',
      );
    });
  });
});

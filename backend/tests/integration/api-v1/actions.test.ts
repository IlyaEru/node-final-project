import request from 'supertest';

import app from '../../../src/app';
import { faker } from '@faker-js/faker';
import setUpTestDb from '../../utils/setupTestDb';
import mongoose from 'mongoose';
import Department from '../../../src/api/v1/department/department.model';
import Employee from '../../../src/api/v1/employee/employee.model';

setUpTestDb();

const userData = {
  username: faker.internet.userName(),
  email: faker.internet.email(),
  fullName: faker.name.fullName(),
};

const userData2 = {
  username: faker.internet.userName(),
  email: faker.internet.email(),
  fullName: faker.name.fullName(),
};

describe('Actions Middleware', () => {
  let accessToken: string;
  let accessToken2: string;

  beforeEach(async () => {
    await request(app).post('/api/v1/auth/register').send(userData).expect(201);
    await request(app)
      .post('/api/v1/auth/register')
      .send(userData2)
      .expect(201);
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ username: userData.username, email: userData.email })
      .expect(200);
    accessToken = res.body.tokens.access.token;

    const res2 = await request(app)
      .post('/api/v1/auth/login')
      .send({ username: userData2.username, email: userData2.email })
      .expect(200);
    accessToken2 = res2.body.tokens.access.token;
  });

  it('should return 403 if user has no actions left', async () => {
    for (let i = 0; i < 11; i++) {
      await request(app)
        .get('/api/v1/departments')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    }

    const tenthRequest = await request(app)
      .get('/api/v1/departments')
      .set('Authorization', `Bearer ${accessToken}`);

    const actionsLeftHeader = tenthRequest.header['x-user-actions-left'];
    expect(actionsLeftHeader).toBe('0');

    expect(tenthRequest.status).toBe(403);
    expect(tenthRequest.body.error.message).toBe('Max actions reached');

    const resp = await request(app)
      .get('/api/v1/departments')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(resp.status).toBe(403);

    const resp2 = await request(app)
      .get('/api/v1/departments')
      .set('Authorization', `Bearer ${accessToken2}`);
    expect(resp2.status).toBe(200);
  });

  it('should return 200 if user has actions left', async () => {
    const resp = await request(app)
      .get('/api/v1/departments')
      .set('Authorization', `Bearer ${accessToken}`);
    expect(resp.status).toBe(200);
    const actionsLeftHeader = resp.header['x-user-actions-left'];
    expect(Number(actionsLeftHeader)).toBeGreaterThan(0);
  });

  it('should return 200 the next day', async () => {
    for (let i = 0; i < 11; i++) {
      await request(app)
        .get('/api/v1/departments')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    }

    const tenthRequest = await request(app)
      .get('/api/v1/departments')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(tenthRequest.status).toBe(403);
    expect(tenthRequest.body.error.message).toBe('Max actions reached');

    jest
      .useFakeTimers({ doNotFake: ['nextTick', 'setImmediate'] })
      .setSystemTime(new Date('2022-01-01'));

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ username: userData.username, email: userData.email })
      .expect(200);

    const newAccessToken = res.body.tokens.access.token;

    const differentDayResp = await request(app)
      .get('/api/v1/departments')
      .set('Authorization', `Bearer ${newAccessToken}`);
    expect(differentDayResp.status).toBe(200);
  });
});

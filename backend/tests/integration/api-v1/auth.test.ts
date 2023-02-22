import request from 'supertest';

import app from '../../../src/app';
import { faker } from '@faker-js/faker';
import setUpTestDb from '../../utils/setupTestDb';
import { IUserDocument } from '../../../src/api/v1/user/user.type';
import { userServices } from '../../../src/api/v1/user';
import Token, { tokenService } from '../../../src/modules/token';
import dayjs from 'dayjs';

setUpTestDb();

const userData = {
  email: faker.internet.email(),
  username: faker.internet.userName(),
  fullName: faker.name.fullName(),
};

const userData2 = {
  email: faker.internet.email(),
  username: faker.internet.userName(),
  fullName: faker.name.fullName(),
};

describe('auth routes', () => {
  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(userData);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('user');

      const { user }: { user: IUserDocument } = res.body;

      expect(user).toHaveProperty('_id');
      expect(user.email).toBe(userData.email.toLowerCase());
      expect(user.username).toBe(userData.username);
      expect(user.fullName).toBe(userData.fullName);
      expect(user.maxActions).toBe(10);

      const dbUser = await userServices.getUserById(user._id);

      expect(dbUser).not.toBeNull();
      if (dbUser) {
        expect(dbUser).toHaveProperty('_id');
        expect(dbUser.email).toBe(userData.email.toLowerCase());
        expect(dbUser.username).toBe(userData.username);
        expect(dbUser.fullName).toBe(userData.fullName);
        expect(dbUser.maxActions).toBe(10);
      }
    });

    it('should return a 400 error when registering a user with an invalid username type', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          ...userData,
          username: 34,
        });

      expect(res.status).toBe(400);
      expect(res.body.error.message).toBe('username must be a string');
    });

    it('should return a 400 error when registering a user without a username ', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          ...userData,
          username: '',
        });

      expect(res.status).toBe(400);
      expect(res.body.error.message).toBe(
        'username is not allowed to be empty',
      );
    });

    it('should return a 400 error when registering a user with a bad username length ', async () => {
      const shortUsernameRes = await request(app)
        .post('/api/v1/auth/register')
        .send({
          ...userData,
          username: 'a',
        });

      expect(shortUsernameRes.status).toBe(400);
      expect(shortUsernameRes.body.error.message).toBe(
        'username length must be at least 3 characters long',
      );

      const longUsernameRes = await request(app)
        .post('/api/v1/auth/register')
        .send({
          ...userData,
          username: 'a'.repeat(51),
        });

      expect(longUsernameRes.status).toBe(400);
      expect(longUsernameRes.body.error.message).toBe(
        'username length must be less than or equal to 20 characters long',
      );
    });

    it('should return a 400 error when registering a user with taken username ', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          ...userData,
          username: 'test',
        });

      expect(res.status).toBe(201);

      const takenUsernameRes = await request(app)
        .post('/api/v1/auth/register')
        .send({
          ...userData2,
          username: 'test',
        });

      expect(takenUsernameRes.status).toBe(400);
      expect(takenUsernameRes.body.error.message).toBe(
        'username is already taken',
      );

      const uppercaseUsernameRes = await request(app)
        .post('/api/v1/auth/register')
        .send({
          ...userData2,
          username: 'TEST',
        });

      expect(uppercaseUsernameRes.status).toBe(201);
    });

    it('should return a 400 error when registering a user with an invalid email type', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          ...userData,
          email: 34,
        });

      expect(res.status).toBe(400);
      expect(res.body.error.message).toBe('email must be a string');
    });

    it('should return a 400 error when registering a user with an invalid email ', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          ...userData,
          email: 'test',
        });

      expect(res.status).toBe(400);
      expect(res.body.error.message).toBe('email must be a valid email');
    });

    it('should return a 400 error when registering a user without an email ', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          ...userData,
          email: '',
        });

      expect(res.status).toBe(400);
      expect(res.body.error.message).toBe('email is not allowed to be empty');
    });

    it('should return a 400 error when registering a user with a taken email ', async () => {
      const res = await request(app)
        .post('/api/v1/auth/register')
        .send({
          ...userData,
          email: 'test@gmail.com',
        });

      expect(res.status).toBe(201);

      const takenEmailRes = await request(app)
        .post('/api/v1/auth/register')
        .send({
          ...userData2,
          email: 'test@gmail.com',
        });

      expect(takenEmailRes.status).toBe(400);
      expect(takenEmailRes.body.error.message).toBe('email is already taken');

      const uppercaseEmailRes = await request(app)
        .post('/api/v1/auth/register')
        .send({
          ...userData2,
          email: 'Test@gmail.com',
        });

      expect(uppercaseEmailRes.status).toBe(400);
      expect(uppercaseEmailRes.body.error.message).toBe(
        'email is already taken',
      );
    });

    it('should return a 400 error when registering a user with an invalid full name type', async () => {
      const resp = await request(app)
        .post('/api/v1/auth/register')
        .send({
          ...userData,
          fullName: 42,
        });

      expect(resp.status).toBe(400);
      expect(resp.body.error.message).toBe('fullName must be a string');
    });

    it('should return a 400 error when registering a user without a full name ', async () => {
      const resp = await request(app)
        .post('/api/v1/auth/register')
        .send({
          ...userData,
          fullName: '',
        });

      expect(resp.status).toBe(400);
      expect(resp.body.error.message).toBe(
        'fullName is not allowed to be empty',
      );
    });

    it('should return a 400 error when registering a user with a bad full name length ', async () => {
      const shortFullNameRes = await request(app)
        .post('/api/v1/auth/register')
        .send({
          ...userData,
          fullName: 'a',
        });

      expect(shortFullNameRes.status).toBe(400);
      expect(shortFullNameRes.body.error.message).toBe(
        'fullName length must be at least 3 characters long',
      );

      const longFullNameRes = await request(app)
        .post('/api/v1/auth/register')
        .send({
          ...userData,
          fullName: 'a'.repeat(51),
        });

      expect(longFullNameRes.status).toBe(400);
      expect(longFullNameRes.body.error.message).toBe(
        'fullName length must be less than or equal to 50 characters long',
      );
    });

    it('should return a 400 error when registering a user with empty body', async () => {
      const res = await request(app).post('/api/v1/auth/register');

      expect(res.status).toBe(400);

      expect(res.body.error.message).toBe(
        'username is required. email is required. fullName is required',
      );
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/v1/auth/register').send(userData);
    });

    it('should return a 200 status code and user and tokens when logging in a user', async () => {
      const dbUser = await userServices.getUserByUsername(userData.username);
      expect(dbUser).toBeTruthy();

      const res = await request(app).post('/api/v1/auth/login').send({
        email: userData.email,
        username: userData.username,
      });
      expect(res.status).toBe(200);

      const respBody = res.body;
      expect(respBody).toHaveProperty('tokens');
      expect(respBody.tokens).toHaveProperty('access');
      expect(respBody.tokens).toHaveProperty('refresh');
      expect(respBody.tokens.access).toBeTruthy();
      expect(respBody.tokens.refresh).toBeTruthy();

      expect(respBody).toHaveProperty('user');
      expect(respBody.user).toHaveProperty('_id');
      expect(respBody.user).toHaveProperty('username');
      expect(respBody.user).toHaveProperty('email');
      expect(respBody.user).toHaveProperty('fullName');
    });

    it('should return a 400 error when logging in a user with an invalid email type', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: 34,
        username: userData.username,
      });

      expect(res.status).toBe(400);
      expect(res.body.error.message).toBe('email must be a string');
    });

    it('should return a 400 error when logging in a user with an invalid email ', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'test',
        username: userData.username,
      });

      expect(res.status).toBe(400);
      expect(res.body.error.message).toBe('email must be a valid email');
    });

    it('should return a 400 error when logging in a user without an email ', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: '',
        username: userData.username,
      });

      expect(res.status).toBe(400);
      expect(res.body.error.message).toBe('email is not allowed to be empty');
    });

    it('should return a 400 error when logging in a user with an invalid username type', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: userData.email,
        username: 34,
      });

      expect(res.status).toBe(400);
      expect(res.body.error.message).toBe('username must be a string');
    });

    it('should return a 400 error when logging in a user without a username ', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: userData.email,
        username: '',
      });

      expect(res.status).toBe(400);
      expect(res.body.error.message).toBe(
        'username is not allowed to be empty',
      );
    });

    it('should return a 400 error when logging in a user with an invalid username length ', async () => {
      const shortUsernameRes = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: userData.email,
          username: 'a',
        });

      expect(shortUsernameRes.status).toBe(400);
      expect(shortUsernameRes.body.error.message).toBe(
        'username length must be at least 3 characters long',
      );

      const longUsernameRes = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: userData.email,
          username: 'a'.repeat(51),
        });

      expect(longUsernameRes.status).toBe(400);
      expect(longUsernameRes.body.error.message).toBe(
        'username length must be less than or equal to 20 characters long',
      );
    });

    it('should return a 400 error when logging in a user with empty body', async () => {
      const res = await request(app).post('/api/v1/auth/login');

      expect(res.status).toBe(400);

      expect(res.body.error.message).toBe(
        'username is required. email is required',
      );
    });

    it('should return a 400 error when logging in a user with a non existing email', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: 'bad@email.com',
        username: userData.username,
      });

      expect(res.status).toBe(401);
      expect(res.body.error.message).toBe('Incorrect username or email');
    });

    it('should return a 400 error when logging in a user with a non existing username', async () => {
      const res = await request(app).post('/api/v1/auth/login').send({
        email: userData.email,
        username: 'badusername',
      });

      expect(res.status).toBe(401);

      expect(res.body.error.message).toBe('Incorrect username or email');
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    let refreshToken: string;
    beforeEach(async () => {
      await request(app).post('/api/v1/auth/register').send(userData);
      const loginResponse = await request(app).post('/api/v1/auth/login').send({
        email: userData.email,
        username: userData.username,
      });
      refreshToken = loginResponse.body.tokens.refresh.token;
    });

    it('should return a 200 status code and a message when logging out a user', async () => {
      const tokenDocument = await Token.findOne({ token: refreshToken });
      expect(tokenDocument).toBeTruthy();

      const res = await request(app)
        .post('/api/v1/auth/logout')
        .send({ refreshToken });
      expect(res.status).toBe(204);

      const dbToken = await Token.findOne({ token: refreshToken });
      expect(dbToken).toBeFalsy();
    });

    it('should return a 400 error when logging out a user with an invalid refresh token type', async () => {
      const res = await request(app)
        .post('/api/v1/auth/logout')
        .send({ refreshToken: 34 });

      expect(res.status).toBe(400);
      expect(res.body.error.message).toBe('refreshToken must be a string');
    });

    it('should return a 400 error when logging out a user without a refresh token', async () => {
      const res = await request(app).post('/api/v1/auth/logout');

      expect(res.status).toBe(400);
      expect(res.body.error.message).toBe('refreshToken is required');
    });

    it('should return a 400 error when logging out a user with an invalid refresh token', async () => {
      const res = await request(app)
        .post('/api/v1/auth/logout')
        .send({ refreshToken: 'badtoken' });
      expect(res.status).toBe(401);
      expect(res.body.error.message).toBe('Invalid refresh token');
    });
  });

  describe('POST /api/v1/auth/refresh', () => {
    let refreshToken: string;
    beforeEach(async () => {
      await request(app).post('/api/v1/auth/register').send(userData);
      const loginResponse = await request(app).post('/api/v1/auth/login').send({
        email: userData.email,
        username: userData.username,
      });
      refreshToken = loginResponse.body.tokens.refresh.token;
    });

    it('should return a 200 status code and a new tokens when refreshing a token', async () => {
      const res = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken });

      expect(res.status).toBe(200);
      expect(res.body.tokens).toBeTruthy();
    });

    it('should remove the old refresh token from the database', async () => {
      // wait for 1 second to make sure the old token is not the same as the new one (because of the same iat unix timestamp)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const res = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken });

      expect(res.status).toBe(200);
      const oldTokenDbDocument = await Token.findOne({ token: refreshToken });
      expect(oldTokenDbDocument).toBeFalsy();

      const newTokenDbDocument = await Token.findOne({
        token: res.body.tokens.refresh.token,
      });
      expect(newTokenDbDocument).toBeTruthy();
    });

    it('should return a 400 error when refreshing a token with an invalid refresh token type', async () => {
      const res = await request(app)
        .post('/api/v1/auth/refresh')
        .send({ refreshToken: 42 });

      expect(res.status).toBe(400);
      expect(res.body.error.message).toBe('refreshToken must be a string');
    });

    it('should return a 400 error when refreshing a token without a refresh token', async () => {
      const res = await request(app).post('/api/v1/auth/refresh');

      expect(res.status).toBe(400);
      expect(res.body.error.message).toBe('refreshToken is required');
    });

    it('should return a 400 error when refreshing a token with an invalid refresh token', async () => {
      const res = await request(app).post('/api/v1/auth/refresh').send({
        refreshToken: 'badtoken',
      });

      expect(res.status).toBe(401);
      expect(res.body.error.message).toBe('Invalid refresh token');
    });

    it('should return a 400 error when refreshing a token with a revoked refresh token', async () => {
      const logoutResp = await request(app)
        .post('/api/v1/auth/logout')
        .send({ refreshToken });

      expect(logoutResp.status).toBe(204);

      const res = await request(app).post('/api/v1/auth/refresh').send({
        refreshToken,
      });

      expect(res.status).toBe(401);
      expect(res.body.error.message).toBe('Invalid refresh token');
    });

    it('should return a 400 error when refreshing a token with a refresh token that has expired', async () => {
      const registerResp = await request(app)
        .post('/api/v1/auth/register')
        .send(userData2);

      const expiredToken = tokenService.generateToken(
        registerResp.body.user._id,
        'refresh',
        dayjs().subtract(1, 'day'),
      );

      await tokenService.saveToken(
        registerResp.body.user._id,
        expiredToken,
        'refresh',
        dayjs().subtract(1, 'day'),
      );

      const dbToken = await Token.findOne({ token: expiredToken });
      expect(dbToken).toBeTruthy();
      const res = await request(app).post('/api/v1/auth/refresh').send({
        refreshToken: expiredToken,
      });

      expect(res.status).toBe(401);
      expect(res.body.error.message).toBe('Invalid refresh token');
    });
  });
});

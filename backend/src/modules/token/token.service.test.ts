import mongoose from 'mongoose';
import dayjs from 'dayjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import Token from './token.model';
import setUpTestDb from '../../../tests/utils/setupTestDb';
import * as tokenService from './token.service';
import { ApiError } from '../error';

dotenv.config();

// JWT Secrets
const refreshSecret = process.env.JWT_REFRESH_SECRET;
const accessSecret = process.env.JWT_ACCESS_SECRET;

// JWT Expires In
const refreshExpiresInDays = Number(process.env.JWT_REFRESH_EXPIRES_IN_DAYS);
const accessExpiresInMinutes = Number(
  process.env.JWT_ACCESS_EXPIRES_IN_MINUTES,
);

if (
  !refreshSecret ||
  !accessSecret ||
  !refreshExpiresInDays ||
  !accessExpiresInMinutes
) {
  throw new Error('JWT Secrets or Expires In not found');
}

setUpTestDb();

const userId = new mongoose.Types.ObjectId();

describe('Token service', () => {
  describe('generateToken', () => {
    it('should generate a token', () => {
      const token = tokenService.generateToken(
        userId,
        'access',
        dayjs().add(1, 'minute'),
      );
      expect(token).toBeDefined();
      const decoded = jwt.verify(token, accessSecret);
      expect(decoded).toBeDefined();
      expect(JSON.stringify(decoded.sub)).toEqual(JSON.stringify(userId));
    });

    it('should throw an error if type is not access or refresh', async () => {
      try {
        tokenService.generateToken(userId, 'random' as any, dayjs());
      } catch (error: any) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toContain(
          '"type" must be one of [access, refresh]',
        );
      } finally {
        expect.assertions(2);
      }
    });

    it('should throw an error if expires is not a dayjs object', async () => {
      try {
        tokenService.generateToken(userId, 'access', 'random' as any);
      } catch (error: any) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toContain('invalid value');
      } finally {
        expect.assertions(2);
      }
    });

    it('should throw an error if userId is not a mongoose.Types.ObjectId', async () => {
      try {
        tokenService.generateToken('random' as any, 'access', dayjs());
      } catch (error: any) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toContain('invalid value');
      } finally {
        expect.assertions(2);
      }
    });
  });

  describe('saveToken', () => {
    it('should save a token', async () => {
      const token = tokenService.generateToken(
        userId,
        'access',
        dayjs().add(1, 'minute'),
      );
      const savedToken = await tokenService.saveToken(
        userId,
        token,
        'access',
        dayjs().add(1, 'minute'),
      );
      expect(savedToken).toBeDefined();
      expect(savedToken.user).toEqual(userId);
      expect(savedToken.token).toEqual(token);
      expect(savedToken.type).toEqual('access');
      expect(savedToken.expires).toBeDefined();
      expect(savedToken.blacklisted).toEqual(false);

      const dbToken = Token.findById(savedToken.id);
      expect(dbToken).toBeDefined();
    });

    it('should throw an error if type is not access or refresh', async () => {
      try {
        await tokenService.saveToken(
          userId,
          'random',
          'random' as any,
          dayjs(),
        );
      } catch (error: any) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toContain(
          '"type" must be one of [access, refresh]',
        );
      } finally {
        expect.assertions(2);
      }
    });

    it('should throw an error if expires is not a dayjs object', async () => {
      try {
        await tokenService.saveToken(
          userId,
          'random',
          'access',
          'random' as any,
        );
      } catch (error: any) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toContain('invalid value');
      } finally {
        expect.assertions(2);
      }
    });

    it('should throw an error if userId is not a mongoose.Types.ObjectId', async () => {
      try {
        await tokenService.saveToken(
          'random' as any,
          'random',
          'access',
          dayjs(),
        );
      } catch (error: any) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toContain('invalid value');
      } finally {
        expect.assertions(2);
      }
    });
  });

  describe('verifyToken', () => {
    it('should verify a token', async () => {
      const token = tokenService.generateToken(
        userId,
        'access',
        dayjs().add(1, 'minute'),
      );
      await tokenService.saveToken(
        userId,
        token,
        'access',
        dayjs().add(1, 'minute'),
      );
      const decoded = await tokenService.verifyToken(token, 'access');
      expect(decoded).toBeDefined();
      expect(JSON.stringify(decoded?.user)).toEqual(JSON.stringify(userId));
    });

    it('should throw an error if token is not valid', async () => {
      try {
        await tokenService.verifyToken('random', 'access');
      } catch (error: any) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toContain('jwt malformed');
      } finally {
        expect.assertions(2);
      }
    });

    it('should throw an error if token is expired', async () => {
      const token = tokenService.generateToken(
        userId,
        'access',
        dayjs().subtract(1, 'minute'),
      );
      await tokenService.saveToken(
        userId,
        token,
        'access',
        dayjs().subtract(1, 'minute'),
      );
      try {
        await tokenService.verifyToken(token, 'access');
      } catch (error: any) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toContain('jwt expired');
      } finally {
        expect.assertions(2);
      }
    });
  });

  describe('generateAuthTokens', () => {
    it('should generate auth tokens', async () => {
      const authTokens = await tokenService.generateAuthTokens(userId);
      expect(authTokens).toBeDefined();
      expect(authTokens.access).toBeDefined();
      expect(authTokens.refresh).toBeDefined();
      expect(authTokens.access.token).toBeDefined();
      expect(authTokens.refresh.token).toBeDefined();

      const dbToken = await Token.find({
        token: authTokens.access.token,
      });
      expect(dbToken).toBeDefined();
    });

    it('should throw an error if userId is not a mongoose.Types.ObjectId', async () => {
      try {
        await tokenService.generateAuthTokens('random' as any);
      } catch (error: any) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toContain('invalid value');
      } finally {
        expect.assertions(2);
      }
    });
  });
});

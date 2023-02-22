import mongoose from 'mongoose';

import { faker } from '@faker-js/faker';
import setUpTestDb from '../../../../tests/utils/setupTestDb';
import { createUser, getUserById, getUserByUsername } from './user.service';

setUpTestDb();

const userData = {
  username: faker.internet.userName(),
  email: faker.internet.email(),
  fullName: faker.name.fullName(),
};

describe('User service', () => {
  describe('createUser', () => {
    it('should create a user', async () => {
      const user = await createUser(
        userData.username,
        userData.email,
        userData.fullName,
      );
      expect(user).toBeDefined();
      expect(user.username).toEqual(userData.username);
      expect(user.email).toEqual(userData.email.toLocaleLowerCase());
      expect(user.fullName).toEqual(userData.fullName);
    });

    it('should throw an error if email is already taken', async () => {
      try {
        await createUser('username', userData.email, userData.fullName);
        await createUser(userData.username, userData.email, userData.fullName);
      } catch (error: any) {
        expect(error).toBeDefined();
        expect(error.message).toEqual('email is already taken');
      } finally {
        expect.assertions(2);
      }
    });

    it('should throw an error if username is already taken', async () => {
      try {
        await createUser(
          userData.username,
          'email@gmail.com',
          userData.fullName,
        );
        await createUser(userData.username, userData.email, userData.fullName);
      } catch (error: any) {
        expect(error).toBeDefined();
        expect(error.message).toEqual('username is already taken');
      } finally {
        expect.assertions(2);
      }
    });

    it('should throw an error if username is not a string', async () => {
      try {
        await createUser(123 as any, userData.email, userData.fullName);
      } catch (error: any) {
        expect(error).toBeDefined();
        expect(error.message).toEqual('username must be a string');
      } finally {
        expect.assertions(2);
      }
    });

    it('should throw an error if email is not a string', async () => {
      try {
        await createUser(userData.username, 123 as any, userData.fullName);
      } catch (error: any) {
        expect(error).toBeDefined();
        expect(error.message).toEqual('email must be a string');
      } finally {
        expect.assertions(2);
      }
    });

    it('should throw an error if fullName is not a string', async () => {
      try {
        await createUser(userData.username, userData.email, 123 as any);
      } catch (error: any) {
        expect(error).toBeDefined();
        expect(error.message).toEqual('fullName must be a string');
      } finally {
        expect.assertions(2);
      }
    });
  });

  describe('getUserById', () => {
    it('should return a user', async () => {
      const user = await createUser(
        userData.username,
        userData.email,
        userData.fullName,
      );
      const foundUser = await getUserById(user._id);
      expect(foundUser).toBeDefined();
      expect(foundUser!.username).toEqual(userData.username);
      expect(foundUser!.email).toEqual(userData.email.toLocaleLowerCase());
      expect(foundUser!.fullName).toEqual(userData.fullName);
    });

    it('should return null if user is not found', async () => {
      const foundUser = await getUserById(new mongoose.Types.ObjectId());
      expect(foundUser).toBeNull();
    });

    it('should throw an error if id is not a valid mongoose id', async () => {
      try {
        await getUserById('123' as any);
      } catch (error: any) {
        expect(error).toBeDefined();
        expect(error.message).toContain('Cast to ObjectId failed');
      } finally {
        expect.assertions(2);
      }
    });
  });

  describe('getUserByUsername', () => {
    it('should return a user', async () => {
      const user = await createUser(
        userData.username,
        userData.email,
        userData.fullName,
      );
      const foundUser = await getUserByUsername(user.username);
      expect(foundUser).toBeDefined();
      expect(foundUser!.username).toEqual(userData.username);
      expect(foundUser!.email).toEqual(userData.email.toLocaleLowerCase());
      expect(foundUser!.fullName).toEqual(userData.fullName);
    });

    it('should return null if user is not found', async () => {
      const foundUser = await getUserByUsername('username');
      expect(foundUser).toBeNull();
    });
  });
});

import mongoose from 'mongoose';
import Token from './token.model';
import setUpTestDb from '../../../tests/utils/setupTestDb';

setUpTestDb();
const userId = new mongoose.Types.ObjectId();

describe('Token Model', () => {
  it('should create a new token', async () => {
    const token = await Token.create({
      token: 'randomToken',
      user: userId,
      type: 'access',
      expires: new Date(),
    });
    expect(token).toBeInstanceOf(mongoose.Model);
    expect(token).toBeInstanceOf(mongoose.Document);
    expect(token).toBeInstanceOf(Token);
    expect(token.id).toBeDefined();
  });

  it('should create a new token and save it to the database', async () => {
    const token = await Token.create({
      token: 'randomToken',
      user: userId,
      type: 'access',
      expires: new Date(),
    });
    const tokenFromDb = await Token.findById(token.id);
    expect(tokenFromDb).toBeDefined();
    expect(tokenFromDb?.token).toEqual(token.token);
  });

  it('should have a default value for blacklisted', async () => {
    const token = await Token.create({
      token: 'randomToken',
      user: userId,
      type: 'access',
      expires: new Date(),
    });
    expect(token.blacklisted).toEqual(false);
  });

  it('should throw an error if required fields are not provided', async () => {
    const tokenWithoutData = new Token();
    let err: any;
    try {
      await tokenWithoutData.validate();
    } catch (error: any) {
      err = error;
    }

    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.token).toBeDefined();
    expect(err.errors.user).toBeDefined();
    expect(err.errors.type).toBeDefined();
    expect(err.errors.expires).toBeDefined();
  });

  it('should throw an error if token is not unique', async () => {
    const tokenData = {
      token: 'randomToken',
      user: userId,
      type: 'access',
      expires: new Date(),
    };
    const token = new Token(tokenData);
    try {
      await token.save();
      const nonUniqueToken = new Token({
        ...tokenData,
        user: new mongoose.Types.ObjectId(),
      });
      let err: any;
      try {
        await nonUniqueToken.save();
      } catch (error: any) {
        err = error;
      }

      expect(err.code).toBe(11000);
    } finally {
      await Token.deleteOne(tokenData);
    }
  });
});

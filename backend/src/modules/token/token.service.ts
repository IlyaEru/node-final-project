import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import dayjs, { Dayjs } from 'dayjs';
import mongoose from 'mongoose';

import Token from './token.model';
import { ITokenDocument } from './token.type';
import {
  generateTokenSchema,
  saveTokenSchema,
  verifyTokenSchema,
  generateAuthTokensSchema,
} from './token.validation';

// Access Env Variables
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

const generateToken = (
  userId: mongoose.Types.ObjectId,
  type: 'access' | 'refresh',
  expires: Dayjs,
): string => {
  const validationResults = generateTokenSchema.validate({
    userId,
    type,
    expires,
  });
  if (validationResults.error) {
    throw new Error(validationResults.error.message);
  }
  const payload = {
    sub: userId,
    type,
    iat: dayjs().unix(),
    exp: expires.unix(),
  };

  return jwt.sign(payload, type === 'access' ? accessSecret : refreshSecret);
};

const saveToken = async (
  userId: mongoose.Types.ObjectId,
  token: string,
  type: 'access' | 'refresh',
  expires: Dayjs,
  blacklisted = false,
): Promise<ITokenDocument> => {
  const validationResults = saveTokenSchema.validate({
    userId,
    token,
    type,
    expires,
    blacklisted,
  });
  if (validationResults.error) {
    throw new Error(validationResults.error.message);
  }
  const tokenData = await Token.create({
    token,
    user: userId,
    type,
    expires: expires.toDate(),
    blacklisted,
  });
  return tokenData;
};

// Verify token and return token doc (or throw an error if it is not valid)
const verifyToken = async (token: string, type: 'access' | 'refresh') => {
  const validationResults = verifyTokenSchema.validate({
    token,
    type,
  });
  if (validationResults.error) {
    throw new Error(validationResults.error.message);
  }

  console.log({ token, type });

  const payload = jwt.verify(
    token,
    type === 'access' ? accessSecret : refreshSecret,
  );
  if (typeof payload.sub !== 'string') {
    throw new Error('Invalid payload');
  }

  const tokenDoc = await Token.findOne({
    token,
    user: payload.sub,
    type,
    blacklisted: false,
  });

  if (!tokenDoc) {
    throw new Error('Token not found');
  }
  return tokenDoc;
};

const generateAuthTokens = async (userId: mongoose.Types.ObjectId) => {
  const validationResults = generateAuthTokensSchema.validate({
    userId,
  });
  if (validationResults.error) {
    throw new Error(validationResults.error.message);
  }
  // dayjs expiration dates
  const accessExpires = dayjs().add(accessExpiresInMinutes, 'minutes');
  const refreshExpires = dayjs().add(refreshExpiresInDays, 'days');

  // Generate an access and refresh token
  const accessToken = generateToken(userId, 'access', accessExpires);
  const refreshToken = generateToken(userId, 'refresh', refreshExpires);

  // Check if there is a refresh token for the user and delete it
  const oldRefreshToken = await Token.findOneAndDelete({
    user: userId,
    type: 'refresh',
  });

  // Save the refresh token
  await saveToken(userId, refreshToken, 'refresh', refreshExpires);
  return {
    access: {
      token: accessToken,
      expires: accessExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshExpires.toDate(),
    },
  };
};

export { generateAuthTokens, verifyToken, saveToken, generateToken };

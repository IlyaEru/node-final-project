import express from 'express';
import helmet from 'helmet';
import morgan from './modules/logger/morgan';
import xss from 'xss-clean';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import httpStatus from 'http-status';
import { ApiError, ApiErrorHandler } from './modules/error';

import v1Routes from './routes/v1';
import { jwtStrategy } from './api/v1/auth';

// load env vars
dotenv.config();

const app = express();

const environment = process.env.NODE_ENV || 'development';

if (environment !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

app.use(cors());
app.options('*', cors());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(ExpressMongoSanitize());

// gzip compression
app.use(compression());

// jwt authentication
app.use(passport.initialize());

passport.use('jwt', jwtStrategy);

app.use('/api/v1/', v1Routes);

app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

app.use(ApiErrorHandler);

export default app;

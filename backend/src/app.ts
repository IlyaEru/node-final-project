import express from 'express';
import helmet from 'helmet';
import xss from 'xss-clean';
import ExpressMongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
// import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import httpStatus from 'http-status';
import { ApiError, ApiErrorHandler } from './modules/error';

import v1Routes from './routes/v1';
import { jwtStrategy } from './api/v1/auth';

const app = express();

// load env vars
dotenv.config();

// set security HTTP headers
app.use(helmet());

/*
 Usually enable cors, but for this project, 
 we don't need it because we are using the 
 same domain for both frontend and backend
*/

// app.use(cors());
// app.options('*', cors());

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

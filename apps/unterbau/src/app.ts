import cors from 'cors';
import express from 'express';
import type { ErrorRequestHandler } from 'express';

import { cacheRouter } from './api/cache.ts';
import { router } from './api/v1/_router.ts';
import { ValidationError } from './lib/util/validation-error.ts';

export const app = express();

// Middleware
app.use(express.static('public'));
app.use(cors());
app.use(express.json());

// API
app.use('/api/cache', cacheRouter);
app.use('/api/v1', router);

// Error Handler
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof ValidationError) {
    console.error(err.errorDescription);
    res.status(err.status).json({
      status: err.status,
      error: err.errorDescription,
    });
  } else {
    next(err);
  }
};
app.use(errorHandler);

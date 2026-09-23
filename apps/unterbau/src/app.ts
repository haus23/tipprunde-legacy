import cors from 'cors';
import type { ErrorRequestHandler, RequestHandler } from 'express';
import express from 'express';

import { cacheRouter } from './api/cache.ts';
import { router } from './api/v1/_router.ts';
import { ValidationError } from './lib/util/validation-error.ts';

export const app = express();
app.disable('x-powered-by');

// Middleware
app.use(express.static('public'));
app.use(cors());
app.use(express.json());

// API
app.use('/api/cache', cacheRouter);
app.use('/api/v1', router);

// Not Found Handler
const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json({
    status: 404,
    error: 'Not Found',
  });
};
app.use(notFoundHandler);

// Error Handler
const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  if (err instanceof ValidationError) {
    console.error(err.errorDescription);
    res.status(err.status).json({
      status: err.status,
      error: err.errorDescription,
    });
  } else if (res.headersSent) {
    next(err);
  } else {
    console.error(err);
    res.status(500).json({
      status: 500,
      error: 'Internal Server Error',
    });
  }
};
app.use(errorHandler);

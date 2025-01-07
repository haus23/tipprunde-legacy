import express from 'express';

import { router } from './api/v1/_router.ts';
import { ValidationError } from './lib/util/validation-error.ts';

export const app = express();

// Middleware
app.use(express.static('public'));

// API
app.use('/api/v1', router);

// Error Handler
app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    console.error(err.errorDescription);
    res.status(err.status).json({
      status: err.status,
      error: err.errorDescription,
    });
  } else {
    next(err);
  }
});

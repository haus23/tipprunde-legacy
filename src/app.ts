import express from 'express';
import { router } from './api/v1/index.ts';

export const app = express();

// Middleware
app.use(express.static('public'));

// API
app.use('/api/v1', router);

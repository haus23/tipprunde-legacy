import { Router } from 'express';
import { handler } from './championships/index.ts';

export const router = Router();

router.get('/championships', handler);

import { Router } from 'express';

import { handler as accountsHandler } from './accounts/index.ts';
import { handler as championshipsHandler } from './championships/index.ts';

export const router = Router();

router.get('/accounts', accountsHandler);
router.get('/championships', championshipsHandler);

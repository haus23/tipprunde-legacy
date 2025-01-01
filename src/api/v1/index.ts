import { Router } from 'express';

import { handler as accountsHandler } from './accounts/index.ts';
import { handler as championshipsHandler } from './championships/index.ts';
import { handler as leaguesHandler } from './leagues/index.ts';
import { handler as rulesHandler } from './rules/index.ts';
import { handler as teamsHandler } from './teams/index.ts';

export const router = Router();

router.get('/accounts', accountsHandler);
router.get('/championships', championshipsHandler);
router.get('/leagues', leaguesHandler);
router.get('/rules', rulesHandler);
router.get('/teams', teamsHandler);

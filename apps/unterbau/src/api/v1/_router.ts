import { Router } from 'express';

import { handler as accountsHandler } from './accounts.ts';
import { handler as championshipsHandler } from './championships.ts';
import { handler as championshipCurrentTipsHandler } from './championships/current-tips.ts';
import { handler as championshipMatchTipsHandler } from './championships/match-tips.ts';
import { handler as championshipMatchesHandler } from './championships/matches.ts';
import { handler as championshipPlayerTipsHandler } from './championships/player-tips.ts';
import { handler as championshipPlayersHandler } from './championships/players.ts';
import { handler as leaguesHandler } from './leagues.ts';
import { handler as rulesHandler } from './rules.ts';
import { handler as teamsHandler } from './teams.ts';

export const router = Router();

router.get('/accounts', accountsHandler);
router.get('/championships', championshipsHandler);
router.get('/leagues', leaguesHandler);
router.get('/rules', rulesHandler);
router.get('/teams', teamsHandler);

router.get('/championships/:id/players', championshipPlayersHandler);
router.get('/championships/:id/matches', championshipMatchesHandler);
router.get('/championships/:id/current-tips', championshipCurrentTipsHandler);
router.get('/championships/:id/player-tips', championshipPlayerTipsHandler);
router.get('/championships/:id/match-tips', championshipMatchTipsHandler);

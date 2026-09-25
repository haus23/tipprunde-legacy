import { expect, it } from 'vitest';

import type { ChampionshipPlayer } from '../../../src/championship/championship-player';
import { calculateRanking } from '../../../src/championship/scoring/calculate-ranking';

const players = [
  {
    id: 'player-one',
    playerId: 'member-one',
    nr: 1,
    rank: 1,
    points: 0,
    extraPoints: 0,
    totalPoints: 0,
  },
  {
    id: 'player-two',
    playerId: 'member-two',
    nr: 2,
    rank: 1,
    points: 0,
    extraPoints: 1,
    totalPoints: 1,
  },
  {
    id: 'player-three',
    playerId: 'member-three',
    nr: 3,
    rank: 1,
    points: 0,
    extraPoints: 0,
    totalPoints: 0,
  },
  {
    id: 'player-four',
    playerId: 'member-four',
    nr: 4,
    rank: 1,
    points: 0,
    extraPoints: 0,
    totalPoints: 0,
  },
] satisfies ChampionshipPlayer[];

it('calculates points, totals and competition ranks', () => {
  const ranking = calculateRanking(players, [
    { playerId: 'player-one', points: 3 },
    { playerId: 'player-two', points: 1 },
    { playerId: 'player-two', points: 1 },
    { playerId: 'player-three', points: 3 },
  ]);

  expect(ranking).toEqual([
    { id: 'player-one', points: 3, extraPoints: 0, totalPoints: 3, rank: 1 },
    { id: 'player-two', points: 2, extraPoints: 1, totalPoints: 3, rank: 1 },
    {
      id: 'player-three',
      points: 3,
      extraPoints: 0,
      totalPoints: 3,
      rank: 1,
    },
    { id: 'player-four', points: 0, extraPoints: 0, totalPoints: 0, rank: 4 },
  ]);
});

it('treats missing tip points as not yet contributing to the ranking', () => {
  const ranking = calculateRanking(players.slice(0, 2), [
    { playerId: 'player-one' },
    { playerId: 'player-two', points: 2 },
  ]);

  expect(ranking).toEqual([
    { id: 'player-two', points: 2, extraPoints: 1, totalPoints: 3, rank: 1 },
    { id: 'player-one', points: 0, extraPoints: 0, totalPoints: 0, rank: 2 },
  ]);
});

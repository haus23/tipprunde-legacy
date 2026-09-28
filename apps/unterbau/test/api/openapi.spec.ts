import { expect, it } from 'vitest';

import { openApiDocument } from '#app/api/openapi.ts';

it('documents only the public read API', () => {
  expect(Object.keys(openApiDocument.paths)).toEqual([
    '/api/v1/accounts',
    '/api/v1/championships',
    '/api/v1/leagues',
    '/api/v1/rules',
    '/api/v1/teams',
    '/api/v1/championships/{id}/players',
    '/api/v1/championships/{id}/matches',
    '/api/v1/championships/{id}/current-tips',
    '/api/v1/championships/{id}/player-tips',
    '/api/v1/championships/{id}/match-tips',
  ]);
});

it('derives the public response schemas from the model package', () => {
  expect(openApiDocument.components.schemas.Championships).toMatchObject({
    type: 'array',
    items: {
      type: 'object',
      required: [
        'id',
        'name',
        'nr',
        'rulesId',
        'published',
        'extraPointsPublished',
        'completed',
      ],
    },
  });

  expect(
    openApiDocument.components.schemas.ChampionshipPlayerTips,
  ).toMatchObject({
    type: 'object',
    required: ['playerId', 'tips'],
    properties: {
      tips: {
        title: 'Tipps nach Spiel-ID',
        description:
          'Objekt mit der Spiel-ID als Schlüssel und dem zugehörigen Tipp als Wert.',
      },
    },
  });
});

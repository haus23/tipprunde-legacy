import {
  ChampionshipCurrentTipsSchema,
  ChampionshipIdSchema,
  ChampionshipMatchesSchema,
  ChampionshipMatchTipsSchema,
  ChampionshipPlayersSchema,
  ChampionshipPlayerTipsSchema,
  ChampionshipSchema,
  LeagueSchema,
  MemberSchema,
  RuleSetSchema,
  TeamSchema,
} from '@haus23/tipprunde-model';
import { toJsonSchema } from '@valibot/to-json-schema';
import * as v from 'valibot';

function jsonSchema(schema: Parameters<typeof toJsonSchema>[0]) {
  const { $schema: _, ...convertedSchema } = toJsonSchema(schema, {
    target: 'draft-2020-12',
    typeMode: 'output',
  });

  return convertedSchema;
}

const errorResponse = (description: string) => ({
  description,
  content: {
    'application/json': {
      schema: { $ref: '#/components/schemas/Error' },
    },
  },
});

const jsonResponse = (description: string, schema: string) => ({
  description,
  content: {
    'application/json': {
      schema: { $ref: `#/components/schemas/${schema}` },
    },
  },
});

const championshipIdParameter = {
  name: 'id',
  in: 'path',
  required: true,
  description: 'Turnier-ID aus zwei Kleinbuchstaben und vier Ziffern.',
  example: 'em2024',
  schema: jsonSchema(ChampionshipIdSchema),
};

const championshipErrors = {
  '404': errorResponse('Das Turnier wurde nicht gefunden.'),
  '406': errorResponse('Die Turnier-ID hat ein ungültiges Format.'),
  '500': errorResponse('Die Anfrage konnte nicht verarbeitet werden.'),
};

export const openApiDocument = {
  openapi: '3.1.1',
  info: {
    title: 'runde.tips API',
    version: '1.0.0',
    description:
      'Öffentliche, nur lesende API für Frontend-Clients der Haus23 Tipprunde.',
  },
  servers: [
    {
      url: '/',
      description: 'Aktueller Unterbau-Server',
    },
  ],
  tags: [
    {
      name: 'Stammdaten',
      description: 'Turnierübergreifende Stammdaten.',
    },
    {
      name: 'Turniere',
      description: 'Veröffentlichte Turniere und ihre aufbereiteten Daten.',
    },
  ],
  paths: {
    '/api/v1/accounts': {
      get: {
        operationId: 'getAccounts',
        summary: 'Mitglieder auflisten',
        description:
          'Liefert die Mitglieder der Tipprunde. Der historische Routenname `accounts` bleibt aus Kompatibilitätsgründen bestehen.',
        tags: ['Stammdaten'],
        responses: {
          '200': jsonResponse('Die Mitglieder der Tipprunde.', 'Accounts'),
          '500': errorResponse('Die Anfrage konnte nicht verarbeitet werden.'),
        },
      },
    },
    '/api/v1/championships': {
      get: {
        operationId: 'getChampionships',
        summary: 'Turniere auflisten',
        description:
          'Liefert alle veröffentlichten Turniere, absteigend nach ihrer laufenden Nummer.',
        tags: ['Turniere'],
        responses: {
          '200': jsonResponse(
            'Die veröffentlichten Turniere.',
            'Championships',
          ),
          '500': errorResponse('Die Anfrage konnte nicht verarbeitet werden.'),
        },
      },
    },
    '/api/v1/leagues': {
      get: {
        operationId: 'getLeagues',
        summary: 'Ligen auflisten',
        tags: ['Stammdaten'],
        responses: {
          '200': jsonResponse('Die verfügbaren Ligen.', 'Leagues'),
          '500': errorResponse('Die Anfrage konnte nicht verarbeitet werden.'),
        },
      },
    },
    '/api/v1/rules': {
      get: {
        operationId: 'getRules',
        summary: 'Regelwerke auflisten',
        tags: ['Stammdaten'],
        responses: {
          '200': jsonResponse('Die verfügbaren Regelwerke.', 'Rules'),
          '500': errorResponse('Die Anfrage konnte nicht verarbeitet werden.'),
        },
      },
    },
    '/api/v1/teams': {
      get: {
        operationId: 'getTeams',
        summary: 'Teams auflisten',
        tags: ['Stammdaten'],
        responses: {
          '200': jsonResponse('Die verfügbaren Teams.', 'Teams'),
          '500': errorResponse('Die Anfrage konnte nicht verarbeitet werden.'),
        },
      },
    },
    '/api/v1/championships/{id}/players': {
      get: {
        operationId: 'getChampionshipPlayers',
        summary: 'Turnierteilnehmer auflisten',
        description:
          'Liefert die Teilnehmer und ihre Mitgliedsdaten. Rang und Punkte fehlen, solange noch keine Wertung vorliegt.',
        tags: ['Turniere'],
        parameters: [championshipIdParameter],
        responses: {
          '200': jsonResponse(
            'Die Teilnehmer des Turniers einschließlich ihrer Mitgliedsdaten.',
            'ChampionshipPlayers',
          ),
          ...championshipErrors,
        },
      },
    },
    '/api/v1/championships/{id}/matches': {
      get: {
        operationId: 'getChampionshipMatches',
        summary: 'Turnierspiele auflisten',
        description:
          'Liefert Runden und Spiele sowie die darin tatsächlich verwendeten Teams und Ligen.',
        tags: ['Turniere'],
        parameters: [championshipIdParameter],
        responses: {
          '200': jsonResponse(
            'Die Spiele und zugehörigen Stammdaten des Turniers.',
            'ChampionshipMatches',
          ),
          ...championshipErrors,
        },
      },
    },
    '/api/v1/championships/{id}/current-tips': {
      get: {
        operationId: 'getChampionshipCurrentTips',
        summary: 'Aktuelle Tipps abrufen',
        description:
          'Liefert einen Ausschnitt aus vier aktuellen Spielen mit den Tipps aller Teilnehmer. Für abgeschlossene Turniere wird eine leere Liste geliefert.',
        tags: ['Turniere'],
        parameters: [championshipIdParameter],
        responses: {
          '200': jsonResponse(
            'Die aktuellen Spiele und Tipps.',
            'ChampionshipCurrentTips',
          ),
          ...championshipErrors,
        },
      },
    },
    '/api/v1/championships/{id}/player-tips': {
      get: {
        operationId: 'getChampionshipPlayerTips',
        summary: 'Tipps eines Teilnehmers abrufen',
        description:
          'Liefert die Tipps eines über `name` ausgewählten Mitglieds. Ohne Parameter wird der erste Teilnehmer des Turniers verwendet.',
        tags: ['Turniere'],
        parameters: [
          championshipIdParameter,
          {
            name: 'name',
            in: 'query',
            required: false,
            description: 'ID des Mitglieds.',
            schema: { type: 'string' },
          },
        ],
        responses: {
          '200': jsonResponse(
            'Die nach Spiel-ID indizierten Tipps des Teilnehmers.',
            'ChampionshipPlayerTips',
          ),
          '400': errorResponse('Das Turnier hat keine Teilnehmer.'),
          '404': errorResponse(
            'Das Turnier oder der ausgewählte Teilnehmer wurde nicht gefunden.',
          ),
          '406': errorResponse(
            'Die Turnier-ID oder die Mitglieds-ID ist ungültig.',
          ),
          '500': errorResponse('Die Anfrage konnte nicht verarbeitet werden.'),
        },
      },
    },
    '/api/v1/championships/{id}/match-tips': {
      get: {
        operationId: 'getChampionshipMatchTips',
        summary: 'Tipps eines Spiels abrufen',
        description:
          'Liefert die Tipps zu einem über `nr` ausgewählten Spiel. Ohne Parameter wird das zuletzt ausgewertete oder andernfalls das erste Spiel verwendet.',
        tags: ['Turniere'],
        parameters: [
          championshipIdParameter,
          {
            name: 'nr',
            in: 'query',
            required: false,
            description: 'Laufende Nummer des Spiels.',
            schema: { type: 'integer', minimum: 1 },
          },
        ],
        responses: {
          '200': jsonResponse(
            'Die nach Teilnehmer-ID indizierten Tipps des Spiels.',
            'ChampionshipMatchTips',
          ),
          '400': errorResponse('Das Turnier hat keine Spiele.'),
          '404': errorResponse(
            'Das Turnier oder das ausgewählte Spiel wurde nicht gefunden.',
          ),
          '406': errorResponse('Die Turnier-ID hat ein ungültiges Format.'),
          '500': errorResponse('Die Anfrage konnte nicht verarbeitet werden.'),
        },
      },
    },
  },
  components: {
    schemas: {
      Accounts: jsonSchema(v.array(MemberSchema)),
      Championships: jsonSchema(v.array(ChampionshipSchema)),
      Leagues: jsonSchema(v.array(LeagueSchema)),
      Rules: jsonSchema(v.array(RuleSetSchema)),
      Teams: jsonSchema(v.array(TeamSchema)),
      ChampionshipPlayers: jsonSchema(ChampionshipPlayersSchema),
      ChampionshipMatches: jsonSchema(ChampionshipMatchesSchema),
      ChampionshipCurrentTips: jsonSchema(ChampionshipCurrentTipsSchema),
      ChampionshipPlayerTips: jsonSchema(ChampionshipPlayerTipsSchema),
      ChampionshipMatchTips: jsonSchema(ChampionshipMatchTipsSchema),
      Error: {
        type: 'object',
        required: ['status', 'error'],
        properties: {
          status: {
            type: 'integer',
            minimum: 400,
            maximum: 599,
          },
          error: {
            type: 'string',
          },
        },
      },
    },
  },
};

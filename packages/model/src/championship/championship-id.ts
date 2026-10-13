import * as v from 'valibot';

export const championshipIdRegEx = /^[a-z]{2}\d{4}$/;

export const ChampionshipIdSchema = v.pipe(
  v.string(),
  v.regex(championshipIdRegEx, 'The championship ID has an invalid format.'),
);

export type ChampionshipId = v.InferOutput<typeof ChampionshipIdSchema>;

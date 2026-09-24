import * as v from 'valibot';

const championshipIdPattern = /^[a-z]{2}\d{4}$/;

export const ChampionshipIdSchema = v.pipe(
  v.string(),
  v.regex(championshipIdPattern, 'The championship ID has an invalid format.'),
);

export type ChampionshipId = v.InferOutput<typeof ChampionshipIdSchema>;

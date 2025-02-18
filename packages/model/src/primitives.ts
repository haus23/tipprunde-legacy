import * as v from 'valibot';

export const championshipIdRegEx = /^[a-z]{2}\d{4}$/;
export const matchDateRegEx = /^\d{4}-[01]\d-[0-3]\d$|^$/;
export const resultRegEx = /^\d{1,2}:\d{1,2}$|^$/;

export const ChampionshipIdSchema = v.pipe(
  v.string(),
  v.regex(championshipIdRegEx),
);

export const MatchDateSchema = v.pipe(
  v.string(),
  v.regex(matchDateRegEx, 'Bad date format'),
);

export const ResultSchema = v.pipe(
  v.string(),
  v.regex(resultRegEx, 'Ungültiges Ergebnis.'),
);

export type ChampionshipId = v.InferInput<typeof ChampionshipIdSchema>;
export type MatchDate = v.InferInput<typeof MatchDateSchema>;
export type Result = v.InferInput<typeof ResultSchema>;

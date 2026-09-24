import * as v from 'valibot';

export const matchDateRegEx = /^\d{4}-[01]\d-[0-3]\d$|^$/;
export const resultRegEx = /^\d{1,2}:\d{1,2}$|^$/;

export const MatchDateSchema = v.pipe(
  v.string(),
  v.regex(matchDateRegEx, 'Bad date format'),
);

export const ResultSchema = v.pipe(
  v.string(),
  v.regex(resultRegEx, 'Bad match result or tip'),
);

export type MatchDate = v.InferInput<typeof MatchDateSchema>;
export type Result = v.InferInput<typeof ResultSchema>;

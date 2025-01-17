import type { ChampionshipInput } from '@haus23/tipprunde-model';
import type { Request } from 'express';

import { getMatches } from '../queries/championships/matches.ts';
import { ValidationError } from './validation-error.ts';

/**
 * Validates match nr in request
 * @param req The request object
 * @param championship Championship to lookup the account
 * @returns Match
 */
export async function validateMatch(
  req: Request,
  championship: ChampionshipInput,
) {
  const { nr } = req.query;
  const matches = await getMatches(championship);

  if (matches.length === 0) {
    throw new ValidationError({
      statusCode: 400,
      error: 'Championship has no matches',
    });
  }

  if (!nr) {
    // Return latest played match or the first if none played
    return (
      matches
        .toSorted((a, b) => (a.date ?? '').localeCompare(b.date ?? ''))
        .findLast((m) => m.result) || matches[0]
    );
  }

  // Validate match nr exists in this championship
  const match = matches.find((m) => m.nr === Number(nr));

  if (!match) {
    throw new ValidationError({
      statusCode: 404,
      error: 'No match with this nr in the championship',
    });
  }

  return match;
}

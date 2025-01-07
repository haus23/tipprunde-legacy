import { type Championship, ChampionshipId } from '@haus23/tipprunde-types';
import type { Request } from 'express';

import { getChampionships } from '../queries/championships.ts';
import { ValidationError } from './validation-error.ts';

/**
 * Validate championship id
 *
 * @param req Request
 * @returns Championship
 */
export async function validateChampionship(
  req: Request,
): Promise<Championship> {
  const id = req.params.id;
  if (!id) {
    throw new ValidationError({
      statusCode: 400,
      error: 'No route param named id present.',
    });
  }

  const parsedId = ChampionshipId.safeParse(id);
  if (!parsedId.success) {
    throw new ValidationError({
      statusCode: 406,
      error: 'Bad championship id',
    });
  }

  const championships = await getChampionships();

  const championship = championships?.find((c) => c.id === parsedId.data);
  if (!championship) {
    throw new ValidationError({
      statusCode: 404,
      error: 'Championship not found',
    });
  }

  return championship;
}

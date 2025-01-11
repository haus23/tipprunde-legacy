import { ChampionshipIdSchema } from '@haus23/tipprunde-model';
import type { Request } from 'express';
import * as v from 'valibot';

import { getChampionships } from '../queries/championships.ts';
import { ValidationError } from './validation-error.ts';

/**
 * Validate championship id
 *
 * @param req Request
 * @returns Championship
 */
export async function validateChampionship(req: Request) {
  const id = req.params.id;
  if (!id) {
    throw new ValidationError({
      statusCode: 400,
      error: 'No route param named id present.',
    });
  }

  const parsedId = v.safeParse(ChampionshipIdSchema, id);
  if (!parsedId.success) {
    throw new ValidationError({
      statusCode: 406,
      error: 'Bad championship id',
    });
  }

  const championships = await getChampionships();

  const championship = championships?.find((c) => c.id === parsedId.output);
  if (!championship) {
    throw new ValidationError({
      statusCode: 404,
      error: 'Championship not found',
    });
  }

  return championship;
}

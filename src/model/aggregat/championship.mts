import { Static, Type } from '@sinclair/typebox';

export const ChampionshipId = Type.RegEx(/^[a-z]{2}\d{4}$/);
export type ChampionshipId = Static<typeof ChampionshipId>;

export const Championship = Type.Object({
  id: ChampionshipId,
  name: Type.String(),
  nr: Type.Integer({ exclusiveMinimum: 0 }),
  rulesId: Type.String(),
  published: Type.Boolean(),
  completed: Type.Boolean(),
});
export type Championship = Static<typeof Championship>;

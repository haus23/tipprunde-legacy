import { Static, Type } from '@sinclair/typebox';

export const Player = Type.Object({
  id: Type.String(),
  name: Type.String(),
  email: Type.Union([Type.String({ format: 'email' }), Type.Literal('')]),
});
export type Player = Static<typeof Player>;

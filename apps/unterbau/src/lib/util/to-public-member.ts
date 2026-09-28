import type { Member } from '@haus23/tipprunde-model';

export function toPublicMember(member: Member): Member {
  return { ...member, email: '' };
}

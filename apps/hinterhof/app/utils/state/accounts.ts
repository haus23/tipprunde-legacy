import type { Account } from '@haus23/tipprunde-model';
import { atom, useAtom, useAtomValue } from 'jotai';
import { atomEffect } from 'jotai-effect';
import {
  collection,
  createEntity,
  updateEntity,
} from '#/lib/firebase/repository';

const accountsAtom = atom<Account[]>([]);
const accountsSubscriptionEffect = atomEffect((get, set) =>
  collection<Account>('players').subscribe((teams) => {
    console.log('Subscription: accounts');
    set(accountsAtom, teams);
  }),
);

export function useAccounts() {
  useAtom(accountsSubscriptionEffect);

  const createAccount = (account: Account) =>
    createEntity<Account>('players', account);
  const updateAccount = (account: Account) =>
    updateEntity<Account>('players', account);

  return { accounts: useAtomValue(accountsAtom), createAccount, updateAccount };
}

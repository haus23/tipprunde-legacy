import type { Account } from '@haus23/tipprunde-model';
import { atom, useAtomValue } from 'jotai';
import { observe } from 'jotai-effect';

import {
  collection,
  createEntity,
  updateEntity,
} from '@/lib/firebase/repository';
import { store } from '../store';

const accountsAtom = atom<Account[]>([]);

observe((get, set) => {
  collection<Account>('players').subscribe((teams) => {
    console.log('Subscription: accounts');
    set(accountsAtom, teams);
  });
}, store);

export function useAccounts() {
  const createAccount = (account: Account) =>
    createEntity<Account>('players', account);
  const updateAccount = (account: Account) =>
    updateEntity<Account>('players', account);

  return { accounts: useAtomValue(accountsAtom), createAccount, updateAccount };
}

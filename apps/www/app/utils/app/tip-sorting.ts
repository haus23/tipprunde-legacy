import type { Player, Tip } from '@haus23/tipprunde-types';
import { useCallback, useReducer } from 'react';

const sortOrderValues = ['ascending', 'none', 'descending'] as const;

type SortColumn = 'name' | 'tip' | 'points';
type SortOrder = (typeof sortOrderValues)[number];
type Sort = { column?: SortColumn; order: SortOrder };

function orderingReducer(state: Sort, column: SortColumn): Sort {
  if (column !== state.column) {
    return { column, order: 'descending' };
  }
  const ix = sortOrderValues.indexOf(state.order);
  return { column, order: sortOrderValues[(ix + 1) % 3] };
}

function compareTip(a: Tip, b: Tip) {
  const [aHome, aAway] = a.tip.split(':').map(Number);
  const [bHome, bAway] = b.tip.split(':').map(Number);

  return aHome - aAway - (bHome - bAway) || aHome - bHome;
}

export function useTipSorting() {
  const [sort, toggleSort] = useReducer(orderingReducer, { order: 'none' });

  const sortFn = useCallback(
    (a: { player: Player; tip: Tip }, b: { player: Player; tip: Tip }) => {
      if (sort.order === 'none') return 0;

      switch (sort.column) {
        case 'name':
          return (
            a.player.account.name.localeCompare(b.player.account.name) *
            (sort.order === 'descending' ? 1 : -1)
          );
        case 'points':
          return a.tip === b.tip // both undefined
            ? 0
            : typeof a.tip === 'undefined'
              ? 1
              : typeof b.tip === 'undefined'
                ? -1
                : (a.tip.points - b.tip.points) *
                  (sort.order === 'ascending' ? 1 : -1);
        case 'tip':
          return a.tip === b.tip // both undefined
            ? 0
            : typeof a.tip === 'undefined'
              ? 1
              : typeof b.tip === 'undefined'
                ? -1
                : compareTip(a.tip, b.tip) *
                  (sort.order === 'ascending' ? 1 : -1);
        default:
          return 0;
      }
    },
    [sort],
  );

  return {
    ...sort,
    toggleSort,
    sortFn,
  };
}

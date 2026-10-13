import type { Round } from '@haus23/tipprunde-model';
import { useSearchParams } from 'react-router';
import { useRounds } from './use-rounds';

export const roundParam = 'runde';

// The selected round lives in the URL (?runde=5), so it survives reloads and
// carries over between matches, tips and results. Without a valid round
// number the latest round is selected.
export function useCurrentRound() {
  const { rounds } = useRounds();
  const [searchParams, setSearchParams] = useSearchParams();

  const nr = Number(searchParams.get(roundParam));
  const currentRound =
    rounds.find((round) => round.nr === nr) ?? rounds[rounds.length - 1];

  function setCurrentRound(round: Round) {
    setSearchParams(
      (params) => {
        params.set(roundParam, String(round.nr));
        return params;
      },
      { replace: true },
    );
  }

  return { rounds, currentRound, setCurrentRound };
}

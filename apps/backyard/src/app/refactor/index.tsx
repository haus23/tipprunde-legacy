import { useCurrentChampionship } from '@/hooks/current-data/use-current-championship';
import { useMatches } from '@/hooks/current-data/use-matches';
import { useRounds } from '@/hooks/current-data/use-rounds';
import { deleteEntity, Match } from 'lib';
import { Button } from 'ui';

export default function RefactorView() {
  const { currentChampionship } = useCurrentChampionship();
  const { rounds } = useRounds();
  const { matches, updateMatch } = useMatches();
  const refactorRoundIdsDone = !rounds.some((r) => r.id.startsWith('runde-'));

  function refactorRoundIds() {
    rounds
      .filter((r) => r.id.startsWith('runde-'))
      .forEach(async (oldRound) => {
        // Find corresponding new round
        const newRound = rounds.find(
          (r) => r.nr === oldRound.nr && r !== oldRound
        );
        if (newRound) {
          matches
            .filter((m) => m.roundId === oldRound.id)
            .forEach(async (m) => {
              const updatedMatch: Match = { ...m, roundId: newRound.id };
              await updateMatch(updatedMatch);
              console.log('Updated Match', updatedMatch.nr);
            });
          await deleteEntity(
            `championships/${currentChampionship?.id}/rounds`,
            oldRound.id
          );
          console.log('Deleted old round', oldRound.id);
        }
      });
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold">Refactor</h2>
      <div className="mt-8 flex flex-wrap gap-8">
        <Button
          onClick={refactorRoundIds}
          primary
          disabled={refactorRoundIdsDone}
        >
          Refactor Round Ids
        </Button>
      </div>
    </div>
  );
}

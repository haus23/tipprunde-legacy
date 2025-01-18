import { useCurrentChampionship } from '@/hooks/current-data/use-current-championship';
import { useMatches } from '@/hooks/current-data/use-matches';
import { useRounds } from '@/hooks/current-data/use-rounds';
import { type Match, deleteEntity } from 'lib';
import { Button } from 'ui-legacy';

export default function RefactorView() {
  const { currentChampionship } = useCurrentChampionship();
  const { rounds } = useRounds();
  const { matches, updateMatch } = useMatches();
  const refactorRoundIdsDone = !rounds.some((r) => r.id.startsWith('runde-'));

  async function refactorRoundIds() {
    for (const oldRound of rounds.filter((r) => r.id.startsWith('runde-'))) {
      // Find corresponding new round
      const newRound = rounds.find(
        (r) => r.nr === oldRound.nr && r !== oldRound,
      );
      if (newRound) {
        for (const m of matches.filter((m) => m.roundId === oldRound.id)) {
          const updatedMatch: Match = { ...m, roundId: newRound.id };
          await updateMatch(updatedMatch);
          console.log('Updated Match', updatedMatch.nr);
        }

        await deleteEntity(
          `championships/${currentChampionship?.id}/rounds`,
          oldRound.id,
        );
        console.log('Deleted old round', oldRound.id);
      }
    }
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

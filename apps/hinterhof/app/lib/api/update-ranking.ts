import { currentChampionshipAtom } from '@/utils/state/current-championship/championship';
import { playersAtom } from '@/utils/state/current-championship/players';
import { tipsAtom } from '@/utils/state/current-championship/tips';
import { store } from '@/utils/store';
import type { Player } from '@haus23/tipprunde-model';
import { patchEntity } from '../firebase/repository';

export async function updateRanking() {
  const championship = store.get(currentChampionshipAtom);
  const { players } = store.get(playersAtom(championship.id));
  const { tips } = store.get(tipsAtom(championship.id));

  for (const p of players) {
    const points = tips
      .filter((t) => t.playerId === p.id)
      .reduce((sum, t) => sum + t.points, 0);
    p.points = points;
    p.totalPoints = p.extraPoints + p.points;
  }

  let previousRank = 0;
  let rank = 0;
  let previousRankPoints = -1;
  for (const p of players.toSorted((a, b) => b.totalPoints - a.totalPoints)) {
    ++rank;
    if (p.totalPoints !== previousRankPoints) {
      p.rank = rank;
      previousRank = rank;
      previousRankPoints = p.totalPoints;
    } else {
      p.rank = previousRank;
    }
  }

  await Promise.all(
    players.map((p) =>
      patchEntity<Player>(`championships/${championship.id}/players`, p.id, {
        points: p.points,
        totalPoints: p.totalPoints,
        rank: p.rank,
      }),
    ),
  );
}

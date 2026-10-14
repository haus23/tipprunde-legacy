import type { ChampionshipPlayer, Match, Round } from '@haus23/tipprunde-model';
import {
  CalendarIcon,
  FolderIcon,
  Grid2X2PlusIcon,
  ScaleIcon,
  SquarePenIcon,
} from 'lucide-react';
import type { ElementType } from 'react';

// The pages of a championship (/:turnier/<path>; the championship page itself
// is /:turnier). A page is only available once the championship has the data
// it works on.
export type ChampionshipPage = {
  path: string;
  icon: ElementType;
  label: string;
  keepsRound?: boolean;
  available: (
    rounds: Round[],
    matches: Match[],
    players: ChampionshipPlayer[],
  ) => boolean;
};

export const championshipPages: ChampionshipPage[] = [
  {
    path: '',
    icon: FolderIcon,
    label: 'Turnier',
    available: () => true,
  },
  {
    path: 'spiele',
    keepsRound: true,
    icon: CalendarIcon,
    label: 'Spiele',
    available: (rounds) => rounds.length > 0,
  },
  {
    path: 'tipps',
    keepsRound: true,
    icon: SquarePenIcon,
    label: 'Tipps',
    available: (_rounds, matches, players) =>
      matches.length > 0 && players.length > 0,
  },
  {
    path: 'ergebnisse',
    keepsRound: true,
    icon: ScaleIcon,
    label: 'Ergebnisse',
    available: (_rounds, matches) => matches.length > 0,
  },
  {
    path: 'zusatzpunkte',
    icon: Grid2X2PlusIcon,
    label: 'Zusatzpunkte',
    available: (_rounds, _matches, players) => players.length > 0,
  },
];

import type {
  Championship,
  ChampionshipPlayer,
  Match,
  Round,
} from '@haus23/tipprunde-model';
import { cn } from 'cn';
import {
  CalendarIcon,
  FolderPlusIcon,
  Grid2X2PlusIcon,
  MegaphoneIcon,
  ScaleIcon,
  SquarePenIcon,
} from 'lucide-react';
import type { ElementType } from 'react';
import { Link } from 'react-router';
import { useChampionshipPlayers } from '#/hooks/current-data/use-championship-players';
import { useCurrentChampionship } from '#/hooks/current-data/use-current-championship';
import { useMatches } from '#/hooks/current-data/use-matches';
import { useRounds } from '#/hooks/current-data/use-rounds';

const items: {
  title: string;
  description: string;
  background: string;
  route: string;
  icon: ElementType;
  visible: (
    championship: Championship | undefined,
    rounds: Round[],
    matches: Match[],
    players: ChampionshipPlayer[],
  ) => boolean;
}[] = [
  {
    title: 'Ergebnisse eintragen',
    description: 'Spiel-Ergebnisse eintragen und auswerten',
    icon: ScaleIcon,
    background: 'bg-teaser-results',
    route: './ergebnisse',
    visible: (_championship, _rounds, matches) => matches.length > 0,
  },
  {
    title: 'Tipps eintragen',
    description: 'Tipps der Mitspieler erfassen.',
    icon: SquarePenIcon,
    background: 'bg-teaser-tips',
    route: './tipps',
    visible: (_championship, _rounds, matches, players) =>
      matches.length > 0 && players.length > 0,
  },
  {
    title: 'Spielansetzungen',
    description: 'Bearbeite die Ansetzungen einer Runde',
    icon: MegaphoneIcon,
    background: 'bg-teaser-matches',
    route: './spiele',
    visible: (_championship, rounds) => rounds.length > 0,
  },
  {
    title: 'Neue Runde',
    description: 'Lege eine neue (Monats-) Runde an',
    icon: CalendarIcon,
    background: 'bg-teaser-round',
    route: './neue-runde',
    visible: (championship) => !!championship,
  },
  {
    title: 'Zusatzpunkte',
    description: 'Ergebnisse der Zusatzfragen bei allen Mitspielern eintragen',
    icon: Grid2X2PlusIcon,
    background: 'bg-teaser-extra-points',
    route: './zusatzpunkte',
    visible: (_championship, _rounds, _matches, players) => players.length > 0,
  },
  {
    title: 'Neues Turnier',
    description: 'Starte eine neue Liga-Halbserie oder ein Turnier',
    icon: FolderPlusIcon,
    background: 'bg-teaser-championship',
    route: './neues-turnier',
    visible: () => true,
  },
];

export default function Dashboard() {
  const { currentChampionship } = useCurrentChampionship();
  const { rounds } = useRounds();
  const { championshipPlayers } = useChampionshipPlayers();
  const { matches } = useMatches();

  return (
    <ul className="mt-2 grid grid-cols-1 gap-6 py-6 sm:grid-cols-2">
      {items
        .filter((item) =>
          item.visible(
            currentChampionship,
            rounds,
            matches,
            championshipPlayers,
          ),
        )
        .map((item) => (
          <li
            key={item.title}
            className="flow-root self-stretch sm:only:col-span-2 sm:only:mx-auto"
          >
            <div className="relative flex h-full space-x-4 rounded-xl p-2 focus-within:ring-2 focus-within:ring-indigo-500 hover:bg-gray-200">
              <div
                className={cn(
                  item.background,
                  'flex h-16 w-16 shrink-0 items-center justify-center rounded-lg',
                )}
              >
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 text-sm">
                  <Link to={item.route} className="focus:outline-hidden">
                    <span className="absolute inset-0" aria-hidden="true" />
                    {item.title}
                    <span aria-hidden="true"> &rarr;</span>
                  </Link>
                </h3>
                <p className="mt-1 text-gray-500 text-sm">{item.description}</p>
              </div>
            </div>
          </li>
        ))}
    </ul>
  );
}

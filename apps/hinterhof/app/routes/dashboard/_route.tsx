import {
  CalendarIcon,
  FoldersIcon,
  type LucideIcon,
  ScaleIcon,
} from 'lucide-react';
import { Link } from 'react-router';

import { cn } from '@/utils/cn';
import { getShuffledColors } from '@/utils/misc';
import { useOptionalChampionship } from '@/utils/state/current-championship/championship';

const dashboardBackgrounds = getShuffledColors();
const dashboardItems: {
  title: string;
  description: string;
  background: string;
  route: string;
  icon: LucideIcon;
}[] = [
  {
    title: 'Ergebnisse eintragen',
    description: 'Spielergebnisse eintragen und auswerten.',
    icon: ScaleIcon,
    background: dashboardBackgrounds[0],
    route: './$championship/ergebnisse',
  },
  {
    title: 'Neue Runde',
    description: 'Lege eine neue (Monats-) Runde.',
    icon: CalendarIcon,
    background: dashboardBackgrounds[1],
    route: './$championship/neue-runde',
  },
  {
    title: 'Turniere',
    description:
      'Übersicht über alle Turniere und die Auswahl des Turniers zur Bearbeitung',
    icon: FoldersIcon,
    background: dashboardBackgrounds[2],
    route: '../stammdaten/turniere',
  },
];

export default function DashboardRoute() {
  const championship = useOptionalChampionship();
  const items = dashboardItems.map((item) => ({
    ...item,
    route: item.route.replace('$championship', championship?.id || ''),
  }));

  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <li
          key={item.title}
          className="flow-root self-stretch sm:only:col-span-2 sm:only:mx-auto"
        >
          <div className="relative flex h-full space-x-4 rounded-xl p-4 focus-within:ring-2 focus-within:ring-indigo-500 hover:bg-gray-200">
            <div
              className={cn(
                item.background,
                'flex h-16 w-16 shrink-0 items-center justify-center rounded-lg',
              )}
            >
              <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 text-sm ">
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

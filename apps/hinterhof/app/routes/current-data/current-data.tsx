import {
  CalendarIcon,
  FoldersIcon,
  type LucideIcon,
  ScaleIcon,
} from 'lucide-react';
import { Link } from 'react-router';

import { cn } from '@/utils/cn';
import { getShuffledColors } from '@/utils/misc';

const dashboardBackgrounds = getShuffledColors();

const currentDataItems: {
  title: string;
  description: string;
  background: string;
  route: string;
  icon: LucideIcon;
}[] = [
  {
    title: 'Turnier wechseln',
    description: 'Wechselt das aktuell zu bearbeitende Turnier',
    icon: FoldersIcon,
    background: dashboardBackgrounds[0],
    route: '../stammdaten/turniere',
  },
  {
    title: 'Spiele',
    description: 'Spiele des Turniers. Erfassen und bearbeiten.',
    icon: CalendarIcon,
    background: dashboardBackgrounds[1],
    route: './spiele',
  },
  {
    title: 'Ergebnisse',
    description: 'Spielergebnisse eintragen und Punkte berechnen',
    icon: ScaleIcon,
    background: dashboardBackgrounds[2],
    route: './ergebnisse',
  },
];

function CurrentDataRoute() {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {currentDataItems.map((item) => (
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

export { CurrentDataRoute as Component };

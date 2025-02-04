import { cn } from '@/utils/cn';
import {
  FoldersIcon,
  type LucideIcon,
  ShieldIcon,
  UsersIcon,
} from 'lucide-react';
import { Link } from 'react-router';

const masterDataItems: {
  title: string;
  description: string;
  background: string;
  route: string;
  icon: LucideIcon;
}[] = [
  {
    title: 'Turniere',
    description:
      'Übersicht über alle Turniere und die Auswahl des Turniers zur Bearbeitung',
    icon: FoldersIcon,
    background: 'bg-blue-500',
    route: './turniere',
  },
  {
    title: 'Spieler',
    description: 'Alle Mitspieler der Tipprunde. Erfassen und bearbeiten.',
    icon: UsersIcon,
    background: 'bg-indigo-500',
    route: './spieler',
  },
  {
    title: 'Mannschaften / Teams',
    description: 'Erfassen und bearbeiten von Namen und Kürzeln',
    icon: ShieldIcon,
    background: 'bg-purple-500',
    route: './teams',
  },
];

function MasterDataRoute() {
  return (
    <ul className="mt-2 grid grid-cols-1 gap-6 py-6 sm:grid-cols-2">
      {masterDataItems.map((item) => (
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

export { MasterDataRoute as Component };

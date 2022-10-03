import { ElementType } from 'react';
import {
  CalendarIcon,
  FolderPlusIcon,
  UsersIcon,
  PencilSquareIcon,
  ScaleIcon,
  MegaphoneIcon,
} from '@heroicons/react/24/outline';
import { classNames } from '@/utils/class-names';
import { Link } from 'react-router-dom';
import { useCurrentChampionship } from '@/hooks/use-current-championship';
import { Championship } from 'lib';

const items: {
  title: string;
  description: string;
  background: string;
  route: string;
  icon: ElementType;
  visible: (championship: Championship | undefined) => boolean;
}[] = [
  {
    title: 'Neues Turnier',
    description: 'Starte eine neue Liga-Halbserie oder ein Turnier',
    icon: FolderPlusIcon,
    background: 'bg-pink-500',
    route: './neues-turnier',
    visible: () => true,
  },
  {
    title: 'Mitspieler',
    description: 'Verwalte die Mitspieler des Turniers',
    icon: UsersIcon,
    background: 'bg-yellow-500',
    route: './mitspieler',
    visible: (championship) => !!championship,
  },
  {
    title: 'Neue Runde',
    description: 'Lege eine neue (Monats-) Runde an',
    icon: CalendarIcon,
    background: 'bg-green-500',
    route: './neue-runde',
    visible: (championship) => !!championship,
  },
  {
    title: 'Spielansetzungen',
    description: 'Bearbeite die Ansetzungen einer Runde',
    icon: MegaphoneIcon,
    background: 'bg-blue-500',
    route: './spiele-anlegen',
    visible: (championship) => false,
  },
  {
    title: 'Tipps eintragen',
    description: 'Tipps der Mitspieler erfassen.',
    icon: PencilSquareIcon,
    background: 'bg-indigo-500',
    route: './tipps-eintragen',
    visible: (championship) => false,
  },
  {
    title: 'Ergebnisse eintragen',
    description: 'Spiel-Ergebnisse eintragen und auswerten',
    icon: ScaleIcon,
    background: 'bg-purple-500',
    route: './ergebnisse-eintragen',
    visible: (championship) => false,
  },
];

export default function Dashboard() {
  const { currentChampionship } = useCurrentChampionship();

  return (
    <div>
      <h2 className="text-2xl font-semibold">
        {currentChampionship?.name || 'Hinterhof'}
      </h2>
      <ul
        role="list"
        className="mt-2 grid grid-cols-1 gap-6 py-6 sm:grid-cols-2"
      >
        {items
          .filter((item) => item.visible(currentChampionship))
          .map((item, itemIdx) => (
            <li
              key={itemIdx}
              className="flow-root self-stretch sm:only:col-span-2 sm:only:mx-auto"
            >
              <div className="relative flex h-full space-x-4 rounded-xl p-2 focus-within:ring-2 focus-within:ring-indigo-500 hover:bg-gray-200">
                <div
                  className={classNames(
                    item.background,
                    'flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg'
                  )}
                >
                  <item.icon
                    className="h-6 w-6 text-white"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900 ">
                    <Link to={item.route} className="focus:outline-none">
                      <span className="absolute inset-0" aria-hidden="true" />
                      {item.title}
                      <span aria-hidden="true"> &rarr;</span>
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {item.description}
                  </p>
                </div>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}

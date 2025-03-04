import {
  FoldersIcon,
  type LucideIcon,
  PilcrowIcon,
  ShieldIcon,
  Table2Icon,
  UsersIcon,
} from 'lucide-react';

import { Dashboard } from '@/components/dashboard';
import { getShuffledColors } from '@/utils/misc';

const dashboardBackgrounds = getShuffledColors();
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
    background: dashboardBackgrounds[0],
    route: './turniere',
  },
  {
    title: 'Spieler',
    description: 'Alle Mitspieler der Tipprunde. Erfassen und bearbeiten.',
    icon: UsersIcon,
    background: dashboardBackgrounds[1],
    route: './spieler',
  },
  {
    title: 'Mannschaften / Teams',
    description: 'Erfassen und bearbeiten von Namen und Kürzeln',
    icon: ShieldIcon,
    background: dashboardBackgrounds[2],
    route: './teams',
  },
  {
    title: 'Ligen',
    description: 'Fussball-Ligen oder Phasen eines Turniers.',
    icon: Table2Icon,
    background: dashboardBackgrounds[3],
    route: './ligen',
  },
  {
    title: 'Regelwerke',
    description: 'Erstellen und bearbeiten der Turnierregelwerke.',
    icon: PilcrowIcon,
    background: dashboardBackgrounds[4],
    route: './regelwerke',
  },
];

function MasterDataRoute() {
  return <Dashboard items={masterDataItems} />;
}

export { MasterDataRoute as Component };

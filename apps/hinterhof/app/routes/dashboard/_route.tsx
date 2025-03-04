import {
  CalendarIcon,
  FolderPlus,
  type LucideIcon,
  ScaleIcon,
  TrophyIcon,
} from 'lucide-react';

import { Dashboard } from '@/components/dashboard';
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
    route: '/$championship/ergebnisse',
  },
  {
    title: 'Neue Runde',
    description: 'Lege eine neue (Monats-) Runde.',
    icon: CalendarIcon,
    background: dashboardBackgrounds[1],
    route: '/$championship/neue-runde',
  },
  {
    title: 'Turnier',
    description:
      'Turnierstatus (Veröffentlicht, Abgeschlossen, ...) bearbeiten',
    icon: TrophyIcon,
    background: dashboardBackgrounds[2],
    route: '/$championship/turnier',
  },
  {
    title: 'Neues Turnier',
    description: 'Neues Turnier anlegen/starten.',
    icon: FolderPlus,
    background: dashboardBackgrounds[3],
    route: '/neues-turnier',
  },
];

export default function DashboardRoute() {
  const championship = useOptionalChampionship();
  const items = dashboardItems.map((item) => ({
    ...item,
    route: item.route.replace('$championship', championship?.id || ''),
  }));

  return <Dashboard items={items} />;
}

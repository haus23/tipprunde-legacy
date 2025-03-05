import {
  CalendarIcon,
  DicesIcon,
  type LucideIcon,
  ScaleIcon,
  TicketPlusIcon,
  TrophyIcon,
} from 'lucide-react';

import { Dashboard } from '@/components/dashboard';
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
    title: 'Turnier',
    description:
      'Turnierstatus (Veröffentlicht, Abgeschlossen, ...) bearbeiten',
    icon: TrophyIcon,
    background: dashboardBackgrounds[0],
    route: './turnier',
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
    description: 'Spielergebnisse eintragen und auswerten.',
    icon: ScaleIcon,
    background: dashboardBackgrounds[2],
    route: './ergebnisse',
  },
  {
    title: 'Tipps',
    description: 'Tipps erfassen und auswerten.',
    icon: DicesIcon,
    background: dashboardBackgrounds[3],
    route: './tipps',
  },
  {
    title: 'Zusatzpunkte',
    description: 'Zusatzpunkte erfassen und auswerten.',
    icon: TicketPlusIcon,
    background: dashboardBackgrounds[4],
    route: './zusatzpunkte',
  },
];

function CurrentDataRoute() {
  return <Dashboard items={currentDataItems} />;
}

export { CurrentDataRoute as Component };

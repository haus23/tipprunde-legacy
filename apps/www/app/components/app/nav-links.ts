import { linkOptions } from '@tanstack/react-router';
import { DicesIcon, TableIcon, UsersIcon } from 'lucide-react';

export const navLinks = (turnier: string) =>
  linkOptions([
    {
      to: '/$turnier',
      params: { turnier },
      label: 'Tabelle',
      activeOptions: { exact: true },
      icon: TableIcon,
    },
    {
      to: '/$turnier/spieler',
      params: { turnier },
      label: 'Spieler',
      icon: UsersIcon,
    },
    {
      to: '/$turnier/spiele',
      params: { turnier },
      label: 'Spiele',
      icon: DicesIcon,
    },
  ]);

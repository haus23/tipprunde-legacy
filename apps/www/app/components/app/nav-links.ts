import { linkOptions } from '@tanstack/react-router';
import { DicesIcon, TableIcon, UsersIcon } from 'lucide-react';

export const navLinks = (turnier: string) =>
  linkOptions([
    {
      to: '/$turnier',
      params: { turnier },
      activeOptions: { exact: true },
      label: 'Tabelle',
      icon: TableIcon,
    },
    {
      to: '/$turnier/spieler',
      params: { turnier },
      activeOptions: { exact: false },
      label: 'Spieler',
      icon: UsersIcon,
    },
    {
      to: '/$turnier/spiel',
      params: { turnier },
      activeOptions: { exact: false },
      label: 'Spiele',
      icon: DicesIcon,
    },
  ]);

import { linkOptions } from '@tanstack/react-router';
import { DicesIcon, TableIcon, UsersIcon } from 'lucide-react';

export const navLinks = linkOptions([
  {
    to: '/',
    label: 'Tabelle',
    activeOptions: { exact: true },
    icon: TableIcon,
  },
  {
    to: '/spieler',
    label: 'Spieler',
    icon: UsersIcon,
  },
  {
    to: '/spiele',
    label: 'Spiele',
    icon: DicesIcon,
  },
]);

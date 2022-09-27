import { MakeGenerics, Route } from '@tanstack/react-location';

import { Championship } from 'lib';

import Layout, { rootLoader } from '@/app/layout';

import HomePage from '@/app/home/page';
import PlayersPage from '@/app/players/page';
import RankingPage from '@/app/ranking/page';
import MatchesPage from '@/app/matches/page';
import { SplashScreen } from 'ui';

export type LocationGenerics = MakeGenerics<{
  LoaderData: {
    championships: Championship[];
    currentChampionship: Championship | null;
  };
}>;

export const appRoutes: Route<LocationGenerics>[] = [
  {
    element: <Layout />,
    loader: rootLoader,
    pendingElement: async () => <SplashScreen />,
    children: [
      { path: '/', element: <HomePage /> },
      { path: 'tabelle', element: <RankingPage /> },
      { path: 'spieler', element: <PlayersPage /> },
      { path: 'spiele', element: <MatchesPage /> },
    ],
  },
];

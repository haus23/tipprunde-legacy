import { MakeGenerics, Navigate, Route } from '@tanstack/react-location';

import { Championship } from 'lib';

import { SplashScreen } from 'ui';
import Layout, { rootLoader } from '@/app/layout';

import ChampionshipPage from '@/app/championship/page';
import PlayersPage from '@/app/players/page';
import RankingPage from '@/app/ranking/page';
import MatchesPage from '@/app/matches/page';

export type LocationGenerics = MakeGenerics<{
  LoaderData: {
    championships: Championship[];
    currentChampionship: Championship | null;
    selectedChampionship: Championship | null;
  };
  Params: {
    championshipId: string;
  };
}>;

export const appRoutes: Route<LocationGenerics>[] = [
  {
    path: '/',
    element: <Navigate to="/turnier" />,
  },
  {
    path: ':championshipId',
    element: <Layout />,
    loader: rootLoader,
    pendingElement: async () => <SplashScreen />,
    children: [
      { path: '/', element: <ChampionshipPage /> },
      { path: 'tabelle', element: <RankingPage /> },
      { path: 'spieler', element: <PlayersPage /> },
      { path: 'spiele', element: <MatchesPage /> },
    ],
  },
];

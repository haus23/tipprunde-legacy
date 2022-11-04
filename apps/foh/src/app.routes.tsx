import { RouteObject } from 'react-router-dom';

import { appLoader } from '@/app.loader';

import Layout from '@/app/layout';
import ChampionshipPage from '@/app/championship/page';
import PlayersPage from '@/app/players/page';
import RankingPage from '@/app/ranking/page';
import MatchesPage from '@/app/matches/page';
import ErrorPage from '@/app/error/page';

const childRoutes: RouteObject[] = [
  {
    index: true,
    handle: { childPath: '' },
    element: <ChampionshipPage />,
  },
  {
    path: 'tabelle',
    handle: { childPath: '/tabelle' },
    element: <RankingPage />,
  },
  {
    path: 'spieler',
    handle: { childPath: '/spieler' },
    element: <PlayersPage />,
  },
  {
    path: 'spieler/:playerId',
    handle: { childPath: '/spieler' },
    element: <PlayersPage />,
  },
  {
    path: 'spiele',
    handle: { childPath: '/spiele' },
    element: <MatchesPage />,
  },
];

export const appRoutes: RouteObject[] = [
  {
    path: '/',
    id: 'app',
    loader: appLoader,
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      ...childRoutes,
      {
        path: ':championshipId',
        children: childRoutes,
      },
    ],
  },
];

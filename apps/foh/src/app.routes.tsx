import { redirect, RouteObject } from 'react-router-dom';

import { appLoader } from '@/app.loader';

import Layout from '@/app/layout';
import ChampionshipPage from '@/app/championship/page';
import PlayersPage from '@/app/players/page';
import RankingPage from '@/app/ranking/page';
import MatchesPage from '@/app/matches/page';
import ErrorPage from '@/app/error/page';

export const appRoutes: RouteObject[] = [
  {
    path: '/',
    loader: () => redirect('/turnier'),
  },
  {
    id: 'app',
    path: ':championshipId',
    element: <Layout />,
    loader: appLoader,
    errorElement: <ErrorPage />,
    children: [
      { index: true, handle: { childPath: '' }, element: <ChampionshipPage /> },
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
        path: 'spiele',
        handle: { childPath: '/spiele' },
        element: <MatchesPage />,
      },
    ],
  },
];

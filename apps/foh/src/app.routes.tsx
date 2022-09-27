import { RouteObject } from 'react-router-dom';

import Layout from '@/app/layout';

import HomePage from '@/app/home/page';
import PlayersPage from '@/app/players/page';
import RankingPage from '@/app/ranking/page';
import MatchesPage from '@/app/matches/page';

const appRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'tabelle', element: <RankingPage /> },
      { path: 'spieler', element: <PlayersPage /> },
      { path: 'spiele', element: <MatchesPage /> },
    ],
  },
];

export default appRoutes;

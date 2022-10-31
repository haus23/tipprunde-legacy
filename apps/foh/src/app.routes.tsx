import Layout from '@/app/layout';

import ChampionshipPage from '@/app/championship/page';
import PlayersPage from '@/app/players/page';
import RankingPage from '@/app/ranking/page';
import MatchesPage from '@/app/matches/page';
import { redirect, RouteObject } from 'react-router-dom';
import { Championship, collection, filter, orderByDesc } from 'lib';
import { queryClient } from './app';

export const appRoutes: RouteObject[] = [
  {
    path: '/',
    loader: () => redirect('/turnier'),
  },
  {
    id: 'root',
    path: ':championshipId',
    element: <Layout />,
    loader: async ({ params: { championshipId } }) => {
      const championships = await queryClient.fetchQuery(
        ['championships'],
        collection<Championship>(
          'championships',
          filter('published', '==', true),
          orderByDesc('nr')
        ).get
      );
      const currentChampionship =
        championshipId === 'turnier'
          ? championships?.at(0) || null
          : championships?.find((c) => c.id === championshipId);

      return { championships, currentChampionship };
    },
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

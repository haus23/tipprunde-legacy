import type { ComponentType } from 'react';
import { Navigate, type RouteObject } from 'react-router';

import RouteError from './app/route-error';

function lazyComponent(load: () => Promise<{ default: ComponentType }>) {
  return {
    Component: async () => (await load()).default,
  };
}

const appRoutes: RouteObject[] = [
  {
    path: '/login',
    element: <Navigate to="/" replace />,
  },
  {
    path: '/',
    ErrorBoundary: RouteError,
    lazy: lazyComponent(() => import('./app/app-shell')),
    children: [
      {
        ErrorBoundary: RouteError,
        lazy: lazyComponent(() => import('./app/current-data/current-shell')),
        children: [
          {
            index: true,
            lazy: lazyComponent(() => import('./app/current-data/dashboard')),
          },
          {
            path: 'turnier',
            lazy: lazyComponent(
              () => import('./app/current-data/championship'),
            ),
          },
          {
            path: 'spiele',
            lazy: lazyComponent(() => import('./app/current-data/matches')),
          },
          {
            path: 'tipps',
            lazy: lazyComponent(() => import('./app/current-data/tips')),
          },
          {
            path: 'ergebnisse',
            lazy: lazyComponent(() => import('./app/current-data/results')),
          },
          {
            path: 'zusatzpunkte',
            lazy: lazyComponent(
              () => import('./app/current-data/extra-points'),
            ),
          },
          {
            path: 'neues-turnier',
            lazy: lazyComponent(
              () => import('./app/current-data/dashboard/create-championship'),
            ),
          },
          {
            path: 'neue-runde',
            lazy: lazyComponent(
              () => import('./app/current-data/dashboard/create-round'),
            ),
          },
        ],
      },
      {
        path: 'stammdaten',
        children: [
          {
            path: 'turniere',
            lazy: lazyComponent(
              () => import('./app/master-data/championships'),
            ),
          },
          {
            path: 'spieler',
            lazy: lazyComponent(() => import('./app/master-data/players')),
          },
          {
            path: 'teams',
            lazy: lazyComponent(() => import('./app/master-data/teams')),
          },
          {
            path: 'ligen',
            lazy: lazyComponent(() => import('./app/master-data/leagues')),
          },
          {
            path: 'regelwerke',
            lazy: lazyComponent(() => import('./app/master-data/rules')),
          },
        ],
      },
      {
        path: 'profil',
        lazy: lazyComponent(() => import('./app/profile')),
      },
      {
        path: 'logout',
        lazy: lazyComponent(() => import('./app/logout')),
      },
    ],
  },
];

export default appRoutes;

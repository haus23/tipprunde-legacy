import { auth } from 'lib';
import { redirect, RouteObject } from 'react-router-dom';

import AppShell from './app/app-shell';

import CurrentShell from './app/current-data/current-shell';
import Dashboard from './app/current-data/dashboard';
import ChampionshipView from './app/current-data/championship';
import ChampionshipCreateView from './app/current-data/championship/create';
import RoundView from './app/current-data/rounds';
import RoundCreateView from './app/current-data/rounds/create';
import TipsView from './app/current-data/tips';

import ChampionshipsView from './app/master-data/championships';
import PlayersView from './app/master-data/players';
import TeamsView from './app/master-data/teams';
import LeaguesView from './app/master-data/leagues';
import RulesView from './app/master-data/rules';

import ProfileView from './app/profile';
import Login from './app/login';
import Logout from './app/logout';

const appRoutes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <AppShell />,
    loader: async () => {
      if (!auth.currentUser) {
        return redirect('/login?from=' + window.location.pathname);
      }
    },
    children: [
      {
        element: <CurrentShell />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: 'turnier', element: <ChampionshipView /> },
          { path: 'neues-turnier', element: <ChampionshipCreateView /> },
          { path: 'runden', element: <RoundView /> },
          { path: 'neue-runde', element: <RoundCreateView /> },
          { path: 'tipps', element: <TipsView /> },
        ],
      },
      {
        path: 'stammdaten',
        children: [
          { path: 'turniere', element: <ChampionshipsView /> },
          { path: 'spieler', element: <PlayersView /> },
          { path: 'teams', element: <TeamsView /> },
          { path: 'ligen', element: <LeaguesView /> },
          { path: 'regelwerke', element: <RulesView /> },
        ],
      },
      { path: 'profil', element: <ProfileView /> },
      { path: 'logout', element: <Logout /> },
    ],
  },
];

export default appRoutes;

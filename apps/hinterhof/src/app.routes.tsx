import { auth } from 'lib';
import { type RouteObject, redirect } from 'react-router-dom';

import AppShell from './app/app-shell';

import ChampionshipView from './app/current-data/championship';
import CurrentShell from './app/current-data/current-shell';
import Dashboard from './app/current-data/dashboard';
import CreateChampionshipView from './app/current-data/dashboard/create-championship';
import CreateRoundView from './app/current-data/dashboard/create-round';
import MatchesView from './app/current-data/matches';
import ResultsView from './app/current-data/results';
import TipsView from './app/current-data/tips';

import ChampionshipsView from './app/master-data/championships';
import LeaguesView from './app/master-data/leagues';
import PlayersView from './app/master-data/players';
import RulesView from './app/master-data/rules';
import TeamsView from './app/master-data/teams';

import ExtraPointsView from './app/current-data/extra-points';
import Login from './app/login';
import Logout from './app/logout';
import ProfileView from './app/profile';
import RefactorView from './app/refactor';

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
        return redirect(`/login?from=${window.location.pathname}`);
      }
      return null;
    },
    children: [
      {
        element: <CurrentShell />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: 'turnier', element: <ChampionshipView /> },
          { path: 'spiele', element: <MatchesView /> },
          { path: 'tipps', element: <TipsView /> },
          { path: 'ergebnisse', element: <ResultsView /> },
          { path: 'zusatzpunkte', element: <ExtraPointsView /> },
          { path: 'neues-turnier', element: <CreateChampionshipView /> },
          { path: 'neue-runde', element: <CreateRoundView /> },
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
      { path: 'refactor', element: <RefactorView /> },
      { path: 'profil', element: <ProfileView /> },
      { path: 'logout', element: <Logout /> },
    ],
  },
];

export default appRoutes;

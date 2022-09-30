import { LoaderFunction, redirect, RouteObject } from 'react-router-dom';
import { auth, collection } from 'lib';

import AppShell from './app/app-shell';

import ChampionshipView from './app/championship';
import ChampionshipPlayersView from './app/championship-players';
import ChampionshipCreateView from './app/championship/create';
import Dashboard from './app/dashboard';
import LeaguesView from './app/domain/leagues';
import PlayersView from './app/domain/players';
import RulesView from './app/domain/rules';
import TeamsView from './app/domain/teams';
import UsersView from './app/domain/users';
import Login from './app/login';
import Logout from './app/logout';
import MatchesView from './app/matches';
import ProfileView from './app/profile';
import TipsView from './app/tips';

const rootLoader: LoaderFunction = async () => {
  // Load small users collection early and eager
  const users = await collection('users').get();

  // Auth state now sure, so check
  if (auth.currentUser === null) {
    return redirect('/login');
  }

  return {
    users,
  };
};

const appRoutes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <AppShell />,
    id: 'root',
    loader: rootLoader,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'turnier', element: <ChampionshipView /> },
      { path: 'neues-turnier', element: <ChampionshipCreateView /> },
      { path: 'mitspieler', element: <ChampionshipPlayersView /> },
      { path: 'tipps', element: <TipsView /> },
      { path: 'spiele', element: <MatchesView /> },
      { path: 'profil', element: <ProfileView /> },
      { path: 'domain/spieler', element: <PlayersView /> },
      { path: 'domain/teams', element: <TeamsView /> },
      { path: 'domain/ligen', element: <LeaguesView /> },
      { path: 'domain/regelwerke', element: <RulesView /> },
      { path: 'domain/benutzer', element: <UsersView /> },
      { path: 'logout', element: <Logout /> },
    ],
  },
];

export default appRoutes;

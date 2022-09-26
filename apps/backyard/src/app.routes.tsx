import { RouteObject } from 'react-router-dom';
import ChampionshipView from './app/championship';
import ChampionshipPlayersView from './app/championship-players';
import ChampionshipCreateView from './app/championship/create';
import Dashboard from './app/dashboard';
import LeaguesView from './app/domain/leagues';
import PlayersView from './app/domain/players';
import RulesetsView from './app/domain/rulesets';
import TeamsView from './app/domain/teams';
import UsersView from './app/domain/users';
import Layout from './app/layout';
import Login from './app/login';
import Logout from './app/logout';
import MatchesView from './app/matches';
import ProfileView from './app/profile';
import TipsView from './app/tips';

const appRoutes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
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
      { path: 'domain/regelwerke', element: <RulesetsView /> },
      { path: 'domain/benutzer', element: <UsersView /> },
      { path: 'login', element: <Login /> },
      { path: 'logout', element: <Logout /> },
    ],
  },
];

export default appRoutes;

import { Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Layout from './app/layout';
import SplashScreen from './components/splash-screen';
import Dashboard from './app/dashboard';
import ChampionshipView from './app/championship';
import ChampionshipPlayersView from './app/championship-players';
import MatchesView from './app/matches';
import Login from './app/login';
import Error from './app/error';

export default function App() {
  return (
    <Suspense fallback={<SplashScreen />}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="turnier" element={<ChampionshipView />} />
            <Route path="mitspieler" element={<ChampionshipPlayersView />} />
            <Route path="spiele" element={<MatchesView />} />
            <Route path="login" element={<Login />} />
            <Route path="*" element={<Error />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}

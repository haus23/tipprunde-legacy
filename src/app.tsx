import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Layout from './app/layout';
import Dashboard from './app/dashboard';
import Login from './app/login';
import Error from './app/error';
import { Suspense } from 'react';

export default function App() {
  return (
    <Suspense fallback={<div>Loading ...</div>}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="login" element={<Login />} />
            <Route path="*" element={<Error />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
}

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './app/dashboard';
import Layout from './app/layout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

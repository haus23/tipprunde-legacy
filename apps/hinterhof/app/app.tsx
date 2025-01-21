import { Route, Routes } from 'react-router';
import LoginRoute from './routes/login';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginRoute />} />
    </Routes>
  );
}

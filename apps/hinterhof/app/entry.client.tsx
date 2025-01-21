import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';

import App from './app';
import './styles/index.css';

const rootContainer = document.getElementById('root');

if (rootContainer) {
  createRoot(rootContainer).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
  );
}

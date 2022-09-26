import React from 'react';
import { createRoot } from 'react-dom/client';

import './app.css';
import App from '@/app-root';

const rootContainer = document.getElementById('root') as HTMLElement;
createRoot(rootContainer).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

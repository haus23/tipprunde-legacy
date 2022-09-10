import React from 'react';
import { createRoot } from 'react-dom/client';

import { RecoilRoot } from 'recoil';

import './app.css';
import App from '@/app';

const rootContainer = document.getElementById('root') as HTMLElement;
createRoot(rootContainer).render(
  <React.StrictMode>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </React.StrictMode>
);

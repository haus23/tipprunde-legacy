import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
if (!container) throw Error('Missing root element!');

createRoot(container).render(
  <StrictMode>
    <span>runde.tips</span>
  </StrictMode>,
);

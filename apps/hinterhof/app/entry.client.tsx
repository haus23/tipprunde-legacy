import { Provider } from 'jotai';
import { createRoot } from 'react-dom/client';

import App from './app';

import { initializeAuth } from './lib/firebase/auth';
import { store } from './utils/store';

import './styles/globals.css';

// Initialize firebase auth
initializeAuth();

const rootContainer = document.getElementById('root');

if (rootContainer) {
  createRoot(rootContainer).render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
}

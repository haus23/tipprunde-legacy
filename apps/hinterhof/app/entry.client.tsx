import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';

import App from './app';
import { AppProviders } from './utils/app-providers';

import { auth } from './lib/firebase/auth';
import { authAtom } from './utils/state/auth';
import { store } from './utils/store';

import './styles/index.css';

// Initialize firebase auth
auth.onAuthStateChanged((user) => {
  store.set(authAtom, { isPending: false, user });
});

const rootContainer = document.getElementById('root');

if (rootContainer) {
  createRoot(rootContainer).render(
    <BrowserRouter>
      <AppProviders>
        <App />
      </AppProviders>
    </BrowserRouter>,
  );
}

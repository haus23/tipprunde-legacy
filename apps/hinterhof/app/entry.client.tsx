import { Provider } from 'jotai';
import { createRoot } from 'react-dom/client';

import App from './app';
import { auth } from './lib/firebase/auth';
import { authAtom } from './utils/state/auth';
import { store } from './utils/store';

import './styles/index.css';

// Initialize firebase auth
auth.onAuthStateChanged((user) => {
  store.set(authAtom, { isAuthenticated: true, user });
});

const rootContainer = document.getElementById('root');

if (rootContainer) {
  createRoot(rootContainer).render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
}

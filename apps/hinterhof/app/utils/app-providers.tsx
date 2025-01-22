import { Provider } from 'jotai';
import { RouterProvider } from 'react-aria-components';
import { useNavigate } from 'react-router';
import { store } from './store';

export function AppProviders({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  return (
    <RouterProvider navigate={navigate}>
      <Provider store={store}>{children}</Provider>
    </RouterProvider>
  );
}

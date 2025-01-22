import { RouterProvider } from 'react-aria-components';
import { useNavigate } from 'react-router';

export function UiProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  return <RouterProvider navigate={navigate}>{children}</RouterProvider>;
}

import { Outlet } from 'react-router';
import { UiProvider } from '#/components/ui-provider';

export default function AppShell() {
  return (
    <UiProvider>
      <Outlet />
    </UiProvider>
  );
}

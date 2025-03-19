import { useLayout } from './app-layout';

export function AppSidebar() {
  const { isSidebarOpen } = useLayout();

  if (!isSidebarOpen) return null;

  return <div>Sidebar</div>;
}

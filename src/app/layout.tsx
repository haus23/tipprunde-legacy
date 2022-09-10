import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

import Logo from '@/components/logo';

export default function Layout() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated && location.pathname !== '/login') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  } else if (isAuthenticated && location.pathname === '/login') {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      {isAuthenticated && (
        <>
          <div className="hidden">{/* Drawer sidebar for mobile */}</div>
          <div className="hidden">{/* Static sidebar for desktop */}</div>
        </>
      )}
      {/* Content with header */}
      <div className="flex flex-col">
        {/* Toggle menu button or login header */}
        {isAuthenticated ? (
          <button className="hidden"></button>
        ) : (
          <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
            <div className="flex flex-1 justify-between px-4">
              <div className="flex items-center gap-x-2">
                <Logo className="h-10" />
                <h1 className="text-2xl font-semibold">runde.tips</h1>
              </div>
            </div>
          </div>
        )}
        {/* Content */}
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
            <div className="py-4">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

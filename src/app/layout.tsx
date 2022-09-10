import { Outlet } from 'react-router-dom';
import Logo from '@/components/logo';

export default function Layout() {
  return (
    <div>
      {/* Drawer sidebar for mobile */}
      <div className="hidden"></div>
      {/* Static sidebar for desktop */}
      <div className="hidden"></div>
      {/* Content with header */}
      <div className="flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
          {/* Toggle Button */}
          <button className="hidden"></button>
          {/* Navbar */}
          <div className="flex flex-1 justify-between px-4">
            <div className="flex items-center gap-x-2">
              <Logo className="h-10" />
              <h1 className="text-2xl font-semibold">runde.tips</h1>
            </div>
          </div>
        </div>
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

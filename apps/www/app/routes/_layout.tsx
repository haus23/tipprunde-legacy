import { Outlet } from 'react-router';

import { NavDesktop } from '#/components/nav/nav-desktop';
import { NavMobile } from '#/components/nav/nav-mobile';

export default function Layout() {
  return (
    <div>
      <header className="h-16 border-b border-b-line bg-subtle px-2 font-medium shadow-md sm:h-20 sm:px-4">
        <NavDesktop />
        <NavMobile />
      </header>
      <main className="mx-auto mt-4 max-w-5xl pb-10 sm:mt-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}

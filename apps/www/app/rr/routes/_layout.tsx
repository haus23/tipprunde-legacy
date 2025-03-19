import { RemoveScroll } from 'react-remove-scroll';
import { Outlet, ScrollRestoration } from 'react-router';

import { NavDesktop } from '#/components/nav/nav-desktop';
import { NavMobile } from '#/components/nav/nav-mobile';

import { useConvexUser } from '#/utils/auth';

export default function Layout() {
  useConvexUser();

  return (
    <>
      <header
        className={headerStyles({
          className: RemoveScroll.classNames.fullWidth,
        })}
      >
        <NavDesktop />
        <NavMobile />
      </header>
      <ScrollRestoration
        getKey={(location) => {
          return location.pathname;
        }}
      />
    </>
  );
}

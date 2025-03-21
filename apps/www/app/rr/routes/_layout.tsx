import { ScrollRestoration } from 'react-router';

import { useConvexUser } from '#/utils/auth';

export default function Layout() {
  useConvexUser();

  return (
    <>
      <ScrollRestoration
        getKey={(location) => {
          return location.pathname;
        }}
      />
    </>
  );
}

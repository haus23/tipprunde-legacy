import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Link, useMatches } from 'react-router';
import { Fragment } from 'react/jsx-runtime';

type RouteHandle = {
  title: string;
};

function hasTitle(handle: unknown): handle is RouteHandle {
  return typeof handle === 'object' && handle !== null && 'title' in handle;
}

export function Breadrumbs() {
  const matches = useMatches();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {matches.map((m, ix) => {
          if (hasTitle(m.handle)) {
            return ix !== matches.length - 1 ? (
              <Fragment key={m.id}>
                <BreadcrumbItem key={m.pathname}>
                  <BreadcrumbLink asChild>
                    <Link to={m.pathname}>{m.handle.title}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </Fragment>
            ) : (
              <BreadcrumbItem key={m.id}>
                <BreadcrumbPage>{m.handle.title}</BreadcrumbPage>
              </BreadcrumbItem>
            );
          }
          return null;
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

import { Link, useMatches } from 'react-router';
import { Fragment } from 'react/jsx-runtime';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { useChampionships } from '@/utils/state/championships';

type RouteHandle = {
  title: string;
};

function hasTitle(handle: unknown): handle is RouteHandle {
  return typeof handle === 'object' && handle !== null && 'title' in handle;
}

export function Breadrumbs() {
  const matches = useMatches();
  const { currentChampionship } = useChampionships();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {matches.map((m, ix) => {
          if (hasTitle(m.handle)) {
            const title =
              m.handle.title === '$championshipId$'
                ? currentChampionship.name
                : m.handle.title;

            return ix !== matches.length - 1 ? (
              <Fragment key={m.id}>
                <BreadcrumbItem key={m.pathname}>
                  <BreadcrumbLink asChild>
                    <Link to={m.pathname}>{title}</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
              </Fragment>
            ) : (
              <BreadcrumbItem key={m.id}>
                <BreadcrumbPage>{title}</BreadcrumbPage>
              </BreadcrumbItem>
            );
          }
          return null;
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

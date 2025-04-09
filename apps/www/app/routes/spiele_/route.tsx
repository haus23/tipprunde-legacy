import { useSuspenseQuery } from '@tanstack/react-query';
import {
  createFileRoute,
  useLoaderData,
  useNavigate,
} from '@tanstack/react-router';
import { Collection, type Key } from 'react-aria-components';
import * as v from 'valibot';

import { CheckIcon } from 'lucide-react';
import { Header } from '#/components/ui/header';
import { ListBoxItem, ListBoxSection } from '#/components/ui/listbox';
import { Select } from '#/components/ui/select';
import { matchTipsQuery, matchesQuery } from '#/utils/queries';

export const Route = createFileRoute('/spiele_')({
  validateSearch: v.object({
    nr: v.optional(v.number()),
  }),
  loaderDeps: ({ search: { nr } }) => ({ nr }),
  loader: async ({ deps: { nr }, context: { queryClient, championship } }) => {
    const matches = await queryClient.ensureQueryData(
      matchesQuery(championship.id),
    );
    const match =
      matches.matches.find((m) => m.nr === nr) || matches.matches[0];

    queryClient.prefetchQuery(matchTipsQuery(championship.id, nr ?? null));
    return { match };
  },
  component: MatchesComponent,
});

function MatchesComponent() {
  const { championship } = useLoaderData({ from: '__root__' });
  const navigate = useNavigate({ from: Route.fullPath });

  const { match } = Route.useLoaderData();
  function selectMatch(key: Key) {
    navigate({ search: (prev) => ({ ...prev, nr: Number(key) }) });
  }

  const {
    data: { matches, rounds, teams },
  } = useSuspenseQuery(matchesQuery(championship.id));

  return (
    <div>
      <Select
        aria-label="Spielauswahl"
        defaultSelectedKey={match.nr}
        onSelectionChange={selectMatch}
        items={rounds}
      >
        {(r) => (
          <ListBoxSection id={r.id}>
            <Header className="p-1 text-gray-11/75 text-sm">
              Runde {r.nr}
            </Header>
            <Collection items={matches.filter((m) => m.roundId === r.id)}>
              {(m) => (
                <ListBoxItem id={m.nr}>
                  {({ isSelected }) => (
                    <>
                      <span>
                        {`${teams[m.hometeamId]?.shortname || 'TBA'} - ${teams[m.awayteamId]?.shortname || 'TBA'}`}
                      </span>
                      {isSelected && <CheckIcon className="size-5" />}
                    </>
                  )}
                </ListBoxItem>
              )}
            </Collection>
          </ListBoxSection>
        )}
      </Select>
    </div>
  );
}

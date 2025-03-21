import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useLoaderData, useSearchParams } from 'react-router';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '#/components/(ui)/elements/select';
import { EmptyData } from '#/components/(ui)/molecules/empty-data';
import { InfoBox } from '#/components/(ui)/molecules/info-box';
import { useChampionship } from '#/utils/app/championship';
import { useMatches } from '#/utils/app/matches';
import { usePlayers } from '#/utils/app/players';
import { formatDate } from '#/utils/misc';
import type { matchesLoader } from './_route.data';
import { TipsTable } from './tips-table';

export function MatchesRoute() {
  const [searchParams, setSearchParams] = useSearchParams();

  const championship = useChampionship();
  const players = usePlayers(championship.id);
  const { leagues, matches, rounds, teams } = useMatches(championship.id);

  const loaderData = useLoaderData<ReturnType<typeof matchesLoader>>();
  if (loaderData.state === 'error') {
    return (
      <EmptyData championship={championship}>
        Noch sind keine Spiele eingetragen. Noch etwas Geduld bitte.
      </EmptyData>
    );
  }

  const { matchId, tips } = loaderData;
  const match = matches.find((m) => m.id === matchId) || matches[0];

  function handleSelect(value: string) {
    const nr = matches.find((m) => m.id === value)?.nr;
    setSearchParams(
      { ...searchParams, nr: String(nr) },
      { viewTransition: true },
    );
  }

  return (
    <div>
      <title>{`Tipps ${teams[match.hometeamId]?.shortname || 'TBA'} - ${
        teams[match.awayteamId]?.shortname || 'TBA'
      } - ${championship.name} - runde.tips`}</title>
      <header className="sticky top-0 z-10 mx-2 flex items-center gap-x-4 bg-background pt-1 pb-2 text-accent-foreground sm:mx-0 sm:gap-x-4">
        <h2 className="flex gap-x-2 font-semibold text-xl tracking-tight">
          <span className="hidden py-1 sm:block">{championship.name} -</span>
          <span className="py-1">Tipps für</span>
        </h2>
        <Select value={match.id} onValueChange={handleSelect}>
          <SelectTrigger>
            <SelectValue>
              {`${teams[match.hometeamId]?.shortname || 'TBA'} - ${teams[match.awayteamId]?.shortname || 'TBA'}`}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {rounds.map((r) => (
              <SelectGroup key={r.id}>
                <SelectLabel>Runde {r.nr}</SelectLabel>
                {matches
                  .filter((m) => m.roundId === r.id)
                  .map((m) => (
                    <SelectItem value={m.id} key={m.id}>
                      <div className="flex items-center gap-x-2">
                        <span>
                          {!teams[m.hometeamId]?.shortname &&
                          !teams[m.awayteamId]?.shortname
                            ? '(noch offen)'
                            : `${teams[m.hometeamId]?.shortname || '(noch offen)'} - ${teams[m.awayteamId]?.shortname || '(noch offen)'}`}
                        </span>
                        {m.result !== '' && (
                          <span className="font-semibold text-subtle-foreground text-xs">{`(${m.points} Pkt)`}</span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
              </SelectGroup>
            ))}
          </SelectContent>
        </Select>
      </header>
      <div className="mx-2 mt-6 max-w-3xl text-sm md:mx-auto">
        <div className="flex w-full justify-between">
          <div className="space-y-1">
            <p className="font-medium text-xs uppercase">Wann</p>
            <p className="font-semibold text-accent-foreground">
              {formatDate(match.date)}
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-xs uppercase">Wo</p>
            <p className="font-semibold text-accent-foreground">
              {leagues[match.leagueId]?.name}
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-xs uppercase">Ergebnis</p>
            <p className="font-semibold text-accent-foreground">
              {match.result}
            </p>
          </div>
          <div className="space-y-1">
            <p className="font-medium text-xs uppercase">Punkte</p>
            <p className="font-semibold text-accent-foreground">
              {match.result && match.points}
            </p>
          </div>
        </div>
        {rounds.find((r) => r.id === match.roundId)?.isDoubleRound ? (
          <div className="mt-4 flex justify-center gap-x-2 text-subtle-foreground">
            <span className="sm:hidden">
              <InfoBox icon={ExclamationTriangleIcon}>
                <div className="px-4 py-2">
                  Alle erzielten Punkte werden verdoppelt.
                </div>
              </InfoBox>
            </span>
            <span>Das Spiel läuft in einer Doppelrunde.</span>
            <span className="hidden sm:block">
              Alle erzielten Punkte werden verdoppelt.
            </span>
          </div>
        ) : null}
      </div>
      <div className="mt-6">
        <TipsTable players={players} match={match} tips={tips} />
      </div>
    </div>
  );
}

import type { Member } from '@haus23/tipprunde-model';
import { ArrowRightIcon, PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import Button from '#/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '#/components/card';
import RoundDialog from '#/components/current-data/round-dialog';
import ToggleField from '#/components/form/toggle-field';
import DataCard from '#/components/layout/data-card';
import { useChampionshipPlayers } from '#/hooks/current-data/use-championship-players';
import { useCurrentChampionship } from '#/hooks/current-data/use-current-championship';
import { roundParam } from '#/hooks/current-data/use-current-round';
import { useMatches } from '#/hooks/current-data/use-matches';
import { useRanking } from '#/hooks/current-data/use-ranking';
import { useRecalculateChampionship } from '#/hooks/current-data/use-recalculate-championship';
import { useRounds } from '#/hooks/current-data/use-rounds';
import { usePlayers } from '#/hooks/master-data/use-players';
import { focusRing } from '#/styles/focus';
import { cn } from '#/utils/cn';
import { invalidateCache } from '#/utils/invalidate-cache';
import { notify } from '#/utils/notify';

export default function ChampionshipView() {
  const { players } = usePlayers();
  const { currentChampionship, updateCurrentChampionship } =
    useCurrentChampionship();
  const { championshipPlayers, addChampionshipPlayer } =
    useChampionshipPlayers();
  const { recalculateChampionship } = useRecalculateChampionship();
  const { calculateRanking } = useRanking();
  const { rounds } = useRounds();
  const { matches } = useMatches();
  const [roundDialogOpen, setRoundDialogOpen] = useState(false);

  function togglePublishedState() {
    if (!currentChampionship) return;
    notify(
      updateCurrentChampionship({
        published: !currentChampionship.published,
      }).then(() => invalidateCache([{ type: 'championships' }])),
      `Turnier ${
        currentChampionship.published ? 'versteckt' : 'Veröffentlicht'
      }`,
    );
  }

  function toggleCompletedState() {
    if (!currentChampionship) return;
    notify(
      updateCurrentChampionship({
        completed: !currentChampionship.completed,
      }).then(() =>
        invalidateCache([
          { type: 'championships' },
          { type: 'championship', id: currentChampionship.id },
        ]),
      ),
      `Turnier ${
        currentChampionship.completed ? 'wieder geöffnet' : 'abgeschlossen'
      }`,
    );
  }

  function toggleExtraPointsPublishedState() {
    if (!currentChampionship) return;
    const extraPointsPublished = !currentChampionship.extraPointsPublished;
    const updatePublishingState = async () => {
      await updateCurrentChampionship({ extraPointsPublished });
      await calculateRanking({ includeExtraPoints: extraPointsPublished });
      await invalidateCache([
        { type: 'championships' },
        { type: 'championship', id: currentChampionship.id },
      ]);
    };
    notify(
      updatePublishingState(),
      `Zusatzpunkte ${
        currentChampionship.extraPointsPublished
          ? 'versteckt'
          : 'veröffentlicht'
      }`,
    );
  }

  const attendingPlayers = championshipPlayers
    .map((cp) => {
      const player = players.find((p) => p.id === cp.playerId) as Member;
      return { ...cp, player };
    })
    .sort((p1, p2) => p1.nr - p2.nr);

  const remainingPlayers = players.filter(
    (p) => championshipPlayers.findIndex((cp) => cp.playerId === p.id) === -1,
  );

  const hasRemainingPlayers = true;

  function addPlayer(id: string, name: string) {
    if (!currentChampionship) return;
    notify(
      addChampionshipPlayer(id).then(() =>
        invalidateCache([{ type: 'championship', id: currentChampionship.id }]),
      ),
      `${name} hinzugefügt.`,
    );
  }

  function recalculate() {
    notify(
      recalculateChampionship(),
      'Turnierwertung vollständig neu berechnet.',
      'Turnierwertung wird neu berechnet ...',
    );
  }

  return currentChampionship ? (
    <div className="mt-5 flex flex-col space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Turnier</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-start gap-y-4">
          <ToggleField
            checked={currentChampionship.published}
            onChange={togglePublishedState}
            label="Veröffentlicht"
          />
          <ToggleField
            checked={currentChampionship.completed}
            onChange={toggleCompletedState}
            label="Abgeschlossen"
          />
          <ToggleField
            checked={currentChampionship.extraPointsPublished}
            onChange={toggleExtraPointsPublishedState}
            label="Zusatzpunkte veröffentlicht"
          />
        </CardContent>
      </Card>
      <DataCard
        title="Runden"
        description="Runden des Turniers. Spiele werden einer Runde zugeordnet."
        action={
          <Button
            variant="primary"
            className="max-sm:w-9 max-sm:px-0"
            onClick={() => setRoundDialogOpen(true)}
          >
            <PlusIcon
              className="size-4 sm:mr-1.5 sm:-ml-1"
              aria-hidden="true"
            />
            <span className="max-sm:sr-only">Neue Runde</span>
          </Button>
        }
      >
        {rounds.length === 0 ? (
          <p className="px-4 py-6 text-center text-muted-foreground text-sm sm:px-6">
            Noch keine Runde angelegt.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-surface-subtle">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pr-2 pl-4 text-left font-semibold text-foreground text-sm sm:pl-6"
                  >
                    Runde
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3.5 text-right font-semibold text-foreground text-sm"
                  >
                    Spiele
                  </th>
                  <th scope="col" className="py-3.5 pr-4 pl-2 sm:pr-6">
                    <span className="sr-only">Spiele öffnen</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {rounds.map((round) => (
                  <tr key={round.id}>
                    <td className="py-3 pr-2 pl-4 text-sm sm:pl-6">
                      <span className="inline-flex items-center gap-x-2">
                        <span className="font-medium tabular-nums">
                          Runde {round.nr}
                        </span>
                        {round.isDoubleRound && (
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary text-xs">
                            Doppelte Punkte
                          </span>
                        )}
                      </span>
                    </td>
                    <td className="px-2 py-3 text-right text-muted-foreground text-sm tabular-nums">
                      {matches.filter((m) => m.roundId === round.id).length}
                    </td>
                    <td className="py-2 pr-4 pl-2 text-right sm:pr-6">
                      <Link
                        to={`../spiele?${roundParam}=${round.nr}`}
                        relative="path"
                        aria-label={`Spiele der Runde ${round.nr}`}
                        title="Spiele der Runde"
                        className={cn(
                          focusRing,
                          'inline-flex size-9 items-center justify-center rounded-md border border-input bg-secondary text-secondary-foreground shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground motion-reduce:transition-none',
                        )}
                      >
                        <ArrowRightIcon className="size-4" aria-hidden="true" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DataCard>
      <RoundDialog open={roundDialogOpen} onOpenChange={setRoundDialogOpen} />
      <Card>
        <CardHeader>
          <CardTitle>Mitspieler</CardTitle>
        </CardHeader>
        <CardContent className="flex divide-x divide-border p-2 sm:p-4">
          <div
            className={cn(
              hasRemainingPlayers
                ? 'basis-1/2 pr-2 sm:pr-4'
                : 'grow justify-self-center',
            )}
          >
            <h4 className="text-center font-medium">Wer ist dabei?</h4>
            <div className="h-full w-full overflow-y-auto">
              <ul className="relative z-0 mt-2 divide-y divide-border">
                {attendingPlayers.map((p) => (
                  <li
                    className="flex h-11 select-none items-center px-2 sm:px-4"
                    key={p.id}
                  >
                    <span className="min-w-0 truncate" title={p.player.name}>
                      {p.player.name}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {hasRemainingPlayers && (
            <div className="basis-1/2 pl-2 sm:pl-4">
              <h4 className="text-center font-medium">Wer (noch) nicht?</h4>
              <div className="h-full w-full overflow-y-auto">
                <ul className="relative z-0 mt-2 divide-y divide-border">
                  {remainingPlayers.map((p) => (
                    <li
                      className="flex h-11 select-none items-center px-2 sm:px-4"
                      key={p.id}
                    >
                      <Button
                        size="icon"
                        className="h-7 w-7 shrink-0 rounded-full"
                        onClick={() => addPlayer(p.id, p.name)}
                        aria-label={`${p.name} hinzufügen`}
                      >
                        <PlusIcon className="h-4 w-4" aria-hidden="true" />
                      </Button>
                      <span className="ml-4 min-w-0 truncate" title={p.name}>
                        {p.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Wartung</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-x-4">
          <div>
            <p className="font-medium">Turnierwertung neu berechnen</p>
            <p className="mt-1 text-muted-foreground text-sm">
              Wertet alle Spiele und Tipps neu aus und aktualisiert die
              Rangliste.
            </p>
          </div>
          <Button
            type="button"
            className="shrink-0 whitespace-nowrap"
            onClick={recalculate}
          >
            Neu berechnen
          </Button>
        </CardContent>
      </Card>
    </div>
  ) : null;
}

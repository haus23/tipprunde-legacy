import { ArrowRightIcon, PlusIcon } from 'lucide-react';
import { useId, useState } from 'react';
import { Link } from 'react-router';
import Button from '#/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '#/components/card';
import ChampionshipPlayerDialog from '#/components/current-data/championship-player-dialog';
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
import { useRules } from '#/hooks/master-data/use-rules';
import { focusRing } from '#/styles/focus';
import { cn } from '#/utils/cn';
import { invalidateCache } from '#/utils/invalidate-cache';
import { notify } from '#/utils/notify';

// A state switch with a short explanation of what it changes, indented to
// the label (switch width plus gap).
function StateToggle({
  checked,
  description,
  label,
  onChange,
}: {
  checked: boolean;
  description: string;
  label: string;
  onChange: () => void;
}) {
  const descriptionId = useId();
  return (
    <div className="space-y-1">
      <ToggleField
        checked={checked}
        onChange={onChange}
        label={label}
        aria-describedby={descriptionId}
      />
      <p id={descriptionId} className="pl-14 text-muted-foreground text-sm">
        {description}
      </p>
    </div>
  );
}

export default function ChampionshipView() {
  const { players } = usePlayers();
  const { currentChampionship, updateCurrentChampionship } =
    useCurrentChampionship();
  const { championshipPlayers } = useChampionshipPlayers();
  const { recalculateChampionship } = useRecalculateChampionship();
  const { calculateRanking } = useRanking();
  const { rounds } = useRounds();
  const { matches } = useMatches();
  const [roundDialogOpen, setRoundDialogOpen] = useState(false);
  const [playerDialogOpen, setPlayerDialogOpen] = useState(false);
  const { rules } = useRules();
  const ruleSet = rules.find(({ id }) => id === currentChampionship?.rulesId);

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
      const player = players.find((p) => p.id === cp.playerId);
      return { ...cp, player };
    })
    .sort((p1, p2) => p1.nr - p2.nr);

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
          <CardTitle>{currentChampionship.name}</CardTitle>
          <p className="mt-1 text-muted-foreground text-sm">
            {[
              currentChampionship.id,
              `Nr. ${currentChampionship.nr}`,
              ruleSet?.name,
            ]
              .filter(Boolean)
              .join(' · ')}
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          <StateToggle
            checked={currentChampionship.published}
            onChange={togglePublishedState}
            label="Veröffentlicht"
            description="Das Turnier ist auf runde.tips sichtbar."
          />
          <StateToggle
            checked={currentChampionship.extraPointsPublished}
            onChange={toggleExtraPointsPublishedState}
            label="Zusatzpunkte veröffentlicht"
            description="Zusatzpunkte sind sichtbar und zählen in Gesamtpunkten und Rangliste."
          />
          <StateToggle
            checked={currentChampionship.completed}
            onChange={toggleCompletedState}
            label="Abgeschlossen"
            description="Das Turnier ist beendet, aktuelle Tipps werden nicht mehr gezeigt."
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
                        to={`/${currentChampionship.id}/spiele?${roundParam}=${round.nr}`}
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
      <DataCard
        title="Mitspieler"
        description="Wer in diesem Turnier mittippt."
        action={
          <Button
            variant="primary"
            className="max-sm:w-9 max-sm:px-0"
            onClick={() => setPlayerDialogOpen(true)}
          >
            <PlusIcon
              className="size-4 sm:mr-1.5 sm:-ml-1"
              aria-hidden="true"
            />
            <span className="max-sm:sr-only">Mitspieler</span>
          </Button>
        }
      >
        {attendingPlayers.length === 0 ? (
          <p className="px-4 py-6 text-center text-muted-foreground text-sm sm:px-6">
            Noch keine Mitspieler.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-surface-subtle">
                <tr>
                  <th
                    scope="col"
                    className="w-12 py-3.5 pr-2 pl-4 text-right font-semibold text-foreground text-sm sm:pl-6"
                  >
                    Nr
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pr-4 pl-2 text-left font-semibold text-foreground text-sm sm:pr-6"
                  >
                    Name
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {attendingPlayers.map((p) => (
                  <tr key={p.id}>
                    <td className="py-3 pr-2 pl-4 text-right text-muted-foreground text-sm tabular-nums sm:pl-6">
                      {p.nr}
                    </td>
                    <td className="py-3 pr-4 pl-2 font-medium text-sm sm:pr-6">
                      {p.player?.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DataCard>
      <ChampionshipPlayerDialog
        open={playerDialogOpen}
        onOpenChange={setPlayerDialogOpen}
      />
      <Card>
        <CardHeader>
          <CardTitle>Wartung</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium text-sm">Turnierwertung neu berechnen</p>
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

import type { Member } from '@haus23/tipprunde-model';
import { cn } from 'cn';
import { PlusIcon } from 'lucide-react';
import Button from '#/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '#/components/card';
import ToggleField from '#/components/form/toggle-field';
import { useChampionshipPlayers } from '#/hooks/current-data/use-championship-players';
import { useCurrentChampionship } from '#/hooks/current-data/use-current-championship';
import { useRanking } from '#/hooks/current-data/use-ranking';
import { useRecalculateChampionship } from '#/hooks/current-data/use-recalculate-championship';
import { usePlayers } from '#/hooks/master-data/use-players';
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

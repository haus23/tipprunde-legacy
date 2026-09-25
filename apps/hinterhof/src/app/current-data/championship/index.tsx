import { PlusIcon } from '@heroicons/react/24/outline';
import type { Member } from 'lib';
import { Button, Card, classNames, ToggleField } from 'ui-legacy';
import { useChampionshipPlayers } from '#/hooks/current-data/use-championship-players';
import { useCurrentChampionship } from '#/hooks/current-data/use-current-championship';
import { useRecalculateChampionship } from '#/hooks/current-data/use-recalculate-championship';
import { usePlayers } from '#/hooks/master-data/use-players';
import { notify } from '#/utils/notify';

export default function ChampionshipView() {
  const { players } = usePlayers();
  const { currentChampionship, updateCurrentChampionship } =
    useCurrentChampionship();
  const { championshipPlayers, addChampionshipPlayer } =
    useChampionshipPlayers();
  const { recalculateChampionship } = useRecalculateChampionship();

  function togglePublishedState() {
    notify(
      updateCurrentChampionship({ published: !currentChampionship?.published }),
      `Turnier ${
        currentChampionship?.published ? 'versteckt' : 'Veröffentlicht'
      }`,
    );
  }

  function toggleCompletedState() {
    notify(
      updateCurrentChampionship({ completed: !currentChampionship?.completed }),
      `Turnier ${
        currentChampionship?.completed ? 'wieder geöffnet' : 'abgeschlossen'
      }`,
    );
  }

  function toggleExtraPointsPublishedState() {
    notify(
      updateCurrentChampionship({
        extraPointsPublished: !currentChampionship?.extraPointsPublished,
      }),
      `Zusatzpunkte ${
        currentChampionship?.extraPointsPublished
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

  function addPlayer(id: string) {
    addChampionshipPlayer(id);
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
        <Card.Header>Turnier</Card.Header>
        <div className="p-4">
          <ToggleField
            checked={currentChampionship.published}
            onChange={togglePublishedState}
            label="Veröffentlicht"
          />
        </div>
        <div className="p-4">
          <ToggleField
            checked={currentChampionship.completed}
            onChange={toggleCompletedState}
            label="Abgeschlossen"
          />
        </div>
        <div className="p-4">
          <ToggleField
            checked={currentChampionship.extraPointsPublished}
            onChange={toggleExtraPointsPublishedState}
            label="Zusatzpunkte veröffentlicht"
          />
        </div>
      </Card>
      <Card>
        <Card.Header>Mitspieler</Card.Header>
        <div className="flex gap-x-2 divide-x divide-gray-200 p-2 sm:gap-x-4 sm:p-4">
          <div
            className={classNames(
              hasRemainingPlayers ? 'basis-1/2' : 'grow justify-self-center',
            )}
          >
            <h4 className="text-center font-medium">Wer ist dabei?</h4>
            <div className="h-full w-full overflow-y-auto">
              <ul className="relative z-0 mt-2 divide-y divide-gray-200">
                {attendingPlayers.map((p) => (
                  <li
                    className="flex select-none items-center px-2 py-2 sm:px-4"
                    key={p.id}
                  >
                    <span className="mr-4">{p.player.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {hasRemainingPlayers && (
            <div className="basis-1/2 pl-2 sm:pl-4">
              <h4 className="text-center font-medium">Wer (noch) nicht?</h4>
              <div className="h-full w-full overflow-y-auto">
                <ul className="relative z-0 mt-2 divide-y divide-gray-200">
                  {remainingPlayers.map((p) => (
                    <li
                      className="flex select-none items-center px-2 py-2 sm:px-4"
                      key={p.id}
                    >
                      <button
                        type="button"
                        onClick={() => addPlayer(p.id)}
                        className="rounded-full bg-white p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        <PlusIcon className="h-4 w-4" />
                      </button>
                      <span className="ml-4">{p.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </Card>
      <Card>
        <Card.Header>Wartung</Card.Header>
        <div className="flex items-center justify-between gap-x-4 p-4">
          <div>
            <p className="font-medium">Turnierwertung neu berechnen</p>
            <p className="mt-1 text-gray-500 text-sm">
              Wertet alle Spiele und Tipps neu aus und aktualisiert die
              Rangliste.
            </p>
          </div>
          <Button type="button" onClick={recalculate}>
            Neu berechnen
          </Button>
        </div>
      </Card>
    </div>
  ) : null;
}

import { useCurrentChampionship } from '@/hooks/use-current-championship';
import { notify } from '@/utils/notify';
import { Card } from 'ui';
import ToggleField from 'ui/src/components/form/toggle-field';

export default function ChampionshipView() {
  const { currentChampionship, updateCurrentChampionship } =
    useCurrentChampionship();

  function togglePublishedState() {
    notify(
      updateCurrentChampionship({ published: !currentChampionship?.published }),
      `Turnier ${
        currentChampionship?.published ? 'versteckt' : 'Veröffentlicht'
      }`
    );
  }

  return currentChampionship ? (
    <div>
      <h2 className="text-2xl font-semibold">{currentChampionship.name}</h2>
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
        </Card>
        <Card>
          <Card.Header>Mitspieler</Card.Header>
        </Card>
      </div>
    </div>
  ) : null;
}

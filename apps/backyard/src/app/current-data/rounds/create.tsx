import { useNavigate } from 'react-router-dom';
import { Card } from 'ui';

// TODO: move to ui pacakge
import Button from '@/components/button';
import { useRounds } from '@/hooks/current-data/use-rounds';
import { notify } from '@/utils/notify';

export default function RoundCreateView() {
  const navigate = useNavigate();
  const { rounds, createRound } = useRounds();

  const nr =
    rounds.reduce(
      (nextNr, round) => (round.nr > nextNr ? round.nr : nextNr),
      0
    ) + 1;

  const create = () => {
    notify(createRound(nr), `Runde ${nr} angelegt`);
    navigate('../runden');
  };

  return (
    <div className="mt-5">
      <Card>
        <Card.Header>Neue Runde</Card.Header>
        <div className="flex p-4 items-center justify-between">
          <h2 className="text-lg pl-2 font-semibold">Runde {nr}</h2>
          <Button primary onClick={create}>
            Anlegen
          </Button>
        </div>
      </Card>
    </div>
  );
}

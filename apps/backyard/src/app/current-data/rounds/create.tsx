import { useNavigate } from 'react-router-dom';
import { Card } from 'ui';

// TODO: move to ui pacakge
import Button from '@/components/button';

export default function RoundCreateView() {
  const navigate = useNavigate();

  const nextNr = 1;

  const createRound = async () => {
    navigate('../spiele');
  };

  return (
    <div className="mt-5">
      <Card>
        <Card.Header>Neue Runde</Card.Header>
        <div className="flex max-w-2xl p-4 items-center justify-between">
          <h2 className="text-lg pl-2 font-semibold">Runde {nextNr}</h2>
          <Button primary onClick={createRound}>
            Anlegen
          </Button>
        </div>
      </Card>
    </div>
  );
}

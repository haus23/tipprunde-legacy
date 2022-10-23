import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from 'ui';

import { useRounds } from '@/hooks/current-data/use-rounds';
import { notify } from '@/utils/notify';

export default function CreateRoundView() {
  const navigate = useNavigate();
  const { rounds, createRound } = useRounds();

  const nr = useRef((rounds.at(-1)?.nr || 0) + 1);

  const create = async () => {
    await notify(createRound(nr.current), `Runde ${nr.current} angelegt`);
    navigate('../spiele');
  };

  return (
    <div className="mt-5">
      <Card>
        <Card.Header>Neue Runde</Card.Header>
        <div className="flex p-4 items-center justify-between">
          <h2 className="text-lg pl-2 font-semibold">Runde {nr.current}</h2>
          <Button primary onClick={create}>
            Anlegen
          </Button>
        </div>
      </Card>
    </div>
  );
}

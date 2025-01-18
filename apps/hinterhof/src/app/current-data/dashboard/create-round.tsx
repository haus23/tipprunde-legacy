import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, ToggleField } from 'ui-legacy';

import { useRounds } from '@/hooks/current-data/use-rounds';
import { notify } from '@/utils/notify';

export default function CreateRoundView() {
  const navigate = useNavigate();
  const { rounds, createRound } = useRounds();
  const [doubleRound, setDoubleRound] = useState(false);

  const nr = useRef((rounds.at(-1)?.nr || 0) + 1);

  const create = async () => {
    await notify(
      createRound(nr.current, doubleRound),
      `Runde ${nr.current} angelegt`,
    );
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
        <div className="flex p-4 items-center gap-x-4">
          <span className="text-base pl-2 font-semibold">
            Doppel-Punkte Runde:
          </span>
          <ToggleField
            checked={doubleRound}
            onChange={() => setDoubleRound(!doubleRound)}
          />
        </div>
      </Card>
    </div>
  );
}

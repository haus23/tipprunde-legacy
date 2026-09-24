import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Card, ToggleField } from 'ui-legacy';

import { useRounds } from '#/hooks/current-data/use-rounds';
import { notify } from '#/utils/notify';

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
        <div className="flex items-center justify-between p-4">
          <h2 className="pl-2 font-semibold text-lg">Runde {nr.current}</h2>
          <Button primary onClick={create}>
            Anlegen
          </Button>
        </div>
        <div className="flex items-center gap-x-4 p-4">
          <span className="pl-2 font-semibold text-base">
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

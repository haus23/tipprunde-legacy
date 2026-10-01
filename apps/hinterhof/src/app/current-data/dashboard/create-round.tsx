import { useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { ToggleField } from 'ui-legacy';

import Button from '#/components/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '#/components/card';
import { useCurrentChampionship } from '#/hooks/current-data/use-current-championship';
import { useRounds } from '#/hooks/current-data/use-rounds';
import { invalidateCache } from '#/utils/invalidate-cache';
import { notify } from '#/utils/notify';

export default function CreateRoundView() {
  const navigate = useNavigate();
  const { currentChampionship } = useCurrentChampionship();
  const { rounds, createRound } = useRounds();
  const [doubleRound, setDoubleRound] = useState(false);

  const nr = useRef((rounds.at(-1)?.nr || 0) + 1);

  const create = async () => {
    if (!currentChampionship) return;
    await notify(
      createRound(nr.current, doubleRound).then(() =>
        invalidateCache([{ type: 'championship', id: currentChampionship.id }]),
      ),
      `Runde ${nr.current} angelegt`,
    );
    navigate('../spiele');
  };

  return (
    <div className="mt-5">
      <Card>
        <CardHeader>
          <CardTitle>Neue Runde</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <h2 className="font-semibold text-lg">Runde {nr.current}</h2>
          <div className="flex items-center gap-x-4">
            <span className="font-semibold text-base">
              Doppel-Punkte Runde:
            </span>
            <ToggleField
              checked={doubleRound}
              onChange={() => setDoubleRound(!doubleRound)}
            />
          </div>
        </CardContent>
        <CardFooter className="justify-end">
          <Button variant="primary" onClick={create}>
            Anlegen
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

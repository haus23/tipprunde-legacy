import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heading } from '@/components/ui/heading';
import { Switch } from '@/components/ui/switch';
import { useChampionship } from '@/utils/state/current-championship/championship';
import { useRounds } from '@/utils/state/current-championship/rounds';
import { useNavigate } from 'react-router';

function CreateMatchRoute() {
  const navigate = useNavigate();
  const { championship } = useChampionship();
  const { rounds, createRound } = useRounds();

  const nextNr = (rounds.at(-1)?.nr || 0) + 1;

  async function handleAction(formData: FormData) {
    const isDoubleRound = String(formData.get('isDoubleRound')) === 'on';
    await createRound(nextNr, isDoubleRound);
    navigate('../spiele');
  }

  return (
    <div>
      <header className="flex items-center justify-between">
        <Heading className="grow">{championship.name} - Neue Runde</Heading>
      </header>
      <Card className="mt-4 pt-4">
        <CardContent>
          <form action={handleAction} className="flex flex-col gap-y-4">
            <span className="font-semibold text-xl">Runde {nextNr}</span>
            <div className="flex items-center gap-x-4">
              <label htmlFor="doubleRound">Doppel-Punkte Runde:</label>
              <Switch id="doubleRound" name="isDoubleRound" />
            </div>
            <div>
              <Button type="submit">Anlegen</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export { CreateMatchRoute as Component };

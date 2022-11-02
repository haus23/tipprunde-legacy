import Card from '@/components/container/card';
import { useNavigate } from 'react-router-dom';
import { Button } from 'ui';

export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="h-full flex flex-col justify-center px-4">
      <Card>
        <div className="flex flex-col gap-y-4">
          <h2 className="px-4 text-3xl font-semibold text-red-500">Hoppla!</h2>
          <hr />
          <div className="px-4 text-lg">
            <p>
              Hier lief was schief. Sag uns Bescheid und wir versuchen den
              Fehler zu finden.
            </p>
          </div>
          <div className="text-center">
            <Button onClick={() => navigate('/')}>Zur Startseite</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

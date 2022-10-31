import { useCallback, useEffect, useReducer } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'ui';

export default function ErrorPage() {
  const [countdown, signal] = useReducer((count) => count - 1, 5);

  const navigate = useNavigate();

  const goHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    const timer = setInterval(() => signal(), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      goHome();
    }
  }, [countdown, goHome]);

  return (
    <div className="h-full flex flex-col justify-center mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-y-4 rounded-md bg-white p-4 shadow-md">
        <h2 className="px-4 text-3xl font-semibold text-red-500">Hoppla!</h2>
        <hr />
        <div className="px-4 text-lg">
          <p>
            Hier lief was schief. Sag uns Bescheid und wir versuchen den Fehler
            zu finden.
          </p>
          <p>Oder hast du aus Versehen ein falsches Turnier eingegeben?</p>
        </div>
        <div className="text-center">
          <Button onClick={goHome}>Zur Startseite ({countdown})</Button>
        </div>
      </div>
    </div>
  );
}

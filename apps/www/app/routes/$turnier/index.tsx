import { createFileRoute } from '@tanstack/react-router';
import { useChampionship } from '#/utils/app/championship';

export const Route = createFileRoute('/$turnier/')({
  component: RouteComponent,
});

function RouteComponent() {
  const championship = useChampionship();
  return <h2>{championship.name}</h2>;
}

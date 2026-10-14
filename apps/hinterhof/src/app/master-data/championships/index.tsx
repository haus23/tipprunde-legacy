import { ArrowRightIcon, PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import Button from '#/components/button';
import ChampionshipStatus from '#/components/championship-status';
import DataCard from '#/components/layout/data-card';
import ChampionshipDialog from '#/components/master-data/championship-dialog';
import { useChampionships } from '#/hooks/master-data/use-championships';
import { focusRing } from '#/styles/focus';
import { cn } from '#/utils/cn';

export default function ChampionshipsView() {
  const { championships } = useChampionships();
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="mt-5">
      <DataCard
        title="Turniere"
        description="Turniere anlegen und öffnen. Bearbeitet wird ein Turnier auf seiner Turnierseite."
        action={
          <Button
            variant="primary"
            className="max-sm:w-9 max-sm:px-0"
            onClick={() => setDialogOpen(true)}
          >
            <PlusIcon
              className="size-4 sm:mr-1.5 sm:-ml-1"
              aria-hidden="true"
            />
            <span className="max-sm:sr-only">Neues Turnier</span>
          </Button>
        }
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-surface-subtle">
              <tr>
                <th
                  scope="col"
                  className="w-12 py-3.5 pr-2 pl-4 text-right font-semibold text-foreground text-sm sm:pl-6"
                >
                  Nr
                </th>
                <th
                  scope="col"
                  className="px-2 py-3.5 text-left font-semibold text-foreground text-sm"
                >
                  Name
                </th>
                <th
                  scope="col"
                  className="hidden px-2 py-3.5 text-left font-semibold text-foreground text-sm sm:table-cell"
                >
                  Kennung
                </th>
                <th scope="col" className="py-3.5 pr-4 pl-2 sm:pr-6">
                  <span className="sr-only">Öffnen</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {championships.map((championship) => (
                <tr key={championship.id}>
                  <td className="whitespace-nowrap py-4 pr-2 pl-4 text-right text-muted-foreground text-sm tabular-nums sm:pl-6">
                    {championship.nr}
                  </td>
                  <td className="px-2 py-4 text-muted-foreground text-sm">
                    <span className="inline-flex items-center gap-x-2">
                      {championship.name}
                      <ChampionshipStatus championship={championship} />
                    </span>
                  </td>
                  <td className="hidden whitespace-nowrap px-2 py-4 text-muted-foreground text-sm sm:table-cell">
                    {championship.id}
                  </td>
                  <td className="py-2 pr-4 pl-2 text-right sm:pr-6">
                    <Link
                      to={`/${championship.id}`}
                      aria-label={`${championship.name} öffnen`}
                      title="Turnier öffnen"
                      className={cn(
                        focusRing,
                        'inline-flex size-9 items-center justify-center rounded-md border border-input bg-secondary text-secondary-foreground shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground motion-reduce:transition-none',
                      )}
                    >
                      <ArrowRightIcon className="size-4" aria-hidden="true" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DataCard>
      <ChampionshipDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSaved={(championship) => navigate(`/${championship.id}`)}
      />
    </div>
  );
}

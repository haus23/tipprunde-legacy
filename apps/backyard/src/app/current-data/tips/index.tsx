import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { ClipboardIcon } from '@heroicons/react/24/outline';

import { Button, Card, classNames, Select, TextField } from 'ui';
import { Player, Team, Tip } from 'lib';

import AppCard from '@/components/layout/app-card';

import { useRounds } from '@/hooks/current-data/use-rounds';
import { useChampionshipPlayers } from '@/hooks/current-data/use-championship-players';
import { usePlayers } from '@/hooks/master-data/use-players';
import { useTeams } from '@/hooks/master-data/use-teams';
import { useMatches } from '@/hooks/current-data/use-matches';
import { useTips } from '@/hooks/current-data/use-tips';
import { notify } from '@/utils/notify';

type TipData = { id: string; tip: string; joker: boolean };

type TipsFormProps = {
  tips: TipData[];
};

export default function TipsView() {
  const { rounds } = useRounds();
  const [currentRound, setCurrentRound] = useState(rounds[rounds.length - 1]);

  const { players: masterPlayers } = usePlayers();
  const { championshipPlayers } = useChampionshipPlayers();

  const players = useMemo(() => {
    const playersHash = masterPlayers.reduce(
      (hash, player) => ({ ...hash, [player.id]: player }),
      {} as Record<string, Player>
    );
    return championshipPlayers
      .map((cp) => ({
        ...cp,
        name: playersHash[cp.playerId].name,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [masterPlayers, championshipPlayers]);

  const { teams } = useTeams();
  const { matches } = useMatches();

  const fixtures = useMemo(() => {
    const teamsHash = teams.reduce(
      (hash, team) => ({ ...hash, [team.id]: team }),
      {} as Record<string, Team>
    );
    return matches.map((m) => ({
      ...m,
      hometeam: teamsHash[m.hometeamId],
      awayteam: teamsHash[m.awayteamId],
    }));
  }, [teams, matches]);

  const [player, setPlayer] = useState(players[0]);

  const { control, handleSubmit, register, reset, setValue } =
    useForm<TipsFormProps>({
      defaultValues: {
        tips: new Array(matches.length).fill({ id: '', tip: '', joker: false }),
      },
    });

  const { tips, createTip, updateTip } = useTips();

  useEffect(() => {
    const tipsByPlayer = matches.map((m) => {
      // Existing Tip?
      const t = tips.find(
        (t) => t.matchId === m.id && t.playerId === player.id
      );
      let tipFormData: TipData;
      if (t) {
        tipFormData = { id: t.id, tip: t.tip, joker: t.joker };
      } else {
        tipFormData = { id: '', tip: '', joker: false };
      }
      return tipFormData;
    });
    reset({ tips: tipsByPlayer });
  }, [matches, player, tips, reset]);

  const saveResults = (data: TipsFormProps) => {
    const saveOperations = matches.reduce((promises, m, ix) => {
      if (m.roundId === currentRound.id) {
        const t = data.tips[ix];
        const tip: Tip = {
          id: t.id,
          playerId: player.id,
          matchId: m.id,
          tip: t.tip.trim(),
          joker: t.joker,
          points: 0,
        };
        if (tip.id) {
          promises.push(updateTip(tip));
        } else {
          promises.push(createTip(tip));
        }
      }
      return promises;
    }, [] as Promise<void>[]);

    notify(
      Promise.all(saveOperations),
      `Tipps für ${player.name} gespeichert.`
    );
  };

  const { fields } = useFieldArray({ control, name: 'tips' });

  // Handling copy/paste from clipboard
  const handleClipboardData = useCallback(
    async (ev?: ClipboardEvent) => {
      let inputFieldIx = 0;
      let pastedText;
      if (ev) {
        ev.preventDefault();
        // Get index of paste target
        if (
          ev.target instanceof HTMLInputElement &&
          ev.target.type === 'text'
        ) {
          const inputFields = ev.target
            .closest('tbody')
            ?.querySelectorAll('input[type=text]') as NodeList;
          const fieldIx = [...inputFields].findIndex(
            (elt) => elt === ev.target
          );
          if (fieldIx !== -1) {
            inputFieldIx = fieldIx;
          }
        }
        pastedText = ev.clipboardData?.getData('text');
      } else {
        pastedText = await navigator.clipboard.readText();
      }

      if (pastedText) {
        const tips = pastedText.split(/\r?\n/);
        let tipIx = 0;
        let fieldIx = 0;
        matches.forEach((m, ix) => {
          if (m.roundId === currentRound.id && fieldIx >= inputFieldIx) {
            let t = tips.at(tipIx++);
            if (typeof t !== 'undefined') {
              t = t.trim().replace(/[-\.]+/, ':');
              setValue(`tips.${ix}.tip`, t);
            }
          }
          fieldIx++;
        });
      }
    },
    [setValue, matches, currentRound]
  );

  useEffect(() => {
    document.addEventListener('paste', handleClipboardData);
    return () => document.removeEventListener('paste', handleClipboardData);
  }, [handleClipboardData]);

  return (
    <div className="mt-5 space-y-8">
      <Card>
        <div className="flex items-center border-b border-gray-200 font-semibold px-2 sm:px-4 gap-x-4 sm:gap-x-8">
          <span>Runde</span>
          <nav
            className="-mb-px flex items-center justify-around"
            aria-label="Tabs"
          >
            {rounds.map((round) => (
              <button
                key={round.id}
                onClick={() => setCurrentRound(round)}
                className={classNames(
                  round === currentRound
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'whitespace-nowrap py-4 px-4 md:px-6 border-b-2 font-medium text-sm'
                )}
              >
                {round.nr}
              </button>
            ))}
          </nav>
        </div>
        <div className="py-4 px-4">
          <h3 className="font-semibold flex items-center gap-x-4">
            <span>Tipps von</span>
            <div className="grow">
              <Select
                options={players}
                selected={player}
                onChange={setPlayer}
              />
            </div>
          </h3>
        </div>
      </Card>
      <AppCard>
        <form onSubmit={handleSubmit(saveResults)}>
          <div className="overflow-x-auto overflow-y-hidden">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="pl-4 pr-2 py-3.5 w-12 text-right text-sm font-semibold text-gray-900"
                  >
                    Nr
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900 sm:pr-6 lg:pr-8"
                  >
                    Spiel
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3.5 text-left text-sm font-semibold text-gray-900 sm:pr-6 lg:pr-8"
                  >
                    <div className="flex items-center gap-x-2">
                      <span>Tipp</span>
                      <button
                        type="button"
                        onClick={() => handleClipboardData()}
                      >
                        <ClipboardIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="py-3.5 pl-2 text-sm font-semibold text-gray-900 sm:pl-6 lg:pl-8"
                  >
                    Joker
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white pr-1">
                {fields.map((field, ix) =>
                  fixtures[ix].roundId === currentRound.id ? (
                    <tr key={field.id}>
                      <td className="whitespace-nowrap text-right pl-4 pr-2 py-4 text-sm text-gray-500">
                        {fixtures[ix].nr}
                      </td>
                      <td className="whitespace-nowrap py-4 pl-2 pr-4 text-sm text-gray-500 sm:pr-6 lg:pr-8">
                        <span className="hidden lg:inline">
                          {`${fixtures[ix].hometeam?.name || ''} - ${
                            fixtures[ix].awayteam?.name || ''
                          }`.replace(/^ - $/, '')}
                        </span>
                        <span className="lg:hidden">
                          {`${fixtures[ix].hometeam?.shortname || ''} - ${
                            fixtures[ix].awayteam?.shortname || ''
                          }`.replace(/^ - $/, '')}
                        </span>
                      </td>
                      <td className="text-center w-20">
                        <TextField
                          control={control}
                          name={`tips.${ix}.tip`}
                          registerOptions={{
                            pattern: {
                              value: /\b\d{1,2}:\d{1,2}\b/,
                              message: 'Ungültiger Tipp.',
                            },
                          }}
                          label=""
                        />
                      </td>
                      <td className="text-center w-20 pl-2 sm:pl-6 lg:pl-8">
                        <input
                          type="checkbox"
                          {...register(`tips.${ix}.joker`)}
                          className="form-checkbox h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>
                    </tr>
                  ) : null
                )}
                <tr>
                  <td colSpan={4} className="text-right pr-4 py-2">
                    <Button type="submit" primary>
                      Speichern
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </form>
      </AppCard>
    </div>
  );
}

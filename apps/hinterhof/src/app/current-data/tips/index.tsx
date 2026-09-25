import { ClipboardIcon } from '@heroicons/react/24/outline';
import type { Member, Team, Tip } from 'lib';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Button, Card, classNames, Select, TextField } from 'ui-legacy';

import AppCard from '#/components/layout/app-card';

import { useChampionshipPlayers } from '#/hooks/current-data/use-championship-players';
import { useMatches } from '#/hooks/current-data/use-matches';
import { useRanking } from '#/hooks/current-data/use-ranking';
import { useRounds } from '#/hooks/current-data/use-rounds';
import { useTips } from '#/hooks/current-data/use-tips';
import { usePlayers } from '#/hooks/master-data/use-players';
import { useTeams } from '#/hooks/master-data/use-teams';
import { notify } from '#/utils/notify';

type TipData = { tipId?: string; tip: string; joker: boolean };

type TipsFormProps = {
  tips: TipData[];
};

export default function TipsView() {
  const { rounds } = useRounds();
  const [currentRound, setCurrentRound] = useState(rounds[rounds.length - 1]);

  const { players: masterPlayers } = usePlayers();
  const { championshipPlayers } = useChampionshipPlayers();
  const { calculateRanking } = useRanking();

  const players = useMemo(() => {
    const playersHash = Object.fromEntries(
      masterPlayers.map((player) => [player.id, player]),
    ) as Record<string, Member>;
    return championshipPlayers
      .map((cp) => ({
        ...cp,
        name: playersHash[cp.playerId].name,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [masterPlayers, championshipPlayers]);

  const { teams } = useTeams();
  const { matches, updateMatchResult } = useMatches();

  const fixtures = useMemo(() => {
    const teamsHash = Object.fromEntries(
      teams.map((team) => [team.id, team]),
    ) as Record<string, Team>;
    return matches.map((m) => ({
      ...m,
      hometeam: teamsHash[m.hometeamId],
      awayteam: teamsHash[m.awayteamId],
    }));
  }, [teams, matches]);

  const [player, setPlayer] = useState(players[0]);

  const {
    control,
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { dirtyFields },
  } = useForm<TipsFormProps>({
    defaultValues: {
      tips: new Array(matches.length).fill({ tip: '', joker: false }),
    },
  });

  const { tips, createTip, updateTip } = useTips();

  useEffect(() => {
    const tipsByPlayer = matches.map((m) => {
      // Existing Tip?
      const t = tips.find(
        (t) => t.matchId === m.id && t.playerId === player.id,
      );
      let tipFormData: TipData;
      if (t) {
        tipFormData = { tipId: t.id, tip: t.tip, joker: t.joker };
      } else {
        tipFormData = { tip: '', joker: false };
      }
      return tipFormData;
    });
    reset({ tips: tipsByPlayer });
  }, [matches, player, tips, reset]);

  const saveResults = async (data: TipsFormProps) => {
    const saveOperations = matches.flatMap((match, index) => {
      const dirtyTip = dirtyFields.tips?.[index];
      if (
        match.roundId !== currentRound.id ||
        (!dirtyTip?.tip && !dirtyTip?.joker)
      ) {
        return [];
      }

      const formTip = data.tips[index];
      const tip: Omit<Tip, 'id'> = {
        playerId: player.id,
        matchId: match.id,
        tip: formTip.tip.trim(),
        joker: formTip.joker,
      };
      return [
        formTip.tipId
          ? updateTip({ ...tip, id: formTip.tipId })
          : createTip(tip),
      ];
    });

    const savedTips = await notify(
      Promise.all(saveOperations),
      `Tipps für ${player.name} gespeichert.`,
    );
    const affectedMatchIds = new Set(savedTips.map((tip) => tip.matchId));
    const affectedMatches = matches.filter(
      (match) => affectedMatchIds.has(match.id) && match.result.length > 0,
    );

    if (affectedMatches.length === 0) return;

    const calculations = await notify(
      Promise.all(
        affectedMatches.map((match) =>
          updateMatchResult(match, match.result, savedTips),
        ),
      ),
      'Betroffene Spiele neu berechnet.',
    );
    await notify(
      calculateRanking([
        ...savedTips,
        ...calculations.flatMap(({ tips }) => tips),
      ]),
      'Tabelle neu berechnet',
    );
  };

  const { fields } = useFieldArray({ control, name: 'tips' });

  // Handling copy/paste from clipboard
  const handleClipboardData = useCallback(
    async (ev?: ClipboardEvent) => {
      let inputFieldIx = 0;
      let pastedText: string;
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
          const fieldIx = [...inputFields].indexOf(ev.target as Node);
          if (fieldIx !== -1) {
            inputFieldIx = fieldIx;
          }
        }
        pastedText = ev.clipboardData?.getData('text') ?? '';
      } else {
        pastedText = await navigator.clipboard.readText();
      }

      if (pastedText) {
        const tips = pastedText.split(/\r?\n/);
        let tipIx = 0;
        let fieldIx = 0;
        matches.forEach((m, ix) => {
          if (m.roundId === currentRound.id && fieldIx++ >= inputFieldIx) {
            let t = tips.at(tipIx++);
            if (typeof t !== 'undefined') {
              t = t.trim().replace(/[-.]+/, ':');
              setValue(`tips.${ix}.tip`, t, { shouldDirty: true });
            }
          }
        });
      }
    },
    [setValue, matches, currentRound],
  );

  useEffect(() => {
    document.addEventListener('paste', handleClipboardData);
    return () => document.removeEventListener('paste', handleClipboardData);
  }, [handleClipboardData]);

  return (
    <div className="mt-5 space-y-8">
      <Card>
        <div className="flex items-center gap-x-4 border-gray-200 border-b px-2 font-semibold sm:gap-x-8 sm:px-4">
          <span>Runde</span>
          <nav
            className="-mb-px flex items-center justify-around"
            aria-label="Tabs"
          >
            {rounds.map((round) => (
              <button
                type="button"
                key={round.id}
                onClick={() => setCurrentRound(round)}
                className={classNames(
                  round === currentRound
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                  'whitespace-nowrap border-b-2 px-4 py-4 font-medium text-sm md:px-6',
                )}
              >
                {round.nr}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-x-4 px-4 py-4">
          <span className="font-semibold">Tipps von</span>
          <div className="grow">
            <Select options={players} selected={player} onChange={setPlayer} />
          </div>
        </div>
      </Card>
      <AppCard>
        <form onSubmit={handleSubmit(saveResults)}>
          <div className="flex justify-end border-gray-200 border-b px-4 py-3">
            <Button type="submit" primary={true}>
              Speichern
            </Button>
          </div>
          <div className="overflow-x-auto overflow-y-hidden pb-4">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="w-12 py-3.5 pr-2 pl-4 text-right font-semibold text-gray-900 text-sm"
                  >
                    Nr
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3.5 text-left font-semibold text-gray-900 text-sm sm:pr-6 lg:pr-8"
                  >
                    Spiel
                  </th>
                  <th
                    scope="col"
                    className="px-2 py-3.5 text-left font-semibold text-gray-900 text-sm sm:pr-6 lg:pr-8"
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
                    className="py-3.5 pl-2 font-semibold text-gray-900 text-sm sm:pl-6 lg:pl-8"
                  >
                    Joker
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white pr-1">
                {fields.map((field, ix) =>
                  fixtures[ix].roundId === currentRound.id ? (
                    <tr key={field.id}>
                      <td className="whitespace-nowrap py-4 pr-2 pl-4 text-right text-gray-500 text-sm">
                        {fixtures[ix].nr}
                      </td>
                      <td className="whitespace-nowrap py-4 pr-4 pl-2 text-gray-500 text-sm sm:pr-6 lg:pr-8">
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
                      <td className="w-20 text-center">
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
                      <td className="w-20 pl-2 text-center sm:pl-6 lg:pl-8">
                        <input
                          type="checkbox"
                          {...register(`tips.${ix}.joker`)}
                          className="form-checkbox h-4 w-4 rounded-sm border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </td>
                    </tr>
                  ) : null,
                )}
              </tbody>
            </table>
          </div>
        </form>
      </AppCard>
    </div>
  );
}

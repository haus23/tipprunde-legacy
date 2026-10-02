import type { Member, Team, Tip } from '@haus23/tipprunde-model';
import { CheckIcon, ClipboardIcon } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import Button from '#/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '#/components/card';
import Select from '#/components/form/select';
import TextField from '#/components/form/text-field';
import RoundTabs from '#/components/round-tabs';
import { useChampionshipPlayers } from '#/hooks/current-data/use-championship-players';
import { useCurrentChampionship } from '#/hooks/current-data/use-current-championship';
import { useMatches } from '#/hooks/current-data/use-matches';
import { useRanking } from '#/hooks/current-data/use-ranking';
import { useRounds } from '#/hooks/current-data/use-rounds';
import { useTips } from '#/hooks/current-data/use-tips';
import { usePlayers } from '#/hooks/master-data/use-players';
import { useTeams } from '#/hooks/master-data/use-teams';
import { invalidateCache } from '#/utils/invalidate-cache';
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
  const { currentChampionship } = useCurrentChampionship();
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
    formState: { dirtyFields, errors },
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
    if (!currentChampionship) return;

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

    const saveTips = async () => {
      const savedTips = await Promise.all(saveOperations);
      const affectedMatchIds = new Set(savedTips.map((tip) => tip.matchId));
      const affectedMatches = matches.filter(
        (match) => affectedMatchIds.has(match.id) && match.result.length > 0,
      );

      if (affectedMatches.length > 0) {
        const calculations = await Promise.all(
          affectedMatches.map((match) =>
            updateMatchResult(match, match.result, savedTips),
          ),
        );
        await calculateRanking({
          tips: [...savedTips, ...calculations.flatMap(({ tips }) => tips)],
        });
      }

      await invalidateCache([
        { type: 'championship', id: currentChampionship.id },
      ]);
    };

    await notify(
      saveTips(),
      `Tipps für ${player.name} gespeichert.`,
      'Tipps werden gespeichert und berechnet ...',
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
        <RoundTabs
          rounds={rounds}
          value={currentRound?.id}
          onValueChange={setCurrentRound}
        />
        <CardContent className="flex items-center gap-x-4">
          <span className="shrink-0 font-semibold">Tipps von</span>
          <div className="min-w-0 grow">
            <Select
              aria-label="Mitspieler"
              options={players}
              value={player.id}
              onValueChange={(playerId) => {
                const selectedPlayer = players.find(
                  ({ id }) => id === playerId,
                );
                if (selectedPlayer) setPlayer(selectedPlayer);
              }}
            />
          </div>
        </CardContent>
      </Card>
      <form onSubmit={handleSubmit(saveResults)}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle>Tipps</CardTitle>
              <p className="mt-1 text-muted-foreground text-sm">
                Tipps und Joker für den ausgewählten Mitspieler erfassen.
              </p>
            </div>
            <Button variant="primary" type="submit">
              Speichern
            </Button>
          </CardHeader>
          <CardContent className="p-0 sm:p-0">
            <div className="overflow-x-auto pb-4">
              <table className="min-w-full divide-y divide-border">
                <thead className="bg-surface-subtle">
                  <tr>
                    <th
                      scope="col"
                      className="w-12 py-3.5 pr-2 pl-4 text-right font-semibold text-foreground text-sm"
                    >
                      Nr
                    </th>
                    <th
                      scope="col"
                      className="px-2 py-3.5 text-left font-semibold text-foreground text-sm sm:pr-6 lg:pr-8"
                    >
                      Spiel
                    </th>
                    <th
                      scope="col"
                      className="px-2 py-3.5 text-left font-semibold text-foreground text-sm sm:pr-6 lg:pr-8"
                    >
                      <div className="flex items-center gap-x-2">
                        <span>Tipp</span>
                        <Button
                          size="icon"
                          className="h-7 w-7 border-transparent bg-transparent shadow-none"
                          onClick={() => handleClipboardData()}
                          aria-label="Tipps aus der Zwischenablage einfügen"
                          title="Tipps aus der Zwischenablage einfügen"
                        >
                          <ClipboardIcon
                            className="h-4 w-4"
                            aria-hidden="true"
                          />
                        </Button>
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pl-2 font-semibold text-foreground text-sm sm:pl-6 lg:pl-8"
                    >
                      Joker
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border bg-card">
                  {fields.map((field, ix) =>
                    fixtures[ix].roundId === currentRound.id ? (
                      <tr key={field.id}>
                        <td className="whitespace-nowrap py-4 pr-2 pl-4 text-right text-muted-foreground text-sm">
                          {fixtures[ix].nr}
                        </td>
                        <td className="whitespace-nowrap py-4 pr-4 pl-2 text-muted-foreground text-sm sm:pr-6 lg:pr-8">
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
                        <td className="w-24 px-2 py-2 text-center">
                          <TextField
                            {...register(`tips.${ix}.tip`, {
                              pattern: {
                                value: /\b\d{1,2}:\d{1,2}\b/,
                                message: 'Ungültiger Tipp.',
                              },
                            })}
                            label={`Tipp für Spiel ${fixtures[ix].nr}`}
                            labelClassName="sr-only"
                            error={errors.tips?.[ix]?.tip?.message}
                            className="w-16 text-center font-medium tabular-nums"
                          />
                        </td>
                        <td className="w-20 pl-2 text-center sm:pl-6 lg:pl-8">
                          <label className="relative inline-flex h-9 w-9 items-center justify-center rounded-md">
                            <input
                              type="checkbox"
                              {...register(`tips.${ix}.joker`)}
                              aria-label={`Joker für Spiel ${fixtures[ix].nr}`}
                              className="peer sr-only"
                            />
                            <span className="h-5 w-5 rounded-sm border border-input bg-background shadow-xs transition-colors peer-checked:border-primary peer-checked:bg-primary peer-focus-visible:outline-2 peer-focus-visible:outline-ring peer-focus-visible:outline-offset-2 motion-reduce:transition-none" />
                            <CheckIcon
                              className="pointer-events-none absolute h-4 w-4 text-primary-foreground opacity-0 transition-opacity peer-checked:opacity-100 motion-reduce:transition-none"
                              aria-hidden="true"
                            />
                          </label>
                        </td>
                      </tr>
                    ) : null,
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

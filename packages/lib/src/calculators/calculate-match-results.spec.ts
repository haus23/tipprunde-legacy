import { describe, expect, test } from 'vitest';
import type { ChampionshipRules } from '../model/championchip-rules';
import type { Match } from '../model/match';
import { matchRuleDescriptions } from '../model/rules/match-rule';
import { roundRuleDescriptions } from '../model/rules/round-rule';
import type { Tip } from '../model/tip';
import { calculateMatchResults } from './calculate-match-results';

// Passing in an unreal points value in order to test object identity
function makeTipMock(
  tip: string,
  joker = false,
  points = -1,
  lonelyHit?: boolean,
): Tip {
  const newTip: Tip = {
    id: '',
    playerId: '',
    matchId: '',
    tip,
    joker,
    points,
  };

  if (lonelyHit) {
    newTip.lonelyHit = lonelyHit;
  }

  return Object.freeze(newTip);
}

function makeMatchMock(result: string, points = -1): Match {
  const newMatch = {
    result,
    points,
    id: '',
    roundId: '',
    nr: 1,
    hometeamId: '',
    awayteamId: '',
    leagueId: '',
    date: '',
  };
  return Object.freeze(newMatch);
}

const tipStrings = ['2:1', '3:1', '4:1', '2:2', '0:3', '5:0', '3:2'];

describe(`Spielberechnung nach Regeln: ${matchRuleDescriptions[0].name}`, () => {
  const rules: ChampionshipRules = {
    id: '',
    name: '',
    description: '',
    tipRuleId: 'drei-oder-ein-punkt-joker-verdoppelt',
    matchRuleId: 'keine-besonderheiten',
    roundRuleId: 'keine-besonderheiten',
    extraQuestionRuleId: 'keine-zusatzfragen',
  };

  test('Berechnung summiert korrekt die erzielten Punkte', () => {
    const tipPoints = [3, 1, 1, 0, 0, 1, 1];
    const tips = tipStrings.map((tip, ix) =>
      makeTipMock(tip, false, tipPoints[ix]),
    );

    const match = makeMatchMock('2:1');
    const { match: calculatedMatch } = calculateMatchResults(
      match,
      tips,
      rules,
    );
    expect(calculatedMatch.points).toBe(7);
    expect(calculatedMatch).not.toBe(match);
  });

  test('Neuberechnung behält Objekt-Identität', () => {
    const tipPoints = [3, 1, 1, 0, 0, 1, 1];
    const tips = tipStrings.map((tip, ix) =>
      makeTipMock(tip, false, tipPoints[ix]),
    );

    const match = makeMatchMock('2:1', 7);
    const { match: calculatedMatch } = calculateMatchResults(
      match,
      tips,
      rules,
    );
    expect(calculatedMatch.points).toBe(7);
    expect(calculatedMatch).toBe(match);
  });

  test('Einzelner korrekter Tipp ist irrelevant', () => {
    const tipPoints = [0, 0, 0, 0, 1, 0, 0];
    const tips = tipStrings.map((tip, ix) =>
      makeTipMock(tip, false, tipPoints[ix]),
    );

    const match = makeMatchMock('0:4', 1);
    const { match: calculatedMatch, tips: updatedTips } = calculateMatchResults(
      match,
      tips,
      rules,
    );
    expect(calculatedMatch.points).toBe(1);
    expect(calculatedMatch).toBe(match);
    expect(updatedTips[4].points).toBe(1);
  });
});

describe(`Spielberechnung nach Regeln: ${matchRuleDescriptions[1].name}`, () => {
  const rules: ChampionshipRules = {
    id: '',
    name: '',
    description: '',
    tipRuleId: 'drei-oder-ein-punkt-joker-verdoppelt',
    matchRuleId: 'alleiniger-treffer-drei-punkte',
    roundRuleId: 'keine-besonderheiten',
    extraQuestionRuleId: 'keine-zusatzfragen',
  };

  test('Berechnung summiert korrekt die erzielten Punkte', () => {
    const tipPoints = [3, 1, 1, 0, 0, 1, 1];
    const tips = tipStrings.map((tip, ix) =>
      makeTipMock(tip, false, tipPoints[ix]),
    );

    const match = makeMatchMock('2:1');
    const { match: calculatedMatch } = calculateMatchResults(
      match,
      tips,
      rules,
    );
    expect(calculatedMatch.points).toBe(7);
    expect(calculatedMatch).not.toBe(match);
  });

  test('Neuberechnung der Summe behält Objekt-Identität', () => {
    const tipPoints = [3, 1, 1, 0, 0, 1, 1];
    const tips = tipStrings.map((tip, ix) =>
      makeTipMock(tip, false, tipPoints[ix]),
    );
    const match = makeMatchMock('2:1', 7);
    const { match: calculatedMatch } = calculateMatchResults(
      match,
      tips,
      rules,
    );
    expect(calculatedMatch.points).toBe(7);
    expect(calculatedMatch).toBe(match);
  });

  test('Einzelner korrekter Tipp wird aufgewertet', () => {
    const tipPoints = [0, 0, 0, 0, 2, 0, 0];
    const tips = tipStrings.map((tip, ix) =>
      makeTipMock(tip, true, tipPoints[ix]),
    );

    const match = makeMatchMock('1:6', 2);
    const { match: calculatedMatch, tips: updatedTips } = calculateMatchResults(
      match,
      tips,
      rules,
    );
    expect(calculatedMatch.points).toBe(5);
    expect(calculatedMatch).not.toBe(match);
    expect(updatedTips[4].points).toBe(5);
  });
});

describe(`Spielberechnung nach Regeln: ${matchRuleDescriptions[1].name} und ${roundRuleDescriptions[1].name}`, () => {
  const rules: ChampionshipRules = {
    id: '',
    name: '',
    description: '',
    tipRuleId: 'drei-oder-ein-punkt-joker-verdoppelt',
    matchRuleId: 'alleiniger-treffer-drei-punkte',
    roundRuleId: 'alles-verdoppelt',
    extraQuestionRuleId: 'keine-zusatzfragen',
  };

  test('Berechnung summiert korrekt die erzielten Punkte', () => {
    const tipPoints = [3, 1, 1, 0, 0, 1, 1];
    const tips = tipStrings.map((tip, ix) =>
      makeTipMock(tip, false, tipPoints[ix]),
    );

    const match = makeMatchMock('2:1');
    const { match: calculatedMatch } = calculateMatchResults(
      match,
      tips,
      rules,
      { isDoubleRound: true },
    );
    expect(calculatedMatch.points).toBe(14);
    expect(calculatedMatch).not.toBe(match);
  });

  test('Neuberechnung der Summe behält Objekt-Identität', () => {
    const tipPoints = [3, 1, 1, 0, 0, 1, 1];
    const tips = tipStrings.map((tip, ix) =>
      makeTipMock(tip, false, tipPoints[ix]),
    );
    const match = makeMatchMock('2:1', 14);
    const { match: calculatedMatch } = calculateMatchResults(
      match,
      tips,
      rules,
      { isDoubleRound: true },
    );
    expect(calculatedMatch.points).toBe(14);
    expect(calculatedMatch).toBe(match);
  });

  test('Einzelner korrekter Tipp wird aufgewertet', () => {
    const tipPoints = [0, 0, 0, 0, 2, 0, 0];
    const tips = tipStrings.map((tip, ix) =>
      makeTipMock(tip, true, tipPoints[ix]),
    );

    const match = makeMatchMock('1:6', 0);
    const { match: calculatedMatch, tips: updatedTips } = calculateMatchResults(
      match,
      tips,
      rules,
      { isDoubleRound: true },
    );
    expect(calculatedMatch.points).toBe(7);
    expect(calculatedMatch).not.toBe(match);
    expect(updatedTips[4].points).toBe(7);
  });
});

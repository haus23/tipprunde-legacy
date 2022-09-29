import { Timestamp } from 'firebase/firestore';
import { describe, expect, test } from 'vitest';
import { ChampionshipRules } from '../model/championchip-rules';
import { Match } from '../model/match';
import { matchRuleDescriptions } from '../model/rules/match-rule';
import { Tip } from '../model/tip';
import { calculateMatchResults } from './calculate-match-results';

// Passing in an unreal points value in order to test object identity
function makeTipMock(
  tip: string,
  joker = false,
  points = -1,
  lonelyHit?: boolean
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

const tipStrings = ['2:1', '3:1', '4:1', '2:2', '0:3', '5:0', '3:2'];

describe(
  'Spielberechnung nach Regeln: ' + matchRuleDescriptions[0].name,
  () => {
    const ruleset: ChampionshipRules = {
      id: '',
      name: '',
      description: '',
      tipRuleId: 'drei-oder-ein-punkt-joker-verdoppelt',
      matchRuleId: 'keine-besonderheiten',
      roundRuleId: 'keine-besonderheiten',
    };

    test('Berechnung summiert korrekt die erzielten Punkte', () => {
      const tipPoints = [3, 1, 1, 0, 0, 1, 1];
      const tips = tipStrings.map((tip, ix) =>
        makeTipMock(tip, false, tipPoints[ix])
      );

      const match: Match = {
        result: '2:1',
        points: -1,
        id: '',
        roundId: '',
        nr: 1,
        hometeam: '',
        awayteam: '',
        league: '',
        date: Timestamp.fromDate(new Date()),
      };
      const { match: calculatedMatch } = calculateMatchResults(
        match,
        tips,
        ruleset
      );
      expect(calculatedMatch.points).toBe(7);
      expect(calculatedMatch).not.toBe(match);
    });

    test('Neuberechnung behält Objekt-Identität', () => {
      const tipPoints = [3, 1, 1, 0, 0, 1, 1];
      const tips = tipStrings.map((tip, ix) =>
        makeTipMock(tip, false, tipPoints[ix])
      );

      const match: Match = {
        result: '2:1',
        points: 7,
        id: '',
        roundId: '',
        nr: 1,
        hometeam: '',
        awayteam: '',
        league: '',
        date: Timestamp.fromDate(new Date()),
      };
      const { match: calculatedMatch } = calculateMatchResults(
        match,
        tips,
        ruleset
      );
      expect(calculatedMatch.points).toBe(7);
      expect(calculatedMatch).toBe(match);
    });

    test('Einzelner korrekter Tipp ist irrelevant', () => {
      const tipPoints = [0, 0, 0, 0, 1, 0, 0];
      const tips = tipStrings.map((tip, ix) =>
        makeTipMock(tip, false, tipPoints[ix])
      );

      const match: Match = {
        result: '0:4',
        points: 1,
        id: '',
        roundId: '',
        nr: 1,
        hometeam: '',
        awayteam: '',
        league: '',
        date: Timestamp.fromDate(new Date()),
      };
      const { match: calculatedMatch, tips: updatedTips } =
        calculateMatchResults(match, tips, ruleset);
      expect(calculatedMatch.points).toBe(1);
      expect(calculatedMatch).toBe(match);
      expect(updatedTips[4].points).toBe(1);
    });
  }
);

describe(
  'Spielberechnung nach Regeln: ' + matchRuleDescriptions[1].name,
  () => {
    const ruleset: ChampionshipRules = {
      id: '',
      name: '',
      description: '',
      tipRuleId: 'drei-oder-ein-punkt-joker-verdoppelt',
      matchRuleId: 'alleiniger-treffer-drei-punkte',
      roundRuleId: 'keine-besonderheiten',
    };

    test('Berechnung summiert korrekt die erzielten Punkte', () => {
      const tipPoints = [3, 1, 1, 0, 0, 1, 1];
      const tips = tipStrings.map((tip, ix) =>
        makeTipMock(tip, false, tipPoints[ix])
      );

      const match: Match = {
        result: '2:1',
        points: -1,
        id: '',
        roundId: '',
        nr: 1,
        hometeam: '',
        awayteam: '',
        league: '',
        date: Timestamp.fromDate(new Date()),
      };
      const { match: calculatedMatch } = calculateMatchResults(
        match,
        tips,
        ruleset
      );
      expect(calculatedMatch.points).toBe(7);
      expect(calculatedMatch).not.toBe(match);
    });

    test('Neuberechnung der Summe behält Objekt-Identität', () => {
      const tipPoints = [3, 1, 1, 0, 0, 1, 1];
      const tips = tipStrings.map((tip, ix) =>
        makeTipMock(tip, false, tipPoints[ix])
      );
      const match: Match = {
        result: '2:1',
        points: 7,
        id: '',
        roundId: '',
        nr: 1,
        hometeam: '',
        awayteam: '',
        league: '',
        date: Timestamp.fromDate(new Date()),
      };
      const { match: calculatedMatch } = calculateMatchResults(
        match,
        tips,
        ruleset
      );
      expect(calculatedMatch.points).toBe(7);
      expect(calculatedMatch).toBe(match);
    });

    test('Einzelner korrekter Tipp wird aufgewertet', () => {
      const tipPoints = [0, 0, 0, 0, 2, 0, 0];
      const tips = tipStrings.map((tip, ix) =>
        makeTipMock(tip, true, tipPoints[ix])
      );

      const match: Match = {
        result: '1:6',
        points: 2,
        id: '',
        roundId: '',
        nr: 1,
        hometeam: '',
        awayteam: '',
        league: '',
        date: Timestamp.fromDate(new Date()),
      };
      const { match: calculatedMatch, tips: updatedTips } =
        calculateMatchResults(match, tips, ruleset);
      expect(calculatedMatch.points).toBe(5);
      expect(calculatedMatch).not.toBe(match);
      expect(updatedTips[4].points).toBe(5);
    });
  }
);

import { describe, expect, test } from 'vitest';
import { calculateTipResult } from '../../../src/championship/scoring/calculate-tip-result';
import type { Tip } from '../../../src/championship/tip';
import { type TipRuleId, tipRules } from '../../../src/rules/tip';

// Passing in an unreal points value in order to test object identity
function makeTipMock(
  tip: string,
  joker = false,
  points = -1,
  lonelyHit?: boolean,
): Tip {
  const newTip: Tip = {
    id: '5RXTmIjsZkx47sjrOAvA',
    playerId: 'wK2mJ7QpL9xR4sT8vN3b',
    matchId: 'nC8vB4mQ2xL7sR5tK9pD',
    tip,
    joker,
    points,
  };

  if (lonelyHit) {
    newTip.lonelyHit = lonelyHit;
  }

  return Object.freeze(newTip);
}

const mockData = [
  {
    result: '3:1',
    tips: [
      { tip: '3:1', joker: false },
      { tip: '3:1', joker: true },
      { tip: '2:1', joker: false },
      { tip: '2:1', joker: true },
      { tip: '2:0', joker: false },
      { tip: '2:0', joker: true },
      { tip: '0:0', joker: false },
      { tip: '0:0', joker: true },
      { tip: '1:3', joker: false },
      { tip: '1:3', joker: true },
      { tip: '', joker: false },
      { tip: '', joker: true },
    ],
  },
  {
    result: '0:0',
    tips: [
      { tip: '0:0', joker: false },
      { tip: '0:0', joker: true },
      { tip: '1:1', joker: false },
      { tip: '1:1', joker: true },
      { tip: '2:2', joker: false },
      { tip: '2:2', joker: true },
      { tip: '3:1', joker: false },
      { tip: '3:1', joker: true },
      { tip: '1:3', joker: false },
      { tip: '1:3', joker: true },
      { tip: '', joker: false },
      { tip: '', joker: true },
    ],
  },
  {
    result: '0:2',
    tips: [
      { tip: '0:2', joker: false },
      { tip: '0:2', joker: true },
      { tip: '0:1', joker: false },
      { tip: '0:1', joker: true },
      { tip: '2:4', joker: false },
      { tip: '2:4', joker: true },
      { tip: '0:0', joker: false },
      { tip: '0:0', joker: true },
      { tip: '5:3', joker: false },
      { tip: '5:3', joker: true },
      { tip: '', joker: false },
      { tip: '', joker: true },
    ],
  },
];

describe(`Tippberechnung nach Regeln: ${tipRules[0].name}`, () => {
  const ruleId: TipRuleId = 'drei-oder-ein-punkt-joker-verdoppelt';

  const expectedPoints = [3, 6, 1, 2, 1, 2, 0, 0, 0, 0, 0, 0];

  test('berechnet die korrekten Punkte', () => {
    for (const match of mockData) {
      match.tips.forEach((tip, ix) => {
        const t = makeTipMock(tip.tip, tip.joker);
        const calculatedTip = calculateTipResult(t, match.result, ruleId);
        expect(calculatedTip).not.toBe(t);
        expect(calculatedTip.points).toBe(expectedPoints[ix]);
      });
    }
  });

  test('berechnet die korrekten Punkte in einer Doppelte-Punkte-Runde', () => {
    for (const match of mockData) {
      match.tips.forEach((tip, ix) => {
        const t = makeTipMock(tip.tip, tip.joker);
        const calculatedTip = calculateTipResult(t, match.result, ruleId, {
          doubleRound: true,
        });
        expect(calculatedTip).not.toBe(t);
        expect(calculatedTip.points).toBe(expectedPoints[ix] * 2);
      });
    }
  });

  test('ändert bei einer Neuberechnung nichts', () => {
    const tip = makeTipMock('2:1', true, 6);
    const calculatedTip = calculateTipResult(tip, '2:1', ruleId);
    expect(calculatedTip).toBe(tip);
  });

  test('setzt alle extra Flags zurück', () => {
    const tip = makeTipMock('2:1', true, 6, true);
    const calculatedTip = calculateTipResult(tip, '2:1', ruleId);
    expect(calculatedTip.lonelyHit).toBeUndefined();
    expect(calculatedTip).not.toBe(tip);
  });

  test('setzt Joker auf leerem Tipp zurück', () => {
    const tip = makeTipMock('', true, 0);
    const calculatedTip = calculateTipResult(tip, '2:1', ruleId);
    expect(calculatedTip.joker).toBeFalsy();
    expect(calculatedTip).not.toBe(tip);
  });

  test('entfernt die Auswertung bei leerem Ergebnis', () => {
    const tip = makeTipMock('2:1', false, 3);
    const calculatedTip = calculateTipResult(tip, '', ruleId);
    expect(calculatedTip.points).toBeUndefined();
    expect(calculatedTip).not.toBe(tip);
  });
});

describe(`Tippberechnung nach Regeln: ${tipRules[1].name}`, () => {
  const ruleId: TipRuleId = 'drei-zwei-oder-ein-punkt-joker-verdoppelt';

  const expectedPoints = [
    [3, 6, 1, 2, 2, 4, 0, 0, 0, 0, 0, 0],
    [3, 6, 2, 4, 2, 4, 0, 0, 0, 0, 0, 0],
    [3, 6, 1, 2, 2, 4, 0, 0, 0, 0, 0, 0],
  ];

  test('berechnet die korrekten Punkte', () => {
    mockData.forEach((match, ixMatch) => {
      match.tips.forEach((tip, ixTip) => {
        const t = makeTipMock(tip.tip, tip.joker);
        const calculatedTip = calculateTipResult(t, match.result, ruleId);
        expect(calculatedTip).not.toBe(t);
        expect(calculatedTip.points).toBe(expectedPoints[ixMatch][ixTip]);
      });
    });
  });

  test('berechnet die korrekten Punkte in einer Doppelte-Punkte-Runde', () => {
    mockData.forEach((match, ixMatch) => {
      match.tips.forEach((tip, ixTip) => {
        const t = makeTipMock(tip.tip, tip.joker);
        const calculatedTip = calculateTipResult(t, match.result, ruleId, {
          doubleRound: true,
        });
        expect(calculatedTip).not.toBe(t);
        expect(calculatedTip.points).toBe(expectedPoints[ixMatch][ixTip] * 2);
      });
    });
  });

  test('ändert bei einer Neuberechnung nichts', () => {
    const tip = makeTipMock('2:1', true, 6);
    const calculatedTip = calculateTipResult(tip, '2:1', ruleId);
    expect(calculatedTip).toBe(tip);
  });

  test('setzt alle extra Flags zurück', () => {
    const tip = makeTipMock('2:1', true, 6, true);
    const calculatedTip = calculateTipResult(tip, '2:1', ruleId);
    expect(calculatedTip.lonelyHit).toBeUndefined();
    expect(calculatedTip).not.toBe(tip);
  });

  test('setzt Joker auf leerem Tipp zurück', () => {
    const tip = makeTipMock('', true, 0);
    const calculatedTip = calculateTipResult(tip, '2:1', ruleId);
    expect(calculatedTip.joker).toBeFalsy();
    expect(calculatedTip).not.toBe(tip);
  });

  test('entfernt die Auswertung bei leerem Ergebnis', () => {
    const tip = makeTipMock('2:1', false, 3);
    const calculatedTip = calculateTipResult(tip, '', ruleId);
    expect(calculatedTip.points).toBeUndefined();
    expect(calculatedTip).not.toBe(tip);
  });
});

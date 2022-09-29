import { describe, expect, test } from 'vitest';
import { tipRuleDescriptions, TipRuleId } from '../model/rules/tip-rule';
import { Tip } from '../model/tip';
import { calculateTipResult } from './calculate-tip-result';

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

describe('Tippberechnung nach Regeln: ' + tipRuleDescriptions[0].name, () => {
  const ruleId: TipRuleId = 'drei-oder-ein-punkt-joker-verdoppelt';

  const expectedPoints = [3, 6, 1, 2, 1, 2, 0, 0, 0, 0, 0, 0];

  test('berechnet die korrekten Punkte', () => {
    mockData.forEach((match) => {
      match.tips.forEach((tip, ix) => {
        const t = makeTipMock(tip.tip, tip.joker);
        const calculatedTip = calculateTipResult(t, match.result, ruleId);
        expect(calculatedTip).not.toBe(t);
        expect(calculatedTip.points).toBe(expectedPoints[ix]);
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

  test('nullt die Punkte bei leerem Match', () => {
    const tip = makeTipMock('2:1', false, 3);
    const calculatedTip = calculateTipResult(tip, '', ruleId);
    expect(calculatedTip.points).toBe(0);
    expect(calculatedTip).not.toBe(tip);
  });
});

describe('Tippberechnung nach Regeln: ' + tipRuleDescriptions[1].name, () => {
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

  test('nullt die Punkte bei leerem Match', () => {
    const tip = makeTipMock('2:1', false, 3);
    const calculatedTip = calculateTipResult(tip, '', ruleId);
    expect(calculatedTip.points).toBe(0);
    expect(calculatedTip).not.toBe(tip);
  });
});

import { expect, it } from 'vitest';
import { escapeIdentifier } from './escapeIdentifier';

it.each([
  ['ShouldNotBeChanged'],
  ['alsoShouldNotBeChanged'],
  [' NeedsTrimming ', 'NeedsTrimming'],
  [' needsTrimming ', 'needsTrimming'],
  ['an example', 'AnExample'],
  [' an example', 'AnExample'],
  ['an  example', 'AnExample'],
  ['[example] this is a table! yes, even with symbols: "\'!.Id', 'ExampleThisIsATableYesEvenWithSymbolsId'],
  ['if', 'If'],
  ['Date Field #1', 'DateField1'],
  ['Special Character Fiéld', 'SpecialCharacterField'],
  ['"Iлｔèｒｎåｔïｏｎɑｌíƶａｔï߀ԉ"', 'Internationalizati0n'],
  // General cases with special characters and numeric prefixes
  ['123 Identifier', '_123Identifier'],
  ['🏠 Location Info', 'LocationInfo'],
  ['User/Manager Contact', 'UserManagerContact'],
  ['Unit # Number', 'UnitNumber'],
  ['Latest Sale Price (USD)', 'LatestSalePriceUsd'],
  ['2025 Strategy Plan', '_2025StrategyPlan'],
  ['General Classification 🚧', 'GeneralClassification'],
  ['Important Notes & Remarks', 'ImportantNotesRemarks'],
  ['Annual Budget $2023', 'AnnualBudget2023']
])('should escape string: %s -> %s', (s1, s2?) => {
  expect(escapeIdentifier(s1)).toBe(s2 ?? s1);
});

it.each([
  ['empty string', ''],
  ['whitespace', ' '],
  ['symbols', '"\'`\t'],
  ['only numbers', '1234']
])('should throw if unsalvageable: %s', (_, s) => {
  expect(() => escapeIdentifier(s)).toThrow();
});
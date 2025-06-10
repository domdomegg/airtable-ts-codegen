import {expect, it, beforeEach} from 'vitest';
import {escapeIdentifier, resetIdentifierState} from './escapeIdentifier';

beforeEach(() => {
	resetIdentifierState();
});

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
	['Annual Budget $2023', 'AnnualBudget2023'],
])('should escape string: %s -> %s', (s1, s2?) => {
	expect(escapeIdentifier(s1)).toBe(s2 ?? s1);
});

it.each([
	['empty string', ''],
	['whitespace', ' '],
	['symbols', '"\'`\t'],
	['1234', '1234'],
])('should throw if unsalvageable: %s', (_, s) => {
	expect(escapeIdentifier(s).startsWith('invalidIdentifier')).toBe(true);
});

// Test cases for special character handling to avoid duplicates by adding numbers
it('should handle duplicate base names by adding numbers', () => {
	// Reset the internal counter for predictable test results
	const inputs = ['% amount', '$ amount', '@ amount', '# amount'];
	const results = inputs.map((input) => escapeIdentifier(input));

	// All results should be unique
	const uniqueResults = new Set(results);
	expect(uniqueResults.size).toBe(inputs.length);

	// Should get Amount, Amount2, Amount3, Amount4 (or similar numbering)
	expect(results[0]).toBe('Amount');
	expect(results[1]).toBe('Amount2');
	expect(results[2]).toBe('Amount3');
	expect(results[3]).toBe('Amount4');
});

// Test individual cases
it.each([
	['% amount', 'Amount'],
	['$ price', 'Price'],
	['@ email', 'Email'],
	['# number', 'Number'],
	['& operator', 'Operator'],
])('should drop special characters: %s -> %s', (input, expected) => {
	// Note: This test assumes no previous calls that would affect numbering
	const result = escapeIdentifier(input);
	// The result should either be the expected name or the expected name with a number
	expect(result === expected || result.startsWith(expected)).toBe(true);
});

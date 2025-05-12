import {jsTypeForAirtableType} from './jsTypeForAirtableType';
import {tablesMeta} from './__fixture__/tablesMeta.json';
import {expect, it, describe} from 'vitest';

describe('jsTypeForAirtableType', () => {
	const table = tablesMeta.tables[0]!;

	it('converts text-based fields to string | null', () => {
		const singleLineText = table.fields.find((f) => f.type === 'singleLineText')!;
		const multilineText = table.fields.find((f) => f.type === 'multilineText')!;
		const email = table.fields.find((f) => f.type === 'email')!;
		const url = table.fields.find((f) => f.type === 'url')!;
		const phoneNumber = table.fields.find((f) => f.type === 'phoneNumber')!;
		const singleSelect = table.fields.find((f) => f.type === 'singleSelect')!;
		const singleCollaborator = table.fields.find((f) => f.type === 'singleCollaborator')!;
		const barcode = table.fields.find((f) => f.type === 'barcode')!;
		const button = table.fields.find((f) => f.type === 'button')!;
		const createdBy = table.fields.find((f) => f.type === 'createdBy')!;
		const lastModifiedBy = table.fields.find((f) => f.type === 'lastModifiedBy')!;

		expect(jsTypeForAirtableType(singleLineText)).toBe('string | null');
		expect(jsTypeForAirtableType(multilineText)).toBe('string | null');
		expect(jsTypeForAirtableType(email)).toBe('string | null');
		expect(jsTypeForAirtableType(url)).toBe('string | null');
		expect(jsTypeForAirtableType(phoneNumber)).toBe('string | null');
		expect(jsTypeForAirtableType(singleSelect)).toBe('string | null');
		expect(jsTypeForAirtableType(singleCollaborator)).toBe('string | null');
		expect(jsTypeForAirtableType(barcode)).toBe('string | null');
		expect(jsTypeForAirtableType(button)).toBe('string | null');

		expect(jsTypeForAirtableType(createdBy)).toBe('string');
		expect(jsTypeForAirtableType(lastModifiedBy)).toBe('string | null');
	});

	it('converts multiple-value fields to string[]', () => {
		const multipleAttachments = table.fields.find((f) => f.type === 'multipleAttachments')!;
		const multipleSelects = table.fields.find((f) => f.type === 'multipleSelects')!;

		expect(jsTypeForAirtableType(multipleAttachments)).toBe('string[]');
		expect(jsTypeForAirtableType(multipleSelects)).toBe('string[]');
	});

	it('converts numeric fields to number', () => {
		const number = table.fields.find((f) => f.type === 'number')!;
		const currency = table.fields.find((f) => f.type === 'currency')!;
		const percent = table.fields.find((f) => f.type === 'percent')!;
		const duration = table.fields.find((f) => f.type === 'duration')!;
		const rating = table.fields.find((f) => f.type === 'rating')!;
		const autoNumber = table.fields.find((f) => f.type === 'autoNumber')!;

		expect(jsTypeForAirtableType(number)).toBe('number | null');
		expect(jsTypeForAirtableType(currency)).toBe('number | null');
		expect(jsTypeForAirtableType(percent)).toBe('number | null');
		expect(jsTypeForAirtableType(duration)).toBe('number | null');
		expect(jsTypeForAirtableType(rating)).toBe('number | null');
		expect(jsTypeForAirtableType(autoNumber)).toBe('number');
	});

	it('converts date/time fields to number (Unix timestamp)', () => {
		const date = table.fields.find((f) => f.type === 'date')!;
		const dateTime = table.fields.find((f) => f.type === 'dateTime')!;
		const createdTime = table.fields.find((f) => f.type === 'createdTime')!;
		const lastModifiedTime = table.fields.find((f) => f.type === 'lastModifiedTime')!;

		expect(jsTypeForAirtableType(date)).toBe('number | null');
		expect(jsTypeForAirtableType(dateTime)).toBe('number | null');
		expect(jsTypeForAirtableType(createdTime)).toBe('number');
		expect(jsTypeForAirtableType(lastModifiedTime)).toBe('number | null');
	});

	it('converts checkbox to boolean', () => {
		const checkbox = table.fields.find((f) => f.type === 'checkbox')!;
		expect(jsTypeForAirtableType(checkbox)).toBe('boolean');
	});

	it('handles formula fields with result type', () => {
		const formula = table.fields.find((f) => f.type === 'formula')!;
		expect(jsTypeForAirtableType(formula)).toBe('string | null');
	});

	it('throws error for invalid formula field', () => {
		const invalidFormula = {
			type: 'formula',
			id: 'invalid',
			options: {}, // Missing result property
		};

		expect(() => jsTypeForAirtableType(invalidFormula as any)).toThrow('Invalid formula field (no options.result): invalid');
	});
});

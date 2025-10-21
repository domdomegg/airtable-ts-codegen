import {expect, it} from 'vitest';
import {ensureTsExtension} from './ensureTsExtension';

it.each([
	['index', 'index.ts'],
	['app.ts', 'app.ts'],
	['component.tsx', 'component.tsx'],
	['types.d.ts', 'types.d.ts'],
	['utils.test', 'utils.test.ts'],
	['', '.ts'],
	['file.', 'file..ts'],
])('should ensure .ts extension for %j', (input, expected) => {
	expect(ensureTsExtension(input)).toBe(expected);
});

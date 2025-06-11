#!/usr/bin/env node

import {writeFileSync} from 'fs';
import {main} from '.';
import {escapeIdentifier} from './escape/escapeIdentifier';

const apiKey = process.env.AIRTABLE_API_KEY;
if (!apiKey) {
	throw new Error('No Airtable API key set. Make sure the AIRTABLE_API_KEY environment variable is set.');
}

const baseId = process.env.AIRTABLE_BASE_ID;
if (!baseId) {
	throw new Error('No Airtable base id set. Make sure the AIRTABLE_BASE_ID environment variable is set.');
}

const viewIds = process.env.AIRTABLE_VIEW_IDS;

const config = {apiKey, baseId, ...(viewIds && {viewIds: viewIds.split(',')})};

const generateCode = async () => {
	console.log(`Generating TypeScript definitions for base ${baseId}${viewIds ? ` with views ${viewIds}` : ''}...`);

	return main(config);
};

generateCode().then((result) => {
	const filename = `${escapeIdentifier(baseId)}.ts`;
	writeFileSync(filename, result);
	console.log(`Generated ${filename}`);
}).catch((err: unknown) => {
	console.error(err);
	process.exit(1);
});

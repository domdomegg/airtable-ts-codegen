#!/usr/bin/env node

import { writeFileSync } from 'fs';
import { main } from '.';
import { escapeIdentifier } from './escape/escapeIdentifier';

/* eslint-disable no-console */

const apiKey = process.env.AIRTABLE_API_KEY;
if (!apiKey) throw new Error('No Airtable API key set. Make sure the AIRTABLE_API_KEY environment variable is set.');

const baseId = process.env.AIRTABLE_BASE_ID;
if (!baseId) throw new Error('No Airtable base id set. Make sure the AIRTABLE_BASE_ID environment variable is set.');

main({ apiKey, baseId }).then((result) => {
  writeFileSync(`${escapeIdentifier(baseId)}.ts`, result);
});

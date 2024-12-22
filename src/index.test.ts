import { expect, test } from 'vitest';
import { AirtableTs } from 'airtable-ts';
import { execSync } from 'child_process';

// Run me with:
// AIRTABLE_API_KEY=pat1234.abcd RUN_INTEGRATION=TRUE npm run test -- 'src/index.test.ts'
(process.env.RUN_INTEGRATION ? test : test.skip)('integration test', async () => {
  // WHEN... we run airtable-ts-codegen
  await execSync('npm run build && cd dist && AIRTABLE_BASE_ID=app1cNCe6lBFLFgbM npx airtable-ts-codegen');

  // THEN... we can import the tasksTable definition
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  /** @ts-ignore */
  // eslint-disable-next-line import/extensions
  const { tasksTable } = await import('../dist/app1cNCe6lBFLFgbM.js');

  // WHEN... we use this definition to get records in the table
  const db = new AirtableTs({ apiKey: process.env.AIRTABLE_API_KEY ?? '' });
  const records = await db.scan(tasksTable);

  // THEN... we get the records we expect in the format we expect
  expect(records).toEqual([
    {
      id: 'recD0KglUuj0CkEVW',
      name: 'First task',
      status: 'In progress',
      dueAt: 1717118580,
      isOptional: false,
      project: ['recLUUmrS706HP1Yb'],
      projectOwner: 'Alice',
      createdAt: 1714521131,
      projectPlanPDF: [expect.stringContaining('airtableusercontent.com')],
    },
    {
      id: 'recnFWM2RsVGobKCp',
      name: 'Second task',
      status: 'Todo',
      dueAt: 1717204980,
      isOptional: true,
      project: [],
      projectOwner: null,
      createdAt: 1714521131,
      projectPlanPDF: [],
    },
  ]);
});

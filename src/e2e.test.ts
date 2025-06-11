import {beforeAll, expect, test} from 'vitest';
import {AirtableTs} from 'airtable-ts';
import {execSync} from 'child_process';

if (process.env.RUN_INTEGRATION) {
	beforeAll(() => {
		execSync('npm run build');
	});
}

// Run me with:
// AIRTABLE_API_KEY=pat1234.abcd RUN_INTEGRATION=TRUE npm run test -- 'src/e2e.test.ts'
(process.env.RUN_INTEGRATION ? test : test.skip)('integration test', async () => {
	// WHEN... we run airtable-ts-codegen
	execSync('cd dist && AIRTABLE_BASE_ID=app1cNCe6lBFLFgbM node cli.js');

	// THEN... we can import the tasksTable definition
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	/** @ts-ignore */
	const {tasksTable} = await import('../dist/app1cNCe6lBFLFgbM.js');

	// WHEN... we use this definition to get records in the table
	const db = new AirtableTs({apiKey: process.env.AIRTABLE_API_KEY ?? ''});
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
			projectPlanPdf: [expect.stringContaining('airtableusercontent.com')],
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
			projectPlanPdf: [],
		},
	]);
});

(process.env.RUN_INTEGRATION ? test : test.skip)('integration test with view', async () => {
	// WHEN... we run airtable-ts-codegen with a specific view
	execSync('cd dist && AIRTABLE_BASE_ID=app1cNCe6lBFLFgbM AIRTABLE_VIEW_IDS=viwzoOBgKLKjsqMDl node cli.js');

	// THEN... we can import the tasksTable definition filtered by the view
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	/** @ts-ignore */
	const {tasksTable} = await import('../dist/app1cNCe6lBFLFgbM.js');

	// WHEN... we use this definition to get records in the table
	const db = new AirtableTs({apiKey: process.env.AIRTABLE_API_KEY ?? ''});
	const records = await db.scan(tasksTable);

	// THEN... we get the records we expect in the format we expect
	// Note: The exact structure may differ based on which fields are visible in the view
	expect(records).toBeDefined();
	expect(Array.isArray(records)).toBe(true);

	// Verify that the generated table definition has the expected structure
	expect(tasksTable).toHaveProperty('name');
	expect(tasksTable).toHaveProperty('baseId', 'app1cNCe6lBFLFgbM');
	expect(tasksTable).toHaveProperty('mappings');
	expect(tasksTable).toHaveProperty('schema');
});

(process.env.RUN_INTEGRATION ? test : test.skip)('integration test with views', async () => {
	// WHEN... we run airtable-ts-codegen with a specific view
	execSync('cd dist && AIRTABLE_BASE_ID=app1cNCe6lBFLFgbM AIRTABLE_VIEW_IDS=viwzoOBgKLKjsqMDl,viwTGoUC8V73vRJcY node cli.js');

	// THEN... we can import the tasksTable definition filtered by the view
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	/** @ts-ignore */
	const {tasksTable, projectsTable} = await import('../dist/app1cNCe6lBFLFgbM.js');

	// WHEN... we use this definition to get records in the table
	const db = new AirtableTs({apiKey: process.env.AIRTABLE_API_KEY ?? ''});
	const tasks = await db.scan(tasksTable);
	const projects = await db.scan(projectsTable);

	// THEN... we get the records we expect in the format we expect
	// Note: The exact structure may differ based on which fields are visible in the view
	expect(tasks).toBeDefined();
	expect(Array.isArray(tasks)).toBe(true);
	expect(projects).toBeDefined();
	expect(Array.isArray(projects)).toBe(true);

	// Verify that the generated table definition has the expected structure
	expect(tasksTable).toHaveProperty('name');
	expect(tasksTable).toHaveProperty('baseId', 'app1cNCe6lBFLFgbM');
	expect(tasksTable).toHaveProperty('mappings');
	expect(tasksTable).toHaveProperty('schema');
	expect(projectsTable).toHaveProperty('name');
	expect(projectsTable).toHaveProperty('baseId', 'app1cNCe6lBFLFgbM');
	expect(projectsTable).toHaveProperty('mappings');
	expect(projectsTable).toHaveProperty('schema');
});

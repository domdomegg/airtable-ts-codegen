import {expect, test} from 'vitest';
import {filterBaseSchemaByView} from './view';
import type {BaseSchema} from './getBaseSchema';
import type {Config} from './index';

const mockBaseSchema: BaseSchema = [
	{
		id: 'tblTable1',
		name: 'Table 1',
		primaryFieldId: 'fld1',
		description: 'First table',
		fields: [
			{id: 'fld1', type: 'singleLineText', name: 'Name'},
			{id: 'fld2', type: 'number', name: 'Count'},
			{id: 'fld3', type: 'singleLineText', name: 'Description'},
		],
		views: [
			{
				id: 'viwGrid1',
				name: 'Grid View 1',
				type: 'grid',
				visibleFieldIds: ['fld1', 'fld2'],
			},
			{
				id: 'viwForm1',
				name: 'Form View 1',
				type: 'form',
			},
		],
	},
	{
		id: 'tblTable2',
		name: 'Table 2',
		primaryFieldId: 'fld4',
		description: 'Second table',
		fields: [
			{id: 'fld4', type: 'singleLineText', name: 'Title'},
			{id: 'fld5', type: 'multipleRecordLinks', name: 'Links'},
			{id: 'fld6', type: 'date', name: 'Date'},
		],
		views: [
			{
				id: 'viwGrid2',
				name: 'Grid View 2',
				type: 'grid',
				visibleFieldIds: ['fld4', 'fld6'],
			},
		],
	},
	{
		id: 'tblTable3',
		name: 'Table 3',
		primaryFieldId: 'fld7',
		description: 'Third table',
		fields: [
			{id: 'fld7', type: 'singleLineText', name: 'Name'},
			{id: 'fld8', type: 'checkbox', name: 'Active'},
		],
		views: [
			{
				id: 'viwKanban1',
				name: 'Kanban View 1',
				type: 'kanban',
			},
		],
	},
];

test('filterBaseSchemaByView returns original schema when no viewIds provided', async () => {
	const config: Config = {
		apiKey: 'test-key',
		baseId: 'appTest123',
	};

	const result = await filterBaseSchemaByView(mockBaseSchema, config);

	expect(result).toEqual(mockBaseSchema);
});

test('filterBaseSchemaByView filters tables by single view ID', async () => {
	const config: Config = {
		apiKey: 'test-key',
		baseId: 'appTest123',
		viewIds: ['viwGrid1'],
	};

	const result = await filterBaseSchemaByView(mockBaseSchema, config);

	expect(result).toHaveLength(1);
	expect(result[0]?.id).toBe('tblTable1');
	expect(result[0]?.fields).toHaveLength(2);
	expect(result[0]?.fields.map((f) => f.id)).toEqual(['fld1', 'fld2']);
});

test('filterBaseSchemaByView filters tables by multiple view IDs', async () => {
	const config: Config = {
		apiKey: 'test-key',
		baseId: 'appTest123',
		viewIds: ['viwGrid1', 'viwGrid2'],
	};

	const result = await filterBaseSchemaByView(mockBaseSchema, config);

	expect(result).toHaveLength(2);
	expect(result[0]?.id).toBe('tblTable1');
	expect(result[1]?.id).toBe('tblTable2');

	// Table 1 should have fields filtered by viwGrid1
	expect(result[0]?.fields.map((f) => f.id)).toEqual(['fld1', 'fld2']);

	// Table 2 should have fields filtered by viwGrid2
	expect(result[1]?.fields.map((f) => f.id)).toEqual(['fld4', 'fld6']);
});

test('filterBaseSchemaByView does not filter fields for non-grid views', async () => {
	const config: Config = {
		apiKey: 'test-key',
		baseId: 'appTest123',
		viewIds: ['viwForm1'],
	};

	const result = await filterBaseSchemaByView(mockBaseSchema, config);

	expect(result).toHaveLength(1);
	expect(result[0]?.id).toBe('tblTable1');
	// All fields should be included for form view
	expect(result[0]?.fields).toHaveLength(3);
	expect(result[0]?.fields.map((f) => f.id)).toEqual(['fld1', 'fld2', 'fld3']);
});

test('filterBaseSchemaByView throws error for non-existent view ID', async () => {
	const config: Config = {
		apiKey: 'test-key',
		baseId: 'appTest123',
		viewIds: ['viwNonExistent'],
	};

	await expect(filterBaseSchemaByView(mockBaseSchema, config)).rejects.toThrow('View "viwNonExistent" not found in any table. Please check the view ID is correct.');
});

test('filterBaseSchemaByView throws error when one of multiple view IDs does not exist', async () => {
	const config: Config = {
		apiKey: 'test-key',
		baseId: 'appTest123',
		viewIds: ['viwGrid1', 'viwNonExistent'],
	};

	await expect(filterBaseSchemaByView(mockBaseSchema, config)).rejects.toThrow('View "viwNonExistent" not found in any table. Please check the view ID is correct.');
});

test('filterBaseSchemaByView combines visible fields from multiple grid views in same table', async () => {
	// Add another grid view to Table 1 for this test
	const table1 = mockBaseSchema[0]!;
	const extendedSchema: BaseSchema = [
		{
			id: table1.id,
			name: table1.name,
			...(table1.primaryFieldId && {primaryFieldId: table1.primaryFieldId}),
			...(table1.description && {description: table1.description}),
			fields: table1.fields,
			views: [
				...table1.views,
				{
					id: 'viwGrid1b',
					name: 'Grid View 1b',
					type: 'grid',
					visibleFieldIds: ['fld2', 'fld3'],
				},
			],
		},
		...mockBaseSchema.slice(1),
	];

	const config: Config = {
		apiKey: 'test-key',
		baseId: 'appTest123',
		viewIds: ['viwGrid1', 'viwGrid1b'],
	};

	const result = await filterBaseSchemaByView(extendedSchema, config);

	expect(result).toHaveLength(1);
	expect(result[0]?.id).toBe('tblTable1');
	// Should include union of visible fields from both grid views: fld1, fld2, fld3
	expect(result[0]?.fields).toHaveLength(3);
	expect(result[0]?.fields.map((f) => f.id).sort()).toEqual(['fld1', 'fld2', 'fld3']);
});

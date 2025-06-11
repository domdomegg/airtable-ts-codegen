import type {Config} from './index';
import {type BaseSchema} from './getBaseSchema';

export type ViewSchema = {
	id: string;
	name: string;
	type: 'grid' | 'form' | 'calendar' | 'gallery' | 'kanban' | 'timeline' | 'block';
	personalForUserId?: string;
	visibleFieldIds?: string[];
};

/**
 * Find a view by ID in the base schema
 */
const findViewInBaseSchema = (baseSchema: BaseSchema, viewId: string): {table: BaseSchema[number]; view: ViewSchema} | null => {
	for (const table of baseSchema) {
		const view = table.views.find((v) => v.id === viewId);
		if (view) {
			return {table, view};
		}
	}

	return null;
};

/**
 * Filter base schema based on view IDs.
 * If viewIds are specified:
 * - Only include tables that have at least one matching view
 * - For grid views with visibleFieldIds, filter fields to only visible ones
 * - Throw error if any view ID doesn't match any table
 */
export const filterBaseSchemaByView = async (baseSchema: BaseSchema, config: Config): Promise<BaseSchema> => {
	// If no viewIds are provided, return the original schema
	if (!config.viewIds) {
		return baseSchema;
	}

	const matchedTableIds = new Set<string>();
	const viewToTableMap = new Map<string, {table: BaseSchema[number]; view: ViewSchema}>();

	// First pass: find all views and their tables, validate all views exist
	for (const viewId of config.viewIds) {
		const result = findViewInBaseSchema(baseSchema, viewId);
		if (!result) {
			throw new Error(`View "${viewId}" not found in any table. Please check the view ID is correct.`);
		}

		viewToTableMap.set(viewId, result);
		matchedTableIds.add(result.table.id);
	}

	// Second pass: filter tables and fields
	const filteredTables: BaseSchema = [];

	for (const table of baseSchema) {
		// Only include tables that have at least one matching view
		if (!matchedTableIds.has(table.id)) {
			continue;
		}

		// Find all matching views for this table
		const matchingViews = config.viewIds
			.map((viewId) => viewToTableMap.get(viewId))
			.filter((result) => result?.table.id === table.id)
			.map((result) => result!.view);

		// Check if any of the matching views are grid views with visibleFieldIds
		const gridViewsWithVisibleFields = matchingViews.filter((view) =>
			view.type === 'grid' && view.visibleFieldIds && view.visibleFieldIds.length > 0);

		let filteredTable = table;

		// If we have grid views with visible field restrictions, apply field filtering
		if (gridViewsWithVisibleFields.length > 0) {
			// Collect all visible field IDs from all matching grid views
			const allVisibleFieldIds = new Set<string>();
			for (const view of gridViewsWithVisibleFields) {
				if (view.visibleFieldIds) {
					view.visibleFieldIds.forEach((fieldId) => allVisibleFieldIds.add(fieldId));
				}
			}

			// Filter fields to only include those visible in at least one grid view
			filteredTable = {
				...table,
				fields: table.fields.filter((field) => allVisibleFieldIds.has(field.id)),
			};
		}

		filteredTables.push(filteredTable);
	}

	return filteredTables;
};

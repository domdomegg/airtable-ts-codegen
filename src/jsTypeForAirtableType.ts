import {type FieldSchema} from './getBaseSchema';

/**
 * Returns the corresponding Typescript type for the given Airtable field type.
 *
 * Unsupported fields return `null` and will be filtered out by the caller.
 */
export const jsTypeForAirtableType = (field: FieldSchema): string | null => {
	switch (field.type) {
		case 'url':
		case 'email':
		case 'phoneNumber':
		case 'singleLineText':
		case 'multilineText':
		case 'richText':
		case 'singleSelect':
		case 'externalSyncSource':
		case 'aiText':
		case 'singleCollaborator':
		case 'lastModifiedBy':
		case 'barcode':
		case 'button':
			return 'string | null';
		case 'createdBy':
			return 'string';
		case 'multipleAttachments':
		case 'multipleCollaborators':
		case 'multipleRecordLinks':
		case 'multipleSelects':
			return 'string[]';
		case 'number':
		case 'rating':
		case 'duration':
		case 'currency':
		case 'percent':
			return 'number | null';
		case 'count':
		case 'autoNumber':
			return 'number';
		case 'date':
		case 'dateTime':
		case 'lastModifiedTime':
			return 'number | null'; // Unix timestamp in seconds
		case 'createdTime':
			return 'number'; // Unix timestamp in seconds
		case 'checkbox':
			return 'boolean';
		case 'lookup':
		case 'multipleLookupValues':
		case 'rollup':
		case 'formula':
			if (
				field.options
				&& 'result' in field.options
				&& typeof field.options.result === 'object'
				&& field.options.result !== null
			) {
				const innerType = jsTypeForAirtableType(field.options.result as FieldSchema);
				if (innerType === null) {
					return null;
				}

				if (innerType.includes('null')) {
					return innerType;
				}

				return `${innerType} | null`;
			}

			throw new Error(`Invalid ${field.type} field (no options.result): ${field.id}`);

		default:
			console.warn(`Could not convert Airtable type '${field.type}' to a TypeScript type for field ${field.id}`);
			return null;
	}
};

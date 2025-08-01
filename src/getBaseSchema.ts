import axios from 'axios';
import {type Config} from '.';

export type FieldSchema = {
	id: string;
	type: string;
	name: string;
	description?: string;
	options?: object;
};

export type ViewSchema = {
	id: string;
	name: string;
	type: 'grid' | 'form' | 'calendar' | 'gallery' | 'kanban' | 'timeline' | 'block';
	visibleFieldIds?: string[];
};

export type BaseSchema = {
	id: string;
	name: string;
	primaryFieldId?: string;
	description?: string;
	fields: FieldSchema[];
	views: ViewSchema[];
}[];

/**
 * Get the schemas from the cache or Airtable API for the tables in the given base.
 * @see https://airtable.com/developers/web/api/get-base-schema
 * @param baseId The base id to get the schemas for
 */
export const getBaseSchema = async (baseId: string, options: Config): Promise<BaseSchema> => {
	const res = await axios<{tables: BaseSchema}>({
		baseURL: options.endpointUrl ?? 'https://api.airtable.com',
		url: `/v0/meta/bases/${baseId}/tables`,
		params: {
			include: ['visibleFieldIds'],
		},
		...(options.requestTimeout ? {timeout: options.requestTimeout} : {}),
		headers: {
			Authorization: `Bearer ${options.apiKey}`,
			...options.customHeaders,
		},
	});
	return res.data.tables;
};

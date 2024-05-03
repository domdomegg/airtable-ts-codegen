import axios from 'axios';
import { Config } from '.';

export type FieldSchema = {
  id: string,
  type: string,
  name: string,
  description?: string,
  options?: object,
};

export type BaseSchema = {
  id: string,
  name: string,
  description?: string,
  fields: FieldSchema[]
}[];

/**
 * Get the schemas from the cache or Airtable API for the tables in the given base.
 * @see https://airtable.com/developers/web/api/get-base-schema
 * @param baseId The base id to get the schemas for
 */
export const getBaseSchema = async (baseId: string, options: Config): Promise<BaseSchema> => {
  const res = await axios<{ tables: BaseSchema }>({
    baseURL: options.endpointUrl ?? 'https://api.airtable.com',
    url: `/v0/meta/bases/${baseId}/tables`,
    ...(options.requestTimeout ? { timeout: options.requestTimeout } : {}),
    headers: {
      // eslint-disable-next-line no-underscore-dangle
      Authorization: `Bearer ${options.apiKey}`,
      ...options.customHeaders,
    },
  });
  return res.data.tables;
};

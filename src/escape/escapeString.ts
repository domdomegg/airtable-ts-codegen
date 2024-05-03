/** Used for single-quoted strings. */
export const escapeString = (str: string): string => str.replace(/'/g, "\\'").replace(/\n/g, '\\n');

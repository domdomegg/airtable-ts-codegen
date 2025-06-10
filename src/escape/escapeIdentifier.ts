import {remove} from 'diacritics';

let invalidIdentifierCount = 0;
const DEFAULT_IDENTIFIER = 'invalidIdentifier';

// Track used identifiers to avoid duplicates
const usedIdentifiers = new Set<string>();

/**
 * Reset the internal state - useful for testing
 */
export function resetIdentifierState(): void {
	usedIdentifiers.clear();
	invalidIdentifierCount = 0;
}

/**
 * Checks if 'str' is already a valid JavaScript identifier.
 * If yes, returns true. Otherwise false.
 *
 * - Must conform to JavaScript identifier rules (e.g., no spaces, cannot start with a digit).
 * - Also dynamically tests against reserved words and invalid usages by attempting declaration.
 */
function isValidJsIdentifier(str: string): boolean {
	if (!/^[$A-Z_a-z][\w$]*$/.test(str)) {
		return false;
	}

	try {
		// Test against reserved words and invalid declarations
		// eslint-disable-next-line no-new, no-new-func
		new Function(`const ${str} = 1;`);
		return true;
	} catch {
		return false;
	}
}

/**
 * Converts a string to PascalCase:
 * - Trims and splits by whitespace.
 * - Capitalizes the first letter of each token.
 * Example:
 *   "hello world" -> "HelloWorld"
 *   "123 abc" -> "123Abc"
 */
function toPascalCase(str: string): string {
	return str
		.split(/\s+/)
		.map((token) => (token ? token[0]!.toUpperCase() + token.slice(1).toLowerCase() : ''))
		.join('');
}

/**
 * Used for identifiers:
 * - If the name is already a valid JS identifier, return it unmodified.
 * - Otherwise:
 *   - Remove invalid characters.
 *   - Convert to PascalCase.
 *   - If the result starts with a digit, prefix with `_`.
 *   - If duplicate, add a number suffix.
 * - Returns a default identifier if the identifier cannot be salvaged.
 */
export function escapeIdentifier(name: string): string {
	// Normalize string by removing diacritics and trimming whitespace
	const trimmed = remove(name).trim();

	// If already a valid identifier, return unchanged
	if (isValidJsIdentifier(trimmed)) {
		return trimmed;
	}

	// Sanitize: Remove invalid characters, preserving letters, numbers, underscores, and spaces for token splitting
	const sanitized = trimmed
		.replace(/[^\p{L}\p{N}_\s]+/gu, ' ') // Replace special characters with spaces
		.replace(/\s+/g, ' ') // Collapse multiple spaces
		.trim();

	// Return a default identifier if identifier is purely numeric after sanitization
	if (/^\d+$/.test(sanitized)) {
		invalidIdentifierCount += 1;
		console.warn(`Invalid identifier "${name}" became purely numeric after sanitization ("${sanitized}"). Using default identifier "${DEFAULT_IDENTIFIER}${invalidIdentifierCount}".`);
		return `${DEFAULT_IDENTIFIER}${invalidIdentifierCount}`;
	}

	// Convert sanitized string to PascalCase
	let pascal = toPascalCase(sanitized);

	// If it starts with a digit after conversion, prefix with an underscore
	if (/^\d/.test(pascal)) {
		pascal = `_${pascal}`;
	}

	// Final validation to ensure it conforms to JS identifier rules
	if (!isValidJsIdentifier(pascal)) {
		// Fallback: Strip all invalid characters, replace with underscores, and re-collapse
		const validStartIndex = pascal.search(/[$A-Za-z]/);
		if (validStartIndex === -1) {
			invalidIdentifierCount += 1;
			console.warn(`Invalid identifier "${name}" contains no valid starting character after sanitization. Using default identifier "${DEFAULT_IDENTIFIER}${invalidIdentifierCount}".`);
			return `${DEFAULT_IDENTIFIER}${invalidIdentifierCount}`;
		}

		pascal = pascal
			.slice(validStartIndex)
			.replace(/[^A-Za-z0-9_$]/g, '_')
			.replace(/_+/g, '_');

		pascal = toPascalCase(pascal);

		if (!isValidJsIdentifier(pascal) || pascal.length === 0) {
			invalidIdentifierCount += 1;
			console.warn(`Invalid identifier "${name}" could not be salvaged. Using default identifier "${DEFAULT_IDENTIFIER}${invalidIdentifierCount}".`);
			return `${DEFAULT_IDENTIFIER}${invalidIdentifierCount}`;
		}
	}

	// Handle duplicates by adding numbers
	let finalIdentifier = pascal;
	let counter = 2;

	while (usedIdentifiers.has(finalIdentifier)) {
		finalIdentifier = `${pascal}${counter}`;
		counter += 1;
	}

	usedIdentifiers.add(finalIdentifier);
	return finalIdentifier;
}

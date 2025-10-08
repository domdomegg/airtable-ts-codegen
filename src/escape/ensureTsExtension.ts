/**
 * Ensures the given filename ends with `.ts`.
 * Leaves `.tsx` and `.d.ts` files unchanged.
 */
export const ensureTsExtension = (filename: string): string => {
  if (filename.endsWith('.ts') || filename.endsWith('.tsx') || filename.endsWith('.d.ts')) {
    return filename;
  }
  return `${filename}.ts`;
};

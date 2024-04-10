export function createCatalogue<T extends { name: string }>(
  items: T[],
): Record<string, T> {
  const catalogue: Record<string, T> = {};
  for (const item of items) {
    catalogue[item.name] = item;
  }
  return catalogue;
}

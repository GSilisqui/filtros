import type { SavedFilter } from '@/data/views';

export function sortValues(values: string[]): string[] {
  return [...values].sort();
}

function filterSignature(f: SavedFilter): string {
  const cond = f.condition ?? 'É';
  return `${cond}::${sortValues(f.values).join('|')}`;
}

export function filtersEqual(a: SavedFilter[], b: SavedFilter[]): boolean {
  if (a.length !== b.length) return false;
  const mapA = new Map(a.map((f) => [f.categoryKey, filterSignature(f)]));
  for (const f of b) {
    if (mapA.get(f.categoryKey) !== filterSignature(f)) return false;
  }
  return true;
}

export function totalActiveFilters(filters: SavedFilter[]): number {
  return filters.reduce((acc, f) => acc + f.values.length, 0);
}

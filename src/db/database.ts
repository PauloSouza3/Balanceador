import type { Category, Contribution } from '../types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'renda_fixa',    label: 'Renda Fixa',        targetPct: 0.30, currentValue: 6166, color: '#378ADD', order: 1 },
  { id: 'tesouro',       label: 'Tesouro Direto',    targetPct: 0.05, currentValue: 750,  color: '#1D9E75', order: 2 },
  { id: 'acoes',         label: 'Ações',              targetPct: 0.30, currentValue: 4500, color: '#EF9F27', order: 3 },
  { id: 'fiis',          label: 'FIIs',               targetPct: 0.25, currentValue: 2584, color: '#D85A30', order: 4 },
  { id: 'internacional', label: 'Internacional',      targetPct: 0.10, currentValue: 1000, color: '#7F77DD', order: 5 },
];

const KEYS = {
  categories: 'rebalancer_categories',
  contributions: 'rebalancer_contributions',
  initialized: 'rebalancer_initialized',
};

function load<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function save<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Erro ao salvar dados:', e);
  }
}

export async function initDB(): Promise<void> {
  const initialized = localStorage.getItem(KEYS.initialized);
  if (!initialized) {
    save(KEYS.categories, DEFAULT_CATEGORIES);
    save(KEYS.contributions, []);
    localStorage.setItem(KEYS.initialized, '1');
  }
}

export async function getAllCategories(): Promise<Category[]> {
  return load<Category[]>(KEYS.categories) ?? DEFAULT_CATEGORIES;
}

export async function updateCategory(cat: Category): Promise<void> {
  const cats = await getAllCategories();
  const updated = cats.map(c => c.id === cat.id ? cat : c);
  save(KEYS.categories, updated);
}

export async function updateCategoryValue(id: string, newValue: number): Promise<void> {
  const cats = await getAllCategories();
  const updated = cats.map(c => c.id === id ? { ...c, currentValue: newValue } : c);
  save(KEYS.categories, updated);
}

export async function saveContribution(contribution: Contribution): Promise<void> {
  const contributions = load<Contribution[]>(KEYS.contributions) ?? [];
  contributions.push(contribution);
  save(KEYS.contributions, contributions);

  for (const alloc of contribution.allocations) {
    if (alloc.amountToInvest > 0) {
      await updateCategoryValue(alloc.categoryId, alloc.currentBefore + alloc.amountToInvest);
    }
  }
}

export async function undoLastContribution(): Promise<boolean> {
  const contributions = load<Contribution[]>(KEYS.contributions) ?? [];
  if (contributions.length === 0) return false;

  const last = contributions[contributions.length - 1];
  for (const alloc of last.allocations) {
    await updateCategoryValue(alloc.categoryId, alloc.currentBefore);
  }

  contributions.pop();
  save(KEYS.contributions, contributions);
  return true;
}

export async function getContributionsDesc(): Promise<Contribution[]> {
  const contributions = load<Contribution[]>(KEYS.contributions) ?? [];
  return [...contributions].reverse();
}

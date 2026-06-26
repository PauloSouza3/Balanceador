import { openDB, type IDBPDatabase } from 'idb';
import type { Category, Contribution } from '../types';
import type { InvestDB } from './schema';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'renda_fixa',    label: 'Renda Fixa',        targetPct: 0.30, currentValue: 6166, color: '#378ADD', order: 1 },
  { id: 'tesouro',       label: 'Tesouro Direto',    targetPct: 0.05, currentValue: 750,  color: '#1D9E75', order: 2 },
  { id: 'acoes',         label: 'Ações',              targetPct: 0.30, currentValue: 4500, color: '#EF9F27', order: 3 },
  { id: 'fiis',          label: 'FIIs',               targetPct: 0.25, currentValue: 2584, color: '#D85A30', order: 4 },
  { id: 'internacional', label: 'Internacional',      targetPct: 0.10, currentValue: 1000, color: '#7F77DD', order: 5 },
];

let dbInstance: IDBPDatabase<InvestDB> | null = null;

export async function initDB(): Promise<IDBPDatabase<InvestDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<InvestDB>('invest-rebalancer', 1, {
    upgrade(db) {
      const catStore = db.createObjectStore('categories', { keyPath: 'id' });
      catStore.createIndex('by-order', 'order');
      const contStore = db.createObjectStore('contributions', { keyPath: 'id' });
      contStore.createIndex('by-date', 'date');
      DEFAULT_CATEGORIES.forEach(cat => catStore.add(cat));
    },
  });

  return dbInstance;
}

async function getDB() {
  return initDB();
}

export async function getAllCategories(): Promise<Category[]> {
  const db = await getDB();
  const cats = await db.getAllFromIndex('categories', 'by-order');
  return cats;
}

export async function updateCategory(cat: Category): Promise<void> {
  const db = await getDB();
  await db.put('categories', cat);
}

export async function updateCategoryValue(id: string, newValue: number): Promise<void> {
  const db = await getDB();
  const cat = await db.get('categories', id);
  if (cat) {
    cat.currentValue = newValue;
    await db.put('categories', cat);
  }
}

export async function saveContribution(contribution: Contribution): Promise<void> {
  const db = await getDB();
  await db.add('contributions', contribution);
  for (const alloc of contribution.allocations) {
    if (alloc.amountToInvest > 0) {
      await updateCategoryValue(alloc.categoryId, alloc.currentBefore + alloc.amountToInvest);
    }
  }
}

export async function undoLastContribution(): Promise<boolean> {
  const db = await getDB();
  const all = await db.getAllFromIndex('contributions', 'by-date');
  if (all.length === 0) return false;

  const last = all[all.length - 1];
  for (const alloc of last.allocations) {
    await updateCategoryValue(alloc.categoryId, alloc.currentBefore);
  }
  await db.delete('contributions', last.id);
  return true;
}

export async function getContributionsDesc(): Promise<Contribution[]> {
  const db = await getDB();
  const all = await db.getAllFromIndex('contributions', 'by-date');
  return [...all].reverse();
}

export async function resetToDefaults(): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('categories', 'readwrite');
  for (const cat of DEFAULT_CATEGORIES) {
    await tx.store.put(cat);
  }
  await tx.done;
}

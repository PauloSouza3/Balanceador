import { useState, useEffect, useCallback } from 'react';
import type { Category } from '../types';
import { getAllCategories, updateCategory, updateCategoryValue } from '../db/database';

export function usePortfolio() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const cats = await getAllCategories();
    setCategories(cats);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const updateValue = useCallback(async (id: string, value: number) => {
    await updateCategoryValue(id, value);
    await refresh();
  }, [refresh]);

  const updateCat = useCallback(async (cat: Category) => {
    await updateCategory(cat);
    await refresh();
  }, [refresh]);

  const totalPortfolio = categories.reduce((s, c) => s + c.currentValue, 0);

  return { categories, loading, totalPortfolio, refresh, updateValue, updateCat };
}

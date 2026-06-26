import { useState, useEffect, useCallback } from 'react';
import type { Contribution } from '../types';
import { getContributionsDesc, saveContribution, undoLastContribution } from '../db/database';

export function useHistory() {
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    const data = await getContributionsDesc();
    setContributions(data);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const save = useCallback(async (contribution: Contribution) => {
    await saveContribution(contribution);
    await refresh();
  }, [refresh]);

  const undoLast = useCallback(async (): Promise<boolean> => {
    const ok = await undoLastContribution();
    if (ok) await refresh();
    return ok;
  }, [refresh]);

  return { contributions, loading, refresh, save, undoLast };
}

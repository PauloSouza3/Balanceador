export interface Category {
  id: string;
  label: string;
  targetPct: number;
  currentValue: number;
  color: string;
  order: number;
}

export interface ContributionAllocation {
  categoryId: string;
  targetValue: number;
  currentBefore: number;
  amountToInvest: number;
}

export interface Contribution {
  id: string;
  date: string;
  totalBefore: number;
  contributionAmount: number;
  totalAfter: number;
  allocations: ContributionAllocation[];
}

export interface AppSettings {
  lastUpdated: string;
  version: number;
}

export type Screen = 'dashboard' | 'rebalance' | 'history' | 'positions' | 'settings';

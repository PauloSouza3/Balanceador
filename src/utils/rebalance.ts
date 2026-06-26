import type { Category } from '../types';

export interface RebalanceInput {
  categories: Category[];
  contributionAmount: number;
}

export interface AllocationResult {
  categoryId: string;
  label: string;
  color: string;
  targetPct: number;
  targetValue: number;
  currentValue: number;
  amountToInvest: number;
  isNegative: boolean;
}

export interface RebalanceOutput {
  totalBefore: number;
  totalAfter: number;
  allocations: AllocationResult[];
  totalAllocated: number;
  remainder: number;
}

export function calculateRebalance(input: RebalanceInput): RebalanceOutput {
  const totalBefore = input.categories.reduce((sum, c) => sum + c.currentValue, 0);
  const totalAfter = totalBefore + input.contributionAmount;

  const allocations: AllocationResult[] = input.categories.map(cat => {
    const targetValue = totalAfter * cat.targetPct;
    const amountToInvest = targetValue - cat.currentValue;
    return {
      categoryId: cat.id,
      label: cat.label,
      color: cat.color,
      targetPct: cat.targetPct,
      targetValue,
      currentValue: cat.currentValue,
      amountToInvest,
      isNegative: amountToInvest < 0,
    };
  });

  const totalAllocated = allocations
    .filter(a => a.amountToInvest > 0)
    .reduce((sum, a) => sum + a.amountToInvest, 0);

  return {
    totalBefore,
    totalAfter,
    allocations,
    totalAllocated,
    remainder: input.contributionAmount - totalAllocated,
  };
}

import type { Category } from '../types';

export function validateTargets(categories: Category[]): string | null {
  const sum = categories.reduce((s, c) => s + c.targetPct, 0);
  const rounded = Math.round(sum * 1000) / 1000;
  if (Math.abs(rounded - 1) > 0.001) {
    const pct = (sum * 100).toFixed(1);
    return `Suas metas somam ${pct}% — ajuste para exatamente 100%`;
  }
  return null;
}

export function validateContribution(value: number): string | null {
  if (value <= 0) return 'Informe um valor de aporte maior que zero';
  if (value > 10_000_000) return 'Valor muito alto';
  return null;
}

import type { Category } from '../types';
import { CategoryCard } from '../components/CategoryCard';
import { formatBRL } from '../utils/format';

interface Props {
  categories: Category[];
  totalPortfolio: number;
  onUpdateValue: (id: string, value: number) => Promise<void>;
}

export function Positions({ categories, totalPortfolio, onUpdateValue }: Props) {
  const sumTargets = categories.reduce((s, c) => s + c.targetPct, 0);
  const sumError = Math.abs(sumTargets - 1) > 0.001;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <h1 style={{ margin: 0, fontSize: 22, color: '#e8f0ff', fontWeight: 800 }}>Posições</h1>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: '#5a6a8a' }}>Total</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#378ADD' }}>{formatBRL(totalPortfolio)}</div>
        </div>
      </div>

      {sumError && (
        <div style={{
          background: '#EF9F2722', border: '1px solid #EF9F2755',
          borderRadius: 12, padding: '10px 14px', color: '#EF9F27', fontSize: 13,
        }}>
          ⚠️ Suas metas somam {(sumTargets * 100).toFixed(1)}% — ajuste na aba Metas para 100%
        </div>
      )}

      {categories.map(cat => (
        <CategoryCard
          key={cat.id}
          category={cat}
          totalPortfolio={totalPortfolio}
          onUpdateValue={onUpdateValue}
        />
      ))}

      <div style={{ height: 8 }} />
    </div>
  );
}

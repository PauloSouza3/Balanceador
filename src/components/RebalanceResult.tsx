import type { RebalanceOutput } from '../utils/rebalance';
import { formatBRL, formatPct } from '../utils/format';
import { TrendingDown } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';

interface Props {
  result: RebalanceOutput;
}

export function RebalanceResult({ result }: Props) {
  const { theme } = useTheme();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {result.allocations.map(a => (
        <div key={a.categoryId} style={{
          background: theme.bgCard,
          borderRadius: 14,
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderLeft: `4px solid ${a.color}`,
          border: `1px solid ${theme.borderLight}`,
          borderLeftColor: a.color,
          borderLeftWidth: 4,
          opacity: a.isNegative ? 0.65 : 1,
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 14, color: theme.textPrimary }}>{a.label}</div>
            <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 1 }}>
              Meta: {formatPct(a.targetPct)} · Alvo: {formatBRL(a.targetValue)}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            {a.isNegative ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#D85A30' }}>
                <TrendingDown size={14} />
                <span style={{ fontSize: 12, fontWeight: 600 }}>Acima da meta</span>
              </div>
            ) : (
              <div style={{ fontSize: 18, fontWeight: 800, color: '#1D9E75' }}>
                {formatBRL(a.amountToInvest)}
              </div>
            )}
          </div>
        </div>
      ))}

      <div style={{
        background: theme.bgInput,
        borderRadius: 14,
        padding: '14px 16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
        border: `1px solid ${theme.border}`,
      }}>
        <span style={{ color: theme.textSecondary, fontSize: 13, fontWeight: 600 }}>Total a investir</span>
        <span style={{ color: '#378ADD', fontSize: 20, fontWeight: 800 }}>
          {formatBRL(result.totalAllocated)}
        </span>
      </div>

      {Math.abs(result.remainder) > 0.5 && (
        <div style={{
          background: '#EF9F2722',
          border: '1px solid #EF9F2755',
          borderRadius: 12,
          padding: '10px 14px',
          fontSize: 13,
          color: '#EF9F27',
        }}>
          Sobra não alocada: {formatBRL(result.remainder)} (categorias acima da meta)
        </div>
      )}
    </div>
  );
}

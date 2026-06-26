import type { RebalanceOutput } from '../utils/rebalance';
import { formatBRL, formatShortDate } from '../utils/format';
import { CheckCircle, X } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';

interface Props {
  result: RebalanceOutput;
  contributionAmount: number;
  onConfirm: () => void;
  onCancel: () => void;
  saving?: boolean;
}

export function ConfirmSheet({ result, contributionAmount, onConfirm, onCancel, saving }: Props) {
  const { theme } = useTheme();
  return (
    <>
      <div onClick={onCancel} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200 }} />
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 480,
        background: theme.bgCard,
        borderRadius: '24px 24px 0 0',
        padding: '24px 20px 40px',
        zIndex: 201,
        boxShadow: '0 -8px 40px rgba(0,0,0,0.2)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 18, color: theme.textPrimary }}>Confirmar aporte</h2>
          <button onClick={onCancel} style={{ background: 'none', border: 'none', cursor: 'pointer', color: theme.textMuted }}>
            <X size={22} />
          </button>
        </div>

        <p style={{ color: theme.textSecondary, fontSize: 14, marginBottom: 16, lineHeight: 1.5 }}>
          Registrar um aporte de{' '}
          <strong style={{ color: '#378ADD' }}>{formatBRL(contributionAmount)}</strong>{' '}
          em {formatShortDate(new Date().toISOString().slice(0, 10))}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
          {result.allocations.filter(a => !a.isNegative).map(a => (
            <div key={a.categoryId} style={{
              display: 'flex', justifyContent: 'space-between',
              padding: '8px 12px', background: theme.bgInput, borderRadius: 10,
            }}>
              <span style={{ color: theme.textSecondary, fontSize: 13 }}>{a.label}</span>
              <span style={{ color: '#1D9E75', fontWeight: 700, fontSize: 14 }}>
                {formatBRL(a.amountToInvest)}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: 16, borderRadius: 14,
            background: theme.bgInput, border: 'none', cursor: 'pointer',
            color: theme.textSecondary, fontWeight: 600, fontSize: 15,
          }}>
            Cancelar
          </button>
          <button onClick={onConfirm} disabled={saving} style={{
            flex: 2, padding: 16, borderRadius: 14,
            background: saving ? theme.bgInput : 'linear-gradient(135deg, #378ADD, #1D9E75)',
            border: 'none', cursor: saving ? 'default' : 'pointer',
            color: saving ? theme.textMuted : '#fff', fontWeight: 700, fontSize: 15,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <CheckCircle size={18} />
            {saving ? 'Salvando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </>
  );
}

import { useState } from 'react';
import type { Contribution } from '../types';
import { formatBRL, formatMonth } from '../utils/format';
import { Undo2, ChevronDown, ChevronUp } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';

interface Props {
  contributions: Contribution[];
  onUndoLast: () => Promise<boolean>;
}

function ContributionItem({ contribution }: { contribution: Contribution }) {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div style={{
      background: theme.bgCard, borderRadius: 16, overflow: 'hidden',
      border: `1px solid ${theme.borderLight}`, boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', background: 'none', border: 'none',
          padding: '14px 16px', cursor: 'pointer',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}
      >
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: theme.textPrimary, textTransform: 'capitalize' }}>
            {formatMonth(contribution.date)}
          </div>
          <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>
            {formatBRL(contribution.totalBefore)} → {formatBRL(contribution.totalAfter)}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 16, fontWeight: 800, color: '#1D9E75' }}>
            +{formatBRL(contribution.contributionAmount)}
          </span>
          {open ? <ChevronUp size={16} color={theme.textMuted} /> : <ChevronDown size={16} color={theme.textMuted} />}
        </div>
      </button>

      {open && (
        <div style={{ borderTop: `1px solid ${theme.borderLight}`, padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {contribution.allocations.filter(a => a.amountToInvest > 0).map(a => (
            <div key={a.categoryId} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, color: theme.textSecondary }}>{a.categoryId}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#1D9E75' }}>
                {formatBRL(a.amountToInvest)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function History({ contributions, onUndoLast }: Props) {
  const { theme } = useTheme();
  const [undoing, setUndoing] = useState(false);
  const [confirmUndo, setConfirmUndo] = useState(false);

  const handleUndo = async () => {
    setUndoing(true);
    await onUndoLast();
    setUndoing(false);
    setConfirmUndo(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ margin: 0, fontSize: 22, color: theme.textPrimary, fontWeight: 800 }}>Histórico</h1>
        {contributions.length > 0 && (
          <button
            onClick={() => setConfirmUndo(true)}
            style={{
              background: theme.bgInput, border: `1px solid ${theme.border}`,
              borderRadius: 10, padding: '8px 12px', cursor: 'pointer',
              color: '#D85A30', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600,
            }}
          >
            <Undo2 size={14} />
            Desfazer último
          </button>
        )}
      </div>

      {confirmUndo && (
        <>
          <div onClick={() => setConfirmUndo(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200 }} />
          <div style={{
            position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
            width: '100%', maxWidth: 480,
            background: theme.bgCard, borderRadius: '24px 24px 0 0',
            padding: '24px 20px 40px', zIndex: 201,
            boxShadow: '0 -8px 40px rgba(0,0,0,0.15)',
          }}>
            <h3 style={{ margin: '0 0 12px', color: theme.textPrimary }}>Desfazer último aporte?</h3>
            <p style={{ color: theme.textSecondary, fontSize: 14, margin: '0 0 20px' }}>
              As posições serão revertidas para antes do aporte de {contributions[0] && formatMonth(contributions[0].date)}.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setConfirmUndo(false)} style={{
                flex: 1, padding: 14, borderRadius: 12, background: theme.bgInput, border: 'none',
                cursor: 'pointer', color: theme.textSecondary, fontWeight: 600,
              }}>Cancelar</button>
              <button onClick={handleUndo} disabled={undoing} style={{
                flex: 1, padding: 14, borderRadius: 12, background: '#D85A30', border: 'none',
                cursor: 'pointer', color: '#fff', fontWeight: 700,
              }}>
                {undoing ? 'Desfazendo...' : 'Confirmar'}
              </button>
            </div>
          </div>
        </>
      )}

      {contributions.length === 0 ? (
        <div style={{ textAlign: 'center', color: theme.textMuted, padding: '60px 20px' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6, color: theme.textSecondary }}>
            Nenhum aporte registrado
          </div>
          <div style={{ fontSize: 14 }}>Use a aba Aportar para registrar seu primeiro aporte</div>
        </div>
      ) : (
        contributions.map(c => (
          <ContributionItem key={c.id} contribution={c} />
        ))
      )}
    </div>
  );
}

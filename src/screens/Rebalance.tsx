import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import type { Category, Contribution } from '../types';
import { CurrencyInput } from '../components/CurrencyInput';
import { RebalanceResult } from '../components/RebalanceResult';
import { ConfirmSheet } from '../components/ConfirmSheet';
import { calculateRebalance, type RebalanceOutput } from '../utils/rebalance';
import { validateContribution } from '../utils/validation';
import { formatBRL } from '../utils/format';
import { ChevronRight } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';

interface Props {
  categories: Category[];
  totalPortfolio: number;
  onSave: (contribution: Contribution) => Promise<void>;
}

export function Rebalance({ categories, totalPortfolio, onSave }: Props) {
  const { theme } = useTheme();
  const [amount, setAmount] = useState(0);
  const [result, setResult] = useState<RebalanceOutput | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleCalculate = () => {
    const err = validateContribution(amount);
    if (err) { setError(err); return; }
    setError(null);
    const r = calculateRebalance({ categories, contributionAmount: amount });
    setResult(r);
    setSuccess(false);
  };

  const handleConfirm = async () => {
    if (!result) return;
    setSaving(true);
    const contribution: Contribution = {
      id: uuid(),
      date: new Date().toISOString().slice(0, 10),
      totalBefore: result.totalBefore,
      contributionAmount: amount,
      totalAfter: result.totalAfter,
      allocations: result.allocations.map(a => ({
        categoryId: a.categoryId,
        targetValue: a.targetValue,
        currentBefore: a.currentValue,
        amountToInvest: Math.max(0, a.amountToInvest),
      })),
    };
    await onSave(contribution);
    setSaving(false);
    setShowConfirm(false);
    setResult(null);
    setAmount(0);
    setSuccess(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h1 style={{ margin: 0, fontSize: 22, color: theme.textPrimary, fontWeight: 800 }}>Calcular Aporte</h1>

      {success && (
        <div style={{
          background: '#1D9E7522', border: '1px solid #1D9E7555',
          borderRadius: 14, padding: '14px 16px', color: '#1D9E75', fontWeight: 600,
        }}>
          ✓ Aporte registrado com sucesso! Posições atualizadas.
        </div>
      )}

      <div style={{
        background: theme.bgCard, borderRadius: 16, padding: 16,
        border: `1px solid ${theme.borderLight}`,
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      }}>
        <div style={{ fontSize: 13, color: theme.textMuted, marginBottom: 2 }}>Patrimônio atual</div>
        <div style={{ fontSize: 24, fontWeight: 800, color: '#378ADD' }}>{formatBRL(totalPortfolio)}</div>
      </div>

      <CurrencyInput
        value={amount}
        onChange={v => { setAmount(v); setError(null); }}
        label="Valor do aporte (R$)"
      />

      {error && (
        <div style={{ color: '#D85A30', fontSize: 13, background: '#D85A3022', borderRadius: 10, padding: '10px 14px' }}>
          {error}
        </div>
      )}

      <button
        onClick={handleCalculate}
        disabled={amount <= 0}
        style={{
          background: amount > 0 ? 'linear-gradient(135deg, #378ADD, #2a6aad)' : theme.bgInput,
          border: 'none', borderRadius: 14, padding: '16px 24px',
          fontSize: 15, fontWeight: 700,
          color: amount > 0 ? '#fff' : theme.textMuted,
          cursor: amount > 0 ? 'pointer' : 'default',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          transition: 'all 0.2s',
        }}
      >
        Calcular rebalanceamento
        <ChevronRight size={18} />
      </button>

      {result && (
        <>
          <h2 style={{ margin: 0, fontSize: 16, color: theme.textSecondary, fontWeight: 600 }}>Resultado</h2>
          <RebalanceResult result={result} />
          <button
            onClick={() => setShowConfirm(true)}
            style={{
              background: 'linear-gradient(135deg, #1D9E75, #16704f)',
              border: 'none', borderRadius: 14, padding: '16px 24px',
              fontSize: 15, fontWeight: 700, color: '#fff',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 4px 20px rgba(29,158,117,0.3)',
            }}
          >
            Confirmar e salvar aporte
          </button>
        </>
      )}

      {showConfirm && result && (
        <ConfirmSheet
          result={result}
          contributionAmount={amount}
          onConfirm={handleConfirm}
          onCancel={() => setShowConfirm(false)}
          saving={saving}
        />
      )}
    </div>
  );
}

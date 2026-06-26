import { useState } from 'react';
import { Pencil, Check, X } from 'lucide-react';
import type { Category } from '../types';
import { formatBRL, formatPct } from '../utils/format';
import { useTheme } from '../theme/ThemeContext';

interface Props {
  category: Category;
  totalPortfolio: number;
  onUpdateValue: (id: string, value: number) => Promise<void>;
}

function getStatus(currentPct: number, targetPct: number): { color: string; label: string } {
  const diff = Math.abs(currentPct - targetPct);
  if (diff <= 0.02) return { color: '#1D9E75', label: 'Na meta' };
  if (diff <= 0.05) return { color: '#EF9F27', label: 'Desviado' };
  return { color: '#D85A30', label: 'Atenção' };
}

export function CategoryCard({ category, totalPortfolio, onUpdateValue }: Props) {
  const { theme } = useTheme();
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [saving, setSaving] = useState(false);

  const currentPct = totalPortfolio > 0 ? category.currentValue / totalPortfolio : 0;
  const targetValue = totalPortfolio * category.targetPct;
  const progress = targetValue > 0 ? Math.min(category.currentValue / targetValue, 1) : 0;
  const { color: statusColor, label: statusLabel } = getStatus(currentPct, category.targetPct);

  const handleEdit = () => {
    setInputVal(category.currentValue > 0 ? String(Math.round(category.currentValue * 100)) : '');
    setEditing(true);
  };

  const handleSave = async () => {
    const raw = inputVal.replace(/[^\d]/g, '');
    const numeric = parseInt(raw || '0', 10) / 100;
    setSaving(true);
    await onUpdateValue(category.id, numeric);
    setSaving(false);
    setEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, '');
    setInputVal(raw);
  };

  const displayedInput = inputVal
    ? formatBRL(parseInt(inputVal, 10) / 100)
    : '';

  return (
    <div style={{
      background: theme.bgCard,
      borderRadius: 16,
      padding: 16,
      borderLeft: `4px solid ${category.color}`,
      border: `1px solid ${theme.borderLight}`,
      borderLeftColor: category.color,
      borderLeftWidth: 4,
      boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: theme.textPrimary }}>{category.label}</span>
            <span style={{
              fontSize: 11, fontWeight: 600, padding: '2px 8px',
              borderRadius: 20, background: statusColor + '22', color: statusColor,
            }}>{statusLabel}</span>
          </div>
          <div style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>
            Meta: {formatPct(category.targetPct)} · Atual: {formatPct(currentPct)}
          </div>
        </div>
        {!editing && (
          <button onClick={handleEdit} style={{
            background: theme.bgInput, border: 'none', borderRadius: 8,
            padding: '6px 10px', cursor: 'pointer', color: '#378ADD',
          }}>
            <Pencil size={14} />
          </button>
        )}
      </div>

      {editing ? (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            autoFocus
            type="tel"
            inputMode="numeric"
            value={displayedInput}
            onChange={handleInputChange}
            placeholder="R$ 0,00"
            style={{
              flex: 1, background: theme.bgInput, border: '1px solid #378ADD',
              borderRadius: 10, padding: '10px 12px', fontSize: 16,
              fontWeight: 700, color: theme.textPrimary, outline: 'none',
            }}
          />
          <button onClick={handleSave} disabled={saving} style={{
            background: '#1D9E75', border: 'none', borderRadius: 10,
            padding: '10px 12px', cursor: 'pointer', color: '#fff',
          }}>
            <Check size={16} />
          </button>
          <button onClick={() => setEditing(false)} style={{
            background: '#D85A30', border: 'none', borderRadius: 10,
            padding: '10px 12px', cursor: 'pointer', color: '#fff',
          }}>
            <X size={16} />
          </button>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 18, fontWeight: 800, color: theme.textPrimary }}>
              {formatBRL(category.currentValue)}
            </span>
            <span style={{ fontSize: 13, color: theme.textMuted }}>
              meta {formatBRL(targetValue)}
            </span>
          </div>
          <div style={{ background: theme.bgInput, borderRadius: 99, height: 6, overflow: 'hidden' }}>
            <div style={{
              width: `${progress * 100}%`,
              height: '100%',
              background: `linear-gradient(90deg, ${category.color}88, ${category.color})`,
              borderRadius: 99,
              transition: 'width 0.4s ease',
            }} />
          </div>
        </div>
      )}
    </div>
  );
}

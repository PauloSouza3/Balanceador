import { useState, useEffect } from 'react';
import type { Category } from '../types';
import { Check, AlertTriangle, Save } from 'lucide-react';
import { useTheme } from '../theme/ThemeContext';

interface Props {
  categories: Category[];
  onUpdateCat: (cat: Category) => Promise<void>;
}

export function Settings({ categories, onUpdateCat }: Props) {
  const { theme } = useTheme();
  const [locals, setLocals] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setLocals(categories.map(c => ({ ...c })));
  }, [categories]);

  const sumTargets = locals.reduce((s, c) => s + c.targetPct, 0);
  const sumOk = Math.abs(sumTargets - 1) <= 0.001;
  const sumColor = sumOk ? '#1D9E75' : sumTargets > 1 ? '#D85A30' : '#EF9F27';

  const handlePctChange = (id: string, raw: string) => {
    const val = parseFloat(raw.replace(',', '.')) || 0;
    setLocals(prev => prev.map(c => c.id === id ? { ...c, targetPct: Math.min(100, Math.max(0, val)) / 100 } : c));
    setSaved(false);
  };

  const handleSaveAll = async () => {
    if (!sumOk) return;
    setSaving(true);
    for (const cat of locals) {
      await onUpdateCat(cat);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <h1 style={{ margin: 0, fontSize: 22, color: theme.textPrimary, fontWeight: 800 }}>Metas</h1>

      {/* Indicador de soma */}
      <div style={{
        background: theme.bgCard, borderRadius: 14, padding: '14px 16px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        border: `1px solid ${sumColor}55`,
        boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
      }}>
        <div>
          <div style={{ fontSize: 13, color: theme.textSecondary }}>Soma das metas</div>
          {!sumOk && (
            <div style={{ fontSize: 12, color: sumColor, marginTop: 2 }}>
              {sumTargets > 1
                ? `Excedendo em ${((sumTargets - 1) * 100).toFixed(1)}%`
                : `Faltam ${((1 - sumTargets) * 100).toFixed(1)}% para completar`}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {sumOk && <Check size={16} color="#1D9E75" />}
          {!sumOk && <AlertTriangle size={16} color={sumColor} />}
          <span style={{ fontSize: 22, fontWeight: 900, color: sumColor }}>
            {(sumTargets * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Cards de categoria */}
      {locals.map(cat => (
        <div key={cat.id} style={{
          background: theme.bgCard,
          borderRadius: 16,
          padding: 16,
          border: `1px solid ${theme.borderLight}`,
          borderLeftColor: cat.color,
          borderLeftWidth: 4,
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: cat.color }} />
            <span style={{ fontSize: 15, fontWeight: 700, color: theme.textPrimary }}>{cat.label}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Botões -/+ */}
            <button
              onClick={() => handlePctChange(cat.id, String(Math.max(0, cat.targetPct * 100 - 1)))}
              style={{
                width: 38, height: 38, borderRadius: 10, border: `1px solid ${theme.border}`,
                background: theme.bgInput, cursor: 'pointer', fontSize: 20,
                color: theme.textPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}
            >−</button>

            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={(cat.targetPct * 100).toFixed(1)}
                onChange={e => handlePctChange(cat.id, e.target.value)}
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: theme.bgInput, border: `1px solid ${theme.border}`,
                  borderRadius: 10, padding: '10px 32px 10px 12px',
                  fontSize: 18, fontWeight: 800, color: theme.textPrimary,
                  outline: 'none', textAlign: 'center',
                }}
                onFocus={e => (e.target.style.borderColor = '#378ADD')}
                onBlur={e => (e.target.style.borderColor = theme.border)}
              />
              <span style={{
                position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                color: theme.textMuted, fontSize: 14, fontWeight: 600, pointerEvents: 'none',
              }}>%</span>
            </div>

            <button
              onClick={() => handlePctChange(cat.id, String(Math.min(100, cat.targetPct * 100 + 1)))}
              style={{
                width: 38, height: 38, borderRadius: 10, border: `1px solid ${theme.border}`,
                background: theme.bgInput, cursor: 'pointer', fontSize: 20,
                color: theme.textPrimary, display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}
            >+</button>
          </div>
        </div>
      ))}

      {/* Botão único salvar tudo */}
      <button
        onClick={handleSaveAll}
        disabled={!sumOk || saving}
        style={{
          background: saved
            ? '#1D9E75'
            : !sumOk || saving
            ? theme.bgInput
            : 'linear-gradient(135deg, #378ADD, #1D9E75)',
          border: 'none', borderRadius: 16,
          padding: '18px 24px',
          fontSize: 16, fontWeight: 700,
          color: !sumOk ? theme.textMuted : '#fff',
          cursor: !sumOk || saving ? 'default' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          boxShadow: sumOk && !saving ? '0 4px 20px rgba(55,138,221,0.25)' : 'none',
          transition: 'all 0.3s',
        }}
      >
        {saved ? (
          <><Check size={20} /> Metas salvas!</>
        ) : saving ? (
          'Salvando...'
        ) : (
          <><Save size={20} /> Salvar todas as metas</>
        )}
      </button>

      {!sumOk && (
        <div style={{
          background: '#EF9F2715', border: '1px solid #EF9F2744',
          borderRadius: 12, padding: '10px 14px',
          color: '#EF9F27', fontSize: 13, textAlign: 'center',
        }}>
          Ajuste os valores para que a soma seja exatamente 100%
        </div>
      )}

      <div style={{ height: 8 }} />
    </div>
  );
}

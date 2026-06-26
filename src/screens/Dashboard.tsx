import { Calculator, Sun, Moon } from 'lucide-react';
import type { Category, Screen } from '../types';
import { DonutChart } from '../components/DonutChart';
import { CategoryCard } from '../components/CategoryCard';
import { formatBRL } from '../utils/format';
import { useTheme } from '../theme/ThemeContext';

interface Props {
  categories: Category[];
  totalPortfolio: number;
  onNavigate: (s: Screen) => void;
  onUpdateValue: (id: string, value: number) => Promise<void>;
}

export function Dashboard({ categories, totalPortfolio, onNavigate, onUpdateValue }: Props) {
  const { theme, isDark, toggle } = useTheme();
  const now = new Date();
  const monthYear = now.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 13, color: theme.textMuted, textTransform: 'capitalize' }}>{monthYear}</div>
          <h1 style={{ margin: 0, fontSize: 22, color: theme.textPrimary, fontWeight: 800 }}>Minha Carteira</h1>
        </div>
        <button
          onClick={toggle}
          title={isDark ? 'Modo claro' : 'Modo escuro'}
          style={{
            background: theme.bgInput,
            border: `1px solid ${theme.border}`,
            borderRadius: 12,
            padding: '8px 12px',
            cursor: 'pointer',
            color: isDark ? '#EF9F27' : '#378ADD',
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 13, fontWeight: 600,
          }}
        >
          {isDark ? <Sun size={16} /> : <Moon size={16} />}
          {isDark ? 'Claro' : 'Escuro'}
        </button>
      </div>

      <div style={{
        background: isDark
          ? 'linear-gradient(135deg, #1a2a4a, #16213e)'
          : 'linear-gradient(135deg, #378ADD, #1D9E75)',
        borderRadius: 20,
        padding: 24,
        border: `1px solid ${theme.border}`,
      }}>
        <div style={{ fontSize: 13, color: isDark ? '#5a6a8a' : 'rgba(255,255,255,0.75)', marginBottom: 4 }}>
          Patrimônio total
        </div>
        <div style={{ fontSize: 34, fontWeight: 900, color: isDark ? '#e8f0ff' : '#fff', letterSpacing: -0.5 }}>
          {formatBRL(totalPortfolio)}
        </div>
      </div>

      <div style={{
        background: theme.bgCard,
        borderRadius: 20,
        padding: 20,
        border: `1px solid ${theme.borderLight}`,
        boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
      }}>
        <div style={{ fontSize: 14, color: theme.textSecondary, fontWeight: 600, marginBottom: 16 }}>
          Distribuição atual
        </div>
        <DonutChart categories={categories} totalPortfolio={totalPortfolio} />
      </div>

      <div>
        <div style={{ fontSize: 14, color: theme.textSecondary, fontWeight: 600, marginBottom: 12 }}>
          Posições — toque no lápis ✏️ para editar
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {categories.map(cat => (
            <CategoryCard
              key={cat.id}
              category={cat}
              totalPortfolio={totalPortfolio}
              onUpdateValue={onUpdateValue}
            />
          ))}
        </div>
      </div>

      <button
        onClick={() => onNavigate('rebalance')}
        style={{
          background: 'linear-gradient(135deg, #378ADD, #1D9E75)',
          border: 'none', borderRadius: 16,
          padding: '18px 24px',
          fontSize: 16, fontWeight: 700, color: '#fff',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          boxShadow: '0 4px 20px rgba(55,138,221,0.25)',
        }}
      >
        <Calculator size={20} />
        Calcular aporte do mês
      </button>

      <div style={{ height: 8 }} />
    </div>
  );
}

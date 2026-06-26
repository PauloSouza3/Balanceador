import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { Category } from '../types';
import { formatBRL, formatPct } from '../utils/format';
import { useTheme } from '../theme/ThemeContext';

interface Props {
  categories: Category[];
  totalPortfolio: number;
}

export function DonutChart({ categories, totalPortfolio }: Props) {
  const { theme } = useTheme();

  const data = categories.map(c => ({
    name: c.label,
    value: c.currentValue,
    color: c.color,
    pct: totalPortfolio > 0 ? c.currentValue / totalPortfolio : 0,
  }));

  if (totalPortfolio === 0) {
    return (
      <div style={{ textAlign: 'center', color: theme.textMuted, padding: 40 }}>
        Nenhum valor cadastrado ainda
      </div>
    );
  }

  return (
    <div>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={95}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} stroke="none" />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [formatBRL(value), '']}
            contentStyle={{
              background: theme.bgCard,
              border: `1px solid ${theme.border}`,
              borderRadius: 8,
              color: theme.textPrimary,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', justifyContent: 'center', marginTop: 8 }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: theme.textSecondary }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: d.color, flexShrink: 0 }} />
            <span>{d.name}</span>
            <span style={{ color: theme.textPrimary, fontWeight: 600 }}>{formatPct(d.pct)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

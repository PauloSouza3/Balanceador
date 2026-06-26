import { PieChart, Calculator, History, Settings, type LucideIcon } from 'lucide-react';
import type { Screen } from '../types';
import { useTheme } from '../theme/ThemeContext';

interface Props {
  active: Screen;
  onNavigate: (s: Screen) => void;
}

const tabs: { id: Screen; label: string; Icon: LucideIcon }[] = [
  { id: 'dashboard',  label: 'Carteira',  Icon: PieChart },
  { id: 'rebalance',  label: 'Aportar',   Icon: Calculator },
  { id: 'history',    label: 'Histórico', Icon: History },
  { id: 'settings',   label: 'Metas',     Icon: Settings },
];

export function BottomNav({ active, onNavigate }: Props) {
  const { theme } = useTheme();
  return (
    <nav style={{
      position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
      width: '100%', maxWidth: 480,
      background: theme.bgNav, borderTop: `1px solid ${theme.navBorder}`,
      display: 'flex', zIndex: 100,
      boxShadow: '0 -2px 16px rgba(0,0,0,0.08)',
    }}>
      {tabs.map(({ id, label, Icon }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: 4, padding: '10px 0', border: 'none', background: 'none', cursor: 'pointer',
              color: isActive ? '#378ADD' : theme.textMuted,
              fontWeight: isActive ? 600 : 400,
              fontSize: 11, transition: 'color 0.2s',
            }}
          >
            <Icon size={22} />
            {label}
          </button>
        );
      })}
    </nav>
  );
}

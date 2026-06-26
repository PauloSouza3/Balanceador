import { useRef } from 'react';
import { formatBRL } from '../utils/format';
import { useTheme } from '../theme/ThemeContext';

interface Props {
  value: number;
  onChange: (v: number) => void;
  label: string;
  placeholder?: string;
}

export function CurrencyInput({ value, onChange, label, placeholder = 'R$ 0,00' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { theme } = useTheme();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d]/g, '');
    const numeric = parseInt(raw || '0', 10) / 100;
    onChange(numeric);
  };

  const displayed = value > 0 ? formatBRL(value) : '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 13, color: theme.textSecondary, fontWeight: 500 }}>{label}</label>
      <input
        ref={inputRef}
        type="tel"
        inputMode="numeric"
        value={displayed}
        onChange={handleChange}
        placeholder={placeholder}
        style={{
          background: theme.bgInput,
          border: `1px solid ${theme.border}`,
          borderRadius: 12,
          padding: '14px 16px',
          fontSize: 20,
          fontWeight: 700,
          color: theme.textPrimary,
          outline: 'none',
          width: '100%',
          boxSizing: 'border-box',
          letterSpacing: 0.5,
        }}
        onFocus={e => (e.target.style.borderColor = '#378ADD')}
        onBlur={e => (e.target.style.borderColor = theme.border)}
      />
    </div>
  );
}

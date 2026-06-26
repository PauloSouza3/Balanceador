export const formatBRL = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export const formatPct = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'percent', maximumFractionDigits: 1 }).format(value);

export const formatMonth = (isoDate: string) => {
  const d = new Date(isoDate + 'T12:00:00');
  return d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
};

export const formatShortDate = (isoDate: string) => {
  const d = new Date(isoDate + 'T12:00:00');
  return d.toLocaleDateString('pt-BR');
};

export const parseBRL = (formatted: string): number => {
  const clean = formatted.replace(/[^\d]/g, '');
  return parseInt(clean || '0', 10) / 100;
};

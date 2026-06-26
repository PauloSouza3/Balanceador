export interface Theme {
  bg: string;
  bgCard: string;
  bgInput: string;
  bgNav: string;
  border: string;
  borderLight: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  navBorder: string;
}

export const darkTheme: Theme = {
  bg: '#0d1627',
  bgCard: '#16213e',
  bgInput: '#1a2a4a',
  bgNav: '#16213e',
  border: '#2a3a5a',
  borderLight: '#1a2a4a',
  textPrimary: '#e8f0ff',
  textSecondary: '#8a9bbf',
  textMuted: '#5a6a8a',
  navBorder: '#1a2a4a',
};

export const lightTheme: Theme = {
  bg: '#f0f4fa',
  bgCard: '#ffffff',
  bgInput: '#eef2f8',
  bgNav: '#ffffff',
  border: '#cbd5e8',
  borderLight: '#e2e8f5',
  textPrimary: '#1a2a4a',
  textSecondary: '#4a5a7a',
  textMuted: '#8a9bbf',
  navBorder: '#e2e8f5',
};

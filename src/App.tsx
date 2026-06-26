import { useState, useEffect } from 'react';
import { initDB } from './db/database';
import { usePortfolio } from './hooks/usePortfolio';
import { useHistory } from './hooks/useHistory';
import { BottomNav } from './components/BottomNav';
import { Dashboard } from './screens/Dashboard';
import { Rebalance } from './screens/Rebalance';
import { Positions } from './screens/Positions';
import { History } from './screens/History';
import { Settings } from './screens/Settings';
import { ThemeProvider, useTheme } from './theme/ThemeContext';
import type { Screen } from './types';

function AppInner() {
  const [screen, setScreen] = useState<Screen>('dashboard');
  const [dbReady, setDbReady] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const { theme, isDark } = useTheme();

  const { categories, loading, totalPortfolio, refresh, updateValue, updateCat } = usePortfolio();
  const { contributions, save, undoLast } = useHistory();

  useEffect(() => {
    initDB()
      .then(() => setDbReady(true))
      .catch(err => setDbError(String(err)));
  }, []);

  const handleNavigate = (s: Screen) => {
    setScreen(s);
    refresh();
  };

  if (dbError) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: 12, padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 40 }}>⚠️</div>
        <div style={{ color: '#D85A30', fontWeight: 700, fontSize: 18 }}>Erro ao inicializar banco</div>
        <div style={{ color: theme.textMuted, fontSize: 14 }}>{dbError}</div>
      </div>
    );
  }

  if (!dbReady || loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', flexDirection: 'column', gap: 16 }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          border: `3px solid ${theme.borderLight}`, borderTopColor: '#378ADD',
          animation: 'spin 0.8s linear infinite',
        }} />
        <div style={{ color: theme.textMuted, fontSize: 14 }}>Carregando...</div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const renderScreen = () => {
    switch (screen) {
      case 'dashboard':
        return <Dashboard categories={categories} totalPortfolio={totalPortfolio} onNavigate={handleNavigate} onUpdateValue={updateValue} />;
      case 'rebalance':
        return <Rebalance categories={categories} totalPortfolio={totalPortfolio} onSave={async c => { await save(c); refresh(); }} />;
      case 'positions':
        return <Positions categories={categories} totalPortfolio={totalPortfolio} onUpdateValue={updateValue} />;
      case 'history':
        return <History contributions={contributions} onUndoLast={async () => { const ok = await undoLast(); if (ok) refresh(); return ok; }} />;
      case 'settings':
        return <Settings categories={categories} onUpdateCat={updateCat} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ minHeight: '100dvh', background: theme.bg, paddingBottom: 80, transition: 'background 0.3s' }}>
      <div style={{ maxWidth: 480, margin: '0 auto', padding: '24px 16px 0', minHeight: '100dvh' }}>
        {renderScreen()}
      </div>
      <BottomNav active={screen} onNavigate={handleNavigate} />
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        body { transition: background 0.3s, color 0.3s; }
        * { -webkit-tap-highlight-color: transparent; }
      `}</style>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}

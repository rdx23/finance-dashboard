import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Insights from './pages/Insights';
import { Menu, Bell } from 'lucide-react';
import './App.css';

function AppContent() {
  const { activeNav, darkMode, role } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      <div className="main-content">
        <header className="topbar">
          <button className="mobile-menu-btn" onClick={() => setMobileOpen(true)}>
            <Menu size={20} />
          </button>
          <div className="topbar-right">
            <div className={`role-indicator ${role}`}>
              {role === 'admin' ? '⚙️ Admin' : '👁 Viewer'}
            </div>
            <button className="icon-btn">
              <Bell size={18} />
            </button>
            <div className="avatar">JD</div>
          </div>
        </header>
        <main className="content-area">
          {activeNav === 'dashboard' && <Dashboard />}
          {activeNav === 'transactions' && <Transactions />}
          {activeNav === 'insights' && <Insights />}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;

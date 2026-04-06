import React from 'react';
import { LayoutDashboard, ArrowLeftRight, Lightbulb, Settings, TrendingUp, Sun, Moon, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
];

export default function Sidebar({ mobileOpen, onClose }) {
  const { activeNav, setActiveNav, darkMode, setDarkMode, role, setRole } = useApp();

  const handleNav = (id) => {
    setActiveNav(id);
    if (onClose) onClose();
  };

  return (
    <>
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={onClose} />
      )}
      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="logo-icon">
            <TrendingUp size={20} />
          </div>
          <div>
            <div className="logo-text">FinTrack</div>
            <div className="logo-sub">Financial Dashboard</div>
          </div>
        </div>

        <div className="sidebar-role">
          <div className="role-label">Active Role</div>
          <select
            className="role-select"
            value={role}
            onChange={e => setRole(e.target.value)}
          >
            <option value="viewer">👁 Viewer</option>
            <option value="admin">⚙️ Admin</option>
          </select>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Menu</div>
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`nav-item ${activeNav === id ? 'active' : ''}`}
              onClick={() => handleNav(id)}
            >
              <Icon size={18} />
              <span>{label}</span>
              {activeNav === id && <ChevronRight size={14} className="nav-arrow" />}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </aside>
    </>
  );
}

import React, { createContext, useContext, useState, useCallback } from 'react';
import { INITIAL_TRANSACTIONS } from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [role, setRole] = useState('viewer'); // 'viewer' | 'admin'
  const [darkMode, setDarkMode] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    category: 'all',
    sortBy: 'date-desc',
    dateRange: '90',
  });
  const [activeNav, setActiveNav] = useState('dashboard');

  const addTransaction = useCallback((tx) => {
    setTransactions(prev => [tx, ...prev]);
  }, []);

  const editTransaction = useCallback((id, updates) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const deleteTransaction = useCallback((id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  const filteredTransactions = transactions.filter(t => {
    const { search, type, category, dateRange } = filters;
    if (type !== 'all' && t.type !== type) return false;
    if (category !== 'all' && t.category !== category) return false;
    if (search && !t.description.toLowerCase().includes(search.toLowerCase()) &&
        !t.category.toLowerCase().includes(search.toLowerCase())) return false;
    if (dateRange !== 'all') {
      const days = parseInt(dateRange);
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - days);
      if (new Date(t.date) < cutoff) return false;
    }
    return true;
  }).sort((a, b) => {
    const { sortBy } = filters;
    if (sortBy === 'date-desc') return b.date.localeCompare(a.date);
    if (sortBy === 'date-asc') return a.date.localeCompare(b.date);
    if (sortBy === 'amount-desc') return b.amount - a.amount;
    if (sortBy === 'amount-asc') return a.amount - b.amount;
    return 0;
  });

  return (
    <AppContext.Provider value={{
      transactions,
      filteredTransactions,
      role, setRole,
      darkMode, setDarkMode,
      filters, setFilters,
      activeNav, setActiveNav,
      addTransaction, editTransaction, deleteTransaction,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}

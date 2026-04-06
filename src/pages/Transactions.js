import React, { useState } from 'react';
import { Search, Plus, Edit2, Trash2, Filter, ArrowUpDown, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';
import TransactionModal from '../components/TransactionModal';
import { format } from 'date-fns';

function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

const EXPENSE_CATS = ['Food & Dining', 'Shopping', 'Transport', 'Entertainment', 'Healthcare', 'Utilities', 'Travel', 'Investment'];
const INCOME_CATS = ['Salary', 'Freelance', 'Dividend', 'Bonus'];
const ALL_CATS = [...new Set([...EXPENSE_CATS, ...INCOME_CATS])];

export default function Transactions() {
  const { filteredTransactions, filters, setFilters, role, deleteTransaction } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [editTx, setEditTx] = useState(null);
  const [page, setPage] = useState(1);
  const perPage = 12;

  const handleDelete = (id) => {
    if (window.confirm('Delete this transaction?')) deleteTransaction(id);
  };

  const handleEdit = (tx) => {
    setEditTx(tx);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditTx(null);
    setShowModal(true);
  };

  const exportCSV = () => {
    const rows = [['Date', 'Description', 'Category', 'Type', 'Amount', 'Status']];
    filteredTransactions.forEach(t => {
      rows.push([t.date, t.description, t.category, t.type, t.amount, t.status]);
    });
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'transactions.csv'; a.click();
  };

  const paginated = filteredTransactions.slice((page - 1) * perPage, page * perPage);
  const totalPages = Math.ceil(filteredTransactions.length / perPage);

  const updateFilter = (key, val) => {
    setFilters(prev => ({ ...prev, [key]: val }));
    setPage(1);
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Transactions</h1>
          <p className="page-sub">{filteredTransactions.length} transactions found</p>
        </div>
        <div className="header-actions">
          <button className="btn-outline" onClick={exportCSV}>
            <Download size={15} /> Export CSV
          </button>
          {role === 'admin' && (
            <button className="btn-primary" onClick={handleAdd}>
              <Plus size={15} /> Add Transaction
            </button>
          )}
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-wrap">
          <Search size={15} className="search-icon" />
          <input
            placeholder="Search transactions..."
            value={filters.search}
            onChange={e => updateFilter('search', e.target.value)}
          />
        </div>
        <div className="filter-group">
          <Filter size={14} />
          <select value={filters.type} onChange={e => updateFilter('type', e.target.value)}>
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select value={filters.category} onChange={e => updateFilter('category', e.target.value)}>
            <option value="all">All Categories</option>
            {ALL_CATS.map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={filters.dateRange} onChange={e => updateFilter('dateRange', e.target.value)}>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="all">All time</option>
          </select>
          <ArrowUpDown size={14} />
          <select value={filters.sortBy} onChange={e => updateFilter('sortBy', e.target.value)}>
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>
        </div>
      </div>

      {paginated.length === 0 ? (
        <div className="empty-state">
          <Search size={40} />
          <p>No transactions found</p>
          <span>Try adjusting your filters</span>
        </div>
      ) : (
        <>
          <div className="tx-table-wrap">
            <table className="tx-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th className="text-right">Amount</th>
                  {role === 'admin' && <th className="text-center">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {paginated.map(tx => (
                  <tr key={tx.id} className="tx-row">
                    <td className="tx-date-cell">{format(new Date(tx.date), 'MMM d, yyyy')}</td>
                    <td className="tx-desc-cell">{tx.description}</td>
                    <td><span className="category-badge">{tx.category}</span></td>
                    <td>
                      <span className={`type-badge ${tx.type}`}>
                        {tx.type === 'income' ? '↑' : '↓'} {tx.type}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${tx.status}`}>{tx.status}</span>
                    </td>
                    <td className={`text-right amount-cell ${tx.type}`}>
                      {tx.type === 'income' ? '+' : '-'}{formatINR(tx.amount)}
                    </td>
                    {role === 'admin' && (
                      <td className="text-center">
                        <div className="action-btns">
                          <button className="action-btn edit" onClick={() => handleEdit(tx)}>
                            <Edit2 size={13} />
                          </button>
                          <button className="action-btn delete" onClick={() => handleDelete(tx.id)}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="page-btn">←</button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const p = page <= 3 ? i + 1 : page - 2 + i;
                if (p < 1 || p > totalPages) return null;
                return (
                  <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
                );
              })}
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="page-btn">→</button>
              <span className="page-info">Page {page} of {totalPages}</span>
            </div>
          )}
        </>
      )}

      {showModal && (
        <TransactionModal
          transaction={editTx}
          onClose={() => { setShowModal(false); setEditTx(null); }}
        />
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { format } from 'date-fns';

const EXPENSE_CATS = ['Food & Dining', 'Shopping', 'Transport', 'Entertainment', 'Healthcare', 'Utilities', 'Travel', 'Investment'];
const INCOME_CATS = ['Salary', 'Freelance', 'Dividend', 'Bonus'];

export default function TransactionModal({ transaction, onClose }) {
  const { addTransaction, editTransaction } = useApp();
  const isEdit = !!transaction;

  const [form, setForm] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: 'Food & Dining',
    date: format(new Date(), 'yyyy-MM-dd'),
    status: 'completed',
  });

  useEffect(() => {
    if (transaction) setForm({ ...transaction, amount: String(transaction.amount) });
  }, [transaction]);

  const categories = form.type === 'income' ? INCOME_CATS : EXPENSE_CATS;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'type' ? { category: value === 'income' ? 'Salary' : 'Food & Dining' } : {}),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const tx = {
      ...form,
      amount: parseFloat(form.amount),
      id: isEdit ? transaction.id : `tx-${Date.now()}`,
    };
    if (isEdit) editTransaction(tx.id, tx);
    else addTransaction(tx);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEdit ? 'Edit Transaction' : 'Add Transaction'}</h3>
          <button className="modal-close" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <label>Type</label>
            <div className="type-toggle">
              {['expense', 'income'].map(t => (
                <button
                  type="button"
                  key={t}
                  className={`type-btn ${form.type === t ? 'active-' + t : ''}`}
                  onClick={() => handleChange({ target: { name: 'type', value: t } })}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className="form-row">
            <label>Description</label>
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter description"
              required
            />
          </div>
          <div className="form-row-2">
            <div className="form-row">
              <label>Amount (₹)</label>
              <input
                name="amount"
                type="number"
                value={form.amount}
                onChange={handleChange}
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div className="form-row">
              <label>Date</label>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-row-2">
            <div className="form-row">
              <label>Category</label>
              <select name="category" value={form.category} onChange={handleChange}>
                {categories.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-row">
              <label>Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-submit">
              {isEdit ? 'Update' : 'Add Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

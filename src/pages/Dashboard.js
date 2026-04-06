import React from 'react';
import SummaryCards from '../components/SummaryCards';
import { BalanceTrendChart, SpendingBreakdownChart, MonthlyBarChart } from '../components/Charts';
import { useApp } from '../context/AppContext';
import { format } from 'date-fns';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function Dashboard() {
  const { transactions } = useApp();
  const recent = [...transactions]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);

  return (
    <div className="page dashboard-page">
      <div className="page-header">
        <div>
          <h1>Financial Overview</h1>
          <p className="page-sub">Welcome back! Here's your financial summary.</p>
        </div>
        <div className="page-date">{format(new Date(), 'MMMM d, yyyy')}</div>
      </div>

      <SummaryCards />

      <div className="charts-grid">
        <BalanceTrendChart />
        <SpendingBreakdownChart />
      </div>

      <div className="charts-grid-full">
        <MonthlyBarChart />
      </div>

      <div className="recent-section">
        <div className="section-header">
          <h3>Recent Transactions</h3>
        </div>
        <div className="recent-list">
          {recent.map(tx => (
            <div key={tx.id} className="recent-item">
              <div className={`tx-icon-wrap ${tx.type}`}>
                {tx.type === 'income'
                  ? <ArrowUpRight size={14} />
                  : <ArrowDownRight size={14} />}
              </div>
              <div className="tx-info">
                <span className="tx-desc">{tx.description}</span>
                <span className="tx-cat">{tx.category}</span>
              </div>
              <div className="tx-right">
                <span className={`tx-amount ${tx.type}`}>
                  {tx.type === 'income' ? '+' : '-'}{formatINR(tx.amount)}
                </span>
                <span className="tx-date">{format(new Date(tx.date), 'MMM d')}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Wallet, TrendingUp, TrendingDown, PiggyBank } from 'lucide-react';
import { computeSummary } from '../data/mockData';
import { useApp } from '../context/AppContext';

function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function SummaryCards() {
  const { transactions } = useApp();
  const summary = computeSummary(transactions);

  const cards = [
    {
      label: 'Total Balance',
      value: formatINR(summary.totalBalance),
      icon: Wallet,
      color: 'card-blue',
      change: '+2.4%',
      positive: true,
    },
    {
      label: 'Total Income',
      value: formatINR(summary.totalIncome),
      icon: TrendingUp,
      color: 'card-green',
      change: '+12.1%',
      positive: true,
    },
    {
      label: 'Total Expenses',
      value: formatINR(summary.totalExpenses),
      icon: TrendingDown,
      color: 'card-red',
      change: '+5.3%',
      positive: false,
    },
    {
      label: 'Savings Rate',
      value: `${summary.savingsRate}%`,
      icon: PiggyBank,
      color: 'card-yellow',
      change: '-1.2%',
      positive: false,
    },
  ];

  return (
    <div className="summary-cards">
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <div className={`summary-card ${card.color}`} key={i}>
            <div className="card-header">
              <span className="card-label">{card.label}</span>
              <div className="card-icon-wrap">
                <Icon size={18} />
              </div>
            </div>
            <div className="card-value">{card.value}</div>
            <div className={`card-change ${card.positive ? 'positive' : 'negative'}`}>
              {card.positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              <span>{card.change} vs last period</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

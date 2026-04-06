import React from 'react';
import { TrendingUp, TrendingDown, AlertCircle, Target, DollarSign, Calendar, BarChart2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getInsights, getCategoryBreakdown, getMonthlyData } from '../data/mockData';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';

function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function Insights() {
  const { transactions } = useApp();
  const insights = getInsights(transactions);
  const categoryData = getCategoryBreakdown(transactions);
  const monthly = getMonthlyData(transactions);

  const lastMonth = monthly[monthly.length - 1];
  const prevMonth = monthly[monthly.length - 2];

  const radarData = categoryData.slice(0, 6).map(d => ({
    category: d.name.split(' ')[0],
    amount: d.value,
  }));
  const maxVal = Math.max(...radarData.map(d => d.amount));
  const normalizedRadar = radarData.map(d => ({ ...d, value: Math.round((d.amount / maxVal) * 100) }));

  const insightCards = [
    {
      icon: TrendingDown,
      color: 'red',
      title: 'Highest Spending',
      value: insights.highestCategory?.name || 'N/A',
      detail: insights.highestCategory ? formatINR(insights.highestCategory.value) : '',
      desc: 'Your biggest expense category this period',
    },
    {
      icon: Calendar,
      color: insights.monthlyExpenseChange > 0 ? 'red' : 'green',
      title: 'Monthly Expense Change',
      value: `${insights.monthlyExpenseChange > 0 ? '+' : ''}${insights.monthlyExpenseChange}%`,
      detail: 'vs previous month',
      desc: insights.monthlyExpenseChange > 0
        ? 'Expenses increased from last month'
        : 'Expenses decreased from last month',
    },
    {
      icon: DollarSign,
      color: 'blue',
      title: 'Avg Daily Spend',
      value: formatINR(insights.avgDailySpend),
      detail: 'per day',
      desc: 'Your average daily expenditure',
    },
    {
      icon: BarChart2,
      color: 'yellow',
      title: 'Total Transactions',
      value: insights.totalTransactions,
      detail: `${insights.pendingCount} pending`,
      desc: 'Transactions in selected period',
    },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1>Insights</h1>
          <p className="page-sub">Smart analysis of your spending patterns</p>
        </div>
      </div>

      <div className="insights-grid">
        {insightCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className={`insight-card insight-${card.color}`}>
              <div className="insight-icon-wrap">
                <Icon size={20} />
              </div>
              <div className="insight-content">
                <span className="insight-title">{card.title}</span>
                <div className="insight-value">{card.value}</div>
                <div className="insight-detail">{card.detail}</div>
                <p className="insight-desc">{card.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Spending Pattern</h3>
            <span className="chart-badge">Radar Analysis</span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={normalizedRadar}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="category" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <Radar name="Spending" dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.3} />
              <Tooltip formatter={(v, _, props) => [formatINR(props.payload.amount), 'Amount']} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Month-over-Month</h3>
            <span className="chart-badge">Comparison</span>
          </div>
          {lastMonth && prevMonth && (
            <div className="mom-compare">
              <div className="mom-item">
                <span className="mom-label">Previous Month</span>
                <span className="mom-period">{prevMonth.month}</span>
                <div className="mom-bar-wrap">
                  <div className="mom-bar income" style={{ width: `${Math.min((prevMonth.income / (prevMonth.income + lastMonth.income)) * 100, 100)}%` }} />
                </div>
                <div className="mom-values">
                  <span className="income">↑ {formatINR(prevMonth.income)}</span>
                  <span className="expense">↓ {formatINR(prevMonth.expenses)}</span>
                </div>
              </div>
              <div className="mom-divider" />
              <div className="mom-item">
                <span className="mom-label">Current Month</span>
                <span className="mom-period">{lastMonth.month}</span>
                <div className="mom-bar-wrap">
                  <div className="mom-bar income" style={{ width: `${Math.min((lastMonth.income / (prevMonth.income + lastMonth.income)) * 100, 100)}%` }} />
                </div>
                <div className="mom-values">
                  <span className="income">↑ {formatINR(lastMonth.income)}</span>
                  <span className="expense">↓ {formatINR(lastMonth.expenses)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="chart-card">
        <div className="chart-header">
          <h3>Top Spending Categories</h3>
          <span className="chart-badge">Ranked</span>
        </div>
        <div className="category-bars">
          {categoryData.slice(0, 8).map((cat, i) => {
            const pct = (cat.value / categoryData[0].value) * 100;
            return (
              <div key={i} className="cat-bar-row">
                <span className="cat-bar-name">{cat.name}</span>
                <div className="cat-bar-track">
                  <div
                    className="cat-bar-fill"
                    style={{
                      width: `${pct}%`,
                      background: `hsl(${240 - i * 25}, 70%, 60%)`,
                      animationDelay: `${i * 0.05}s`
                    }}
                  />
                </div>
                <span className="cat-bar-val">{formatINR(cat.value)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

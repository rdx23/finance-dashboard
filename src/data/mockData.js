import { subDays, format } from 'date-fns';

const categories = ['Food & Dining', 'Shopping', 'Transport', 'Entertainment', 'Healthcare', 'Utilities', 'Travel', 'Investment'];
const incomeCategories = ['Salary', 'Freelance', 'Dividend', 'Bonus'];

function randBetween(min, max) {
  return +(Math.random() * (max - min) + min).toFixed(2);
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const descriptions = {
  'Food & Dining': ['Starbucks Coffee', 'Zomato Order', 'Swiggy Delivery', 'Dominos Pizza', 'McDonald\'s', 'Local Restaurant'],
  'Shopping': ['Amazon Purchase', 'Flipkart Order', 'Myntra Clothes', 'Electronics Store', 'Grocery Store'],
  'Transport': ['Uber Ride', 'Ola Cab', 'Fuel Station', 'Metro Card', 'Auto Rickshaw'],
  'Entertainment': ['Netflix Subscription', 'Spotify Premium', 'Movie Tickets', 'BookMyShow', 'Gaming'],
  'Healthcare': ['Apollo Pharmacy', 'Doctor Consultation', 'Gym Membership', 'Lab Tests'],
  'Utilities': ['Electricity Bill', 'Water Bill', 'Internet Recharge', 'Mobile Recharge'],
  'Travel': ['Hotel Booking', 'Flight Ticket', 'MakeMyTrip', 'Train Ticket'],
  'Investment': ['Mutual Fund SIP', 'Stock Purchase', 'Fixed Deposit', 'Gold ETF'],
  'Salary': ['Monthly Salary', 'Salary Credit'],
  'Freelance': ['Freelance Project', 'Consulting Fee', 'Design Work'],
  'Dividend': ['Stock Dividend', 'Mutual Fund Return'],
  'Bonus': ['Performance Bonus', 'Diwali Bonus', 'Referral Bonus'],
};

let idCounter = 1;

export function generateTransactions() {
  const transactions = [];

  for (let i = 89; i >= 0; i--) {
    const date = subDays(new Date(), i);
    const numTx = Math.floor(Math.random() * 4) + 1;
    for (let j = 0; j < numTx; j++) {
      const isIncome = Math.random() < 0.15;
      const cat = isIncome ? randomFrom(incomeCategories) : randomFrom(categories);
      const amount = isIncome ? randBetween(15000, 80000) : randBetween(50, 5000);
      transactions.push({
        id: `tx-${idCounter++}`,
        date: format(date, 'yyyy-MM-dd'),
        amount,
        category: cat,
        type: isIncome ? 'income' : 'expense',
        description: randomFrom(descriptions[cat]),
        status: Math.random() > 0.05 ? 'completed' : 'pending',
      });
    }
  }

  return transactions;
}

export const INITIAL_TRANSACTIONS = generateTransactions();

export function computeSummary(transactions) {
  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  return {
    totalBalance: income - expenses,
    totalIncome: income,
    totalExpenses: expenses,
    savingsRate: income > 0 ? ((income - expenses) / income * 100).toFixed(1) : 0,
  };
}

export function getMonthlyData(transactions) {
  const map = {};
  transactions.forEach(t => {
    const month = t.date.substring(0, 7);
    if (!map[month]) map[month] = { month, income: 0, expenses: 0 };
    if (t.type === 'income') map[month].income += t.amount;
    else map[month].expenses += t.amount;
  });
  return Object.values(map).sort((a, b) => a.month.localeCompare(b.month)).map(d => ({
    ...d,
    month: format(new Date(d.month + '-01'), 'MMM yy'),
    balance: d.income - d.expenses,
  }));
}

export function getCategoryBreakdown(transactions) {
  const map = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    map[t.category] = (map[t.category] || 0) + t.amount;
  });
  return Object.entries(map)
    .map(([name, value]) => ({ name, value: +value.toFixed(2) }))
    .sort((a, b) => b.value - a.value);
}

export function getInsights(transactions) {
  const categoryData = getCategoryBreakdown(transactions);
  const highest = categoryData[0];
  const monthly = getMonthlyData(transactions);
  const lastTwo = monthly.slice(-2);
  const monthlyChange = lastTwo.length === 2
    ? ((lastTwo[1].expenses - lastTwo[0].expenses) / lastTwo[0].expenses * 100).toFixed(1)
    : 0;

  return {
    highestCategory: highest,
    monthlyExpenseChange: monthlyChange,
    avgDailySpend: (transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0) / 90).toFixed(0),
    totalTransactions: transactions.length,
    pendingCount: transactions.filter(t => t.status === 'pending').length,
  };
}

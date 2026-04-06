# FinTrack — Finance Dashboard

A clean, interactive finance dashboard built with React.js.

## Features

- **Dashboard Overview** — Summary cards (Balance, Income, Expenses, Savings Rate), Area trend chart, Pie spending breakdown, Monthly bar comparison
- **Transactions** — Searchable, filterable, sortable table with pagination; CSV export
- **Insights** — Radar spending pattern, month-over-month comparison, ranked category bars
- **Role-Based UI** — Switch between Viewer (read-only) and Admin (add/edit/delete) via sidebar dropdown
- **Dark / Light Mode** — Toggle in sidebar footer
- **Responsive** — Works on mobile, tablet, and desktop

## Tech Stack

- React 18 (Create React App)
- Recharts — charts
- Lucide React — icons
- date-fns — date formatting
- React Context API — state management

## Getting Started

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000)

## Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── context/AppContext.js       # Global state (role, filters, transactions)
├── data/mockData.js            # Mock data generator + compute helpers
├── components/
│   ├── Sidebar.js              # Nav, role switcher, dark mode toggle
│   ├── SummaryCards.js         # 4 KPI summary cards
│   ├── Charts.js               # Area, Pie, Bar charts
│   └── TransactionModal.js     # Add / Edit transaction modal
└── pages/
    ├── Dashboard.js            # Overview page
    ├── Transactions.js         # Transactions table page
    └── Insights.js             # Insights & analytics page
```

## Role Behavior

| Action | Viewer | Admin |
|--------|--------|-------|
| View dashboard & charts | ✅ | ✅ |
| View transactions | ✅ | ✅ |
| Filter / search | ✅ | ✅ |
| Add transaction | ❌ | ✅ |
| Edit transaction | ❌ | ✅ |
| Delete transaction | ❌ | ✅ |

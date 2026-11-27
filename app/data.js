// Home Ledger — data layer.
// One household, one month (November 2026). Every figure on the site comes from
// the lists below, or from entries the household adds; nothing is invented at
// render time. State persists in the browser's localStorage, so the numbers a
// household types in are still there next time it opens the page.

export const MONTH = 'November 2026';
export const HOUSEHOLD = 'The Ellery household';

export const CATEGORIES = [
  { id: 'housing', label: 'Housing', color: '#1d4d3b', budget: 1500 },
  { id: 'groceries', label: 'Groceries', color: '#2f7d4f', budget: 650 },
  { id: 'utilities', label: 'Utilities', color: '#3b82a0', budget: 380 },
  { id: 'transport', label: 'Transport', color: '#7a5c2e', budget: 320 },
  { id: 'dining', label: 'Dining out', color: '#c2703d', budget: 200 },
  { id: 'entertainment', label: 'Entertainment', color: '#8b5fa6', budget: 100 },
  { id: 'health', label: 'Health', color: '#b4455a', budget: 150 },
  { id: 'kids', label: 'Kids', color: '#4a6fa5', budget: 200 },
  { id: 'household', label: 'Household', color: '#6b7280', budget: 100 },
  { id: 'clothing', label: 'Clothing', color: '#a16207', budget: 120 },
  { id: 'other', label: 'Other', color: '#9ca3af', budget: 100 },
];

const seedTransactions = [
  { id: 't01', date: '2026-11-01', desc: 'Salary — Tom Ellery', category: 'income', type: 'income', amount: 3850 },
  { id: 't02', date: '2026-11-01', desc: 'Salary — Rosa Ellery', category: 'income', type: 'income', amount: 2550 },
  { id: 't03', date: '2026-11-01', desc: 'Mortgage payment', category: 'housing', type: 'expense', amount: 1450 },
  { id: 't04', date: '2026-11-02', desc: 'Weekly shop — GreenMart', category: 'groceries', type: 'expense', amount: 124.75 },
  { id: 't05', date: '2026-11-03', desc: 'Electric bill — City Power', category: 'utilities', type: 'expense', amount: 128.4 },
  { id: 't06', date: '2026-11-04', desc: 'Petrol — Shell Station', category: 'transport', type: 'expense', amount: 45 },
  { id: 't07', date: '2026-11-05', desc: 'Dinner — Luigi’s Trattoria', category: 'dining', type: 'expense', amount: 42.8 },
  { id: 't08', date: '2026-11-06', desc: 'School lunches — November', category: 'kids', type: 'expense', amount: 60 },
  { id: 't09', date: '2026-11-07', desc: 'Streaming — Northflix', category: 'entertainment', type: 'expense', amount: 15.49 },
  { id: 't10', date: '2026-11-08', desc: 'Weekly shop — GreenMart', category: 'groceries', type: 'expense', amount: 86.4 },
  { id: 't11', date: '2026-11-09', desc: 'Water bill — City Water', category: 'utilities', type: 'expense', amount: 46.2 },
  { id: 't12', date: '2026-11-10', desc: 'Pharmacy — cold medicine', category: 'health', type: 'expense', amount: 28.75 },
  { id: 't13', date: '2026-11-11', desc: 'Bus pass — Rosa', category: 'transport', type: 'expense', amount: 72 },
  { id: 't14', date: '2026-11-12', desc: 'Weekly shop — GreenMart', category: 'groceries', type: 'expense', amount: 93.2 },
  { id: 't15', date: '2026-11-13', desc: 'Internet — FiberNet', category: 'utilities', type: 'expense', amount: 65 },
  { id: 't16', date: '2026-11-14', desc: 'Takeaway — Thai Garden', category: 'dining', type: 'expense', amount: 36.5 },
  { id: 't17', date: '2026-11-15', desc: 'Soccer fees — Mia', category: 'kids', type: 'expense', amount: 85 },
  { id: 't18', date: '2026-11-16', desc: 'Petrol — Shell Station', category: 'transport', type: 'expense', amount: 38.5 },
  { id: 't19', date: '2026-11-17', desc: 'Cleaning supplies', category: 'household', type: 'expense', amount: 34.6 },
  { id: 't20', date: '2026-11-18', desc: 'Weekly shop — GreenMart', category: 'groceries', type: 'expense', amount: 67.55 },
  { id: 't21', date: '2026-11-19', desc: 'Phone plan — both lines', category: 'utilities', type: 'expense', amount: 90 },
  { id: 't22', date: '2026-11-20', desc: 'Dentist copay — Tom', category: 'health', type: 'expense', amount: 45 },
  { id: 't23', date: '2026-11-21', desc: 'Movie night — cinema', category: 'entertainment', type: 'expense', amount: 34 },
  { id: 't24', date: '2026-11-22', desc: 'Weekly shop — GreenMart', category: 'groceries', type: 'expense', amount: 112.3 },
  { id: 't25', date: '2026-11-23', desc: 'Car insurance — monthly', category: 'transport', type: 'expense', amount: 118 },
  { id: 't26', date: '2026-11-24', desc: 'Winter coat — Mia', category: 'clothing', type: 'expense', amount: 89.99 },
  { id: 't27', date: '2026-11-25', desc: 'Birthday gift — Grandma', category: 'other', type: 'expense', amount: 45 },
  { id: 't28', date: '2026-11-26', desc: 'Weekly shop — GreenMart', category: 'groceries', type: 'expense', amount: 58.9 },
  { id: 't29', date: '2026-11-26', desc: 'Books — bookshop', category: 'entertainment', type: 'expense', amount: 22.99 },
  { id: 't30', date: '2026-11-26', desc: 'Hardware store — shelf brackets', category: 'household', type: 'expense', amount: 27.4 },
  { id: 't31', date: '2026-11-26', desc: 'Lunch — café with friends', category: 'dining', type: 'expense', amount: 24.6 },
  { id: 't32', date: '2026-11-26', desc: 'Dinner — Burger Barn', category: 'dining', type: 'expense', amount: 58.25 },
];

const seedGoals = [
  { id: 'g1', name: 'Emergency fund', target: 10000, saved: 6400, note: 'Six months of essentials, kept in a separate savings account.' },
  { id: 'g2', name: 'Summer trip to the coast', target: 2400, saved: 1150, note: 'Two weeks by the sea in July — cottage, fuel and food.' },
  { id: 'g3', name: 'New car down payment', target: 5000, saved: 1800, note: 'Replacing the 2014 hatchback before next winter.' },
];

const STORAGE_KEY = 'home-ledger-v1';

function freshState() {
  return {
    transactions: seedTransactions.map((t) => ({ ...t })),
    budgets: Object.fromEntries(CATEGORIES.map((c) => [c.id, c.budget])),
    goals: seedGoals.map((g) => ({ ...g })),
  };
}

export function loadState() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return freshState();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.transactions) || !Array.isArray(parsed.goals)) return freshState();
    return parsed;
  } catch {
    return freshState();
  }
}

export function saveState(state) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetState() {
  window.localStorage.removeItem(STORAGE_KEY);
  return freshState();
}

// ---- Calculations: every figure on the site is derived here, from the lists
// above, so the dashboard, budgets and goals can never disagree. ----

export function money(n) {
  return '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function totals(state) {
  let income = 0;
  let spent = 0;
  for (const t of state.transactions) {
    if (t.type === 'income') income += t.amount;
    else spent += t.amount;
  }
  return { income, spent, left: income - spent, rate: income > 0 ? Math.max(0, (income - spent) / income) : 0 };
}

export function categorySpent(state, categoryId) {
  return state.transactions
    .filter((t) => t.type === 'expense' && t.category === categoryId)
    .reduce((sum, t) => sum + t.amount, 0);
}

export function budgetRows(state) {
  return CATEGORIES.map((c) => {
    const spent = categorySpent(state, c.id);
    const budget = state.budgets[c.id] ?? c.budget;
    return { ...c, budget, spent, left: budget - spent, pct: budget > 0 ? spent / budget : 0 };
  });
}

export function recentTransactions(state, n = 6) {
  return [...state.transactions]
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.id < b.id ? 1 : -1))
    .slice(0, n);
}

export function categoryLabel(id) {
  if (id === 'income') return 'Income';
  const found = CATEGORIES.find((c) => c.id === id);
  return found ? found.label : 'Other';
}

export function nextId(prefix, items) {
  let n = items.length + 1;
  let id = prefix + String(n).padStart(2, '0');
  while (items.some((item) => item.id === id)) {
    n += 1;
    id = prefix + String(n).padStart(2, '0');
  }
  return id;
}

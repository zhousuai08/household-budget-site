// Home Ledger — app shell: hash router plus every control on the site.
// All state lives in data.js and localStorage; this file only routes,
// renders, and wires up the forms and buttons.

import { loadState, saveState, resetState, nextId, categoryLabel } from './data.js';
import { dashboardView, transactionsView, budgetsView, goalsView, aboutView } from './views.js';

let state = loadState();
const app = document.getElementById('app');

const ROUTES = {
  '/': { view: dashboardView, nav: 'dashboard' },
  '/transactions': { view: transactionsView, nav: 'transactions' },
  '/budgets': { view: budgetsView, nav: 'budgets' },
  '/goals': { view: goalsView, nav: 'goals' },
  '/about': { view: aboutView, nav: 'about' },
};

function currentRoute() {
  const hash = window.location.hash.replace(/^#/, '') || '/';
  return ROUTES[hash] ? hash : '/';
}

function render() {
  const route = currentRoute();
  app.innerHTML = ROUTES[route].view(state);
  document.querySelectorAll('[data-nav]').forEach((a) => {
    a.classList.toggle('active', a.dataset.nav === ROUTES[route].nav);
  });
  wireRoute(route);
  window.scrollTo(0, 0);
}

function rerender(note) {
  saveState(state);
  render();
  if (note) {
    const el = document.getElementById('form-note') || document.getElementById('budget-note') || document.getElementById('goal-note');
    if (el) el.textContent = note;
  }
}

function wireRoute(route) {
  if (route === '/transactions') wireTransactions();
  if (route === '/budgets') wireBudgets();
  if (route === '/goals') wireGoals();
  if (route === '/about') wireAbout();
}

function wireTransactions() {
  const form = document.getElementById('add-form');
  const note = document.getElementById('form-note');
  let editingId = null;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const desc = String(data.get('desc') || '').trim();
    const amount = Number(data.get('amount'));
    const date = String(data.get('date') || '');
    if (!desc || !date || !(amount > 0)) {
      note.textContent = 'Please fill in a date, a description and an amount over $0.';
      return;
    }
    const entry = {
      id: editingId || nextId('t', state.transactions),
      date,
      desc,
      category: String(data.get('category')),
      type: String(data.get('type')),
      amount: Math.round(amount * 100) / 100,
    };
    if (editingId) {
      const i = state.transactions.findIndex((t) => t.id === editingId);
      if (i >= 0) state.transactions[i] = entry;
      editingId = null;
      form.querySelector('button[type="submit"]').textContent = 'Add transaction';
      rerender(`Updated “${desc}”.`);
    } else {
      state.transactions.push(entry);
      rerender(`Added “${desc}” — $${entry.amount.toFixed(2)}.`);
    }
  });

  const body = document.getElementById('tx-body');
  body.addEventListener('click', (e) => {
    const target = e.target;
    if (!(target instanceof HTMLButtonElement)) return;
    const editId = target.dataset.edit;
    const deleteId = target.dataset.delete;
    if (deleteId) {
      const tx = state.transactions.find((t) => t.id === deleteId);
      if (tx && window.confirm(`Delete “${tx.desc}” ($${tx.amount.toFixed(2)})?`)) {
        state.transactions = state.transactions.filter((t) => t.id !== deleteId);
        rerender(`Deleted “${tx.desc}”.`);
      }
      return;
    }
    if (editId) {
      const tx = state.transactions.find((t) => t.id === editId);
      if (!tx) return;
      editingId = editId;
      form.date.value = tx.date;
      form.desc.value = tx.desc;
      form.category.value = tx.category;
      form.type.value = tx.type;
      form.amount.value = tx.amount;
      form.querySelector('button[type="submit"]').textContent = 'Save changes';
      note.textContent = `Editing “${tx.desc}” — change the fields and press Save changes.`;
      form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  const applyFilters = () => {
    const type = document.getElementById('filter-type').value;
    const cat = document.getElementById('filter-category').value;
    const q = document.getElementById('filter-search').value.trim().toLowerCase();
    let shown = 0;
    for (const row of body.rows) {
      const id = row.dataset.id;
      const tx = state.transactions.find((t) => t.id === id);
      if (!tx) continue;
      const okType = type === 'all' || tx.type === type;
      const okCat = cat === 'all' || tx.category === cat;
      const okQ = !q || tx.desc.toLowerCase().includes(q);
      const show = okType && okCat && okQ;
      row.hidden = !show;
      if (show) shown += 1;
    }
    document.getElementById('tx-count').textContent = `${shown} of ${state.transactions.length} entries`;
    document.getElementById('tx-empty').hidden = shown !== 0;
  };
  document.getElementById('filter-type').addEventListener('change', applyFilters);
  document.getElementById('filter-category').addEventListener('change', applyFilters);
  document.getElementById('filter-search').addEventListener('input', applyFilters);
}

function wireBudgets() {
  const form = document.getElementById('budget-form');
  const note = document.getElementById('budget-note');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const category = String(data.get('category'));
    const amount = Number(data.get('amount'));
    if (!(amount >= 0)) {
      note.textContent = 'Please enter a budget of $0 or more.';
      return;
    }
    state.budgets[category] = Math.round(amount);
    saveState(state);
    render();
    const after = document.getElementById('budget-note');
    if (after) after.textContent = `Budget for ${categoryLabel(category)} set to $${Math.round(amount)} a month.`;
  });
  document.querySelectorAll('[data-budget-edit]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const category = btn.dataset.budgetEdit;
      form.category.value = category;
      form.amount.value = state.budgets[category] ?? '';
      form.amount.focus();
      form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  });
}

function wireGoals() {
  document.querySelectorAll('.goal-form').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const goal = state.goals.find((g) => g.id === form.dataset.goal);
      if (!goal) return;
      const amount = Number(new FormData(form).get('amount'));
      if (!(amount > 0)) return;
      goal.saved = Math.round((goal.saved + amount) * 100) / 100;
      saveState(state);
      render();
    });
  });
  const form = document.getElementById('goal-form');
  const note = document.getElementById('goal-note');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const target = Number(data.get('target'));
    const saved = Number(data.get('saved') || 0);
    if (!name || !(target > 0) || saved < 0) {
      note.textContent = 'Please give the goal a name and a target over $0.';
      return;
    }
    state.goals.push({ id: nextId('g', state.goals), name, target: Math.round(target), saved: Math.round(saved * 100) / 100, note: 'Added by the household.' });
    saveState(state);
    render();
    const after = document.getElementById('goal-note');
    if (after) after.textContent = `Goal “${name}” created.`;
  });
}

function wireAbout() {
  const btn = document.getElementById('reset-btn');
  const note = document.getElementById('reset-note');
  btn.addEventListener('click', () => {
    if (window.confirm('Reset everything back to the November example? Your own entries will be removed.')) {
      state = resetState();
      saveState(state);
      render();
      const after = document.getElementById('reset-note');
      if (after) after.textContent = 'Reset done — showing the November example again.';
    }
  });
}

window.addEventListener('hashchange', render);
render();

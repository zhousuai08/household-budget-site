// Home Ledger — views. Each route renders real figures from data.js; every
// button and form on the page does what its label says.

import { MONTH, HOUSEHOLD, CATEGORIES, money, totals, budgetRows, recentTransactions, categoryLabel } from './data.js';

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function statCard(label, value, sub) {
  return `<div class="stat"><span class="stat-label">${label}</span><span class="stat-value">${value}</span><span class="stat-sub">${sub}</span></div>`;
}

function barRow(label, value, max, color) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return `<div class="bar-row"><span class="bar-label">${label}</span><div class="bar-track"><div class="bar-fill" style="width:${pct.toFixed(1)}%;background:${color}"></div></div><span class="bar-value">${money(value)}</span></div>`;
}

export function dashboardView(state) {
  const t = totals(state);
  const rows = budgetRows(state).filter((r) => r.spent > 0).sort((a, b) => b.spent - a.spent);
  const topSpend = rows[0] ? rows[0].spent : 1;
  const nearLimit = budgetRows(state).filter((r) => r.pct >= 0.8).sort((a, b) => b.pct - a.pct);
  const goalTotal = state.goals.reduce((s, g) => s + g.saved, 0);
  const goalTarget = state.goals.reduce((s, g) => s + g.target, 0);
  const recent = recentTransactions(state, 6);

  return `
  <section class="hero">
    <div>
      <h1>${HOUSEHOLD} — ${MONTH}</h1>
      <p class="lede">One page for the whole month: what came in, what went out, what is left, and how the savings goals are doing.</p>
    </div>
    <div class="hero-note"><strong>${money(t.left)}</strong><span>left to spend or save</span></div>
  </section>

  <section class="stats">
    ${statCard('Income', money(t.income), '2 paydays this month')}
    ${statCard('Spent', money(t.spent), `${state.transactions.filter((x) => x.type === 'expense').length} expenses recorded`)}
    ${statCard('Left', money(t.left), `${(t.rate * 100).toFixed(0)}% of income kept`)}
    ${statCard('Savings goals', money(goalTotal), `of ${money(goalTarget)} targeted`)}
  </section>

  <div class="grid-two">
    <section class="card">
      <h2>Where the money went</h2>
      <p class="card-sub">Spending by category, November 1–26.</p>
      ${rows.map((r) => barRow(r.label, r.spent, topSpend, r.color)).join('')}
      <p class="card-link"><a href="#/transactions">See every transaction →</a></p>
    </section>

    <section class="card">
      <h2>Budgets to watch</h2>
      <p class="card-sub">Categories already at 80% of their monthly budget or more.</p>
      ${nearLimit.length ? nearLimit.map((r) => `
        <div class="budget-line">
          <div class="budget-head"><span>${r.label}</span><span>${money(r.spent)} of ${money(r.budget)}</span></div>
          <div class="bar-track"><div class="bar-fill ${r.pct >= 1 ? 'over' : ''}" style="width:${Math.min(100, r.pct * 100).toFixed(1)}%"></div></div>
          <p class="budget-note">${r.pct >= 1 ? `Over budget by ${money(-r.left)}.` : `${money(r.left)} left for the rest of the month.`}</p>
        </div>`).join('') : '<p>Nothing is close to its limit yet — every category is under 80% of budget.</p>'}
      <p class="card-link"><a href="#/budgets">Manage all budgets →</a></p>
    </section>
  </div>

  <div class="grid-two">
    <section class="card">
      <h2>Savings goals</h2>
      ${state.goals.map((g) => {
        const pct = Math.min(100, (g.saved / g.target) * 100);
        return `<div class="goal-line">
          <div class="budget-head"><span>${esc(g.name)}</span><span>${money(g.saved)} of ${money(g.target)}</span></div>
          <div class="bar-track"><div class="bar-fill goal" style="width:${pct.toFixed(1)}%"></div></div>
          <p class="budget-note">${pct.toFixed(0)}% there — ${money(g.target - g.saved)} to go.</p>
        </div>`;
      }).join('')}
      <p class="card-link"><a href="#/goals">Add money to a goal →</a></p>
    </section>

    <section class="card">
      <h2>Recent transactions</h2>
      <ul class="recent">
        ${recent.map((t) => `<li><span class="recent-date">${t.date.slice(5)}</span><span class="recent-desc">${esc(t.desc)}</span><span class="recent-amount ${t.type}">${t.type === 'income' ? '+' : '−'}${money(t.amount)}</span></li>`).join('')}
      </ul>
      <p class="card-link"><a href="#/transactions">All ${state.transactions.length} transactions →</a></p>
    </section>
  </div>`;
}

export function transactionsView(state) {
  const sorted = [...state.transactions].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  const options = CATEGORIES.map((c) => `<option value="${c.id}">${c.label}</option>`).join('');
  return `
  <section class="page-head">
    <h1>Transactions</h1>
    <p class="lede">Every dollar in and out this month. Add a new one, fix a mistake, or remove an entry — the totals update everywhere at once.</p>
  </section>

  <section class="card">
    <h2>Add a transaction</h2>
    <form id="add-form" class="form-grid">
      <label>Date <input type="date" name="date" value="2026-11-27" required></label>
      <label>Description <input type="text" name="desc" placeholder="e.g. Weekly shop — GreenMart" required maxlength="80"></label>
      <label>Category
        <select name="category">${options}</select>
      </label>
      <label>Amount ($) <input type="number" name="amount" min="0.01" step="0.01" placeholder="0.00" required></label>
      <label>Type
        <select name="type"><option value="expense">Expense</option><option value="income">Income</option></select>
      </label>
      <button type="submit" class="btn">Add transaction</button>
    </form>
    <p class="form-note" id="form-note"></p>
  </section>

  <section class="card">
    <h2>All transactions <span class="count" id="tx-count">${sorted.length} entries</span></h2>
    <div class="filters">
      <label>Show
        <select id="filter-type">
          <option value="all">All</option>
          <option value="expense">Expenses</option>
          <option value="income">Income</option>
        </select>
      </label>
      <label>Category
        <select id="filter-category">
          <option value="all">All categories</option>
          ${options}
        </select>
      </label>
      <label>Search <input type="search" id="filter-search" placeholder="Search descriptions…"></label>
    </div>
    <div class="table-wrap">
      <table class="tx-table">
        <thead><tr><th>Date</th><th>Description</th><th>Category</th><th class="num">Amount</th><th></th></tr></thead>
        <tbody id="tx-body">
          ${sorted.map((t) => `<tr data-id="${t.id}">
            <td>${t.date}</td>
            <td>${esc(t.desc)}</td>
            <td>${t.type === 'income' ? 'Income' : esc(categoryLabel(t.category))}</td>
            <td class="num ${t.type}">${t.type === 'income' ? '+' : '−'}${money(t.amount)}</td>
            <td class="row-actions"><button class="link-btn" data-edit="${t.id}">Edit</button><button class="link-btn danger" data-delete="${t.id}">Delete</button></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <p class="card-sub" id="tx-empty" hidden>No transactions match these filters.</p>
  </section>`;
}

export function budgetsView(state) {
  const rows = budgetRows(state);
  const totalBudget = rows.reduce((s, r) => s + r.budget, 0);
  const totalSpent = rows.reduce((s, r) => s + r.spent, 0);
  return `
  <section class="page-head">
    <h1>Monthly budgets</h1>
    <p class="lede">A limit for every category, set at the start of the month. ${money(totalSpent)} of the ${money(totalBudget)} planned budget is spent so far.</p>
  </section>

  <section class="card">
    <h2>Set a monthly budget</h2>
    <p class="card-sub">Pick a category, type a new monthly limit, and save it — the bars below update straight away.</p>
    <form id="budget-form" class="form-grid">
      <label>Category
        <select name="category">${CATEGORIES.map((c) => `<option value="${c.id}">${c.label}</option>`).join('')}</select>
      </label>
      <label>Monthly budget ($) <input type="number" name="amount" min="0" step="1" placeholder="0" required></label>
      <button type="submit" class="btn">Save budget</button>
    </form>
    <p class="form-note" id="budget-note"></p>
  </section>

  <section class="budget-grid">
    ${rows.map((r) => `
    <article class="card budget-card">
      <div class="budget-head"><h3>${r.label}</h3><span class="budget-pct ${r.pct >= 1 ? 'over' : ''}">${(r.pct * 100).toFixed(0)}%</span></div>
      <div class="bar-track"><div class="bar-fill ${r.pct >= 1 ? 'over' : ''}" style="width:${Math.min(100, r.pct * 100).toFixed(1)}%;background:${r.color}"></div></div>
      <p class="budget-figures"><strong>${money(r.spent)}</strong> spent of ${money(r.budget)} planned</p>
      <p class="budget-note">${r.pct >= 1 ? `Over by ${money(-r.left)} — consider moving money from another category.` : `${money(r.left)} left for the rest of ${MONTH}.`}</p>
      <button class="link-btn" data-budget-edit="${r.id}">Change this budget</button>
    </article>`).join('')}
  </section>`;
}

export function goalsView(state) {
  const totalSaved = state.goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = state.goals.reduce((s, g) => s + g.target, 0);
  return `
  <section class="page-head">
    <h1>Savings goals</h1>
    <p class="lede">${money(totalSaved)} saved towards ${money(totalTarget)} of goals. Add money whenever there is some to spare — small, regular amounts are what get goals finished.</p>
  </section>

  <section class="goals-grid">
    ${state.goals.map((g) => {
      const pct = Math.min(100, (g.saved / g.target) * 100);
      return `<article class="card goal-card">
        <h2>${esc(g.name)}</h2>
        <p class="card-sub">${esc(g.note)}</p>
        <div class="goal-big"><strong>${money(g.saved)}</strong><span> of ${money(g.target)} (${pct.toFixed(0)}%)</span></div>
        <div class="bar-track big"><div class="bar-fill goal" style="width:${pct.toFixed(1)}%"></div></div>
        <p class="budget-note">${g.saved >= g.target ? 'Goal reached — well done!' : `${money(g.target - g.saved)} still to save.`}</p>
        <form class="goal-form" data-goal="${g.id}">
          <label>Add to this goal ($) <input type="number" name="amount" min="1" step="1" placeholder="100" required></label>
          <button type="submit" class="btn">Add money</button>
        </form>
      </article>`;
    }).join('')}
  </section>

  <section class="card">
    <h2>Start a new goal</h2>
    <form id="goal-form" class="form-grid">
      <label>Goal name <input type="text" name="name" placeholder="e.g. Christmas fund" required maxlength="60"></label>
      <label>Target amount ($) <input type="number" name="target" min="1" step="1" placeholder="1000" required></label>
      <label>Already saved ($) <input type="number" name="saved" min="0" step="1" value="0"></label>
      <button type="submit" class="btn">Create goal</button>
    </form>
    <p class="form-note" id="goal-note"></p>
  </section>`;
}

export function aboutView(state) {
  const t = totals(state);
  return `
  <section class="page-head">
    <h1>About Home Ledger</h1>
    <p class="lede">A household budget site that runs entirely in your browser — no account, no server, no one else ever sees your numbers.</p>
  </section>

  <section class="card">
    <h2>How it works</h2>
    <ol class="steps">
      <li><strong>See the month at a glance</strong> — the <a href="#/">dashboard</a> shows income, spending, what is left, and how each savings goal is doing.</li>
      <li><strong>Record every transaction</strong> — add expenses and income on the <a href="#/transactions">transactions</a> page. Fix a typo with Edit, remove a duplicate with Delete.</li>
      <li><strong>Set a limit per category</strong> — on the <a href="#/budgets">budgets</a> page, give groceries, transport, dining out and the rest a monthly limit, then watch the bars fill up.</li>
      <li><strong>Save towards something</strong> — on the <a href="#/goals">goals</a> page, add money to a goal whenever there is some to spare.</li>
    </ol>
  </section>

  <section class="card">
    <h2>Your data stays yours</h2>
    <p>Everything you type is stored in this browser only (localStorage). There is no account to create and nothing is sent anywhere — open the page on another device and it starts fresh with the Ellery household's November example. Use the reset button below to wipe your own entries and go back to the example figures.</p>
    <p>This month's example: ${money(t.income)} came in, ${money(t.spent)} went out, and ${money(t.left)} is left — a household that keeps ${(t.rate * 100).toFixed(0)}% of what it earns.</p>
    <button class="btn secondary" id="reset-btn">Reset to the example month</button>
    <p class="form-note" id="reset-note"></p>
  </section>

  <section class="card">
    <h2>A note on the example</h2>
    <p>The Ellery household is fictional, and its November figures are an example to show the site working. Replace them with your own numbers — add your real payday, your real rent, your real weekly shop — and the site becomes your household's budget.</p>
  </section>`;
}

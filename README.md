# Home Ledger — Household Budget Site

[![make.fun](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/zhousuai08/household-budget-site/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/zhousuai08/household-budget-site/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457)

A household budget site that runs entirely in the browser — no account, no server, no tracking. Open `app/index.html` and it works on a desktop and on a phone.

## What it does

- **Dashboard** — the whole month at a glance: income, spending, what is left, where the money went, budgets close to their limit, savings goals and recent transactions.
- **Transactions** — every entry in and out, with add, edit and delete, plus filters by type, category and search. Totals update everywhere at once.
- **Budgets** — a monthly limit for each of 11 categories, with a progress bar and a plain-English note on what is left or how far over it is.
- **Goals** — savings goals with targets and progress; add money to a goal whenever there is some to spare, or start a new goal.
- **About** — how the site works, and a reset back to the example month.

Everything is stored in the browser only (localStorage), so the numbers a household types in are still there next time it opens the page.

## The example month

The site ships with the Ellery household's November 2026 figures: $6,400 of income, $3,246.57 of spending across 30 expenses, and three savings goals. Replace them with your own numbers and it becomes your household's budget.

Screenshots in `screenshots/` are real renders of the site running: the dashboard, the transactions page, the budgets page, and the dashboard at a phone's width (390 × 844).

## Run it

Serve `app/` with any static server and open `index.html`, or just open the file in a browser. The hand-in program is `main.ts` (Node 22, standard library only): it copies `app/` and `screenshots/` to `/output` and writes `/output/dossier.json`.

Built for the [Make the best household budget site](https://make.fun/bounty/best-household-budget-site-20261126-1457) competition on make.fun.

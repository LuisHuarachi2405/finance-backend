# Module Specification

Module: Spending Plan

Version: 1.0

Status: Planned

---

# Purpose

The Spending Plan module gives the user a high-level view of how their income for a period is being distributed: what is already committed, what is being spent on top of that, how much they want to save, and how much remains available.

It answers the question the user actually asked for:

> "I earn S/ 5,000, I'm spending 30% of my income, I have 70% free, and I want to save X%."

---

# Problem

A user can see individual transactions, budgets per category, and recurring expenses, but has no single place that answers, in plain terms, "how much of my income is already spoken for, and how much can I still spend or save this month?"

---

# Goals

Allow users to:

- See, for a given period, total income, committed expenses (recurring), other actual expenses, savings target, and what remains available.
- See these as both amounts and percentages of income.
- Configure how much of their income they want to save (a target percentage).
- Compare this view across different periods.

---

# Scope

Included:

- Monthly (and, by extension, any date range) income vs. expenses vs. savings breakdown.
- A user-configurable savings target percentage.
- Read-only calculation — nothing here is a transaction or a persisted snapshot except the savings target setting itself.

Not Included:

- Evaluating whether a specific purchase or financial goal is affordable — that is Financial Goals' responsibility, which reads from this module.
- Per-category budget tracking — that is Budgets' responsibility.
- Historical financial scoring — that is Financial Health's responsibility.

This module intentionally does not depend on Budgets, Financial Health, or Financial Goals. It is a simple, self-contained calculation over Transactions and Recurring Expenses, so those other modules can build on top of it without creating circular dependencies.

---

# Core Concept

For a given period (e.g. a calendar month) and currency:

```text
Income                 100%
- Committed Expenses    ?%   (recurring expenses expected in the period)
- Other Expenses        ?%   (actual expenses not covered by a recurring expense)
- Savings Target         X%  (user-configured percentage of income)
= Available             remainder
```

Example:

```text
Monthly Income:        S/ 5,000
Committed Expenses:    S/ 1,500  (30%)
Other Expenses:        S/ 1,000  (20%)
Savings Target (20%):  S/ 1,000  (20%)

Available:              S/ 1,500  (30%)
```

Like Reports and Financial Health, this is calculated **per currency** — if the user has accounts in more than one currency, each currency gets its own breakdown, they are never mixed together.

---

# Suggested Fields

Spending Plan Result (calculated, not persisted):

- Period (dateFrom / dateTo)
- Currency
- Income
- Committed Expenses (from Recurring Expenses)
- Other Expenses (from Transactions)
- Savings Target (amount, derived from the percentage)
- Available (amount and percentage)

Savings Target Setting (the only thing this module persists):

- Savings target percentage
- Updated At

---

# Business Rules

Income, Other Expenses, and Committed Expenses are always calculated live from existing data (Transactions and Recurring Expenses) — never stored as a snapshot, so results stay reproducible and consistent with the underlying records.

Committed Expenses for a period come from active Recurring Expenses whose expected occurrence falls within that period (reusing the Recurring Expenses module's projection).

Other Expenses are actual Expense transactions in the period that are not linked to a Recurring Expense (to avoid counting the same money twice).

The savings target is a percentage of income that the user sets explicitly. It is never derived from Financial Goals or any other module.

If the user has not configured a savings target, it defaults to 0% rather than assuming a value the user never chose.

Each user has exactly one savings target setting (not per period, not per currency) — it is a general intention, applied uniformly when calculating any period's plan.

---

# Validation Rules

Date range

- Required (dateFrom, dateTo), same convention as Reports.

Savings target percentage

- Required when updating the setting.
- Must be between 0 and 100.

---

# API Responsibilities

Typical operations:

- Get spending plan for a period
- Get savings target setting
- Update savings target setting

---

# Security

Users may only see and configure their own spending plan and savings target.

---

# Future Enhancements

Possible future additions:

- Per-category breakdown inside "Other Expenses".
- Multiple named savings targets (e.g. one target per financial goal), once Financial Goals needs finer-grained allocation.
- Comparing planned vs. actual savings over time.

---

# Out of Scope

This module does not:

- Create, modify, or delete Transactions, Budgets, or Recurring Expenses.
- Evaluate the feasibility of a specific purchase (Financial Goals does this, using this module's output).

---

# Acceptance Criteria

The module is complete when:

- Users can retrieve an accurate income/committed/other/savings/available breakdown for any date range, per currency.
- Users can configure and update their savings target percentage.
- Calculations are reproducible and never require a separate persisted snapshot to stay consistent with the underlying Transactions and Recurring Expenses.

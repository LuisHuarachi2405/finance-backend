# Product Roadmap

Version: 2.0

---

# Overview

The project is developed incrementally.

Each phase builds upon the previous one to minimize unnecessary refactoring and maintain a stable and coherent architecture.

Business requirements should be implemented following this roadmap unless explicitly reprioritized.

Modules should be implemented one at a time.

A module is considered complete when:

- Its business requirements are implemented.
- Its domain behavior is implemented.
- Its persistence layer is implemented.
- Its API is implemented.
- Its validation is implemented.
- Its tests are implemented.
- Its documentation is updated.
- The implementation is consistent with the existing architecture.

---

# Phase 1 — Foundation

Status: ✅ Completed

Module:

- Authentication

Objectives:

- User authentication.
- JWT authentication.
- Access tokens.
- Refresh tokens.
- Logout and token revocation.
- Secure API access.

Dependencies:

None.

---

# Phase 2 — User Management

Status: ✅ Completed

Module:

- Users

Objectives:

- User profile.
- Personal information.
- User preferences.
- Preferred currency.
- Timezone.
- Language.

Dependencies:

Authentication.

---

# Phase 3 — Financial Accounts

Status: ✅ Completed

Module:

- Accounts

Objectives:

- Bank accounts.
- Cash accounts.
- Digital wallets.
- Account balances.
- Account status.
- Supported currencies.
- Account ownership.

Dependencies:

Users.

---

# Phase 4 — Categories

Status: ✅ Completed

Module:

- Categories

Objectives:

- Expense categories.
- Income categories.
- Custom categories.
- Category activation and archiving.
- Category ownership.

Dependencies:

Users.

---

# Phase 5 — Transactions

Status: ✅ Completed

Module:

- Transactions

Objectives:

- Register expenses.
- Register income.
- Register transfers.
- Transaction history.
- Transaction filtering.
- Transaction archiving.
- Transaction restoration.
- Transaction categorization.
- Automatic account balance updates.

Dependencies:

Accounts.

Categories.

---

# Phase 6 — Budgets

Status: ✅ Completed

Module:

- Budgets

Objectives:

- Weekly budgets.
- Monthly budgets.
- Budget tracking.
- Budget utilization.
- Remaining budget calculation.
- Budget status.
- Budget performance.

Dependencies:

Transactions.

Categories.

---

# Phase 7 — Reports

Status: ✅ Completed

Module:

- Reports

Objectives:

- Weekly reports.
- Monthly reports.
- Expense analysis.
- Income analysis.
- Cash flow.
- Category analysis.
- Account balance history.
- Budget performance.

Dependencies:

Transactions.

Budgets.

Categories.

Accounts.

---

# Phase 8 — Statement Import

Status: ✅ Completed

Module:

- Statement Import

Objectives:

- Import CSV files.
- Import Excel files.
- Import financial statements.
- Import digital wallet statements.
- Preview imported data before persistence.
- Validate imported rows.
- Store imported transactions separately from actual transactions.
- Support configurable column mapping.

Supported Providers:

- Yape

Future providers may include:

- BCP
- Other banks.
- Other digital wallets.

Dependencies:

Accounts.

Transactions.

---

# Phase 9 — Reconciliation

Status: ✅ Completed

Module:

- Reconciliation

Objectives:

- Match imported transactions with manual transactions.
- Detect possible duplicates.
- Detect missing records.
- Suggest possible matches.
- Confirm matches.
- Reject matches.
- Ignore imported records.
- Maintain reconciliation history.

Dependencies:

Transactions.

Statement Import.

Accounts.

---

# Phase 10 — Financial Health

Status: ✅ Completed

Module:

- Financial Health

Objectives:

- Financial score.
- Spending trends.
- Savings trends.
- Budget compliance.
- Cash flow analysis.
- Financial health indicators.
- Historical financial health.
- Period-based financial evaluation.

Dependencies:

Reports.

Budgets.

Transactions.

---

# Phase 11 — Recurring Expenses

Status: Planned

Module:

- Recurring Expenses

Objectives:

- Define recurring expenses.
- Define recurring expense frequency.
- Define expected payment dates.
- Define recurring expense start dates.
- Define optional end dates.
- Associate recurring expenses with categories.
- Associate recurring expenses with accounts.
- Activate or deactivate recurring expenses.
- Calculate expected recurring expenses for a period.
- Mark a recurring expense as paid, generating a real Transaction.
- Avoid manually recreating the same planned expense every month.

Examples:

- Rent.
- Internet.
- Mobile phone.
- Subscriptions.
- Insurance.
- Utilities.
- Memberships.

Important distinction:

Recurring Expenses represent expected or planned financial commitments.

They do not automatically represent actual Transactions.

An actual Transaction should only exist when the financial movement has actually occurred, and only when the user explicitly confirms it.

Dependencies:

Users.

Accounts.

Categories.

Transactions.

---

# Phase 12 — Spending Plan

Status: Planned

Module:

- Spending Plan

Objectives:

- Analyze expected income for a period.
- Analyze committed expenses (from Recurring Expenses).
- Analyze other actual expenses.
- Define a savings target percentage.
- Calculate available spending capacity.
- Calculate spending and savings as percentages of income.
- Compare income against expenses per currency.

The module should help answer questions such as:

- How much of my income is already committed?
- What percentage of my income am I spending?
- How much money will remain after recurring expenses?
- How much can I safely spend?
- How much can I save?

Example:

```text
Monthly Income:        S/ 5,000
Committed Expenses:    S/ 1,500  (30%)
Other Expenses:        S/ 1,000  (20%)
Savings Target (20%):  S/ 1,000  (20%)

Available:              S/ 1,500  (30%)
```

This module does not evaluate whether a specific goal or purchase is affordable — that is Financial Goals' responsibility, which depends on this module. Spending Plan itself does not depend on Financial Goals, Budgets, or Financial Health, to avoid duplicating their calculations and to keep the dependency graph free of cycles.

Dependencies:

Users.

Transactions.

Recurring Expenses.

---

# Phase 13 — Financial Goals

Status: Planned

Module:

- Financial Goals

Objectives:

- Create financial goals.
- Define target amounts.
- Track current saved amount (manually updated).
- Define target dates.
- Define goal priority.
- Define goal status.
- Evaluate goal feasibility using the Spending Plan module's available spending capacity.
- Estimate how many periods it would take to reach a goal at the current pace.
- Monitor progress over time.

The module should help answer questions such as:

- Can I afford this purchase already?
- Could I afford it next month?
- How long would it take to reach this goal at my current pace?

Examples:

- Buy glasses.
- Buy clothing.
- Buy a computer.
- Buy a phone.
- Buy a car.
- Build an emergency fund.
- Save for a specific purchase.

Financial goals represent future objectives. They should not be treated as actual financial transactions, and they do not move or reserve money on their own.

Known simplification: each goal is evaluated independently against the full available spending capacity for a period — there is no allocation of that capacity across multiple simultaneous goals yet (see Future Enhancements in the module's own documentation).

Dependencies:

Users.

Spending Plan.
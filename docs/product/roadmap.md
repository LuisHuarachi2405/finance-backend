# Product Roadmap

Version: 1.0

---

# Overview

The project will be developed incrementally.

Each phase builds upon the previous one to minimize refactoring and maintain a stable architecture.

Business requirements should always be implemented following this roadmap unless explicitly reprioritized.

---

# Phase 1 — Foundation

Status: ✅ Completed

Modules:

- Authentication

Main Objectives:

- User authentication
- JWT authentication
- Refresh tokens
- Authorization foundation
- Secure API access

---

# Phase 2 — User Management

Status: Planned

Module:

Users

Objectives:

- User profile
- Personal information
- Preferences
- Currency
- Timezone
- Language
- Notification settings

Dependencies:

Authentication

---

# Phase 3 — Financial Accounts

Status: Planned

Module:

Accounts

Objectives:

- Bank accounts
- Cash accounts
- Digital wallets
- Account balances
- Account status
- Supported currencies

Dependencies:

Users

---

# Phase 4 — Categories

Status: Planned

Module:

Categories

Objectives:

- Expense categories
- Income categories
- Custom categories
- Category hierarchy (future)

Dependencies:

Users

---

# Phase 5 — Transactions

Status: Planned

Module:

Transactions

Objectives:

- Register expenses
- Register income
- Register transfers
- Transaction history
- Notes
- Attachments (future)

Dependencies:

Accounts

Categories

---

# Phase 6 — Budgets

Status: Planned

Module:

Budgets

Objectives:

- Monthly budgets
- Weekly budgets
- Budget tracking
- Budget alerts (future)

Dependencies:

Transactions

---

# Phase 7 — Reports

Status: Planned

Module:

Reports

Objectives:

- Weekly reports
- Monthly reports
- Yearly reports
- Expense analysis
- Income analysis
- Cash flow
- Savings analysis

Dependencies:

Transactions

Budgets

---

# Phase 8 — Statement Import

Status: Planned

Module:

Statement Import

Objectives:

- Import CSV files
- Import Excel files
- Import bank statements
- Import digital wallet statements

Supported Providers (initially):

- BCP
- Yape

Dependencies:

Accounts

Transactions

---

# Phase 9 — Reconciliation

Status: Planned

Module:

Reconciliation

Objectives:

- Match imported transactions
- Detect duplicates
- Detect missing records
- Suggest possible matches

Dependencies:

Transactions

Statement Import

---

# Phase 10 — Financial Health

Status: Planned

Module:

Financial Health

Objectives:

- Financial score
- Spending trends
- Savings trends
- Budget compliance
- Monthly financial health indicators

Dependencies:

Reports

Budgets

Reconciliation

---

# Future Enhancements

Potential future modules:

- Investment Portfolio
- Credit Cards
- Loan Management
- Subscription Tracking
- AI Financial Assistant
- Notifications
- OCR Receipt Scanning
- Multi-user Support
- Multi-currency
- Open Banking Integration

---

# Development Strategy

Modules should always be implemented one at a time.

Each module must be considered complete before starting the next one.

Avoid parallel development unless there is a strong architectural reason.

---

# Guiding Principle

The roadmap is intended to provide development direction while remaining flexible.

Future changes should preserve architectural consistency and minimize unnecessary refactoring.
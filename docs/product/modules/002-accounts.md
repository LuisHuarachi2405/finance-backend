# Module Specification

Module: Accounts

Version: 1.0

Status: Planned

---

# Purpose

The Accounts module represents every place where money exists.

An account can represent:

- A bank account
- A digital wallet
- Cash
- Savings
- Any future financial source

Every financial transaction belongs to one account.

---

# Goals

Allow users to manage all financial accounts in one place.

The application should always know where money comes from and where money goes.

---

# Scope

Included:

- Bank accounts
- Cash accounts
- Digital wallets
- Account balances
- Account visibility

Not Included:

- Investments
- Credit cards (initial version)
- Loans
- Bank synchronization

---

# Account Types

Initial account types:

- Bank Account
- Cash
- Digital Wallet

Future account types:

- Credit Card
- Investment
- Loan
- Cryptocurrency Wallet

---

# Supported Institutions

Examples:

- BCP
- Interbank
- BBVA
- Scotiabank
- Yape
- Plin
- Cash

The institution list should remain configurable.

---

# Functional Requirements

Users should be able to:

- Create an account.
- Edit an account.
- Archive an account.
- Restore an archived account.
- View account details.
- List all active accounts.

---

# Suggested Fields

Each account should include:

- Name
- Institution
- Account Type
- Currency
- Initial Balance
- Current Balance (calculated)
- Status
- Notes

---

# Business Rules

Every account belongs to exactly one user.

Transactions must always reference an account.

Archived accounts remain available for historical reports.

Accounts should never be physically deleted.

---

# Balance

The current balance should not be manually edited.

The application should calculate the balance from:

Initial Balance

+

Income

-

Expenses

+

Incoming Transfers

-

Outgoing Transfers

---

# Validation Rules

Name

- Required

Currency

- Required

Account Type

- Required

Institution

- Optional

Initial Balance

- Cannot be null

---

# Transfers

Transfers should move money between accounts.

Transfers are not considered:

- Income

or

- Expense

They only move money.

---

# API Responsibilities

Typical operations:

- Create account
- Update account
- Archive account
- Restore account
- Get account
- List accounts

---

# Security

Users may only access their own accounts.

Cross-user account access is prohibited.

---

# Future Enhancements

Future versions may include:

- Account colors
- Account icons
- Automatic synchronization
- Open Banking
- Multiple currencies
- Exchange rates

---

# Out of Scope

This module does not:

- Import statements
- Register transactions
- Generate reports

Those responsibilities belong to other modules.

---

# Acceptance Criteria

The module is complete when:

- Accounts can be created.
- Accounts can be updated.
- Accounts can be archived.
- Historical information is preserved.
- Every transaction can reference an account.
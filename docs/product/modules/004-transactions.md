# Module Specification

Module: Transactions

Version: 1.0

Status: Planned

---

# Purpose

The Transactions module records every financial movement made by the user.

It represents the central source of financial information for the application.

Reports, budgets, financial health, and reconciliation all depend on this module.

---

# Goals

Allow users to:

- Record expenses.
- Record income.
- Transfer money between accounts.
- Maintain complete financial history.

---

# Transaction Types

Supported transaction types:

- Expense
- Income
- Transfer

No additional transaction types should exist in the initial version.

---

# Scope

Included:

- Manual transaction creation
- Transaction history
- Transaction updates
- Transaction deletion (soft delete)
- Transfers
- Notes

Not Included:

- Recurring transactions
- Attachments
- OCR receipts
- AI suggestions

---

# Domain Model

The Transactions module should model financial movements using domain concepts rather than database primitives.

The domain should avoid exposing persistence details such as Prisma models or database column types.

---

# Value Objects

The domain should introduce the following Value Objects.

## Money

Represents a monetary value.

Properties:

- amount
- currency

Responsibilities:

- Prevent invalid monetary values.
- Ensure currency consistency.
- Encapsulate monetary operations.
- Avoid passing raw decimals throughout the domain.

The persistence layer may still store the amount and currency as separate database columns.

Example

Money

- amount: 150.50
- currency: PEN

---

## TransactionType

Supported values:

- Expense
- Income
- Transfer

The domain should use a strongly typed enumeration instead of string literals.

---

## TransactionStatus

Initial values:

- Active
- Archived

Future values may include:

- Pending
- Reconciled
- Imported

---

# Domain Rules

The domain is responsible for enforcing all business rules.

Examples:

- Transaction amount must always be positive.
- Transfers must involve different accounts.
- Expenses decrease the account balance.
- Income increases the account balance.
- Archived transactions cannot be modified.

Business rules must never depend on Prisma or HTTP.

---

# Future Evolution

The design should support future features without major refactoring.

Potential future additions include:

- Multi-currency support.
- Exchange rates.
- Recurring transactions.
- Scheduled transactions.
- Installment payments.
- Split transactions.

---

# Business Rules

Every transaction belongs to one user.

Every transaction belongs to one account.

Expense transactions require an expense category.

Income transactions require an income category.

Transfer transactions do not use categories.

Transfers must involve two different accounts.

Amounts must always be positive.

---

# Functional Requirements

Users should be able to:

- Create transactions.
- Update transactions.
- Archive transactions.
- Restore transactions.
- Search transactions.
- Filter transactions.
- Sort transactions.

---

# Filtering

The application should support filtering by:

- Date
- Month
- Week
- Category
- Account
- Transaction Type
- Amount Range

---

# Sorting

Transactions should support sorting by:

- Date
- Amount
- Category
- Account

---

# Validation Rules

Amount

- Required
- Greater than zero

Transaction Date

- Required

Transaction Type

- Required

Account

- Required

Category

- Required for Income and Expense

Transfer

- Source and destination accounts must be different.

---

# Balance Updates

Creating a transaction should automatically update account balances.

Expense

Current Balance

↓

Decrease

Income

Current Balance

↑

Increase

Transfer

Source

↓

Decrease

Destination

↑

Increase

---

# API Responsibilities

Typical operations:

- Create transaction
- Update transaction
- Archive transaction
- Restore transaction
- Get transaction
- List transactions

---

# Security

Users may only manage their own transactions.

Cross-user access is prohibited.

---

# Future Enhancements

Future versions may support:

- Recurring transactions
- Scheduled transactions
- Receipt images
- OCR
- AI categorization
- Split transactions
- Shared expenses

---

# Out of Scope

This module does not:

- Import bank statements
- Perform reconciliation
- Generate reports

Those responsibilities belong to dedicated modules.

---

# Acceptance Criteria

The module is complete when:

- Expenses can be registered.
- Income can be registered.
- Transfers work correctly.
- Account balances update automatically.
- Historical data remains consistent.
- Transactions support filtering and sorting.
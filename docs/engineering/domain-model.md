# Domain Model

Version: 1.0

---

## Purpose

This document defines the core domain concepts used throughout the application.

It serves as the single source of truth for business terminology and domain modeling decisions.

---

# Core Concepts

User

Represents the authenticated owner of financial information.

---

Financial Account

Represents a place where money exists.

Examples:

- BCP Salary Account
- BCP Current Account
- Cash Wallet
- Yape Wallet

---

Transaction

Represents any financial movement.

A transaction can be:

- Expense
- Income
- Transfer

Transactions are immutable business events.

---

Category

Represents the purpose of an income or expense.

Transfers do not belong to categories.

---

Budget

Represents a spending limit over a period.

---

Financial Health

Represents aggregated financial indicators calculated from historical data.

---

# Value Objects

Money

Represents a monetary value.

Properties:

- amount
- currency

Money should never be represented by a raw decimal in the domain.

---

Currency

Represents ISO currency codes.

Examples:

- PEN
- USD

---

TransactionType

Supported values:

- Expense
- Income
- Transfer

---

BudgetPeriod

Supported values:

- Weekly
- Monthly

---

FinancialScore

Represents a calculated score between 0 and 100.

Users cannot modify this value manually.
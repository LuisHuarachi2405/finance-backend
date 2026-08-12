# Domain Model

Version: 2.0

---

## Purpose

This document defines the core domain concepts used throughout the application.

It serves as the single source of truth for business terminology and domain modeling decisions.

The domain model distinguishes between:

- Actual financial activity.
- Financial planning.
- Future financial objectives.
- Financial analysis.

New features should extend existing domain concepts whenever possible instead of introducing unnecessary entities.

---

# Core Concepts

## User

Represents the authenticated owner of financial information.

A user owns:

- Financial accounts.
- Categories.
- Transactions.
- Budgets.
- Recurring expenses.
- Financial goals.
- Spending plan configuration (savings target).

---

## Financial Account

Represents a place where money exists or is managed.

Examples:

- BCP Salary Account
- BCP Current Account
- Cash Wallet
- Yape Wallet

An account has:

- Name.
- Institution.
- Account type.
- Currency.
- Initial balance.
- Current balance.
- Status.

The current balance is derived from the account's financial activity and must not be manually modified directly.

---

## Transaction

Represents an actual financial movement.

A transaction can be:

- Expense.
- Income.
- Transfer.

Transactions represent financial activity that has already occurred.

Transaction amounts are always positive.

The transaction type determines the financial direction.

Transfers move money between accounts and do not represent income or expenses.

Transactions may originate from:

- Manual entry.
- Imported financial statements after reconciliation.

---

## Category

Represents the purpose of an income or expense.

Examples:

- Housing.
- Food.
- Transportation.
- Entertainment.
- Salary.
- Freelance Income.

Categories are associated with:

- Expenses.
- Income.

Transfers do not belong to categories.

---

## Budget

Represents a planned spending limit over a defined period.

Supported periods:

- Weekly.
- Monthly.

A budget is associated with an expense category.

A budget can provide:

- Planned amount.
- Actual spending.
- Remaining amount.
- Usage percentage.
- Budget status.

Budget calculations are derived from active transactions.

---

## Recurring Expense

Represents an expected financial commitment that occurs repeatedly according to a defined schedule.

Examples:

- Rent.
- Internet.
- Mobile phone.
- Subscription.
- Insurance.
- Utilities.

A recurring expense may define:

- Name.
- Amount.
- Currency.
- Category.
- Account.
- Frequency.
- Expected payment date.
- Start date.
- Optional end date.
- Active status.

Recurring expenses represent planning information.

They are NOT actual transactions.

When the financial movement actually occurs, it should be represented by a Transaction.

---

## Financial Goal

Represents a future financial objective.

Examples:

- Buy glasses.
- Buy clothes.
- Buy a computer.
- Buy a phone.
- Buy a car.
- Build an emergency fund.

A financial goal may contain:

- Name.
- Target amount.
- Current saved amount.
- Target date.
- Priority.
- Status.
- Notes.

Financial goals represent desired future outcomes.

They are not transactions and do not represent actual money movements by themselves.

Feasibility of a financial goal is evaluated by reading the Spending Plan's available spending capacity for the relevant period. A Financial Goal depends on a Spending Plan; a Spending Plan never depends on Financial Goals.

---

## Spending Plan

Represents how a user's income for a period is distributed between committed expenses, other expenses, savings, and what remains available.

A Spending Plan combines information from:

- Income (from Transactions).
- Other actual expenses (from Transactions, excluding ones already covered by a Recurring Expense).
- Recurring Expenses (committed amounts expected in the period).
- Savings target (a percentage of income the user configures explicitly).

It should help determine:

- Committed financial obligations for a period.
- Available spending capacity.
- Spending and savings as percentages of income.

A Spending Plan does not know about Financial Goals or Budgets. It calculates information from Transactions and Recurring Expenses only, so it can act as a foundation that other domain concepts (like Financial Goal) read from, without depending on them back — this keeps the domain model free of circular dependencies.

---

## Spending Capacity

Represents the estimated amount of money available for discretionary spending after considering relevant financial commitments and the user's savings target. This is the primary output of a Spending Plan.

Depending on the selected period, spending capacity considers:

- Expected/actual income.
- Recurring expenses.
- Other actual expenses.
- Savings target.

Example:

```text
Monthly Income:        S/ 5,000
Recurring Expenses:   S/ 1,500
Other Expenses:       S/ 1,000
Savings Target:       S/ 1,000

Available Spending:   S/ 1,500
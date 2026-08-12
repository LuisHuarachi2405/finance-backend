# Module Specification

Module: Recurring Expenses

Version: 1.0

Status: Planned

---

# Purpose

The Recurring Expenses module allows users to define expenses that occur repeatedly over time, so they don't have to manually recreate the same expense every period.

Examples include:

- Rent
- Internet
- Mobile phone
- Electricity
- Water
- Gym membership
- Streaming subscriptions
- Insurance
- Software subscriptions
- Other recurring obligations

A recurring expense is a reusable **definition**, not a Transaction. It represents an expected financial commitment. The actual financial movement is only recorded when the user turns it into a real Transaction.

---

# Problem

Without recurring expenses, a user must manually recreate the same expense records every period:

```text
January
Rent       PEN 1,000
Internet   PEN 89.90
Gym        PEN 120

February
Rent       PEN 1,000
Internet   PEN 89.90
Gym        PEN 120

March
Rent       PEN 1,000
Internet   PEN 89.90
Gym        PEN 120
```

This is tedious and error-prone. The module should let the user define this once and then quickly confirm each period's payment.

---

# Goals

Allow users to:

- Define a recurring expense once (name, amount, category, account, frequency, expected payment day).
- See, for the current period, whether each recurring expense has already been paid.
- Quickly record the payment as a real Transaction without re-entering the same fields every time.
- See upcoming/expected recurring expenses and their due dates for a future date range.
- Deactivate a recurring expense that no longer applies (e.g. a cancelled subscription) without losing its history.

---

# Scope

Included:

- Recurring expense definitions (CRUD + archive/restore).
- Weekly and monthly frequency.
- Marking a recurring expense as paid for a period (creates a real Transaction).
- Tracking whether the current period has been paid.
- Projecting expected occurrences and due dates over a date range.

Not Included:

- Automatic or scheduled creation of Transactions (no background jobs).
- Recurring income (this module is expense-only, matching its name).
- Splitting a single recurring expense into partial payments.

---

# Frequency

Supported values:

- `WEEKLY` — requires a day of week.
- `MONTHLY` — requires a day of month.

Future:

- `YEARLY` (e.g. annual insurance premiums).

---

# Suggested Fields

- Name
- Amount
- Currency (derived from the linked Account, not user-editable — same rule as Transactions)
- Category (must be an Expense category)
- Account
- Frequency (`WEEKLY` | `MONTHLY`)
- Day of week (required when frequency is `WEEKLY`)
- Day of month (required when frequency is `MONTHLY`)
- Start date
- End date (optional)
- Active status
- Created At / Updated At

---

# Business Rules

Every recurring expense belongs to one user.

The linked category must be of type Expense.

The linked account must belong to the user; the recurring expense's currency is derived from that account, never supplied directly by the user.

A recurring expense with `frequency = MONTHLY` must define a day of month and must not define a day of week. A recurring expense with `frequency = WEEKLY` must define a day of week and must not define a day of month.

If an end date is provided, it must be after the start date.

Recurring expenses are never automatically converted into Transactions. A Transaction is only created when the user explicitly confirms a payment.

Archived recurring expenses remain available for history; they stop appearing in projections and no longer accept new payments.

---

# Linking to Transactions ("Mark as Paid")

The module exposes an action that creates a real Transaction on behalf of the user, pre-filled from the recurring expense definition (account, category, amount, currency), optionally overriding the amount, date, or notes (e.g. a utility bill that varies slightly every month).

The created Transaction stores a reference back to the recurring expense definition. This reference is only used to determine "has this been paid this period" — it does not change how Transactions behave anywhere else in the system (balance updates, filtering, archiving all work exactly as they already do).

A recurring expense cannot be marked as paid twice for the same period (week or month, depending on its frequency). Attempting to do so is rejected — if the user genuinely needs a second, unrelated expense, they can create it as a normal, unlinked Transaction.

---

# Projection

Given a date range, the system can calculate, for every active recurring expense, which occurrences (due dates) fall inside that range, and whether each occurrence has already been paid.

This directly answers "what expenses do I have coming up, and when do I need to pay them" without creating or scheduling anything.

---

# Validation Rules

Name

- Required.

Amount

- Required.
- Greater than zero.

Category

- Required.
- Must be an Expense category.

Account

- Required.

Frequency

- Required.

Day of week / Day of month

- Exactly one of the two is required, matching the selected frequency.

Start Date

- Required.

End Date

- Optional. Must be after Start Date when present.

---

# API Responsibilities

Typical operations:

- Create recurring expense
- Update recurring expense
- Archive recurring expense
- Restore recurring expense
- Get recurring expense
- List recurring expenses
- Mark recurring expense as paid (creates a Transaction)
- Get projected recurring expenses for a date range

---

# Security

Users may only manage their own recurring expenses.

---

# Future Enhancements

Possible future additions:

- Yearly frequency.
- Reminders/notifications before the due date.
- Partial payments.
- Recurring income (as a separate, explicitly requested module).

---

# Out of Scope

This module does not:

- Create Transactions automatically or on a schedule.
- Perform reconciliation.
- Generate reports (Reports module already covers historical analysis).

---

# Acceptance Criteria

The module is complete when:

- Users can define, update, archive, and restore recurring expenses.
- Users can mark a recurring expense as paid, generating a real Transaction with correct balance updates.
- Duplicate payments for the same period are prevented.
- Users can see expected occurrences and due dates for a future date range.

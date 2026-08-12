# Module Specification

Module: Financial Goals

Version: 1.0

Status: Planned

---

# Purpose

The Financial Goals module lets users define future purchases or savings objectives and understand whether they are financially within reach.

Examples include:

- Buy glasses
- Buy clothes
- Buy a laptop
- Buy a car
- Save for a trip
- Build an emergency fund

The module should help answer questions such as:

- Can I afford this purchase already?
- Could I afford it next month?
- At my current pace, how many periods would it take to reach this goal?

---

# Problem

A user may want several things but not know whether any of them actually fit within their real financial capacity.

```text
Monthly Income:      S/ 5,000
Monthly Expenses:    S/ 3,000
Available:           S/ 2,000

Desired Purchase:    S/ 1,500 (glasses)
```

Without a defined available spending capacity, the user is left guessing.

---

# Goals

Allow users to:

- Define a financial goal with a target amount and (optionally) a target date.
- Track how much has already been saved toward it.
- See whether the goal is affordable right now.
- See whether it would be affordable within the current period's available spending capacity.
- Estimate how many periods it would take to reach the goal at the current pace.
- Archive a goal that is no longer relevant without losing its history.

---

# Scope

Included:

- Financial goal definitions (CRUD + archive/restore).
- Manual tracking of the amount already saved.
- Feasibility evaluation using the Spending Plan module's "available" figure.

Not Included:

- Automatically reserving or moving money toward a goal.
- Linking a goal to a specific savings account.
- Allocating available spending capacity across multiple simultaneous goals (see Business Rules).

---

# Suggested Fields

- Name
- Target Amount
- Currency
- Current Saved Amount (manually updated by the user)
- Target Date (optional)
- Priority (informational only for now — see Business Rules)
- Status (`ACTIVE` | `ACHIEVED` | `ARCHIVED`)
- Notes
- Created At / Updated At

---

# Business Rules

Every financial goal belongs to one user.

A financial goal is not a Transaction and does not move money on its own. "Current Saved Amount" is a plain number the user updates manually — it is not derived from any account balance.

Feasibility is evaluated using the Spending Plan module's "Available" amount for the relevant period, in the same currency as the goal. A goal in a currency the user has no spending-plan data for cannot be evaluated (feasibility is reported as unknown, not fabricated).

**Known simplification (documented, not an oversight):** each goal is evaluated independently, assuming it could receive 100% of the period's available amount. If a user has several active goals at once, this module does not currently split the available amount between them — each goal's projection should be read as "if I dedicated everything I can to only this goal." Cross-goal allocation is listed under Future Enhancements.

A goal is automatically eligible to be marked `ACHIEVED` once Current Saved Amount reaches Target Amount, but the system does not do this automatically — the user confirms it (consistent with the rest of the application never mutating financial state without explicit user action).

---

# Feasibility Calculation

Given a goal and a reference date:

```text
Remaining Needed   = Target Amount − Current Saved Amount
Available (period) = Spending Plan's "Available" for that period, same currency

Affordable Now         = Current Saved Amount >= Target Amount
Affordable Next Period = Remaining Needed <= Available (next period)
Estimated Periods Left = Remaining Needed / Available (period), when Available > 0
```

When the period's available amount is zero or negative, "Estimated Periods Left" is reported as not computable rather than as an infinite or negative number.

---

# Validation Rules

Name

- Required.

Target Amount

- Required.
- Greater than zero.

Currency

- Required.
- Must be a supported currency.

Current Saved Amount

- Optional on creation (defaults to 0).
- Cannot be negative.

Target Date

- Optional. When present, should be in the future at creation time.

---

# API Responsibilities

Typical operations:

- Create financial goal
- Update financial goal
- Update current saved amount
- Archive financial goal
- Restore financial goal
- Mark financial goal as achieved
- Get financial goal
- List financial goals
- Get feasibility for a financial goal

---

# Security

Users may only manage their own financial goals.

---

# Future Enhancements

Possible future additions:

- Allocating available spending capacity across multiple simultaneous goals by priority.
- Linking a goal to a dedicated savings account so progress updates automatically.
- Notifications when a goal becomes affordable.

---

# Out of Scope

This module does not:

- Move or reserve money.
- Create Transactions.
- Compute income, expenses, or available spending capacity itself — it reads that from the Spending Plan module.

---

# Acceptance Criteria

The module is complete when:

- Users can create, update, archive, and restore financial goals.
- Users can update the current saved amount.
- Users can retrieve a feasibility evaluation for a goal based on the Spending Plan module's available amount.
- The known single-goal-at-a-time simplification is clearly reflected in the response (not silently misleading when multiple goals are active).

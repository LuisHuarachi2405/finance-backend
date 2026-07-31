# Technical Decisions

Version: 1.0

---

## Purpose

This document records important technical decisions made during the project.

Future implementations should follow these decisions unless explicitly revised.

---

# Decision 001

Use a single Transaction entity.

Reason:

Income, expenses and transfers are financial movements.

Using a single entity simplifies reporting and reconciliation.

Status:

Accepted.

---

# Decision 002

Use Money as a Value Object.

Reason:

Avoid passing raw decimal values.

Prepare for future multi-currency support.

Status:

Accepted.

---

# Decision 003

Soft Delete only.

Reason:

Financial history should never be permanently removed.

Status:

Accepted.

---

# Decision 004

Account balances are calculated.

Reason:

Balances must always reflect historical transactions.

Current Balance is not manually editable.

Status:

Accepted.

---

# Decision 005

Statement Import is separated from Reconciliation.

Reason:

Importing data and matching transactions are different responsibilities.

Status:

Accepted.

---

# Decision 006

Reports never modify data.

Reason:

Reports are read-only.

Status:

Accepted.

---

# Decision 007

Future modules may adopt Lightweight CQRS.

Reason:

Complex reporting benefits from separating commands and queries.

Status:

Planned.

---

# Decision 008

Analytics calculations will be centralized.

Reason:

Avoid duplicated financial calculations.

Status:

Planned.
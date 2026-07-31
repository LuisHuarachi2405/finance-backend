# Module Specification

Module: Reconciliation

Version: 1.0

Status: Planned

---

# Purpose

The Reconciliation module compares manually recorded transactions with imported financial statements.

Its objective is to identify whether both sources represent the same financial activity.

---

# Goals

Allow users to:

- Match transactions.
- Detect duplicates.
- Detect missing transactions.
- Confirm suggested matches.
- Maintain accurate financial records.

---

# Scope

Included:

- Automatic matching
- Manual matching
- Match suggestions
- Duplicate detection
- Missing transaction detection

Not Included:

- AI predictions
- Automatic transaction creation
- Automatic deletion

---

# Matching Criteria

Possible criteria include:

- Amount
- Date
- Account
- Description similarity
- Provider reference

The matching algorithm should remain configurable.

---

# Reconciliation Status

Supported statuses:

- Pending
- Matched
- Unmatched
- Ignored

Future:

- Auto Matched
- Reviewed

---

# Functional Requirements

Users should be able to:

- View imported transactions.
- View manual transactions.
- Review suggested matches.
- Confirm matches.
- Reject matches.
- Ignore transactions.

---

# Suggested Fields

Reconciliation Record

- Manual Transaction
- Imported Transaction
- Match Score
- Status
- Reviewed By
- Reviewed At

---

# Business Rules

A manual transaction may only match one imported transaction.

An imported transaction may only match one manual transaction.

Rejected matches remain available for future review.

Historical reconciliation data must never be deleted.

---

# Matching Strategy

The reconciliation engine should prioritize:

1. Exact amount
2. Same account
3. Similar date
4. Similar description

The algorithm should be replaceable without changing the rest of the module.

---

# API Responsibilities

Typical operations:

- Get reconciliation candidates
- Confirm match
- Reject match
- Ignore imported transaction
- Get reconciliation history

---

# Security

Users may only reconcile their own financial information.

---

# Future Enhancements

Potential improvements:

- AI matching
- Confidence scoring
- Duplicate clustering
- Automatic reconciliation
- Smart recommendations

---

# Acceptance Criteria

The module is complete when:

- Suggested matches are generated.
- Users can confirm matches.
- Users can reject matches.
- Historical reconciliation remains available.
# Module Specification

Module: Categories

Version: 1.0

Status: Planned

---

# Purpose

The Categories module organizes financial transactions into meaningful groups.

Categories enable reporting, budgeting, analytics, and financial insights.

Every income and expense transaction should belong to a category.

Transfers do not require categories.

---

# Goals

Allow users to:

- Create custom categories.
- Organize transactions.
- Improve financial reporting.
- Analyze spending habits.

---

# Scope

Included:

- Expense categories
- Income categories
- Custom categories
- Category activation
- Category archive

Not Included:

- Category hierarchy
- Nested categories
- AI category suggestions

---

# Category Types

Supported types:

- Expense
- Income

Transfers should not use categories.

---

# Suggested Default Categories

Expense

- Housing
- Food
- Transportation
- Health
- Education
- Entertainment
- Shopping
- Utilities
- Insurance
- Taxes
- Miscellaneous

Income

- Salary
- Freelance
- Bonus
- Investment
- Gift
- Refund
- Other

Users may edit, archive, or create additional categories.

---

# Functional Requirements

Users should be able to:

- Create a category.
- Update a category.
- Archive a category.
- Restore a category.
- List categories.
- Filter by category type.

---

# Suggested Fields

Each category should include:

- Name
- Type
- Description
- Color
- Icon
- Active
- Created At
- Updated At

---

# Business Rules

Categories belong to a single user.

Categories should not be shared.

Archived categories must remain available for historical transactions.

Categories cannot be permanently deleted while referenced by transactions.

---

# Validation Rules

Name

- Required
- Unique per user and category type

Type

- Required

Color

- Optional

Icon

- Optional

---

# API Responsibilities

Typical operations:

- Create category
- Update category
- Archive category
- Restore category
- Get category
- List categories

---

# Security

Users may only manage their own categories.

---

# Future Enhancements

Potential future improvements:

- Category hierarchy
- AI auto-categorization
- Budget by category
- Usage statistics
- Favorite categories

---

# Acceptance Criteria

The module is complete when:

- Users can create categories.
- Users can update categories.
- Users can archive categories.
- Transactions can reference categories.
- Historical integrity is preserved.
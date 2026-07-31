# Module Specification

Module: Statement Import

Version: 1.0

Status: Planned

---

# Purpose

The Statement Import module allows users to import financial statements from banks and digital wallets.

Imported transactions become external financial records that can later be reconciled with manually created transactions.

This module is responsible only for importing and parsing files.

It must never perform reconciliation.

---

# Goals

Allow users to:

- Import bank statements.
- Import digital wallet statements.
- Validate imported files.
- Store imported transactions.
- Review imported data before reconciliation.

---

# Scope

Included:

- CSV import
- Excel import
- File validation
- Import history
- Import preview
- Import status

Not Included:

- Automatic synchronization
- Open Banking
- OCR
- PDF parsing
- Transaction matching

---

# Supported Providers

Initial providers:

- BCP
- Yape

Future providers:

- Interbank
- BBVA
- Scotiabank
- Plin
- PayPal

The architecture should allow adding new providers without modifying existing implementations.

---

# Supported File Formats

Initial support:

- CSV
- XLSX

Future:

- PDF
- OFX
- QFX

---

# Import Workflow

The import process should follow these steps:

1. Upload file.
2. Detect provider.
3. Validate format.
4. Parse transactions.
5. Validate parsed data.
6. Store imported statement.
7. Store imported transactions.
8. Notify completion.

---

# Suggested Fields

Statement

- Provider
- File Name
- Import Date
- Imported By
- Status
- Number of Transactions

Imported Transaction

- External Id
- Date
- Description
- Amount
- Currency
- Balance (optional)
- Account
- Provider Reference

---

# Validation Rules

Imported file:

- Must have a supported extension.
- Must not be empty.
- Must contain recognizable columns.

Transactions:

- Amount is required.
- Date is required.
- Description is required.

---

# Business Rules

Importing data must never modify existing manual transactions.

Each imported statement remains immutable after processing.

Importing the same file multiple times should be detected whenever possible.

---

# API Responsibilities

Typical operations:

- Upload statement
- Validate statement
- Get import history
- Get imported transactions

---

# Security

Users may only import statements into their own accounts.

Imported files should never be accessible by other users.

---

# Future Enhancements

Future versions may include:

- Direct bank integrations
- Scheduled imports
- Automatic synchronization
- OCR receipts
- AI transaction normalization

---

# Acceptance Criteria

The module is complete when:

- Supported files can be imported.
- Transactions are parsed correctly.
- Import history is available.
- Imported transactions are stored independently from manual transactions.
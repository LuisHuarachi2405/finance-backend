# Module Specification

Module: Statement Import

Version: 2.0

Status: Planned

---

# Purpose

The Statement Import module allows users to import financial statements exported from banks and digital wallets.

Its responsibility is to parse provider-specific files and transform them into a normalized internal representation.

The module does not perform reconciliation.

---

# Goals

Allow users to:

- Import financial statements.
- Validate provider files.
- Parse provider-specific formats.
- Normalize imported transactions.
- Store imported statements.
- Review imported transactions before reconciliation.

---

# Scope

Included:

- CSV import
- XLSX import
- Provider validation
- Import preview
- Import history
- Duplicate import detection

Not Included:

- PDF parsing
- OCR
- Open Banking
- Automatic synchronization
- Reconciliation

---

# Architecture

The module should follow a Strategy Pattern.

Each financial provider implements its own parser.

Example:

Statement Parser

├── Yape Parser
├── BCP CSV Parser
├── BBVA Parser (Future)
├── Interbank Parser (Future)

The import workflow must never depend on a specific provider.

New providers should be added without modifying existing implementations.

---

# Supported Providers

Initial Version

- Yape

Future Versions

- BCP
- Interbank
- BBVA
- Scotiabank
- Plin
- PayPal

---

# Supported Formats

Initial Version

- CSV
- XLSX

Future Versions

- PDF
- OFX
- QFX

---

# Import Workflow

The import process should follow these steps:

1. Upload file.
2. Detect provider.
3. Validate file format.
4. Select provider parser.
5. Parse transactions.
6. Normalize transactions.
7. Validate normalized data.
8. Store imported statement.
9. Store imported transactions.
10. Notify completion.

---

# Parser Interface

Every provider parser should expose the same contract.

Responsibilities:

- Validate file structure.
- Read rows.
- Transform provider fields.
- Return normalized transactions.

The parser must not access the database.

The parser must not perform reconciliation.

---

# Normalized Transaction

Every imported transaction should be converted into the same internal model.

Suggested fields:

- Provider
- Transaction Date
- Amount
- Currency
- Description
- Reference
- External Identifier
- Raw Data

Different providers may contain additional information.

Those values should be preserved inside Raw Data.

---

# Statement

Suggested fields:

- User
- Provider
- Original Filename
- File Hash
- Imported At
- Import Status
- Total Transactions

---

# Imported Transaction

Suggested fields:

- Statement
- Transaction Date
- Amount
- Currency
- Description
- Reference
- External Id
- Raw Data
- Reconciliation Status

---

# Duplicate Detection

The system should attempt to detect duplicate imports.

Possible criteria:

- File hash
- Provider
- Import date
- Number of transactions

Duplicate detection should reduce accidental multiple imports.

---

# Validation Rules

Uploaded file:

- Supported extension
- Non-empty
- Valid provider format

Transactions:

- Date is required.
- Amount is required.
- Description is required.

---

# Business Rules

Importing a statement must never modify manual transactions.

Imported transactions remain immutable.

Normalization must preserve provider-specific information.

Reconciliation is performed by another module.

---

# API Responsibilities

Typical operations:

- Upload statement
- Validate statement
- Preview import
- Confirm import
- List imported statements
- List imported transactions

---

# Security

Users may only import statements into their own accounts.

Imported files must never be accessible by other users.

---

# Future Enhancements

Possible future improvements:

- PDF parsers
- OFX support
- Open Banking
- Scheduled imports
- Automatic synchronization
- AI transaction classification

---

# Acceptance Criteria

The module is complete when:

- Provider files can be validated.
- Provider parsers normalize transactions correctly.
- Imported statements are stored.
- Imported transactions are stored.
- Import history is available.
- Duplicate imports are detected.
# Coding Standards

Version: 1.0

---

# Purpose

This document defines the coding standards for the project.

Every source file must follow these conventions to ensure consistency, readability, maintainability, and scalability.

---

# General Principles

Always write code that is:

- Readable
- Predictable
- Maintainable
- Testable
- Explicit

Code is written for humans first and computers second.

---

# Clean Code

Always follow Clean Code principles.

Prefer:

- Small functions
- Small classes
- Descriptive names
- Single Responsibility Principle
- Explicit behavior

Avoid:

- Large methods
- Large classes
- Nested conditionals
- Hidden side effects
- Magic numbers
- Magic strings

---

# SOLID

Every implementation should respect SOLID principles whenever practical.

Especially:

- Single Responsibility Principle
- Open/Closed Principle
- Dependency Inversion Principle

Avoid unnecessary abstractions solely to satisfy SOLID.

---

# KISS

Keep It Simple.

The simplest solution that correctly solves the problem is usually the best solution.

---

# DRY

Avoid duplicated logic.

Extract reusable behavior only after duplication becomes evident.

Do not create abstractions prematurely.

---

# YAGNI

You Aren't Gonna Need It.

Do not implement features that have not been requested.

Do not prepare the codebase for hypothetical future requirements.

---

# TypeScript

Always use strict typing.

Never disable the TypeScript compiler.

Avoid:

```ts
any
```

Prefer:

- interfaces
- types
- generics
- enums (only when appropriate)

Use `unknown` instead of `any` when the type is genuinely unknown.

---

# Naming Conventions

Use meaningful names.

Good examples:

```ts
createExpense()

calculateMonthlyBalance()

findUserByEmail()
```

Bad examples:

```ts
run()

process()

execute()

handle()
```

Method names should describe intent.

---

# Variables

Use descriptive variable names.

Good:

```ts
monthlyIncome

remainingBudget

expenseCategory
```

Bad:

```ts
x

data

temp

obj
```

---

# Functions

Functions should:

- Have one responsibility.
- Be easy to understand.
- Return predictable results.

Prefer early returns.

Avoid deeply nested logic.

---

# Classes

Each class should have one responsibility.

Large classes should be split into smaller components.

---

# Controllers

Controllers should remain thin.

Controllers should only:

- Receive requests.
- Validate input.
- Call services.
- Return responses.

Controllers must never:

- Query the database.
- Implement business rules.
- Contain complex logic.

---

# Services

Services contain application logic.

Services coordinate:

- repositories
- domain logic
- external providers

Services should remain focused.

Avoid "God Services."

---

# Repositories

Repositories are responsible only for persistence.

Repositories must never:

- Validate business rules.
- Contain HTTP logic.
- Perform presentation formatting.

---

# DTOs

DTOs define contracts.

DTOs should:

- Validate input.
- Serialize output.
- Transform values when appropriate.

DTOs should never contain business logic.

---

# Validation

Always validate external input.

Use:

- class-validator
- class-transformer

Never trust client input.

---

# Exceptions

Throw meaningful exceptions.

Prefer:

```ts
NotFoundException

ConflictException

BadRequestException

UnauthorizedException
```

Avoid generic exceptions whenever possible.

---

# Logging

Only log information that provides operational value.

Avoid:

- console.log()

Use the application's logging solution.

Never log:

- passwords
- tokens
- secrets
- sensitive personal information

---

# Comments

Code should explain itself.

Avoid unnecessary comments.

Good comments explain:

- why

Avoid comments explaining:

- what

---

# Imports

Organize imports consistently.

Example:

External libraries

NestJS

Internal modules

Relative imports

Unused imports should be removed.

---

# File Organization

One primary responsibility per file.

Avoid files with hundreds of lines.

Split large files into focused components.

---

# Constants

Avoid magic values.

Use named constants.

Good:

```ts
const MAX_LOGIN_ATTEMPTS = 5;
```

Bad:

```ts
if (attempts > 5)
```

---

# Enums

Use enums only when they improve readability.

Avoid enums with a single value.

Prefer union types when appropriate.

---

# Async Code

Prefer:

```ts
async/await
```

Avoid unnecessary Promise chains.

Always handle asynchronous errors appropriately.

---

# Code Duplication

Before creating a reusable abstraction ask:

- Is this duplicated?
- Will it actually be reused?

If not, keep the implementation simple.

---

# Readability

Readable code is more valuable than clever code.

Future developers should understand the implementation without additional explanation.

---

# Consistency

Maintain consistency across the project.

Follow existing naming conventions.

Follow existing folder organization.

Follow existing coding patterns.

Consistency is more important than personal preference.

---

# Refactoring

Continuously improve the codebase.

However:

Do not refactor unrelated code while implementing a feature unless it is necessary.

---

# Code Reviews

Before considering a task complete, verify:

- Code compiles.
- No TypeScript errors.
- No unused imports.
- No dead code.
- Naming is consistent.
- Architecture is respected.

---

# Final Principle

Every new file should look as if it was written by the same developer.

Consistency is one of the project's highest priorities.
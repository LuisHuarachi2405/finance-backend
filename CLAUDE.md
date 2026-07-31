# Finance Backend

## Project Overview

This repository contains the backend for a personal finance management application.

The project follows a modular architecture based on NestJS and is designed to be maintainable, scalable, and production-ready.

The application will evolve incrementally. Features, business rules, entities, and modules will only be implemented when explicitly requested by the user.

Never assume requirements that have not been specified.

---

# How to Work

Before performing any task, always read the following documents in order:

1. docs/engineering/engineering-constitution.md
2. docs/engineering/architecture.md
3. docs/engineering/coding-standards.md

These documents define the project's engineering standards.

Every implementation must comply with them.

---

# General Rules

Always:

- Respect the project architecture.
- Follow the official NestJS recommendations.
- Follow the official Prisma documentation.
- Follow the official PostgreSQL documentation.
- Prefer official packages over third-party alternatives.
- Use the latest stable/LTS versions unless instructed otherwise.
- Produce production-ready code.
- Keep the project simple and maintainable.

Never:

- Invent requirements.
- Create modules that were not requested.
- Add unnecessary dependencies.
- Introduce breaking architectural changes.
- Modify project conventions without explicit approval.

---

# Development Workflow

For every task:

1. Understand the requirement.
2. Analyze the existing codebase.
3. Explain relevant technical decisions when appropriate.
4. Implement only the requested scope.
5. Keep the code consistent with the existing architecture.
6. Ensure the project continues to compile successfully.

---

# Code Quality

Every contribution must:

- Compile successfully.
- Be strongly typed.
- Follow SOLID principles.
- Follow Clean Code principles.
- Respect the project architecture.
- Avoid unnecessary complexity.
- Prefer readability over cleverness.

---

# Source of Truth

If there is any conflict between generated code and the engineering documentation, the engineering documentation always takes precedence.

Never ignore the engineering documents.
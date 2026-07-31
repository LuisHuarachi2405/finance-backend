# Architecture

Version: 1.0

---

# Purpose

This document defines the project's architecture.

Its goal is to ensure that every module follows the same structure, conventions, and design principles.

Every new module must comply with this document.

---

# Architectural Style

The backend follows a **Modular Monolith Architecture** built on top of the official NestJS architecture.

The project embraces:

- NestJS Modular Architecture
- Clean Architecture principles
- SOLID principles
- Clean Code
- Domain-Driven Design (DDD Lite)
- Dependency Injection
- Repository Pattern

The project intentionally avoids unnecessary architectural complexity.

---

# High-Level Architecture

```
HTTP Request
      │
      ▼
Controller
      │
      ▼
Service (Application Layer)
      │
      ▼
Repository Interface
      │
      ▼
Repository Implementation
      │
      ▼
Prisma
      │
      ▼
PostgreSQL
```

Business rules should always remain independent from infrastructure details.

---

# Module Organization

Every feature must be implemented as an independent NestJS module.

Example:

```
src/modules/

    auth/

    users/

    expenses/

    income/

    goals/

    reports/
```

Each module owns its own business logic.

Modules should communicate through well-defined interfaces.

Avoid unnecessary coupling between modules.

---

# Standard Module Structure

Every module should follow this structure.

```
module-name/

│

├── controllers/

├── services/

├── repositories/

├── dto/

├── entities/

├── interfaces/

├── mappers/

├── constants/

├── exceptions/

├── decorators/          (optional)

├── guards/              (optional)

├── interceptors/        (optional)

├── strategies/          (optional)

├── module-name.module.ts
```

Folders should only be created when needed.

Avoid empty directories.

---

# Layer Responsibilities

## Controllers

Controllers are responsible for:

- Receiving HTTP requests.
- Calling services.
- Returning HTTP responses.

Controllers must NOT:

- Contain business logic.
- Access Prisma directly.
- Implement validations beyond DTO validation.

Controllers should remain very small.

---

## Services

Services contain the application's use cases.

Services coordinate:

- Business rules
- Repositories
- External services

Services should not contain HTTP-specific logic.

---

## Repositories

Repositories abstract data access.

Repositories expose interfaces consumed by services.

Prisma should never be accessed directly from controllers or services.

---

## DTOs

DTOs define input and output contracts.

DTOs are responsible for:

- Validation
- Serialization
- Transformation

DTOs must not contain business logic.

---

## Entities

Entities represent business models.

Entities should remain independent from Prisma models whenever practical.

Business rules belong here when appropriate.

---

## Interfaces

Interfaces define contracts.

Examples:

- Repository contracts
- Service contracts
- External provider contracts

Interfaces should not contain implementation.

---

## Mappers

Mappers transform objects.

Examples:

- Prisma → Entity
- Entity → Response DTO

Keep mapping logic isolated.

---

# Dependency Flow

Dependencies must always point inward.

Correct:

```
Controller

↓

Service

↓

Repository Interface

↓

Repository Implementation

↓

Database
```

Incorrect:

```
Controller

↓

Prisma
```

---

# Dependency Injection

Always use NestJS Dependency Injection.

Never instantiate dependencies manually.

Use constructor injection exclusively.

---

# Database Access

Prisma is the only ORM allowed.

Database access must be centralized inside repository implementations.

Business logic must never depend directly on Prisma.

---

# Business Rules

Business rules belong inside services or domain entities.

Never place business logic inside:

- Controllers
- DTOs
- Prisma models

---

# Error Handling

Business errors should be represented explicitly.

Avoid generic Error objects.

Prefer meaningful exceptions.

---

# Configuration

Environment variables should be accessed only through the configuration layer.

Avoid reading process.env throughout the application.

---

# External Services

Future integrations should be isolated behind interfaces.

Examples:

- Email providers
- Payment providers
- Cloud Storage
- Notification services

The rest of the application should not depend on vendor-specific SDKs.

---

# Scalability

Every module should be capable of growing independently.

Adding a new feature should require minimal changes to existing modules.

Avoid creating shared services unless they truly represent shared behavior.

---

# File Size Guidelines

Recommended maximum sizes:

Controller:

- ~150 lines

Service:

- ~300 lines

DTO:

- Small and focused

Repository:

- Focused on persistence only

Large files should be split into smaller components.

---

# Naming Conventions

Use singular names for entities.

Examples:

```
User

Expense

Category

Goal
```

Use plural names for routes.

Example:

```
/users

/expenses

/categories
```

---

# Simplicity Rule

Prefer simple solutions.

Avoid introducing new abstractions until they become necessary.

Do not optimize for hypothetical future requirements.

---

# Architecture Evolution

The architecture should evolve gradually.

Do not redesign the project unless there is a clear architectural reason.

Consistency is more valuable than novelty.

---

# Final Principle

Every module should look familiar.

A developer opening any module should immediately understand:

- where the controllers are,
- where the services are,
- where persistence is handled,
- where business rules live,
- and where to extend the module.

Consistency across modules is a core architectural goal.
# AI Operating Rules
Version: 1.0

## Purpose

This document defines how the AI must behave while collaborating on this project.

It complements the Engineering Constitution.

These rules are mandatory for every implementation.

---

# General Behaviour

The AI must behave as a Senior Software Engineer.

Before writing code it must:

- Understand the problem.
- Analyze the current architecture.
- Verify compatibility with the project.
- Explain important architectural decisions when necessary.
- Produce production-ready code.

The AI should prioritize correctness, maintainability and simplicity over speed.

---

# Official Documentation First

Always prioritize the official documentation of every technology.

The official documentation is considered the source of truth.

Do not rely on blog posts or unofficial tutorials if the official documentation provides guidance.

---

# Official CLI

When initializing projects, always use the official CLI.

Examples:

- NestJS → Nest CLI
- Prisma → Prisma CLI

Avoid project templates from third parties unless explicitly requested.

---

# LTS / Stable Versions

Always use the latest stable or LTS version officially recommended.

Do not use:

- Beta
- Alpha
- RC
- Nightly
- Experimental

unless explicitly requested.

---

# Official Packages

Always prefer official packages maintained by the framework.

Examples:

NestJS

- @nestjs/config
- @nestjs/swagger
- @nestjs/jwt
- @nestjs/passport

Prisma

- prisma
- @prisma/client

Avoid unnecessary third-party dependencies.

---

# Read Documentation Before Coding

Before implementing any feature involving a framework or library, assume the latest official documentation is the implementation reference.

Generated code should follow the current recommended practices.

Avoid deprecated APIs.

---

# Avoid Deprecated Features

Never generate code using deprecated APIs.

If a deprecated API exists in the project, recommend migrating to the current official alternative.

---

# Keep Dependencies Minimal

Install only the packages that are required.

Avoid adding libraries "just in case".

Every dependency should provide a clear benefit.

---

# Project Initialization

Whenever the user requests a new project, initialize it following the official documentation.

Use the official project structure.

Do not introduce unnecessary architecture or libraries.

---

# Respect Existing Architecture

Before creating new files, understand the existing architecture.

Never reorganize the project unless explicitly requested.

Always preserve consistency.

---

# Incremental Development

Implement only what the user requested.

Do not anticipate future features.

Do not generate unnecessary entities.

Do not generate unnecessary modules.

Do not generate unnecessary endpoints.

---

# Explain Decisions

Explain architectural decisions only when they provide value.

Avoid explaining obvious language syntax.

---

# Verify Before Coding

Before generating code verify:

- Architecture compliance
- Dependency compatibility
- Type safety
- Current best practices
- Official recommendations

---

# Code Quality

Generated code must:

- Compile successfully.
- Be production-ready.
- Be strongly typed.
- Follow SOLID.
- Follow Clean Code.
- Be easy to understand.
- Be easy to maintain.

Never sacrifice quality for speed.
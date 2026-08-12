# Product Vision

Version: 2.0

---

# Overview

Finance Backend is a personal finance management system designed to help users understand, organize, analyze, plan, and improve their financial health.

Unlike a simple expense tracker, the application aims to provide a complete overview of personal finances by combining manually recorded transactions with imported financial statements and financial planning tools.

The system should help users understand their current financial situation, plan future spending, manage recurring expenses, define financial goals, and make informed decisions based on their available income and spending capacity.

The project is being developed as a long-term personal project following professional software engineering practices.

---

# Vision Statement

Empower users to make better financial decisions by providing a clear, reliable, and comprehensive view of their financial activity and future financial capacity.

The application should help users understand:

- Where their money comes from.
- Where their money goes.
- How their spending changes over time.
- How much of their income is committed to expenses.
- How much income remains available.
- How much they can reasonably spend.
- Whether they are achieving their financial goals.
- Whether they can afford planned purchases.
- How healthy their financial habits are.
- How their financial situation changes over time.

---

# Target User

Initially, the application is designed for a single user.

However, the architecture should support future expansion without requiring major redesign.

Possible future users include:

- Individuals
- Families
- Freelancers
- Small business owners

Multi-user collaboration is outside the initial scope.

---

# Product Goals

The primary goals are:

- Register income.
- Register expenses.
- Organize transactions.
- Track multiple financial accounts.
- Categorize financial activity.
- Create budgets.
- Manage recurring expenses.
- Monitor financial goals.
- Plan future purchases.
- Analyze income versus expenses.
- Determine available spending capacity.
- Track savings capacity.
- Generate meaningful reports.
- Compare manual records against imported financial statements.
- Provide actionable financial insights.
- Track financial progress over time.

---

# Spending Plan

The application should not only record what has already happened.

It should also help the user plan what is expected to happen.

A Spending Plan considers:

- Expected/actual income.
- Recurring expenses.
- Other actual expenses.
- A user-configured savings target.

The system should help answer questions such as:

- How much of my monthly income is already committed?
- What percentage of my income am I spending?
- How much money should remain after my recurring expenses?
- How much can I safely spend?
- How much can I save?

The system should provide calculations based on the financial data available to it, not present them as guaranteed outcomes.

Questions about specific goals or planned purchases (e.g. "Can I afford this next month?", "How long would it take to reach this goal?") belong to the Financial Goals concept below, which reads the Spending Plan's available spending capacity rather than recalculating it.

---

# Recurring Expenses

Many personal expenses occur repeatedly over time.

The application should support recurring financial commitments so users do not need to manually recreate the same expense every month.

Examples include:

- Rent
- Internet
- Mobile phone
- Subscriptions
- Insurance
- Utilities
- Memberships
- Other recurring payments

Recurring expenses should allow the user to define information such as:

- Description.
- Amount.
- Category.
- Account.
- Frequency.
- Expected payment date.
- Start date.
- Optional end date.
- Active or inactive status.

The system should use these definitions to help generate or project expected expenses for future periods.

Recurring expense definitions represent planned or expected expenses.

They should remain conceptually separate from actual financial Transactions.

An actual transaction should only represent money that was actually recorded as spent or received.

---

# Financial Goals

The application should allow users to define financial goals related to future purchases or savings objectives.

Examples include:

- Buying glasses.
- Buying clothing.
- Buying a computer.
- Buying a phone.
- Buying a car.
- Building an emergency fund.
- Saving for a specific purchase.

A financial goal may include:

- Name.
- Target amount.
- Current saved amount.
- Target date.
- Priority.
- Status.
- Notes.

The system should help the user understand the feasibility of a goal based on their financial situation.

For example:

- Whether the goal can potentially be achieved within the target period.
- How much needs to be saved periodically.
- How much progress has already been made.
- Whether it fits within the user's current available spending capacity (from the Spending Plan concept).

Financial goals should provide projections rather than guarantees.

---

# Spending Capacity

The application should provide a concept of available spending capacity.

Spending capacity represents the portion of income that remains available after considering relevant financial commitments and planned savings.

Depending on the selected period, the system may consider:

- Total income.
- Recurring expenses.
- Other actual expenses.
- A savings target.

This is calculated by the Spending Plan concept above; it is not recalculated separately by Financial Goals or Budgets.

The application should help visualize concepts such as:

- Income: 100%
- Expenses: 30%
- Savings: 20%
- Available: 50%

These percentages are calculated from the user's actual financial data and configured planning values.

The system should make it clear that available spending capacity is an estimate based on recorded and planned information.

---

# Core Concepts

The application revolves around several core concepts:

- User
- Account
- Transaction
- Category
- Budget
- Recurring Expense
- Financial Goal
- Statement Import
- Reconciliation
- Financial Reports
- Spending Plan
- Financial Health

Every future feature should extend these concepts instead of introducing unnecessary complexity.

---

# Financial Data Lifecycle

The application should distinguish between actual financial activity and financial planning.

Actual financial data includes:

- Income transactions.
- Expense transactions.
- Transfers.
- Imported statement transactions.
- Reconciliation results.

Planning data includes:

- Budgets.
- Recurring expenses.
- Financial goals.
- Savings targets.
- Planned purchases.

Planning data should not automatically be treated as actual financial activity.

The system should use both types of data to provide financial projections and insights.

---

# Historical Financial Analysis

The application should preserve financial history over time.

Users should be able to review previous periods such as:

- January
- February
- March
- April
- May
- June
- July

For each period, users should be able to understand:

- Total income.
- Total expenses.
- Net cash flow.
- Spending distribution.
- Budget performance.
- Savings performance.
- Financial health.
- Progress toward financial goals.

Historical information should allow users to identify trends and compare financial periods.

---

# Long-Term Vision

The long-term objective is to transform the application into a complete Personal Finance Management Platform capable of:

- Importing financial statements.
- Detecting financial trends.
- Measuring financial health.
- Supporting long-term financial planning.
- Managing recurring financial commitments.
- Tracking financial goals.
- Projecting future spending capacity.
- Assisting budgeting decisions.
- Providing intelligent recommendations.

Artificial Intelligence may be incorporated in future versions to generate personalized financial insights.

---

# Out of Scope (Current Version)

The application will NOT include:

- Investments
- Cryptocurrency
- Loans
- Credit score analysis
- Direct bank integrations
- Automatic bank synchronization
- Open banking
- Shared family accounts
- Multi-tenant architecture

These features may be considered in future releases.

---

# Success Criteria

The product will be considered successful when users can:

- Understand their financial situation at any time.
- Identify unnecessary expenses.
- Monitor monthly and weekly spending.
- Compare income versus expenses.
- Understand what percentage of income is being spent.
- Understand how much income remains available.
- Track recurring financial commitments.
- Avoid manually recreating recurring expenses every period.
- Define and monitor financial goals.
- Evaluate whether a planned purchase is financially feasible.
- Monitor savings progress.
- Compare financial performance across historical periods.
- Compare manual records against imported financial statements.
- Make better financial decisions based on reliable data.

---

# Product Philosophy

The application should become the single source of truth for personal financial management.

Every feature should contribute toward helping users make informed financial decisions rather than simply storing financial data.

The product should evolve from a financial record-keeping system into a financial planning and decision-support system.

The application should distinguish clearly between:

- What already happened.
- What is expected to happen.
- What the user wants to achieve.

Actual transactions represent reality.

Budgets and recurring expenses represent planning assumptions.

Financial goals represent future objectives.

Reports and financial health provide analysis.

Together, these concepts should give the user a complete view of their current financial position and their potential future financial situation.
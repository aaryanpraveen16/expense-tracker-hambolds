1. Which parts did you build with AI assistance, and where did you have to correct, override, or rewrite what it produced?
I used AI as an accelerator for boilerplate and syntax, specifically for generating the seed.sql file and initial React components. However, I had to perform few manual correction in two areas:

Security & Environment: The AI generated code that didn't include a .gitignore for sensitive files.

Code Organization & UI/UX: The AI initially suggested placing API calls directly inside my React components, which created messy, repetitive code. I overrode this by refactoring all network logic into a centralized api.js service file. Additionally, the AI's initial UI suggestions lacked UX depth; I had to override the layout to move beyond a cramped "everything-on-one-page" design, ensuring a more logical flow for user inputs and data display.

2. Briefly describe your database schema and one tradeoff you made in designing it.
The schema consists of two relational tables: categories and expenses, linked by a category_id foreign key.

Tradeoff: I used ON DELETE SET NULL for category deletions. This keeps the expense record intact but results in "orphaned" expenses that appear as "Uncategorized" in the UI. I chose this because ON DELETE CASCADE would have permanently deleted historical financial data, which is dangerous for an expense-tracking application.

3. What would break first if this app had to handle ~1,000,000 expenses, and what would you change?
At 1,000,000 rows, the read performance would degrade significantly due to full table scans.

Pagination: Queries using ORDER BY date DESC LIMIT X would become sluggish. I would resolve this by adding a B-Tree index on the date and category_id columns to speed up filtering and sorting.

Dashboard Aggregation: Running dynamic SUM() queries across a million rows on every dashboard load would become inefficient. I would shift to using a PostgreSQL Materialized View to store pre-calculated totals, refreshing them only when new expenses are added.

4. What did you deliberately simplify or leave out given the time limit, and why?
Given the time constraints, I focused on core functionality rather than over-engineering the architecture:

Architectural Patterns: I skipped a formal Model-Controller-Service (MVC) folder structure in favor of a flatter, more direct route-based approach to keep development velocity high.

Authentication: I omitted a multi-tenant users table and login flows, focusing instead on building a robust, single-workspace dashboard.

UX Features: I excluded advanced features like bulk-deleting expenses, prioritizing a stable, secure backend with parameterized queries and strict schema validation instead.

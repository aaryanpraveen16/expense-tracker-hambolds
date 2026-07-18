-- Drop tables in reverse order of dependencies to avoid foreign key errors
DROP TABLE IF EXISTS expenses;
DROP TABLE IF EXISTS categories;

-- Create Categories Table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  monthly_budget NUMERIC(10, 2) -- Optional, can be NULL
);

-- Create Expenses Table
CREATE TABLE expenses (
  id SERIAL PRIMARY KEY,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  description TEXT NOT NULL,
  date DATE NOT NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL
);

-- Insert Demo Categories
-- Includes one normal budget, one tiny budget (to trigger over-budget), and one NULL budget
INSERT INTO categories (name, monthly_budget) VALUES 
('Office Supplies', 500.00),
('Software Subscriptions', 50.00),
('Travel', NULL);

-- Insert Demo Expenses
INSERT INTO expenses (amount, description, date, category_id) VALUES 
(120.50, 'Ergonomic keyboard', '2026-07-15', 1),
(45.00, 'Printer ink', '2026-07-16', 1),
(12.99, 'GitHub Copilot', '2026-07-01', 2),
(85.00, 'Figma Enterprise', '2026-07-05', 2), -- This pushes Software Subscriptions over budget!
(800.00, 'Flight to tech conference', '2026-07-10', 3),
(35.50, 'Uber to airport', '2026-07-10', 3),
(15.00, 'Coffee for the team', '2026-07-18', NULL); -- Tests the NULL category edge case
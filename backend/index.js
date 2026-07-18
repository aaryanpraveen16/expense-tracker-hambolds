const express = require('express');
const cors = require('cors');
const pool = require('./db');
const { categorySchema, expenseSchema, validateRequest } = require('./validators');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// --- CATEGORY ENDPOINTS ---

// POST /api/categories
// Create a category
app.post('/api/categories', validateRequest(categorySchema), async (req, res) => {
  const { name, monthly_budget } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO categories (name, monthly_budget) VALUES ($1, $2) RETURNING *',
      [name, monthly_budget || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /api/categories
// List all categories
app.get('/api/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// --- EXPENSE ENDPOINTS ---

// POST /api/expenses
// Add an expense
app.post('/api/expenses', validateRequest(expenseSchema), async (req, res) => {
  const { amount, description, date, category_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO expenses (amount, description, date, category_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [amount, description, date, category_id || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET /api/expenses
// List expenses with pagination and optional filtering
app.get('/api/expenses', async (req, res) => {
  const { limit = 10, offset = 0, category_id, start_date, end_date } = req.query;

  const parsedLimit = parseInt(limit, 10) || 10;
  const parsedOffset = parseInt(offset, 10) || 0;
  const parsedCategoryId = parseInt(category_id, 10);

  let query = `
    SELECT expenses.*, categories.name AS category_name 
    FROM expenses 
    LEFT JOIN categories ON expenses.category_id = categories.id 
    WHERE 1=1
  `;
  const queryParams = [];
  let paramIndex = 1;

  if (category_id) {
    query += ` AND expenses.category_id = $${paramIndex}`;
    queryParams.push(category_id);
    paramIndex++;
  }

  if (start_date) {
    query += ` AND expenses.date >= $${paramIndex}`;
    queryParams.push(start_date);
    paramIndex++;
  }

  if (end_date) {
    query += ` AND expenses.date <= $${paramIndex}`;
    queryParams.push(end_date);
    paramIndex++;
  }

  query += ` ORDER BY expenses.date DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
  queryParams.push(parsedLimit, parsedOffset);

  try {
    const result = await pool.query(query, queryParams);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// PUT /api/expenses/:id
// Edit an expense
app.put('/api/expenses/:id', validateRequest(expenseSchema), async (req, res) => {
  const { id } = req.params;
  const { amount, description, date, category_id } = req.body;
  try {
    const result = await pool.query(
      'UPDATE expenses SET amount = $1, description = $2, date = $3, category_id = $4 WHERE id = $5 RETURNING *',
      [amount, description, date, category_id || null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// DELETE /api/expenses/:id
// Delete an expense
app.delete('/api/expenses/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM expenses WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// --- SUMMARY ENDPOINT ---

// GET /api/summary
// Returns total spend per category, computed via SQL aggregation
app.get('/api/summary', async (req, res) => {
  const query = `
    SELECT 
      c.id, 
      c.name, 
      c.monthly_budget,
      COALESCE(SUM(e.amount), 0) AS total_spend,
      (COALESCE(SUM(e.amount), 0) > c.monthly_budget) AS exceeds_budget
    FROM 
      categories c
    LEFT JOIN 
      expenses e ON c.id = e.category_id
    GROUP BY 
      c.id, c.name, c.monthly_budget
    ORDER BY 
      c.id ASC
  `;
  try {
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

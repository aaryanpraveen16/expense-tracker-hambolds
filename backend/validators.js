const { z } = require('zod');

// Schema for category validation
const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  // Added coerce just in case the frontend sends "500" instead of 500
  monthly_budget: z.coerce.number().min(0, "Budget must be >= 0").optional(),
});

// Schema for expense validation
const expenseSchema = z.object({
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  description: z.string().min(1, "Description is required"),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  category_id: z.coerce.number().int().positive().optional().nullable(),
});

// Generic validation middleware
const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      // Reassign req.body to the perfectly cleaned Zod output
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      const errorMessages = error.errors.map(err => err.message);
      return res.status(400).json({ errors: errorMessages });
    }
  };
};

module.exports = {
  categorySchema,
  expenseSchema,
  validateRequest,
};

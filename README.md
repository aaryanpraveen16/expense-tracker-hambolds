# Team Expense Tracker

A full-stack web application that lets a team log shared expenses, organize them by category, and view a spending summary. 

Built with **Node.js, Express, PostgreSQL** for the backend, and **React, Vite, TailwindCSS** for the frontend.

## Features
- **Dashboard Summary**: View total spend, category breakdowns, and warnings for budgets that are exceeded.
- **Expense Management**: Add, edit, delete, and list expenses with pagination.
- **Filtering**: Filter expenses by category and/or date range.
- **Category Management**: Create and manage categories with optional monthly budgets.

---

## 🚀 Setup Instructions

### 1. Database Setup (PostgreSQL)

You will need a running instance of PostgreSQL.

1. Create a new database for the project (e.g., `expense_tracker`).
2. Run the provided SQL script to initialize the tables and seed data:
   ```bash
   psql -U your_username -d expense_tracker -f backend/setup.sql
   ```

### 2. Backend Setup

The backend is an Express API connecting to the Postgres database.

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables:
   - Copy `.env.example` to a new file named `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edit the `.env` file and fill in your PostgreSQL credentials:
     ```env
     DB_USER=your_pg_user
     DB_HOST=localhost
     DB_NAME=expense_tracker
     DB_PASSWORD=your_pg_password
     DB_PORT=5432
     PORT=3000
     ```
4. Start the backend server:
   ```bash
   npm start
   ```
   *The server will run on http://localhost:3000*

### 3. Frontend Setup

The frontend is a React application built with Vite and TailwindCSS.

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables:
   - Copy `.env.example` to a new file named `.env`:
     ```bash
     cp .env.example .env
     ```
   - Ensure the `.env` file points to your local backend API:
     ```env
     VITE_API_URL=http://localhost:3000/api
     ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The application will be accessible at http://localhost:5173*

---

## Tech Stack
- **Frontend**: React, Vite, TailwindCSS, Lucide React (Icons), Axios, React Router.
- **Backend**: Node.js, Express, `pg` (node-postgres), Zod (validation).
- **Database**: PostgreSQL (relational DB with proper constraint checking).

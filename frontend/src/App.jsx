import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import axios from 'axios';
import { LayoutDashboard, Wallet, Receipt, Tag } from 'lucide-react';
import SummaryCards from './components/SummaryCards';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import CategoryManager from './components/CategoryManager';

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [summary, setSummary] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [summaryRes, categoriesRes] = await Promise.all([
        axios.get(`${API_URL}/summary`),
        axios.get(`${API_URL}/categories`)
      ]);
      
      setSummary(summaryRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshTrigger]);

  const handleDataChanged = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <Router>
      <div className="min-h-screen p-6 md:p-8 lg:p-12 relative overflow-hidden">
        {/* Background decoration elements for premium feel */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-600/20 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-400">
                <LayoutDashboard size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-emerald-400">
                  Team Expense Tracker
                </h1>
                <p className="text-slate-400 mt-1">Manage and track your team's budget beautifully</p>
              </div>
            </div>
            
            {/* Navigation Tabs */}
            <nav className="flex items-center bg-slate-900/50 p-1.5 rounded-xl border border-slate-700/50 overflow-x-auto">
              <NavLink
                to="/summary"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                    isActive ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`
                }
              >
                <Wallet size={18} />
                Summary
              </NavLink>
              <NavLink
                to="/expenses"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                    isActive ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`
                }
              >
                <Receipt size={18} />
                Expenses
              </NavLink>
              <NavLink
                to="/categories"
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                    isActive ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`
                }
              >
                <Tag size={18} />
                Categories
              </NavLink>
            </nav>
          </header>

          {loading && categories.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <Routes>
              <Route path="/" element={<Navigate to="/summary" replace />} />
              <Route path="/summary" element={
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <SummaryCards summary={summary} />
                </div>
              } />
              <Route path="/categories" element={
                <div className="max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <CategoryManager categories={categories} onCategoriesChanged={handleDataChanged} />
                </div>
              } />
              <Route path="/expenses" element={
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="lg:col-span-1 space-y-8">
                    <ExpenseForm categories={categories} onExpenseAdded={handleDataChanged} />
                  </div>
                  <div className="lg:col-span-2">
                    <ExpenseList categories={categories} refreshTrigger={refreshTrigger} onDataChanged={handleDataChanged} />
                  </div>
                </div>
              } />
            </Routes>
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;

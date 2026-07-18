import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { getSummary, getCategories } from './api';
import { LayoutDashboard, Wallet, Receipt, Plus, Tag } from 'lucide-react';
import SummaryCards from './components/SummaryCards';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import CategoryManager from './components/CategoryManager';
import Modal from './components/Modal';

function App() {
  const [summary, setSummary] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Modal states
  const [isExpenseModalOpen, setExpenseModalOpen] = useState(false);
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [summaryRes, categoriesRes] = await Promise.all([
        getSummary(),
        getCategories()
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
              <Route path="/expenses" element={
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Action Bar */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/40 p-5 rounded-2xl border border-slate-700/50">
                    <div>
                      <h2 className="text-xl font-semibold text-slate-100">Expenses</h2>
                      <p className="text-slate-400 text-sm mt-1">Manage and track your spending</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setCategoryModalOpen(true)} 
                        className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                      >
                        <Tag size={18} />
                        Manage Categories
                      </button>
                      <button 
                        onClick={() => setExpenseModalOpen(true)} 
                        className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20"
                      >
                        <Plus size={18} />
                        Add Expense
                      </button>
                    </div>
                  </div>
                  
                  {/* Expense List Full Width */}
                  <ExpenseList categories={categories} refreshTrigger={refreshTrigger} onDataChanged={handleDataChanged} />

                  {/* Modals */}
                  <Modal isOpen={isExpenseModalOpen} onClose={() => setExpenseModalOpen(false)}>
                    <ExpenseForm 
                      categories={categories} 
                      onExpenseAdded={() => {
                        handleDataChanged();
                        setExpenseModalOpen(false);
                      }} 
                    />
                  </Modal>

                  <Modal isOpen={isCategoryModalOpen} onClose={() => setCategoryModalOpen(false)}>
                    <CategoryManager 
                      categories={categories} 
                      onCategoriesChanged={handleDataChanged} 
                    />
                  </Modal>
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

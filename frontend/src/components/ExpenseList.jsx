import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { FileText, Calendar, Tag, Edit2, Trash2, Check, X, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

const ExpenseList = ({ categories, refreshTrigger, onDataChanged }) => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Filtering & Pagination State
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  
  // Editing State
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ amount: '', description: '', date: '', category_id: '' });

  const fetchExpenses = useCallback(async () => {
    try {
      setLoading(true);
      const params = { limit, offset };
      if (filterCategory) params.category_id = filterCategory;
      if (filterStartDate) params.start_date = filterStartDate;
      if (filterEndDate) params.end_date = filterEndDate;
      
      const res = await axios.get(`${API_URL}/expenses`, { params });
      setExpenses(res.data);
    } catch (err) {
      console.error('Error fetching expenses:', err);
    } finally {
      setLoading(false);
    }
  }, [limit, offset, filterCategory, filterStartDate, filterEndDate]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses, refreshTrigger]);

  // Reset pagination when filters change
  useEffect(() => {
    setOffset(0);
  }, [filterCategory, filterStartDate, filterEndDate]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    try {
      await axios.delete(`${API_URL}/expenses/${id}`);
      onDataChanged();
    } catch (err) {
      console.error('Error deleting expense:', err);
    }
  };

  const startEditing = (expense) => {
    setEditingId(expense.id);
    const dateObj = new Date(expense.date);
    const dateStr = dateObj.toISOString().split('T')[0];
    setEditForm({
      amount: expense.amount,
      description: expense.description,
      date: dateStr,
      category_id: expense.category_id || ''
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`${API_URL}/expenses/${id}`, {
        amount: parseFloat(editForm.amount),
        description: editForm.description,
        date: editForm.date,
        category_id: editForm.category_id ? parseInt(editForm.category_id) : null
      });
      setEditingId(null);
      onDataChanged();
    } catch (err) {
      console.error('Error updating expense:', err);
      alert('Failed to update expense. Please check your inputs.');
    }
  };

  const handleNextPage = () => {
    if (expenses.length === limit) {
      setOffset(offset + limit);
    }
  };

  const handlePrevPage = () => {
    if (offset >= limit) {
      setOffset(offset - limit);
    }
  };

  return (
    <div className="glass rounded-2xl overflow-hidden flex flex-col h-full min-h-[500px]">
      <div className="p-6 lg:p-8 border-b border-slate-700/50 flex flex-col gap-4 bg-slate-800/30">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
            <FileText className="text-indigo-400" size={24} />
            Recent Expenses
          </h2>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 bg-slate-900/40 p-4 rounded-xl border border-slate-700/50">
          <div className="flex items-center gap-2 text-slate-400">
            <Filter size={16} />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          
          <div className="flex items-center gap-2">
            <input 
              type="date" 
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
              className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            />
            <span className="text-slate-500 text-sm">to</span>
            <input 
              type="date" 
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
              className="bg-slate-800 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
          
          {(filterCategory || filterStartDate || filterEndDate) && (
            <button 
              onClick={() => {
                setFilterCategory('');
                setFilterStartDate('');
                setFilterEndDate('');
              }}
              className="text-xs text-rose-400 hover:text-rose-300 ml-auto px-2 py-1 rounded-md hover:bg-rose-400/10 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>
      
      <div className="flex-1 overflow-x-auto relative">
        {loading && (
          <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center z-10">
            <div className="animate-spin w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
          </div>
        )}
        
        {(!expenses || expenses.length === 0) ? (
          <div className="h-full flex items-center justify-center text-slate-400 p-8 min-h-[200px]">
            <p>No expenses found.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-900/30 text-slate-400 text-sm font-medium">
                <th className="py-4 px-6 border-b border-slate-700/50">Date</th>
                <th className="py-4 px-6 border-b border-slate-700/50">Description</th>
                <th className="py-4 px-6 border-b border-slate-700/50">Category</th>
                <th className="py-4 px-6 border-b border-slate-700/50 text-right">Amount</th>
                <th className="py-4 px-6 border-b border-slate-700/50 text-center w-24">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/30">
              {expenses.map((expense) => {
                const isEditing = editingId === expense.id;
                
                if (isEditing) {
                  return (
                    <tr key={expense.id} className="bg-indigo-900/20">
                      <td className="py-3 px-4">
                        <input type="date" value={editForm.date} onChange={e => setEditForm({...editForm, date: e.target.value})} className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm text-white" />
                      </td>
                      <td className="py-3 px-4">
                        <input type="text" value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm text-white" />
                      </td>
                      <td className="py-3 px-4">
                        <select value={editForm.category_id} onChange={e => setEditForm({...editForm, category_id: e.target.value})} className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm text-white">
                          <option value="">Uncategorized</option>
                          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <input type="number" step="0.01" min="0" value={editForm.amount} onChange={e => setEditForm({...editForm, amount: e.target.value})} className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm text-white text-right" />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => saveEdit(expense.id)} className="text-emerald-400 hover:bg-emerald-400/20 p-1.5 rounded transition-colors" title="Save"><Check size={16} /></button>
                          <button onClick={cancelEditing} className="text-rose-400 hover:bg-rose-400/20 p-1.5 rounded transition-colors" title="Cancel"><X size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                }
                
                const dateObj = new Date(expense.date);
                // Adjust date to fix timezone issues when displaying
                const displayDate = new Date(dateObj.getTime() + Math.abs(dateObj.getTimezoneOffset() * 60000));
                const formattedDate = displayDate.toLocaleDateString(undefined, { 
                  month: 'short', day: 'numeric', year: 'numeric' 
                });
                
                return (
                  <tr key={expense.id} className="hover:bg-slate-800/40 transition-colors group">
                    <td className="py-4 px-6 text-slate-300">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-slate-500 group-hover:text-indigo-400 transition-colors" />
                        <span>{formattedDate}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-200 font-medium">{expense.description}</td>
                    <td className="py-4 px-6">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-700/40 text-slate-300 text-xs font-medium border border-slate-600/30">
                        <Tag size={12} />
                        {expense.category_name || 'Uncategorized'}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right font-semibold text-slate-100">
                      ${Number(expense.amount).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => startEditing(expense)} className="text-slate-400 hover:text-indigo-400 hover:bg-indigo-400/10 p-1.5 rounded-lg transition-colors" title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleDelete(expense.id)} className="text-slate-400 hover:text-rose-400 hover:bg-rose-400/10 p-1.5 rounded-lg transition-colors" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      
      {/* Pagination Controls */}
      <div className="p-4 border-t border-slate-700/50 bg-slate-800/30 flex justify-between items-center text-sm text-slate-400">
        <div>
          Showing {expenses.length > 0 ? offset + 1 : 0} to {offset + expenses.length}
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrevPage}
            disabled={offset === 0}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-200 disabled:opacity-30 disabled:hover:bg-slate-700/50 transition-colors"
          >
            <ChevronLeft size={16} /> Prev
          </button>
          <button 
            onClick={handleNextPage}
            disabled={expenses.length < limit}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-200 disabled:opacity-30 disabled:hover:bg-slate-700/50 transition-colors"
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpenseList;

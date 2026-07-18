import React, { useState } from 'react';
import { Tag, Trash2, Plus, AlertCircle } from 'lucide-react';
import { createCategory, deleteCategory } from '../api';

const CategoryManager = ({ categories, onCategoriesChanged }) => {
  const [name, setName] = useState('');
  const [budget, setBudget] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setLoading(true);
      setError(null);
      await createCategory({
        name,
        monthly_budget: budget ? parseFloat(budget) : null
      });
      setName('');
      setBudget('');
      onCategoriesChanged();
    } catch (err) {
      setError('Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category? Expenses will become uncategorized.')) {
      return;
    }
    
    try {
      setLoading(true);
      await deleteCategory(id);
      onCategoriesChanged();
    } catch (err) {
      setError('Failed to delete category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass rounded-2xl overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-slate-700/50 flex justify-between items-center bg-slate-800/30">
        <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
          <Tag className="text-emerald-400" size={24} />
          Manage Categories
        </h2>
      </div>

      <div className="p-6 space-y-6">
        {error && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl flex items-center gap-2">
            <AlertCircle size={18} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-4 items-start">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                placeholder="e.g. Marketing"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Monthly Budget (Optional)</label>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || !name.trim()}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            Add Category
          </button>
        </form>

        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between p-4 bg-slate-800/40 rounded-xl border border-slate-700/30">
              <div>
                <h4 className="text-slate-200 font-medium">{cat.name}</h4>
                <p className="text-sm text-slate-400">
                  Budget: {cat.monthly_budget ? `$${Number(cat.monthly_budget).toFixed(2)}/mo` : 'None'}
                </p>
              </div>
              <button
                onClick={() => handleDelete(cat.id)}
                disabled={loading}
                className="text-slate-500 hover:text-rose-400 hover:bg-rose-400/10 p-2 rounded-lg transition-colors"
                title="Delete Category"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-center text-slate-400 py-4">No categories created yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;

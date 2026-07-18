import React from 'react';
import { AlertCircle, Wallet } from 'lucide-react';

const SummaryCards = ({ summary }) => {
  if (!summary || summary.length === 0) {
    return (
      <div className="glass rounded-2xl p-6 text-center text-slate-400">
        No summary data available. Add some categories and expenses!
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {summary.map((cat) => {
        const exceeds = cat.exceeds_budget;
        
        return (
          <div 
            key={cat.id} 
            className={`glass rounded-2xl p-6 transition-all duration-300 hover:translate-y-[-4px] ${
              exceeds 
                ? 'border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.15)]' 
                : 'hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]'
            }`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 rounded-xl ${exceeds ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                <Wallet size={20} />
              </div>
              {exceeds && (
                <div className="flex items-center gap-1.5 text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full text-xs font-medium">
                  <AlertCircle size={14} />
                  <span>Over Budget</span>
                </div>
              )}
            </div>
            
            <h3 className="text-slate-300 font-medium mb-1 truncate">{cat.name}</h3>
            
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-bold ${exceeds ? 'text-rose-400' : 'text-slate-100'}`}>
                ${Number(cat.total_spend).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </span>
              <span className="text-slate-500 text-sm">
                / ${Number(cat.monthly_budget || 0).toLocaleString()}
              </span>
            </div>
            
            {/* Progress bar */}
            <div className="mt-4 h-1.5 w-full bg-slate-700/50 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  exceeds ? 'bg-rose-500' : 'bg-emerald-500'
                }`}
                style={{ 
                  width: `${Math.min(100, (cat.total_spend / (cat.monthly_budget || 1)) * 100)}%` 
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;

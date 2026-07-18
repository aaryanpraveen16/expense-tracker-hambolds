import React from 'react';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto rounded-2xl">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-10 p-1.5 bg-slate-800/80 hover:bg-rose-500 text-slate-300 hover:text-white rounded-lg backdrop-blur-md transition-all shadow-lg"
        >
          <X size={20} />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;

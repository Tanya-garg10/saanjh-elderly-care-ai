import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map((toast) => {
        let bgStyle = 'bg-[#294B3A] text-white border-[#294B3A]';
        let Icon = CheckCircle2;

        if (toast.type === 'info') {
          bgStyle = 'bg-[#FFFFFF] text-[#26372D] border-[#65866E] shadow-xl';
          Icon = Info;
        } else if (toast.type === 'warning') {
          bgStyle = 'bg-[#FFF8E7] text-[#8C5E14] border-[#E8D4A8] shadow-lg';
          Icon = AlertTriangle;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-xl border shadow-lg transition-all transform translate-y-0 ${bgStyle}`}
          >
            <div className="flex items-center gap-3">
              <Icon className="w-5 h-5 shrink-0 text-[#65866E]" />
              <p className="text-sm font-medium leading-tight">{toast.text}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              aria-label="Dismiss alert"
              className="p-1 opacity-70 hover:opacity-100 rounded-md transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

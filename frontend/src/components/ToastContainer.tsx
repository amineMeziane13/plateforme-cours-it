import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { ToastNotification } from '../types';

interface ToastContainerProps {
  toasts: ToastNotification[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        let borderClass = 'border-cyan-500/40 bg-cyber-card/95 text-slate-100 shadow-glow-cyan';
        let icon = <Info className="w-5 h-5 text-cyan-400" />;

        if (isSuccess) {
          borderClass = 'border-emerald-500/40 bg-cyber-card/95 text-slate-100 shadow-glow-blue';
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
        } else if (isError) {
          borderClass = 'border-red-500/50 bg-cyber-card/95 text-slate-100 shadow-glow-red';
          icon = <AlertCircle className="w-5 h-5 text-red-400" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start justify-between p-4 rounded-xl border backdrop-blur-md transition-all animate-slide-up ${borderClass}`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">{icon}</div>
              <div>
                <h5 className="font-bold text-xs uppercase tracking-wider font-mono">
                  {toast.title}
                </h5>
                <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
                  {toast.message}
                </p>
              </div>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="flex-shrink-0 ml-3 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

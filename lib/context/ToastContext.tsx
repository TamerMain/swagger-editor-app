'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Toast = { id: string; message: string; type: 'error' | 'success' };

type ToastContextType = {
  showErrorToast: (msg: string) => void;
  showSuccessToast: (msg: string) => void;
};

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'error' | 'success') => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const showErrorToast = (msg: string) => showToast(msg, 'error');
  const showSuccessToast = (msg: string) => showToast(msg, 'success');

  const getColor = (type: 'error' | 'success') => {
    return type === 'error' 
      ? 'bg-red-950 border-red-500' 
      : 'bg-green-950 border-green-500';
  };

  return (
    <ToastContext.Provider value={{ showErrorToast, showSuccessToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-md">
        {toasts.slice().reverse().map((toast) => (
          <div
            key={toast.id}
            className={`${getColor(toast.type)} border text-white p-4 rounded shadow-lg`}
          >
            <div className="flex justify-between items-center">
              <span className="text-sm">{toast.message}</span>
              <button
                onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
                className="ml-4 text-white/70 hover:text-white"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
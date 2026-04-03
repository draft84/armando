import { useState, useCallback } from 'react';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

export function useToast() {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((type, message, duration = 4000) => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, type, message }]);

        if (duration > 0) {
            setTimeout(() => {
                setToasts(prev => prev.filter(t => t.id !== id));
            }, duration);
        }
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const success = useCallback((msg, dur) => addToast('success', msg, dur), [addToast]);
    const error = useCallback((msg, dur) => addToast('error', msg, dur), [addToast]);
    const warning = useCallback((msg, dur) => addToast('warning', msg, dur), [addToast]);

    const ToastContainer = () => (
        <div className="fixed top-4 right-4 z-[9999] space-y-3 max-w-md pointer-events-none">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-sm animate-slide-in ${
                        toast.type === 'success'
                            ? 'bg-green-50/95 dark:bg-green-900/90 border-green-200 dark:border-green-700'
                            : toast.type === 'error'
                            ? 'bg-red-50/95 dark:bg-red-900/90 border-red-200 dark:border-red-700'
                            : 'bg-yellow-50/95 dark:bg-yellow-900/90 border-yellow-200 dark:border-yellow-700'
                    }`}
                >
                    <div className="flex-shrink-0 mt-0.5">
                        {toast.type === 'success' && <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />}
                        {toast.type === 'error' && <XCircleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />}
                        {toast.type === 'warning' && <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />}
                    </div>
                    <p className={`text-sm font-medium flex-1 ${
                        toast.type === 'success' ? 'text-green-800 dark:text-green-200'
                            : toast.type === 'error' ? 'text-red-800 dark:text-red-200'
                            : 'text-yellow-800 dark:text-yellow-200'
                    }`}>
                        {toast.message}
                    </p>
                    <button
                        onClick={() => removeToast(toast.id)}
                        className={`flex-shrink-0 p-1 rounded-lg transition-colors ${
                            toast.type === 'success' ? 'text-green-500 hover:bg-green-100 dark:hover:bg-green-800'
                                : toast.type === 'error' ? 'text-red-500 hover:bg-red-100 dark:hover:bg-red-800'
                                : 'text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-800'
                        }`}
                    >
                        <XMarkIcon className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
    );

    return { success, error, warning, ToastContainer };
}

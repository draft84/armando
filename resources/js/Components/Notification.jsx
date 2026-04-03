import { useState, useEffect, createContext, useContext } from 'react';
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, XMarkIcon } from '@heroicons/react/24/outline';

const NotificationContext = createContext();

export function useNotification() {
    return useContext(NotificationContext);
}

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);

    const addNotification = (type, message, duration = 4000) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, type, message, duration }]);

        if (duration > 0) {
            setTimeout(() => {
                setNotifications(prev => prev.filter(n => n.id !== id));
            }, duration);
        }
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    const success = (message, duration) => addNotification('success', message, duration);
    const error = (message, duration) => addNotification('error', message, duration);
    const warning = (message, duration) => addNotification('warning', message, duration);

    return (
        <NotificationContext.Provider value={{ success, error, warning }}>
            {children}
            <div className="fixed top-4 right-4 z-[9999] space-y-3 max-w-md">
                {notifications.map((notification) => (
                    <div
                        key={notification.id}
                        className={`flex items-start gap-3 p-4 rounded-xl shadow-2xl border backdrop-blur-sm transform transition-all duration-300 animate-slide-in ${
                            notification.type === 'success'
                                ? 'bg-green-50/95 dark:bg-green-900/90 border-green-200 dark:border-green-700'
                                : notification.type === 'error'
                                ? 'bg-red-50/95 dark:bg-red-900/90 border-red-200 dark:border-red-700'
                                : 'bg-yellow-50/95 dark:bg-yellow-900/90 border-yellow-200 dark:border-yellow-700'
                        }`}
                    >
                        <div className="flex-shrink-0 mt-0.5">
                            {notification.type === 'success' && (
                                <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                            )}
                            {notification.type === 'error' && (
                                <XCircleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                            )}
                            {notification.type === 'warning' && (
                                <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                            )}
                        </div>
                        <p className={`text-sm font-medium flex-1 ${
                            notification.type === 'success'
                                ? 'text-green-800 dark:text-green-200'
                                : notification.type === 'error'
                                ? 'text-red-800 dark:text-red-200'
                                : 'text-yellow-800 dark:text-yellow-200'
                        }`}>
                            {notification.message}
                        </p>
                        <button
                            onClick={() => removeNotification(notification.id)}
                            className={`flex-shrink-0 p-1 rounded-lg transition-colors ${
                                notification.type === 'success'
                                    ? 'text-green-500 hover:bg-green-100 dark:hover:bg-green-800'
                                    : notification.type === 'error'
                                    ? 'text-red-500 hover:bg-red-100 dark:hover:bg-red-800'
                                    : 'text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-800'
                            }`}
                        >
                            <XMarkIcon className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
}

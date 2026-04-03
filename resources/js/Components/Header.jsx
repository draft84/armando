import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import {
    BellIcon,
    MoonIcon,
    SunIcon,
    ArrowRightOnRectangleIcon,
    XMarkIcon,
} from '@heroicons/react/24/outline';

export default function Header({ toggleSidebar, darkMode, toggleDarkMode }) {
    const { auth, appName } = usePage().props;
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    // Notificaciones de ejemplo
    const notifications = [
        {
            id: 1,
            title: 'Nuevo ingreso registrado',
            message: 'Se ha registrado un nuevo ingreso de ATUN',
            time: 'Hace 5 minutos',
            unread: true,
        },
        {
            id: 2,
            title: 'Actualización de sistema',
            message: 'El sistema se actualizará el domingo',
            time: 'Hace 1 hora',
            unread: true,
        },
        {
            id: 3,
            title: 'Reporte mensual listo',
            message: 'El reporte de producción está disponible',
            time: 'Hace 2 horas',
            unread: false,
        },
    ];

    const unreadCount = notifications.filter(n => n.unread).length;

    const handleLogout = () => {
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

        fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'text/html, application/xhtml+xml',
                'X-CSRF-TOKEN': csrfToken || '',
            },
            credentials: 'same-origin',
        }).then(response => {
            if (response.ok) {
                window.location.href = '/';
            } else {
                window.location.href = '/';
            }
        }).catch(() => {
            window.location.href = '/';
        });
    };

    return (
        <header className="bg-white dark:bg-gray-800 shadow-sm h-16 flex items-center justify-between px-6 sticky top-0 z-30">
            {/* Lado izquierdo */}
            <div className="flex items-center">
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 lg:hidden"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                
                <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 ml-4">
                    {appName}
                </h2>
            </div>

            {/* Lado derecho */}
            <div className="flex items-center space-x-4">
                {/* Toggle Tema Claro/Oscuro */}
                <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
                    title={darkMode ? 'Modo claro' : 'Modo oscuro'}
                >
                    {darkMode ? (
                        <SunIcon className="w-5 h-5" />
                    ) : (
                        <MoonIcon className="w-5 h-5" />
                    )}
                </button>

                {/* Notificaciones */}
                <div className="relative">
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors relative"
                    >
                        <BellIcon className="w-5 h-5" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                {unreadCount}
                            </span>
                        )}
                    </button>

                    {showNotifications && (
                        <>
                            <div 
                                className="fixed inset-0 z-10" 
                                onClick={() => setShowNotifications(false)}
                            />
                            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                                    <h3 className="font-semibold text-gray-800 dark:text-white">
                                        Notificaciones
                                    </h3>
                                    <button
                                        onClick={() => setShowNotifications(false)}
                                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
                                    >
                                        <XMarkIcon className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${
                                                notification.unread ? 'bg-blue-50 dark:bg-gray-750' : ''
                                            }`}
                                        >
                                            <p className="font-medium text-gray-800 dark:text-white">
                                                {notification.title}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-2">
                                                {notification.time}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-4 text-center border-t border-gray-200 dark:border-gray-700">
                                    <button className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
                                        Ver todas las notificaciones
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {/* Menú de Usuario */}
                <div className="relative">
                    <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                            {auth?.user?.name?.charAt(0) || 'A'}
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden md:block">
                            {auth?.user?.name || 'Usuario'}
                        </span>
                    </button>

                    {showUserMenu && (
                        <>
                            <div 
                                className="fixed inset-0 z-10" 
                                onClick={() => setShowUserMenu(false)}
                            />
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20">
                                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                    <p className="font-medium text-gray-800 dark:text-white">
                                        {auth?.user?.name}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {auth?.user?.email}
                                    </p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center px-4 py-3 text-left text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                                    Cerrar Sesión
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

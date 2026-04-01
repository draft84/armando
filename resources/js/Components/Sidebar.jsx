import { Link, usePage } from '@inertiajs/react';
import {
    HomeIcon,
    ArrowDownTrayIcon,
    ArrowUpTrayIcon,
    DocumentTextIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ClipboardDocumentListIcon,
    CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

const menuItems = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        icon: HomeIcon,
    },
    {
        name: 'Ingresos',
        href: '/ingresos',
        icon: ArrowDownTrayIcon,
    },
    {
        name: 'Resumen',
        href: '/resumen',
        icon: DocumentTextIcon,
    },
    {
        name: 'Salidas',
        href: '/salidas',
        icon: ArrowUpTrayIcon,
    },
    {
        name: 'Formatos Producción',
        href: '#',
        icon: ClipboardDocumentListIcon,
    },
    {
        name: 'Costos',
        href: '#',
        icon: CurrencyDollarIcon,
    },
];

export default function Sidebar({ isOpen, toggleSidebar, currentPage }) {
    const { auth } = usePage().props;

    return (
        <aside
            className={`fixed top-0 left-0 z-40 h-screen bg-gradient-to-b from-blue-900 to-blue-800 dark:from-gray-900 dark:to-gray-800 transition-all duration-300 ${
                isOpen ? 'w-64' : 'w-20'
            }`}
        >
            {/* Header del Sidebar */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-blue-700 dark:border-gray-700">
                {isOpen && (
                    <span className="text-xl font-bold text-white">SYSF</span>
                )}
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-lg text-white hover:bg-blue-700 dark:hover:bg-gray-700 transition-colors"
                >
                    {isOpen ? (
                        <ChevronLeftIcon className="w-5 h-5" />
                    ) : (
                        <ChevronRightIcon className="w-5 h-5" />
                    )}
                </button>
            </div>

            {/* Menú de Navegación */}
            <nav className="mt-4 px-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentPage === item.name.replace(' ', '');
                    
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-colors ${
                                isActive
                                    ? 'bg-blue-700 text-white'
                                    : 'text-blue-100 hover:bg-blue-700 dark:text-gray-300 dark:hover:bg-gray-700'
                            }`}
                        >
                            <Icon className="w-6 h-6 flex-shrink-0" />
                            {isOpen && (
                                <span className="ml-3 whitespace-nowrap">{item.name}</span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Usuario Logueado */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-700 dark:border-gray-700">
                <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
                        {auth?.user?.name?.charAt(0) || 'A'}
                    </div>
                    {isOpen && (
                        <div className="ml-3">
                            <p className="text-sm font-medium text-white">
                                {auth?.user?.name || 'Usuario'}
                            </p>
                            <p className="text-xs text-blue-200">
                                {auth?.user?.email || 'usuario@sysf.com'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}

import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import Sidebar from '@/Components/Sidebar';
import Header from '@/Components/Header';

export default function AppLayout({ children, title }) {
    const { component } = usePage();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        // Verificar preferencia de tema guardada
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setDarkMode(true);
            document.documentElement.classList.add('dark');
        }
    }, []);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        if (!darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <Sidebar 
                isOpen={sidebarOpen} 
                toggleSidebar={toggleSidebar}
                currentPage={component.replace('/', '.').replace('Index', '')}
            />
            
            <div 
                className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}
            >
                <Header 
                    toggleSidebar={toggleSidebar} 
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                />
                
                <main className="p-6">
                    {title && (
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                                {title}
                            </h1>
                        </div>
                    )}
                    {children}
                </main>
            </div>
        </div>
    );
}

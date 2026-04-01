import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/login', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900">
            <Head title="Iniciar Sesión" />
            
            <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl">
                {/* Logo y Título */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">SYSF</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Sistema de Gestión de Producción
                    </p>
                </div>

                {/* Formulario */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email */}
                    <div>
                        <label 
                            htmlFor="email" 
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                            Correo Electrónico
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className="input-field"
                            placeholder="admin@sysf.com"
                            required
                            autoFocus
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    {/* Password */}
                    <div>
                        <label 
                            htmlFor="password" 
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                        >
                            Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className="input-field"
                            placeholder="••••••••"
                            required
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    {/* Recordar */}
                    <div className="flex items-center">
                        <input
                            id="remember"
                            type="checkbox"
                            checked={data.remember}
                            onChange={(e) => setData('remember', e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label 
                            htmlFor="remember" 
                            className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                        >
                            Recordarme
                        </label>
                    </div>

                    {/* Botón Submit */}
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full btn-primary py-3 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {processing ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </button>
                </form>

                {/* Información de acceso */}
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-xs text-center text-gray-600 dark:text-gray-400">
                        <strong>Credenciales por defecto:</strong><br />
                        Email: admin@sysf.com<br />
                        Contraseña: admin123
                    </p>
                </div>
            </div>
        </div>
    );
}

import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import {
    ArrowDownTrayIcon,
    ArrowUpTrayIcon,
    DocumentTextIcon,
    ClipboardDocumentListIcon,
    CurrencyDollarIcon,
    ChartBarIcon,
} from '@heroicons/react/24/outline';

export default function Dashboard({ totalesIngresos, totalesSalidas, totalesResumen, ingresosRecientes, salidasRecientes, topStock }) {
    const menuItems = [
        {
            name: 'Ingresos',
            href: '/ingresos',
            icon: ArrowDownTrayIcon,
            color: 'from-blue-500 to-blue-600',
            description: 'Gestionar ingresos de producción',
        },
        {
            name: 'Salidas',
            href: '/salidas',
            icon: ArrowUpTrayIcon,
            color: 'from-red-500 to-red-600',
            description: 'Gestionar salidas de producción',
        },
        {
            name: 'Resumen',
            href: '/resumen',
            icon: DocumentTextIcon,
            color: 'from-green-500 to-green-600',
            description: 'Ver resúmenes y reportes de stock',
        },
        {
            name: 'Formatos Producción',
            href: '#',
            icon: ClipboardDocumentListIcon,
            color: 'from-purple-500 to-purple-600',
            description: 'Configurar formatos',
        },
        {
            name: 'Costos',
            href: '#',
            icon: CurrencyDollarIcon,
            color: 'from-orange-500 to-orange-600',
            description: 'Gestionar costos',
        },
    ];

    return (
        <AppLayout title="Dashboard">
            <Head title="Dashboard" />

            {/* Tarjetas de Resumen General */}
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                Resumen General del Inventario
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Cajas Ingresos */}
                <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm opacity-80">Total Cajas Ingresadas</div>
                            <div className="text-3xl font-bold mt-2">
                                {totalesIngresos.total_cajas?.toLocaleString() || 0}
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <ArrowDownTrayIcon className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Total Items */}
                <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm opacity-80">Total Items en Stock</div>
                            <div className="text-3xl font-bold mt-2">
                                {Number(totalesResumen?.total_stock || 0).toLocaleString()} LB
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <ChartBarIcon className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Total Salidas */}
                <div className="card bg-gradient-to-br from-red-500 to-red-600 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm opacity-80">Total Registros Salidas</div>
                            <div className="text-3xl font-bold mt-2">
                                {Number(totalesSalidas?.total_items || 0).toLocaleString()}
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <ArrowUpTrayIcon className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Productos en Resumen */}
                <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm opacity-80">Productos en Resumen</div>
                            <div className="text-3xl font-bold mt-2">
                                {Number(totalesResumen?.total_registros || 0).toLocaleString()}
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <DocumentTextIcon className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Accesos Rápidos */}
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                Accesos Rápidos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="card hover:shadow-lg transition-shadow cursor-pointer group"
                        >
                            <div className="flex items-center space-x-4">
                                <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                    <Icon className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {item.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Dos columnas: Ingresos Recientes y Salidas Recientes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Ingresos Recientes */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                            Ingresos Recientes
                        </h2>
                        <Link href="/ingresos" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm font-medium">
                            Ver todos →
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">LOTE</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">ESPECIE</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">CAJAS</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">FECHA</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ingresosRecientes && ingresosRecientes.length > 0 ? (
                                    ingresosRecientes.map((ingreso) => (
                                        <tr key={ingreso.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{ingreso.lote}</td>
                                            <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{ingreso.especie}</td>
                                            <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{ingreso.caja.toLocaleString()}</td>
                                            <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{new Date(ingreso.fechaemp).toLocaleDateString('es-ES')}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="py-8 text-center text-gray-500 dark:text-gray-400">No hay ingresos recientes</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Salidas Recientes */}
                <div className="card">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                            Salidas Recientes
                        </h2>
                        <Link href="/salidas" className="text-red-600 hover:text-red-700 dark:text-red-400 text-sm font-medium">
                            Ver todas →
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">LOTE</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">CLIENTE</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">CAJAS</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">FECHA</th>
                                </tr>
                            </thead>
                            <tbody>
                                {salidasRecientes && salidasRecientes.length > 0 ? (
                                    salidasRecientes.map((salida) => (
                                        <tr key={salida.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                            <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{salida.lote}</td>
                                            <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{salida.cliente || '-'}</td>
                                            <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{salida.caja.toLocaleString()}</td>
                                            <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{new Date(salida.fecha).toLocaleDateString('es-ES')}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="py-8 text-center text-gray-500 dark:text-gray-400">No hay salidas recientes</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Top 5 Productos con Más Stock */}
            <div className="card">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                        Top 5 Productos con Más Stock
                    </h2>
                    <Link href="/resumen" className="text-green-600 hover:text-green-700 dark:text-green-400 text-sm font-medium">
                        Ver resumen completo →
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">CODIGO</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">ESPECIE</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">PRODUCTO</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">INGRESOS</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">SALIDAS</th>
                                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">STOCK</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topStock && topStock.length > 0 ? (
                                topStock.map((item) => (
                                    <tr key={item.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                        <td className="py-3 px-4 text-sm text-gray-900 dark:text-white font-mono">{item.codigo}</td>
                                        <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{item.especie}</td>
                                        <td className="py-3 px-4 text-sm text-gray-900 dark:text-white">{item.producto}</td>
                                        <td className="py-3 px-4 text-sm text-blue-600 dark:text-blue-400">{Number(item.ingresos || 0).toLocaleString()} LB</td>
                                        <td className="py-3 px-4 text-sm text-red-600 dark:text-red-400">{Number(item.salidas || 0).toLocaleString()} LB</td>
                                        <td className="py-3 px-4 text-sm font-bold text-green-600 dark:text-green-400">{Number(item.stock || 0).toLocaleString()} LB</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-8 text-center text-gray-500 dark:text-gray-400">No hay datos de stock disponibles</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}

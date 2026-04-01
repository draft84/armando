import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function IngresosShow({ ingreso }) {
    return (
        <AppLayout title="Detalle del Ingreso">
            <Head title="Detalle del Ingreso" />

            <div className="card max-w-4xl">
                {/* Botón Volver */}
                <div className="mb-6">
                    <Link
                        href={route('ingresos.index')}
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400"
                    >
                        <ArrowLeftIcon className="w-5 h-5 mr-2" />
                        Volver a la lista
                    </Link>
                </div>

                {/* Información del Ingreso */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                        <label className="text-sm text-gray-500 dark:text-gray-400">ITEMS</label>
                        <p className="text-lg font-semibold text-gray-800 dark:text-white">{ingreso.items}</p>
                    </div>

                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                        <label className="text-sm text-gray-500 dark:text-gray-400">FECHAEMP</label>
                        <p className="text-lg font-semibold text-gray-800 dark:text-white">
                            {new Date(ingreso.fechaemp).toLocaleDateString('es-ES')}
                        </p>
                    </div>

                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                        <label className="text-sm text-gray-500 dark:text-gray-400">LOTE</label>
                        <p className="text-lg font-semibold text-gray-800 dark:text-white">{ingreso.lote}</p>
                    </div>

                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                        <label className="text-sm text-gray-500 dark:text-gray-400">CODIGO</label>
                        <p className="text-lg font-semibold text-gray-800 dark:text-white">{ingreso.codigo}</p>
                    </div>

                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                        <label className="text-sm text-gray-500 dark:text-gray-400">CAJA</label>
                        <p className="text-lg font-semibold text-gray-800 dark:text-white">{ingreso.caja.toLocaleString()}</p>
                    </div>

                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                        <label className="text-sm text-gray-500 dark:text-gray-400">CAJA2 (Fórmula: =CAJA)</label>
                        <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">{ingreso.caja2.toLocaleString()}</p>
                    </div>

                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                        <label className="text-sm text-gray-500 dark:text-gray-400">ESPECIE</label>
                        <p className="text-lg font-semibold text-gray-800 dark:text-white">{ingreso.especie}</p>
                    </div>

                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                        <label className="text-sm text-gray-500 dark:text-gray-400">PRODUCTO</label>
                        <p className="text-lg font-semibold text-gray-800 dark:text-white">{ingreso.producto}</p>
                    </div>

                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                        <label className="text-sm text-gray-500 dark:text-gray-400">CALIDAD</label>
                        <p className="text-lg font-semibold">
                            <span className={`px-3 py-1 rounded-full text-sm ${
                                ingreso.calidad === 'A' 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : ingreso.calidad === 'B'
                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            }`}>
                                {ingreso.calidad}
                            </span>
                        </p>
                    </div>

                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                        <label className="text-sm text-gray-500 dark:text-gray-400">FECHA ELAB</label>
                        <p className="text-lg font-semibold text-gray-800 dark:text-white">
                            {new Date(ingreso.fecha_elab).toLocaleDateString('es-ES')}
                        </p>
                    </div>

                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                        <label className="text-sm text-gray-500 dark:text-gray-400">FECHAVENCI</label>
                        <p className="text-lg font-semibold text-gray-800 dark:text-white">
                            {new Date(ingreso.fechavenci).toLocaleDateString('es-ES')}
                        </p>
                    </div>

                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                        <label className="text-sm text-gray-500 dark:text-gray-400">TALLA</label>
                        <p className="text-lg font-semibold text-gray-800 dark:text-white">{ingreso.talla}</p>
                    </div>
                </div>

                {/* Botones de Acción */}
                <div className="flex items-center justify-end space-x-4 mt-8 pt-6">
                    <Link
                        href={route('ingresos.edit', ingreso.id)}
                        className="btn-primary"
                    >
                        Editar
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}

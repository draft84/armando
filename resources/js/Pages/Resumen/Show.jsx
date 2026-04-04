import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function ResumenShow({ resumen }) {
    const stock = (resumen.ingresos || 0) - (resumen.salidas || 0);

    const fields = [
        { label: 'ITEM', value: resumen.item },
        { label: 'CODIGO', value: resumen.codigo },
        { label: 'ESPECIE', value: resumen.especie },
        { label: 'PRODUCTO', value: resumen.producto },
        { label: 'CALIDAD', value: resumen.calidad },
        { label: 'ESTADO', value: resumen.estado },
        { label: 'TALLA', value: resumen.talla },
        { label: 'EMPAQUE', value: resumen.empaque },
        { label: 'INGRESOS (LB)', value: Number(resumen.ingresos || 0).toLocaleString() },
        { label: 'SALIDAS (LB)', value: Number(resumen.salidas || 0).toLocaleString() },
        { label: 'STOCK', value: `${stock.toLocaleString()} LB`, highlight: true },
        { label: 'LB', value: resumen.lb },
        { label: 'OBSERVACION', value: resumen.observacion_organoleptica || '-', full: true },
    ];

    return (
        <AppLayout title="Detalle de Resumen">
            <Head title="Detalle de Resumen" />

            <div className="card max-w-4xl">
                <div className="mb-6">
                    <Link href={route('resumen.index')} className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400">
                        <ArrowLeftIcon className="w-5 h-5 mr-2" />
                        Volver a la lista
                    </Link>
                </div>

                {/* Tarjeta de Stock */}
                <div className={`mb-6 p-6 rounded-xl ${stock >= 0 ? 'bg-gradient-to-br from-green-500 to-green-600 text-white' : 'bg-gradient-to-br from-red-500 to-red-600 text-white'}`}>
                    <div className="text-sm opacity-80">Stock Disponible</div>
                    <div className="text-4xl font-bold mt-2">{stock.toLocaleString()} LB</div>
                    <div className="text-sm opacity-80 mt-2">
                        Ingresos: {(resumen.ingresos || 0).toLocaleString()} LB | Salidas: {(resumen.salidas || 0).toLocaleString()} LB
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {fields.map((field, idx) => (
                        field.full ? (
                            <div key={idx} className="border-b border-gray-200 dark:border-gray-700 pb-4 md:col-span-2">
                                <label className="text-sm text-gray-500 dark:text-gray-400">{field.label}</label>
                                <p className={`text-lg font-semibold ${field.highlight ? 'text-green-600 dark:text-green-400' : 'text-gray-800 dark:text-white'}`}>
                                    {field.value}
                                </p>
                            </div>
                        ) : (
                            <div key={idx} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                                <label className="text-sm text-gray-500 dark:text-gray-400">{field.label}</label>
                                <p className={`text-lg font-semibold ${field.highlight ? 'text-green-600 dark:text-green-400' : 'text-gray-800 dark:text-white'}`}>
                                    {field.value}
                                </p>
                            </div>
                        )
                    ))}
                </div>

                <div className="flex items-center justify-end space-x-4 mt-8 pt-6">
                    <Link href={route('resumen.edit', resumen.id)} className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-lg shadow-green-500/30">
                        Editar
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}

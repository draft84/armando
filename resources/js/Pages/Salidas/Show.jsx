import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function SalidasShow({ salida }) {
    const fields = [
        { label: 'ITEMS', value: salida.items },
        { label: 'FECHA', value: new Date(salida.fecha).toLocaleDateString('es-ES') },
        { label: 'LOTE', value: salida.lote },
        { label: 'CODIGO', value: salida.codigo },
        { label: 'CAJA', value: salida.caja?.toLocaleString() },
        { label: 'CAJA2 (auto)', value: salida.caja2?.toLocaleString(), highlight: true },
        { label: 'ESPECIE', value: salida.especie },
        { label: 'PRODUCTO', value: salida.producto },
        { label: 'CALIDAD', value: salida.calidad, badge: true },
        { label: 'FECHA ELAB', value: new Date(salida.fecha_elab).toLocaleDateString('es-ES') },
        { label: 'FECHAVENCI', value: new Date(salida.fechavenci).toLocaleDateString('es-ES') },
        { label: 'TALLA', value: salida.talla },
        { label: 'UDS', value: salida.uds || '-' },
        { label: 'LIBRAS', value: salida.libras ? Number(salida.libras).toFixed(2) : '-' },
        { label: 'PROMEDIO (auto)', value: salida.promedio ? Number(salida.promedio).toFixed(2) : '-', highlight: true },
        { label: 'QUEES', value: salida.quees || '-' },
        { label: 'EMPAQUE', value: salida.empaque || '-' },
        { label: 'CUARTO', value: salida.cuarto || '-' },
        { label: 'POSICION', value: salida.posicion || '-' },
        { label: 'TARIMA', value: salida.tarima || '-' },
        { label: 'CLIENTE', value: salida.cliente || '-' },
        { label: 'N° DOC', value: salida.ndoc || '-' },
    ];

    const getQualityColor = (calidad) => {
        switch(calidad) {
            case 'A': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'B': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'C': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    return (
        <AppLayout title="Detalle de Salida">
            <Head title="Detalle de Salida" />

            <div className="card max-w-4xl">
                <div className="mb-6">
                    <Link href={route('salidas.index')} className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400">
                        <ArrowLeftIcon className="w-5 h-5 mr-2" />
                        Volver a la lista
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {fields.map((field, idx) => (
                        <div key={idx} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                            <label className="text-sm text-gray-500 dark:text-gray-400">{field.label}</label>
                            {field.badge ? (
                                <p className="text-lg font-semibold">
                                    <span className={`px-3 py-1 rounded-full text-sm ${getQualityColor(field.value)}`}>
                                        {field.value}
                                    </span>
                                </p>
                            ) : (
                                <p className={`text-lg font-semibold ${field.highlight ? 'text-red-600 dark:text-red-400' : 'text-gray-800 dark:text-white'}`}>
                                    {field.value}
                                </p>
                            )}
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-end space-x-4 mt-8 pt-6">
                    <Link href={route('salidas.edit', salida.id)} className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-lg shadow-red-500/30">
                        Editar
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}

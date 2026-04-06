import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function CajaShow({ caja }) {
    return (
        <AppLayout title={`Caja N° ${caja.caja_numero}`}>
            <Head title={`Caja N° ${caja.caja_numero}`} />

            <div className="card max-w-4xl">
                <div className="mb-6">
                    <Link href={route('inventario-cajas.index')} className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400">
                        <ArrowLeftIcon className="w-5 h-5 mr-2" />
                        Volver al inventario
                    </Link>
                </div>

                <div className={`p-6 mb-6 rounded-xl ${
                    caja.estado === 'EN_STOCK' ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'
                }`}>
                    <div className="text-sm opacity-80">Caja N°</div>
                    <div className="text-4xl font-bold">{caja.caja_numero}</div>
                    <div className="text-sm mt-2">{caja.estado}</div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Detail label="Código" value={caja.codigo_producto} />
                    <Detail label="Lote" value={caja.lote} />
                    <Detail label="Especie" value={caja.especie} />
                    <Detail label="Producto" value={caja.producto} />
                    <Detail label="Calidad" value={caja.calidad} />
                    <Detail label="Talla" value={caja.talla || '-'} />
                    <Detail label="Libras" value={caja.libras ? `${Number(caja.libras).toFixed(2)}` : '-'} />
                    <Detail label="UDS" value={caja.uds || '-'} />
                    <Detail label="Promedio" value={caja.promedio ? Number(caja.promedio).toFixed(2) : '-'} />
                    <Detail label="Empaque" value={caja.empaque || '-'} />
                    <Detail label="Fecha Elab." value={new Date(caja.fecha_elab).toLocaleDateString('es-ES')} />
                    <Detail label="Vencimiento" value={new Date(caja.fechavenci).toLocaleDateString('es-ES')} />
                    <Detail label="Cuarto" value={caja.cuarto || '-'} />
                    <Detail label="Posición" value={caja.posicion || '-'} />
                    <Detail label="Tarima" value={caja.tarima || '-'} />
                    {caja.cliente && <Detail label="Cliente" value={caja.cliente} />}
                    {caja.ndoc && <Detail label="N° Doc" value={caja.ndoc} />}
                </div>
            </div>
        </AppLayout>
    );
}

function Detail({ label, value }) {
    return (
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <label className="text-sm text-gray-500 dark:text-gray-400">{label}</label>
            <p className="text-lg font-semibold text-gray-800 dark:text-white">{value}</p>
        </div>
    );
}

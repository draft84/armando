import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { ArrowLeftIcon, MagnifyingGlassIcon, CubeIcon, ClockIcon, TruckIcon } from '@heroicons/react/24/outline';

export default function BuscarCaja({ caja, cajaNumero }) {
    const [search, setSearch] = useState(cajaNumero || '');

    const handleSearch = () => {
        if (search.trim()) {
            router.get('/buscar-caja', { caja_numero: search.trim() }, { preserveState: true });
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSearch();
    };

    return (
        <AppLayout title="Buscar Caja">
            <Head title="Buscar Caja" />

            <div className="card max-w-4xl">
                <div className="mb-6">
                    <Link href={route('inventario-cajas.index')} className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400">
                        <ArrowLeftIcon className="w-5 h-5 mr-2" />
                        Volver al inventario
                    </Link>
                </div>

                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">🔍 Buscar Caja por Número</h2>

                {/* Buscador */}
                <div className="flex gap-4 mb-8">
                    <div className="relative flex-1">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Ingrese el número de caja..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="input-field pl-10 text-lg"
                        />
                    </div>
                    <button onClick={handleSearch} className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium">
                        Buscar
                    </button>
                </div>

                {/* Resultado */}
                {caja ? (
                    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                        {/* Header con estado */}
                        <div className={`p-6 ${
                            caja.estado === 'EN_STOCK' 
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                                : caja.estado === 'VENDIDA'
                                ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white'
                                : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                        }`}>
                            <div className="flex items-center justify-between">
                                <div>
                                    <div className="text-sm opacity-80">Caja N°</div>
                                    <div className="text-4xl font-bold">{caja.caja_numero}</div>
                                </div>
                                <div className="text-right">
                                    <span className="px-4 py-2 bg-white bg-opacity-20 rounded-full text-sm font-semibold">
                                        {caja.estado === 'EN_STOCK' ? '✅ EN STOCK' : caja.estado === 'VENDIDA' ? `📤 VENDIDA${caja.cliente ? ` a ${caja.cliente}` : ''}` : caja.estado}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Detalles */}
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <DetailField label="Código" value={caja.codigo_producto} />
                            <DetailField label="Especie" value={caja.especie} />
                            <DetailField label="Producto" value={caja.producto} />
                            <DetailField label="Calidad" value={caja.calidad} />
                            <DetailField label="Talla" value={caja.talla || '-'} />
                            <DetailField label="Libras" value={caja.libras ? `${Number(caja.libras).toFixed(2)} LB` : '-'} />
                            <DetailField label="Lote" value={caja.lote} />
                            <DetailField label="Fecha Elaboración" value={new Date(caja.fecha_elab).toLocaleDateString('es-ES')} />
                            <DetailField label="Fecha Vencimiento" value={new Date(caja.fechavenci).toLocaleDateString('es-ES')} />
                            <DetailField label="Cuarto" value={caja.cuarto || '-'} />
                            <DetailField label="Posición" value={caja.posicion || '-'} />
                            <DetailField label="Tarima" value={caja.tarima || '-'} />
                        </div>

                        {/* Timeline */}
                        <div className="px-6 pb-6">
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Historial de la Caja</h3>
                            <div className="space-y-4">
                                {/* Entrada */}
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                                        <CubeIcon className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-800 dark:text-white">Ingresó al inventario</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {caja.ingreso ? `Lote ${caja.ingreso.lote} — ${new Date(caja.ingreso.fechaemp).toLocaleDateString('es-ES')}` : `Elaborado ${new Date(caja.fecha_elab).toLocaleDateString('es-ES')}`}
                                        </p>
                                    </div>
                                </div>

                                {caja.salida ? (
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center flex-shrink-0">
                                            <TruckIcon className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800 dark:text-white">Salió del inventario</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {caja.cliente ? `Cliente: ${caja.cliente}` : 'Sin cliente'}
                                                {caja.ndoc ? ` — Doc: ${caja.ndoc}` : ''}
                                                <br />
                                                {new Date(caja.salida.fecha).toLocaleDateString('es-ES')}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                                            <ClockIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800 dark:text-white">Aún en stock</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Esta caja sigue disponible en el inventario</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : cajaNumero ? (
                    <div className="text-center py-12">
                        <MagnifyingGlassIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">No se encontró la caja N° <strong>{cajaNumero}</strong></p>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <MagnifyingGlassIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                        <p className="text-gray-500 dark:text-gray-400">Ingrese un número de caja para ver su historial completo</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

function DetailField({ label, value }) {
    return (
        <div className="border-b border-gray-100 dark:border-gray-700 pb-3">
            <label className="text-xs text-gray-500 dark:text-gray-400 uppercase">{label}</label>
            <p className="text-base font-medium text-gray-800 dark:text-white">{value}</p>
        </div>
    );
}

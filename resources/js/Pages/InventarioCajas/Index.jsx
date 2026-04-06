import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { MagnifyingGlassIcon, CubeIcon } from '@heroicons/react/24/outline';

export default function InventarioCajasIndex({ cajas, totales, filters, especies, lotes, cuartos }) {
    const [search, setSearch] = useState(filters.search || '');
    const [perPage, setPerPage] = useState(filters.perPage || 10);
    const [filterEspecie, setFilterEspecie] = useState(filters.filterEspecie || '');
    const [filterLote, setFilterLote] = useState(filters.filterLote || '');
    const [filterCuarto, setFilterCuarto] = useState(filters.filterCuarto || '');

    const handleSearch = (value) => {
        setSearch(value);
        const timeoutId = setTimeout(() => {
            applyFilters();
        }, 300);
        return () => clearTimeout(timeoutId);
    };

    const applyFilters = () => {
        router.get('/inventario-cajas', {
            search,
            perPage,
            filterEspecie,
            filterLote,
            filterCuarto,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm";

    return (
        <AppLayout title="Inventario de Cajas">
            <Head title="Inventario de Cajas" />

            {/* Tarjetas de Resumen */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="card bg-gradient-to-br from-teal-500 to-teal-600 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm opacity-80">Cajas en Stock</div>
                            <div className="text-3xl font-bold mt-2">{totales.total_cajas?.toLocaleString() || 0}</div>
                        </div>
                        <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                            <CubeIcon className="w-6 h-6" />
                        </div>
                    </div>
                </div>
                <div className="card bg-gradient-to-br from-cyan-500 to-cyan-600 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm opacity-80">Libras en Stock</div>
                            <div className="text-3xl font-bold mt-2">{Number(totales.total_libras || 0).toLocaleString()}</div>
                        </div>
                    </div>
                </div>
                <div className="card bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-sm opacity-80">Unidades en Stock</div>
                            <div className="text-3xl font-bold mt-2">{totales.total_uds?.toLocaleString() || 0}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filtros */}
            <div className="card mb-6">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar por caja, código, lote, especie..."
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                className="input-field pl-10"
                            />
                        </div>
                        <select value={filterEspecie} onChange={(e) => { setFilterEspecie(e.target.value); setTimeout(applyFilters, 0); }} className={inputClass}>
                            <option value="">Todas las especies</option>
                            {especies.map(e => <option key={e} value={e}>{e}</option>)}
                        </select>
                        <select value={filterLote} onChange={(e) => { setFilterLote(e.target.value); setTimeout(applyFilters, 0); }} className={inputClass}>
                            <option value="">Todos los lotes</option>
                            {lotes.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                        <select value={filterCuarto} onChange={(e) => { setFilterCuarto(e.target.value); setTimeout(applyFilters, 0); }} className={inputClass}>
                            <option value="">Todos los cuartos</option>
                            {cuartos.map(c => <option key={c} value={c}>Cuarto {c}</option>)}
                        </select>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Mostrar:</span>
                            <select value={perPage} onChange={(e) => { setPerPage(Number(e.target.value)); setTimeout(applyFilters, 0); }} className="input-field w-auto">
                                {[10, 25, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                        </div>
                        <Link href="/buscar-caja" className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium">
                            🔍 Buscar por N° Caja
                        </Link>
                    </div>
                </div>
            </div>

            {/* Tabla */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">CAJA</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">CÓDIGO</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">ESPECIE</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">PRODUCTO</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">CALIDAD</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">TALLA</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">LIBRAS</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">LOTE</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">VENCIMIENTO</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">CUARTO</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">TARIMA</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {cajas.data && cajas.data.length > 0 ? (
                                cajas.data.map((caja) => (
                                    <tr key={caja.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-xs">
                                        <td className="px-4 py-3 whitespace-nowrap font-bold text-teal-600 dark:text-teal-400">
                                            <Link href={route('inventario-cajas.show', caja.id)} className="hover:underline">
                                                {caja.caja_numero}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap font-mono text-gray-900 dark:text-white">{caja.codigo_producto}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-gray-900 dark:text-white">{caja.especie}</td>
                                        <td className="px-4 py-3 text-gray-900 dark:text-white max-w-[200px] truncate">{caja.producto}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                caja.calidad === 'A' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                                caja.calidad === 'B' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                                caja.calidad === 'C' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                                'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                            }`}>{caja.calidad}</span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-gray-900 dark:text-white">{caja.talla || '-'}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-gray-900 dark:text-white font-medium">{caja.libras ? Number(caja.libras).toFixed(2) : '-'}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-gray-900 dark:text-white">{caja.lote}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-gray-900 dark:text-white">{caja.fechavenci ? new Date(caja.fechavenci).toLocaleDateString('es-ES') : '-'}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-gray-900 dark:text-white">{caja.cuarto || '-'}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-gray-900 dark:text-white">{caja.tarima || '-'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="11" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                        No hay cajas en stock
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                {cajas.links && cajas.links.length > 3 && (
                    <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Mostrando {cajas.from} a {cajas.to} de {cajas.total} cajas
                            </div>
                            <div className="flex space-x-2">
                                {cajas.links.map((link, i) => (
                                    link.url ? (
                                        <Link key={i} href={link.url}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                link.active ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }} />
                                    ) : (
                                        <span key={i} className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600"
                                            dangerouslySetInnerHTML={{ __html: link.label }} />
                                    )
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

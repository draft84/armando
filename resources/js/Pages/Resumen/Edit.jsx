import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function ResumenEdit({ resumen }) {
    const { data, setData, put, processing, errors } = useForm({
        item: resumen.item || '',
        codigo: resumen.codigo || '',
        especie: resumen.especie || '',
        producto: resumen.producto || '',
        calidad: resumen.calidad || '',
        estado: resumen.estado || 'IQF',
        talla: resumen.talla || '',
        empaque: resumen.empaque || '',
        ingresos: resumen.ingresos || 0,
        salidas: resumen.salidas || 0,
        lb: resumen.lb || 'LB',
        observacion_organoleptica: resumen.observacion_organoleptica || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('resumen.update', resumen.id));
    };

    const inputClass = "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-200";
    const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2";

    const stock = (parseInt(data.ingresos) || 0) - (parseInt(data.salidas) || 0);

    return (
        <AppLayout title="Editar Resumen">
            <Head title="Editar Resumen" />

            <div className="card max-w-7xl">
                <div className="mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Editar Registro de Resumen</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Modifique los campos necesarios</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Sección 1 */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Identificación del Producto</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <label className={labelClass}>ITEM</label>
                                <input type="number" value={data.item} onChange={(e) => setData('item', e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>CODIGO *</label>
                                <input type="text" value={data.codigo} onChange={(e) => setData('codigo', e.target.value)} className={inputClass} required />
                                {errors.codigo && <p className="mt-1 text-xs text-red-500">{errors.codigo}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>ESPECIE *</label>
                                <input type="text" value={data.especie} onChange={(e) => setData('especie', e.target.value)} className={inputClass} required />
                                {errors.especie && <p className="mt-1 text-xs text-red-500">{errors.especie}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>PRODUCTO *</label>
                                <input type="text" value={data.producto} onChange={(e) => setData('producto', e.target.value)} className={inputClass} required />
                                {errors.producto && <p className="mt-1 text-xs text-red-500">{errors.producto}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Sección 2 */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Características</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <label className={labelClass}>CALIDAD *</label>
                                <input type="text" value={data.calidad} onChange={(e) => setData('calidad', e.target.value)} className={inputClass} required />
                                {errors.calidad && <p className="mt-1 text-xs text-red-500">{errors.calidad}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>ESTADO</label>
                                <select value={data.estado} onChange={(e) => setData('estado', e.target.value)} className={inputClass}>
                                    <option value="IQF">IQF</option>
                                    <option value="IVP">IVP</option>
                                    <option value="BLOQUE">BLOQUE</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>TALLA *</label>
                                <input type="text" value={data.talla} onChange={(e) => setData('talla', e.target.value)} className={inputClass} required />
                                {errors.talla && <p className="mt-1 text-xs text-red-500">{errors.talla}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>EMPAQUE *</label>
                                <input type="text" value={data.empaque} onChange={(e) => setData('empaque', e.target.value)} className={inputClass} required />
                                {errors.empaque && <p className="mt-1 text-xs text-red-500">{errors.empaque}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Sección 3 */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Stock</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <label className={labelClass}>INGRESOS (LB)</label>
                                <input type="number" value={data.ingresos} onChange={(e) => setData('ingresos', e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>SALIDAS (LB)</label>
                                <input type="number" value={data.salidas} onChange={(e) => setData('salidas', e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>STOCK (auto)</label>
                                <input type="text" value={stock} className={`${inputClass} bg-gray-50 dark:bg-gray-600 cursor-not-allowed font-bold`} readOnly />
                                <p className="mt-1 text-xs text-gray-500">= INGRESOS - SALIDAS</p>
                            </div>
                            <div>
                                <label className={labelClass}>LB</label>
                                <input type="text" value={data.lb} onChange={(e) => setData('lb', e.target.value)} className={inputClass} />
                            </div>
                        </div>
                    </div>

                    {/* Sección 4 */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Observaciones</h3>
                        <textarea
                            value={data.observacion_organoleptica}
                            onChange={(e) => setData('observacion_organoleptica', e.target.value)}
                            className={`${inputClass} min-h-[100px]`}
                            placeholder="Color, olor, textura..."
                        />
                    </div>

                    {/* Botones */}
                    <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <Link href={route('resumen.index')} className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors font-medium">Cancelar</Link>
                        <button type="submit" disabled={processing} className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-lg shadow-green-500/30">
                            {processing ? 'Actualizando...' : 'Actualizar Resumen'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function ResumenCreate() {
    const { data, setData, post, processing, errors } = useForm({
        item: '',
        codigo: '',
        especie: '',
        producto: '',
        calidad: '',
        estado: 'IQF',
        talla: '',
        empaque: '',
        ingresos: '0',
        salidas: '0',
        lb: 'LB',
        observacion_organoleptica: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('resumen.store'));
    };

    const inputClass = "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-200";
    const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2";

    // Calcular stock en tiempo real
    const stock = (parseInt(data.ingresos) || 0) - (parseInt(data.salidas) || 0);

    return (
        <AppLayout title="Nuevo Registro de Resumen">
            <Head title="Nuevo Resumen" />

            <div className="card max-w-7xl">
                <div className="mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Registrar Nuevo Resumen
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Complete la información del producto para el resumen de stock
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Sección 1: Identificación del Producto */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                            <span className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3">
                                <span className="text-green-600 dark:text-green-400 font-bold">1</span>
                            </span>
                            Identificación del Producto
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <label className={labelClass}>ITEM</label>
                                <input type="number" value={data.item} onChange={(e) => setData('item', e.target.value)} className={inputClass} />
                                {errors.item && <p className="mt-1 text-xs text-red-500">{errors.item}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>CODIGO *</label>
                                <input type="text" value={data.codigo} onChange={(e) => setData('codigo', e.target.value)} className={inputClass} placeholder="010102011303" required />
                                {errors.codigo && <p className="mt-1 text-xs text-red-500">{errors.codigo}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>ESPECIE *</label>
                                <input type="text" value={data.especie} onChange={(e) => setData('especie', e.target.value)} className={inputClass} placeholder="ATUN" required />
                                {errors.especie && <p className="mt-1 text-xs text-red-500">{errors.especie}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>PRODUCTO *</label>
                                <input type="text" value={data.producto} onChange={(e) => setData('producto', e.target.value)} className={inputClass} placeholder="ENTERO SIN VISCERAS" required />
                                {errors.producto && <p className="mt-1 text-xs text-red-500">{errors.producto}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Sección 2: Características */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                            <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                                <span className="text-blue-600 dark:text-blue-400 font-bold">2</span>
                            </span>
                            Características
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <label className={labelClass}>CALIDAD *</label>
                                <input type="text" value={data.calidad} onChange={(e) => setData('calidad', e.target.value)} className={inputClass} placeholder="A" required />
                                {errors.calidad && <p className="mt-1 text-xs text-red-500">{errors.calidad}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>ESTADO</label>
                                <select value={data.estado} onChange={(e) => setData('estado', e.target.value)} className={inputClass}>
                                    <option value="IQF">IQF</option>
                                    <option value="IVP">IVP</option>
                                    <option value="BLOQUE">BLOQUE</option>
                                </select>
                                {errors.estado && <p className="mt-1 text-xs text-red-500">{errors.estado}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>TALLA *</label>
                                <input type="text" value={data.talla} onChange={(e) => setData('talla', e.target.value)} className={inputClass} placeholder="58" required />
                                {errors.talla && <p className="mt-1 text-xs text-red-500">{errors.talla}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>EMPAQUE *</label>
                                <input type="text" value={data.empaque} onChange={(e) => setData('empaque', e.target.value)} className={inputClass} placeholder="CAJA LBS LIBRE" required />
                                {errors.empaque && <p className="mt-1 text-xs text-red-500">{errors.empaque}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Sección 3: Stock */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                            <span className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-3">
                                <span className="text-purple-600 dark:text-purple-400 font-bold">3</span>
                            </span>
                            Stock (INGRESOS - SALIDAS)
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <label className={labelClass}>INGRESOS (LB)</label>
                                <input type="number" value={data.ingresos} onChange={(e) => setData('ingresos', e.target.value)} className={inputClass} />
                                {errors.ingresos && <p className="mt-1 text-xs text-red-500">{errors.ingresos}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>SALIDAS (LB)</label>
                                <input type="number" value={data.salidas} onChange={(e) => setData('salidas', e.target.value)} className={inputClass} />
                                {errors.salidas && <p className="mt-1 text-xs text-red-500">{errors.salidas}</p>}
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

                    {/* Sección 4: Observaciones */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                            <span className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mr-3">
                                <span className="text-orange-600 dark:text-orange-400 font-bold">4</span>
                            </span>
                            Observaciones Organolépticas
                        </h3>
                        <div>
                            <label className={labelClass}>Observación</label>
                            <textarea
                                value={data.observacion_organoleptica}
                                onChange={(e) => setData('observacion_organoleptica', e.target.value)}
                                className={`${inputClass} min-h-[100px]`}
                                placeholder="Color, olor, textura..."
                            />
                            {errors.observacion_organoleptica && <p className="mt-1 text-xs text-red-500">{errors.observacion_organoleptica}</p>}
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <Link href={route('resumen.index')} className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors font-medium">
                            Cancelar
                        </Link>
                        <button type="submit" disabled={processing} className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-lg shadow-green-500/30">
                            {processing ? 'Guardando...' : 'Guardar Resumen'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

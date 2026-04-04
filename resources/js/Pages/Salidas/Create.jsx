import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function SalidasCreate() {
    const { data, setData, post, processing, errors } = useForm({
        items: '',
        fecha: '',
        lote: '',
        codigo: '',
        caja: '',
        especie: '',
        producto: '',
        calidad: 'A',
        fecha_elab: '',
        fechavenci: '',
        talla: '',
        uds: '',
        libras: '',
        quees: 'INVFISICO',
        empaque: 'CAJA LBS LIBRE',
        cuarto: '',
        posicion: '',
        tarima: '',
        cliente: '',
        ndoc: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('salidas.store'));
    };

    const inputClass = "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-200";
    const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2";
    const sectionClass = "mb-8";
    const gridClass = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6";

    return (
        <AppLayout title="Nueva Salida">
            <Head title="Nueva Salida" />

            <div className="card max-w-7xl">
                {/* Header */}
                <div className="mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Registrar Nueva Salida
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Complete todos los campos para crear un nuevo registro de salida
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Sección 1: Información Básica */}
                    <div className={sectionClass}>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                            <span className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mr-3">
                                <span className="text-red-600 dark:text-red-400 font-bold">1</span>
                            </span>
                            Información Básica
                        </h3>
                        <div className={gridClass}>
                            <div>
                                <label className={labelClass}>ITEMS *</label>
                                <input type="number" value={data.items} onChange={(e) => setData('items', e.target.value)} className={inputClass} required />
                                {errors.items && <p className="mt-1 text-xs text-red-500">{errors.items}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>FECHA *</label>
                                <input type="datetime-local" value={data.fecha} onChange={(e) => setData('fecha', e.target.value)} className={inputClass} required />
                                {errors.fecha && <p className="mt-1 text-xs text-red-500">{errors.fecha}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>LOTE *</label>
                                <input type="text" value={data.lote} onChange={(e) => setData('lote', e.target.value)} className={inputClass} placeholder="61/25" required />
                                {errors.lote && <p className="mt-1 text-xs text-red-500">{errors.lote}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>CODIGO *</label>
                                <input type="text" value={data.codigo} onChange={(e) => setData('codigo', e.target.value)} className={inputClass} placeholder="081402070201" required />
                                {errors.codigo && <p className="mt-1 text-xs text-red-500">{errors.codigo}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Sección 2: Producto */}
                    <div className={sectionClass}>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                            <span className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mr-3">
                                <span className="text-orange-600 dark:text-orange-400 font-bold">2</span>
                            </span>
                            Producto
                        </h3>
                        <div className={gridClass}>
                            <div>
                                <label className={labelClass}>ESPECIE *</label>
                                <select value={data.especie} onChange={(e) => setData('especie', e.target.value)} className={inputClass} required>
                                    <option value="">Seleccionar</option>
                                    <option value="ATUN">ATUN</option>
                                    <option value="SARDINA">SARDINA</option>
                                    <option value="JUREL">JUREL</option>
                                    <option value="CABALLA">CABALLA</option>
                                    <option value="MAHI MAHI">MAHI MAHI</option>
                                    <option value="PEZ ESPADA">PEZ ESPADA</option>
                                    <option value="MERO">MERO</option>
                                    <option value="PARGO">PARGO</option>
                                </select>
                                {errors.especie && <p className="mt-1 text-xs text-red-500">{errors.especie}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>PRODUCTO *</label>
                                <input type="text" value={data.producto} onChange={(e) => setData('producto', e.target.value)} className={inputClass} placeholder="FILETE CON PIEL, SIN ESPINAS CO" required />
                                {errors.producto && <p className="mt-1 text-xs text-red-500">{errors.producto}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>CALIDAD *</label>
                                <select value={data.calidad} onChange={(e) => setData('calidad', e.target.value)} className={inputClass} required>
                                    <option value="A">A - Excelente</option>
                                    <option value="B">B - Bueno</option>
                                    <option value="C">C - Regular</option>
                                    <option value="IND">IND</option>
                                </select>
                                {errors.calidad && <p className="mt-1 text-xs text-red-500">{errors.calidad}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>TALLA *</label>
                                <select value={data.talla} onChange={(e) => setData('talla', e.target.value)} className={inputClass} required>
                                    <option value="">Seleccionar</option>
                                    <option value="58">58</option>
                                    <option value="60">60</option>
                                    <option value="65">65</option>
                                    <option value="70">70</option>
                                    <option value="80">80</option>
                                    <option value="13">13</option>
                                    <option value="15">15</option>
                                </select>
                                {errors.talla && <p className="mt-1 text-xs text-red-500">{errors.talla}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Sección 3: Cantidades */}
                    <div className={sectionClass}>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                            <span className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-3">
                                <span className="text-purple-600 dark:text-purple-400 font-bold">3</span>
                            </span>
                            Cantidades y Pesos
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <label className={labelClass}>CAJA *</label>
                                <input type="number" value={data.caja} onChange={(e) => setData('caja', e.target.value)} className={inputClass} required />
                                {errors.caja && <p className="mt-1 text-xs text-red-500">{errors.caja}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>UDS</label>
                                <input type="number" value={data.uds} onChange={(e) => setData('uds', e.target.value)} className={inputClass} />
                                {errors.uds && <p className="mt-1 text-xs text-red-500">{errors.uds}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>LIBRAS</label>
                                <input type="number" step="0.01" value={data.libras} onChange={(e) => setData('libras', e.target.value)} className={inputClass} />
                                {errors.libras && <p className="mt-1 text-xs text-red-500">{errors.libras}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>PROMEDIO</label>
                                <input type="text" value={data.uds && data.libras && data.uds > 0 ? (parseFloat(data.libras) / parseFloat(data.uds)).toFixed(2) : '-'} className={`${inputClass} bg-gray-50 dark:bg-gray-600 cursor-not-allowed`} readOnly />
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">= LIBRAS / UDS (auto)</p>
                            </div>
                        </div>
                    </div>

                    {/* Sección 4: Fechas */}
                    <div className={sectionClass}>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                            <span className="w-8 h-8 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center mr-3">
                                <span className="text-teal-600 dark:text-teal-400 font-bold">4</span>
                            </span>
                            Fechas
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelClass}>FECHA ELAB *</label>
                                <input type="datetime-local" value={data.fecha_elab} onChange={(e) => setData('fecha_elab', e.target.value)} className={inputClass} required />
                                {errors.fecha_elab && <p className="mt-1 text-xs text-red-500">{errors.fecha_elab}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>FECHAVENCI *</label>
                                <input type="datetime-local" value={data.fechavenci} onChange={(e) => setData('fechavenci', e.target.value)} className={inputClass} required />
                                {errors.fechavenci && <p className="mt-1 text-xs text-red-500">{errors.fechavenci}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Sección 5: Almacenamiento */}
                    <div className={sectionClass}>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                            <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                                <span className="text-blue-600 dark:text-blue-400 font-bold">5</span>
                            </span>
                            Almacenamiento
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                            <div>
                                <label className={labelClass}>QUEES</label>
                                <select value={data.quees} onChange={(e) => setData('quees', e.target.value)} className={inputClass}>
                                    <option value="INVFISICO">INVFISICO</option>
                                    <option value="INVQUIMICO">INVQUIMICO</option>
                                    <option value="MUESTRA">MUESTRA</option>
                                    <option value="VENTA">VENTA</option>
                                    <option value="CORTE 1 X 2">CORTE 1 X 2</option>
                                    <option value="PORCIONADO">PORCIONADO</option>
                                </select>
                                {errors.quees && <p className="mt-1 text-xs text-red-500">{errors.quees}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>EMPAQUE</label>
                                <select value={data.empaque} onChange={(e) => setData('empaque', e.target.value)} className={inputClass}>
                                    <option value="CAJA LBS LIBRE">CAJA LBS LIBRE</option>
                                    <option value="BOLSA VACIO">BOLSA VACIO</option>
                                    <option value="TARRINA">TARRINA</option>
                                </select>
                                {errors.empaque && <p className="mt-1 text-xs text-red-500">{errors.empaque}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>CUARTO</label>
                                <input type="number" value={data.cuarto} onChange={(e) => setData('cuarto', e.target.value)} className={inputClass} />
                                {errors.cuarto && <p className="mt-1 text-xs text-red-500">{errors.cuarto}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>POSICION</label>
                                <input type="text" value={data.posicion} onChange={(e) => setData('posicion', e.target.value)} className={inputClass} placeholder="Opcional" />
                                {errors.posicion && <p className="mt-1 text-xs text-red-500">{errors.posicion}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>TARIMA</label>
                                <input type="number" value={data.tarima} onChange={(e) => setData('tarima', e.target.value)} className={inputClass} />
                                {errors.tarima && <p className="mt-1 text-xs text-red-500">{errors.tarima}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Sección 6: Cliente y Documento */}
                    <div className={sectionClass}>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                            <span className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3">
                                <span className="text-green-600 dark:text-green-400 font-bold">6</span>
                            </span>
                            Cliente y Documento
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelClass}>CLIENTE</label>
                                <input type="text" value={data.cliente} onChange={(e) => setData('cliente', e.target.value)} className={inputClass} placeholder="TROPIMAR" />
                                {errors.cliente && <p className="mt-1 text-xs text-red-500">{errors.cliente}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>N° DOC</label>
                                <input type="text" value={data.ndoc} onChange={(e) => setData('ndoc', e.target.value)} className={inputClass} placeholder="327" />
                                {errors.ndoc && <p className="mt-1 text-xs text-red-500">{errors.ndoc}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <Link href={route('salidas.index')} className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 font-medium">
                            Cancelar
                        </Link>
                        <button type="submit" disabled={processing} className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium shadow-lg shadow-red-500/30">
                            {processing ? 'Guardando...' : 'Guardar Salida'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

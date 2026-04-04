import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function SalidasEdit({ salida }) {
    const { data, setData, put, processing, errors } = useForm({
        items: salida.items || '',
        fecha: salida.fecha ? new Date(salida.fecha).toISOString().slice(0, 16) : '',
        lote: salida.lote || '',
        codigo: salida.codigo || '',
        caja: salida.caja || '',
        especie: salida.especie || '',
        producto: salida.producto || '',
        calidad: salida.calidad || 'A',
        fecha_elab: salida.fecha_elab ? new Date(salida.fecha_elab).toISOString().slice(0, 16) : '',
        fechavenci: salida.fechavenci ? new Date(salida.fechavenci).toISOString().slice(0, 16) : '',
        talla: salida.talla || '',
        uds: salida.uds || '',
        libras: salida.libras || '',
        quees: salida.quees || 'INVFISICO',
        empaque: salida.empaque || 'CAJA LBS LIBRE',
        cuarto: salida.cuarto || '',
        posicion: salida.posicion || '',
        tarima: salida.tarima || '',
        cliente: salida.cliente || '',
        ndoc: salida.ndoc || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('salidas.update', salida.id));
    };

    const inputClass = "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-200";
    const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2";

    return (
        <AppLayout title="Editar Salida">
            <Head title="Editar Salida" />

            <div className="card max-w-7xl">
                <div className="mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Editar Salida</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Modifique los campos necesarios</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Sección 1 */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Información Básica</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                                <input type="text" value={data.lote} onChange={(e) => setData('lote', e.target.value)} className={inputClass} required />
                                {errors.lote && <p className="mt-1 text-xs text-red-500">{errors.lote}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>CODIGO *</label>
                                <input type="text" value={data.codigo} onChange={(e) => setData('codigo', e.target.value)} className={inputClass} required />
                                {errors.codigo && <p className="mt-1 text-xs text-red-500">{errors.codigo}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Sección 2 */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Producto</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                                <input type="text" value={data.producto} onChange={(e) => setData('producto', e.target.value)} className={inputClass} required />
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

                    {/* Sección 3 */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Cantidades y Pesos</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <label className={labelClass}>CAJA *</label>
                                <input type="number" value={data.caja} onChange={(e) => setData('caja', e.target.value)} className={inputClass} required />
                                {errors.caja && <p className="mt-1 text-xs text-red-500">{errors.caja}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>UDS</label>
                                <input type="number" value={data.uds} onChange={(e) => setData('uds', e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>LIBRAS</label>
                                <input type="number" step="0.01" value={data.libras} onChange={(e) => setData('libras', e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>PROMEDIO</label>
                                <input type="text" value={data.uds && data.libras && data.uds > 0 ? (parseFloat(data.libras) / parseFloat(data.uds)).toFixed(2) : '-'} className={`${inputClass} bg-gray-50 dark:bg-gray-600 cursor-not-allowed`} readOnly />
                                <p className="mt-1 text-xs text-gray-500">= LIBRAS / UDS (auto)</p>
                            </div>
                        </div>
                    </div>

                    {/* Sección 4 */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Fechas</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelClass}>FECHA ELAB *</label>
                                <input type="datetime-local" value={data.fecha_elab} onChange={(e) => setData('fecha_elab', e.target.value)} className={inputClass} required />
                            </div>
                            <div>
                                <label className={labelClass}>FECHAVENCI *</label>
                                <input type="datetime-local" value={data.fechavenci} onChange={(e) => setData('fechavenci', e.target.value)} className={inputClass} required />
                            </div>
                        </div>
                    </div>

                    {/* Sección 5 */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Almacenamiento</h3>
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
                            </div>
                            <div>
                                <label className={labelClass}>EMPAQUE</label>
                                <select value={data.empaque} onChange={(e) => setData('empaque', e.target.value)} className={inputClass}>
                                    <option value="CAJA LBS LIBRE">CAJA LBS LIBRE</option>
                                    <option value="BOLSA VACIO">BOLSA VACIO</option>
                                    <option value="TARRINA">TARRINA</option>
                                </select>
                            </div>
                            <div>
                                <label className={labelClass}>CUARTO</label>
                                <input type="number" value={data.cuarto} onChange={(e) => setData('cuarto', e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>POSICION</label>
                                <input type="text" value={data.posicion} onChange={(e) => setData('posicion', e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>TARIMA</label>
                                <input type="number" value={data.tarima} onChange={(e) => setData('tarima', e.target.value)} className={inputClass} />
                            </div>
                        </div>
                    </div>

                    {/* Sección 6 */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Cliente y Documento</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelClass}>CLIENTE</label>
                                <input type="text" value={data.cliente} onChange={(e) => setData('cliente', e.target.value)} className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>N° DOC</label>
                                <input type="text" value={data.ndoc} onChange={(e) => setData('ndoc', e.target.value)} className={inputClass} />
                            </div>
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <a href={route('salidas.index')} className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors font-medium">Cancelar</a>
                        <button type="submit" disabled={processing} className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-lg shadow-red-500/30">
                            {processing ? 'Actualizando...' : 'Actualizar Salida'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

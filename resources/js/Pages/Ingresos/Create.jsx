import { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function IngresosCreate() {
    const { data, setData, post, processing, errors } = useForm({
        items: '',
        fechaemp: '',
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
        cuarto: '1',
        posicion: '',
        tarima: '1',
    });

    // Calcular automáticamente CAJA2 y PROMEDIO
    const [caja2, setCaja2] = useState(0);
    const [promedio, setPromedio] = useState(0);

    useEffect(() => {
        // Fórmula: CAJA2 = CAJA
        setCaja2(data.caja || 0);
        
        // Fórmula: PROMEDIO = LIBRAS / UDS
        if (data.uds && data.libras && data.uds > 0) {
            setPromedio((parseFloat(data.libras) / parseFloat(data.uds)).toFixed(2));
        } else {
            setPromedio(0);
        }
    }, [data.caja, data.uds, data.libras]);

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('ingresos.store'));
    };

    const inputClass = "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 transition-all duration-200";
    const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2";

    return (
        <AppLayout title="Nuevo Ingreso">
            <Head title="Nuevo Ingreso" />

            <div className="card max-w-7xl">
                {/* Header */}
                <div className="mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        Registrar Nuevo Ingreso
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Complete todos los campos para crear un nuevo registro
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Sección 1: Información Básica */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                            <span className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-3">
                                <span className="text-blue-600 dark:text-blue-400 font-bold">1</span>
                            </span>
                            Información Básica
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <label className={labelClass}>ITEMS *</label>
                                <input
                                    type="number"
                                    value={data.items}
                                    onChange={(e) => setData('items', e.target.value)}
                                    className={inputClass}
                                    required
                                />
                                {errors.items && <p className="mt-1 text-xs text-red-500">{errors.items}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>FECHAEMP *</label>
                                <input
                                    type="datetime-local"
                                    value={data.fechaemp}
                                    onChange={(e) => setData('fechaemp', e.target.value)}
                                    className={inputClass}
                                    required
                                />
                                {errors.fechaemp && <p className="mt-1 text-xs text-red-500">{errors.fechaemp}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>LOTE *</label>
                                <input
                                    type="text"
                                    value={data.lote}
                                    onChange={(e) => setData('lote', e.target.value)}
                                    className={inputClass}
                                    placeholder="64/25"
                                    required
                                />
                                {errors.lote && <p className="mt-1 text-xs text-red-500">{errors.lote}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>CODIGO *</label>
                                <input
                                    type="text"
                                    value={data.codigo}
                                    onChange={(e) => setData('codigo', e.target.value)}
                                    className={inputClass}
                                    placeholder="010903060401"
                                    required
                                />
                                {errors.codigo && <p className="mt-1 text-xs text-red-500">{errors.codigo}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Sección 2: Producto */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                            <span className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-3">
                                <span className="text-green-600 dark:text-green-400 font-bold">2</span>
                            </span>
                            Producto
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <label className={labelClass}>ESPECIE *</label>
                                <select
                                    value={data.especie}
                                    onChange={(e) => setData('especie', e.target.value)}
                                    className={inputClass}
                                    required
                                >
                                    <option value="">Seleccionar</option>
                                    <option value="ATUN">ATUN</option>
                                    <option value="SARDINA">SARDINA</option>
                                    <option value="JUREL">JUREL</option>
                                    <option value="CABALLA">CABALLA</option>
                                </select>
                                {errors.especie && <p className="mt-1 text-xs text-red-500">{errors.especie}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>PRODUCTO *</label>
                                <input
                                    type="text"
                                    value={data.producto}
                                    onChange={(e) => setData('producto', e.target.value)}
                                    className={inputClass}
                                    placeholder="LOMO SIN PIEL, CON CO"
                                    required
                                />
                                {errors.producto && <p className="mt-1 text-xs text-red-500">{errors.producto}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>CALIDAD *</label>
                                <select
                                    value={data.calidad}
                                    onChange={(e) => setData('calidad', e.target.value)}
                                    className={inputClass}
                                    required
                                >
                                    <option value="A">A - Excelente</option>
                                    <option value="B">B - Bueno</option>
                                    <option value="C">C - Regular</option>
                                </select>
                                {errors.calidad && <p className="mt-1 text-xs text-red-500">{errors.calidad}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>TALLA *</label>
                                <select
                                    value={data.talla}
                                    onChange={(e) => setData('talla', e.target.value)}
                                    className={inputClass}
                                    required
                                >
                                    <option value="">Seleccionar</option>
                                    <option value="58">58</option>
                                    <option value="60">60</option>
                                    <option value="65">65</option>
                                    <option value="70">70</option>
                                    <option value="80">80</option>
                                </select>
                                {errors.talla && <p className="mt-1 text-xs text-red-500">{errors.talla}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Sección 3: Cantidades */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                            <span className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mr-3">
                                <span className="text-purple-600 dark:text-purple-400 font-bold">3</span>
                            </span>
                            Cantidades y Pesos
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <label className={labelClass}>CAJA *</label>
                                <input
                                    type="number"
                                    value={data.caja}
                                    onChange={(e) => setData('caja', e.target.value)}
                                    className={inputClass}
                                    required
                                />
                                {errors.caja && <p className="mt-1 text-xs text-red-500">{errors.caja}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>CAJA2</label>
                                <input
                                    type="text"
                                    value={caja2}
                                    className={`${inputClass} bg-gray-50 dark:bg-gray-600 cursor-not-allowed`}
                                    readOnly
                                />
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">= CAJA (automático)</p>
                            </div>
                            <div>
                                <label className={labelClass}>UDS</label>
                                <input
                                    type="number"
                                    value={data.uds}
                                    onChange={(e) => setData('uds', e.target.value)}
                                    className={inputClass}
                                />
                                {errors.uds && <p className="mt-1 text-xs text-red-500">{errors.uds}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>LIBRAS</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={data.libras}
                                    onChange={(e) => setData('libras', e.target.value)}
                                    className={inputClass}
                                />
                                {errors.libras && <p className="mt-1 text-xs text-red-500">{errors.libras}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>PROMEDIO</label>
                                <input
                                    type="text"
                                    value={promedio > 0 ? promedio : '-'}
                                    className={`${inputClass} bg-gray-50 dark:bg-gray-600 cursor-not-allowed`}
                                    readOnly
                                />
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">= LIBRAS / UDS (automático)</p>
                            </div>
                        </div>
                    </div>

                    {/* Sección 4: Fechas */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                            <span className="w-8 h-8 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mr-3">
                                <span className="text-orange-600 dark:text-orange-400 font-bold">4</span>
                            </span>
                            Fechas
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelClass}>FECHA ELAB *</label>
                                <input
                                    type="datetime-local"
                                    value={data.fecha_elab}
                                    onChange={(e) => setData('fecha_elab', e.target.value)}
                                    className={inputClass}
                                    required
                                />
                                {errors.fecha_elab && <p className="mt-1 text-xs text-red-500">{errors.fecha_elab}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>FECHAVENCI *</label>
                                <input
                                    type="datetime-local"
                                    value={data.fechavenci}
                                    onChange={(e) => setData('fechavenci', e.target.value)}
                                    className={inputClass}
                                    required
                                />
                                {errors.fechavenci && <p className="mt-1 text-xs text-red-500">{errors.fechavenci}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Sección 5: Almacenamiento */}
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                            <span className="w-8 h-8 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center mr-3">
                                <span className="text-red-600 dark:text-red-400 font-bold">5</span>
                            </span>
                            Almacenamiento
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div>
                                <label className={labelClass}>QUEES</label>
                                <select
                                    value={data.quees}
                                    onChange={(e) => setData('quees', e.target.value)}
                                    className={inputClass}
                                >
                                    <option value="INVFISICO">INVFISICO</option>
                                    <option value="INVQUIMICO">INVQUIMICO</option>
                                    <option value="MUESTRA">MUESTRA</option>
                                </select>
                                {errors.quees && <p className="mt-1 text-xs text-red-500">{errors.quees}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>EMPAQUE</label>
                                <select
                                    value={data.empaque}
                                    onChange={(e) => setData('empaque', e.target.value)}
                                    className={inputClass}
                                >
                                    <option value="CAJA LBS LIBRE">CAJA LBS LIBRE</option>
                                    <option value="BOLSA VACIO">BOLSA VACIO</option>
                                    <option value="TARRINA">TARRINA</option>
                                </select>
                                {errors.empaque && <p className="mt-1 text-xs text-red-500">{errors.empaque}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>CUARTO</label>
                                <input
                                    type="number"
                                    value={data.cuarto}
                                    onChange={(e) => setData('cuarto', e.target.value)}
                                    className={inputClass}
                                />
                                {errors.cuarto && <p className="mt-1 text-xs text-red-500">{errors.cuarto}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>POSICION</label>
                                <input
                                    type="text"
                                    value={data.posicion}
                                    onChange={(e) => setData('posicion', e.target.value)}
                                    className={inputClass}
                                    placeholder="Opcional"
                                />
                                {errors.posicion && <p className="mt-1 text-xs text-red-500">{errors.posicion}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>TARIMA</label>
                                <input
                                    type="number"
                                    value={data.tarima}
                                    onChange={(e) => setData('tarima', e.target.value)}
                                    className={inputClass}
                                />
                                {errors.tarima && <p className="mt-1 text-xs text-red-500">{errors.tarima}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <Link
                            href={route('ingresos.index')}
                            className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 font-medium"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium shadow-lg shadow-blue-500/30"
                        >
                            {processing ? 'Guardando...' : 'Guardar Ingreso'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

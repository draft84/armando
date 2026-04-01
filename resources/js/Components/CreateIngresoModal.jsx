import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function CreateIngresoModal({ isOpen, onClose, onSubmit, form }) {
    const [caja2, setCaja2] = useState(0);
    const [promedio, setPromedio] = useState(0);

    const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-200 text-sm";
    const labelClass = "block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide";
    const sectionClass = "mb-6";
    const gridClass = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4";

    useEffect(() => {
        setCaja2(form.data.caja || 0);
        if (form.data.uds && form.data.libras && form.data.uds > 0) {
            setPromedio((parseFloat(form.data.libras) / parseFloat(form.data.uds)).toFixed(2));
        } else {
            setPromedio(0);
        }
    }, [form.data.caja, form.data.uds, form.data.libras]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
            
            <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
                <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Registrar Nuevo Ingreso
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                Complete la información del producto
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                        >
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Form Body */}
                    <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-6">
                        {/* Sección 1: Información Básica */}
                        <div className={sectionClass}>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                                Información Básica
                            </h3>
                            <div className={gridClass}>
                                <div>
                                    <label className={labelClass}>Items *</label>
                                    <input type="number" value={form.data.items} onChange={(e) => form.setData('items', e.target.value)} className={inputClass} required />
                                </div>
                                <div>
                                    <label className={labelClass}>Fecha Embarque *</label>
                                    <input type="datetime-local" value={form.data.fechaemp} onChange={(e) => form.setData('fechaemp', e.target.value)} className={inputClass} required />
                                </div>
                                <div>
                                    <label className={labelClass}>Lote *</label>
                                    <input type="text" value={form.data.lote} onChange={(e) => form.setData('lote', e.target.value)} className={inputClass} placeholder="64/25" required />
                                </div>
                                <div>
                                    <label className={labelClass}>Código *</label>
                                    <input type="text" value={form.data.codigo} onChange={(e) => form.setData('codigo', e.target.value)} className={inputClass} placeholder="010903060401" required />
                                </div>
                            </div>
                        </div>

                        {/* Sección 2: Producto */}
                        <div className={sectionClass}>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                                Producto
                            </h3>
                            <div className={gridClass}>
                                <div>
                                    <label className={labelClass}>Especie *</label>
                                    <select value={form.data.especie} onChange={(e) => form.setData('especie', e.target.value)} className={inputClass} required>
                                        <option value="">Seleccionar</option>
                                        <option value="ATUN">ATUN</option>
                                        <option value="SARDINA">SARDINA</option>
                                        <option value="JUREL">JUREL</option>
                                        <option value="CABALLA">CABALLA</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Producto *</label>
                                    <input type="text" value={form.data.producto} onChange={(e) => form.setData('producto', e.target.value)} className={inputClass} placeholder="LOMO SIN PIEL, CON CO" required />
                                </div>
                                <div>
                                    <label className={labelClass}>Calidad *</label>
                                    <select value={form.data.calidad} onChange={(e) => form.setData('calidad', e.target.value)} className={inputClass} required>
                                        <option value="A">A - Excelente</option>
                                        <option value="B">B - Bueno</option>
                                        <option value="C">C - Regular</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Talla *</label>
                                    <select value={form.data.talla} onChange={(e) => form.setData('talla', e.target.value)} className={inputClass} required>
                                        <option value="">Seleccionar</option>
                                        <option value="58">58</option>
                                        <option value="60">60</option>
                                        <option value="65">65</option>
                                        <option value="70">70</option>
                                        <option value="80">80</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Sección 3: Cantidades */}
                        <div className={sectionClass}>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                                Cantidades y Pesos
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                <div>
                                    <label className={labelClass}>Caja *</label>
                                    <input type="number" value={form.data.caja} onChange={(e) => { form.setData('caja', e.target.value); setCaja2(e.target.value || 0); }} className={inputClass} required />
                                </div>
                                <div>
                                    <label className={labelClass}>Caja 2</label>
                                    <input type="text" value={caja2} className={`${inputClass} bg-gray-50 dark:bg-gray-600 cursor-not-allowed text-gray-500`} readOnly />
                                </div>
                                <div>
                                    <label className={labelClass}>Unidades</label>
                                    <input type="number" value={form.data.uds} onChange={(e) => form.setData('uds', e.target.value)} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Libras</label>
                                    <input type="number" step="0.01" value={form.data.libras} onChange={(e) => form.setData('libras', e.target.value)} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Promedio</label>
                                    <input type="text" value={promedio > 0 ? promedio : '-'} className={`${inputClass} bg-gray-50 dark:bg-gray-600 cursor-not-allowed text-gray-500`} readOnly />
                                </div>
                            </div>
                        </div>

                        {/* Sección 4: Fechas */}
                        <div className={sectionClass}>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                                Fechas
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className={labelClass}>Fecha Elaboración *</label>
                                    <input type="datetime-local" value={form.data.fecha_elab} onChange={(e) => form.setData('fecha_elab', e.target.value)} className={inputClass} required />
                                </div>
                                <div>
                                    <label className={labelClass}>Fecha Vencimiento *</label>
                                    <input type="datetime-local" value={form.data.fechavenci} onChange={(e) => form.setData('fechavenci', e.target.value)} className={inputClass} required />
                                </div>
                            </div>
                        </div>

                        {/* Sección 5: Almacenamiento */}
                        <div className={sectionClass}>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                                Almacenamiento
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                <div>
                                    <label className={labelClass}>Tipo</label>
                                    <select value={form.data.quees} onChange={(e) => form.setData('quees', e.target.value)} className={inputClass}>
                                        <option value="INVFISICO">INVFISICO</option>
                                        <option value="INVQUIMICO">INVQUIMICO</option>
                                        <option value="MUESTRA">MUESTRA</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Empaque</label>
                                    <select value={form.data.empaque} onChange={(e) => form.setData('empaque', e.target.value)} className={inputClass}>
                                        <option value="CAJA LBS LIBRE">CAJA LBS LIBRE</option>
                                        <option value="BOLSA VACIO">BOLSA VACIO</option>
                                        <option value="TARRINA">TARRINA</option>
                                    </select>
                                </div>
                                <div>
                                    <label className={labelClass}>Cuarto</label>
                                    <input type="number" value={form.data.cuarto} onChange={(e) => form.setData('cuarto', e.target.value)} className={inputClass} />
                                </div>
                                <div>
                                    <label className={labelClass}>Posición</label>
                                    <input type="text" value={form.data.posicion} onChange={(e) => form.setData('posicion', e.target.value)} className={inputClass} placeholder="Opcional" />
                                </div>
                                <div>
                                    <label className={labelClass}>Tarima</label>
                                    <input type="number" value={form.data.tarima} onChange={(e) => form.setData('tarima', e.target.value)} className={inputClass} />
                                </div>
                            </div>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            Los campos marcados con * son obligatorios
                        </p>
                        <div className="flex items-center space-x-3">
                            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg transition-all font-medium text-sm">
                                Cancelar
                            </button>
                            <button type="submit" onClick={onSubmit} disabled={form.processing} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-sm shadow-sm">
                                {form.processing ? 'Guardando...' : 'Guardar Ingreso'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

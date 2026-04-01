import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function EditResumenModal({ isOpen, onClose, onSubmit, form }) {
    const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-200 text-sm";
    const labelClass = "block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide";
    const sectionClass = "mb-6";
    const gridClass = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4";

    const [stock, setStock] = useState(0);

    useEffect(() => {
        setStock((parseInt(form.data.ingresos) || 0) - (parseInt(form.data.salidas) || 0));
    }, [form.data.ingresos, form.data.salidas]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
            <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
                <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Editar Registro</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Modificar información del producto</p>
                        </div>
                        <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>
                    <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-6">
                        <div className={sectionClass}>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Información del Producto</h3>
                            <div className={gridClass}>
                                <div><label className={labelClass}>Item *</label><input type="number" value={form.data.item} onChange={(e) => form.setData('item', e.target.value)} className={inputClass} required /></div>
                                <div><label className={labelClass}>Código *</label><input type="text" value={form.data.codigo} onChange={(e) => form.setData('codigo', e.target.value)} className={inputClass} required /></div>
                                <div><label className={labelClass}>Especie *</label><input type="text" value={form.data.especie} onChange={(e) => form.setData('especie', e.target.value)} className={inputClass} required /></div>
                                <div><label className={labelClass}>Producto *</label><input type="text" value={form.data.producto} onChange={(e) => form.setData('producto', e.target.value)} className={inputClass} required /></div>
                            </div>
                        </div>
                        <div className={sectionClass}>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Características</h3>
                            <div className={gridClass}>
                                <div><label className={labelClass}>Calidad *</label><input type="text" value={form.data.calidad} onChange={(e) => form.setData('calidad', e.target.value)} className={inputClass} required /></div>
                                <div><label className={labelClass}>Estado</label><input type="text" value={form.data.estado} onChange={(e) => form.setData('estado', e.target.value)} className={inputClass} /></div>
                                <div><label className={labelClass}>Talla *</label><input type="text" value={form.data.talla} onChange={(e) => form.setData('talla', e.target.value)} className={inputClass} required /></div>
                                <div><label className={labelClass}>Empaque *</label><input type="text" value={form.data.empaque} onChange={(e) => form.setData('empaque', e.target.value)} className={inputClass} required /></div>
                            </div>
                        </div>
                        <div className={sectionClass}>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Movimientos y Stock</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div><label className={labelClass}>Ingresos</label><input type="number" value={form.data.ingresos} onChange={(e) => form.setData('ingresos', parseInt(e.target.value) || 0)} className={inputClass} /></div>
                                <div><label className={labelClass}>Salidas</label><input type="number" value={form.data.salidas} onChange={(e) => form.setData('salidas', parseInt(e.target.value) || 0)} className={inputClass} /></div>
                                <div><label className={labelClass}>Stock</label><input type="text" value={stock} className={`${inputClass} bg-gray-50 dark:bg-gray-600 cursor-not-allowed text-gray-500`} readOnly /></div>
                                <div><label className={labelClass}>LB</label><input type="text" value={form.data.lb} onChange={(e) => form.setData('lb', e.target.value)} className={inputClass} /></div>
                            </div>
                        </div>
                        <div className={sectionClass}>
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">Observaciones</h3>
                            <div><label className={labelClass}>Observación Organoléptica</label><textarea value={form.data.observacion_organoleptica} onChange={(e) => form.setData('observacion_organoleptica', e.target.value)} className={`${inputClass} min-h-[100px]`} rows="3" /></div>
                        </div>
                    </form>
                    <div className="px-6 py-4 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Los campos marcados con * son obligatorios</p>
                        <div className="flex items-center space-x-3">
                            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg transition-all font-medium text-sm">Cancelar</button>
                            <button type="submit" onClick={onSubmit} disabled={form.processing} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-sm shadow-sm">{form.processing ? 'Actualizando...' : 'Actualizar Registro'}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

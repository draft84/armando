import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, ingreso }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
            
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
                    
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                                <ExclamationTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Eliminar Ingreso</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">¿Estás seguro de continuar?</p>
                            </div>
                        </div>
                    </div>

                    {/* Contenido */}
                    <div className="p-6 bg-white dark:bg-gray-800">
                        {ingreso && (
                            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Lote:</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{ingreso.lote}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Código:</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{ingreso.codigo}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Especie:</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{ingreso.especie}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Cajas:</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{ingreso.caja?.toLocaleString()}</span>
                                </div>
                            </div>
                        )}

                        <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
                            <p className="text-sm text-yellow-800 dark:text-yellow-300">
                                <span className="font-semibold">Advertencia:</span> Esta acción no se puede deshacer. El ingreso será eliminado permanentemente.
                            </p>
                        </div>

                        {/* Botones */}
                        <div className="flex items-center justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg transition-all font-medium text-sm"
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={onConfirm}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all font-medium text-sm shadow-sm"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

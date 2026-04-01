import { useState } from 'react';
import { XMarkIcon, ArrowUpTrayIcon, DocumentIcon } from '@heroicons/react/24/outline';

export default function ImportExcelModal({ isOpen, onClose, onSubmit }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [dragOver, setDragOver] = useState(false);

    if (!isOpen) return null;

    const handleFileChange = (file) => {
        if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
            setSelectedFile(file);
        } else {
            alert('Por favor selecciona un archivo Excel válido (.xlsx o .xls)');
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        handleFileChange(file);
    };

    const handleSubmit = () => {
        if (selectedFile) {
            onSubmit(selectedFile);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={onClose} />
            
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
                    
                    {/* Header */}
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                    <DocumentIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Importar desde Excel</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">Cargar datos desde archivo .xlsx</p>
                                </div>
                            </div>
                            <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Contenido */}
                    <div className="p-6 bg-white dark:bg-gray-800">
                        {/* Área de Drop */}
                        <div
                            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                                dragOver ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                            }`}
                            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                        >
                            <ArrowUpTrayIcon className="w-10 h-10 mx-auto text-gray-400 mb-3" />
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Arrastra tu archivo Excel aquí
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                                o haz clic para seleccionar
                            </p>
                            <label className="inline-block">
                                <input type="file" accept=".xlsx,.xls" onChange={(e) => handleFileChange(e.target.files[0])} className="hidden" />
                                <span className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition-colors font-medium text-xs">
                                    Seleccionar Archivo
                                </span>
                            </label>
                        </div>

                        {/* Archivo seleccionado */}
                        {selectedFile && (
                            <div className="mt-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg p-3">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gray-200 dark:bg-gray-600 rounded flex items-center justify-center flex-shrink-0">
                                        <DocumentIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{selectedFile.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                                    </div>
                                    <button onClick={() => setSelectedFile(null)} className="text-gray-400 hover:text-red-500 transition-colors">
                                        <XMarkIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Instrucciones */}
                        <div className="mt-4 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <p className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">El archivo Excel debe contener las columnas:</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                ITEMS, FECHAEMP, LOTE, CODIGO, CAJA, ESPECIE, PRODUCTO, CALIDAD, FECHA ELAB, FECHAVENCI, TALLA, UDS, LIBRAS, QUEES, EMPAQUE, CUARTO, POSICION, TARIMA
                            </p>
                        </div>

                        {/* Botones */}
                        <div className="flex items-center justify-end space-x-3 mt-6">
                            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg transition-all font-medium text-sm">Cancelar</button>
                            <button type="button" onClick={handleSubmit} disabled={!selectedFile} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium text-sm shadow-sm">
                                Importar Datos
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

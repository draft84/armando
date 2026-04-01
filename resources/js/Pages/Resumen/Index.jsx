import { useState, useMemo, useEffect } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import CreateResumenModal from '@/Components/CreateResumenModal';
import EditResumenModal from '@/Components/EditResumenModal';
import DeleteConfirmModal from '@/Components/DeleteResumenConfirmModal';
import ImportExcelModal from '@/Components/ImportResumenExcelModal';
import {
    MagnifyingGlassIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    ArrowUpTrayIcon,
} from '@heroicons/react/24/outline';

export default function ResumenIndex({ resumens, totales, filters }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters.search || '');
    const [perPage, setPerPage] = useState(filters.perPage || 5);
    const [sortField, setSortField] = useState('codigo');
    const [sortDirection, setSortDirection] = useState('asc');
    
    // Estados para modales
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [resumenToDelete, setResumenToDelete] = useState(null);
    const [resumenToEdit, setResumenToEdit] = useState(null);

    // Búsqueda en tiempo real con debounce
    const handleSearch = (value) => {
        setSearch(value);
        const timeoutId = setTimeout(() => {
            router.get('/resumen', { search: value, perPage }, {
                preserveState: true,
                preserveScroll: true,
            });
        }, 300);
        return () => clearTimeout(timeoutId);
    };

    // Cambiar cantidad de registros por página
    const handlePerPageChange = (newPerPage) => {
        setPerPage(newPerPage);
        router.get('/resumen', { search, perPage: newPerPage }, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Ordenar columnas
    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // Icono de ordenamiento
    const getSortIcon = (field) => {
        if (sortField !== field) return null;
        return sortDirection === 'asc' ? (
            <ArrowUpIcon className="w-3 h-3 ml-1" />
        ) : (
            <ArrowDownIcon className="w-3 h-3 ml-1" />
        );
    };

    // Formulario para crear nuevo registro
    const form = useForm({
        item: '',
        codigo: '',
        especie: '',
        producto: '',
        calidad: '',
        estado: 'IQF',
        talla: '',
        empaque: '',
        ingresos: 0,
        salidas: 0,
        stock: 0,
        lb: '',
        observacion_organoleptica: '',
    });

    // Formulario para editar
    const editForm = useForm({
        id: '',
        item: '',
        codigo: '',
        especie: '',
        producto: '',
        calidad: '',
        estado: '',
        talla: '',
        empaque: '',
        ingresos: '',
        salidas: '',
        stock: '',
        lb: '',
        observacion_organoleptica: '',
    });

    // Efecto para cargar datos en el formulario de edición
    useEffect(() => {
        if (resumenToEdit) {
            editForm.setData({
                id: resumenToEdit.id,
                item: resumenToEdit.item || '',
                codigo: resumenToEdit.codigo || '',
                especie: resumenToEdit.especie || '',
                producto: resumenToEdit.producto || '',
                calidad: resumenToEdit.calidad || '',
                estado: resumenToEdit.estado || '',
                talla: resumenToEdit.talla || '',
                empaque: resumenToEdit.empaque || '',
                ingresos: resumenToEdit.ingresos || '',
                salidas: resumenToEdit.salidas || '',
                stock: resumenToEdit.stock || '',
                lb: resumenToEdit.lb || '',
                observacion_organoleptica: resumenToEdit.observacion_organoleptica || '',
            });
        }
    }, [resumenToEdit]);

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        form.post('/resumen', {
            onSuccess: () => {
                setShowCreateModal(false);
                form.reset();
            },
        });
    };

    const openCreateModal = () => {
        setShowCreateModal(true);
        form.reset();
    };

    const closeCreateModal = () => {
        setShowCreateModal(false);
        form.reset();
    };

    // Funciones para Editar
    const openEditModal = (resumen) => {
        setResumenToEdit(resumen);
        editForm.setData({
            id: resumen.id,
            item: resumen.item || '',
            codigo: resumen.codigo || '',
            especie: resumen.especie || '',
            producto: resumen.producto || '',
            calidad: resumen.calidad || '',
            estado: resumen.estado || '',
            talla: resumen.talla || '',
            empaque: resumen.empaque || '',
            ingresos: resumen.ingresos?.toString() || '',
            salidas: resumen.salidas?.toString() || '',
            stock: resumen.stock?.toString() || '',
            lb: resumen.lb?.toString() || '',
            observacion_organoleptica: resumen.observacion_organoleptica || '',
        });
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setResumenToEdit(null);
        editForm.reset();
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        
        router.put(`/resumen/${editForm.data.id}`, {
            item: editForm.data.item,
            codigo: editForm.data.codigo,
            especie: editForm.data.especie,
            producto: editForm.data.producto,
            calidad: editForm.data.calidad,
            estado: editForm.data.estado,
            talla: editForm.data.talla,
            empaque: editForm.data.empaque,
            ingresos: editForm.data.ingresos,
            salidas: editForm.data.salidas,
            lb: editForm.data.lb,
            observacion_organoleptica: editForm.data.observacion_organoleptica,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setShowEditModal(false);
                setResumenToEdit(null);
                editForm.reset();
            },
        });
    };

    // Funciones para Eliminar
    const openDeleteModal = (resumen) => {
        setResumenToDelete(resumen);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setResumenToDelete(null);
    };

    const handleDeleteConfirm = () => {
        if (resumenToDelete) {
            router.post(`/resumen/${resumenToDelete.id}`, {
                _method: 'DELETE',
            }, {
                onSuccess: () => {
                    closeDeleteModal();
                },
            });
        }
    };

    // Funciones para Importar
    const openImportModal = () => {
        setShowImportModal(true);
    };

    const closeImportModal = () => {
        setShowImportModal(false);
    };

    const handleImportSubmit = (file) => {
        const formData = new FormData();
        formData.append('file', file);
        
        router.post('/resumen/import', formData, {
            onSuccess: () => {
                closeImportModal();
            },
        });
    };

    const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-200 text-sm";
    const labelClass = "block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide";

    return (
        <AppLayout title="Resumen">
            <Head title="Resumen" />

            {/* Mensajes Flash */}
            {flash?.success && (
                <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200 rounded-lg">
                    {flash.success}
                </div>
            )}

            {/* Tarjetas de Resumen Superior */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow p-6">
                    <div className="text-sm opacity-80">Total Registros</div>
                    <div className="text-3xl font-bold mt-2">
                        {totales.total_registros?.toLocaleString() || 0}
                    </div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow p-6">
                    <div className="text-sm opacity-80">Total Ingresos</div>
                    <div className="text-3xl font-bold mt-2">
                        {totales.total_ingresos?.toLocaleString() || 0}
                    </div>
                </div>
                <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg shadow p-6">
                    <div className="text-sm opacity-80">Total Salidas</div>
                    <div className="text-3xl font-bold mt-2">
                        {totales.total_salidas?.toLocaleString() || 0}
                    </div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow p-6">
                    <div className="text-sm opacity-80">Total Stock</div>
                    <div className="text-3xl font-bold mt-2">
                        {totales.total_stock?.toLocaleString() || 0}
                    </div>
                </div>
            </div>

            {/* Barra de Herramientas */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Buscador */}
                    <div className="relative flex-1 max-w-md">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por código, especie, producto..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                        />
                    </div>

                    {/* Selector de registros por página */}
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            Mostrar:
                        </span>
                        <select
                            value={perPage}
                            onChange={(e) => handlePerPageChange(Number(e.target.value))}
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>

                    {/* Botones de Acción */}
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={openImportModal}
                            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg transition-all font-medium text-sm flex items-center shadow-sm"
                            title="Importar desde Excel"
                        >
                            <ArrowUpTrayIcon className="w-4 h-4 mr-2" />
                            Importar
                        </button>
                        <button
                            onClick={openCreateModal}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium text-sm shadow-sm flex items-center"
                        >
                            <PlusIcon className="w-4 h-4 mr-2" />
                            Nuevo Registro
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabla de Resumen */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ITEM</th>
                                <th 
                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                    onClick={() => handleSort('codigo')}
                                >
                                    <div className="flex items-center">
                                        CODIGO
                                        {getSortIcon('codigo')}
                                    </div>
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ESPECIE</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">PRODUCTO</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">CALIDAD</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ESTADO</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">TALLA</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">EMPAQUE</th>
                                <th 
                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                    onClick={() => handleSort('ingresos')}
                                >
                                    <div className="flex items-center">
                                        INGRESOS
                                        {getSortIcon('ingresos')}
                                    </div>
                                </th>
                                <th 
                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                    onClick={() => handleSort('salidas')}
                                >
                                    <div className="flex items-center">
                                        SALIDAS
                                        {getSortIcon('salidas')}
                                    </div>
                                </th>
                                <th 
                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                    onClick={() => handleSort('stock')}
                                >
                                    <div className="flex items-center">
                                        STOCK
                                        {getSortIcon('stock')}
                                    </div>
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">LB</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">OBSERVACION</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {resumens.data && resumens.data.length > 0 ? (
                                resumens.data.map((resumen) => (
                                    <tr
                                        key={resumen.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-xs"
                                    >
                                        <td className="px-4 py-3 whitespace-nowrap text-gray-900 dark:text-white">{resumen.item}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-gray-900 dark:text-white font-medium">{resumen.codigo}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-gray-900 dark:text-white">{resumen.especie}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-gray-900 dark:text-white">{resumen.producto}</td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                resumen.calidad === 'A' || resumen.calidad === 'EXCELENTE'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                    : resumen.calidad === 'B' || resumen.calidad === 'BUENO'
                                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                                            }`}>
                                                {resumen.calidad}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-gray-900 dark:text-white">{resumen.estado}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-gray-900 dark:text-white">{resumen.talla}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-gray-900 dark:text-white">{resumen.empaque}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-blue-600 dark:text-blue-400 font-medium">{resumen.ingresos?.toLocaleString()}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-red-600 dark:text-red-400 font-medium">{resumen.salidas?.toLocaleString()}</td>
                                        <td className="px-4 py-3 whitespace-nowrap font-semibold text-green-600 dark:text-green-400">{resumen.stock?.toLocaleString()}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-gray-900 dark:text-white">{resumen.lb || '-'}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-gray-900 dark:text-white max-w-xs truncate" title={resumen.observacion_organoleptica}>{resumen.observacion_organoleptica || '-'}</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end space-x-1">
                                                <button
                                                    onClick={() => openEditModal(resumen)}
                                                    className="p-1.5 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                                                    title="Editar"
                                                >
                                                    <PencilIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(resumen)}
                                                    className="p-1.5 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="14" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                        No se encontraron registros
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                {resumens.links && resumens.links.length > 3 && (
                    <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                                Mostrando {resumens.from} a {resumens.to} de {resumens.total} resultados
                            </div>
                            <div className="flex space-x-2">
                                {resumens.links.map((link, index) => (
                                    link.url ? (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                                                link.active
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span
                                            key={index}
                                            className="px-3 py-2 rounded-lg text-xs font-medium bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600 cursor-not-allowed"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    )
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modales */}
            <CreateResumenModal
                isOpen={showCreateModal}
                onClose={closeCreateModal}
                onSubmit={handleCreateSubmit}
                form={form}
            />
            
            <EditResumenModal
                isOpen={showEditModal}
                onClose={closeEditModal}
                onSubmit={handleEditSubmit}
                form={editForm}
            />
            
            <DeleteConfirmModal
                isOpen={showDeleteModal}
                onClose={closeDeleteModal}
                onConfirm={handleDeleteConfirm}
                resumen={resumenToDelete}
            />
            
            <ImportExcelModal
                isOpen={showImportModal}
                onClose={closeImportModal}
                onSubmit={handleImportSubmit}
            />
        </AppLayout>
    );
}

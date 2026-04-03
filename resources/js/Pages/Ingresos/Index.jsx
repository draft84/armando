import { useState, useMemo, useEffect } from 'react';
import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import CreateIngresoModal from '@/Components/CreateIngresoModal';
import EditIngresoModal from '@/Components/EditIngresoModal';
import DeleteConfirmModal from '@/Components/DeleteConfirmModal';
import ImportExcelModal from '@/Components/ImportExcelModal';
import { useToast } from '@/Components/Toast';
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

export default function IngresosIndex({ ingresos, totales, filters }) {
    const { flash } = usePage().props;
    const { success, error, warning, ToastContainer } = useToast();
    const [search, setSearch] = useState(filters.search || '');
    const [perPage, setPerPage] = useState(filters.perPage || 5);
    const [sortField, setSortField] = useState('fechaemp');
    const [sortDirection, setSortDirection] = useState('desc');
    
    // Estados para modales
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);
    const [ingresoToDelete, setIngresoToDelete] = useState(null);
    const [ingresoToEdit, setIngresoToEdit] = useState(null);

    // Búsqueda en tiempo real con debounce
    const handleSearch = (value) => {
        setSearch(value);
        const timeoutId = setTimeout(() => {
            router.get('/ingresos', { search: value, perPage }, {
                preserveState: true,
                preserveScroll: true,
            });
        }, 300);
        return () => clearTimeout(timeoutId);
    };

    // Cambiar cantidad de registros por página
    const handlePerPageChange = (newPerPage) => {
        setPerPage(newPerPage);
        router.get('/ingresos', { search, perPage: newPerPage }, {
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
            <ArrowUpIcon className="w-4 h-4 ml-1" />
        ) : (
            <ArrowDownIcon className="w-4 h-4 ml-1" />
        );
    };

    // Formulario para crear nuevo ingreso
    const form = useForm({
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

    // Formulario para editar (se inicializa con los datos del ingreso seleccionado)
    const editForm = useForm({
        id: '',
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
        quees: '',
        empaque: '',
        cuarto: '',
        posicion: '',
        tarima: '',
    });

    // Efecto para cargar datos en el formulario de edición
    useEffect(() => {
        if (ingresoToEdit) {
            editForm.setData({
                id: ingresoToEdit.id,
                items: ingresoToEdit.items || '',
                fechaemp: ingresoToEdit.fechaemp ? new Date(ingresoToEdit.fechaemp).toISOString().slice(0, 16) : '',
                lote: ingresoToEdit.lote || '',
                codigo: ingresoToEdit.codigo || '',
                caja: ingresoToEdit.caja || '',
                especie: ingresoToEdit.especie || '',
                producto: ingresoToEdit.producto || '',
                calidad: ingresoToEdit.calidad || 'A',
                fecha_elab: ingresoToEdit.fecha_elab ? new Date(ingresoToEdit.fecha_elab).toISOString().slice(0, 16) : '',
                fechavenci: ingresoToEdit.fechavenci ? new Date(ingresoToEdit.fechavenci).toISOString().slice(0, 16) : '',
                talla: ingresoToEdit.talla || '',
                uds: ingresoToEdit.uds || '',
                libras: ingresoToEdit.libras || '',
                quees: ingresoToEdit.quees || '',
                empaque: ingresoToEdit.empaque || '',
                cuarto: ingresoToEdit.cuarto || '',
                posicion: ingresoToEdit.posicion || '',
                tarima: ingresoToEdit.tarima || '',
            });
        }
    }, [ingresoToEdit]);

    const [caja2, setCaja2] = useState(0);
    const [promedio, setPromedio] = useState(0);

    // Calcular automáticamente CAJA2 y PROMEDIO cuando cambian los valores
    useEffect(() => {
        setCaja2(form.data.caja || 0);
        if (form.data.uds && form.data.libras && form.data.uds > 0) {
            setPromedio((parseFloat(form.data.libras) / parseFloat(form.data.uds)).toFixed(2));
        } else {
            setPromedio(0);
        }
    }, [form.data.caja, form.data.uds, form.data.libras]);

    const handleCreateSubmit = (e) => {
        e.preventDefault();
        form.post(route('ingresos.store'), {
            onSuccess: () => {
                setShowCreateModal(false);
                form.reset();
                success('Registro creado exitosamente');
            },
            onError: () => {
                error('Error al crear el registro. Verifica los datos.');
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
    const openEditModal = (ingreso) => {
        setIngresoToEdit(ingreso);
        setShowEditModal(true);
    };

    const closeEditModal = () => {
        setShowEditModal(false);
        setIngresoToEdit(null);
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        router.put(`/ingresos/${editForm.data.id}`, {
            items: editForm.data.items,
            fechaemp: editForm.data.fechaemp,
            lote: editForm.data.lote,
            codigo: editForm.data.codigo,
            caja: editForm.data.caja,
            especie: editForm.data.especie,
            producto: editForm.data.producto,
            calidad: editForm.data.calidad,
            fecha_elab: editForm.data.fecha_elab,
            fechavenci: editForm.data.fechavenci,
            talla: editForm.data.talla,
            uds: editForm.data.uds,
            libras: editForm.data.libras,
            quees: editForm.data.quees,
            empaque: editForm.data.empaque,
            cuarto: editForm.data.cuarto,
            posicion: editForm.data.posicion,
            tarima: editForm.data.tarima,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                closeEditModal();
                success('Registro actualizado exitosamente');
            },
            onError: () => {
                error('Error al actualizar el registro. Verifica los datos.');
            },
        });
    };

    // Funciones para Eliminar
    const openDeleteModal = (ingreso) => {
        setIngresoToDelete(ingreso);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setIngresoToDelete(null);
    };

    const handleDeleteConfirm = () => {
        if (ingresoToDelete) {
            router.delete(route('ingresos.destroy', ingresoToDelete.id), {
                onSuccess: () => {
                    closeDeleteModal();
                    success('Registro eliminado exitosamente');
                },
                onError: () => {
                    error('Error al eliminar el registro.');
                },
            });
        }
    };

    // Funciones para Importar
    const [isImporting, setIsImporting] = useState(false);

    const openImportModal = () => {
        console.log('🔵 [openImportModal] Abriendo modal de importación');
        console.log('🔵 showImportModal antes:', showImportModal);
        setShowImportModal(true);
        console.log('🔵 showImportModal después:', true);
    };

    const closeImportModal = () => {
        console.log('Cerrando modal de importación');
        setShowImportModal(false);
    };

    const handleImportSubmit = async (file) => {
        console.log('=== handleImportSubmit llamado ===');
        console.log('Archivo:', file?.name, 'Size:', file?.size, 'Type:', file?.type);

        if (!file) {
            console.error('No hay archivo seleccionado');
            warning('Por favor selecciona un archivo para importar');
            return;
        }

        // Validar tamaño (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            warning('El archivo es demasiado grande. Máximo 10MB.');
            return;
        }

        setIsImporting(true);
        console.log('Estado isImporting establecido a true');

        // Crear FormData con el archivo y el token CSRF
        const formData = new FormData();
        formData.append('file', file);

        // Obtener el token CSRF del meta tag
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
            || document.head.querySelector('meta[name="csrf-token"]')?.content;

        console.log('📤 Enviando petición a:', '/ingresos/import');
        console.log('📦 FormData - Archivo:', file.name, 'Tamaño:', (file.size / 1024).toFixed(2), 'KB');
        console.log('🔑 CSRF Token:', csrfToken ? 'PRESENTE' : 'AUSENTE - Intentando con cookie XSRF-TOKEN');

        // Si no hay token en meta, intentar obtenerlo de la cookie XSRF-TOKEN
        const getCookie = (name) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
            return null;
        };

        const xsrfToken = getCookie('XSRF-TOKEN');

        try {
            const startTime = Date.now();
            console.log('⏱️ Iniciando petición fetch...');

            const headers = {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json',
            };

            // Agregar el token CSRF en los headers
            if (csrfToken) {
                headers['X-CSRF-TOKEN'] = csrfToken;
            } else if (xsrfToken) {
                headers['X-XSRF-TOKEN'] = decodeURIComponent(xsrfToken);
            } else {
                console.warn('⚠️ No se encontró token CSRF, intentando sin token...');
            }

            const response = await fetch('/ingresos/import', {
                method: 'POST',
                body: formData,
                headers: headers,
                credentials: 'same-origin',
            });

            const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
            console.log(`⏱️ Respuesta recibida en ${elapsed}s - Status: ${response.status}`);
            console.log('📋 Content-Type:', response.headers.get('content-type'));

            // Verificar si la respuesta es JSON
            const contentType = response.headers.get('content-type');

            if (contentType && contentType.includes('application/json')) {
                // Respuesta JSON
                const data = await response.json();
                console.log('📊 Respuesta JSON:', data);

                if (response.ok && data.success) {
                    const message = data.message || 'Importación exitosa';
                    console.log('✅', message);
                    success(message);
                    closeImportModal();
                    // Recargar para ver los nuevos datos
                    window.location.reload();
                } else {
                    const errorMsg = data.message || 'Error desconocido al importar';
                    console.error('❌ Error:', errorMsg);
                    if (data.errores) {
                        console.error('Detalles:', data.errores);
                    }
                    error(errorMsg);
                }
            } else {
                // Respuesta HTML (probablemente redirección con mensaje flash)
                console.warn('⚠️ Respuesta no-JSON recibida');
                const text = await response.text();

                if (response.ok) {
                    console.log('✅ Importación completada (respuesta HTML)');
                    success('Importación completada');
                    closeImportModal();
                    window.location.reload();
                } else {
                    console.error('❌ Error del servidor:', response.status);
                    error('Error al procesar la solicitud (HTTP ' + response.status + '). Revisa los logs del servidor.');
                }
            }
        } catch (error) {
            console.error('❌ Error de conexión:', error);
            console.error('Stack:', error.stack);
            error('Error de conexión con el servidor. Verifica que el servidor esté funcionando. Detalle: ' + error.message);
        } finally {
            console.log('🏁 Estableciendo isImporting a false');
            setIsImporting(false);
        }
    };

    const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400 transition-all duration-200 text-sm";
    const labelClass = "block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1.5";

    // Calcular fecha más cercana
    const fechaMasCercana = useMemo(() => {
        if (!ingresos.data || ingresos.data.length === 0) return null;
        const hoy = new Date();
        let fechaCercana = null;
        let menorDiferencia = Infinity;

        ingresos.data.forEach(ingreso => {
            const fechaEmp = new Date(ingreso.fechaemp);
            const diferencia = Math.abs(fechaEmp - hoy);
            if (diferencia < menorDiferencia) {
                menorDiferencia = diferencia;
                fechaCercana = ingreso.fechaemp;
            }
        });

        return fechaCercana;
    }, [ingresos.data]);

    return (
        <AppLayout title="Ingresos">
            <Head title="Ingresos" />
            <ToastContainer />

            {/* Mensajes Flash */}
            {flash?.success && (
                <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200 rounded-lg flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    {flash.success}
                </div>
            )}
            {flash?.error && (
                <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-lg flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                    </svg>
                    {flash.error}
                </div>
            )}
            {flash?.warning && (
                <div className="mb-6 p-4 bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-700 text-yellow-700 dark:text-yellow-200 rounded-lg flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
                    </svg>
                    {flash.warning}
                </div>
            )}

            {/* Tarjetas de Resumen Superior */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    <div className="text-sm opacity-80">Total Cajas</div>
                    <div className="text-3xl font-bold mt-2">
                        {totales.total_cajas?.toLocaleString() || 0}
                    </div>
                </div>
                <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                    <div className="text-sm opacity-80">Total Items</div>
                    <div className="text-3xl font-bold mt-2">
                        {totales.total_items?.toLocaleString() || 0}
                    </div>
                </div>
                <div className="card bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                    <div className="text-sm opacity-80">Fecha Más Cercana</div>
                    <div className="text-lg font-bold mt-2">
                        {fechaMasCercana ? new Date(fechaMasCercana).toLocaleDateString('es-ES') : 'N/A'}
                    </div>
                </div>
                <div className="card bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                    <div className="text-sm opacity-80">Promedio Cajas</div>
                    <div className="text-3xl font-bold mt-2">
                        {totales.total_items > 0 
                            ? Math.round(totales.total_cajas / totales.total_items).toLocaleString() 
                            : 0}
                    </div>
                </div>
            </div>

            {/* Barra de Herramientas */}
            <div className="card mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Buscador */}
                    <div className="relative flex-1 max-w-md">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar por lote, código, especie..."
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="input-field pl-10"
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
                            className="input-field w-auto"
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
                            Nuevo Ingreso
                        </button>
                    </div>
                </div>
            </div>

            {/* Tabla de Ingresos */}
            <div className="card overflow-hidden">
                <div className="overflow-x-auto custom-scrollbar">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th 
                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                    onClick={() => handleSort('items')}
                                >
                                    <div className="flex items-center">
                                        ITEMS
                                        {getSortIcon('items')}
                                    </div>
                                </th>
                                <th 
                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                    onClick={() => handleSort('fechaemp')}
                                >
                                    <div className="flex items-center">
                                        FECHAEMP
                                        {getSortIcon('fechaemp')}
                                    </div>
                                </th>
                                <th 
                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                    onClick={() => handleSort('lote')}
                                >
                                    <div className="flex items-center">
                                        LOTE
                                        {getSortIcon('lote')}
                                    </div>
                                </th>
                                <th 
                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                    onClick={() => handleSort('codigo')}
                                >
                                    <div className="flex items-center">
                                        CODIGO
                                        {getSortIcon('codigo')}
                                    </div>
                                </th>
                                <th 
                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                    onClick={() => handleSort('caja')}
                                >
                                    <div className="flex items-center">
                                        CAJA
                                        {getSortIcon('caja')}
                                    </div>
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    ESPECIE
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    PRODUCTO
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    CALIDAD
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    FECHA ELAB
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    FECHAVENCI
                                </th>
                                <th
                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                    onClick={() => handleSort('caja2')}
                                >
                                    <div className="flex items-center">
                                        CAJA2
                                        {getSortIcon('caja2')}
                                    </div>
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    TALLA
                                </th>
                                <th
                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                    onClick={() => handleSort('uds')}
                                >
                                    <div className="flex items-center">
                                        UDS
                                        {getSortIcon('uds')}
                                    </div>
                                </th>
                                <th
                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                    onClick={() => handleSort('libras')}
                                >
                                    <div className="flex items-center">
                                        LIBRAS
                                        {getSortIcon('libras')}
                                    </div>
                                </th>
                                <th
                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                    onClick={() => handleSort('promedio')}
                                >
                                    <div className="flex items-center">
                                        PROMEDIO
                                        {getSortIcon('promedio')}
                                    </div>
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    QUEES
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    EMPAQUE
                                </th>
                                <th
                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                    onClick={() => handleSort('cuarto')}
                                >
                                    <div className="flex items-center">
                                        CUARTO
                                        {getSortIcon('cuarto')}
                                    </div>
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    POSICION
                                </th>
                                <th
                                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                                    onClick={() => handleSort('tarima')}
                                >
                                    <div className="flex items-center">
                                        TARIMA
                                        {getSortIcon('tarima')}
                                    </div>
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {ingresos.data && ingresos.data.length > 0 ? (
                                ingresos.data.map((ingreso) => (
                                    <tr
                                        key={ingreso.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-xs"
                                    >
                                        <td className="px-4 py-3 whitespace-nowrap text-gray-900 dark:text-white">
                                            {ingreso.items}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-gray-900 dark:text-white">
                                            {new Date(ingreso.fechaemp).toLocaleDateString('es-ES')}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-gray-900 dark:text-white">
                                            {ingreso.lote}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-gray-900 dark:text-white">
                                            {ingreso.codigo}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-gray-900 dark:text-white">
                                            {ingreso.caja.toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-gray-900 dark:text-white">
                                            {ingreso.especie}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-gray-900 dark:text-white">
                                            {ingreso.producto}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                ingreso.calidad === 'A'
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                                    : ingreso.calidad === 'B'
                                                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                            }`}>
                                                {ingreso.calidad}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-gray-900 dark:text-white">
                                            {new Date(ingreso.fecha_elab).toLocaleDateString('es-ES')}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-gray-900 dark:text-white">
                                            {new Date(ingreso.fechavenci).toLocaleDateString('es-ES')}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap font-medium text-blue-600 dark:text-blue-400">
                                            {ingreso.caja2.toLocaleString()}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-gray-900 dark:text-white">
                                            {ingreso.talla}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-gray-900 dark:text-white">
                                            {ingreso.uds || '-'}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-gray-900 dark:text-white">
                                            {ingreso.libras ? Number(ingreso.libras).toFixed(2) : '-'}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap font-medium text-blue-600 dark:text-blue-400">
                                            {ingreso.promedio ? Number(ingreso.promedio).toFixed(2) : '-'}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-gray-900 dark:text-white">
                                            {ingreso.quees || '-'}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-gray-900 dark:text-white">
                                            {ingreso.empaque || '-'}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-gray-900 dark:text-white">
                                            {ingreso.cuarto || '-'}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-gray-900 dark:text-white">
                                            {ingreso.posicion || '-'}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-gray-900 dark:text-white">
                                            {ingreso.tarima || '-'}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end space-x-1">
                                                <button
                                                    onClick={() => openEditModal(ingreso)}
                                                    className="p-1.5 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                                                    title="Editar"
                                                >
                                                    <PencilIcon className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(ingreso)}
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
                                    <td colSpan="21" className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                        No se encontraron ingresos
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                {ingresos.links && ingresos.links.length > 3 && (
                    <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                Mostrando {ingresos.from} a {ingresos.to} de {ingresos.total} resultados
                            </div>
                            <div className="flex space-x-2">
                                {ingresos.links.map((link, index) => (
                                    link.url ? (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                link.active
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ) : (
                                        <span
                                            key={index}
                                            className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600 cursor-not-allowed"
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    )
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal para Nuevo Ingreso */}
            <CreateIngresoModal
                isOpen={showCreateModal}
                onClose={closeCreateModal}
                onSubmit={handleCreateSubmit}
                form={form}
            />
            
            {/* Modal para Editar Ingreso */}
            <EditIngresoModal
                isOpen={showEditModal}
                onClose={closeEditModal}
                onSubmit={handleEditSubmit}
                form={editForm}
            />
            
            {/* Modal para Confirmar Eliminación */}
            <DeleteConfirmModal
                isOpen={showDeleteModal}
                onClose={closeDeleteModal}
                onConfirm={handleDeleteConfirm}
                ingreso={ingresoToDelete}
            />

            {/* Modal para Importar Excel */}
            <ImportExcelModal
                isOpen={showImportModal}
                onClose={closeImportModal}
                onSubmit={handleImportSubmit}
                isSubmitting={isImporting}
            />
        </AppLayout>
    );
}

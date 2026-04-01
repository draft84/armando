import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

export default function IngresosEdit({ ingreso }) {
    const { data, setData, put, processing, errors } = useForm({
        items: ingreso.items || '',
        fechaemp: ingreso.fechaemp ? new Date(ingreso.fechaemp).toISOString().slice(0, 16) : '',
        lote: ingreso.lote || '',
        codigo: ingreso.codigo || '',
        caja: ingreso.caja || '',
        especie: ingreso.especie || '',
        producto: ingreso.producto || '',
        calidad: ingreso.calidad || 'A',
        fecha_elab: ingreso.fecha_elab ? new Date(ingreso.fecha_elab).toISOString().slice(0, 16) : '',
        fechavenci: ingreso.fechavenci ? new Date(ingreso.fechavenci).toISOString().slice(0, 16) : '',
        talla: ingreso.talla || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('ingresos.update', ingreso.id));
    };

    return (
        <AppLayout title="Editar Ingreso">
            <Head title="Editar Ingreso" />

            <div className="card max-w-4xl">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* ITEMS */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                ITEMS *
                            </label>
                            <input
                                type="number"
                                value={data.items}
                                onChange={(e) => setData('items', e.target.value)}
                                className="input-field"
                                required
                            />
                            {errors.items && (
                                <p className="mt-1 text-sm text-red-600">{errors.items}</p>
                            )}
                        </div>

                        {/* FECHAEMP */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                FECHAEMP *
                            </label>
                            <input
                                type="datetime-local"
                                value={data.fechaemp}
                                onChange={(e) => setData('fechaemp', e.target.value)}
                                className="input-field"
                                required
                            />
                            {errors.fechaemp && (
                                <p className="mt-1 text-sm text-red-600">{errors.fechaemp}</p>
                            )}
                        </div>

                        {/* LOTE */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                LOTE *
                            </label>
                            <input
                                type="text"
                                value={data.lote}
                                onChange={(e) => setData('lote', e.target.value)}
                                className="input-field"
                                required
                            />
                            {errors.lote && (
                                <p className="mt-1 text-sm text-red-600">{errors.lote}</p>
                            )}
                        </div>

                        {/* CODIGO */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                CODIGO *
                            </label>
                            <input
                                type="text"
                                value={data.codigo}
                                onChange={(e) => setData('codigo', e.target.value)}
                                className="input-field"
                                required
                            />
                            {errors.codigo && (
                                <p className="mt-1 text-sm text-red-600">{errors.codigo}</p>
                            )}
                        </div>

                        {/* CAJA */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                CAJA *
                            </label>
                            <input
                                type="number"
                                value={data.caja}
                                onChange={(e) => setData('caja', e.target.value)}
                                className="input-field"
                                required
                            />
                            {errors.caja && (
                                <p className="mt-1 text-sm text-red-600">{errors.caja}</p>
                            )}
                            <p className="mt-1 text-xs text-gray-500">
                                CAJA2 se calculará automáticamente (= CAJA)
                            </p>
                        </div>

                        {/* ESPECIE */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                ESPECIE *
                            </label>
                            <select
                                value={data.especie}
                                onChange={(e) => setData('especie', e.target.value)}
                                className="input-field"
                                required
                            >
                                <option value="">Seleccionar</option>
                                <option value="ATUN">ATUN</option>
                                <option value="SARDINA">SARDINA</option>
                                <option value="JUREL">JUREL</option>
                                <option value="CABALLA">CABALLA</option>
                            </select>
                            {errors.especie && (
                                <p className="mt-1 text-sm text-red-600">{errors.especie}</p>
                            )}
                        </div>

                        {/* PRODUCTO */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                PRODUCTO *
                            </label>
                            <input
                                type="text"
                                value={data.producto}
                                onChange={(e) => setData('producto', e.target.value)}
                                className="input-field"
                                required
                            />
                            {errors.producto && (
                                <p className="mt-1 text-sm text-red-600">{errors.producto}</p>
                            )}
                        </div>

                        {/* CALIDAD */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                CALIDAD *
                            </label>
                            <select
                                value={data.calidad}
                                onChange={(e) => setData('calidad', e.target.value)}
                                className="input-field"
                                required
                            >
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                            </select>
                            {errors.calidad && (
                                <p className="mt-1 text-sm text-red-600">{errors.calidad}</p>
                            )}
                        </div>

                        {/* FECHA ELAB */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                FECHA ELAB *
                            </label>
                            <input
                                type="datetime-local"
                                value={data.fecha_elab}
                                onChange={(e) => setData('fecha_elab', e.target.value)}
                                className="input-field"
                                required
                            />
                            {errors.fecha_elab && (
                                <p className="mt-1 text-sm text-red-600">{errors.fecha_elab}</p>
                            )}
                        </div>

                        {/* FECHAVENCI */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                FECHAVENCI *
                            </label>
                            <input
                                type="datetime-local"
                                value={data.fechavenci}
                                onChange={(e) => setData('fechavenci', e.target.value)}
                                className="input-field"
                                required
                            />
                            {errors.fechavenci && (
                                <p className="mt-1 text-sm text-red-600">{errors.fechavenci}</p>
                            )}
                        </div>

                        {/* TALLA */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                TALLA *
                            </label>
                            <select
                                value={data.talla}
                                onChange={(e) => setData('talla', e.target.value)}
                                className="input-field"
                                required
                            >
                                <option value="">Seleccionar</option>
                                <option value="58">58</option>
                                <option value="60">60</option>
                                <option value="65">65</option>
                                <option value="70">70</option>
                                <option value="80">80</option>
                            </select>
                            {errors.talla && (
                                <p className="mt-1 text-sm text-red-600">{errors.talla}</p>
                            )}
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <a
                            href={route('ingresos.index')}
                            className="btn-secondary"
                        >
                            Cancelar
                        </a>
                        <button
                            type="submit"
                            disabled={processing}
                            className="btn-primary"
                        >
                            {processing ? 'Actualizando...' : 'Actualizar Ingreso'}
                        </button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}

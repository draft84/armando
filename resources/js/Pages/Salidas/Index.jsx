import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { ArrowUpTrayIcon } from '@heroicons/react/24/outline';

export default function SalidasIndex() {
    return (
        <AppLayout title="Salidas">
            <Head title="Salidas" />

            <div className="card">
                <div className="text-center py-12">
                    <ArrowUpTrayIcon className="w-20 h-20 mx-auto text-gray-400 mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                        Sección Salidas
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Aquí se gestionarán las salidas de producción.
                    </p>
                </div>
            </div>
        </AppLayout>
    );
}

import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';

const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'SYSF';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
    setup({ el, App, props }) {
        // Inicializar Ziggy con los datos compartidos desde Laravel
        if (props.initialPage.props.ziggy) {
            const { Ziggy } = props.initialPage.props.ziggy;
            if (Ziggy) {
                window.Ziggy = Ziggy;
                window.route = (name, params = {}, absolute = true) => {
                    if (window.Ziggy && typeof window.Ziggy.route === 'function') {
                        return window.Ziggy.route(name, params, absolute);
                    }
                    return `/${name.replace('.', '/')}`;
                };
            }
        }

        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4F46E5',
    },
});

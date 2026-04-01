import axios from 'axios';

window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.headers.common['X-CSRF-TOKEN'] = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

// Configurar función route globalmente usando window.Ziggy
if (typeof window !== 'undefined') {
    window.route = function(name, params = {}, absolute = true) {
        if (window.Ziggy && typeof window.Ziggy.route === 'function') {
            return window.Ziggy.route(name, params, absolute);
        }
        console.warn('Ziggy no está inicializado. Usando fallback.');
        return '#' + name;
    };
}

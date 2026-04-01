// Ziggy se configura desde el backend a través de la directiva @routes
// La configuración está disponible en window.Ziggy

export function route(name, params, absolute) {
    if (typeof window !== 'undefined' && window.Ziggy) {
        return window.Ziggy.route(name, params, absolute);
    }
    throw new Error('Ziggy no está inicializado');
}

export let Ziggy;

if (typeof window !== 'undefined') {
    Ziggy = window.Ziggy;
}

// Carga diferida de Motion (js/vendor/motion.js, ver js/vendor/README.md): el archivo solo se pide la primera vez
// que una pieza animada lo necesita, así no pesa en el arranque de la app.
const VERSION = '11.18.2';
let promesa = null;

/** Devuelve window.Motion ({ animate, stagger, inView, … }); rechaza si no se pudo cargar (la pieza debe funcionar sin animar). */
export function cargarMotion() {
    if (window.Motion) return Promise.resolve(window.Motion);
    return promesa ??= new Promise((ok, mal) => {
        const s = document.createElement('script');
        s.src = `js/vendor/motion.js?v=${VERSION}`;
        s.onload = () => (window.Motion ? ok(window.Motion) : mal(new Error('Motion no se definió')));
        s.onerror = () => { promesa = null; mal(new Error('No se pudo cargar Motion')); };
        document.head.appendChild(s);
    });
}

/** El usuario pidió menos movimiento en su sistema: las piezas deben ir directas al estado final. */
export const sinMovimiento = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

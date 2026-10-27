// Piezas mínimas con DOM del receptor vivo: el buscador por id (todos los ids llevan el prefijo rcv-) y «reducir movimiento».
export const $ = id => document.getElementById('rcv-' + id);
export const REDUCIR = matchMedia('(prefers-reduced-motion: reduce)').matches;

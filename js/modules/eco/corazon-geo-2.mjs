// Dibujo nuevo del corazón de la eco. Toma su forma del contrato del motor (B-045, paso 4): lee del motor lo que
// necesita y no calcula fisiología por su cuenta. Hoy es idéntico al dibujo de corazon-geo.mjs (delega en él);
// se irá sustituyendo pieza a pieza. Se activa con la fachada de corazon-geo.mjs (?dibujo=2, ECO_DIBUJO=2 o usarDibujo(2)).
// Ojo con el ciclo de importación: aquí nada de corazon-geo.mjs se usa a nivel superior, solo dentro de funciones.
import { construirCorazonHoy, baseGeometricaHoy } from './corazon-geo.mjs';

// Ajustes del dibujo nuevo sobre la geometría de hoy (cada uno, comentado con su fuente en baseGeometricaHoy):
// P4a-1 · paredVdNormal: la pared libre del VD con el grosor de paredVdDe medido perpendicular a ella (Lang 2015 Tabla 8 p. 20).
const AJUSTES = { paredVdNormal: true };
export function construirCorazon2(estado, opciones = {}) { return construirCorazonHoy(estado, { ...opciones, ajustes: { ...AJUSTES, ...opciones.ajustes } }); }
export function baseGeometrica2(estado) { return baseGeometricaHoy(estado, AJUSTES); }

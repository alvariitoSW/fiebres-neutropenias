// Dibujo nuevo del corazón de la eco. Toma su forma del contrato del motor (B-045, paso 4): lee del motor lo que
// necesita y no calcula fisiología por su cuenta. Hoy es idéntico al dibujo de corazon-geo.mjs (delega en él);
// se irá sustituyendo pieza a pieza. Se activa con la fachada de corazon-geo.mjs (?dibujo=2, ECO_DIBUJO=2 o usarDibujo(2)).
// Ojo con el ciclo de importación: aquí nada de corazon-geo.mjs se usa a nivel superior, solo dentro de funciones.
import { construirCorazonHoy, baseGeometricaHoy } from './corazon-geo.mjs';

// Ajustes del dibujo nuevo sobre la geometría de hoy (cada uno, comentado con su fuente en baseGeometricaHoy):
// P4a-1 · paredVdNormal: la pared libre del VD con el grosor de paredVdDe medido perpendicular a ella (Lang 2015 Tabla 8 p. 20).
// P4b · septoContinuo: el tabique desde septoSigno del motor, continuo (ESC/ERS 2022 p. 3645 Tabla 10 para el umbral del LVEI).
// P4a-2 · auVolumen: el corte A4C de la AD recoge el área del volumen del motor (área-longitud, Lang 2015 p. 29 Tabla 12).
const AJUSTES = { paredVdNormal: true, septoContinuo: true, auVolumen: true, vdLargoPropio: true, septoRecto: 0.75, septoRectoEndo: 0.3, papilaresEscala: true };
// septoRecto · el tabique plano se une al círculo con uniones menos redondeadas (0,75 de lo de hoy; con menos, el VD de la TEP g=1 queda a 40,9 mm de base, bajo el 41 de Lang): eje corto en «D» (ESC/ERS 2022 p. 3645 Tabla 10).
// papilaresEscala · papilares y trabéculas del VI proporcionados a la cavidad: no la llenan en el VI pequeño (HP, TEP).
// vdLargoPropio · el largo del VD sale de su volumen (raíz cúbica), no del VI (Lang 2015 Tabla 8 p. 20: 71 ± 6 mm; más allá, ilustrativo).
export function construirCorazon2(estado, opciones = {}) { return construirCorazonHoy(estado, { ...opciones, ajustes: { ...AJUSTES, ...opciones.ajustes } }); }
export function baseGeometrica2(estado) { return baseGeometricaHoy(estado, AJUSTES); }

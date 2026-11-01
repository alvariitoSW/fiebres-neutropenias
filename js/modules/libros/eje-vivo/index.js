// Eje hormonal vivo · dos glándulas, un enfermo (Marino cap. 51): modelo vivo de Libros. Interfaz común: init() devuelve { abrir(estadoClave, origen) }.
// Se abre con el enlace cruzado de siempre (lo resuelve el listener delegado de home/index.js):
// <button data-especialidad="libros" data-view="ejeVivo" data-eje-vivo="toribio:2">
// y su «← VOLVER» lleva a la ficha de origen (core/volver-ficha.js). El estado es la clave del paciente (toribio, bibiana, sinforoso, lucrecia,
// obdulia, policarpo, fulgencio) y, tras los dos puntos, el paso de su guía.
// Pieza 1a: el modelo se ve y cambia de paciente con chips. Pieza 1b (hueco, `pagina.js`): mandos, dock, guía, mapa y prueba.
import { marcarVolver } from '../../../core/volver-ficha.js';
import { PRES, CLAVES_PACIENTE, GUIAS, IDEA, cita } from '../../../data/eje-vivo-data.js';
import { nuevo, leer } from './modelo.js';
import { escena, focoSvg, animarEje } from './dibujo.js';

const $ = (id) => document.getElementById(id);
const num = (x) => String(x).replace('.', ',');
let raiz = null, s = null, lup = 'sr', vista = 'eje', paso = 0;

function pintar(anima) {
  const L = leer(s), foco = GUIAS[s.pac][1][paso]?.z || null;
  $('eje-svg').innerHTML = escena(s, L, { lup, vista }) + focoSvg(foco);
  $('eje-m-pa').textContent = `${L.pas}/${L.pad}`; $('eje-m-pam').textContent = L.pam.toFixed(0); $('eje-m-fc').textContent = L.fc; $('eje-m-rit').textContent = L.ritmo;
  $('eje-m-t').textContent = num(L.t); $('eje-m-na').textContent = L.na; $('eje-m-gl').textContent = L.gluc; $('eje-m-lac').textContent = num(L.lact);
  $('eje-m-nor').textContent = num(s.na.toFixed(1)); $('eje-m-dia').textContent = s.dia;
  $('eje-m-pa').parentElement.className = L.pam < 65 ? 'mal' : ''; $('eje-m-t').parentElement.className = L.t > 40 || L.t < 35 ? 'mal' : '';
  document.querySelectorAll('#eje-chips [data-pre]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.pre === s.pac)));
  document.querySelectorAll('#eje-raiz [data-lup]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lup === lup)));
  const P = PRES[s.pac], p = GUIAS[s.pac][1][paso];
  $('eje-idea').innerHTML = IDEA;
  $('eje-guia').innerHTML = `<h3>${GUIAS[s.pac][0]}</h3><p class="eje-paso">Paso ${paso + 1} de ${GUIAS[s.pac][1].length} · ${P.caso}, ${P.e} años</p><p>${p.t}</p><p class="eje-org">${p.o}</p><p>${cita(p.p, p.f)}</p>`;
  if (anima) animarEje($('eje-svg'));
}

function elegir(clave, n = 0, anima = true) {
  if (!PRES[clave]) clave = 'toribio';
  s = nuevo(clave); paso = Math.min(Math.max(n | 0, 0), GUIAS[clave][1].length - 1); lup = PRES[clave].lup; vista = 'eje';
  pintar(anima);
}

// `origen`: la ficha de la que se entra, null desde un menú o el buscador, undefined desde otro modelo vivo.
export function abrir(estadoClave, origen) {
  if (origen !== undefined) marcarVolver($('eje-volver'), raiz, origen);
  const [clave, n] = String(estadoClave || '').split(':');
  elegir(clave, Number(n) ? Number(n) - 1 : 0);
  requestAnimationFrame(() => raiz.scrollIntoView({ block: 'start' }));
}

export function init() {
  raiz = $('eje-raiz');
  $('eje-chips').innerHTML = CLAVES_PACIENTE.map((c) => `<button type="button" class="b" data-pre="${c}" aria-pressed="false">${PRES[c].n}</button>`).join('');
  $('eje-chips').addEventListener('click', (e) => { const b = e.target.closest('[data-pre]'); if (b) elegir(b.dataset.pre); });
  raiz.querySelector('.eje-lupas').addEventListener('click', (e) => { const b = e.target.closest('[data-lup]'); if (b) { lup = b.dataset.lup; pintar(true); } });
  elegir('toribio', 0, false);
  return { abrir };
}

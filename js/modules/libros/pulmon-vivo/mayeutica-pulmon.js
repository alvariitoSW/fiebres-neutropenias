// La Mayéutica del pulmón vivo: guía socrática, examen, repaso y los casos de Isidro, Eulalia y Herminia. Son los enganches
// del motor común (core/mayeutica-motor.js, como shock-vivo/mayeutica-shock.js) con este modelo. Vive aparte de pagina.js: no
// toca su interior; pone el estado con el mismo enlace del modelo (`estado`, sin subir la página) y los mandos con los
// mismos controles del dock. Los datos (preguntas y casos) están en js/data/pulmon-vivo-mayeutica.js.
import { instalarCss } from '../../../core/dibujo-iso.js';
import { crearMayeuticaModelo } from '../../../core/mayeutica-motor.js';
import * as D from '../../../data/pulmon-vivo-data.js';
import { PREGUNTAS, CASOS, FICHAS } from '../../../data/pulmon-vivo-mayeutica.js';

const CSS = `
.pul-raiz .pmy-h { font-size: 1.04rem; margin: 0; color: var(--accent-yellow); font-weight: normal; }
.pul-raiz .pmy-cab-preg { display: flex; gap: 6px; align-items: baseline; flex-wrap: wrap; }
.pul-raiz .pmy-num { font: 700 .74rem var(--sans); color: var(--accent-yellow); border: 1px solid var(--accent-yellow); border-radius: 6px; padding: 1px 7px; }
.pul-raiz .pmy-tipo { font: 600 .66rem var(--sans); letter-spacing: .05em; text-transform: uppercase; color: var(--text-muted); }
.pul-raiz .pmy-serie { font: 700 .64rem var(--sans); letter-spacing: .05em; text-transform: uppercase; color: var(--bg-main); background: var(--text-dim); border-radius: 6px; padding: 1px 6px; }
.pul-raiz .pmy-serie.pmy-examen { background: var(--accent-red); color: var(--text-main); }
.pul-raiz .pmy-pregunta { font-size: .98rem; line-height: 1.45; }
.pul-raiz .pmy-op, .pul-raiz .pmy-fmt, .pul-raiz .pmy-res, .pul-raiz .pmy-mando { display: grid; gap: 6px; min-width: 0; }
.pul-raiz .pmy-op[hidden], .pul-raiz .pmy-mando[hidden] { display: none; }
.pul-raiz button.pmy-b, .pul-raiz button.pmy-frase-e { min-height: 44px; font: 600 .82rem/1.25 var(--sans); background: var(--card2); color: var(--text-main); border: 1px solid var(--line); border-radius: 10px; padding: 8px 11px; cursor: pointer; text-align: left; }
.pul-raiz button.pmy-frase-e { display: flex; gap: 8px; align-items: baseline; width: 100%; }
.pul-raiz button.pmy-b.pmy-prim { background: var(--accent-yellow); color: var(--bg-main); border-color: var(--accent-yellow); }
.pul-raiz button.pmy-b.pmy-link { background: transparent; color: var(--accent-yellow); }
.pul-raiz button.pmy-b:disabled, .pul-raiz button.pmy-frase-e:disabled { opacity: .7; cursor: default; }
.pul-raiz button.pmy-elegida-ok, .pul-raiz button.pmy-acierto { border-color: var(--accent-green); box-shadow: inset 3px 0 0 var(--accent-green); }
.pul-raiz button.pmy-elegida-mal, .pul-raiz button.pmy-fallo { border-color: var(--accent-red); box-shadow: inset 3px 0 0 var(--accent-red); }
.pul-raiz button.pmy-frase-e.pmy-marcada { border-color: var(--accent-yellow); background: color-mix(in srgb, var(--accent-yellow) 18%, var(--card2)); }
.pul-raiz .pmy-n { font: 700 .72rem var(--sans); color: var(--accent-yellow); flex: none; }
.pul-raiz .pmy-fila { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }
.pul-raiz .pmy-respuesta { background: var(--card2); border-radius: 10px; padding: 10px; display: grid; gap: 6px; font: .88rem/1.45 var(--serif); min-width: 0; }
.pul-raiz .pmy-respuesta p { margin: 0; }
.pul-raiz .pmy-ok { color: var(--accent-green); font: 600 .86rem var(--sans); }
.pul-raiz .pmy-mal { color: var(--accent-red); font: 600 .86rem var(--sans); }
.pul-raiz .pmy-para, .pul-raiz .pmy-pista, .pul-raiz .pmy-correccion { font: .8rem/1.45 var(--sans); color: var(--text-muted); }
.pul-raiz .pmy-correccion { color: var(--text-main); background: var(--card2); border-radius: 8px; padding: 6px 8px; }
.pul-raiz .pmy-nota-fuentes { font: .8rem/1.4 var(--sans); color: var(--text-muted); }
.pul-raiz .pmy-dia { font: 700 .72rem var(--sans); letter-spacing: .05em; text-transform: uppercase; color: var(--accent-purple); }
.pul-raiz dl.pmy-paciente { display: grid; grid-template-columns: auto 1fr; gap: 2px 10px; margin: 0; font: .8rem/1.35 var(--sans); background: var(--card2); border-radius: 10px; padding: 7px 9px; }
.pul-raiz dl.pmy-paciente dt { color: var(--text-muted); }
.pul-raiz dl.pmy-paciente dd { margin: 0; min-width: 0; }
.pul-raiz dl.pmy-paciente dd.pmy-cambia { color: var(--accent-red); font-weight: 600; }
.pul-raiz .pmy-nuevo { font: 700 .6rem var(--sans); text-transform: uppercase; border: 1px solid var(--accent-red); border-radius: 6px; padding: 0 4px; }
.pul-raiz .pmy-punto { display: flex; gap: 8px; align-items: flex-start; font: .86rem/1.4 var(--serif); min-height: 36px; }
.pul-raiz .pmy-punto input { width: 22px; height: 22px; flex: none; margin-top: 2px; }
.pul-raiz .pmy-ruta { display: grid; gap: 6px; font: .86rem/1.4 var(--sans); }
.pul-raiz .pmy-repaso-chips, .pul-raiz .pmy-casos-lista { display: grid; gap: 6px; }
.pul-raiz .pmy-casos-lista small { display: block; font-weight: 400; color: var(--text-muted); }
.pul-raiz ol.pmy-lleva { margin: 0; padding-left: 20px; display: grid; gap: 4px; font: .88rem/1.45 var(--serif); }
.pul-raiz .pmy-fila, .pul-raiz .pmy-respuesta, .pul-raiz .pmy-res, .pul-raiz .pmy-mando, .pul-raiz .pmy-lleva { scroll-margin-bottom: calc(var(--dock-h, 190px) + 14px); }
.pul-raiz button.pmy-b, .pul-raiz .pmy-consecuencia { scroll-margin-bottom: calc(var(--dock-h, 190px) + 14px); }
.pul-raiz .pmy-barra { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; margin: 4px 0 8px; }
.pul-raiz .pmy-pasos { display: flex; gap: 3px; flex-wrap: wrap; }
.pul-raiz .pmy-pasos i { width: 12px; height: 6px; border-radius: 3px; background: var(--line); display: block; }
.pul-raiz .pmy-pasos i.pmy-on { background: var(--accent-green); }
.pul-raiz .pmy-pasos i.pmy-mal { background: var(--accent-red); }
.pul-raiz .pmy-pasos i.pmy-aqui { box-shadow: 0 0 0 2px var(--accent-yellow); }
.pul-raiz .pmy-est { font: .72rem var(--sans); color: var(--text-muted); display: flex; gap: 8px; }
.pul-raiz .pmy-zona { display: grid; gap: 8px; min-width: 0; }
.pul-raiz .pmy-src { color: var(--text-muted); font: .72rem var(--sans); }
.pul-raiz dl.pmy-ad { display: grid; grid-template-columns: auto 1fr; gap: 2px 10px; margin: 0; font: .8rem/1.35 var(--sans); }
.pul-raiz dl.pmy-ad dd { margin: 0; }
.pul-raiz.pmy-vela #pul-monitor, .pul-raiz.pmy-vela #pul-calc { visibility: hidden; }
.pul-raiz .pmy-entra { animation: pmy-ent .25s ease-out; }
@keyframes pmy-ent { from { opacity: 0; } to { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .pul-raiz .pmy-entra { animation: none; } }
`;

const ESTADO_DE = { Isidro: 'sdra-rigido', Eulalia: 'eulalia-conectada', Herminia: 'psv-disparo' };
const pagTxt = (p) => (/[-,]/.test(String(p)) ? `pp. ${p}` : `p. ${p}`);
const coma = (v) => String(v).replace('.', ',');

// `h.estado(clave)` pone el estado del modelo (devuelve una promesa; no sube la página).
export function montarMayeutica(h) {
  const raiz = document.getElementById('pul-raiz'), destino = document.getElementById('pul-abajo');
  if (!raiz || !destino || document.getElementById('pmy-det')) return null;
  instalarCss('pmy', CSS);
  const det = document.createElement('details');
  det.className = 'plegable'; det.id = 'pmy-det';
  det.innerHTML = `<summary>Mayéutica: preguntas, examen y tres casos</summary>
    <div class="pmy-barra"><div class="pmy-pasos" id="pmy-dock-pasos"></div><div class="pmy-est"><span id="pmy-dock-est-izq"></span><span id="pmy-dock-est-der"></span></div></div>
    <div class="pmy-zona" id="pmy-zona"></div>`;
  destino.before(det);
  const zona = det.querySelector('#pmy-zona');
  const vela = (si) => raiz.classList.toggle('pmy-vela', !!si);

  // ---- citas: «Ver en la ficha» al párrafo y el PDF en su página
  function cita(c) {
    if (!c) return '';
    const [ubic, titulo, corto, pdf] = FICHAS[c.f], [esp, view, panel] = ubic || [];
    const btn = esp && c.id ? `<button type="button" class="cita-ir" data-especialidad="${esp}" data-view="${view}" data-panel="${panel}" data-tab="${c.f}" data-resaltar="#${c.id}" data-titulo="${titulo}" data-sitio="${c.sitio}">Ver en la ficha: ${corto} · ${c.sitio} →</button>` : '';
    const enlace = pdf && c.p != null ? `<a class="cita-pdf" href="${pdf}#page=${String(c.p).match(/\d+/)[0]}" target="_blank" rel="noopener">${esp ? '' : c.sitio + ' · '}PDF, ${pagTxt(c.p)}</a>` : '';
    return `<span class="cita">${btn}${enlace}</span>`;
  }
  const org = (t) => `<span class="org ilu">${t}</span>`;

  // ---- el modelo: estado y mandos, en cola para que dos preguntas seguidas no se pisen
  let cola = Promise.resolve();
  function mando(k, v) {
    const buscar = () => document.querySelector(`#pul-dock-panel input[data-m="${k}"]`);
    let d = buscar();
    for (const t of ['resp', 'pulmon', 'man']) { if (d) break; document.querySelector(`#pul-dock-tabs [data-pest="${t}"]`)?.click(); d = buscar(); }
    if (!d) return;
    d.value = v; d.dispatchEvent(new Event('input', { bubbles: true }));
  }
  const aplicar = (mandos) => { for (const [k, v] of Object.entries(mandos || {})) mando(k, v); };
  function poner(m) {
    if (!m || !m.estado) return cola;
    cola = cola.then(async () => { await h.estado(m.estado); aplicar(m.mandos); }).catch(() => {});
    return cola;
  }
  const enRepaso = () => May.fase === 'repaso';
  function subir() {
    const r = det.getBoundingClientRect(); if (r.top < 0 || r.top > innerHeight * 0.6) scrollBy({ top: r.top - 8, behavior: 'auto' });
  }

  // ---- casos: la ficha del paciente se rellena con lo que el monitor enseña en ese momento (cifras copiadas de la app)
  const CASOS_V = CASOS.map((C) => {
    let previo = {};
    return { ...C, hueco: 'Fuentes: Marino 2024, caps. 22-28; Libro azul IV. Los pacientes se inventan; las cifras del respirador salen del modelo.',
      pasos: C.pasos.map((p, i) => {
        const datos = Object.fromEntries(p.ficha), nuevo = i === 0 ? [] : Object.keys(datos).filter((k) => previo[k] !== datos[k]);
        previo = { ...previo, ...datos };
        return { ...p, datos, nuevo };
      }) };
  });

  const May = crearMayeuticaModelo({
    p: 'pmy', cont: () => zona, clave: 'pulmon-vivo-mayeutica-v1', preguntas: PREGUNTAS, casos: CASOS_V,
    subir, volverPor: 'El pulmón con respirador',
    reiniciar: () => vela(false),
    pregunta: {
      alEmpezar: (q) => {
        if (q.modelo) poner(q.modelo);
        vela(q.predice && !enRepaso());
        if (q.org) q.explicacion = (q.explicacion || '') + ' ' + org(q.org);
        if (q.puntosOrg) q.puntos = q.puntos.map((t, i) => t + (q.puntosOrg[i] ? ' ' + org(q.puntosOrg[i]) : ''));
        if (q.frases) q.frases = q.frases.map((f) => (f.mal ? { ...f, c: `<span class="hl-verde">${f.c}</span> ${cita(f.fuente)}` } : f));
      },
      verEnTexto: (q) => {
        const vistas = new Set();
        const citas = [].concat(q.fuente || []).filter(Boolean).filter((c) => { const k = c.f + c.id + c.p; if (vistas.has(k)) return false; vistas.add(k); return true; });
        return citas.map(cita).join('') + (q.comprobar && !enRepaso() ? `<div class="pmy-fila"><button type="button" class="pmy-b pmy-prim" data-comprueba="1">${q.comprobar.txt}</button></div>` : '');
      },
      alCerrar: (q) => { if (!q.comprobar || enRepaso()) vela(false); },
      alSalir: () => vela(false),
      alClic: (e, q) => {
        const b = e.target.closest('button'); if (!b) return false;
        if (b.dataset.verMonitor) { document.getElementById('pul-monitor').scrollIntoView({ block: 'start', behavior: 'auto' }); return true; }
        if (!b.dataset.comprueba) return false;
        const c = q.comprobar; vela(false); aplicar(c.mandos);
        const filas = (c.cifras || []).map(([et, , a, d]) => `<dt>${et}</dt><dd>${coma(a)} → <b>${coma(d)}</b></dd>`).join('');
        b.closest('.pmy-fila').outerHTML = `<p class="pmy-para"><span class="pmy-ok">Mira el modelo:</span> ${c.mira}</p>${filas ? `<dl class="pmy-ad">${filas}</dl>` : ''}<div class="pmy-fila"><button type="button" class="pmy-b" data-ver-monitor="1">Ver el monitor</button></div>`;
        return true;
      },
    },
    textos: {
      ruta: (nG, nE) => `<span><b>1. Guía socrática</b> (${nG}): predices, destapas y lo compruebas en el modelo.</span>
        <span><b>2. Examen, nivel MIR</b> (${nE}): distractores finos que salen de las fichas.</span>
        <span><b>3.</b> Otra vez lo que fallaste, solo eso.</span>
        <span><b>4.</b> Tres pacientes que evolucionan: Isidro, Eulalia y Herminia.</span>`,
      empezar: 'Empezar la guía socrática', seguir: 'Seguir',
      pie: 'Cada pregunta pone el monitor y el respirador en el estado de su pregunta; las cifras se destapan al contestar. Los pacientes se inventan; la medicina sale de las fichas de Merino Neumología (Marino 2024), y cada respuesta dice dónde.',
      conModelo: 'el monitor', casos: 'El respirador se pone en el estado de cada paso antes de la pregunta. Lo nuevo de la ficha del paciente sale en rojo.',
      abrirPaciente: 'Abrir el modelo con este paciente',
    },
    preguntaDePaso: () => ({}),
    alTerminarCaso: () => vela(false),
    abrirPaciente: (C) => { poner({ estado: ESTADO_DE[C.corto] || 'normal-vcv' }); raiz.scrollIntoView({ block: 'start' }); },
  });
  let abierta = false;
  det.addEventListener('toggle', () => { if (det.open && !abierta) { abierta = true; May.cargar(); May.entrar(); } if (!det.open) vela(false); });
  return { May, CASOS_V, D };
}

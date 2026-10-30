// Atlas de ecocardiografía: The Heart by Ultrasound (David Ouyang) en español, dentro de Eco cardíaca.
//
// - El índice lista los 30 capítulos del original en su orden. Los que ya están en la app (CAPITULOS) se abren aquí,
//   traducidos y con su figura reconstruida sobre los motores de la app; el resto enlaza al original en inglés.
// - Cada capítulo es un fragmento HTML propio (cap-*.html), que se pide la primera vez que se abre, y una figura
//   (módulo *.mjs con montar(contenedor) → { parar() }), que se importa al abrirlo y se para al salir.
// - Las citas <sup class="at-cita" data-ref="clave[,clave]"> se numeran por orden de aparición y la bibliografía del
//   capítulo se pinta al pie con REFERENCIAS (las mismas del original, con DOI).
// - Nada del código del original: solo su texto, traducido, con permiso del autor y citado.
import { ATLAS_PARTES, atlasUrl, ATLAS_URL, ATLAS_REPO } from '../atlas-ouyang.js';
import { REFERENCIAS } from './referencias.js';
import { conVersion } from '../../../core/include.js';

const BASE = 'js/modules/eco/atlas/';
/** Capítulos ya en la app: fragmento, figura y subtítulo (el título y el número salen de ATLAS_PARTES).
 *  Sin `figura`, el capítulo solo tiene el texto (fase A): su fragmento lleva el aviso .at-en-preparacion y no hay
 *  «Repasar este capítulo» hasta que tenga preguntas. */
export const CAPITULOS = {
  pulse: { html: 'cap-pulso.html', figura: () => import('./pulso.mjs'), sub: 'El principio pulso-eco' },
  image: { html: 'cap-imagen.html', figura: () => import('./imagen.mjs'), sub: 'Formación de la imagen y artefactos' },
  shift: { html: 'cap-doppler.html', figura: () => import('./efecto-doppler.mjs'), sub: 'El efecto Doppler' },
  cycle: { html: 'cap-ciclo.html', figura: () => import('./ciclo.mjs'), sub: 'El ciclo cardíaco, con el motor de la app' },
  loop: { html: 'cap-asa.html', figura: () => import('./asa.mjs'), sub: 'Análisis presión-volumen del VI, con el motor de la app' },
  pressure: { html: 'cap-hemodinamica.html', figura: () => import('./hemodinamica.mjs'), sub: 'Flujo, presión y la VCI, con el motor de la app' },
  eject: { html: 'cap-sistolica.html', figura: () => import('./sistolica.mjs'), sub: 'Volúmenes del VI por discos sobre el corazón de la app' },
  fill: { html: 'cap-diastolica.html', figura: () => import('./diastolica.mjs'), sub: 'Del llenado normal al restrictivo, con el motor de la app' },
  rv: { html: 'cap-vd.html', figura: () => import('./vd.mjs'), sub: 'Sobrecarga de presión, de volumen y TEP agudo, con el motor de la app' },
  ar: { html: 'cap-ar.html', sub: 'De leve a grave con disfunción del VI: graduación integrada y estadios' },
  segments: { html: 'cap-segments.html', sub: 'Los 17 segmentos, el índice de contractilidad y los territorios de la DA, la CD y la Cx' },
  peri: { html: 'cap-peri.html', sub: 'Del derrame al taponamiento; constricción frente a miocardiopatía restrictiva' },
  as: { html: 'cap-as.html', sub: 'De normal a grave y la de bajo flujo y bajo gradiente' },
  tr: { html: 'cap-tr.html', sub: 'De leve a torrencial: vena contracta, ORE (EROA) y flujo suprahepático' },
  ms: { html: 'cap-ms.html', sub: 'Reumática de leve a grave: planimetría, tiempo de hemipresión y gradiente con la frecuencia' },
  stress: { html: 'cap-stress.html', sub: 'Dobutamina en cuatro pantallas: isquemia, cicatriz y viabilidad' },
  strain: { html: 'cap-strain.html', sub: 'Strain longitudinal global por speckle tracking; patrones y cardio-oncología' },
  hcm: { html: 'cap-hcm.html', sub: 'De normal a obstrucción en reposo; SAM, Valsalva y el chorro en daga' },
  amyloid: { html: 'cap-amyloid.html', sub: 'Pared gruesa, signo 5-5-5, respeto apical y los criterios de la ESC 2021' },
  aorta: { html: 'cap-aorta.html', sub: 'Medir la raíz, umbrales quirúrgicos, colgajo de disección y criterios de coartación' },
  windows: { html: 'cap-windows.html', sub: 'Las cuatro ventanas, los movimientos de la sonda y qué se mide en cada vista' },
  shunts: { html: 'cap-shunts.html', sub: 'CIA, CIV y FOP: Qp/Qs, cuándo cerrar, suero agitado y la presión de la AI por el septo' },
  masses: { html: 'cap-masses.html', sub: 'Mixoma de la AI, trombo del VI y fibroelastoma: describir la masa, falsos positivos y el contraste' },
  endocarditis: { html: 'cap-endocarditis.html', sub: 'Criterios de imagen, ETT y ETE, vegetación y embolia, cirugía a los 10 mm y perforación con IM aguda' },
  mi: { html: 'cap-mi.html', sub: 'Rotura septal, papilar y de pared libre, pseudoaneurisma frente a aneurisma verdadero e infarto del VD' },
};
const ORDEN = ATLAS_PARTES.flatMap(p => p.caps.map(c => c[0]));
const EN_APP = ORDEN.filter(k => CAPITULOS[k]);
const DATOS = Object.fromEntries(ATLAS_PARTES.flatMap(p => p.caps.map(([k, n, t, r]) => [k, { n, t, r, parte: p.parte }])));
export const enApp = (k) => !!CAPITULOS[k];

const cache = {};
async function fragmento(k) {
  if (!cache[k]) cache[k] = fetch(conVersion(BASE + CAPITULOS[k].html)).then(r => { if (!r.ok) throw new Error(r.status); return r.text(); });
  return cache[k];
}

function citas(cuerpo) {
  const orden = [];
  cuerpo.querySelectorAll('sup.at-cita').forEach(s => {
    const nums = s.dataset.ref.split(',').map(k => k.trim()).filter(k => REFERENCIAS[k]).map(k => {
      if (!orden.includes(k)) orden.push(k);
      return orden.indexOf(k) + 1;
    });
    s.innerHTML = nums.length ? `[${nums.map(n => `<a href="#at-ref-${n}" data-at-ref="${n}">${n}</a>`).join(',')}]` : '';
  });
  return orden;
}

export function initAtlas({ alAbrirSimulador } = {}) {
  const sec = document.getElementById('cv-seccion-atlas'), indice = document.getElementById('at-indice'), cap = document.getElementById('at-capitulo');
  if (!sec) return { abrir() {} };
  let figura = null, actual = null, peticion = 0;

  document.getElementById('cv-atlas-abrir').href = ATLAS_URL;
  document.getElementById('cv-atlas-repo').href = ATLAS_REPO;
  document.getElementById('cv-atlas-lista').innerHTML = ATLAS_PARTES.map(p => `
    <p class="cv-atlas-parte">${p.parte}</p>
    <ul class="cv-atlas-lista">${p.caps.map(([k, n, t, r]) => CAPITULOS[k]
      ? `<li class="at-en-app"><button type="button" data-at-cap="${k}"><b>${n}</b> ${t}</button><span>${r}</span></li>`
      : `<li><a href="${atlasUrl(k)}" target="_blank" rel="noopener"><b>${n}</b> ${t} ↗</a><span>${r} <i>Aún solo en el original, en inglés.</i></span></li>`).join('')}
    </ul>`).join('');
  document.getElementById('at-cuenta').textContent = `${EN_APP.length} de ${ORDEN.length} capítulos ya en español en la app`;

  function verIndice() {
    figura?.parar(); figura = null; actual = null;
    cap.hidden = true; indice.hidden = false;
  }

  async function abrir(k) {
    if (!CAPITULOS[k]) return;
    const yo = ++peticion;
    figura?.parar(); figura = null; actual = k;
    indice.hidden = true; cap.hidden = false;
    const d = DATOS[k];
    document.getElementById('at-num').textContent = d.n;
    document.getElementById('at-titulo').textContent = d.t;
    document.getElementById('at-subtitulo').textContent = `${d.parte} · ${CAPITULOS[k].sub}`;
    document.getElementById('at-original').href = atlasUrl(k);
    const repaso = document.getElementById('btn-eco-atlas-repasar');
    repaso.dataset.quizTema = `atlas-${k}`;
    repaso.hidden = !CAPITULOS[k].figura;
    const cuerpo = document.getElementById('at-cuerpo');
    cuerpo.innerHTML = '<p class="cv-cargando">Cargando el capítulo…</p>';
    let html;
    try { html = await fragmento(k); } catch (e) {
      cuerpo.innerHTML = '<p class="cv-cargando">No se pudo cargar el capítulo. Comprueba la conexión.</p>'; console.error('[atlas]', e); return;
    }
    if (yo !== peticion) return;
    cuerpo.innerHTML = html;
    const refs = citas(cuerpo);
    document.getElementById('at-biblio').innerHTML = refs.map((r, i) => {
      const x = REFERENCIAS[r], enlace = x.doi ? `https://doi.org/${x.doi}` : x.url;
      return `<li id="at-ref-${i + 1}">${x.t}${enlace ? ` <a class="biblio-link" href="${enlace}" target="_blank" rel="noopener">${x.doi ? 'DOI' : 'Enlace'} ↗</a>` : ''}</li>`;
    }).join('');
    const i = EN_APP.indexOf(k), ant = EN_APP[i - 1], sig = EN_APP[i + 1];
    const bAnt = document.getElementById('at-anterior'), bSig = document.getElementById('at-siguiente');
    bAnt.hidden = !ant; bSig.hidden = !sig;
    if (ant) { bAnt.dataset.atCap = ant; bAnt.textContent = `← ${DATOS[ant].n} ${DATOS[ant].t}`; }
    if (sig) { bSig.dataset.atCap = sig; bSig.textContent = `${DATOS[sig].n} ${DATOS[sig].t} →`; }
    cap.scrollIntoView({ block: 'start' });
    const fig = cuerpo.querySelector('.at-figura');
    if (fig && CAPITULOS[k].figura) {
      try {
        const mod = await CAPITULOS[k].figura();
        if (yo !== peticion) return;
        figura = mod.montar(fig);
      } catch (e) { fig.innerHTML = '<p class="cv-muted">No se pudo cargar la figura.</p>'; console.error('[atlas] figura', e); }
    }
  }

  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-at-cap]');
    if (b && sec.contains(b)) { e.preventDefault(); abrir(b.dataset.atCap); return; }
    const s = e.target.closest('[data-at-sim]');
    if (s && sec.contains(s)) { alAbrirSimulador?.(s.dataset.atSim); return; }
    const r = e.target.closest('[data-at-ref]');
    if (r && sec.contains(r)) { e.preventDefault(); document.getElementById(`at-ref-${r.dataset.atRef}`)?.scrollIntoView({ block: 'center' }); }
  });
  document.getElementById('at-volver-indice').addEventListener('click', () => { verIndice(); sec.scrollIntoView({ block: 'start' }); });

  return {
    abrir,
    verIndice,
    /** Al salir de la sección del atlas, la figura se para (las figuras con motor siguen pesando aunque no se vean). */
    ocultar() { figura?.parar(); figura = null; },
    /** Al volver, vuelve a montar la figura del capítulo que estaba abierto. */
    mostrar() { if (actual && !cap.hidden && !figura) abrir(actual); },
    get actual() { return actual; },
  };
}

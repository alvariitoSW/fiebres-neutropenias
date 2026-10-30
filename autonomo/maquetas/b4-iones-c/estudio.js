// Estudiar con el modelo: una apuesta (primero predices, luego compruebas), un «encuentra el error» sobre la escena y un caso de Damián.
import { cita } from './datos.js';

const APUESTA = {
  pac: 'damian',
  enun: 'Damián, 52 años, alcohólico desnutrido, llega con K⁺ 3,6 y empieza nutrición parenteral. ¿Qué pasa con su K⁺ sérico en las próximas horas?',
  ops: [
    { t: 'Sube: la glucosa y los nutrientes llevan potasio y lo reponen.', ok: false, why: 'Si lo crees, no vigilas el K⁺: baja a 3,0 y con otras causas de arritmia (isquemia, QT largo) el riesgo se suma (p. 22).' },
    { t: 'Baja: la insulina de la glucosa lo mete en la célula, aunque el cuerpo no pierda potasio.', ok: true, why: 'La insulina activa la bomba Na⁺-K⁺ del músculo (p. 28) y la glucosa arrastra fosfato; el suero baja con el total intacto (p. 49).' },
    { t: 'Igual: el potasio total del cuerpo no cambia, así que el suero tampoco.', ok: false, why: 'El total no cambia, pero el suero es solo el 2 %: si no lo repones esperando que «no baje», aparece una hipopotasemia que no vigilabas (p. 19).' },
  ],
};
const ERRORES = [
  { t: 'Ca total 7,2 con albúmina 2: hipocalcemia grave, pongo calcio.', err: true, why: 'Una albúmina baja reduce el calcio total sin tocar el iónico, que es el activo; las fórmulas de corrección no son fiables: se mide el iónico (p. 43). Con el calcio puesto de más, se sobredosifica a un paciente normocalcémico.', prueba: 'alb' },
  { t: 'En Rufino el K⁺ no sube con ClK a 20 mEq/h: antes de subir la dosis, miro el Mg²⁺.', err: false, why: 'Con Mg bajo el riñón pierde K⁺ y la hipopotasemia resiste a la reposición hasta que se repone el Mg (p. 21 y 23).', prueba: 'rufino' },
  { t: 'Adela tiene hiperK con el ECG ensanchado: pongo cloruro cálcico porque es más potente.', err: true, why: 'Se usa gluconato (9 mg/mL); el cloruro (27 mg/mL, el triple) se reserva para el colapso circulatorio o la parada (p. 26). Un bolo grande por vena periférica irrita la vena.', prueba: 'cl' },
];
const html = a => a.join('');
export function montarEstudio({ api, $, frase }) {
  const M = api.M, cuerpo = $('est-cuerpo'); let modo = 'apuesta', paso = 0, marcas = new Set(), resp = {}, hecho = {};
  const pintarOps = (ops, sel, rev) => ops.map((o, i) => `<button type="button" class="est-op ${rev ? (o.ok ? 'bien' : sel === i ? 'mal' : '') : ''}" data-op="${i}" ${rev ? 'disabled' : ''}>${o.t}${rev && (sel === i || o.ok) ? `<br><small>${o.ok ? '✔ ' : '✘ '}${o.why}</small>` : ''}</button>`).join('');
  const salir = () => { api.ocultarK(false); };

  function apuesta() {
    api.cargar(APUESTA.pac); api.ocultarK(true); resp = {}; hecho = {};
    cuerpo.innerHTML = `<div class="est-box"><p><b>Apuesta.</b> ${APUESTA.enun}</p><div id="ap-ops">${pintarOps(APUESTA.ops, -1, false)}</div><p id="ap-res" class="pie"></p></div>`;
    $('ap-ops').onclick = e => {
      const b = e.target.closest('[data-op]'); if (!b || resp.sel != null) return; resp.sel = +b.dataset.op;
      $('ap-ops').innerHTML = pintarOps(APUESTA.ops, resp.sel, false);
      $('ap-res').innerHTML = `Ahora compruébalo: pulsa <b>Realimentar (nutrición)</b> en las bombas. Verás el K⁺ cuando lo hagas. ${cita(28)}`;
      frase('Apuesta hecha. Pulsa «Realimentar» y pasa 6 horas con el reloj.');
      ap_esperar();
    };
  }
  function ap_esperar() {
    const f = () => {
      if (!api.s.nutriOn || api.s.min < 360) { if (api.s.nutriOn && api.s.min < 360) $('ap-res').textContent = 'Pasa 6 horas con «+6 h» del reloj para ver el efecto.'; return; }
      window.removeEventListener('iones:cambio', f); api.ocultarK(false);
      const L = api.lect(), k0 = api.s.p.k, ok = APUESTA.ops[resp.sel].ok;
      $('ap-ops').innerHTML = pintarOps(APUESTA.ops, resp.sel, true);
      $('ap-res').innerHTML = `<b>${ok ? 'Acertaste.' : 'No era esa.'}</b> K⁺ ${k0.toFixed(1).replace('.', ',')} → ${L.k.toFixed(1).replace('.', ',')}; fosfato ${api.s.p.po4.toFixed(1).replace('.', ',')} → ${L.po4.toFixed(1).replace('.', ',')}; Mg²⁺ ${api.s.p.mg.toFixed(1).replace('.', ',')} → ${L.mg.toFixed(1).replace('.', ',')} (cifras ilustrativas, dirección de la ficha). ${cita(49)}`;
      resp.fin = ok ? 'ok' : 'mal';
    };
    window.addEventListener('iones:cambio', f);
  }
  function error() {
    marcas = new Set(); resp = {};
    cuerpo.innerHTML = `<div class="est-box"><p><b>Encuentra el error.</b> Puede haber ninguno, uno o dos. Marca los que están mal.</p>${ERRORES.map((e, i) => `<button type="button" class="est-op" data-er="${i}" aria-pressed="false">${e.t}</button>`).join('')}<div class="fila"><button type="button" id="er-ok">Comprobar</button></div><div id="er-res"></div></div>`;
    cuerpo.onclick = e => {
      const b = e.target.closest('[data-er]');
      if (b && !resp.fin) { const i = +b.dataset.er; marcas.has(i) ? marcas.delete(i) : marcas.add(i); b.setAttribute('aria-pressed', String(marcas.has(i))); return; }
      const p = e.target.closest('[data-prueba]'); if (p) return probar(p.dataset.prueba);
      if (e.target.id === 'er-ok' && !resp.fin) {
        resp.fin = true; let bien = 0;
        $('er-res').innerHTML = ERRORES.map((x, i) => { const m = marcas.has(i), ok = m === x.err; bien += ok; return `<p class="est-box"><b>${ok ? '✔' : '✘'} ${x.err ? 'Era un error' : 'Estaba bien'}.</b> ${x.why} ${cita(/p\. (\d+)/.exec(x.why)?.[1])} <button type="button" data-prueba="${x.prueba}">Pruébalo en la escena</button></p>`; }).join('') + `<p><b>${bien} de ${ERRORES.length}.</b></p>`;
        resp.bien = bien;
      }
    };
  }
  function probar(que) {
    if (que === 'alb') { api.cargar('damian'); api.s.alb = 2.0; api.repintar(); frase('Albúmina 2: el Ca total cae a 7,7 y el iónico sigue en 1,12. Abre la lupa para ver la Fig. 38.1.', 43); }
    else if (que === 'rufino') { api.cargar('rufino'); api.acc.clkTasa(20); api.acc.clk(); api.avanzar(480); frase('Rufino, 8 h de ClK a 20 mEq/h con Mg bajo: el K⁺ casi no sube. Con Mg normal, sube más.', 23); }
    else { api.cargar('adela'); api.acc.cl(); api.repintar(); frase('Cloruro: 270 mg de golpe; el tope del bolo es 200 mg. Para la hiperK, 10 mL de gluconato (90 mg).', 26); }
    window.dispatchEvent(new CustomEvent('iones:cambio'));
  }

  // ---- Caso: Damián, 4 pasos. Cada paso: una pregunta y algo que hacer en las bombas; las cifras salen del modelo. ----
  const f1 = x => x.toFixed(1).replace('.', ',');
  const PASOS = [
    { q: () => `Damián, 52 años, ingresó desnutrido tras 2 días de vómitos. Hoy empieza nutrición parenteral rica en glucosa: K⁺ ${f1(api.s.p.k)}, Mg²⁺ ${f1(api.s.p.mg)}, fosfato ${f1(api.s.p.po4)}. ¿Qué electrolito vigilas con más cuidado?`,
      ops: [{ t: 'El sodio: la glucosa lo diluye y baja.', ok: false, why: 'Mirar solo el sodio deja pasar la hipofosfatemia, que es la que acaba en insuficiencia respiratoria (p. 49).' }, { t: 'El fosfato: la glucosa lo arrastra a la célula y se agota en 2 días.', ok: true, why: 'Es la causa más frecuente de hipofosfatemia en el hospital y base del síndrome de realimentación (p. 49).' }, { t: 'El calcio total: la glucosa lo quela.', ok: false, why: 'La glucosa no quela calcio; mirarlo no evita que el fosfato caiga (p. 49).' }],
      hacer: 'Pulsa «Realimentar» y pasa 24 h (+6 h cuatro veces).', ok: () => api.s.nutri > 0.9 && api.s.min >= 1440 },
    { q: () => `Tras un día de nutrición: K⁺ ${f1(api.lect().k)}, Mg²⁺ ${f1(api.lect().mg)}, fosfato ${f1(api.lect().po4)} mg/dL. Se queja de disnea y debilidad. ¿Qué repones primero?`,
      ops: [{ t: 'Solo ClK a 20 mEq/h: el K⁺ es lo más bajo.', ok: false, why: 'El fosfato <1 mg/dL es el grave y falla el músculo respiratorio: reponer solo K⁺ no lo arregla (p. 50-51).' }, { t: 'Fosfato IV según el peso (61-80 kg, <1 mg/dL: 40 mmol).', ok: true, why: 'Tabla 38.5 (p. 51): para <1 mg/dL, 40 mmol si pesa 61-80 kg; con K⁺ <4 va el de potasio.' }, { t: 'Nada: la hipofosfatemia suele ser asintomática.', ok: false, why: 'Suele serlo, pero con disnea y fosfato <1 la ficha recomienda reponer siempre (p. 51).' }],
      hacer: 'Pulsa «Fosfato IV · 40 mmol».', ok: () => api.s.po4X > 0.5 },
    { q: () => `Mg²⁺ ${f1(api.lect().mg)} mEq/L con el fosfato y el K⁺ también bajos (hipomagnesemia moderada). ¿Qué protocolo?`,
      ops: [{ t: '2 g en 5 min y nada más.', ok: false, why: 'Ese bolo es para torsade o convulsiones (p. 37); en moderada el Mg sube y a los 15 min vuelve a caer, sin reponer el depósito.' }, { t: '6 g de MgSO₄ en 3 h, y seguir con 5 g cada 12 h.', ok: true, why: 'Moderada (<1 mEq/L o con otras alteraciones): 6 g en 3 h, después 5 g/6 h y 5 g/12 h (p. 37).' }, { t: 'Magnesio oral, que es lo más seguro.', ok: false, why: 'En la UCI la absorción digestiva es errática: se usa la vía IV (p. 36).' }],
      hacer: 'Pulsa «6 g en 3 h» en el magnesio y pasa 3 h (+1 h tres veces).', ok: () => !api.s.bombas.mg.on && api.s.Dm < (1.7 - api.s.p.mg) * 150 - 20 },
    { q: () => `Al acabar la perfusión el Mg²⁺ sérico marca ${f1(api.lect().mg)} mEq/L y mejora. Un compañero quiere dejarla ahí y no seguir. ¿Qué haces?`,
      ops: [{ t: 'La paro: el Mg sérico ya es normal.', ok: false, why: 'El Mg sérico se corrige antes de llenarse los depósitos (días); si paras, vuelve a caer (p. 38-39).' }, { t: 'La sigo: los depósitos tardan días y el suero engaña.', ok: true, why: 'Se normaliza en 1-2 días, pero los depósitos tardan varios días en llenarse (p. 38).' }, { t: 'La subo al doble para ir más rápido.', ok: false, why: 'La mitad se pierde por la orina; más dosis es más pérdida y, con riñón que falla, riesgo de Mg alto (p. 37-39).' }],
      hacer: 'Sin más magnesio, pasa 12 h (+6 h dos veces) y mira cómo vuelve a caer el Mg²⁺.', ok: () => api.s.min >= inicio + 720 },
  ];
  function caso() {
    api.cargar('damian'); paso = 0; resp = {}; pasoVista();
  }
  function pasoVista() {
    const P = PASOS[paso]; resp = { sel: null, ok: false }; const inicio = api.s.min;
    const refrescar = () => {
      const hechoAcc = P.ok();
      $('cs-hacer').innerHTML = `<span class="${hechoAcc ? 'listo' : 'falta'}">${hechoAcc ? '✔' : '○'} ${P.hacer}</span>`;
      const fin = resp.sel != null && hechoAcc;
      $('cs-sig').hidden = !fin;
      if (fin && paso === PASOS.length - 1) $('cs-sig').textContent = 'Terminar el caso';
    };
    cuerpo.innerHTML = `<div class="est-box"><p class="pie">Caso · Damián · paso ${paso + 1} de ${PASOS.length}</p><p>${P.q()}</p><div id="cs-ops">${pintarOps(P.ops, -1, false)}</div><p id="cs-hacer"></p><div class="fila"><button type="button" id="cs-sig" hidden>Siguiente paso</button></div><div id="cs-fin"></div></div>`;
    $('cs-ops').onclick = e => { const b = e.target.closest('[data-op]'); if (!b || resp.sel != null) return; resp.sel = +b.dataset.op; $('cs-ops').innerHTML = pintarOps(P.ops, resp.sel, true); refrescar(); };
    $('cs-sig').onclick = () => { if (paso < PASOS.length - 1) { paso++; pasoVista(); } else { $('cs-fin').innerHTML = '<p class="listo"><b>Caso terminado.</b> Lo que te llevas: la glucosa vacía el suero de fosfato, Mg y K⁺; el Mg sérico normal no es un depósito lleno.</p>'; $('cs-sig').hidden = true; resp.terminado = true; } };
    window.addEventListener('iones:cambio', refrescar); refrescar();
  }
  const MODOS = { apuesta, error, caso };
  function ir(m) { modo = m; cuerpo.onclick = null; salir(); document.querySelectorAll('[data-est]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.est === m))); MODOS[m](); }
  document.querySelectorAll('[data-est]').forEach(b => b.addEventListener('click', () => ir(b.dataset.est)));
  api.estudio = { ir, get resp() { return resp; }, PASOS, APUESTA, ERRORES, get paso() { return paso; } };
}

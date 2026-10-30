// Prueba de navegador del corazón eléctrico (juez de autonomo/jueces.mjs --modelo ritmo-vivo). Parte 2: también la Mayéutica (las 10 preguntas acertando y fallando, el repaso y el caso de Teodoro entero).
// Uso: node autonomo/pruebas/ritmo-vivo.mjs <url-base> [--capturas <carpeta>]
// Recorre a 390 px (con movimiento) y a 360 px (con «reducir movimiento»), cada uno en un contexto limpio: accesos (menú de
// Libros y los 4 botones de Merino Cardiología, cada uno en su estado, con su «← VOLVER» a la ficha), todos los estados con
// sus cifras (nunca un FC 0 ni NaN), el FC tras cada choque y tras la adenosina (el «FC 0» del juicio previo), cada
// mando a su tope (adenosina, vagales, diltiazem, choques de la TV, verapamilo, magnesio, parada: adrenalina, amiodarona,
// refractaria y 30 min) con su sello a la vista y SIN cortarse, cada explicación guiada con su «Ver en la ficha» a un
// párrafo que existe, la familia «Lentos» sin cifras, medir, pausa, el bucle que se para al salir y los ids sin duplicar.
// Mide el desborde lateral (0 px) tras cada paso. Sale con código 1 si algo falla.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const { ESTADOS, GUIAS, C, FICHAS } = await import(new URL('../../js/data/ritmo-vivo-data.js', import.meta.url));
const { PREGUNTAS, CASOS } = await import(new URL('../../js/data/ritmo-vivo-preguntas.js', import.meta.url));
const args = process.argv.slice(2);
const BASE = (args.find(a => /^https?:/.test(a)) || 'http://localhost:8000/').replace(/\/?$/, '/');
const CAPTURAS = args.includes('--capturas') ? args[args.indexOf('--capturas') + 1].replace(/\/?$/, '/') : null;
const b = await chromium.launch();
const fallosTotales = [];

async function correr(ANCHO, REDUCIDO) {
  const tag = `${ANCHO}${REDUCIDO ? '-red' : ''}`;
  console.log(`\n── ${ANCHO} px${REDUCIDO ? ' · reducir movimiento' : ''}`);
  const ctx = await b.newContext({ viewport: { width: ANCHO, height: 844 }, deviceScaleFactor: 2, reducedMotion: REDUCIDO ? 'reduce' : 'no-preference' });
  const p = await ctx.newPage();
  const errores = [], fallos = [];
  p.on('console', m => { if (m.type() === 'error' && !/favicon/.test(m.text())) errores.push(m.text()); });
  p.on('pageerror', e => errores.push('PAGE ' + e.message));
  const ok = (c, t) => { console.log(`${c ? '✅' : '❌'} ${t}`); if (!c) fallos.push(t); };
  const desborde = () => p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  const foto = n => CAPTURAS ? p.screenshot({ path: CAPTURAS + 'rtv-' + n + '-' + tag + '.png' }) : null;
  const abrir = (est = '') => p.evaluate(e => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'ritmoVivo', ritmoVivo: e }); document.body.append(t); t.click(); t.remove(); }, est);
  const R = (f, ...a) => p.evaluate(([f, a]) => { const r = window.__ritmo; const v = typeof r[f] === 'function' ? r[f](...a) : r[f]; return v === undefined ? null : v; }, [f, a]);
  const espera = ms => p.waitForTimeout(REDUCIDO ? Math.min(ms, 250) : ms);
  const acc = async (a, n = 1) => { let hits = 0; for (let i = 0; i < n; i++) { if (a.startsWith('ade')) await p.evaluate(() => window.__ritmo.avanzarHasta(window.__ritmo.mo.m.cerrojoFin + 0.2)); hits += await p.evaluate(a => { const x = document.querySelector(`#rtv-dock-panel [data-acc="${a}"]`); if (!x || x.disabled) return 0; x.click(); return 1; }, a); await R('avanzarHasta', (await R('simT')) + (/^(cv|choque|desf)/.test(a) ? 3.5 : 0.8)); await espera(120); } return hits; };
  const pestana = t => p.evaluate(t => document.querySelector(`.rtv-dock-tabs [data-pest="${t}"]`).click(), t);
  const sellos = () => p.evaluate(() => [...document.querySelectorAll('#rtv-monitor .tope-sello')].map(s => ({ clave: s.dataset.tope, ancho: s.scrollWidth - s.clientWidth, caja: s.getBoundingClientRect().right <= document.querySelector('#rtv-monitor').getBoundingClientRect().right + 1 && s.getBoundingClientRect().left >= document.querySelector('#rtv-monitor').getBoundingClientRect().left - 1, txt: s.textContent.replace(/\s+/g, ' ').slice(0, 90) })));
  const cifras = () => p.evaluate(() => [...document.querySelectorAll('#rtv-mon-cifras .cifra')].map(c => c.innerText.replace(/\s+/g, ' ').trim()));

  await p.goto(BASE + 'index.html'); await p.waitForFunction(() => document.getElementById('rtv-raiz'));
  // 1. Desde el menú de Libros
  await p.click('#btn-libros'); await p.click('#btn-libro-marino'); await p.click('#lib-pest-vivos'); await p.click('#rtv-menu-libros'); await p.waitForTimeout(900);
  ok(await p.evaluate(() => document.getElementById('ritmo-vivo-view').offsetParent !== null && !!window.__ritmo), 'abre desde el menú de Libros (Modelos vivos)');
  ok(await R('S').then(S => S.clave === 'sinusal'), 'sin estado, abre el sinusal');
  ok((await desborde()) <= 0, 'sin desborde al abrir'); await foto('01-sinusal');
  ok(await p.evaluate(() => !document.getElementById('rtv-mon-tit').textContent.includes('maqueta') && !/maqueta|REGLAS|§|rtm-/.test(document.getElementById('rtv-raiz').innerText)), 'nada interno a la vista (maqueta, REGLAS, §)');
  // 2. Desde las fichas de Merino Cardiología: cada botón, su estado, y VOLVER a la ficha
  const FICHAS_ENLACE = { 'mc-taqui-reconocimiento': 'flutter', 'mc-fa-frecuencia': 'fa', 'mc-fa-cardioversion': 'fa', 'mc-otras-taqui': 'nodal' };
  for (const [tab, esperado] of Object.entries(FICHAS_ENLACE)) {
    await p.evaluate(tab => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'cardiologia', view: 'merinoCardiologia', panel: 'panel-merino-cardio-tabs', tab }); document.body.append(t); t.click(); t.remove(); }, tab);
    await p.waitForTimeout(500);
    const hay = await p.evaluate(tab => { const e = document.querySelector(`#rtv-enlace-${tab} button`); if (!e) return null; e.click(); return e.dataset.ritmoVivo; }, tab);
    await p.waitForTimeout(900);
    const S = await R('S');
    ok(hay !== null && S.clave === esperado, `ficha ${tab}: su botón abre «${hay}» (${S.clave})`);
    await p.evaluate(() => document.getElementById('rtv-volver').click()); await p.waitForTimeout(500);
    ok(await p.evaluate(tab => document.getElementById(tab)?.offsetParent !== null, tab), `ficha ${tab}: «← VOLVER» lleva a la ficha`);
  }
  await abrir('fa:dilt'); await p.waitForTimeout(900);
  let S = await R('S'); ok(S.clave === 'fa' && S.farmaco === 'dilt', `«fa:dilt» abre la FA con diltiazem (${S.clave}/${S.farmaco})`);
  await abrir(''); await p.waitForTimeout(500);
  // 3. Todos los estados: cifras de paciente posible, nunca FC 0 ni NaN
  const claves = Object.keys(ESTADOS);
  for (const k of claves) {
    await R('ponerEstado', k, {}); await R('avanzarHasta', (await R('simT')) + 5); await espera(250);
    const c = await cifras(), txt = c.join(' | ');
    const pend = !!ESTADOS[k].pendiente;
    const malo = /NaN|undefined|Infinity/.test(txt) || (!pend && /^FC\s+0\b/.test(c[0] || '')) || (pend && /\d{2,}/.test(txt.replace(/pendiente de fuente/g, '')));
    ok(!malo && (await desborde()) <= 0, `estado «${k}»: ${txt.slice(0, 90)}`);
  }
  // 4. El FC tras cada choque y tras la adenosina nunca es 0 (el «FC 0» del juicio previo)
  for (const [k, ex, as, nombre] of [['nodal', {}, ['ade6'], 'adenosina'], ['fa', {}, ['cv-fa'], 'cardioversión de la FA'], ['wpw', { wpwFa: true }, ['cv-wpw'], 'cardioversión del WPW'], ['tv', {}, ['cv-tv'], 'cardioversión de la TV'], ['torsade', { tdp: true }, ['desf-tdp'], 'desfibrilación de la torsade']]) {
    await R('ponerEstado', k, ex); await pestana('tratar'); await espera(200);
    for (const a of as) await acc(a);
    let cero = 0, vistos = [];
    for (let i = 0; i < 16; i++) { await R('avanzarHasta', (await R('simT')) + 0.25); await R('pintarCifras'); const f = (await cifras())[0] || ''; vistos.push(f.replace(/^FC\s*/, '').split(' ')[0]); if (/^FC\s+0\b/.test(f)) cero++; }
    ok(cero === 0, `tras ${nombre}: el monitor nunca muestra FC 0 (${vistos.slice(0, 8).join(' ')})`);
  }
  // 5. Topes: cada mando a su tope, con su sello a la vista y entero
  const topeSello = async (nombre, clave, prep) => { const s = (await sellos()).filter(x => !clave || x.clave === clave); ok(s.length > 0 && s.every(x => x.caja && x.ancho <= 1), `${nombre}: sello a la vista y sin cortarse${s[0] ? ` («${s[0].txt.slice(0, 50)}»)` : ''}`); };
  await R('ponerEstado', 'nodal', {}); await pestana('tratar'); await acc('ade6'); await acc('ade12', 2);
  await espera(300); await topeSello('adenosina ×3 (6, 12, 12 mg)', 'ade');
  ok(await p.evaluate(() => [...document.querySelectorAll('#rtv-dock-panel [data-acc^="ade"]')].every(x => x.disabled)), 'adenosina: los botones, apagados tras el tercer bolo'); await foto('02-sello-adenosina');
  await R('ponerEstado', 'nodal', {}); await pestana('tratar'); await acc('vagal-v', 3); await espera(200);
  ok(await p.evaluate(() => document.querySelector('#rtv-dock-panel [data-acc="vagal-v"]')?.disabled), 'vagal: al 3.er intento, apagada');
  await R('ponerEstado', 'nodal', {}); await pestana('tratar'); await acc('dilt-nodo', 2); await espera(200);
  ok(await p.evaluate(() => document.querySelector('#rtv-dock-panel [data-acc="dilt-nodo"]')?.disabled), 'diltiazem nodal: el 2.º bolo, apagado con aviso');
  await R('ponerEstado', 'tv', {}); await pestana('tratar'); await acc('cv-tv', 1);
  // la TV cede al 1.er choque en el modelo: el 3.º solo se alcanza forzando el contador (el tope se comprueba igual)
  await p.evaluate(() => { const S = window.__ritmo.S; S.sinusal = false; S.choquesTV = 3; }); await R('avanzarHasta', (await R('simT')) + 1); await espera(300); await topeSello('TV ×3 choques (100 → 100 → 200 J; contador forzado)', 'energia');
  ok(await p.evaluate(() => document.querySelector('#rtv-dock-panel [data-acc="cv-tv"]')?.disabled), 'TV: con 3 choques, la cardioversión se apaga («nunca 360 J»)');
  await R('ponerEstado', 'tam', {}); await pestana('tratar'); await acc('vera-tam', 4); await espera(300); await topeSello('verapamilo ×4 (20 mg)', null); await foto('03-sello-verapamilo');
  await R('ponerEstado', 'tam', {}); await pestana('tratar'); await acc('mg-tam', 2); ok(await p.evaluate(() => document.querySelector('#rtv-dock-panel [data-acc="mg-tam"]')?.disabled), 'magnesio TAM: una pauta y se apaga');
  await R('ponerEstado', 'fv', { }); await pestana('tratar'); await acc('comp'); await acc('adre'); await acc('amio-pcr', 3); await espera(200);
  ok(await p.evaluate(() => document.querySelector('#rtv-dock-panel [data-acc="amio-pcr"]')?.disabled), 'parada: amiodarona 300 + 150 y basta');
  await p.evaluate(() => document.querySelector('#rtv-dock-panel [data-esc="refractaria"]')?.click()); await acc('choque', 3); await espera(300); await topeSello('FV refractaria tras 3 choques', null);
  await R('avanzarHasta', (await R('simT')) + 200); await R('pintarCifras'); await R('pintarFrase'); await espera(300); await topeSello('parada a los 30 min sin pulso', null); await foto('04-sello-30min');
  ok((await desborde()) <= 0, 'sin desborde con los sellos');
  // 5b. Las claves de la RCP: «fv:rcp», «fv:rcp-adre», «fv:rcp-insufl» abren la FV con compresiones y muestran su PPC y ETCO₂
  for (const [clave, ppc, et, guiaK] of [['fv:rcp', 22, 20, 'rcp'], ['fv:rcp-adre', 29, 20, 'rcpAdre'], ['fv:rcp-insufl', 18, 13, 'rcpInsufl']]) {
    await abrir(clave); await espera(500); await R('avanzarHasta', (await R('simT')) + 1.5); await R('pintarCifras'); await R('pintarFrase'); await espera(200);
    const c = await cifras(), pp = c.find(x => /^PPC/.test(x)) || '', ec = c.find(x => /^ETCO/.test(x)) || '';
    ok(new RegExp(`\\b${ppc}\\b`).test(pp) && new RegExp(`\\b${et}\\b`).test(ec), `${clave}: PPC ${ppc} y ETCO₂ ${et} en el monitor (${pp} | ${ec})`);
    ok(await p.evaluate(() => window.__ritmo.S.clave === 'fv' && window.__ritmo.S.parada.comp), `${clave}: FV con compresiones en marcha`);
    ok(!!GUIAS[guiaK] && /rcp/i.test(guiaK), `${clave}: su guía existe (${guiaK})`);
    ok((await desborde()) <= 0, `${clave}: sin desborde`); await foto('rcp-' + clave.replace(/\W/g, '-'));
  }
  await abrir('fv:rcp-adre'); await pestana('tratar'); await R('avanzarHasta', (await R('simT')) + 1);
  await acc('adre'); await espera(200); await R('pintarCifras');
  ok(/\b29\b/.test((await cifras()).find(x => /^PPC/.test(x)) || ''), 'adrenalina repetida antes de 3 min: la PPC se queda en 29 (no sube más)');
  await topeSello('adrenalina repetida antes de 3 min', null);
  ok(/fuera de pauta/i.test((await sellos()).map(x => x.txt).join(' ')), 'sello «fuera de pauta» a la vista');
  await abrir('fv:rcp-insufl'); await espera(300); await topeSello('30 insuflaciones/min', null);
  // 6. Las explicaciones guiadas: cada paso señala el dibujo y su cita lleva a un párrafo que existe
  let pasosGuia = 0, malasCitas = [];
  for (const k of Object.keys(GUIAS)) for (const [i, paso] of GUIAS[k].pasos.entries()) { pasosGuia++; const c = paso.c; if (!c || !(await p.evaluate(id => !!document.getElementById(id), c.id))) malasCitas.push(`${k}#${i}:${c && c.id}`); }
  ok(malasCitas.length === 0, `${Object.keys(GUIAS).length} guías, ${pasosGuia} pasos: cada cita lleva a un párrafo que existe${malasCitas.length ? ' · faltan ' + malasCitas.slice(0, 4).join(', ') : ''}`);
  const sinFicha = Object.keys(C).filter(k => !FICHAS[C[k].f]);
  ok(sinFicha.length === 0, 'cada fuente apunta a una ficha conocida');
  for (const k of ['sinusal', 'nodal', 'fa', 'wpw', 'fv', 'stemi']) {
    await R('ponerEstado', k, {}); await p.evaluate(() => document.getElementById('rtv-explicame').click()); await p.waitForTimeout(400);
    const n = GUIAS[k] ? GUIAS[k].pasos.length : 1; let vistos = 0, anillos = 0, desb = 0;
    for (let i = 0; i < n; i++) { vistos += await p.evaluate(() => !!document.querySelector('#rtv-dock-guia .guia-txt')); anillos += await p.evaluate(() => document.querySelectorAll('.guia-anillo, .guia-marco').length > 0 ? 1 : 0); desb += (await desborde()) > 0 ? 1 : 0; await p.evaluate(() => document.getElementById('rtv-guia-sig')?.click()); await p.waitForTimeout(150); }
    ok(vistos === n && desb === 0 && anillos >= 1, `guía «${k}»: ${n} pasos, señala el dibujo, sin desborde`);
    await p.evaluate(() => document.getElementById('rtv-guia-x')?.click());
  }
  // 6b. «Llenado malo»: sin patada auricular (FA) la PAS cae; en sinusal no cambia (la aurícula sigue aportando)
  const pasMedia = async (k, ex) => { await R('ponerEstado', k, ex); let v = []; for (let i = 0; i < 12; i++) { await R('avanzarHasta', (await R('simT')) + 1); v.push(await p.evaluate(() => window.__ritmo.leer(window.__ritmo.simT).pas)); } return v.slice(4).reduce((a, b) => a + b, 0) / 8; };
  const faB = await pasMedia('fa', { fcFA: 120 }), faM = await pasMedia('fa', { fcFA: 120, llenadoMalo: true });
  ok(faM < faB - 3, `FA: con «Llenado malo» la PAS media baja (${faB.toFixed(0)} → ${faM.toFixed(0)})`);
  const siB = await pasMedia('sinusal', {}), siM = await pasMedia('sinusal', { llenadoMalo: true });
  ok(Math.abs(siM - siB) <= 2, `sinusal: «Llenado malo» no cambia la PAS (${siB.toFixed(0)} → ${siM.toFixed(0)})`);
  // 7. Lentos (sin fuente), Medir, Pausa, láminas
  await R('ponerEstado', 'pend-bradi', {}); await espera(200);
  const lent = await cifras(); ok(lent.every(x => /—/.test(x)) && /Pendiente de fuente/i.test(await p.evaluate(() => document.getElementById('rtv-mon-pendiente').innerText)), 'Lentos: monitor en «—» y «Pendiente de fuente», sin cifras');
  await R('ponerEstado', 'nodal', {}); await pestana('medir');
  for (const m of ['pr', 'qrs', 'qt', 'rr']) { await p.evaluate(m => document.querySelector(`#rtv-dock-panel [data-medir="${m}"]`).click(), m); await p.waitForTimeout(200); ok(!/NaN|undefined/.test(await p.evaluate(() => document.getElementById('rtv-medida')?.innerText || '')) && (await desborde()) <= 0, `medir ${m}: texto sin NaN, sin desborde`); }
  ok(await R('pausado'), 'Medir pausa la tira'); await p.evaluate(() => document.querySelector('#rtv-dock-panel [data-medir]:not([aria-pressed="false"])')?.click()); await p.waitForTimeout(200);
  ok(!(await R('pausado')), 'al dejar de medir, la tira sigue');
  await p.evaluate(() => document.getElementById('rtv-pausa').click()); ok(await R('pausado'), 'Pausa'); await p.evaluate(() => document.getElementById('rtv-pausa').click());
  await p.evaluate(() => document.querySelector('#rtv-laminas [data-lam]')?.click()); await p.waitForTimeout(300);
  ok(await p.evaluate(() => document.getElementById('rtv-visor').open && document.getElementById('rtv-visor-img').naturalWidth > 0), 'una lámina del libro abre su visor con la imagen cargada'); await p.evaluate(() => document.getElementById('rtv-visor-cerrar').click());
  // 7b. La Mayéutica: las 10 preguntas (acertando y fallando), el repaso y el caso entero; sin desborde y sin nada tapado tras cada respuesta
  {
    await abrir(''); await p.waitForTimeout(500);
    const clic = sel => p.evaluate(sel => { const e = document.querySelector(sel); if (!e) return false; e.click(); return true; }, sel);
    const cuenta = sel => p.evaluate(sel => document.querySelectorAll(sel).length, sel);
    const libre = async (tag2) => { // el botón «Siguiente» (o el último elemento de la respuesta) queda a la vista, sobre el dock, y sin desborde lateral
      await p.waitForTimeout(REDUCIDO ? 120 : 700);
      const r = await p.evaluate(() => { const s = document.querySelector('#rtv-preg [data-accion="sig"]') || document.querySelector('#rtv-preg [data-accion="comprobar"]'); const d = document.getElementById('rtv-dock').getBoundingClientRect(); if (!s) return { sin: true }; const b = s.getBoundingClientRect(); return { top: b.top, bottom: b.bottom, dock: d.top }; });
      const dd = await desborde();
      ok(dd <= 0 && (r.sin || (r.top >= 0 && r.bottom <= r.dock + 1)), `${tag2}: sin desborde y «Siguiente» a la vista sobre el dock${r.sin ? '' : ` (bottom ${Math.round(r.bottom)} / dock ${Math.round(r.dock)})`}`);
    };
    const textoDe = html => p.evaluate(h => { const d = document.createElement('div'); d.innerHTML = h; return d.textContent.trim(); }, html);
    async function contestar(q, bien, etiqueta) {
      if (q.tipo === 'test') {
        ok((await cuenta('#rtv-preg [data-op]')) === 0, `${etiqueta}: las opciones no están en el HTML antes de «Ya lo tengo»`);
        await clic('#rtv-preg [data-accion="ops"]');
        const quiero = q.opciones.find(o => !!o.ok === bien) || q.opciones[0], txt = await textoDe(quiero.t);
        const hecho = await p.evaluate(txt => { const b = [...document.querySelectorAll('#rtv-preg [data-op]')].find(x => x.textContent.trim() === txt); if (!b) return false; b.click(); return true; }, txt);
        ok(hecho, `${etiqueta}: elige una opción ${bien ? 'buena' : 'mala'}`);
        ok(await p.evaluate(b => !!document.querySelector('#rtv-preg .rtv-' + (b ? 'ok' : 'mal')), bien), `${etiqueta}: dice ${bien ? '«Bien»' : 'qué le habría pasado al paciente'}`);
        if (q.tocar) { await clic('#rtv-preg [data-mando="ade6"]'); await p.waitForTimeout(200); await clic('#rtv-preg [data-accion="comprobar"]'); await p.waitForTimeout(200); ok(await R('S').then(S => !!(S && S.adeno)), `${etiqueta}: la adenosina se puso en el modelo`); }
      } else if (q.tipo === 'destapa') {
        ok((await cuenta('#rtv-preg input[type=checkbox]')) === 0, `${etiqueta}: los puntos no están en el HTML antes de destapar`);
        await clic('#rtv-preg [data-accion="destapa"]');
        await p.evaluate(b => { document.querySelectorAll('#rtv-preg input[type=checkbox]').forEach(c => { if (b) c.checked = true; }); }, bien);
        await clic('#rtv-preg [data-accion="puntos"]');
      } else if (q.tipo === 'error') {
        await p.evaluate(([b, mal]) => { document.querySelectorAll('#rtv-preg [data-fr]').forEach((x, i) => { if (b === mal[i]) x.click(); }); }, [true, q.frases.map(f => !!f.mal)]);
        if (!bien) await p.evaluate(() => document.querySelector('#rtv-preg [data-fr]').click());
        await clic('#rtv-preg [data-accion="corregir"]');
        await clic('#rtv-preg [data-ver]');
      }
      await libre(etiqueta);
    }
    const hecho390 = [];
    await clic('#rtv-modo-preguntas'); await p.waitForTimeout(400);
    ok(await p.evaluate(() => !document.getElementById('rtv-vista-preguntas').hidden && document.getElementById('rtv-dock-explorar').hidden && !document.getElementById('rtv-dock-estudio').hidden), 'Mayéutica: se abre la vista de preguntas y el dock de progreso');
    ok((await desborde()) <= 0, 'Mayéutica: inicio sin desborde'); await foto('may-inicio');
    await clic('[data-ir="recorrido"]'); await p.waitForTimeout(300);
    for (let i = 0; i < PREGUNTAS.length; i++) {
      const q = PREGUNTAS[i], bien = i % 2 === 0;
      const enun = await p.evaluate(() => document.querySelector('#rtv-preg .rtv-pregunta')?.textContent || '');
      ok(enun.length > 20, `pregunta ${i + 1} de 10 (${q.num}) a la vista`);
      if (i === 0) await foto('may-pregunta');
      await contestar(q, bien, `${q.num} ${bien ? 'acertada' : 'fallada'}`);
      if (i === 1) await foto('may-respuesta');
      await clic('#rtv-preg [data-accion="sig"]'); await p.waitForTimeout(250);
    }
    // el repaso: solo lo fallado (5 test fallados), cada una vuelve y un acierto la saca
    const nRep = await cuenta('#rtv-preg [data-rep]');
    ok(nRep === 5, `repaso: vuelven las 5 falladas (salen ${nRep})`); await foto('may-repaso');
    for (let k = 0; k < 5; k++) {
      const id = await p.evaluate(() => document.querySelector('#rtv-preg [data-rep]')?.dataset.rep); if (!id) break;
      await clic(`#rtv-preg [data-rep="${id}"]`); await p.waitForTimeout(250);
      await contestar(PREGUNTAS.find(q => q.id === id), true, `repaso ${id}`);
      await clic('#rtv-preg [data-accion="sig"]'); await p.waitForTimeout(250);
    }
    ok((await cuenta('#rtv-preg [data-rep]')) === 0 && /No queda nada/.test(await p.evaluate(() => document.getElementById('rtv-preg').innerText)), 'repaso: tras acertar las 5, no queda nada');
    await clic('#rtv-preg [data-ir="casos"]'); await p.waitForTimeout(250);
    ok((await desborde()) <= 0, 'casos: lista sin desborde'); await clic('#rtv-preg [data-caso="0"]'); await p.waitForTimeout(300);
    const C0 = CASOS[0];
    for (let i = 0; i < C0.pasos.length; i++) {
      const q = C0.pasos[i].pregunta, bien = i !== 1;
      ok(await p.evaluate(() => !!document.querySelector('#rtv-preg dl.rtv-paciente') && !!document.querySelector('#rtv-preg .rtv-dia')), `caso paso ${i + 1}: la ficha del paciente y el momento`);
      if (i === 2) await foto('may-caso-paso3');
      await contestar(q, bien, `caso paso ${i + 1}`);
      await clic('#rtv-preg [data-accion="sig"]'); await p.waitForTimeout(300);
    }
    ok(/lo que te llevas/i.test(await p.evaluate(() => document.getElementById('rtv-preg').innerText)) && (await cuenta('#rtv-preg .rtv-lleva li')) === 3, 'caso: el final con «Lo que te llevas» (3 puntos)');
    ok(await p.evaluate(() => !!document.querySelector('#rtv-preg [data-fin="modelo"]') && !!document.querySelector('#rtv-preg [data-especialidad][data-resaltar]')), 'caso: botón del modelo y «Repasar en la ficha» con su párrafo');
    ok(await p.evaluate(() => { const b = document.querySelector('#rtv-preg [data-especialidad][data-resaltar]'); return !!document.querySelector(b.dataset.resaltar); }), 'caso: el «Repasar en la ficha» apunta a un párrafo que existe');
    ok((await desborde()) <= 0, 'caso: final sin desborde'); await foto('may-caso-fin');
    // cada cita de las preguntas lleva a un párrafo que existe
    const mal = []; for (const q of [...PREGUNTAS, ...C0.pasos.map(x => x.pregunta)]) for (const c of [q.fuente, q.fuente2, ...(q.puntos || []).map(x => x.c), ...(q.frases || []).map(f => f.cita)].filter(Boolean)) if (!(await p.evaluate(id => !!document.getElementById(id), c.id))) mal.push(q.id + ':' + c.id);
    ok(mal.length === 0, `todas las citas de las preguntas llevan a un párrafo que existe${mal.length ? ' · faltan ' + mal.join(', ') : ''}`);
    await clic('#rtv-preg [data-fin="modelo"]'); await p.waitForTimeout(400);
    ok(await p.evaluate(() => window.__ritmo.modo === 'explorar' && window.__ritmo.S.clave === 'fa' && !document.getElementById('rtv-dock-explorar').hidden), 'caso: «Abrir el corazón de Teodoro» vuelve a Explorar en FA');
    ok((await desborde()) <= 0, 'Mayéutica → Explorar sin desborde');
  }
  // 7b. El plano grande de las lupas se cierra por los 4 caminos (Escape, modo, estado, VOLVER)
  {
    const cerrado = () => p.evaluate(() => { const c = document.querySelector('.pg-cab'); if (!c) return true; const r = c.parentElement.getBoundingClientRect(); return c.parentElement.hidden || r.height === 0; });
    const abrirL = async () => { await R('setModo', 'explorar').catch(() => {}); await p.evaluate(() => document.getElementById('rtv-lupas-grandes').click()); await espera(250); };
    await abrirL(); ok(!(await cerrado()), 'plano de las lupas: se abre');
    await p.keyboard.press('Escape'); await espera(150); ok(await cerrado(), 'plano de las lupas: Escape lo cierra');
    await abrirL(); await p.evaluate(() => document.getElementById('rtv-modo-preguntas').click()); await espera(300); ok(await cerrado(), 'plano de las lupas: cerrado al pasar a Mayéutica');
    await p.evaluate(() => document.getElementById('rtv-modo-explorar').click()); await espera(300);
    await abrirL(); await p.evaluate(() => window.__ritmo.ponerEstado('fv', {})); await espera(200); ok(await cerrado(), 'plano de las lupas: cerrado al cambiar de estado');
    await abrirL(); await p.evaluate(() => document.getElementById('rtv-volver').click()); await espera(300); ok(await cerrado(), 'plano de las lupas: cerrado con «← VOLVER»');
    await abrir(''); await espera(500);
  }
  // 8. Ids sin duplicar, bucle que se para al salir
  ok(await p.evaluate(() => { const v = {}; let d = 0; document.querySelectorAll('[id]').forEach(e => { if (v[e.id]) d++; v[e.id] = 1; }); return d === 0; }), 'ids sin duplicar en todo el DOM');
  if (!REDUCIDO) {
    const t0 = await R('simT'); await p.evaluate(() => document.getElementById('rtv-volver').click()); await p.waitForTimeout(1200); const t1 = await R('simT'); await p.waitForTimeout(1200);
    ok((await R('simT')) === t1 && t1 - t0 < 3, 'al salir de la vista, el bucle se para'); await abrir(''); await p.waitForTimeout(900); ok((await R('simT')) > t1 + 0.3, 'al volver, el bucle sigue');
  }
  ok(errores.length === 0, `sin errores de consola${errores.length ? ': ' + errores.slice(0, 2).join(' | ') : ''}`);
  await ctx.close();
  fallosTotales.push(...fallos.map(f => `${tag}: ${f}`));
}
await correr(390, false);
await correr(360, true);
await b.close();
if (fallosTotales.length) { console.log(`\n${fallosTotales.length} fallos`); process.exit(1); }
console.log('\nTodo en verde');

// Vuelta de límites (26/10/2026): lleva TODOS los mandos de las cuatro maquetas a su tope y anota lo que se rompe
// (cifras imposibles, mandos sin tope, sin consecuencia visible, errores de consola, desborde).
// Uso: python3 -m http.server 8796 (en la raíz del repo) y  node limites-prueba.mjs [shock|pulmon|receptor|ritmo|todo]
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = 'http://127.0.0.1:8796/autonomo/maquetas/';
const QUE = process.argv[2] || 'todo';
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices['iPhone 12'], viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
const page = await ctx.newPage();
const errores = [];
page.on('console', (m) => { if (m.type() === 'error') errores.push(m.text().slice(0, 160)); });
page.on('pageerror', (e) => errores.push('pageerror: ' + e.message.slice(0, 160)));
const desb = () => page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const tap = async (sel) => { const r = await page.evaluate((s) => { const el = document.querySelector(s); if (!el) return 'no ' + s; el.click(); return 'ok'; }, sel); if (r !== 'ok') console.log('  (tap)', r); await page.waitForTimeout(100); };
const range = async (sel, v, ev = ['input', 'change']) => page.evaluate(([s, v, ev]) => { const d = document.querySelector(s); if (!d) return 'no ' + s; d.value = v; ev.forEach((e) => d.dispatchEvent(new Event(e, { bubbles: true }))); return d.min + '-' + d.max + '→' + d.value; }, [sel, v, ev]);
const fila = (t, o) => console.log(t.padEnd(30), typeof o === 'string' ? o : Object.entries(o).map(([k, v]) => `${k} ${v}`).join(' · '));
const ir = async (m) => { errores.length = 0; await page.goto(BASE + m + '.html', { waitUntil: 'networkidle' }); await page.waitForTimeout(900); };
const nan = async () => page.evaluate(() => /NaN|undefined|Infinity/.test(document.body.innerText));

if (QUE === 'shock' || QUE === 'todo') {
  await ir('b3-shock');
  const R = () => page.evaluate(() => { const c = window.__cabecera, r = c.R, L = c.cab.lectura; return { est: document.querySelector('#frase-txt .estado')?.textContent, pa: `${r.pas}/${r.pad}`, pam: r.pam, fc: r.fc, pvc: r.pvc, pcp: r.pcp, ic: r.ic, irvs: r.irvs, spo2: r.spo2, lact: r.lact, diur: r.diur, edema: Math.round(L.edema || 0), cris: c.cab.infundido.cris, crisT: c.cab.infundido.crisTotal, sangre: c.cab.infundido.sangre, h: c.est.horas, sello: !document.getElementById('sello').hidden, topes: [...document.querySelectorAll('.tope-sello')].map((e) => e.firstChild.textContent.trim()).join('|') || '-', avisos: document.querySelectorAll('.tope-aviso').length, apagados: document.querySelectorAll('.tope-apagado').length, aviso: !!document.querySelector('.consola-aviso') }; });
  const grav = (v) => range('#d-grav', v);
  // 1) sueros sin fin: cada paciente a su gravedad tope, +2 L × 12 (24 L)
  for (const k of ['mateo', 'amparo', 'aurelio', 'joaquin', 'consuelo']) {
    await tap(`[data-pac="${k}"]`); await page.waitForTimeout(250); await tap('[data-pest="grav"]'); await grav(100); await page.waitForTimeout(500);
    fila(`${k} g100 base`, await R());
    await tap('[data-pest="vol"]');
    for (let i = 1; i <= 12; i++) { await tap('[data-vol="2000"]'); await page.waitForTimeout(350); if ([1, 3, 6, 12].includes(i)) fila(`  +${2 * i} L`, await R()); }
    if (k === 'mateo') { for (let i = 1; i <= 10; i++) { await tap('[data-sangre="1000"]'); await page.waitForTimeout(300); } fila('  +10 L sangre', await R()); }
    console.log('  desborde', await desb(), 'NaN', await nan());
  }
  // 2) el reloj sin fin: Amparo, +18 h × 20 (15 días)
  await tap('[data-pac="amparo"]'); await page.waitForTimeout(250); await tap('[data-pest="reloj"]');
  for (let i = 1; i <= 20; i++) { await tap('[data-h="18"]'); await page.waitForTimeout(250); if ([1, 5, 20].includes(i)) fila(`Amparo reloj +${18 * i} h`, await R()); }
  console.log('  texto reloj:', await page.evaluate(() => document.querySelector('#dock-panel .dock-nota')?.textContent.slice(0, 80)));
  // 3) fármacos a tope con la gravedad a tope y luego a cero (¿hipertensión?)
  await tap('[data-pac="amparo"]'); await page.waitForTimeout(250); await tap('[data-pest="far"]'); await tap('[data-na="30"]'); await tap('[data-far="vaso"]'); await tap('[data-far="dobuta"]'); await page.waitForTimeout(500);
  fila('Amparo NA30+vaso+dobuta g1', await R());
  await tap('[data-pest="grav"]'); await grav(0); await page.waitForTimeout(600); fila('  mismo, g0 (sin shock)', await R());
  await tap('[data-pest="vol"]'); for (let i = 0; i < 5; i++) await tap('[data-vol="2000"]'); await page.waitForTimeout(400); fila('  + 10 L', await R());
  for (const k of ['mateo', 'aurelio']) { await tap(`[data-pac="${k}"]`); await page.waitForTimeout(250); await tap('[data-pest="far"]'); await tap('[data-na="30"]'); await tap('[data-far="vaso"]'); await tap('[data-far="dobuta"]'); await page.waitForTimeout(500); fila(`${k} NA30+vaso+dobuta`, await R()); }
  // 4) aparatos a tope en Aurelio vacío (sin volumen) y con 6 L
  await tap('[data-pac="aurelio"]'); await page.waitForTimeout(250); await tap('[data-pest="sop"]'); await tap('[data-sop="impella"]'); await page.waitForTimeout(600); await range('#d-imp', 55, ['change']); await page.waitForTimeout(600); fila('Aurelio Impella 5,5 vacío', await R());
  await tap('.dock-asa'); await tap('[data-pest="vol"]'); for (let i = 0; i < 3; i++) await tap('[data-vol="2000"]'); await page.waitForTimeout(500); fila('  + 6 L con Impella 5,5', await R());
  await tap('[data-pest="sop"]'); await tap('[data-sop="ecmo"]'); await page.waitForTimeout(600); await range('#d-ecmo', 60, ['change']); await page.waitForTimeout(600); fila('  ECMO 6 + 6 L', await R());
  await tap('[data-vent="impella"]'); await page.waitForTimeout(600); fila('  ECMO 6 + venteo Impella', await R());
  await tap('.dock-asa'); await tap('[data-pest="far"]'); await tap('[data-na="30"]'); await tap('[data-far="dobuta"]'); await page.waitForTimeout(500); fila('  + NA30 + dobuta', await R());
  // 6) el reloj hasta las 48 h con botones de 18, 5 y 1 h: el sello «Reloj agotado» y los botones apagados
  await tap('[data-pac="amparo"]'); await page.waitForTimeout(250); await tap('[data-pest="reloj"]');
  for (const h of [18, 18, 5, 5, 1, 1]) { await tap(`[data-h="${h}"]`); await page.waitForTimeout(300); }
  fila('reloj 48 h', await R());
  fila('  botones h apagados', String(await page.evaluate(() => [...document.querySelectorAll('[data-h]')].filter((b) => b.disabled).length)) + ' de 3');
  console.log('SHOCK errores', errores.length, errores.slice(0, 3).join(' | '), 'desborde', await desb(), 'NaN', await nan());
}

if (QUE === 'pulmon' || QUE === 'todo') {
  await ir('b3-pulmon'); await page.waitForTimeout(1800);
  const C = () => page.evaluate(() => { const g = (k) => document.querySelector(`[data-fila="${k}"]`)?.textContent.replace(/\s+/g, ' ').trim().slice(0, 28); const o = {}; for (const k of ['pico', 'meseta', 'pres', 'peeptot', 'cstat', 'dp', 'vtkg', 'vm', 'ie', 'vt', 'flujofin']) o[k] = g(k); o.consola = document.getElementById('consola')?.hidden ? '-' : document.getElementById('consola')?.textContent.replace(/\s+/g, ' ').slice(0, 140); return o; });
  // Con el monitor congelado (#pausa) cada mando rellena el modelo ya estable (35 s de calentamiento, pagina.js
  // llenarMonitor): la lectura es la del estado estacionario y no una de un ciclo a medias (a FR 8 un ciclo dura 7,5 s).
  const M = async (k, v) => { const r = await range(`input[data-m="${k}"]`, v, ['input']); await page.waitForTimeout(250); return r; };
  const btn = async (k, v) => { await tap(`button[data-m="${k}"]${v ? `[data-v="${v}"]` : ''}`); await page.waitForTimeout(250); };
  const pest = (p) => tap(`[data-pest="${p}"]`);
  const congelar = async (si) => { const on = await page.evaluate(() => document.getElementById('pausa').getAttribute('aria-pressed') === 'true'); if (on !== si) await tap('#pausa'); await page.waitForTimeout(300); };
  await congelar(true);
  // 0) un mando a la vez desde el estado base de Rafael (¿qué tope tiene cada uno por separado?)
  await tap('[data-pac="rafael"]'); await page.waitForTimeout(300); await pest('resp');
  for (const [k, v] of [['vt', 800], ['vt', 200], ['flujo', 30], ['flujo', 100], ['fr', 35], ['fr', 8], ['peep', 20], ['pmax', 30]]) { await tap('[data-pac="rafael"]'); await page.waitForTimeout(200); await pest('resp'); await M(k, v); fila(`rafael solo ${k}=${v}`, await C()); }
  await tap('[data-pac="rafael"]'); await page.waitForTimeout(200); await pest('resp'); await btn('modo', 'pcv');
  for (const [k, v] of [['pinsp', 30], ['pinsp', 5], ['ie', 1], ['ie', 4]]) { await M(k, v); fila(`rafael PCV ${k}=${v}`, await C()); await tap('[data-pac="rafael"]'); await page.waitForTimeout(200); await pest('resp'); await btn('modo', 'pcv'); }
  await tap('[data-pac="rafael"]'); await page.waitForTimeout(200); await pest('resp'); await btn('modo', 'pcv'); await M('pinsp', 30); await M('pmax', 30); fila('rafael PCV Pi30 + pmax30', await C());
  await tap('[data-pac="rafael"]'); await page.waitForTimeout(200); await pest('pulmon');
  for (const [k, v] of [['c', 15], ['c', 100], ['r', 40], ['r', 2]]) { await tap('[data-pac="rafael"]'); await page.waitForTimeout(200); await pest('pulmon'); await M(k, v); fila(`rafael solo ${k}=${v}`, await C()); }
  await tap('[data-pac="rafael"]'); await page.waitForTimeout(200); await pest('pulmon'); await M('r', 40); await btn('fesp', '3'); fila('rafael R40 esp×3', await C());
  await page.screenshot({ path: '/tmp/plan-socialista/b3/limites/pulmon-01-rafael-r40x3.png' });
  // 1) todo a tope, paciente a paciente
  for (const pac of ['rafael', 'isidro', 'jacinto', 'eulalia']) {
    await tap(`[data-pac="${pac}"]`); await page.waitForTimeout(400); fila(`${pac} base`, await C());
    await pest('resp'); await btn('modo', 'vcv'); await M('vt', 800); await M('fr', 35); await M('peep', 20); await M('flujo', 30); await M('pmax', 70); fila(`  VCV Vt800 FR35 PEEP20 Q30 pmax70`, await C());
    await M('pmax', 30); fila(`  …pmax 30`, await C());
    await M('vt', 200); await M('fr', 8); await M('peep', 0); fila(`  VCV Vt200 FR8 PEEP0`, await C());
    await btn('modo', 'pcv'); await M('pinsp', 30); await M('peep', 20); await M('fr', 35); await M('ie', 1); fila(`  PCV Pi30 PEEP20 FR35 I:E1`, await C());
    await pest('pulmon'); await M('c', 15); await M('r', 40); await btn('fesp', '3'); fila(`  …C15 R40 esp×3`, await C());
    await M('c', 100); await M('r', 2); await btn('fesp', '1'); fila(`  …C100 R2`, await C());
    await pest('man'); await btn('pausa'); await btn('oclusion'); fila(`  …pausa+oclusión`, await C()); await btn('pausa'); await btn('oclusion');
    console.log('  desborde', await desb(), 'NaN', await nan());
  }
  await page.screenshot({ path: '/tmp/plan-socialista/b3/limites/pulmon-02-eulalia-tope.png' });
  // 2) en vivo (sin congelar): cambiar la compliancia con el pulmón lleno deja la presión alveolar por encima de lo aplicado
  await congelar(false); await tap('[data-pac="jacinto"]'); await page.waitForTimeout(1500); await pest('resp'); await btn('modo', 'pcv'); await M('pinsp', 30); await M('peep', 20); await M('fr', 35); await M('ie', 1);
  await pest('pulmon'); await M('c', 100); await page.waitForTimeout(6000); fila('vivo Jacinto PCV50 C100 (6 s)', await C());
  await M('c', 15); await M('r', 40); await btn('fesp', '3'); for (const ms of [1500, 3000]) { await page.waitForTimeout(ms); fila(`  → C15 R40 esp×3, +${ms} ms`, await C()); }
  await page.waitForTimeout(12000); fila('  → +12 s más', await C());
  console.log('PULMON errores', errores.length, errores.slice(0, 3).join(' | '));
}

if (QUE === 'receptor' || QUE === 'todo') {
  await ir('b3-receptor');
  const R = () => page.evaluate(() => { const r = window.__receptor.R; return { pam: Math.round(r.pam), pa: `${Math.round(r.pas)}/${Math.round(r.pad)}`, fc: Math.round(r.fc), ic: +(+r.ic).toFixed(1), irvs: Math.round(r.irvs), lact: r.lact == null ? '-' : +(+r.lact).toFixed(1), f: JSON.stringify(window.__receptor.ST.f), frase: document.querySelector('#frase-txt')?.textContent.replace(/\s+/g, ' ').slice(0, 90) }; });
  const estados = await page.evaluate(() => window.__receptor.ESTADOS.map((e) => e.id));
  console.log('estados', estados.join(' '));
  for (const id of estados) {
    await page.evaluate((id) => window.__receptor.ponerEstado(id), id); await page.waitForTimeout(2500);
    const base = await R();
    const sliders = await page.evaluate(() => [...document.querySelectorAll('input[data-dosis]')].map((i) => [i.dataset.dosis, i.min, i.max]));
    const togs = await page.evaluate(() => [...document.querySelectorAll('#dock-panel button[data-tog], #dock-panel button[data-fija]')].map((b) => (b.dataset.tog || b.dataset.fija) + ':' + b.getAttribute('aria-pressed')));
    fila(`${id} base`, base); console.log('   mandos', sliders.map((s) => `${s[0]} ${s[1]}-${s[2]}`).join(', '), '| togs', togs.join(', '));
    for (const [k, , max] of sliders) await range(`input[data-dosis="${k}"]`, max);
    for (const t of togs) { const [k, on] = t.split(':'); if (on !== 'true') { await page.evaluate((k) => document.querySelector(`#dock-panel button[data-tog="${k}"], #dock-panel button[data-fija="${k}"]`)?.click(), k); } }
    await page.waitForTimeout(3200); fila('   TODO a tope', await R());
    for (const [k, min] of sliders) await range(`input[data-dosis="${k}"]`, min);
    await page.waitForTimeout(2500); fila('   TODO a cero (togs on)', await R());
  }
  console.log('RECEPTOR errores', errores.length, errores.slice(0, 3).join(' | '), 'desborde', await desb(), 'NaN', await nan());
}

if (QUE === 'ritmo' || QUE === 'todo') {
  await ir('b3-ritmo');
  const L = () => page.evaluate(() => { const l = window.__ritmo.leer ? window.__ritmo.leer() : {}; const S = window.__ritmo.S; return { fc: l.fc ?? l.fcV ?? '-', pr: l.pr ?? '-', qrs: l.qrs ?? '-', qtc: l.qtc ?? '-', pam: l.pam ?? '-', clave: S.clave, parada: S.parada ? JSON.stringify({ comp: S.parada.comp, rce: S.parada.rce, min: S.parada.minuto, adre: S.parada.adre, choques: S.parada.choques }) : '-', frase: document.querySelector('#frase-txt')?.textContent.replace(/\s+/g, ' ').slice(0, 110) }; });
  const pon = async (k, x = {}) => { await page.evaluate(([k, x]) => window.__ritmo.ponerEstado(k, x), [k, x]); await page.waitForTimeout(600); await tap('[data-pest="tratar"]'); await page.waitForTimeout(300); };
  const acc = async (a, n = 1) => { for (let i = 0; i < n; i++) { await page.evaluate((a) => document.querySelector(`[data-acc="${a}"]`)?.click(), a); await page.waitForTimeout(250); } await page.waitForTimeout(800); };
  console.log('leer():', await page.evaluate(() => JSON.stringify(window.__ritmo.leer ? window.__ritmo.leer() : null)?.slice(0, 300)));
  await pon('sinusal'); await range('#d-fcsa', 150); await page.waitForTimeout(1500); fila('sinusal fcSA 150', await L());
  await pon('taquiSinusal'); await range('#d-fcsa', 150); await page.waitForTimeout(1500); fila('taquiSinusal 150', await L());
  await pon('hiperk'); await range('#d-k', 8.6); await page.waitForTimeout(2500); fila('hiperK 8,6', await L());
  await pon('stemi'); await range('#d-st', 3.5); await page.waitForTimeout(1500); fila('STEMI ST 3,5', await L());
  await pon('fa'); await tap('[data-far="dilt"]'); await page.waitForTimeout(400); await range('#d-horas', 6); await page.waitForTimeout(1500); fila('FA dilt 6 h', await L());
  await acc('esmolol'); await acc('llenado'); fila('  + esmolol + llenado malo', await L()); await acc('cv-fa', 5); fila('  + cardioversión ×5', await L());
  await pon('nodal'); await acc('ade6', 6); fila('nodal adenosina 6 mg ×6', await L()); await acc('ade12', 6); fila('  adenosina 12 ×6', await L()); await acc('dilt-nodo', 3); fila('  dilt ×3', await L());
  await pon('tam'); await acc('mg-tam', 5); await acc('meto-tam', 3); await acc('vera-tam', 3); fila('TAM Mg×5+meto×3+vera×3', await L());
  await pon('wpw'); await acc('llegafa'); await acc('w-dilt'); await acc('w-bb'); await acc('w-digo'); fila('WPW+FA dilt+bb+digo', await L()); await acc('verfv'); fila('  verfv', await L()); await acc('desf-wpw', 4); fila('  desfibrilar ×4', await L());
  await pon('tv'); await tap('[data-inest="true"]'); await acc('amio-tv', 6); await acc('cv-tv', 6); fila('TV inestable amio×6 cv×6', await L());
  await pon('torsade'); for (const k of ['haloperidol', 'claritromicina', 'amiodarona', 'kBajo', 'mgBajo', 'caBajo']) await acc('qt-' + k); await page.waitForTimeout(2500); fila('torsade todo', await L()); await acc('tdp'); fila('  tdp', await L()); await acc('mg-tdp', 5); await acc('desf-tdp', 5); fila('  Mg×5 desf×5', await L());
  await pon('fv'); const haveParada = await page.evaluate(() => !!window.__ritmo.S.parada); console.log('fv parada', haveParada);
  await acc('comp'); await acc('adre', 15); await acc('amio-pcr', 5); await tap('[data-insufl="30"]'); await range('#d-min', 20); await page.waitForTimeout(600); await acc('choque', 10); fila('FV comp adre×15 amio×5 insufl30 min20 choque×10', await L());
  await page.evaluate(() => window.__ritmo.avanzarHasta(window.__ritmo.simT + 600)); await page.waitForTimeout(800); fila('  +600 s', await L());
  // --- Vuelta de topes (profesor, 26/10 noche): repetición de cada acción, con espera para separar el efecto transitorio
  //     (el bolo que acaba de caer) del tope que falta. accN cuenta cuántas veces existía el botón al pulsarlo.
  const CAP = '/tmp/plan-socialista/b3/limites/'; await import('node:fs').then((fs) => fs.mkdirSync(CAP, { recursive: true }));
  const accN = async (a, n = 1, ms = 250) => { let hits = 0; for (let i = 0; i < n; i++) { hits += await page.evaluate((a) => { const b = document.querySelector(`[data-acc="${a}"]`); if (!b || b.disabled) return 0; b.click(); return 1; }, a); await page.waitForTimeout(ms); } return hits; };
  const topes = () => page.evaluate(() => ({ sellos: document.querySelectorAll('.tope-sello').length, avisos: document.querySelectorAll('.tope-aviso').length, apagados: document.querySelectorAll('[data-acc]:disabled, [data-acc].tope-apagado').length, bomba: document.querySelector('#bomba, .bomba')?.textContent.replace(/\s+/g, ' ').slice(0, 60) || '-' }));
  const L2 = async (t, esperas = [800, 3000, 6000]) => { let prev = 0; for (const ms of esperas) { await page.waitForTimeout(ms - prev); prev = ms; fila(`${t} +${ms / 1000} s`, await L()); } console.log('   topes', JSON.stringify(await topes())); };
  console.log('¿usa tope.js?', await page.evaluate(() => !!document.querySelector('.tope-mon, .tope-avisos')));
  await pon('nodal'); console.log('nodal ade6 ×1 hits', await accN('ade6', 1)); await L2('  ade6 ×1');
  await pon('nodal'); console.log('nodal ade6 ×1 + ade12 ×6 hits', await accN('ade6', 1), await accN('ade12', 6)); await L2('  ade12 ×6', [800, 2000, 4000, 7000]);
  await page.screenshot({ path: CAP + 'ritmo-01-nodal-ade12x6.png' });
  await pon('nodal'); console.log('nodal dilt ×3 hits', await accN('dilt-nodo', 3)); await L2('  dilt ×3 solo');
  await pon('nodal'); console.log('nodal vagal-c ×10 hits', await accN('vagal-c', 10)); await L2('  masaje ×10', [800, 3000]);
  await pon('tam'); console.log('tam mg ×5 hits', await accN('mg-tam', 5)); await L2('  Mg ×5 (40 g)', [800, 4000]);
  await pon('tam'); console.log('tam vera ×5 hits', await accN('vera-tam', 5), 'meto ×5', await accN('meto-tam', 5)); await L2('  vera×5 meto×5', [800, 4000]);
  await pon('wpw'); await accN('llegafa'); await page.waitForTimeout(500); await tap('[data-pest="tratar"]'); console.log('wpw w-dilt×3 w-bb×3 w-digo×3 hits', await accN('w-dilt', 3), await accN('w-bb', 3), await accN('w-digo', 3)); await L2('  3 frenos ×3', [800, 3000]);
  console.log('  verfv hits', await accN('verfv', 1)); await page.waitForTimeout(2500); console.log('  desf-wpw ×4 hits', await accN('desf-wpw', 4, 400)); await L2('  tras desf', [800, 3000]);
  await pon('tv'); console.log('tv estable amio ×6 hits', await accN('amio-tv', 6)); await L2('  amio ×6 (900 mg)', [800, 4000]); console.log('  cv-tv ×6 hits', await accN('cv-tv', 6, 400), 'choquesTV', await page.evaluate(() => window.__ritmo.S.choquesTV)); await L2('  cv ×6', [800, 3000]);
  await page.screenshot({ path: CAP + 'ritmo-02-tv-cv6.png' });
  await pon('fa'); console.log('fa cv-fa ×5 hits', await accN('cv-fa', 5, 400)); await L2('  cv ×5', [800, 3000]);
  await pon('torsade'); for (const k of ['haloperidol', 'claritromicina', 'amiodarona', 'kBajo', 'mgBajo', 'caBajo']) await accN('qt-' + k); await page.waitForTimeout(3000); fila('torsade 6 factores (3 s)', await L());
  console.log('  tdp disabled?', await page.evaluate(() => document.querySelector('[data-acc="tdp"]')?.disabled), 'hits', await accN('tdp', 1)); await page.waitForTimeout(1500);
  console.log('  mg-tdp ×5 hits', await accN('mg-tdp', 5), 'desf-tdp ×5 hits', await accN('desf-tdp', 5, 400)); await L2('  tdp Mg×5 desf×5', [800, 3000]);
  await pon('fv'); await accN('comp'); console.log('fv responde: choque ×1 hits', await accN('choque', 1)); await page.waitForTimeout(2500); fila('  tras 1 choque', await L());
  console.log('  choque ×4 más hits', await accN('choque', 4, 400), 'adre ×15 hits', await accN('adre', 15, 120), 'amio ×5 hits', await accN('amio-pcr', 5, 120));
  await page.waitForTimeout(1500); fila('  tras RCE: choque×4 adre×15 amio×5', await L()); console.log('   parada', await page.evaluate(() => { const p = window.__ritmo.S.parada; return JSON.stringify({ choques: p.choques, rce: p.rce, adre: p.adrenalina.length, amio: p.amio, reloj: Math.round(p.reloj) }); }));
  await page.screenshot({ path: CAP + 'ritmo-03-fv-tras-rce.png' });
  await pon('fv'); await tap('[data-esc="refractaria"]'); await accN('comp'); await accN('choque', 3, 1500); await page.waitForTimeout(1500); fila('fv refractaria 3 choques', await L());
  for (const s of [600, 1800]) { await page.evaluate((s) => window.__ritmo.avanzarHasta(window.__ritmo.simT + s), s); await page.waitForTimeout(800); fila(`  +${s} s de simulación`, await L()); console.log('   reloj parada (min)', await page.evaluate(() => Math.round(window.__ritmo.S.parada.reloj / 60)), 'adre hits', await accN('adre', 3, 100), 'choque hits', await accN('choque', 3, 300)); }
  await pon('aesp'); await accN('comp'); console.log('aesp adre ×10 hits', await accN('adre', 10, 120), 'choque hits', await accN('choque', 1)); await page.evaluate(() => window.__ritmo.avanzarHasta(window.__ritmo.simT + 1200)); await page.waitForTimeout(800); fila('  aesp +1200 s', await L()); console.log('   reloj parada (min)', await page.evaluate(() => Math.round(window.__ritmo.S.parada.reloj / 60)), 'rce', await page.evaluate(() => window.__ritmo.S.parada.rce));
  console.log('RITMO errores', errores.length, errores.slice(0, 4).join(' | '), 'desborde', await desb(), 'NaN', await nan());
}
await browser.close();

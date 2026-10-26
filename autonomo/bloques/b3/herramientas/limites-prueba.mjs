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
  const R = () => page.evaluate(() => { const c = window.__cabecera, r = c.R, L = c.cab.lectura; return { est: document.querySelector('#frase-txt .estado')?.textContent, pa: `${r.pas}/${r.pad}`, pam: r.pam, fc: r.fc, pvc: r.pvc, pcp: r.pcp, ic: r.ic, irvs: r.irvs, spo2: r.spo2, lact: r.lact, diur: r.diur, edema: Math.round(L.edema || 0), cris: c.cab.infundido.cris, crisT: c.cab.infundido.crisTotal, sangre: c.cab.infundido.sangre, h: c.est.horas, sello: !document.getElementById('sello').hidden, aviso: !!document.querySelector('.consola-aviso') }; });
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
  console.log('SHOCK errores', errores.length, errores.slice(0, 3).join(' | '), 'desborde', await desb(), 'NaN', await nan());
}

if (QUE === 'pulmon' || QUE === 'todo') {
  await ir('b3-pulmon'); await page.waitForTimeout(1800);
  const C = () => page.evaluate(() => { const g = (k) => document.querySelector(`[data-fila="${k}"]`)?.textContent.replace(/\s+/g, ' ').trim().slice(0, 28); const o = {}; for (const k of ['pico', 'meseta', 'pres', 'peeptot', 'cstat', 'dp', 'vtkg', 'vm', 'ie', 'vt', 'flujofin']) o[k] = g(k); o.consola = document.getElementById('consola')?.hidden ? '-' : document.getElementById('consola')?.textContent.replace(/\s+/g, ' ').slice(0, 140); return o; });
  const M = async (k, v) => { const r = await range(`input[data-m="${k}"]`, v, ['input']); await page.waitForTimeout(1500); return r; };
  const btn = async (k, v) => { await tap(`button[data-m="${k}"]${v ? `[data-v="${v}"]` : ''}`); await page.waitForTimeout(1500); };
  const pest = (p) => tap(`[data-pest="${p}"]`);
  for (const pac of ['rafael', 'isidro', 'jacinto', 'eulalia']) {
    await tap(`[data-pac="${pac}"]`); await page.waitForTimeout(1800); fila(`${pac} base`, await C());
    await pest('resp'); await btn('modo', 'vcv'); await M('vt', 800); await M('fr', 35); await M('peep', 20); await M('flujo', 30); await M('pmax', 70); fila(`  VCV Vt800 FR35 PEEP20 Q30 pmax70`, await C());
    await M('pmax', 30); fila(`  …pmax 30`, await C());
    await M('vt', 200); await M('fr', 8); await M('peep', 0); fila(`  VCV Vt200 FR8 PEEP0`, await C());
    await btn('modo', 'pcv'); await M('pinsp', 30); await M('peep', 20); await M('fr', 35); await M('ie', 1); fila(`  PCV Pi30 PEEP20 FR35 I:E1`, await C());
    await pest('pulmon'); await M('c', 15); await M('r', 40); await btn('fesp', '3'); fila(`  …C15 R40 esp×3`, await C());
    await M('c', 100); await M('r', 2); await btn('fesp', '1'); fila(`  …C100 R2`, await C());
    await pest('man'); await btn('pausa'); await btn('oclusion'); fila(`  …pausa+oclusión`, await C()); await btn('pausa'); await btn('oclusion');
    console.log('  desborde', await desb(), 'NaN', await nan());
  }
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
  console.log('RITMO errores', errores.length, errores.slice(0, 4).join(' | '), 'desborde', await desb(), 'NaN', await nan());
}
await browser.close();

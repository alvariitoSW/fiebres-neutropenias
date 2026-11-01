// Prueba de navegador del eje hormonal vivo (juez de autonomo/jueces.mjs --modelo eje-vivo). A 390 y 360 px:
// desborde, rótulos (HTML y SVG ≥8 px en pantalla) y solape de <text>; dock ≤1/3 de la pantalla (cerrado y abierto); BARRIDO DE EXTREMOS (cada mando en mínimo, medio
// y máximo en cada paciente que lo usa, y repetido hasta su tope con el botón real → constantes de paciente posible o sello); 42 PARES de cambio de paciente sin sellos
// residuales; cifras de R2 7 y 8 (reloj y PAM); cada cita de la guía y de cada tope con su «Ver en la ficha» a un párrafo que existe; botones que no se rehacen;
// «Ver el mapa», PA «?», Fig. 51.1, enlaces de la ficha con su «← VOLVER». Consola limpia.
// Uso: node autonomo/pruebas/eje-vivo.mjs <url-base> [390|360] [--capturas <carpeta>]
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { mkdirSync } from 'node:fs';
const args = process.argv.slice(2);
const BASE = (args.find(a => /^https?:/.test(a)) || 'http://localhost:8000/').replace(/\/?$/, '/');
const CAP = args.includes('--capturas') ? args[args.indexOf('--capturas') + 1].replace(/\/?$/, '/') : '/tmp/plan-socialista/b6b/eje1b/';
mkdirSync(CAP, { recursive: true });
const CL = ['toribio', 'bibiana', 'sinforoso', 'lucrecia', 'obdulia', 'policarpo', 'fulgencio'];
let total = 0; const fallos = [], errores = []; const ok = (c, m) => { total++; if (!c) fallos.push(m); };
const b = await chromium.launch();
try {
for (const ANCHO of (args.find(a => /^\d+$/.test(a)) ? [+args.find(a => /^\d+$/.test(a))] : [390, 360])) {
  console.log(`\n===== ${ANCHO} px =====`);
  const ctx = await b.newContext({ ...devices['iPhone 12'], viewport: { width: ANCHO, height: 844 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  p.on('console', (m) => m.type() === 'error' && errores.push(m.text())); p.on('response', (r) => r.status() >= 400 && errores.push('HTTP ' + r.status() + ' ' + r.url())); p.on('pageerror', (e) => errores.push('pageerror ' + e.message));
  await p.goto(BASE + 'index.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(1200);
  const abrir = (c) => p.evaluate((c) => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'ejeVivo', ejeVivo: c }); document.body.appendChild(t); t.click(); t.remove(); }, c);
  await abrir('toribio'); await p.waitForTimeout(700);
  const ir = (o) => p.evaluate((o) => window.__eje.ir(o), o);
  const L = () => p.evaluate(() => window.__eje.leer());
  const tp = () => p.evaluate(() => window.__eje.topes().map((t) => t.c + ':' + t.n).sort().join(' '));
  const sel = () => p.evaluate(() => [...document.querySelectorAll('#eje-sello-zona .tope-sello')].filter((e) => !e.hidden && !e.classList.contains('cola')).length);
  const nAv = () => p.evaluate(() => document.querySelectorAll('#eje-avisos-zona .tope-aviso').length);
  const apag = () => p.evaluate(() => [...document.querySelectorAll('#eje-dock button')].filter((e) => e.disabled).map((e) => e.id || e.textContent.trim()).sort().join('|'));
  const desb = async (t) => { const d = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); ok(d <= 0, `${ANCHO}: desborde ${d}px en ${t}`); };
  const rotulos = async (t) => { const m = await p.evaluate(() => { const sv = document.getElementById('eje-svg'), esc = sv.getBoundingClientRect().width / 390; let min = 99;
      const tx = [...sv.querySelectorAll('text')].filter((x) => x.textContent.trim()); tx.forEach((x) => { const f = parseFloat(getComputedStyle(x).fontSize) * esc; if (f < min) min = f; });
      const bb = tx.map((x) => ({ t: x.textContent, r: x.getBBox() })), pisa = [];
      for (let i = 0; i < bb.length; i++) for (let j = i + 1; j < bb.length; j++) { const a = bb[i].r, c = bb[j].r; if (a.x < c.x + c.width - 1 && c.x < a.x + a.width - 1 && a.y < c.y + c.height - 1.5 && c.y < a.y + a.height - 1.5) pisa.push(bb[i].t + ' × ' + bb[j].t); }
      let mh = 99; document.querySelectorAll('#eje-raiz *').forEach((x) => { if (!x.offsetParent || x.closest('svg') || ![...x.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) return; const f = parseFloat(getComputedStyle(x).fontSize); if (f < mh) mh = f; });
      return { svg: +min.toFixed(1), html: +mh.toFixed(1), pisa }; });
    ok(m.svg >= 8, `${ANCHO}: rótulo SVG ${m.svg}px en ${t}`); ok(m.html >= 8, `${ANCHO}: texto HTML ${m.html}px en ${t}`); ok(m.pisa.length === 0, `${ANCHO}: rótulos que se pisan en ${t}: ${m.pisa.slice(0, 3).join('; ')}`); return m; };
  const dockPx = async (t) => { await p.waitForTimeout(150); const d = await p.evaluate(() => document.getElementById('eje-dock').offsetHeight); ok(d <= 844 / 3, `${ANCHO}: dock ${d}px (>1/3) en ${t}`); return d; };
  const POS = (l) => l.pas >= 40 && l.pas <= 260 && l.pad >= 20 && l.pad <= 150 && l.fc >= 30 && l.fc <= 180 && l.t >= 30 && l.t <= 42 && l.na >= 110 && l.na <= 160 && l.lact >= 0.5 && l.lact <= 20 && l.gluc >= 40 && l.gluc <= 600;
  // ---- inicio, dock y rótulos ----
  await desb('inicio'); console.log('rótulos', JSON.stringify(await rotulos('inicio')));
  console.log('dock', await dockPx('cerrado')); await p.click('#eje-mas'); console.log('dock abierto', await dockPx('abierto'));
  for (const t of ['tiro', 'circ']) { await p.click(`[data-pest="${t}"]`); await dockPx('pestaña ' + t + ' abierto'); } await p.click('#eje-mas');
  await p.screenshot({ path: `${CAP}01-inicio-${ANCHO}.png` });
  // ---- botones que no se rehacen ----
  { await ir({ pac: 'bibiana' }); const ant = await p.evaluate(() => { window.__nodo = document.getElementById('eje-b-vol'); return 1; }); await p.click('#eje-b-vol'); await p.click('[data-a="na+"]');
    ok(await p.evaluate(() => window.__nodo === document.getElementById('eje-b-vol') && window.__nodo.isConnected), 'el botón de suero se rehízo al pintar'); }
  // ---- barrido de extremos ----
  const MANDOS = [['vol', [0, 1500, 3000]], ['na', [0, 0.5, 1]], ['hc', [0, 1]], ['estres', [0, 1, 2, 3]], ['dia', [0, 14, 28]], ['atd', ['ninguno', 'ptu', 'mti']], ['yodo', [false, true]], ['bb', ['ninguno', 'prop', 'meto', 'esmolol']], ['hor', ['ninguna', 'levo', 'lio']], ['crisis', [false, true]], ['pat', ['', 't3tox', 'hipoS']], ['farm', ['amio', 'hep', 'eto', 'keto']], ['acth', [false, true]], ['parada', [false, true]]];
  let casos = 0;
  for (const c of CL) {
    for (const [k, vals] of MANDOS) for (const v of vals) {
      await ir({ pac: c }); const set = { [k]: v }; if (k === 'hc') set.hcD = 0; if (k === 'atd') set.atdD = 0; if (k === 'yodo') { set.atd = 'ptu'; set.yodoD = 0; } if (k === 'bb') set.bbD = 0; if (k === 'hor') set.horD = 0;
      const l = await ir({ set }); casos++;
      const sl = await p.evaluate(() => window.__eje.topes().some((t) => t.n === 'sello'));
      ok(POS(l) || sl, `${ANCHO}: ${c} ${k}=${v}: constantes imposibles sin sello (PA ${l.pas}/${l.pad} FC ${l.fc} T ${l.t} Na ${l.na} lact ${l.lact})`);
      await desb(`${c} ${k}=${v}`);
    }
    // todo al máximo a la vez (cóctel) y un día más
    await ir({ pac: c }); const l2 = await ir({ set: { vol: 3000, na: 1, hc: 1, hcD: 0, estres: 3, dia: 28, atd: 'mti', atdD: 0, yodo: true, yodoD: 0, bb: 'esmolol', bbD: 0, hor: 'levo', horD: 0, crisis: true, parada: true, acth: true } });
    const sl2 = await p.evaluate(() => window.__eje.topes().some((t) => t.n === 'sello')); ok(POS(l2) || sl2, `${ANCHO}: ${c} cóctel máximo: constantes imposibles sin sello (${JSON.stringify(l2)})`);
    // con el botón real, hasta el tope: el mando se apaga y sale el sello
    await ir({ pac: c, set: {} });
    for (const [a, n, sello] of [['vol', 9, 'vol'], ['na+', 14, 'nat'], ['d1', 32, 'dia']]) {
      for (let i = 0; i < n; i++) { const dis = await p.evaluate((a) => document.querySelector(`#eje-dock [data-a="${a}"]`).disabled, a); if (!dis) await p.evaluate((a) => document.querySelector(`#eje-dock [data-a="${a}"]`).click(), a); }
      ok(await p.evaluate((a) => document.querySelector(`#eje-dock [data-a="${a}"]`).disabled, a), `${ANCHO}: ${c} «${a}» sigue vivo tras ${n} toques`); ok((await tp()).includes(sello + ':sello'), `${ANCHO}: ${c} sin sello «${sello}» en el tope`);
      ok(POS(await L()) || (await tp()).includes('sello'), `${ANCHO}: ${c} tras «${a}» al tope: constantes imposibles`); }
    if (c === 'bibiana') { for (let i = 0; i < 5; i++) await p.evaluate(() => { const e = document.querySelector('#eje-dock [data-a="es+"]'); if (!e.disabled) e.click(); }); ok(await p.evaluate(() => document.querySelector('#eje-dock [data-a="es+"]').disabled) && (await tp()).includes('estresMax:sello'), `${ANCHO}: bibiana estrés máximo sin sello/mando apagado`); const l = await L(); console.log(' bibiana estrés 3 sin cobertura:', l.pas + '/' + l.pad, 'PAM', l.pam, 'FC', l.fc); }
    await desb(`${c} al tope`);
  }
  console.log(`barrido: ${casos} casos de un mando + ${CL.length} cócteles + toques hasta el tope`);
  // ---- 42 pares de cambio de paciente ----
  const base = {}; for (const c of CL) { await ir({ pac: c }); base[c] = { tp: await tp(), sel: await sel(), av: await nAv(), ap: await apag(), l: JSON.stringify(await L()) }; }
  let pares = 0;
  for (const a of CL) for (const c of CL) { if (a === c) continue; await ir({ pac: a }); await ir({ set: { vol: 3000, na: 1, hc: 1, hcD: 0, estres: 3, dia: 28, atd: 'mti', atdD: 0, yodo: true, yodoD: 0, bb: 'esmolol', bbD: 0, hor: 'levo', horD: 0, crisis: true, parada: true, acth: true, intento: 'levo', farm: 'eto' } });
    const antes = await sel(); await ir({ pac: c }); await p.waitForTimeout(30); pares++;
    const d = { tp: await tp(), sel: await sel(), av: await nAv(), ap: await apag(), l: JSON.stringify(await L()) };
    ok(JSON.stringify(d) === JSON.stringify(base[c]), `${ANCHO}: par ${a}→${c} con restos: ${JSON.stringify(d).slice(0, 160)} ≠ base ${JSON.stringify(base[c]).slice(0, 160)} (sellos antes ${antes})`); }
  console.log(`pares de cambio de paciente: ${pares} (esperados 42)`); ok(pares === 42, 'no son 42 pares');
  // ---- cifras de R2 7 y 8 ----
  const plan = async (c, acc, dias) => { await ir({ pac: c }); for (const h of acc) await ir({ hacer: h }); if (dias) await ir({ hacer: ['d7'] }); return L(); };
  { await ir({ pac: 'lucrecia' }); const a = await L(); console.log(' Lucrecia día 0:', a.t, a.fc); ok(a.t === 40.8 && a.fc === 152, `Lucrecia día 0: ${a.t}/${a.fc}`);
    const z = await plan('lucrecia', [['atd', 'ptu'], ['yodo'], ['bb', 'prop'], ['hc']], true); console.log(' Lucrecia día 7:', z.t, z.fc, await tp()); ok(z.t === 37.4 && z.fc === 80, `Lucrecia a 7 días ${z.t}/${z.fc} (esperado 37,4/80)`); ok(!(await tp()).includes('tormenta'), 'Lucrecia: el sello de la tormenta no se va');
    await ir({ pac: 'obdulia' }); const o0 = await L(); ok(o0.t === 33.5 && o0.fc === 48 && o0.na === 122, `Obdulia día 0 ${o0.t}/${o0.fc}/${o0.na}`);
    const o = await plan('obdulia', [['hc'], ['levo']], true); console.log(' Obdulia día 7:', o.t, o.fc, o.na); ok(o.t === 36.7 && o.fc === 75 && o.na === 136, `Obdulia a 7 días ${o.t}/${o.fc}/${o.na} (esperado 36,7/75/136)`);
    await ir({ pac: 'toribio' }); const t0 = await L(); ok(t0.lact === 4.2 && t0.pam >= 52 && t0.pam <= 54, `Toribio día 0 lactato ${t0.lact} PAM ${t0.pam}`);
    await ir({ hacer: ['hc'] }); await ir({ hacer: ['d1'] }); await ir({ hacer: ['d1'] }); await ir({ hacer: ['d1'] }); const t3 = await L(); console.log(' Toribio día 3 con hidrocortisona: lactato', t3.lact, 'PAM', t3.pam); ok(t3.lact === 1.6, `Toribio lactato a 3 días ${t3.lact} (esperado 1,6)`);
    await ir({ pac: 'toribio' }); await ir({ set: { vol: 3000 } }); await ir({ set: { na: 1 } }); const t4 = await L(); console.log(' Toribio 3 L + NA 1,0: PAM', t4.pam); ok(t4.pam <= 60 && t4.pam > 53, `Toribio 3 L + NA 1: PAM ${t4.pam} (esperado ≤60)`);
    await ir({ hacer: ['hc'] }); const t5 = await L(); console.log(' Toribio + hidrocortisona: PAM', t5.pam); ok(Math.round(t5.pam) === 74, `Toribio con hidrocortisona: PAM ${t5.pam} (esperado ≥74)`);
    await ir({ pac: 'bibiana' }); const b0 = await L(); ok(b0.pam === 78, `Bibiana PAM ${b0.pam} (78)`); await ir({ set: { estres: 3 } }); const b3 = await L(); ok(b3.pam === 51, `Bibiana con estrés ${b3.pam} (51)`); await ir({ hacer: ['hc'] }); const b4 = await L(); ok(b4.pam >= 78, `Bibiana no se recupera con hidrocortisona: ${b4.pam}`); console.log(' Bibiana 78 →', b3.pam, '→', b4.pam); }
  // ---- retirada de Toribio: apagada mientras haya vasopresor/lactato alto ----
  { await ir({ pac: 'toribio' }); await ir({ hacer: ['hc'] }); ok(await p.evaluate(() => document.getElementById('eje-b-ret').disabled), 'Toribio: «retirar» vivo con NA y lactato alto'); ok((await tp()).includes('retirar:aviso'), 'Toribio: sin aviso «aún no retires»');
    await p.evaluate(() => document.querySelector('[data-g]') && 0); await ir({ set: { na: 0 }, hacer: ['d7'] }); ok(!(await p.evaluate(() => document.getElementById('eje-b-ret').disabled)), 'Toribio: «retirar» sigue apagado con NA 0, lactato bajo'); await p.click('#eje-b-ret'); ok(await p.evaluate(() => window.__eje.s.ret), 'la retirada no se anota'); }
  // ---- PA «?», mapa, guía por paciente con cita doble ----
  await ir({ pac: 'toribio', oculto: true }); ok((await p.textContent('#eje-m-pa')) === '?', 'PA no sale «?» en apuesta'); await ir({ oculto: false }); ok((await p.textContent('#eje-m-pa')) !== '?', 'la PA no vuelve');
  for (const c of CL) {
    await ir({ pac: c }); const n = await p.evaluate(() => window.__eje.s.pac && document.querySelectorAll('#eje-guia').length); let k = 0; let pasos = 0;
    for (let i = 0; i < 5; i++) { const hay = await p.evaluate(() => !document.getElementById('eje-guia').hidden); if (!hay) break; pasos++;
      const r = await p.evaluate(() => { const g = document.getElementById('eje-guia'); const vf = g.querySelector('.ver-ficha'), pdf = g.querySelector('a.cita-pdf'); return { vf: !!vf && !!vf.dataset.resaltar && !!vf.dataset.tab && vf.dataset.especialidad === 'libros' && vf.dataset.view === 'marinoNutricion', pdf: !!pdf && /#page=\d+/.test(pdf.getAttribute('href')), dest: vf ? !!document.querySelector(vf.dataset.resaltar) : false, foco: !!document.querySelector('#eje-svg .foco') }; });
        ok(r.vf && r.pdf && r.dest, `${ANCHO}: ${c} paso ${i + 1}: cita doble rota ${JSON.stringify(r)}`); ok(r.foco, `${ANCHO}: ${c} paso ${i + 1}: sin zona señalada en el dibujo`);
      if (await p.evaluate(() => document.querySelector('[data-g="haz"]') !== null)) { await p.evaluate(() => document.querySelector('[data-g="haz"]').click()); await desb(`${c} hazlo ${i + 1}`); }
      const sig = await p.evaluate(() => { const b = document.querySelector('[data-g="sig"]'); const fin = b.textContent.includes('Cerrar'); b.click(); return fin; }); if (sig) break; }
    ok(pasos >= 3 && pasos <= 5, `${ANCHO}: ${c}: guía de ${pasos} pasos`); await desb('guía ' + c); }
  { await ir({ pac: 'bibiana', paso: 0 }); await p.click('#eje-b-mapa'); ok((await p.evaluate(() => window.__eje.vista)) === 'mapa', 'Ver el mapa no cambia la vista'); await p.waitForTimeout(100); await rotulos('mapa suprarrenal'); await p.screenshot({ path: `${CAP}02-mapa-${ANCHO}.png` });
    await ir({ pac: 'obdulia', vista: 'mapa' }); await rotulos('mapa tiroides'); await p.click('#eje-b-mapa'); ok((await p.evaluate(() => window.__eje.vista)) === 'eje', 'Ver el eje no vuelve'); }
  // ---- topes: cada cita con su «Ver en la ficha» a un párrafo que existe ----
  { const fichas = await p.evaluate(async () => { const m = await import('/js/modules/libros/eje-vivo/modelo.js'); const d = await import('/js/data/eje-vivo-data.js'); const out = []; const P = Object.keys(d.PRES);
      for (const c of P) { const s0 = m.nuevo(c); const variantes = [s0, { ...s0, vol: 3000, na: 1, estres: 3, dia: 28, hc: 1, parada: true, acth: true, crisis: true, bb: 'prop', atd: 'mti', farm: 'eto' }, { ...s0, intento: 'levo' }, { ...s0, intento: 'yodo' }, { ...s0, intento: 'eutiro' }, { ...s0, intento: 'hiperx' }, { ...s0, intento: 'bb', crisis: true }, { ...s0, na: 0.5 }, { ...s0, vol: 2500, estres: 2 }];
        for (const s of variantes) { for (const t of m.topes(s, m.leer(s))) out.push([t.c, t.ficha, t.pag, t.origen, t.n === 'sello' ? t.titulo : '']); } } return out; });
    const claves = new Set(fichas.map((f) => f[0])); console.log(' topes distintos probados:', claves.size, [...claves].sort().join(' '));
    for (const [c, f, pag, origen, titulo] of fichas) { if (pag) ok(f && (await p.evaluate((f) => !!document.getElementById(f), f)), `tope ${c}: la ficha #${f} no existe`); ok(!!origen, `tope ${c}: sin origen`); ok(!/[µμ]/.test(titulo), `tope ${c}: título con «µ»: ${titulo}`); } }
  // ---- sello visible bajo el monitor con consecuencia ----
  await ir({ pac: 'lucrecia', set: { atd: 'mti' } }); await ir({ pac: 'lucrecia' }); await ir({ set: { crisis: true, bb: 'prop' } });
  { const r = await p.evaluate(() => { const m = document.getElementById('eje-monitor').getBoundingClientRect(), s = document.querySelector('#eje-sello-zona .tope-sello:not(.cola)'); return s ? { debajo: s.getBoundingClientRect().top >= m.bottom - 1, txt: s.textContent.length } : null; }); ok(r && r.debajo && r.txt > 20, `sello de asma: ${JSON.stringify(r)}`); }
  await ir({ pac: 'lucrecia', set: { crisis: false } }); await ir({ hacer: ['d7'] }); await p.evaluate(() => scrollTo(0, 0)); await p.screenshot({ path: `${CAP}03-lucrecia-tormenta-${ANCHO}.png` });
  // ---- Fig. 51.1 y enlaces de la ficha con su VOLVER ----
  await p.evaluate(() => { document.getElementById('eje-fig').open = true; document.getElementById('eje-fig-img').scrollIntoView(); }); await p.waitForTimeout(600);
  ok((await p.evaluate(() => document.getElementById('eje-fig-img').naturalWidth)) > 0, 'Fig. 51.1 sin cargar');
  await p.screenshot({ path: `${CAP}04-pie-${ANCHO}.png` });
  { const r = await p.evaluate(async () => { const bs = [...document.querySelectorAll('#panel-marino-nutri-tabs button[data-eje-vivo]')]; return bs.map((x) => x.dataset.ejeVivo); }); ok(r.length === 7, `botones en la ficha: ${r.length}`); }
  await desb('final'); await rotulos('final');
  console.log(`✅ ${total} comprobaciones acumuladas a ${ANCHO} px`);
}
} finally { await b.close(); }
console.log(errores.length ? 'ERRORES ' + [...new Set(errores)].join(' | ') : 'consola limpia');
console.log(fallos.length ? 'FALLOS (' + fallos.length + ')\n' + [...new Set(fallos)].slice(0, 40).join('\n') : 'eje vivo OK');
process.exit(errores.length || fallos.length ? 1 : 0);

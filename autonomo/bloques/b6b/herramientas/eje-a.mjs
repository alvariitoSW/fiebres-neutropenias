// Prueba de la maqueta «eje hormonal · A el termostato hormonal» (390 y 360): desborde, consola, rótulos ≥8 px en pantalla, solapes de <text> en todos los pacientes y estados,
// cada mando llevado a su tope (sello, mando apagado), cifra imposible tecleada, cambio de paciente sin avisos residuales, botones estables, guía/apuesta/error/caso.
// Uso: node eje-a.mjs [ancho]   (servidor en el puerto 8271, cerrado por su número de proceso)
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { spawn } from 'node:child_process';
const RAIZ = new URL('../../../../', import.meta.url).pathname, CAP = '/tmp/plan-socialista/b6b/capturas/eje-a/';
import { mkdirSync } from 'node:fs'; mkdirSync(CAP, { recursive: true });
const srv = spawn('python3', ['-m', 'http.server', '8271'], { cwd: RAIZ, stdio: 'ignore' }); const pid = srv.pid;
await new Promise((r) => setTimeout(r, 900));
const fallos = [], errores = []; const ok = (c, m) => { if (!c) fallos.push(m); };
const b = await chromium.launch();
try {
for (const ANCHO of (process.argv[2] ? [+process.argv[2]] : [390, 360])) {
  console.log(`\n===== ${ANCHO} px =====`);
  const ctx = await b.newContext({ ...devices['iPhone 12'], viewport: { width: ANCHO, height: 800 }, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  p.on('response', (r) => r.status() === 404 && errores.push('404 ' + r.url())); p.on('console', (m) => m.type() === 'error' && errores.push(m.text())); p.on('pageerror', (e) => errores.push('pageerror ' + e.message));
  await p.goto('http://127.0.0.1:8271/autonomo/maquetas/b6b-eje-a.html', { waitUntil: 'networkidle' }); await p.waitForTimeout(700);
  const desb = async (t) => { const d = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); ok(d <= 0, `${ANCHO}: desborde ${d}px en ${t}`); };
  const E = (f, ...a) => p.evaluate(f, ...a);
  const tx = () => E(() => [...document.querySelectorAll('#eje-svg text')].map((t) => { const r = t.getBoundingClientRect(); return { t: t.textContent, x: r.x, y: r.y, w: r.width, h: r.height, fs: parseFloat(getComputedStyle(t).fontSize) * (document.getElementById('eje-svg').getBoundingClientRect().width / 360) }; }));
  const medir = async (et) => { const L = await tx(); for (const a of L) ok(a.fs >= 8, `${ANCHO}: rótulo «${a.t}» ${a.fs.toFixed(1)} px <8 (${et})`);
    for (let i = 0; i < L.length; i++) for (let j = i + 1; j < L.length; j++) { const a = L[i], c = L[j]; const ox = Math.min(a.x + a.w, c.x + c.w) - Math.max(a.x, c.x), oy = Math.min(a.y + a.h, c.y + c.h) - Math.max(a.y, c.y); if (ox > 1.5 && oy > 2) ok(false, `${ANCHO}: se pisan «${a.t}» y «${c.t}» (${et})`); } await desb(et); };
  // 1. cada paciente: solapes, desborde, y su frase
  for (const k of ['tori', 'bibi', 'sinf', 'lucr', 'poli', 'obdu', 'fulg']) { await E((k) => window.__eje.ponerPreset(k), k); await p.waitForTimeout(150); await medir('paciente ' + k); }
  // 2. barrido de estados: constantes de un paciente posible y solapes
  const bar = await E(() => { const r = []; for (const gl of ['adr', 'tir']) for (const pat of ['sano', 'graves', 't3', 'hipoP', 'hipoS']) for (const estres of [0, 1, 2, 3]) for (const circi of [false, true]) for (const dias of [0, 14, 365]) for (const farm of ['', 'eto', 'amio']) for (const hc of [false, true]) { window.__eje.ponerPreset('fulg'); window.__eje.set({ gl, pat, estres, circi, dias, farm, hc, hcD: 0, dia: 5, acth: true }); const L = window.__eje.leer(); r.push([gl, pat, estres, circi, dias, farm, hc, L.cort, L.prod, L.t4, L.tsh, L.t, L.fc, L.na_s, L.lac]); } return r; });
  let mal = 0; for (const [gl, pat, e, c, d, f, h, cort, prod, t4, tsh, T, fc, na, lac] of bar) { const ctx2 = `${gl}/${pat}/e${e}/c${c}/d${d}/${f}/hc${h}`; if (!(cort >= 0 && cort <= 60)) { mal++; ok(false, 'cortisol fuera de 0-60 ' + ctx2); } if (prod != null && prod > 350) { mal++; ok(false, 'producción >350 ' + ctx2); } if (!(t4 >= 0.2 && t4 <= 6)) { mal++; ok(false, 't4 fuera ' + ctx2); } if (!(tsh > 0 && tsh <= 100)) { mal++; ok(false, 'tsh fuera ' + ctx2); } if (T < 32 || T > 42 || fc < 40 || fc > 180 || na < 120 || na > 150) { mal++; ok(false, 'constantes ' + ctx2); } }
  console.log(`barrido ${bar.length} estados, malos ${mal}`);
  for (const st of [{ gl: 'adr', estres: 3, circi: true, acth: true }, { gl: 'adr', dias: 365, estres: 1, farm: 'eto', acth: true }, { gl: 'tir', pat: 'graves', estres: 1, at: 'ptu', hc: true }, { gl: 'tir', pat: 'hipoP', estres: 3, levo: true }, { gl: 'tir', pat: 'sano', farm: 'amio' }]) { await E((st) => { window.__eje.ponerPreset('fulg'); window.__eje.set(st); }, st); await medir('estado ' + JSON.stringify(st)); }
  // 3. topes: cada mando al tope
  const claves = async () => (await E(() => window.__eje.topes())).map((t) => t.clave);
  await E(() => window.__eje.ponerPreset('tori')); await E(() => window.__eje.hacer('estres', { v: 0 })); await p.click('#b-estres-mas'); await p.click('#b-estres-mas'); await p.click('#b-estres-mas');
  ok((await claves()).includes('estresMax'), 'estrés al máximo: sin sello 350'); ok(await E(() => document.getElementById('b-estres-mas').disabled), 'estrés máximo: mando no apagado');
  await p.click('[data-gl="adr"]'); await E(() => { const r = document.getElementById('r-dias'); r.value = 365; r.dispatchEvent(new Event('input', { bubbles: true })); }); ok((await claves()).includes('dias365') && await E(() => document.getElementById('r-dias').disabled), 'corticoide 365 d: sin sello o mando no apagado');
  await E(() => window.__eje.ponerPreset('lucr')); await p.click('#dock-panel [data-pest]').catch(() => {}); await E(() => document.getElementById('b-yodo').click()); ok((await claves()).includes('yodo') && await E(() => document.getElementById('b-yodo').disabled), 'yodo sin antitiroideo: sin sello/apagado');
  await E(() => document.getElementById('b-prop').click()); ok((await claves()).includes('prop'), 'propranolol con asma: sin sello');
  await E(() => document.getElementById('b-ptu').click()); ok(!(await claves()).includes('yodo') && !(await E(() => document.getElementById('b-yodo').disabled)), 'tras PTU el sello del yodo debía irse y el mando encenderse');
  await E(() => window.__eje.ponerPreset('obdu')); await E(() => document.getElementById('b-levo').click()); ok((await claves()).includes('levo'), 'levotiroxina sin hidrocortisona: sin sello'); await E(() => document.getElementById('b-hc').click()); ok(!(await claves()).includes('levo'), 'con hidrocortisona el sello de la levotiroxina debía irse');
  await E(() => window.__eje.ponerPreset('tori')); await E(() => document.getElementById('b-hc').click()); ok((await claves()).includes('retirar') && await E(() => document.getElementById('b-ret').disabled), 'retirar con vasopresor: sin aviso/apagado'); await E(() => { document.getElementById('b-d7').click(); }); ok(!(await claves()).includes('retirar'), 'pasados los días, retirar debía poder');
  // 4. cifra imposible
  await E(() => window.__eje.ponerPreset('bibi')); await E(() => window.__eje.teclear('c', '99')); ok((await claves()).includes('imposible'), 'cortisol 99: sin sello'); ok((await E(() => window.__eje.leer().cort)) <= 60, 'cortisol 99 se aplicó');
  await E(() => window.__eje.ponerPreset('sinf')); await E(() => window.__eje.teclear('tsh', '500')); ok((await claves()).includes('imposible'), 'TSH 500: sin sello'); await E(() => window.__eje.teclear('tsh', '')); ok(!(await claves()).includes('imposible'), 'TSH vacío: el sello no se limpió');
  // 5. cambio de paciente sin residuos
  const residuos = async (de, a) => { await E((de) => window.__eje.ponerPreset(de), de); await E(() => { document.getElementById('b-yodo').click(); document.getElementById('b-prop').click(); window.__eje.teclear('c', '99'); }).catch(() => {}); await E((a) => window.__eje.ponerPreset(a), a); await p.waitForTimeout(100);
    const esp = await E(() => { const ck = window.__eje.topes().map((t) => t.clave); return ck; }); const dom = await E(() => [...document.querySelectorAll('#sellos [data-tope], #avisos [data-tope], .tope-avisos [data-tope]')].map((n) => n.dataset.tope)); const uniq = [...new Set(dom)];
    ok(!esp.includes('yodo') && !esp.includes('prop') && !esp.includes('imposible'), `${de}→${a}: topes viejos (${esp})`); ok(uniq.every((c) => esp.includes(c)), `${de}→${a}: nodos residuales ${uniq.filter((c) => !esp.includes(c))}`);
    ok(await E((a) => document.getElementById('frase-txt').textContent.startsWith(window.__PRE?.[a] || ''), a)); ok(!(await E(() => document.getElementById('b-yodo').disabled)), `${de}→${a}: yodo sigue apagado`); };
  await residuos('lucr', 'fulg'); await residuos('lucr', 'tori'); await residuos('lucr', 'poli');
  // 6. botones estables
  await E(() => { window.__eje.ponerPreset('lucr'); window.__ids = ['b-hc', 'b-ptu', 'b-yodo', 'b-prop', 'b-d1'].map((i) => document.getElementById(i)); });
  await E(() => { for (const i of ['b-d1', 'b-ptu', 'b-d1', 'b-hc']) document.getElementById(i).click(); window.__eje.ponerPreset('obdu'); }); ok(await E(() => window.__ids.every((e) => e.isConnected && e === document.getElementById(e.id))), 'los botones se rehicieron');
  // 7. guías, apuesta, error, caso
  for (const k of ['tori', 'bibi', 'sinf', 'lucr', 'poli', 'obdu', 'fulg']) { await E((k) => window.__eje.ponerPreset(k), k); const n = await E(() => { let n = 1; const g = document.getElementById('guia'); while (g.querySelector('[data-g="sig"]') && g.querySelector('[data-g="sig"]').textContent.startsWith('Sig')) { if (g.querySelector('[data-g="haz"]')) g.querySelector('[data-g="haz"]').click(); g.querySelector('[data-g="sig"]').click(); n++; } return n; }); ok(n >= 3 && n <= 5, `guía de ${k}: ${n} pasos`); await medir('guía ' + k); }
  await E(() => window.__eje.modoPrueba('apuesta')); ok(await E(() => document.querySelectorAll('#prueba .op').length === 3 && !document.querySelector('#prueba .por')), 'apuesta: opciones'); await medir('apuesta'); await p.screenshot({ path: CAP + `apuesta-${ANCHO}.png` });
  await E(() => document.querySelectorAll('#prueba .op')[1].click()); ok(await E(() => !!document.querySelector('#prueba .por') && !!document.querySelector('#prueba .llevas')), 'apuesta: sin explicación'); ok((await E(() => window.__eje.leer().cort)) === 22, 'apuesta: Bibiana debía dar cortisol 22'); await medir('apuesta contestada');
  await E(() => window.__eje.modoPrueba('error')); await E(() => { document.querySelectorAll('#prueba .ops').forEach((o) => o.querySelector('.op').click()); }); ok(await E(() => !!document.querySelector('#prueba .llevas')), 'error: sin cierre'); await medir('error');
  await E(() => window.__eje.modoPrueba('caso')); for (let i = 0; i < 3; i++) { await E(() => { const o = [...document.querySelectorAll('#prueba .ops')].pop(); o.querySelector('.op').click(); }); await medir('caso paso ' + (i + 1)); if (i < 2) await E(() => [...document.querySelectorAll('#prueba .paso button.prim')].pop().click()); } ok(await E(() => !!document.querySelector('#prueba .llevas')), 'caso: sin cierre');
  await E(() => window.__eje.ponerPreset('tori')); await p.screenshot({ path: CAP + `tori-${ANCHO}.png` }); await E(() => window.__eje.ponerPreset('obdu')); await p.screenshot({ path: CAP + `obdu-${ANCHO}.png`, fullPage: true });
  ok(await E(() => document.querySelector('#fig img').naturalWidth > 0 || document.getElementById('fig').hidden), 'imagen Fig. 51.1');
  await ctx.close();
}
} finally { await b.close(); try { process.kill(pid); } catch {} }
const unicos = [...new Set(errores)]; if (unicos.length) fallos.push('consola: ' + unicos.join(' | '));
console.log(fallos.length ? 'FALLOS (' + fallos.length + '):\n' + [...new Set(fallos)].slice(0, 40).join('\n') : 'TODO EN VERDE');
process.exit(fallos.length ? 1 : 0);

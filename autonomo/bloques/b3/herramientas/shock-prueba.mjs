// Prueba de la maqueta del shock v3 (Playwright móvil): errores, desborde, pacientes × gravedad, mandos, aparatos, guía,
// «¿Qué shock es?», Mayéutica entera y capturas. node prueba.mjs [ancho]
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const ANCHO = +(process.argv[2] || 390), ALTO = ANCHO === 390 ? 844 : 780;
const BASE = 'http://127.0.0.1:8795/autonomo/maquetas/';
const CAP = '/tmp/plan-socialista/b3/capturas-v3/shock/';
const fallos = [], errores = [];
const ok = (cond, msg) => { if (!cond) fallos.push(msg); };
const browser = await chromium.launch();
const ctx = await browser.newContext({ ...devices['iPhone 12'], viewport: { width: ANCHO, height: ALTO }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const page = await ctx.newPage();
page.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()); });
page.on('pageerror', (e) => errores.push('pageerror: ' + e.message));
const desborde = async (tag) => { const d = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); ok(d <= 0, `desborde ${d} px en ${tag}`); };
const R = () => page.evaluate(() => { const c = window.__cabecera; return { ...c.R, estado: document.querySelector('#frase-txt .estado')?.textContent, frase: document.querySelector('#frase-txt')?.textContent, aparato: c.est.aparato, horas: c.est.horas }; });
const tap = async (sel) => { const el = page.locator(sel).first(); await el.scrollIntoViewIfNeeded(); await el.tap(); await page.waitForTimeout(120); };
const cap = async (n) => page.screenshot({ path: `${CAP}${n}-${ANCHO}.png` });
const grav = async (v) => { await page.evaluate((v) => { const d = document.getElementById('d-grav'); d.value = v; d.dispatchEvent(new Event('input')); d.dispatchEvent(new Event('change')); }, v); await page.waitForTimeout(150); };
const minFuente = async () => page.evaluate(() => { let m = 99, who = ''; for (const t of document.querySelectorAll('svg text')) { const r = t.getBoundingClientRect(); if (!r.width || !r.height) continue; const sv = t.ownerSVGElement; const vb = sv.viewBox.baseVal; const esc = vb && vb.width ? sv.getBoundingClientRect().width / vb.width : 1; const fs = parseFloat(getComputedStyle(t).fontSize) * esc; if (fs < m) { m = fs; who = t.textContent.slice(0, 20) + '@' + (sv.id || sv.className.baseVal); } } return [Math.round(m * 10) / 10, who]; });

await page.goto(BASE + 'b3-shock.html', { waitUntil: 'networkidle' }); await page.waitForTimeout(800);
await desborde('inicio'); await cap('00-primera');
const dockH = await page.evaluate(() => document.getElementById('dock').offsetHeight); console.log('dock desplegado', dockH, 'px');
// pacientes × gravedad
const lineas = [];
for (const k of ['mateo', 'amparo', 'aurelio', 'joaquin', 'consuelo']) {
  await tap(`[data-pac="${k}"]`); await page.waitForTimeout(250);
  for (const g of [0, 50, 100]) { await grav(g); await page.waitForTimeout(500); const r = await R(); lineas.push(`${k} g${g}: ${r.estado} · PA ${r.pas}/${r.pad} PAM ${r.pam} FC ${r.fc} PVC ${r.pvc} PCP ${r.pcp} IC ${r.ic} IRVS ${r.irvs} lact ${r.lact} diur ${r.diur}`);
    ok(r.pam >= 40 && r.pam <= 110 && r.ic >= 1.0 && r.fc >= 50 && r.fc <= 175, `${k} g${g} fuera de rango: PAM ${r.pam} IC ${r.ic} FC ${r.fc}`); ok(!/undefined|NaN/.test(r.frase), `${k} g${g}: frase con undefined/NaN`); }
  await desborde(k);
}
console.log(lineas.join('\n'));
// Mateo: hemorragia clase III, 2 L, reloj, sangre
await tap('[data-pac="mateo"]'); await grav(83); await page.waitForTimeout(400); let r = await R(); console.log('Mateo 35 %:', r.estado, r.pas, r.pad, r.fc);
await tap('[data-pest="vol"]'); await tap('[data-vol="2000"]'); await page.waitForTimeout(400); r = await R(); console.log('  +2 L:', r.estado, r.pas, r.pad, r.fc);
await tap('[data-pest="reloj"]'); await tap('[data-h="1"]'); await page.waitForTimeout(400); r = await R(); console.log('  +1 h:', r.estado, r.pas, r.pad, r.fc, 'lact', r.lact); ok(!/clase III/i.test(r.estado) || r.pas < 90 || r.fc > 120, 'Mateo tras 2 L y 1 h sigue llamándose clase III con PA/FC normales');
await tap('[data-pest="vol"]'); await tap('[data-sangre="1000"]'); await page.waitForTimeout(400); r = await R(); console.log('  +1 L sangre:', r.estado, r.pas, r.pad, r.fc);
// Amparo: reloj con PAM baja, NA, UMI
await tap('[data-pac="amparo"]'); await page.waitForTimeout(300); r = await R(); const l0 = r.lact;
await tap('[data-pest="reloj"]'); await tap('[data-h="18"]'); await page.waitForTimeout(400); r = await R(); console.log('Amparo +18 h: lact', l0, '→', r.lact, 'diur', r.diur, 'PAM', r.pam); ok(r.lact > l0 + 1, 'Amparo: el lactato no sube con 18 h de PAM baja');
await tap('[data-pest="grav"]'); await grav(0); await page.waitForTimeout(400); r = await R(); console.log('Amparo g0:', r.estado, 'lact', r.lact, 'h', r.horas); ok(r.lact < 2 || /sin shock/i.test(r.estado), 'Amparo g0 con lactato alto');
await grav(100); await tap('[data-pest="far"]'); await tap('[data-na="25"]'); await page.waitForTimeout(400); r = await R(); console.log('Amparo NA 25:', r.estado, 'PAM', r.pam, 'IRVS', r.irvs);
await tap('[data-far="vaso"]'); await page.waitForTimeout(300); r = await R(); console.log('  + vasopresina PAM', r.pam); await tap('#obj-umi'); await page.waitForTimeout(200); await cap('01-amparo-umi'); await desborde('amparo umi'); await tap('#obj-marino');
// Aurelio: aparatos
await tap('[data-pac="aurelio"]'); await page.waitForTimeout(300); r = await R(); console.log('Aurelio:', r.estado, 'PCP', r.pcp, 'IC', r.ic, 'PAM', r.pam, 'PVC', r.pvc);
await tap('[data-pest="sop"]'); await tap('[data-sop="balon"]'); await page.waitForTimeout(700); r = await R(); console.log('Balón:', r.estado, 'PAM', r.pam, 'pico', r.picoDia);
const plegado = await page.evaluate(() => document.getElementById('dock').classList.contains('dock-plegado')); ok(plegado, 'el dock no se pliega al elegir un aparato');
const dockHp = await page.evaluate(() => document.getElementById('dock').offsetHeight); console.log('dock plegado', dockHp, 'px'); ok(dockHp <= 160, `dock plegado mide ${dockHp} px`);
await cap('02-balon'); await desborde('balón'); const mf = await minFuente(); console.log('fuente mínima SVG', mf); ok(mf[0] >= 7.5, `rótulo SVG de ${mf[0]} px (${mf[1]})`);
await tap('[data-plano="despiece"]'); await page.waitForTimeout(400); await cap('03-balon-despiece'); await tap('[data-plano="dentro"]');
await tap('.dock-asa'); await page.waitForTimeout(200); await tap('[data-sop="impella"]'); await page.waitForTimeout(700); r = await R(); console.log('Impella 3,5:', r.estado, 'bomba', r.imp?.toFixed(1), 'IC', r.ic, 'PCP', r.pcp, 'FC', r.fc);
await page.evaluate(() => { const d = document.getElementById('d-imp'); d.value = 55; d.dispatchEvent(new Event('change')); }); await page.waitForTimeout(600); r = await R(); console.log('Impella 5,5:', r.estado, 'bomba', r.imp?.toFixed(1), 'de', r.impPide, 'IC', r.ic, 'PCP', r.pcp, 'FC', r.fc, 'PAM', r.pam);
ok(!(r.pam < 60 && r.fc < 90), 'Impella 5,5: FC baja con PAM <60'); await cap('04-impella-55');
await page.evaluate(() => { const d = document.getElementById('d-imp'); d.value = 25; d.dispatchEvent(new Event('change')); }); await page.waitForTimeout(600); r = await R(); console.log('Impella 2,5:', r.estado, 'FC', r.fc, 'PAM', r.pam);
await tap('[data-total="1"]'); await page.waitForTimeout(900); r = await R(); console.log('Gasto total:', r.estado, 'total', r.gcTotal?.toFixed(1), 'bomba', r.imp?.toFixed(1)); await tap('[data-total="1"]');
await tap('.dock-asa'); await tap('[data-sop="ecmo"]'); await page.waitForTimeout(700);
const minE = await page.evaluate(() => document.getElementById('d-ecmo').min); ok(minE === '10', `ECMO min ${minE}`);
for (const f of [10, 30, 60]) { await page.evaluate((f) => { const d = document.getElementById('d-ecmo'); d.value = f; d.dispatchEvent(new Event('change')); }, f); await page.waitForTimeout(600); r = await R(); console.log(`ECMO ${f / 10}:`, r.estado, 'flujo', r.ecmo?.toFixed(1), 'PAM', r.pam, 'PCP', r.pcp, 'IC', r.ic, 'SpO2', r.spo2, 'ao', r.aoAbre + '/' + r.aoDe); ok(r.pam <= 115 && r.ic <= 4.2, `ECMO ${f / 10}: PAM ${r.pam} IC ${r.ic}`); }
for (const v of ['balon', 'impella', 'drenaje']) { await tap(`[data-vent="${v}"]`); await page.waitForTimeout(700); r = await R(); console.log(`  venteo ${v}:`, r.estado, 'PAM', r.pam, 'PCP', r.pcp, 'IC', r.ic, 'total', r.gcTotal?.toFixed(1)); ok(r.pam <= 115 && r.gcTotal <= 7.5, `venteo ${v}: PAM ${r.pam} total ${r.gcTotal}`); }
await cap('05-ecmo-venteo'); await desborde('ecmo'); await tap('[data-plano="despiece"]'); await page.waitForTimeout(300); await cap('06-ecmo-despiece'); await tap('[data-plano="recorrido"]'); await page.waitForTimeout(500); await tap('[data-plano="dentro"]');
// cuña y guía
await tap('#enclavar'); await page.waitForTimeout(300); await cap('07-cuna'); await tap('#enclavar');
await tap('#btn-guia'); await page.waitForTimeout(400); await cap('08-guia'); await desborde('guía'); for (let i = 0; i < 5; i++) { const b = page.locator('#guia-sig'); if (!(await b.count())) break; await b.tap(); await page.waitForTimeout(200); }
await page.evaluate(() => document.getElementById('guia-x')?.click()); await page.waitForTimeout(300);
// Joaquín: sellos
await tap('.dock-asa').catch(() => {}); await page.evaluate(() => document.querySelector('[data-pac="joaquin"]')?.click()); await page.waitForTimeout(300); await tap('[data-pest="sop"]'); await tap('[data-sop="balon"]'); await page.waitForTimeout(500); r = await R(); console.log('Joaquín balón:', r.estado); ok(/no lleva/i.test(r.estado), 'Joaquín sin sello');
// ¿Qué shock es?
await tap('#modo-qs'); await page.waitForTimeout(600); await desborde('qs'); await cap('09-qs');
for (let i = 0; i < 3; i++) { await tap('[data-qs="septico"]'); await tap('#qs-mas'); await page.waitForTimeout(500); await tap('#qs-mas'); await page.waitForTimeout(400); await tap('#qs-resp'); await page.waitForTimeout(300); if (i === 0) await cap('10-qs-resp'); await desborde('qs ' + i); await tap('#qs-sig'); await page.waitForTimeout(400); }
// Mayéutica entera: siempre la correcta (y una fallada para el repaso)
await tap('#modo-may'); await page.waitForTimeout(600); await cap('11-may-g1'); await desborde('may');
const tapado = await page.evaluate(() => !document.getElementById('velo-mon').hidden); ok(tapado, 'G1 no tapa el monitor antes de predecir');
let pasos = 0, comprobados = 0;
while (pasos < 40) {
  pasos++;
  const z = page.locator('#zona-may');
  if (await z.locator('h2:has-text("Lo que te llevas")').count()) break;
  if (await page.locator('[data-acc="ops"]').count()) await tap('[data-acc="ops"]');
  if (await page.locator('#ops button').count()) {
    const ops = await page.evaluate(() => [...document.querySelectorAll('#ops button')].map((b) => b.textContent));
    const html = await page.evaluate(() => document.getElementById('zona-may').innerHTML); ok(!/porque|"ok"|ok:true/.test(html), `paso ${pasos}: la respuesta está en el HTML`);
    const i = pasos === 4 ? 0 : (await page.evaluate(() => { const c = window.__cabecera; return 0; }), 0);
    // elegir la correcta leyendo el modelo de datos (no el HTML): la primera salvo en el paso 4 (una fallada para el repaso)
    const corr = await page.evaluate(() => { const D = window.__cabecera.D; const txt = [...document.querySelectorAll('#ops button')].map((b) => b.textContent); const todas = [...D.PREGUNTAS, ...D.CASO.pasos]; for (const q of todas) { const o = typeof q.opciones === 'function' ? null : q.opciones; if (!o) continue; const k = o.findIndex((x) => x.ok); if (k >= 0 && txt.includes(o[k].t)) return txt.indexOf(o[k].t); } return -1; });
    const elegir = pasos === 4 ? (corr === 0 ? 1 : 0) : (corr >= 0 ? corr : 3);
    await page.locator('#ops button').nth(elegir).tap(); await page.waitForTimeout(300);
    const txt = await page.evaluate(() => document.getElementById('q-res').textContent); ok(!/undefined/.test(txt), `paso ${pasos}: «undefined» en la respuesta`);
    if (pasos === 2) await cap('12-may-respuesta');
  } else if (await page.locator('#frases button').count()) { await page.locator('#frases button').nth(0).tap(); await page.locator('#frases button').nth(3).tap(); await tap('[data-acc="corregir"]'); await page.waitForTimeout(200); await tap('[data-buena]').catch(() => {}); }
  else if (await page.locator('[data-acc="destapar"]').count()) { await tap('[data-acc="destapar"]'); await page.waitForTimeout(200); for (const b of await page.locator('[data-tenia]').all()) await b.tap(); await tap('[data-acc="destapado"]'); }
  if (await page.locator('[data-acc="comprueba"]').count()) { await tap('[data-acc="comprueba"]'); await page.waitForTimeout(500); comprobados++; const ad = await page.evaluate(() => document.querySelector('.antes-despues')?.textContent || ''); console.log(`  comprueba ${comprobados}: ${ad}`); ok(ad.length > 0 && !/undefined|—/.test(ad), `comprueba ${comprobados} sin cifras`); if (comprobados === 2) await cap('13-may-comprueba'); }
  await desborde('may paso ' + pasos);
  if (await page.locator('[data-acc="sig"]').count()) await tap('[data-acc="sig"]'); else break;
  await page.waitForTimeout(300);
}
console.log('Mayéutica: pasos', pasos, 'comprobaciones', comprobados); ok(pasos >= 15 && pasos < 40, `Mayéutica: ${pasos} pasos`);
await cap('14-may-final'); await desborde('may final');
await tap('[data-acc="modelo"]'); await page.waitForTimeout(600); await desborde('vuelta al modelo');
// las otras dos maquetas abren sin errores
for (const m of ['b3-ritmo', 'b3-receptor']) { const p2 = await ctx.newPage(); const e2 = []; p2.on('console', (x) => { if (x.type() === 'error') e2.push(x.text()); }); p2.on('pageerror', (e) => e2.push(e.message)); await p2.goto(BASE + m + '.html', { waitUntil: 'networkidle' }); await p2.waitForTimeout(1200); const d = await p2.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); console.log(m, 'errores', e2.length, 'desborde', d); ok(e2.length === 0 && d <= 0, `${m}: ${e2.join(' | ')} desborde ${d}`); await p2.close(); }
await browser.close();
console.log('\nERRORES DE CONSOLA:', errores.length, errores.slice(0, 5));
console.log('FALLOS:', fallos.length); for (const f of fallos) console.log(' ✗', f);
process.exit(fallos.length || errores.length ? 1 : 0);

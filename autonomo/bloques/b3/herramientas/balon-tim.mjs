// Prueba de los 4 errores de temporización del balón (consola del shock vivo). node balon-tim.mjs [ancho] [carpeta-capturas]  (PUERTO=8871)
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const ANCHO = +(process.argv[2] || 390), CAP = process.argv[3] || '/tmp/plan-socialista/fuentes-b3/capturas/';
const URL = `http://127.0.0.1:${process.env.PUERTO || 8871}/`;
const b = await chromium.launch(), p = await (await b.newContext({ viewport: { width: ANCHO, height: 844 }, deviceScaleFactor: 2 })).newPage();
const err = [], fallos = []; p.on('console', (m) => { if (m.type() === 'error' && !/favicon/.test(m.text())) err.push(m.text()); }); p.on('pageerror', (e) => err.push(e.message));
const ok = (c, t) => { if (!c) fallos.push(t); };
await p.goto(URL, { waitUntil: 'networkidle' }); await p.waitForTimeout(600);
await p.evaluate(() => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'shockVivo', shockVivo: 'balon' }); document.body.append(t); t.click(); t.remove(); }); await p.waitForTimeout(1500);
const tipos = ['ok', 'infPre', 'infTar', 'desPre', 'desTar'];
for (const k of tipos) {
  await p.evaluate((k) => document.querySelector(`#shv-iabp [data-tim="${k}"]`).click(), k); await p.waitForTimeout(4500);
  const r = await p.evaluate(() => { const c = window.__shvPruebas().cab, L = c.lectura, q = (s) => document.querySelector(s); const bt = [...document.querySelectorAll('#shv-iabp [data-tim]')].map((e) => { const r = e.getBoundingClientRect(); return [e.dataset.tim, e.getAttribute('aria-pressed'), Math.round(r.height), Math.round(r.right)]; });
    return { pas: L.u.pas, pad: L.u.pad_, pam: L.u.pam, fc: L.u.fc, pico: L.picoDia, picoNo: L.picoNo, tele: L.teleDia, teleNo: L.teleNo, sis: L.sisPropia, d: q('#iabp-pa')?.getAttribute('d')?.length, linea: q('#iabp-tim').innerText.slice(0, 60), enlace: q('#iabp-tim a')?.getAttribute('href'), bt, ancho: innerWidth, desb: document.documentElement.scrollWidth - innerWidth }; });
  console.log(k, JSON.stringify({ ...r, bt: undefined, linea: r.linea }));
  ok(r.bt.filter((x) => x[1] === 'true').map((x) => x[0]).join() === k, k + ': botón pulsado'); ok(r.bt.every((x) => x[2] >= 44 && x[3] <= r.ancho), k + ': botones <44 px o fuera'); ok(r.desb <= 0, k + ': desborde ' + r.desb);
  ok(r.pam > 40 && r.pam < 130 && r.pas < 190 && r.pad > 30 && r.pico < 190, k + ': cifras imposibles');
  ok(k !== 'ok' ? r.linea.toLowerCase().startsWith(({ infPre: 'inflado precoz', infTar: 'inflado tardío', desPre: 'desinflado precoz', desTar: 'desinflado tardío' })[k]) : true, k + ': línea no cambia');
  await p.evaluate(() => document.getElementById('shv-iabp').scrollIntoView({ block: 'start' })); await p.waitForTimeout(300);
  await p.screenshot({ path: `${CAP}tim-${k}-${ANCHO}.png` });
}
const txt = await p.evaluate(() => document.getElementById('shv-iabp').innerText); ok(!/NaN|undefined|Infinity/.test(txt), 'NaN en la consola');
ok(err.length === 0, 'consola: ' + err.slice(0, 2).join('|')); console.log(fallos.length ? 'FALLOS\n' + fallos.join('\n') : 'OK'); await b.close(); process.exit(fallos.length ? 1 : 0);

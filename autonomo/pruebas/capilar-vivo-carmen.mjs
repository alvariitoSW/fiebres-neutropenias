// Tope clínico de «Transfundir 1 CH» en Carmen (educacion-app 3, B1). Uso: node capilar-vivo-carmen.mjs <url> [--capturas dir]
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const args = process.argv.slice(2), BASE = (args.find(a => /^https?:/.test(a)) || 'http://localhost:8000/').replace(/\/?$/, '/');
const CAP = args.includes('--capturas') ? args[args.indexOf('--capturas') + 1].replace(/\/?$/, '/') : null;
const b = await chromium.launch(); let malos = 0;
for (const [W, red] of [[390, false], [360, true]]) {
  const ctx = await b.newContext({ viewport: { width: W, height: 844 }, deviceScaleFactor: 2, reducedMotion: red ? 'reduce' : 'no-preference' });
  const p = await ctx.newPage(); const err = [];
  p.on('console', m => { if (m.type() === 'error' && !/favicon/.test(m.text())) err.push(m.text()); }); p.on('pageerror', e => err.push(e.message));
  const ok = (c, t) => { console.log(`${c ? '✅' : '❌'} ${W}: ${t}`); if (!c) malos++; };
  await p.goto(BASE + 'index.html'); await p.waitForFunction(() => window.__cpvPonerCarmen);
  await p.click('#btn-libros'); await p.click('#btn-libro-marino'); await p.click('#lib-pest-vivos'); await p.click('#cpv-menu-libros'); await p.waitForTimeout(500);
  const T = () => p.evaluate(() => { const t = window.__cpvPruebas(), c = id => document.getElementById('cpv-c-' + id)?.querySelector('b')?.textContent;
    return { hb: t.estado.hb, R: t.R, celdas: t.celdas, alveolo: t.estado.alveolo, gc: t.estado.gcFijo, goteando: t.goteando, lupa: t.lupa,
      frase: document.getElementById('cpv-frase').textContent, btn: document.getElementById('cpv-m-transf').disabled,
      avisos: [...document.querySelectorAll('.tope-aviso')].map(e => e.textContent.replace(/\s+/g, ' ').trim()),
      sellos: [...document.querySelectorAll('.tope-sello')].map(e => e.textContent.replace(/\s+/g, ' ').trim()),
      nota: (document.getElementById('cpv-carmen-nota') || {}).hidden === false ? document.getElementById('cpv-carmen-nota').textContent.replace(/\s+/g, ' ') : '',
      desb: document.documentElement.scrollWidth - innerWidth }; });
  const esperar = () => p.waitForFunction(() => !window.__cpvPruebas().goteando, null, { timeout: 5000 }).then(() => p.waitForTimeout(250));
  await p.evaluate(() => window.__cpvPonerCarmen()); await p.waitForTimeout(400);
  let t = await T(); console.log(' Hb', t.hb, JSON.stringify(t.celdas), JSON.stringify(t.R));
  ok(t.hb === 7.4 && !t.btn && !t.avisos.length && !t.sellos.length, 'Carmen: Hb 7,4, mando encendido, sin aviso ni sello'); await p.screenshot({ path: CAP && CAP + `carmen-0-${W}.png` });
  await p.click('#cpv-m-transf'); await esperar(); t = await T(); console.log(' Hb', t.hb, JSON.stringify(t.celdas), JSON.stringify(t.R));
  ok(Math.abs(t.hb - 8.4) < 1e-6 && t.gc != null, `1.ª bolsa: Hb ${t.hb}, gasto quieto ${t.gc}`);
  ok(t.avisos.some(a => /Hb 8,4 · umbrales de las guías: 7 y 8 g\/dL \(p\. 8\)/.test(a)) && !t.sellos.length && !t.btn, `chip sin consejo: ${t.avisos[0]}`);
  ok(t.desb <= 0, 'sin desborde tras la 1.ª'); await p.screenshot({ path: CAP && CAP + `carmen-1-${W}.png` });
  await p.click('#cpv-m-transf'); await esperar(); t = await T(); console.log(' Hb', t.hb, JSON.stringify(t.celdas), JSON.stringify(t.R));
  ok(Math.abs(t.hb - 9.4) < 1e-6 && t.alveolo === 'taco' && t.gc === 7.6, `2.ª bolsa: Hb ${t.hb}, alveolo ${t.alveolo}, gasto ${t.gc}`);
  ok(t.sellos.length === 1 && /TACO/.test(t.sellos[0]) && !t.avisos.length && t.btn, `sello: ${t.sellos[0]} · mando apagado ${t.btn}`);
  ok(t.lupa === 'alveolo', 'lupa del alvéolo abierta');
  ok(t.frase.includes('La transfusión que no hacía falta le ha llenado el pulmón de agua.'), 'frase viva');
  ok(/FR 30/.test(t.nota) && /SpO₂ 86 %/.test(t.nota) && /FC 110/.test(t.nota) && /152\/90/.test(t.nota) && /PVC 16/.test(t.nota) && /ilustrativas/.test(t.nota) && /no dice que dos bolsas/.test(t.nota), 'constantes rotuladas y nota honesta');
  await p.waitForTimeout(700); ok(await p.evaluate(() => { const r = document.getElementById('cpv-carmen-nota').getBoundingClientRect(); return r.bottom <= document.getElementById('cpv-dock').getBoundingClientRect().top + 1; }), 'constantes y nota a la vista, sobre la barra'); ok(t.desb <= 0, 'sin desborde con el sello'); await p.screenshot({ path: CAP && CAP + `carmen-2-${W}.png` });
  await p.evaluate(() => document.getElementById('cpv-m-transf').click()); await p.waitForTimeout(300); t = await T();
  ok(Math.abs(t.hb - 9.4) < 1e-6, 'con el mando apagado no entra otra bolsa');
  // fuera de Carmen, el mando no tiene tope clínico
  await p.evaluate(() => document.querySelector('[data-cpv-estado="normal"]')?.click()); await p.waitForTimeout(300); t = await T();
  ok(!t.sellos.length && !t.avisos.length && !t.btn && t.alveolo === null && !t.nota, 'otro paciente: sin sello, mando libre');
  ok(err.length === 0, 'sin errores de consola ' + err.slice(0, 2).join('|'));
  await ctx.close();
}
await b.close(); process.exit(malos ? 1 : 0);

// Prueba de la lámina de entrada del pulmón vivo. Uso: node lamina.mjs <url-base> <carpeta-capturas>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = process.argv[2].replace(/\/?$/, '/'), OUT = process.argv[3].replace(/\/?$/, '/');
const b = await chromium.launch(); let mal = 0;
for (const [W, red] of [[390, false], [360, true]]) {
  const p = await (await b.newContext({ viewport: { width: W, height: 844 }, deviceScaleFactor: 2, reducedMotion: red ? 'reduce' : 'no-preference' })).newPage();
  const err = []; p.on('console', m => { if (m.type() === 'error' && !/favicon/.test(m.text())) err.push(m.text()); }); p.on('pageerror', e => err.push(e.message));
  const ok = (c, t) => { console.log(`${c ? '✅' : '❌'} ${W}: ${t}`); if (!c) mal++; };
  await p.goto(BASE); await p.waitForTimeout(1500);
  await p.evaluate(() => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'pulmonVivo', pulmonVivo: 'normal-vcv' }); document.body.append(t); t.click(); });
  await p.waitForTimeout(1500);
  await p.evaluate(() => { const d = document.getElementById('pl-det'); d.open = true; d.scrollIntoView(); });
  const des = () => p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  const el = (id) => p.locator('#' + id);
  ok(await el('pl-svg').isVisible(), 'lámina visible');
  await p.screenshot({ path: `${OUT}n1-${W}.png` });
  await el('pl-insp').click(); ok((await p.getAttribute('#pl-aire2', 'width')) === '196', 'inspirar llena la barra');
  const bi = await p.evaluate(() => { const e = document.getElementById('pl-insp'); window.__bi = e; return 1; });
  await el('pl-insp').click(); ok(await p.evaluate(() => window.__bi === document.getElementById('pl-insp')), 'el botón no se rehace');
  await p.click('#pl-regla button[data-k="2"]'); await p.waitForTimeout(400);
  ok(await el('pl-foto').isVisible() && await p.evaluate(() => document.getElementById('pl-foto').naturalWidth > 0), 'Fig. 24.1 carga'); await p.screenshot({ path: `${OUT}n2-${W}.png` });
  await p.click('#pl-regla button[data-k="3"]'); await p.screenshot({ path: `${OUT}n3-${W}.png` });
  ok(!(await p.evaluate(() => document.getElementById('pl-exp').innerText.includes('4 500'))), 'no enseña la cifra antes de contestar');
  await p.click('#pl-ver'); await p.click('#pl-ops button:nth-child(2)'); await p.waitForTimeout(200);
  ok(await p.evaluate(() => document.getElementById('pl-exp').innerText.includes('4 500')), 'explica tras contestar'); await p.screenshot({ path: `${OUT}q-${W}.png` });
  await p.click('#pl-guia-b'); for (let i = 0; i < 3; i++) { await p.click('#pl-guia button[data-d="1"]'); }
  ok(await p.evaluate(() => !!document.querySelector('#pl-memb.foco, #pl-memb .foco, #pl-g3 .foco')), 'la guía señala el dibujo'); await p.screenshot({ path: `${OUT}g-${W}.png` });
  ok(await p.evaluate(() => document.querySelectorAll('[id^="pl-"]').length === new Set([...document.querySelectorAll('[id^="pl-"]')].map(e => e.id)).size), 'ids sin duplicar');
  ok(await des() <= 0, 'sin desborde lateral'); ok(err.length === 0, 'sin errores de consola ' + err.join('|'));
}
await b.close(); process.exit(mal ? 1 : 0);

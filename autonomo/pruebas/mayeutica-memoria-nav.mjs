// Navegador (390 px): río y mar, inicio «Ideas firmes: 0 de T» y línea «Vuelve en…» al contestar. Uso: node … <url> [captura.png]
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = (process.argv[2] || 'http://localhost:8000/').replace(/\/?$/, '/');
const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 390, height: 844 } }); const p = await ctx.newPage();
const err = []; p.on('console', m => { if (m.type() === 'error' && !/favicon/.test(m.text())) err.push(m.text()); }); p.on('pageerror', e => err.push(e.message));
const pulsar = s => p.evaluate(s => document.querySelector(s).click(), s);
await p.goto(BASE + 'index.html'); await p.waitForFunction(() => window.__agvPruebas);
await p.click('#btn-libros'); await p.click('#btn-libro-marino'); await p.click('#lib-pest-vivos'); await p.click('#agv-menu-libros'); await p.waitForTimeout(600);
await pulsar('#agv-modo-preguntas'); await p.waitForTimeout(300);
const ini = await p.innerText('#agv-preg'); console.log(ini.match(/Ideas firmes[^\n]*/)?.[0]);
if (process.argv[3]) await p.screenshot({ path: process.argv[3] + '-inicio.png' });
await pulsar('#agv-preg [data-ir="recorrido"]');
const tipo = await p.evaluate(() => document.querySelector('#agv-preg [data-accion]').dataset.accion); console.log('primera:', tipo);
await pulsar('#agv-preg [data-accion="' + tipo + '"]');
if (tipo === 'ops') await pulsar('#agv-preg [data-op="0"]');
else if (tipo === 'destapa') { await pulsar('#agv-preg [data-accion="puntos"]'); }
await pulsar('#agv-preg [data-accion="comprobar"]').catch(() => {}); await pulsar('#agv-preg [data-accion="comprobar"]').catch(() => {});
await pulsar('#agv-preg [data-accion="corregir"]').catch(() => {});
await p.waitForTimeout(400);
console.log((await p.innerText('#agv-preg')).match(/Vuelve[^\n]*/)?.[0] ?? 'SIN LÍNEA');
console.log('desborde', await p.evaluate(() => document.documentElement.scrollWidth - innerWidth), 'errores', err);
if (process.argv[3]) await p.screenshot({ path: process.argv[3] + '-respuesta.png' });
await b.close();

// Altura de la Mira (Estudiar → Mira) de una ficha a 390 px. Uso: node a4b-mira-altura.mjs http://localhost:PUERTO/ neumo-vni-uso
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = (process.argv[2] || 'http://localhost:8000/').replace(/\/?$/, '/'), TAB = process.argv[3] || 'neumo-vni-uso';
const b = await chromium.launch(); const p = await (await b.newContext({ ...devices['iPhone 12'], viewport: { width: 390, height: 844 } })).newPage();
await p.goto(BASE, { waitUntil: 'networkidle' }); await p.waitForTimeout(800);
await p.evaluate((t) => { const x = document.createElement('button'); Object.assign(x.dataset, { especialidad: 'neumologia', view: 'merinoNeumologia', panel: 'panel-merino-neumo-tabs', tab: t }); document.body.append(x); x.click(); x.remove(); }, TAB);
await p.waitForTimeout(1200);
await p.evaluate((t) => document.querySelector(`#${t} > .vista-toggle button[data-vista="estudiar"]`).click(), TAB); await p.waitForTimeout(300);
await p.evaluate((t) => document.querySelector(`#${t} .est-ir[data-ir-paso="mira"]`)?.click(), TAB); await p.waitForTimeout(900);
console.log(await p.evaluate(() => [...document.querySelectorAll("#neumo-vni-uso .est-paso[data-paso=mira] .vk-panel")].map(e => e.offsetHeight + " " + e.querySelector(".vk-panel-titulo")?.textContent.slice(0,40))));
console.log(await p.evaluate((t) => { const s = document.querySelector(`#${t} .est-paso[data-paso="mira"]`), v = s.querySelector('.vista-visual'); return { paso: s.offsetHeight, visual: v.offsetHeight, ancho: document.documentElement.scrollWidth }; }, TAB));
await b.close();

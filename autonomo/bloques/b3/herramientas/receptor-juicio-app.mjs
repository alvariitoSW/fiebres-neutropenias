// Juicio del profesor (27/10/2026) · receptor vivo en la app. Capturas a 390 px de lo que hay que ver con los ojos
// y medidas en texto de dos decisiones del constructor: (1) el salto a la lupa al tocar un mando y dónde cae la
// explicación de una cifra del monitor; (2) cuánto se ve la lección de cocaína + betabloqueante.
// Uso: node autonomo/bloques/b3/herramientas/receptor-juicio-app.mjs <url-base> <carpeta-capturas>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const [BASE0, CAP0] = process.argv.slice(2);
const BASE = BASE0.replace(/\/?$/, '/'), CAP = CAP0.replace(/\/?$/, '/');
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const p = await ctx.newPage(); const errores = [];
p.on('console', m => { if (m.type() === 'error' && !/favicon/.test(m.text())) errores.push(m.text()); });
p.on('pageerror', e => errores.push('PAGE ' + e.message));
const foto = n => p.screenshot({ path: `${CAP}${n}.png` });
const abrir = est => p.evaluate(est => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'receptorVivo', receptorVivo: est }); document.body.append(t); t.click(); t.remove(); }, est);
const R = () => p.evaluate(() => { const r = window.__receptor.R; return { pam: Math.round(r.pam), pas: Math.round(r.pas), pad: Math.round(r.pad), fc: Math.round(r.fc), ic: +(+r.ic).toFixed(1), irvs: +(+r.irvs).toFixed(1), radio: Math.round(100 * r.radio) }; });
const rect = sel => p.evaluate(s => { const e = document.querySelector(s); if (!e) return null; const r = e.getBoundingClientRect(); return { top: Math.round(r.top), bottom: Math.round(r.bottom), h: Math.round(r.height), hidden: e.hidden, visible: !!e.getClientRects().length }; }, sel);
const deslizar = (k, v) => p.evaluate(([k, v]) => { const i = document.querySelector(`input[data-dosis="${k}"]`); i.value = v; i.dispatchEvent(new Event('input', { bubbles: true })); return i.disabled; }, [k, v]);
const scrollY = () => p.evaluate(() => Math.round(scrollY));

await p.goto(BASE + 'index.html'); await p.waitForFunction(() => document.getElementById('receptor-vivo-view')); await p.waitForTimeout(1500);
// 1. Primera pantalla, llegando desde la ficha de vasopresores
await p.evaluate(() => { document.querySelector('#btn-cardiologia, [data-especialidad="cardiologia"]')?.click(); });
await abrir('na-alta'); await p.waitForTimeout(1800);
await foto('c1-primera'); console.log('c1 primera · estado', await p.evaluate(() => window.__receptor.ST.id), 'R', JSON.stringify(await R()));
console.log('   alturas: dock', (await rect('#rcv-dock')).h, 'frase', (await rect('#rcv-frase')).h, 'ficha-pac top', (await rect('#rcv-ficha-pac')).top, 'fig1 top', (await rect('#rcv-fig1')).top, 'monitor top', (await rect('#rcv-monitor')).top);
// 2. Decisión (1): tocar un mando salta a la lupa. Medimos antes/después.
await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(300);
const y0 = await scrollY(); const antes = await R();
const dis = await deslizar('na', 30); await p.waitForTimeout(900);
const y1 = await scrollY();
console.log('c4 mando NA 25→30 · scrollY', y0, '→', y1, '· fig2', JSON.stringify(await rect('#rcv-fig2')), '· monitor', JSON.stringify(await rect('#rcv-monitor')), '· fig1', JSON.stringify(await rect('#rcv-fig1')), '· deslizador disabled', dis);
console.log('   R', JSON.stringify(antes), '→', JSON.stringify(await R()));
await foto('c4-tras-mando');
// 3. Tope NA 40: sello y deslizador encendido
await deslizar('na', 40); await p.waitForTimeout(1500);
const sellos = await p.evaluate(() => [...document.querySelectorAll('#rcv-raiz .tope-sello')].filter(e => e.getClientRects().length).map(e => e.textContent.replace(/\s+/g, ' ').trim().slice(0, 80)));
console.log('c2 NA 40 · sellos', JSON.stringify(sellos), '· R', JSON.stringify(await R()), '· disabled', await p.evaluate(() => document.querySelector('input[data-dosis="na"]').disabled));
await foto('c2-na40');
// 4. Decisión (1b): tocar una cifra del monitor; ¿dónde cae su explicación?
await deslizar('na', 25); await p.waitForTimeout(600);
await p.evaluate(() => document.querySelector('#rcv-monitor').scrollIntoView({ block: 'start', behavior: 'instant' })); await p.waitForTimeout(300);
const yM = await scrollY();
await p.evaluate(() => document.querySelector('#rcv-monitor [data-fila="irvs"]').click()); await p.waitForTimeout(700);
const det = await rect('#rcv-detalle-fila'), fr = await rect('#rcv-frase'), dk = await rect('#rcv-dock');
console.log('c5 cifra IRVS tocada · scrollY', yM, '→', await scrollY(), '· detalle-fila', JSON.stringify(det), '· frase top', fr?.top, '· dock top', dk?.top, '· viewport 844. ¿Visible?', det && det.top >= 0 && det.bottom <= Math.min(fr?.top ?? 844, dk?.top ?? 844));
console.log('   detalle texto:', await p.evaluate(() => document.querySelector('#rcv-detalle-fila')?.textContent.replace(/\s+/g, ' ').trim().slice(0, 160)));
await foto('c5-cifra-monitor');
// 5. Decisión (2): cocaína + betabloqueante. Fig. 1 antes y después; cifras; lectura; qué cambia en el dibujo.
await abrir('cocaina'); await p.waitForTimeout(1600);
await p.evaluate(() => document.querySelector('#rcv-fig1').scrollIntoView({ block: 'start', behavior: 'instant' })); await p.waitForTimeout(300);
const rc0 = await R(), lect0 = await p.evaluate(() => document.getElementById('rcv-fig1-lect').textContent.replace(/\s+/g, ' '));
const svg0 = await p.evaluate(() => document.querySelector('#rcv-fig1 svg')?.innerHTML.length);
await p.locator('#rcv-fig1').screenshot({ path: `${CAP}c3a-cocaina-fig1-antes.png` });
await p.evaluate(() => document.querySelector('#rcv-dock-explorar button[data-tog="betabloqueante"]').click()); await p.waitForTimeout(1800);
const rc1 = await R(), lect1 = await p.evaluate(() => document.getElementById('rcv-fig1-lect').textContent.replace(/\s+/g, ' '));
console.log('c3 cocaína · antes', JSON.stringify(rc0), lect0, '\n   después', JSON.stringify(rc1), lect1);
console.log('   scrollY tras el interruptor', await scrollY(), '· fig1', JSON.stringify(await rect('#rcv-fig1')), '· fig2', JSON.stringify(await rect('#rcv-fig2')));
console.log('   frase:', await p.evaluate(() => document.getElementById('rcv-frase-txt').textContent.replace(/\s+/g, ' ').trim().slice(0, 300)));
console.log('   monitor celdas:', await p.evaluate(() => [...document.querySelectorAll('#rcv-monitor [data-fila]')].map(c => c.dataset.fila + '=' + c.querySelector('.rcv-g')?.textContent + '[' + c.className.replace(/rcv-celda\s*/, '') + ']').join(' ')));
console.log('   ¿hay algo de coronaria/isquemia en Fig.1?', await p.evaluate(() => /coronaria|isquemia|ST/i.test(document.querySelector('#rcv-fig1').textContent)), '· svg len', svg0, '→', await p.evaluate(() => document.querySelector('#rcv-fig1 svg')?.innerHTML.length));
await p.evaluate(() => document.querySelector('#rcv-fig1').scrollIntoView({ block: 'start', behavior: 'instant' })); await p.waitForTimeout(300);
await p.locator('#rcv-fig1').screenshot({ path: `${CAP}c3b-cocaina-fig1-despues.png` });
await foto('c3c-cocaina-pantalla');
// 6. Mayéutica: G1 con el modelo tapado, y las opciones a la vista
await abrir('na-alta'); await p.waitForTimeout(1200);
await p.evaluate(() => { localStorage.removeItem('receptor-vivo-mayeutica-v1'); });
await p.evaluate(() => document.getElementById('rcv-modo-preguntas').click()); await p.waitForTimeout(500);
await p.evaluate(() => document.querySelector('#rcv-preg [data-ir="recorrido"]').click()); await p.waitForTimeout(500);
const tapados = await p.evaluate(() => ['rcv-fig1', 'rcv-monitor', 'rcv-zona-lupa'].map(i => document.getElementById(i)?.hidden));
await p.evaluate(() => document.querySelector('#rcv-preg [data-accion="ops"]')?.click()); await p.waitForTimeout(400);
console.log('c6 G1 · modelo tapado', JSON.stringify(tapados), '· enunciado:', await p.evaluate(() => document.querySelector('#rcv-preg')?.textContent.replace(/\s+/g, ' ').trim().slice(0, 500)));
await foto('c6-pregunta-g1');
console.log('errores de consola:', errores.length ? errores : 'ninguno');
await b.close();

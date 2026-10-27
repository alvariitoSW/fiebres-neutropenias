// Juicio del profesor sobre «ECG y arritmias» (PIF): primera pantalla, fichas 2, 8, 9 y 11 (ejercicio, error y caso entero).
// Uso: node autonomo/pruebas/pif-ecg-profesor.mjs [carpeta] [ancho]. Devuelve un resumen en texto; las capturas van a la carpeta.
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
const { chromium } = await import('/opt/node22/lib/node_modules/playwright/index.mjs');
const out = process.argv[2] || '/tmp/plan-socialista/pif-ecg/tmp-profesor';
const ancho = Number(process.argv[3] || 390);
mkdirSync(out, { recursive: true });
const puerto = 36000 + Math.floor(Math.random() * 1000);
const srv = spawn('python3', ['-m', 'http.server', String(puerto)], { stdio: 'ignore' });
console.log('PUERTO=' + puerto, 'PID=' + srv.pid);
await new Promise(r => setTimeout(r, 1000));
const nav = await chromium.launch();
const pag = await nav.newPage({ viewport: { width: ancho, height: 844 } });
const errs = [];
pag.on('pageerror', e => errs.push('ERR ' + e.message));
pag.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
const cap = (n, sel) => sel ? pag.locator(sel).first().screenshot({ path: `${out}/${n}.jpg`, type: 'jpeg', quality: 55 }) : pag.screenshot({ path: `${out}/${n}.jpg`, type: 'jpeg', quality: 55 });
const desborde = () => pag.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
const abrir = async (tab) => {
    await pag.evaluate(t => { const b = document.createElement('button'); b.className = 'especialidad-link'; b.dataset.especialidad = 'pifCardio'; b.dataset.view = 'ecgArritmias'; b.dataset.panel = 'panel-pif-ecg-tabs'; b.dataset.tab = t; document.body.append(b); b.click(); b.remove(); }, tab);
    await pag.waitForTimeout(400);
    await pag.evaluate(t => document.querySelectorAll(`#${t} img`).forEach(i => { i.loading = 'eager'; }), tab);
};
const vista = async (tab, v) => { await pag.evaluate(([t, v]) => document.querySelector(`#${t} > .vista-toggle button[data-vista="${v}"]`)?.click(), [tab, v]); await pag.waitForTimeout(500); };
// Medidas de estudio de una ficha en Texto: párrafos largos, resaltes, citas, tablas, figuras, botones al corazón.
const medir = (tab) => pag.evaluate(t => {
    const f = document.getElementById(t); const lh = 20;
    const ps = [...f.querySelectorAll('p')].filter(p => p.offsetParent);
    const largos = ps.filter(p => p.getBoundingClientRect().height > 6.5 * lh).map(p => ({ id: p.id || p.closest('[id]')?.id, lineas: Math.round(p.getBoundingClientRect().height / lh) }));
    return { tab: t, parrafos: ps.length, largos, hl: f.querySelectorAll('.hl, .hl-rojo, .hl-verde, .hl-azul, .hl-purpura').length, strong: f.querySelectorAll('strong').length,
        tablas: f.querySelectorAll('table').length, figuras: f.querySelectorAll('.article-figure img').length, imgsRotas: [...f.querySelectorAll('img')].filter(i => !i.naturalWidth).length,
        pdf: f.querySelectorAll('a.biblio-link[href*=".pdf"]').length, verFicha: f.querySelectorAll('button[data-resaltar]').length, latir: f.querySelectorAll('[data-ritmo-vivo]').length,
        altura: f.scrollHeight, primerBloque: (f.querySelector('.card, .article-figure') || {}).offsetTop };
}, tab);

await pag.goto(`http://localhost:${puerto}/`); await pag.waitForFunction(() => window.__appLista);
await pag.evaluate(() => { document.getElementById('btn-pif').click(); document.getElementById('btn-pif-cardio').click(); document.getElementById('btn-pif-ecg').click(); });
await pag.waitForTimeout(600);
await cap('00-portada');
console.log('PORTADA', JSON.stringify({ desborde: await desborde(), botones: await pag.evaluate(() => [...document.querySelectorAll('#pif-ecg-view .especialidad-link')].slice(0, 2).map(b => b.textContent.trim())), fichas: await pag.evaluate(() => document.querySelectorAll('#panel-pif-ecg-tabs .tab-content').length) }));

// ---- Ficha 2: Texto y Visual con chips + calculadora
await abrir('ecg-f2'); await pag.waitForTimeout(500);
console.log('F2-TEXTO', JSON.stringify(await medir('ecg-f2')));
await pag.evaluate(() => document.getElementById('ecg-f2').scrollIntoView()); await cap('01-f2-texto-arriba');
await vista('ecg-f2', 'visual');
const lect2 = await pag.$$('#ecg-f2 .ecg-lector');
console.log('F2-VISUAL lectores', lect2.length, 'desborde', await desborde());
if (lect2[1]) {
    const chips = await lect2[1].$$('.ecg-chip'); await chips[0].click(); await pag.waitForTimeout(300);
    await lect2[1].scrollIntoViewIfNeeded(); await lect2[1].screenshot({ path: `${out}/02-f2-visual-chip.jpg`, type: 'jpeg', quality: 55 });
    console.log('F2-CHIP', JSON.stringify(await lect2[1].evaluate(e => ({ frase: e.querySelector('.ecg-lector-frase')?.textContent.slice(0, 120), calc: e.querySelector('.ecg-lector-calculo')?.hidden === false ? e.querySelector('.ecg-lector-calculo').textContent.slice(0, 100) : '', verTexto: e.querySelectorAll('button[data-resaltar], .visual-ver-texto, [data-fuente]').length, pag: e.textContent.match(/p\. ?\d+/)?.[0] }))));
}
// Calculadora de FC: 3 métodos y topes
await vista('ecg-f2', 'texto');
const calc = await pag.evaluate(() => { const c = document.getElementById('ecg2-calc'); return c ? { inputs: [...c.querySelectorAll('input, select')].map(i => i.id), res: c.querySelector('#ecg2-calc-resultado')?.textContent.trim().slice(0, 80) } : null; });
console.log('F2-CALC', JSON.stringify(calc));
for (const [mm, qrs, ven] of [['14', '', ''], ['3', '', ''], ['60', '', ''], ['', '7', '5'], ['', '7', '6'], ['', '40', '5']]) {
    try {
        if (mm !== '') { await pag.fill('#ecg2-calc-mm', mm); } else { await pag.fill('#ecg2-calc-mm', ''); }
        if (qrs !== '') { await pag.fill('#ecg2-calc-qrs', qrs); await pag.fill('#ecg2-calc-ventana', ven); } else { await pag.fill('#ecg2-calc-qrs', ''); }
        await pag.waitForTimeout(150);
        console.log('F2-CALC', JSON.stringify({ mm, qrs, ven, res: await pag.$eval('#ecg2-calc-resultado', e => e.textContent.trim().replace(/\s+/g, ' ').slice(0, 160)) }));
    } catch (e) { console.log('F2-CALC fallo', e.message.slice(0, 80)); }
}

// ---- Ficha 8: tarjeta de guardia
await abrir('ecg-f8'); await pag.waitForTimeout(400);
console.log('F8-TEXTO', JSON.stringify(await medir('ecg-f8')));
await pag.evaluate(() => document.getElementById('ecg-guardia-titulo').scrollIntoView()); await cap('03-f8-tarjeta-inicio');
const paso = async (resp) => { const bs = await pag.$$('#ecg-guardia-botones button'); for (const b of bs) { const t = (await b.textContent()).trim().toLowerCase(); if (t.startsWith(resp)) { await b.click(); break; } } await pag.waitForTimeout(150); return pag.$eval('#ecg-guardia-pregunta', e => e.textContent.trim().slice(0, 90)); };
const ruta = ['sí', 'sí', 'sí', 'sí', 'no', 'no']; const trazas = [];
for (const r of ruta) trazas.push(await paso(r));
console.log('F8-RUTA', JSON.stringify(trazas));
console.log('F8-HOJA', JSON.stringify(await pag.evaluate(() => { const r = document.getElementById('ecg-guardia-resultado'); return { visible: r.style.display !== 'none', texto: r.textContent.trim().replace(/\s+/g, ' ').slice(0, 220), verFicha: r.querySelectorAll('[data-resaltar]').length, latir: r.querySelectorAll('[data-ritmo-vivo]').length, dosis: /mg|julio|J\b|adenosina|amiodarona/i.test(r.textContent) }; })));
await pag.evaluate(() => document.getElementById('ecg-guardia').scrollIntoView()); await cap('04-f8-tarjeta-hoja');
// todas las hojas: recorrido exhaustivo por fuerza bruta de sí/no hasta profundidad 9
const hojas = new Set(); let pendientes = [[]]; let n = 0;
while (pendientes.length && n < 80) {
    const camino = pendientes.shift(); n++;
    await pag.click('#ecg-guardia-reset').catch(() => {}); await pag.waitForTimeout(80);
    for (const r of camino) await paso(r);
    const fin = await pag.evaluate(() => document.getElementById('ecg-guardia-resultado').style.display !== 'none');
    if (fin) hojas.add(await pag.$eval('#ecg-guardia-resultado strong', e => e.textContent.trim().slice(0, 60)).catch(() => '?'));
    else if (camino.length < 9) pendientes.push([...camino, 'sí'], [...camino, 'no']);
}
console.log('F8-HOJAS', hojas.size, JSON.stringify([...hojas]));
await vista('ecg-f8', 'visual'); const lect8 = await pag.$$('#ecg-f8 .ecg-lector');
console.log('F8-VISUAL lectores', lect8.length, 'guardia', await pag.$$eval('#ecg-f8 .ecg-comprobar', e => e.length), 'desborde', await desborde());
await vista('ecg-f8', 'texto');

// ---- Ficha 9: EKG 1 con rejilla
await abrir('ecg-f9'); await pag.waitForTimeout(400);
console.log('F9-TEXTO', JSON.stringify(await medir('ecg-f9')));
await vista('ecg-f9', 'visual');
const lect9 = await pag.$$('#ecg-f9 .ecg-lector');
if (lect9[0]) {
    const chips = await lect9[0].$$('.ecg-chip'); const info = [];
    for (let c = 0; c < chips.length; c++) { await chips[c].click(); await pag.waitForTimeout(120); info.push(await lect9[0].evaluate(e => ({ et: e.querySelector('.ecg-chip[aria-pressed="true"]')?.textContent.trim(), frase: e.querySelector('.ecg-lector-frase')?.textContent.slice(0, 90), zonas: e.querySelectorAll('svg rect, svg path, svg polygon').length, rej: !!e.querySelector('.ecg-rejilla, [data-rejilla], svg g') }))); if (c === 1) { await lect9[0].scrollIntoViewIfNeeded(); await lect9[0].screenshot({ path: `${out}/05-f9-ekg1-chip.jpg`, type: 'jpeg', quality: 60 }); } }
    console.log('F9-CHIPS', chips.length, JSON.stringify(info));
}
console.log('F9-VISUAL desborde', await desborde());
await vista('ecg-f9', 'texto');

// ---- Ficha 11: ejercicios, error y caso entero
await abrir('ecg-f11'); await pag.waitForTimeout(500);
console.log('F11-TEXTO', JSON.stringify(await medir('ecg-f11')));
console.log('F11-ESTRUCTURA', JSON.stringify(await pag.evaluate(() => { const f = document.getElementById('ecg-f11'); return { ejercicios: f.querySelectorAll('[id^="ecg-f11-ej-"]').length, errores: f.querySelectorAll('[id^="ecg-f11-error-"]').length, galeria: f.querySelectorAll('#ecg-f11-galeria .card').length, casos: f.querySelectorAll('[id^="ecg-caso-"]').length, toggle: !!f.querySelector('.vista-toggle') }; })));
await pag.evaluate(() => document.getElementById('ecg-f11').scrollIntoView()); await cap('06-f11-arriba');
// Ejercicio 16: chips mal a propósito, opciones, fallo a propósito
await pag.evaluate(() => { const d = document.getElementById('ecg-f11-ej-16'); d.open = true; d.scrollIntoView(); });
await pag.waitForTimeout(400);
const ej = pag.locator('#ecg-f11-ej-16');
const chipsEj = ej.locator('button.quiz-opcion[aria-pressed]');
console.log('EJ16 chips', await chipsEj.count());
await chipsEj.nth(1).click(); await chipsEj.nth(2).click(); await pag.waitForTimeout(100);
console.log('EJ16 frase chips', JSON.stringify(await ej.locator('p[aria-live]').textContent()));
await ej.locator('button:has-text("Ya lo tengo")').click(); await pag.waitForTimeout(100);
const opc = ej.locator('.quiz-opciones button.quiz-opcion:not([aria-pressed])');
console.log('EJ16 opciones', await opc.count(), JSON.stringify(await opc.allTextContents().then(a => a.map(t => t.length))));
await opc.nth(0).click(); await pag.waitForTimeout(200);
console.log('EJ16 tras fallo', JSON.stringify(await ej.evaluate(e => ({ correcta: e.querySelectorAll('.correcta').length, incorrecta: e.querySelectorAll('.incorrecta').length, exp: e.querySelector('.quiz-explicacion')?.textContent.replace(/\s+/g, ' ').slice(0, 160), verFicha: e.querySelectorAll('[data-resaltar]').length, latir: e.querySelectorAll('[data-ritmo-vivo]').length, pdf: e.querySelectorAll('a[href*=".pdf"]').length }))));
await ej.screenshot({ path: `${out}/07-f11-ej16-fallo.jpg`, type: 'jpeg', quality: 55 });
console.log('F11 desborde tras ej', await desborde());
// Error e3: marco una verdadera y una falsa
await pag.evaluate(() => { const d = document.getElementById('ecg-f11-error-e3'); d.open = true; d.scrollIntoView(); });
await pag.waitForTimeout(300);
const er = pag.locator('#ecg-f11-error-e3');
const fr = er.locator('button.quiz-opcion[aria-pressed]');
console.log('E3 frases', await fr.count());
await fr.nth(0).click(); await fr.nth(2).click(); await er.locator('button:has-text("Comprobar")').click(); await pag.waitForTimeout(200);
console.log('E3 tras comprobar', JSON.stringify(await er.evaluate(e => ({ correcta: e.querySelectorAll('.correcta').length, incorrecta: e.querySelectorAll('.incorrecta').length, veredicto: e.querySelector('.quiz-explicacion strong')?.textContent, piensa: e.querySelectorAll('.quiz-explicacion button.quiz-siguiente').length }))));
const piensa = er.locator('.quiz-explicacion button.quiz-siguiente'); const np = await piensa.count();
for (let i = 0; i < np; i++) await piensa.nth(0).click().catch(() => {});
await pag.waitForTimeout(150);
await er.screenshot({ path: `${out}/08-f11-error-e3.jpg`, type: 'jpeg', quality: 55 });
console.log('E3 corrección', JSON.stringify(await er.evaluate(e => e.querySelector('.quiz-explicacion').textContent.replace(/\s+/g, ' ').slice(0, 300))));
// Caso 1 entero (fallo a propósito en el paso 2)
const caso = pag.locator('#ecg-caso-c1'); await caso.scrollIntoViewIfNeeded();
const pasos = [];
for (let k = 0; k < 8; k++) {
    const cab = await caso.locator('p').nth(1).textContent().catch(() => '');
    const tipo = await caso.evaluate(e => e.querySelector('button:has(+ .quiz-opciones)') ? 'test' : (e.querySelector('button.quiz-siguiente:not([hidden])')?.textContent || ''));
    const ver = caso.locator('button:has-text("Ya lo tengo")'); const dest = caso.locator('button:has-text("Ya lo pensé")'); const comp = caso.locator('button:has-text("Comprobar")');
    const chipsC = caso.locator('button.quiz-opcion[aria-pressed]');
    let hecho = '';
    if (await ver.count()) { await ver.click(); const o = caso.locator('.quiz-opciones:not([hidden]) button.quiz-opcion:not([aria-pressed])'); await o.nth(k === 1 ? 0 : 1).click(); hecho = 'test'; }
    else if (await dest.count()) { await dest.click(); await caso.locator('input[type=checkbox]').nth(0).check().catch(() => {}); hecho = 'destapa'; }
    else if (await comp.count()) { await chipsC.nth(2).click(); await comp.click(); hecho = 'error'; const pb = caso.locator('.quiz-explicacion button.quiz-siguiente'); for (let i = 0; i < await pb.count(); i++) await pb.nth(0).click().catch(() => {}); }
    await pag.waitForTimeout(200);
    const est = await caso.evaluate(e => ({ cab: e.querySelectorAll('p')[1]?.textContent.trim(), ficha: e.querySelectorAll('ul li').length, rojo: e.querySelectorAll('ul li .hl-rojo').length, calc: !!e.querySelector('button[data-resaltar*="calc"]'), img: e.querySelectorAll('img').length, verFicha: e.querySelectorAll('[data-resaltar]').length, exp: e.querySelector('.quiz-explicacion')?.textContent.replace(/\s+/g, ' ').slice(0, 120), sig: !!e.querySelector('button.quiz-siguiente:not([hidden]):not(.correcta)') && !e.querySelector('button.quiz-siguiente[hidden]') , llevas: /Lo que te llevas/.test(e.textContent) }));
    pasos.push({ k: k + 1, hecho, ...est });
    if (k === 2) await caso.screenshot({ path: `${out}/09-f11-caso1-paso3.jpg`, type: 'jpeg', quality: 55 });
    const sig = caso.locator('button.quiz-siguiente:has-text("Siguiente")');
    if (await sig.count() && await sig.isVisible()) await sig.click(); else break;
}
pasos.forEach(p => console.log('CASO1', JSON.stringify(p)));
console.log('CASO1 fin', JSON.stringify(await caso.evaluate(e => ({ llevas: [...e.querySelectorAll('.quiz-explicacion ul li')].slice(-3).map(l => l.textContent.slice(0, 60)), vuelta: [...e.querySelectorAll('.quiz-explicacion button')].map(b => b.textContent.trim()).slice(-3), desb: document.documentElement.scrollWidth - document.documentElement.clientWidth }))));
await caso.screenshot({ path: `${out}/10-f11-caso1-fin.jpg`, type: 'jpeg', quality: 55 });
// Caso 2: solo pasos y tipos (sin capturas)
const c2 = await pag.evaluate(() => { const c = document.getElementById('ecg-caso-c2'); return { pasos: c?.querySelectorAll('p')[1]?.textContent, chips: c?.querySelectorAll('button.quiz-opcion[aria-pressed]').length, img: c?.querySelectorAll('img').length }; });
console.log('CASO2 inicio', JSON.stringify(c2));
console.log('ALTURA f11', await pag.evaluate(() => document.getElementById('ecg-f11').scrollHeight), 'desborde', await desborde());
console.log('ERRORES', JSON.stringify(errs.filter(e => !/favicon/.test(e)).slice(0, 8)));
await nav.close(); srv.kill(); process.kill(srv.pid, 'SIGKILL');

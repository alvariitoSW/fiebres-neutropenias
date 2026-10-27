// Prueba de las fichas 4-7 de «ECG y arritmias» (PIF) y de la calculadora de QTc. Uso: node autonomo/pruebas/pif-ecg-b2.mjs [carpeta de capturas]
// Importa ecg-f7.js a mano porque el director aún no ha añadido su import al index.js del módulo.
import { spawn } from 'node:child_process';
const { chromium } = await import('/opt/node22/lib/node_modules/playwright/index.mjs');
const out = process.argv[2] || '/tmp/plan-socialista/pif-ecg/b2-caps';
const puerto = 35000 + Math.floor(Math.random() * 1000);
const srv = spawn('python3', ['-m', 'http.server', String(puerto)], { stdio: 'ignore' });
console.log('PUERTO=' + puerto, 'PID=' + srv.pid);
await new Promise(r => setTimeout(r, 1000));
const nav = await chromium.launch();
let fallos = 0;
for (const ancho of [390, 360]) {
    const pag = await nav.newPage({ viewport: { width: ancho, height: 844 } });
    const errs = []; pag.on('pageerror', e => errs.push(e.message)); pag.on('console', m => m.type() === 'error' && errs.push(m.text()));
    await pag.goto(`http://localhost:${puerto}/`); await pag.waitForFunction(() => window.__appLista);
    await pag.evaluate(() => document.getElementById('btn-pif').click());
    await pag.evaluate(() => document.getElementById('btn-pif-cardio').click());
    await pag.evaluate(() => document.getElementById('btn-pif-ecg').click());
    await pag.evaluate(() => import('/js/modules/pif-cardio/ecg-f7.js').then(m => m.init()));
    for (const n of [4, 5, 6, 7]) {
        await pag.evaluate(t => {
            const b = document.createElement('button'); b.className = 'especialidad-link';
            b.dataset.especialidad = 'pifCardio'; b.dataset.view = 'ecgArritmias'; b.dataset.panel = 'panel-pif-ecg-tabs'; b.dataset.tab = t;
            document.body.append(b); b.click(); b.remove();
        }, `ecg-f${n}`);
        await pag.waitForTimeout(500);
        const r = await pag.evaluate(n => {
            const t = document.getElementById(`ecg-f${n}`);
            const imgs = [...t.querySelectorAll('img')];
            imgs.forEach(i => { i.loading = 'eager'; });
            return {
                activa: t.classList.contains('active') && t.offsetParent !== null,
                desborde: document.documentElement.scrollWidth - document.documentElement.clientWidth,
                construccion: t.textContent.includes('En construcción'),
                imgs: imgs.length,
                botones: [...t.querySelectorAll('[data-ritmo-vivo]')].map(b => b.dataset.ritmoVivo),
            };
        }, n);
        await pag.waitForTimeout(400);
        const malas = await pag.evaluate(n => [...document.querySelectorAll(`#ecg-f${n} img`)].filter(i => !i.naturalWidth).map(i => i.src), n);
        const rot = await pag.evaluate(n => [...document.querySelectorAll(`#ecg-f${n} svg text`)].map(x => parseFloat(getComputedStyle(x).fontSize) * x.getScreenCTM().a).filter(v => v < 7.5), n);
        const ok = r.activa && r.desborde <= 0 && !r.construccion && !malas.length && !rot.length;
        if (!ok) fallos++;
        console.log(ancho, `f${n}`, ok ? 'OK' : 'FALLO', JSON.stringify({ ...r, malas, rotulosPequeños: rot }));
        if (ancho === 390) await pag.screenshot({ path: `${out}/f${n}.png`, fullPage: true });
    }
    if (ancho === 390) {
        await pag.evaluate(() => document.getElementById('ecg-f7-calc').scrollIntoView());
        await pag.fill('#ecg-f7-calc-qt-mm', '9'); await pag.fill('#ecg-f7-calc-rr-mm', '20');
        console.log('QTc 9/20:', await pag.innerText('#ecg-f7-calc-resultado'));
        await pag.fill('#ecg-f7-calc-qt-mm', '9.5'); await pag.fill('#ecg-f7-calc-rr-mm', '16');
        console.log('QTc 9,5/16:', await pag.innerText('#ecg-f7-calc-resultado'));
        await pag.fill('#ecg-f7-calc-qt-mm', '12'); await pag.fill('#ecg-f7-calc-rr-mm', '16');
        console.log('QTc 12/16:', await pag.innerText('#ecg-f7-calc-resultado'));
        await pag.fill('#ecg-f7-calc-qt-mm', '99'); await pag.fill('#ecg-f7-calc-rr-mm', '6');
        console.log('tope:', await pag.innerText('#ecg-f7-calc-resultado'));
        await pag.fill('#ecg-f7-calc-qt-mm', '');
        console.log('vacío:', await pag.innerText('#ecg-f7-calc-resultado'));
        await pag.fill('#ecg-f7-calc-qt-mm', '9'); await pag.fill('#ecg-f7-calc-rr-mm', '20');
        await pag.screenshot({ path: `${out}/calc.png` });
    }
    console.log(ancho, 'errores:', JSON.stringify(errs));
    await pag.close();
}
await nav.close(); srv.kill();
process.exit(fallos ? 1 : 0);

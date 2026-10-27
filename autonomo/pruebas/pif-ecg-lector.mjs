// Prueba del lector de ECG (vista Visual de las 10 fichas). Uso: node autonomo/pruebas/pif-ecg-lector.mjs [carpeta] [ancho]
import { spawn } from 'node:child_process';
const { chromium } = await import('/opt/node22/lib/node_modules/playwright/index.mjs');
const out = process.argv[2] || '/tmp/plan-socialista/pif-ecg/tmp-v1';
const ancho = Number(process.argv[3] || 390);
const puerto = 35000 + Math.floor(Math.random() * 1000);
const srv = spawn('python3', ['-m', 'http.server', String(puerto)], { stdio: 'ignore' });
console.log('PUERTO=' + puerto, 'PID=' + srv.pid);
await new Promise(r => setTimeout(r, 1000));
const nav = await chromium.launch();
const pag = await nav.newPage({ viewport: { width: ancho, height: 844 } });
const errs = [];
pag.on('pageerror', e => errs.push('ERR ' + e.message));
pag.on('console', m => { if (m.type() === 'warning' || m.type() === 'error') errs.push(m.type() + ' ' + m.text()); });
await pag.goto(`http://localhost:${puerto}/`); await pag.waitForFunction(() => window.__appLista);
await pag.evaluate(() => { document.getElementById('btn-pif').click(); document.getElementById('btn-pif-cardio').click(); document.getElementById('btn-pif-ecg').click(); });
const res = [];
for (let n = 1; n <= 10; n++) {
    const id = `ecg-f${n}`;
    await pag.evaluate(t => { const b = document.createElement('button'); b.className = 'especialidad-link'; b.dataset.especialidad = 'pifCardio'; b.dataset.view = 'ecgArritmias'; b.dataset.panel = 'panel-pif-ecg-tabs'; b.dataset.tab = t; document.body.append(b); b.click(); b.remove(); }, id);
    await pag.waitForTimeout(400);
    await pag.evaluate(t => document.querySelector(`#${t} > .vista-toggle button[data-vista="visual"]`)?.click(), id);
    await pag.waitForTimeout(500);
    await pag.evaluate(t => document.querySelectorAll(`#${t} img`).forEach(i => { i.loading = 'eager'; }), id);
    await pag.waitForTimeout(700);
    const lect = await pag.$$(`#${id} .ecg-lector`);
    for (let k = 0; k < lect.length; k++) {
        const chips = await lect[k].$$('.ecg-chip');
        const fig = await lect[k].$eval('img', i => i.getAttribute('src').split('/').pop());
        const guardia = await lect[k].$('.ecg-comprobar');
        if (guardia) {
            await lect[k].scrollIntoViewIfNeeded();
            await lect[k].screenshot({ path: `${out}/${ancho}-${id}-${k}-a.png` });
            const [a, b, c] = [chips[0], chips[3], chips[4]]; // Rápido, Ancho/Estrecho..., Regular
            await chips[0].click(); await chips[2].click(); await chips[4].click();
            await guardia.click();
            await lect[k].screenshot({ path: `${out}/${ancho}-${id}-${k}-b.png` });
            res.push({ id, fig, guardia: await lect[k].$eval('.ecg-lector-frase', e => e.textContent.slice(0, 40)) });
            continue;
        }
        for (let c = 0; c < chips.length; c++) {
            await chips[c].click();
            await pag.waitForTimeout(60);
            { const f = await lect[k].$('.ecg-lector-fig'); await f.scrollIntoViewIfNeeded(); await f.screenshot({ path: `${out}/${ancho}-${id}-${k}-c${c}.png` }); }
            const info = await lect[k].evaluate(e => ({ f: e.querySelector('.ecg-lector-frase').textContent.slice(0, 30), calc: e.querySelector('.ecg-lector-calculo').hidden ? '' : e.querySelector('.ecg-lector-calculo').textContent.slice(0, 80), enc: e.querySelectorAll('.encendida,.ecg-zona').length }));
            res.push({ id, fig, c, ...info });
        }
    }
    const ov = await pag.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    res.push({ id, lectores: lect.length, desborde: ov });
}
res.forEach(r => console.log(JSON.stringify(r)));
console.log('ERRORES', JSON.stringify(errs.filter(e => !/favicon/.test(e))));
await nav.close(); srv.kill();

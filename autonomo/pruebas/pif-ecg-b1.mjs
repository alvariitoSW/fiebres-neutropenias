// Prueba de la ficha 3 · Ritmo de «ECG y arritmias» (PIF). Uso: node autonomo/pruebas/pif-ecg-b1.mjs [carpeta de capturas]
import { spawn } from 'node:child_process';
const { chromium } = await import('/opt/node22/lib/node_modules/playwright/index.mjs');
const out = process.argv[2] || '/tmp/plan-socialista/pif-ecg/tmp-b1';
const puerto = 34000 + Math.floor(Math.random() * 1000);
const srv = spawn('python3', ['-m', 'http.server', String(puerto)], { stdio: 'ignore' });
await new Promise(r => setTimeout(r, 1000));
const nav = await chromium.launch();
for (const w of [390, 360]) {
    const pag = await nav.newPage({ viewport: { width: w, height: 844 } });
    const errs = []; pag.on('pageerror', e => errs.push(e.message));
    await pag.goto(`http://localhost:${puerto}/`); await pag.waitForFunction(() => window.__appLista);
    await pag.evaluate(() => { document.getElementById('btn-pif').click(); document.getElementById('btn-pif-cardio').click(); document.getElementById('btn-pif-ecg').click(); });
    await pag.evaluate(() => {
        const b = document.createElement('button'); b.className = 'especialidad-link';
        b.dataset.especialidad = 'pifCardio'; b.dataset.view = 'ecgArritmias'; b.dataset.panel = 'panel-pif-ecg-tabs'; b.dataset.tab = 'ecg-f3';
        document.body.append(b); b.click();
    });
    await pag.waitForTimeout(600);
    await pag.evaluate(async () => { (await import('/js/modules/pif-cardio/ecg-f3.js')).init(); });
    await pag.evaluate(() => document.querySelectorAll('#ecg-f3 .micro-prof-head').forEach(h => h.click()));
    await pag.evaluate(() => document.querySelectorAll('#ecg-f3 img').forEach(i => { i.loading = 'eager'; }));
    await pag.waitForTimeout(1200);
    await pag.fill('#ecg-f3-calc-edad', '50'); await pag.fill('#ecg-f3-calc-fc', '180');
    console.log(w, await pag.innerText('#ecg-f3-calc-resultado'));
    await pag.fill('#ecg-f3-calc-edad', '30');
    console.log(w, await pag.innerText('#ecg-f3-calc-resultado'));
    const r = await pag.evaluate(() => {
        const f = document.getElementById('ecg-f3');
        const imgs = [...f.querySelectorAll('img')];
        return { imgs: imgs.length, rotas: imgs.filter(i => !i.naturalWidth).map(i => i.src), desborde: document.documentElement.scrollWidth - document.documentElement.clientWidth,
            activa: f.classList.contains('active'), anchos: [...f.querySelectorAll('*')].filter(e => e.getBoundingClientRect().right > innerWidth + 1 && !e.closest('[style*="overflow-x"]')).slice(0, 5).map(e => e.id || e.tagName) };
    });
    console.log(w, JSON.stringify(r), 'errores:', errs);
    if (w === 390) {
        await pag.evaluate(() => document.getElementById('ecg-f3-calc').scrollIntoView());
        await pag.screenshot({ path: `${out}/b1-calc.png` });
        await pag.evaluate(() => document.getElementById('ecg-f3-fig-pausa').scrollIntoView());
        await pag.screenshot({ path: `${out}/b1-pausa.png` });
        await pag.evaluate(() => document.getElementById('ecg-f3-cmp-tv').scrollIntoView());
        await pag.screenshot({ path: `${out}/b1-cmp.png` });
        await pag.evaluate(() => document.getElementById('ecg-f3').scrollIntoView());
        await pag.screenshot({ path: `${out}/b1-inicio.png` });
        await pag.evaluate(() => document.querySelector('#ecg-f3-rtv-fa button').click());
        await pag.waitForTimeout(1500);
        console.log('vista rtv visible:', await pag.evaluate(() => { const e = document.getElementById('ritmo-vivo-view') || document.querySelector('[id*="ritmo"]'); return e ? !!e.offsetParent : null; }));
        await pag.screenshot({ path: `${out}/b1-rtv.png` });
    }
    await pag.close();
}
await nav.close(); srv.kill();

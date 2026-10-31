// Profesor · shock-scai: capturas a 390 px del rótulo SCAI, S1/S3/S4 y el caso de Fermín. Uso: node prof-scai.mjs <url> <carpeta>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = process.argv[2].replace(/\/?$/, '/'), DIR = process.argv[3].replace(/\/?$/, '/');
const REPO = '/home/user/fiebres-neutropenias/';
const { barajar } = await import(REPO + 'js/core/mayeutica-motor.js');
const { PREGUNTAS: PREG, CASOS } = await import(REPO + 'js/data/shock-vivo-mayeutica.js');
const b = await chromium.launch();
const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 })).newPage();
const errores = []; p.on('pageerror', e => errores.push(e.message)); p.on('console', m => { if (m.type() === 'error' && !/favicon/.test(m.text())) errores.push(m.text()); });
const clic = sel => p.evaluate(s => { const e = document.querySelector(s); if (!e) throw new Error('no hay ' + s); e.click(); }, sel);
const foto = n => p.screenshot({ path: `${DIR}${n}.png` });
const txt = sel => p.evaluate(s => document.querySelector(s)?.innerText || '', sel);
const Z = '#shv-zona-may';
await p.goto(BASE, { waitUntil: 'networkidle' }); await p.waitForTimeout(500);
await p.evaluate(() => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'shockVivo', shockVivo: 'cardio' }); document.body.append(t); t.click(); t.remove(); });
await p.waitForTimeout(1500);
// 1) rótulo: Aurelio g100 + dobutamina, +5 h
await clic('#shv-dock-tabs [data-pest="grav"]');
await p.evaluate(() => { const d = document.getElementById('shv-d-grav'); d.value = 100; d.dispatchEvent(new Event('input')); d.dispatchEvent(new Event('change')); });
await p.waitForTimeout(600);
await p.evaluate(() => window.__shvPruebas().cab.ajustar({ dobuta: true }));
await p.waitForTimeout(2500);
await p.evaluate(() => document.getElementById('shv-scai').scrollIntoView({ block: 'center' }));
await p.waitForTimeout(300);
console.log('ROTULO:', await txt('#shv-scai'));
const box = await p.evaluate(() => { const r = document.getElementById('shv-scai').getBoundingClientRect(); return { x: 0, y: Math.max(0, r.top - 260), width: 390, height: Math.min(844, r.height + 320) }; });
await p.screenshot({ path: `${DIR}1-rotulo.png`, clip: box });
// 2) Mayéutica → recorrido, respondiendo todo hasta S1..S4
await clic('#shv-modo-may'); await p.waitForTimeout(600);
await clic(`${Z} [data-ir="recorrido"]`); await p.waitForTimeout(500);
async function responder(q, { bien = true, f = null, fallarError = false } = {}) {
    if (q.tipo === 'test') {
        if (f) await foto(f + '-antes');
        await clic(`${Z} [data-accion="ops"]`); await p.waitForTimeout(150);
        const orden = barajar(q.opciones, q.id); const k = bien ? orden.findIndex(o => o.ok) : orden.findIndex(o => !o.ok);
        if (f) await foto(f + '-opciones');
        await clic(`${Z} [data-op="${k}"]`); await p.waitForTimeout(300);
    } else if (q.tipo === 'destapa') {
        await clic(`${Z} [data-accion="destapa"]`); await p.waitForTimeout(150);
        await p.evaluate(Z => document.querySelectorAll(Z + ' input[data-p]').forEach(x => { x.checked = true; }), Z);
        await clic(`${Z} [data-accion="puntos"]`); await p.waitForTimeout(250);
    } else {
        const malas = q.frases.map((x, i) => x.mal ? i : -1).filter(i => i >= 0);
        for (const i of (fallarError ? [0] : malas)) await clic(`${Z} [data-fr="${i}"]`);
        await clic(`${Z} [data-accion="corregir"]`); await p.waitForTimeout(200);
        for (const i of malas) await clic(`${Z} [data-ver="${i}"]`);
        await p.waitForTimeout(150);
    }
    if (q.comprobar) { await clic(`${Z} [data-comprueba]`); await p.waitForTimeout(1500); }
    if (f) { await foto(f); console.log(`\n=== ${q.id} ===\n` + (await txt(Z)).slice(0, 2500)); }
    await clic(`${Z} [data-accion="sig"]`); await p.waitForTimeout(350);
}
for (const q of PREG) {
    const f = q.id === 'S1' ? '2-S1' : q.id === 'S3' ? '3-S3-fallando' : q.id === 'S4' ? '4-S4-comprueba' : null;
    await responder(q, { bien: true, f, fallarError: q.id === 'S3' });
}
console.log('\nREPASO:', (await txt(Z)).slice(0, 400));
// 3) caso de Fermín
await clic(`${Z} [data-ir="casos"]`); await p.waitForTimeout(400);
console.log('\nLISTA CASOS:', (await txt(Z)).slice(0, 600));
await clic(`${Z} [data-caso="1"]`); await p.waitForTimeout(800);
const pasos = CASOS[1].pasos;
for (let k = 0; k < pasos.length; k++) {
    const q = pasos[k].pregunta;
    const f = k === 0 ? '5-CF1' : k === 1 ? '6-CF2-comprueba' : k === 4 ? '7-CF5' : null;
    if (k === 0) console.log('\nFICHA CF1:', await txt(`${Z} dl.shv-paciente`));
    if (k === 3) console.log('\n=== CF4 (texto) ===\n' + (await txt(Z)).slice(0, 1800));
    await responder(q, { bien: k !== 3, f });
}
console.log('\n=== FINAL ===\n' + (await txt(Z)).slice(0, 2000));
await foto('8-fermin-final');
console.log('\nERRORES:', errores);
await b.close();

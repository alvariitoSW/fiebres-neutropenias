// Prueba de navegador del pulmón con respirador (juez de autonomo/jueces.mjs --modelo pulmon-vivo). Uso:
//   node autonomo/pruebas/pulmon-vivo.mjs <url-base> [--capturas <carpeta>]
// A 390 px (con movimiento) y a 360 px (con «reducir movimiento»): los accesos (enlace cruzado de cada estado), los pares 1-3
// y 10 de autonomo/bloques/b3/papel-pulmon.md §6 LEÍDOS DEL MONITOR DE LA APP (las casillas y la columna de cifras del DOM, no
// del programa del motor), todos los mandos a su mínimo y máximo en los 4 pacientes con cifras posibles, el tope duro
// (Vt > 12 mL/kg o VM > 20: el mando vuelve y sale el sello), la explicación guiada de cada estado (señala y cada «Ver en la
// ficha» llega a un párrafo que existe), que el bucle se para al salir y el desborde lateral (0 px) tras cada paso.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const args = process.argv.slice(2);
const BASE = (args.find(a => /^https?:/.test(a)) || 'http://localhost:8000/').replace(/\/?$/, '/');
const CAPTURAS = args.includes('--capturas') ? args[args.indexOf('--capturas') + 1].replace(/\/?$/, '/') : null;
const { ESTADOS, ORDEN_ESTADOS, PACIENTES } = await import(new URL('../../js/data/pulmon-vivo-data.js', import.meta.url));
const b = await chromium.launch();
const fallosTotales = [];

async function correr(ANCHO, REDUCIDO) {
const tag = `${ANCHO}${REDUCIDO ? '-red' : ''}`;
console.log(`\n── ${ANCHO} px${REDUCIDO ? ' · reducir movimiento' : ''}`);
const ctx = await b.newContext({ viewport: { width: ANCHO, height: 844 }, deviceScaleFactor: 2, reducedMotion: REDUCIDO ? 'reduce' : 'no-preference' });
const p = await ctx.newPage();
const errores = [], fallos = [];
p.on('console', m => { if (m.type() === 'error' && !/favicon/.test(m.text())) errores.push(m.text()); });
p.on('pageerror', e => errores.push('PAGE ' + e.message));
const ok = (c, t) => { console.log(`${c ? '✅' : '❌'} ${t}`); if (!c) fallos.push(t); };
const espera = ms => p.waitForTimeout(REDUCIDO ? Math.min(ms, 250) : ms);
const desborde = () => p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
const foto = n => CAPTURAS ? p.screenshot({ path: `${CAPTURAS}pul-${n}-${tag}.png` }) : null;
const abrir = k => p.evaluate(k => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'pulmonVivo', pulmonVivo: k }); document.body.append(t); t.click(); t.remove(); }, k);
const vista = () => p.evaluate(() => { const v = document.getElementById('pulmon-vivo-view'); return v.style.display === 'block' && v.offsetParent !== null; });
const num = s => { const m = String(s ?? '').replace(',', '.').match(/-?\d+(\.\d+)?/); return m ? +m[0] : null; };
// Lo que enseña la app: el valor de una casilla de la pantalla (data-fila) o de la columna de cifras (mismo atributo)
const cifra = async k => num(await p.evaluate(k => { const e = document.querySelector(`#pul-raiz [data-fila="${k}"]`); return e ? (e.querySelector('.v, .g')?.textContent ?? '') : ''; }, k));
const sub = k => p.evaluate(k => document.querySelector(`#pul-raiz [data-fila="${k}"] .sub`)?.textContent || '', k);
const pest = async k => { await p.evaluate(k => document.querySelector(`#pul-dock-tabs [data-pest="${k}"]`).click(), k); await espera(60); };
const mando = async (k, v) => { await p.evaluate(([k, v]) => { const d = document.querySelector(`#pul-dock-panel input[data-m="${k}"]`); if (!d) throw new Error('no hay mando ' + k); d.value = v; d.dispatchEvent(new Event('input', { bubbles: true })); window.__pulPruebas().llenar(); }, [k, v]); await espera(80); };
const clicM = async (k, v) => { await p.evaluate(([k, v]) => document.querySelector(`#pul-dock-panel button[data-m="${k}"]${v ? `[data-v="${v}"]` : ''}`).click(), [k, v]); await espera(120); };
const llenar = () => p.evaluate(() => window.__pulPruebas().llenar());
const ls = () => p.evaluate(() => { const c = window.__pulPruebas(); return { L: { ...c.L }, r: { ...c.P.S.resp }, pu: { ...c.P.S.pulmon }, m: { ...c.P.S.man }, pac: c.est.pac.k, clave: c.est.clave, sello: [...document.querySelectorAll('#pul-raiz .tope-sello')].filter(e => e.getClientRects().length).map(e => e.textContent.replace(/\s+/g, ' ').trim().slice(0, 70)), avisos: [...document.querySelectorAll('#pul-raiz .tope-aviso')].filter(e => e.getClientRects().length).length, corre: c.est.pausa }; });
const limpio = async t => { const x = await p.evaluate(() => document.getElementById('pul-raiz').innerText); ok(!/NaN|undefined|Infinity/.test(x), `${t}: sin NaN/undefined/Infinity`); const d = await desborde(); ok(d <= 0, `${t}: sin desborde lateral (${d} px)`); };

await p.goto(BASE, { waitUntil: 'networkidle' }); await p.waitForTimeout(600);
ok(await p.evaluate(() => !window.__pulPruebas), 'al arrancar la app el modelo NO está montado (se monta al primer abrir)');

// ───────── A. Accesos y estados
for (const k of ORDEN_ESTADOS) {
    await abrir(k); await espera(1500); await p.evaluate(() => window.__pulPruebas().llenar());
    const r = await ls();
    ok(await vista() && r.clave === k && r.pac === ESTADOS[k].pac, `acceso «${k}»: abre con ${ESTADOS[k].pac}`);
    ok((await p.evaluate(() => document.querySelector('#pul-frase-txt .estado')?.textContent)) === ESTADOS[k].tit || r.sello.length > 0, `acceso «${k}»: la frase viva dice el título del estado`);
    await limpio(`estado «${k}»`);
    if (k === 'normal-vcv') await foto('normal');
    if (k === 'sdra-rigido') await foto('sdra');
}

// ───────── B. Pares del informe §6, leídos de la app
await abrir('normal-vcv'); await espera(1200);
await clicM_tecla('inspmant');
async function clicM_tecla(k) { await p.evaluate(k => document.querySelector(`#pul-raiz [data-rt="${k}"]`).click(), k); await p.evaluate(() => window.__pulPruebas().llenar()); await espera(100); }
{ const pico = await cifra('pico'), mes = await cifra('meseta'), cs = await cifra('cstat'), pres = await cifra('pres');
  ok(pico >= 17 && pico <= 19, `par 1: pico ≈ 18 (la app da ${pico})`); ok(mes >= 12 && mes <= 14, `par 1: meseta ≈ 13 (${mes})`);
  ok(cs >= 53 && cs <= 61, `par 1: Cstat ≈ 57 (${cs})`); ok(pres >= 4 && pres <= 6, `par 1: Pres ≈ 5 (${pres})`); }
// par 2: SDRA C 20, Vt 400, PEEP 5 → meseta ≈ 25
await abrir('sdra-rigido'); await espera(1000); await llenar();
{ let mes = await cifra('meseta'); ok(mes >= 30 && mes <= 34, `par 2: Isidro (C 19, PEEP 10, Vt 420) meseta ≈ 32 (${mes})`);
  ok(await p.evaluate(() => document.querySelector('#pul-raiz .esc-racimo').classList.contains('terracota')), 'par 2: racimo en terracota con meseta > 30');
  await pest('pulmon'); await mando('c', 20); await pest('resp'); await mando('vt', 400); await mando('peep', 5);
  mes = await cifra('meseta'); ok(mes >= 23 && mes <= 27, `par 2: C 20, Vt 400, PEEP 5 → meseta ≈ 25 (${mes})`);
  await abrir('sdra-protector'); await espera(1000); await llenar(); mes = await cifra('meseta'); ok(mes < 30, `par 2: con Vt 352 la meseta baja de 30 (${mes})`);
  ok(await p.evaluate(() => !document.querySelector('#pul-raiz .esc-racimo').classList.contains('terracota')), 'par 2: el racimo vuelve a verde');
  await abrir('volutrauma'); await espera(1000); await llenar(); mes = await cifra('meseta'); ok(mes > 30, `volutrauma: meseta > 30 (${mes})`); }
// par 3: broncoespasmo (R 20, FR 24) → flujo final ≠ 0, oclusión 5-8; FR 12, flujo 80 → ≈ 0
await abrir('broncoespasmo-auto-peep'); await espera(1500); await llenar();
{ const ff = await cifra('flujofin'), l = (await ls()).L; ok(ff < -2, `par 3: flujo al final de la espiración no llega a cero (${ff})`);
  ok(l.autoPeep >= 5 && l.autoPeep <= 8, `par 3: PEEP oculta con la oclusión 5-8 (${Math.round(l.autoPeep * 10) / 10}; la casilla dice «${await sub('peeptot')}»)`);
  await abrir('auto-peep-corregida'); await espera(1500); await llenar(); const f2 = await cifra('flujofin'), l2 = (await ls()).L;
  ok(f2 > -2.5, `par 3: corregida (FR 12, flujo 80): el flujo vuelve a ≈ 0 (${f2})`); ok(l2.autoPeep < 2, `par 3: PEEP oculta < 2 (${Math.round(l2.autoPeep * 10) / 10})`); }

// ───────── C. Par 10 y topes: cada mando a su mínimo y máximo, en los 4 pacientes
for (const pc of PACIENTES) {
    await abrir(pc.estado); await espera(900);
    for (const tab of ['resp', 'pulmon']) {
        await pest(tab);
        const mandos = await p.evaluate(() => [...document.querySelectorAll('#pul-dock-panel input[data-m]')].map(i => ({ k: i.dataset.m, min: +i.min, max: +i.max })));
        for (const m of mandos) for (const v of [m.min, m.max]) {
            await mando(m.k, v); const r = await ls(), L = r.L;
            const kgp = await p.evaluate(() => { const c = window.__pulPruebas(); return c.est.pac.sexo === 'v' ? 50 + 0.91 * (c.est.pac.talla - 152.4) : 45.5 + 0.91 * (c.est.pac.talla - 152.4); });
            const posible = [L.pico, L.vm, L.vtExh].every(x => x == null || isFinite(x)) && (L.vm == null || L.vm <= 20.01) && (L.vtExh == null || L.vtExh / kgp <= 12.05) && (L.pico == null || L.pico <= (r.r.pmax ?? 40) + 0.6);
            ok(posible, `${pc.nombre} · ${m.k} = ${v}: VM ${L.vm?.toFixed(1)} L/min, Vt ${L.vtExh ? Math.round(L.vtExh / kgp * 10) / 10 : '—'} mL/kg, pico ${L.pico?.toFixed(1)} (con Pmáx ${r.r.pmax}): paciente posible`);
        }
        await limpio(`${pc.nombre} · ${tab} a los extremos`);
    }
}
// el tope duro: Rafael, Vt 800 y FR 35 → VM 28 > 20: el mando FR vuelve y sale el sello
await abrir('normal-vcv'); await espera(900); await pest('resp'); await mando('vt', 800);
{ const antes = (await ls()).r.fr; await mando('fr', 35); const d = await ls();
  ok(d.r.fr === antes && d.sello.some(t => /no fisiol|se queda/i.test(t)), `par 10: FR 35 con Vt 800 (VM 28) se queda en ${antes} y sale el sello («${d.sello[0] || ''}»)`);
  await foto('sello'); await limpio('tope duro'); await mando('fr', 14); ok((await ls()).sello.length === 0, 'par 10: un cambio válido quita el sello'); }
// Vt < 4 mL/kg y > 8 dan aviso; PEEP 20 con oculta → sello de hiperinflación
await abrir('broncoespasmo-auto-peep'); await espera(900); await pest('resp'); await mando('peep', 20);
{ const d = await ls(); ok(d.sello.length > 0 || d.avisos > 0, `par 10: PEEP 20 en el broncoespasmo da sello o aviso (${d.sello[0] || d.avisos + ' avisos'})`); await limpio('PEEP 20'); }

// ───────── D. Explicación guiada de cada estado
for (const k of ORDEN_ESTADOS) {
    await abrir(k); await espera(900);
    await p.evaluate(() => document.getElementById('pul-btn-guia').click()); await espera(500);
    const n = ESTADOS[k].guia.length; let senal = 0, mal = [];
    for (let i = 0; i < n; i++) {
        const r = await p.evaluate(() => ({ s: document.querySelectorAll('#pul-raiz .guia-anillo, #pul-raiz .guia-marco, #pul-raiz [data-tramo]').length, malas: [...document.querySelectorAll('#pul-dock-guia [data-resaltar]')].filter(c => !document.querySelector(c.dataset.resaltar)).map(c => c.dataset.resaltar), cita: !!document.querySelector('#pul-dock-guia .cita-ir') }));
        if (r.s > 0) senal++; mal.push(...r.malas);
        await p.evaluate(() => document.getElementById('pul-guia-sig').click()); await espera(350);
    }
    ok(senal >= Math.max(1, n - 1), `guía «${k}»: ${senal} de ${n} pasos señalan algo en el dibujo, la pantalla o las cifras`);
    ok(mal.length === 0, `guía «${k}»: cada «Ver en la ficha» llega a un párrafo que existe${mal.length ? ' (falta ' + mal.join(', ') + ')' : ''}`);
    if (!n) ok(false, `guía «${k}»: sin pasos`);
    await limpio(`guía «${k}»`);
}
// Las citas de las fuentes y las notas
await abrir('normal-vcv'); await espera(600);
{ const bad = await p.evaluate(() => [...document.querySelectorAll('#pul-raiz [data-resaltar]')].filter(c => !document.querySelector(c.dataset.resaltar)).map(c => c.dataset.resaltar)); ok(bad.length === 0, `todas las citas de la página llegan a un párrafo que existe${bad.length ? ': ' + [...new Set(bad)].join(', ') : ''}`); }
{ const ids = await p.evaluate(() => { const t = [...document.querySelectorAll('#pul-raiz [id]')].map(e => e.id); return t.filter((x, i) => t.indexOf(x) !== i); }); ok(ids.length === 0, 'sin ids duplicados en el modelo'); }
{ const botones = await p.evaluate(() => { const a = [...document.querySelectorAll('#pul-dock-panel input')]; return a.length; });
  await pest('resp'); const antes = await p.evaluate(() => { document.querySelector('#pul-dock-panel input[data-m="fr"]').__marca = 1; return 1; });
  await mando('fr', 16); ok(await p.evaluate(() => document.querySelector('#pul-dock-panel input[data-m="fr"]').__marca === 1), `botones estables: el deslizador de FR no se rehace al moverlo (${botones} deslizadores)`); }
// El bucle se para al salir de la vista
await p.evaluate(() => { document.getElementById('pulmon-vivo-view').style.display = 'none'; }); await espera(600);
{ const a = await p.evaluate(() => window.__pulPruebas().mon.cursor); await espera(700); const c = await p.evaluate(() => window.__pulPruebas().mon.cursor); ok(a === c, 'el monitor no avanza con la vista oculta'); }
await foto('final');
ok(errores.length === 0, `sin errores de consola${errores.length ? ': ' + errores.slice(0, 3).join(' | ') : ''}`);
await ctx.close();
fallosTotales.push(...fallos.map(f => `${ANCHO}: ${f}`));
}
await correr(390, false); await correr(360, true);
await b.close();
console.log(fallosTotales.length ? `\n${fallosTotales.length} fallos` : '\ntodo en verde');
process.exit(fallosTotales.length ? 1 : 0);

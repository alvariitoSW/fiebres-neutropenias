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

// ───────── C2. E1b: el ciclo (par 6 PSV, 4 decisiones, mando en la respiración siguiente, árbol del pico, calculadora)
await abrir('psv-disparo'); await espera(1200); await llenar();
{ const d = await p.evaluate(() => { const c = window.__pulPruebas(); return { psv: c.L.psv, modo: c.P.S.resp.modo, pico: c.L.pico, fases: [...new Set(c.mon.dato('fase'))] }; });
  ok(d.modo === 'psv' && d.psv && Math.abs(d.psv.qCiclo - 0.25) < 0.04, `par 6 (app): PSV cicla al ${Math.round((d.psv?.qCiclo ?? 0) * 100)} % del flujo pico`);
  ok(d.psv.disparo >= 2 && d.psv.disparo <= 3 && d.fases.includes('disparo'), `PSV: disparo de ${d.psv.disparo.toFixed(2)} cmH₂O (2-3) visible en la curva de presión`);
  ok(Math.abs((await cifra('pico')) - 15) < 0.2, 'PSV: Ppico en pantalla = PEEP 5 + soporte 10 = 15');
  const fr = await cifra('frespon'); ok(fr >= 15 && fr <= 17, `PSV: FRespon en pantalla ${fr} (la del paciente, 16)`);
  ok((await sub('meseta')).includes('PSV'), 'PSV: la casilla de meseta dice que no vale en PSV'); await limpio('PSV'); await foto('psv'); }
ok(await p.evaluate(() => document.querySelectorAll('#pul-ciclo4 [data-decision]').length === 4), 'las 4 decisiones del ciclo están rotuladas (disparo, límite, ciclado, espiración)');
ok(await p.evaluate(() => /25 %/.test(document.getElementById('pul-ciclo4').innerText)), 'PSV: el ciclado dice 25 % del flujo pico');
// todos los mandos de la PSV a su extremo y al medio: sin NaN ni desborde, y el tope manda
await pest('resp');
for (const [k, vs] of [['ps', [5, 12, 20]], ['frEsp', [8, 19, 30]], ['peep', [0, 10, 20]], ['pmax', [20, 35, 50]]]) for (const v of vs) {
  await mando(k, v); const d = await ls(); ok(Number.isFinite(d.L.vtExh) && Number.isFinite(d.L.vm) && d.L.vm < 21, `PSV ${k} ${v}: Vt ${Math.round(d.L.vtExh)} mL, VM ${d.L.vm.toFixed(1)} L/min`); await limpio(`PSV ${k} ${v}`); }
await mando('ps', 10); await mando('frEsp', 16); await mando('peep', 5); await mando('pmax', 40);
{ const d = await p.evaluate(() => { document.querySelector('#pul-dock-tabs [data-pest="man"]').click(); document.querySelector('#pul-dock-panel button[data-m="pausa"]')?.click(); return window.__pulPruebas().P.S.man.pausa; });
  ok(d !== true, 'PSV: el botón de pausa no activa la maniobra'); await pest('resp'); }
// cambiar de modo: VCV → PSV → VCV sin romper
await clicM('modo', 'vcv'); await espera(300); await clicM('modo', 'psv'); await espera(300); await llenar();
ok((await ls()).r.modo === 'psv' && (await cifra('pico')) > 0, 'VCV → PSV desde la pantalla'); await clicM('modo', 'vcv'); await limpio('modo PSV→VCV');
// «los mandos entran en la respiración siguiente»
if (!REDUCIDO) { await abrir('normal-vcv'); await espera(800);
  const d = await p.evaluate(() => { const c = window.__pulPruebas(), i = document.querySelector('#pul-dock-panel input[data-m="peep"]'); i.value = 9; i.dispatchEvent(new Event('input', { bubbles: true })); return { pend: c.P.pendientes(), act: c.P.activo.peep, ped: c.P.S.resp.peep }; });
  ok(d.pend.includes('peep') && d.act === 5 && d.ped === 9, 'un mando movido a mitad de ciclo queda pendiente (activo 5, pedido 9)'); }
// el árbol «pico sube: ¿y la meseta?» y la calculadora
await abrir('normal-vcv'); await espera(800); await p.evaluate(() => { document.getElementById('pul-arbol').open = true; document.getElementById('pul-cv').open = true; });
await p.evaluate(() => document.getElementById('pul-arbol-pausa').click()); await espera(900); await llenar();
{ const t = await p.evaluate(() => ({ pico: document.getElementById('pul-arbol-pico').textContent, mes: document.getElementById('pul-arbol-meseta').textContent, pres: document.getElementById('pul-arbol-pres').textContent }));
  ok(num(t.mes) > 10 && num(t.pres) > 3, `árbol: con la pausa lee pico ${t.pico}, meseta ${t.mes}, resistencia ${t.pres}`);
  await p.evaluate(() => document.querySelector('[data-arbol="igual"]').click());
  ok(await p.evaluate(() => /resistencia/.test(document.getElementById('pul-arbol-concl').innerText) && !document.getElementById('pul-arbol-concl').hidden), 'árbol: «la meseta no se movió» concluye resistencia'); }
{ const set = (id, v) => p.evaluate(([id, v]) => { const e = document.getElementById(id); e.value = v; e.dispatchEvent(new Event('input', { bubbles: true })); }, [id, v]);
  const r = () => p.evaluate(() => Object.fromEntries(['pbw', 'vtkg', 'dp', 'cstat'].map(k => [k, document.getElementById('pul-cv-r-' + k).textContent])));
  let c = await r(); ok(c.pbw === '—' && c.cstat === '—', 'calculadora: vacía no calcula (un campo vacío no es 0)');
  await set('pul-cv-talla', 175); await set('pul-cv-vt', 576); c = await r(); ok(c.pbw === '70,5' && c.vtkg === '8,2', `calculadora: Isidro 1,75 m → PBW ${c.pbw} kg, 576 mL = ${c.vtkg} mL/kg`);
  await set('pul-cv-meseta', 32); await set('pul-cv-peep', 10); c = await r(); ok(c.dp === '22' && num(c.cstat) > 20, `calculadora: ΔP ${c.dp}, Cstat ${c.cstat}`);
  ok(await p.evaluate(() => !/objetivo/i.test(document.getElementById('pul-cv-avisos').textContent)), 'calculadora: la ΔP no lleva objetivo');
  await set('pul-cv-meseta', 8); c = await r(); ok(c.dp === '—' && await p.evaluate(() => /no fisiol/i.test(document.getElementById('pul-cv-avisos').textContent)), 'calculadora: meseta ≤ PEEP avisa «no fisiológica»');
  await limpio('calculadora'); await foto('calculadora'); }
// τ (par 4) en la pestaña Pulmón
await abrir('eulalia-ajustada'); await espera(900); await pest('pulmon');
{ const t = await p.evaluate(() => document.querySelector('#pul-dock-panel .dock-nota')?.textContent || ''); ok(/63,2/.test(t) && /4-5 τ/.test(t), 'τ: la nota dice 63,2 % y 4-5 τ'); }

// ───────── D. Explicación guiada de cada estado
for (const k of ORDEN_ESTADOS) {
    await abrir(k); await espera(900);
    await p.evaluate(() => document.getElementById('pul-btn-guia').click()); await espera(500);
    const n = ESTADOS[k].guia.length; let senal = 0, mal = [];
    if (ESTADOS[k].piensa) {   // «piensa antes» (E2): primero el enunciado; las opciones no dicen cuál es la buena hasta contestar
        const Q = ESTADOS[k].piensa, hay = () => p.evaluate(() => ({ ops: document.querySelectorAll('#pul-dock-guia .pq-op').length, bien: document.querySelectorAll('#pul-dock-guia .pq-op.bien').length, exp: !document.getElementById('pul-pq-exp').hidden, sig: !!document.getElementById('pul-guia-sig'), desb: document.documentElement.scrollWidth - innerWidth }));
        let h = await hay(); ok(h.ops === 0 && !h.sig, `piensa «${k}»: antes de la guía sale el enunciado, sin opciones ni pasos`);
        await p.evaluate(() => document.getElementById('pul-pq-ver').click()); await espera(150); h = await hay();
        ok(h.ops === Q.ops.length && h.bien === 0, `piensa «${k}»: ${Q.ops.length} opciones y ninguna marcada antes de contestar (la respuesta no está en el HTML)`);
        await p.evaluate((i) => document.querySelectorAll('#pul-dock-guia .pq-op')[i].click(), Q.ops.findIndex(o => !o.ok)); await espera(150); h = await hay();
        ok(h.exp && h.bien === 1 && h.desb <= 0, `piensa «${k}»: al contestar sale la explicación, marca la buena y no desborda (${h.desb} px)`);
        await p.evaluate(() => document.getElementById('pul-pq-seguir').click()); await espera(300);
    }
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
// ───────── E. El racimo con histéresis (E2; par 5 de papel-pulmon.md §6), leído del monitor y del DOM de la app
{
  const sello = () => p.evaluate(() => document.getElementById('pul-frase-txt').textContent);
  await abrir('atelectrauma-zeep'); await espera(900); await llenar();
  let c = await p.evaluate(() => { const q = window.__pulPruebas(); return { n: q.L.nAbreCierra, ab: q.P.unidades.map(u => u.abierta), peep: q.P.S.resp.peep, rot: document.getElementById('pul-esc-atel').hasAttribute('hidden'), cerr: document.querySelectorAll('#pul-esc-racimo .esc-alv.cerrada').length }; });
  const cs0 = await cifra('cstat');
  ok(c.peep === 0 && c.n === 3 && !c.rot && await p.evaluate(() => document.getElementById('pul-esc-atel').getBoundingClientRect().width > 40), `racimo, PEEP 0: tres unidades se abren y se cierran en cada ciclo y el rótulo «atelectrauma» está a la vista (n ${c.n})`);
  ok(/Abre y cierra/.test(await sello()) && /atelectrauma/.test(await sello()), 'racimo: la frase viva lleva el sello con el nombre «atelectrauma»');
  ok(c.cerr > 0 && c.cerr % 3 === 0, `racimo: las unidades colapsadas se ven rayadas en el dibujo (${c.cerr} de 12 alvéolos)`);
  // PEEP 12 (por encima de todos los cierres): ninguna se cierra, el sello desaparece y la Cstat sube
  await pest('resp'); await mando('peep', 12); await espera(500); await llenar(); await espera(200);
  c = await p.evaluate(() => { const q = window.__pulPruebas(); return { n: q.L.nAbreCierra, ab: q.P.unidades.filter(u => u.abierta).length, rot: document.getElementById('pul-esc-atel').hasAttribute('hidden') }; });
  const cs12 = await cifra('cstat');
  ok(c.n === 0 && c.ab === 4 && c.rot, `racimo, PEEP 12: las cuatro unidades abiertas, ninguna se cierra y el rótulo desaparece`);
  ok(cs12 > cs0 + 3, `racimo: la Cstat de la pantalla sube con la PEEP 0 → 12 (${cs0} → ${cs12})`);
  await mando('peep', 20); await espera(500); await llenar(); await espera(200);
  const cs20 = await cifra('cstat');
  ok(cs20 < cs12 - 1, `racimo, PEEP 20: la Cstat BAJA (la cola se aplana): ${cs12} → ${cs20}`);
  await mando('peep', 4); await espera(500); await llenar(); await espera(200);
  const cs4 = await cifra('cstat');
  ok(cs4 < cs12 - 1, `mejor PEEP: Cstat ${cs4} (PEEP 4) < ${cs12} (PEEP 12) > ${cs20} (PEEP 20)`);
  await limpio('racimo'); await foto('racimo-peep4');
  // el estado «mejor PEEP» abre en 12
  await abrir('mejor-peep'); await espera(900); await llenar();
  c = await p.evaluate(() => { const q = window.__pulPruebas(); return { n: q.L.nAbreCierra, peep: q.P.S.resp.peep, ab: q.P.unidades.filter(u => u.abierta).length }; });
  ok(c.peep === 12 && c.n === 0 && c.ab === 4, 'mejor PEEP: abre con PEEP 12 y las cuatro unidades abiertas');
  // el sello no tapa el rótulo «PEEP» de la pantalla (ni el del dibujo)
  await abrir('atelectrauma-zeep'); await espera(900); await llenar(); await espera(300);
  const tapa = await p.evaluate(() => {
    const sellos = [...document.querySelectorAll('#pul-raiz [class*="sello"], #pul-raiz [class*="tope"]')].filter(e => e.getClientRects().length && e.textContent.includes('Abre y cierra')).map(e => e.getBoundingClientRect());
    const peeps = [...document.querySelectorAll('#pul-raiz text, #pul-raiz span, #pul-raiz b, #pul-raiz small')].filter(e => e.children.length === 0 && /^PEEP$/.test(e.textContent.trim()) && e.getClientRects().length).map(e => e.getBoundingClientRect());
    return { ns: sellos.length, np: peeps.length, choca: sellos.some(a => peeps.some(b => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top)) };
  });
  ok(!tapa.choca, `el sello no tapa el rótulo «PEEP» (${tapa.ns} sello(s), ${tapa.np} rótulo(s))`);
  await foto('racimo-peep0');
}
// E3-enganche
// ───────── E3-enganche · el corazón con la presión del pulmón (par 7 de papel-pulmon.md §6), leído del panel de la app
{
  const cor = (k) => p.evaluate(k => { const e = document.querySelector(`#pul-corazon [data-fila="cor-${k}"]`); return e ? (e.querySelector('.v')?.textContent ?? '') : ''; }, k);
  const nCor = async k => num(await cor(k));
  const antes = () => p.evaluate(() => document.getElementById('pul-corazon').dataset.presion || '');
  const llega = async (previa) => { try { await p.waitForFunction(pr => { const s = document.getElementById('pul-corazon'); return !s.hidden && s.dataset.presion && s.dataset.presion !== pr && !/…/.test(s.textContent); }, previa, { timeout: 12000 }); } catch {} await espera(150); };
  // CPAP en el EAP: 0 → 5 → 10; VS, GC y PAM suben (Bradley 1992; Marino pdf 83-88)
  await abrir('cpap-eap'); await espera(900); await llenar();
  await llega('');
  const v = { 0: await nCor('vs') }, g = { 0: await nCor('gc') }, pa = { 0: await nCor('pam') };
  ok(await p.evaluate(() => !document.getElementById('pul-corazon').hidden) && (await p.evaluate(() => window.__pulPruebas().est.pac.k)) === 'herminia', 'cpap-eap: Herminia, y el panel del corazón se ve bajo la pantalla');
  ok(await p.evaluate(() => document.getElementById('pul-monitor').getBoundingClientRect().bottom <= document.getElementById('pul-corazon').getBoundingClientRect().top + 1), 'el panel del corazón está debajo de la pantalla del respirador');
  for (const x of [5, 10]) { const pr = await antes(); await pest('resp'); await mando('peep', x); await espera(300); await llega(pr); v[x] = await nCor('vs'); g[x] = await nCor('gc'); pa[x] = await nCor('pam'); }
  ok(v[5] > v[0] * 1.05 && v[10] > v[5], `cpap-eap: el VS sube con la CPAP (${v[0]} → ${v[5]} → ${v[10]} mL; ${((v[5] / v[0] - 1) * 100).toFixed(0)} % con CPAP 5)`);
  ok(g[10] > g[0] && pa[10] > pa[0], `cpap-eap: el GC (${g[0]} → ${g[10]} L/min) y la PAM (${pa[0]} → ${pa[10]}) suben`);
  ok(/ilustrativo/.test(await p.evaluate(() => document.querySelector('#pul-corazon .org').textContent)), 'el panel del corazón lleva su origen visible');
  ok(await p.evaluate(() => { const b = document.querySelector('#pul-corazon [data-shock-vivo="ic-cpap"]'); return !!b && b.dataset.view === 'shockVivo' && b.dataset.especialidad === 'libros'; }), 'botón «Ver en el shock vivo» (ic-cpap)');
  // tope de la CPAP: 12 vuelve a 10 y sale el sello
  await mando('peep', 12); try { await p.waitForFunction(() => [...document.querySelectorAll('.tope-sello')].some(e => /CPAP por encima de 10/.test(e.textContent) && e.getClientRects().length) && window.__pulPruebas().P.S.resp.peep === 10, null, { timeout: 12000 }); } catch {} await espera(200);
  { const r = await p.evaluate(() => ({ peep: window.__pulPruebas().P.S.resp.peep, sello: [...document.querySelectorAll('#pul-raiz .tope-sello')].some(e => /CPAP por encima de 10/.test(e.textContent) && e.getClientRects().length) }));
    ok(r.peep === 10 && r.sello, `tope de la CPAP: con 12 el mando vuelve a 10 (${r.peep}) y sale el sello`); }
  ok((await desborde()) <= 0, 'cpap-eap: sin desborde lateral'); await limpio('cpap-eap'); await foto('cor-cpap-eap');
  // la misma presión baja el VS del sano; PEEP 4 → 20 baja el GC (Fig. 26.7; Fig. 27.6)
  await abrir('vpp-corazon-normal'); await espera(900); await llenar(); await llega('');
  const n4 = { vs: await nCor('vs'), gc: await nCor('gc'), pam: await nCor('pam') };
  { const pr = await antes(); await pest('resp'); await mando('peep', 20); await espera(300); await llega(pr); }
  const n20 = { vs: await nCor('vs'), gc: await nCor('gc'), pam: await nCor('pam') };
  ok(n20.vs < n4.vs * 0.8 && n20.gc < n4.gc * 0.85, `vpp-corazon-normal: PEEP 4 → 20 baja el VS (${n4.vs} → ${n20.vs} mL) y el GC (${n4.gc} → ${n20.gc} L/min)`);
  ok(n20.pam > 60 && n20.pam < 110, `vpp-corazon-normal: PAM posible (${n4.pam} → ${n20.pam} mmHg)`);
  ok((await desborde()) <= 0, 'vpp-corazon-normal: sin desborde lateral'); await limpio('vpp-corazon-normal'); await foto('cor-vpp-normal');
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

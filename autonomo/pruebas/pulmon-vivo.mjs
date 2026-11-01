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
            if (m.k === 'pmus') continue;   // el esfuerzo (Pmus) lo lleva a 0 y al tope el bloque «E4a»; aquí se acumularía con los demás extremos
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
  await set('pul-cv-meseta', 32); await set('pul-cv-peep', 10); await set('pul-cv-pico', 40); c = await r(); ok(c.dp === '22' && num(c.cstat) > 19 && num(c.cstat) < 21, `calculadora: ΔP ${c.dp}, Cstat ${c.cstat}`);
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
  ok(cs12 > cs0 + 1, `racimo: la Cstat de la pantalla sube con la PEEP 0 → 12 (${cs0} → ${cs12})`);
  await mando('peep', 20); await espera(500); await llenar(); await espera(200);
  const cs20 = await cifra('cstat');
  ok(cs20 < cs12 - 1, `racimo, PEEP 20: la Cstat BAJA (la cola se aplana): ${cs12} → ${cs20}`);
  await mando('peep', 4); await espera(500); await llenar(); await espera(200);
  const cs4 = await cifra('cstat');
  ok(cs4 < cs12 && cs20 < cs12, `mejor PEEP: Cstat ${cs4} (PEEP 4) < ${cs12} (PEEP 12) > ${cs20} (PEEP 20)`);
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
  ok(v[5] > v[0] * 1.05 && v[10] >= v[5] - 1 && v[10] > v[0] * 1.05, `cpap-eap: el VS sube con la CPAP y se aplana (el alivio satura) (${v[0]} → ${v[5]} → ${v[10]} mL; ${((v[5] / v[0] - 1) * 100).toFixed(0)} % con CPAP 5)`);
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
// E4a · el paciente que respira: esfuerzo, asincronías, P-SILI y prueba de respiración espontánea (pares del motor: pulmon-motor.mjs, par 8)
{
  const esf = () => p.evaluate(() => { const q = window.__pulPruebas(); return { ef: q.P.esfuerzos.slice(-4).map((e) => ({ tipo: e.tipo, vt: e.vt, valle: e.valle, ti: e.ti })), marcas: q.mon.dato('disp').filter((x) => x === 1).length, sello: q.est.sello?.titulo || null, info: document.querySelector('#pul-raiz [data-resp="info"]')?.textContent || '', pmusVis: !!document.querySelector('#pul-dock-panel input[data-m="pmus"]'), canal: !!document.querySelector('#pul-trazas #pul-pmus, #pul-trazas [id$="pmus"]') }; });
  const aviso = () => p.evaluate(() => [...document.querySelectorAll('#pul-raiz [class*="aviso"], #pul-raiz [class*="tope"]')].filter((e) => e.getClientRects().length && /Esfuerzo muy alto/.test(e.textContent)).length);
  await abrir('asincronia-ineficaz'); await espera(900); await llenar(); await pest('resp');
  let e = await esf(); ok(e.pmusVis && e.ef.length >= 3 && e.ef.every((x) => x.tipo === 'ineficaz' && x.vt === 0), `E4a ineficaz: la app muestra el mando de Pmus y todos los esfuerzos son ineficaces con 0 mL (${e.ef.length})`);
  await mando('pmus', 8); await espera(7000 / (REDUCIDO ? 8 : 1)); await llenar(); e = await esf(); ok(e.ef.some((x) => x.tipo === 'sincronico') && e.marcas >= 1, `E4a ineficaz: con Pmus 8 el paciente dispara (${e.marcas} marca(s) bajo la Paw)`);
  await mando('pmus', 12); await llenar(); ok((await aviso()) >= 1, 'E4a: a Pmus 12 sale el aviso de esfuerzo muy alto'); await limpio('Pmus 12');
  await mando('pmus', 15); await llenar(); await limpio('Pmus 15 (tope)'); await mando('pmus', 0); await llenar(); await limpio('Pmus 0'); await foto('e4a-ineficaz');
  await abrir('doble-disparo'); await espera(900); await llenar();
  e = await esf(); ok(e.ef.length >= 3 && e.ef.every((x) => x.tipo === 'doble' && x.vt > 540 && x.vt < 640 && x.valle < x.ti / 2), `E4a doble disparo: cada esfuerzo da ~2 Vt (${Math.round(e.ef[0]?.vt)} mL) con el valle (${(e.ef[0]?.valle ?? 0).toFixed(2)} s) < Ti/2 (${((e.ef[0]?.ti ?? 0) / 2).toFixed(2)} s)`);
  ok(e.marcas >= 2, `E4a doble disparo: al menos 2 triángulos de disparo bajo la Paw (${e.marcas})`);
  { const vtkg = await cifra('vtkg'); ok(vtkg > 8, `E4a doble disparo: el Vt espirado por kg sube por encima de 8 (${vtkg})`); }
  await mando('pmus', 15); await llenar(); await limpio('doble disparo, Pmus 15'); await foto('e4a-doble');
  await abrir('disparo-inverso'); await espera(900); await llenar();
  e = await esf(); ok(e.ef.length >= 3 && e.ef.every((x) => x.tipo === 'inverso') && /disparo inverso/i.test(await p.evaluate(() => document.querySelector('#pul-frase-txt')?.textContent + document.querySelector('#pul-raiz')?.innerText)), `E4a disparo inverso: el estado abre, Ceferino, y todos los esfuerzos (${e.ef.length}) son inversos (Vt ${Math.round(e.ef[0]?.vt)} mL)`);
  await limpio('disparo inverso'); await foto('e4a-inverso');
  await abrir('p-sili'); await espera(900); await llenar();
  e = await esf(); ok(/P-SILI/.test(e.sello || ''), `E4a P-SILI: con Vt ≥9,5 mL/kg sale el sello (${e.sello})`);
  await mando('pmus', 3); await llenar(); e = await esf(); ok(!/P-SILI/.test(e.sello || ''), 'E4a P-SILI: al bajar el esfuerzo a 3 el sello desaparece');
  await mando('pmus', 9); await llenar(); e = await esf(); ok(/P-SILI/.test(e.sello || ''), 'E4a P-SILI: con Pmus 9 el sello sigue');
  await mando('pmus', 15); await llenar(); await limpio('P-SILI, Pmus 15'); e = await esf(); const v15 = await p.evaluate(() => +document.querySelector('#pul-dock-panel input[data-m="pmus"]').value);
  ok(/no fisiológico/.test(e.sello || '') && v15 < 15, `E4a P-SILI: Pmus 15 pasa el tope de 12 mL/kg: sello «${e.sello}» y el mando vuelve a ${v15}`);
  await foto('e4a-psili');
  // S1 · cánula de alto flujo (hfno): sin lupa ni tipo. Mandos: flujo 10-60, boca cerrada; barrido de extremos 0..120 (doble del tope)
  await abrir('hfno'); await espera(900); await llenar();
  { const clic = async (sel) => { await p.evaluate(sel => document.querySelector(sel).click(), sel); await espera(250); };
    const hf = () => p.evaluate(() => { const q = window.__pulPruebas(), c = (k) => document.querySelector(`#pul-raiz [data-fila="${k}"]`); return { q: q.est.q, fio2: +c('fio2').querySelector('.v').textContent, spo2: c('fio2').querySelector('.sub').textContent, peep: c('peeptot').querySelector('.v').textContent, pmus: q.P.S.resp.pmus, fr: q.P.S.resp.frEsp, int: document.querySelector('#pul-raiz [data-resp="int"]').textContent, sello: q.est.sello?.titulo || '', alarma: document.querySelector('#pul-resp-alarma')?.textContent || '', frase: document.querySelector('#pul-frase-txt')?.textContent || '' }; });
    const R = {}; for (const q of [10, 30, 60]) { await mando('canula', q); await llenar(); R[q] = await hf(); await limpio('hfno ' + q + ' L/min'); }
    ok(R[10].int === 'Cánula' && R[10].pmus === 14 && R[60].pmus === 12 && R[60].fr < R[10].fr, `S1 hfno: interfaz «Cánula»; al subir el flujo de 10 a 60 bajan el esfuerzo (${R[10].pmus} → ${R[60].pmus}) y la FR (${R[10].fr} → ${R[60].fr})`);
    ok(R[10].fio2 < R[30].fio2 && R[30].fio2 < R[60].fio2 && R[60].fio2 === 80 && R[10].fio2 > 21, `S1 hfno: la FiO₂ al alvéolo sube con el flujo y alcanza la del mando (${R[10].fio2} → ${R[30].fio2} → ${R[60].fio2} con mando 80) · ${R[10].spo2} → ${R[30].spo2} → ${R[60].spo2}`);
    ok(R[10].peep.replace(',', '.') === '0' && R[60].peep.replace(',', '.') === '0', 'S1 hfno: con la boca abierta no hay PEEP');
    await mando('canula', 10); await llenar();
    ok(/Flujo bajo/.test(R[10].alarma + (await p.evaluate(() => document.getElementById('pul-raiz').innerText))), 'S1 hfno: por debajo de 15 L/min avisa de que arrastra aire');
    await clic('#pul-dock-panel [data-m="boca"]'); await llenar(); const bc = await hf(); ok(+bc.peep.replace(',', '.') === 2.5, `S1 hfno: «Boca cerrada» da la PEEP de 2-3 (${bc.peep})`);
    await clic('#pul-dock-panel [data-m="boca"]');
    // tope: el mando llega a 60 y se queda; pedir más (hasta el doble) pone el sello con las constantes de la paciente
    for (const q of [90, 120]) { await p.evaluate((q) => { const d = document.querySelector('#pul-dock-panel input[data-m="canula"]'); d.max = 200; d.value = q; d.dispatchEvent(new Event('input', { bubbles: true })); window.__pulPruebas().llenar(); }, q); const t = await hf(); ok(/Más flujo del que da el equipo/.test(t.sello) && t.q === 60 && t.pmus === 12 && t.fio2 === 80, `S1 hfno tope: pedir ${q} L/min → sello «${t.sello}», el flujo se queda en ${t.q}; Pmus ${t.pmus}, FR ${t.fr}, FiO₂ ${t.fio2}, ${t.spo2}`); await limpio('hfno tope ' + q); }
    await mando('canula', 30); await llenar(); ok((await hf()).sello === '', 'S1 hfno tope: al volver a un flujo válido el sello se quita');
    await abrir('p-sili'); await espera(500); ok((await hf()).int === 'Tubo', 'S1 hfno: al salir del estado la interfaz vuelve a «Tubo»');
    await abrir('hfno'); await espera(500); await llenar(); await foto('s1-hfno');
    // barrido de motor de 0 al doble del tope: ninguna cifra imposible
    const H = await import(new URL('../../js/modules/libros/pulmon-vivo/hfno.js', import.meta.url)), PM = await import(new URL('../../js/modules/libros/pulmon-vivo/pulmon.mjs', import.meta.url)), E = ESTADOS.hfno, kgE = PM.pbw(160, 'm'); let mal = [];
    for (const q of [0, 5, 10, 15, 20, 30, 40, 50, 60, 90, 120]) { const x = H.lectura(q, 80, E.resp, E.pulmon), l = PM.simular({ ...E.resp, pmus: x.pmus, frEsp: x.frEsp }, { ...E.pulmon, rEsp: E.pulmon.r }, {}, { ciclos: 10, ventana: 0.01 }).lectura;
      if (!(x.fio2Alv >= 21 && x.fio2Alv <= 80 && x.spo2 >= 84 && x.spo2 <= 95 && l.vm >= 2 && l.vm <= 20 && l.vtExh / kgE >= 4 && l.vtExh / kgE <= 12 && x.frEsp >= 14 && x.frEsp <= 30 && l.frReal > 0)) mal.push(`${q}: FiO₂ ${x.fio2Alv} SpO₂ ${x.spo2} VM ${l.vm} Vt/kg ${l.vtExh / kgE}`); }
    ok(mal.length === 0, `S1 hfno barrido 0-120 L/min: todo paciente posible${mal.length ? ' · fallan ' + mal.join(' | ') : ''}`); }
  // S2 · prono (Isidro): sin lupa ni tipo. Mandos: posición, horas 0-16, 5 contraindicaciones; barrido de 0 al doble del tope (32 h)
  await abrir('prono'); await espera(900); await llenar();
  { const clic = async (sel) => { await p.evaluate(sel => document.querySelector(sel).click(), sel); await espera(150); await llenar(); };
    const horas = async (v) => { await p.evaluate(v => { const d = document.querySelector('#pul-dock-panel input[data-m="horas"]'); d.max = 64; d.value = v; d.dispatchEvent(new Event('input', { bubbles: true })); }, v); await espera(150); await llenar(); };
    const pr = () => p.evaluate(() => { const c = (k) => document.querySelector(`#pul-raiz [data-fila="${k}"]`), g = (k) => +(c(k)?.querySelector('.v, .g')?.textContent || 'NaN').replace(',', '.'); const pf = c('fio2').querySelector('.sub').textContent.match(/P\/F (\d+) · PaO₂ (\d+)/) || []; return { pf: +pf[1], pao2: +pf[2], vtkg: g('vtkg'), vm: g('vm'), fr: g('fr'), meseta: g('meseta'), dp: g('dp'), cstat: g('cstat'), cons: document.querySelectorAll('.esc-alv.prono-cons').length, sello: [...document.querySelectorAll('#pul-raiz .tope-sello')].map(e => e.textContent).join('|'), horas: +document.querySelector('#pul-dock-panel input[data-m="horas"]').value }; });
    const sup = await pr(); await limpio('prono supino');
    await horas(1); const h1 = await pr(); await limpio('prono 1 h'); await horas(16); const h16 = await pr(); await limpio('prono 16 h'); await foto('s2-prono16');
    ok(sup.pf === 120 && h1.pf > sup.pf && h16.pf === 180 && h16.cstat > sup.cstat && h16.meseta < sup.meseta && h16.cons < sup.cons && sup.cons === 6 && h16.cons === 0, `S2 prono: supino P/F ${sup.pf}, Cstat ${sup.cstat}, meseta ${sup.meseta}, ${sup.cons} alvéolos consolidados → 1 h P/F ${h1.pf} → 16 h P/F ${h16.pf}, Cstat ${h16.cstat}, meseta ${h16.meseta}, ΔP ${h16.dp}, ${h16.cons} consolidados`);
    ok(/Menos de 16 h/.test(await p.evaluate(() => document.getElementById('pul-dock').innerText + document.getElementById('pul-raiz').innerText)) === false, 'S2 prono: a 16 h no sale el aviso de «menos de 16 h»');
    await clic('#pul-dock-panel [data-m="pos"][data-v="post"]'); const po = await pr(); await limpio('prono supino 4 h después');
    ok(po.pf === 175 && po.cstat >= sup.cstat && po.pf < h16.pf, `S2 prono: supino 4 h después mantiene la mejoría (P/F ${po.pf}, Cstat ${po.cstat})`);
    await clic('#pul-dock-panel [data-m="pos"][data-v="supino"]'); ok((await pr()).pf === 120, 'S2 prono: «Supino» devuelve el P/F de partida');
    // barrido 0..32 h en el monitor de la app: todo paciente posible
    let mal = []; for (const h of [0, 1, 4, 8, 12, 15, 16, 24, 32]) { await horas(h); const x = await pr(); const t = JSON.stringify(x);
      if (!(x.vtkg >= 4 && x.vtkg <= 8 && x.vm >= 5 && x.vm <= 20 && x.fr === 30 && x.meseta <= 30 && x.dp <= 19 && x.pf >= 120 && x.pf <= 180 && x.pao2 >= 60 && x.pao2 <= 120 && x.cstat >= 13 && x.cstat <= 20)) mal.push(h + ': ' + t);
      if (h === 12) ok(/Menos de 16 h/.test(await p.evaluate(() => document.getElementById('pul-raiz').innerText)), 'S2 prono: con 12 h avisa de que son menos de 16 h');
      if (h > 16) ok(/El mando termina en 16 h/.test(x.sello) && x.horas === 16 && x.pf === 180, `S2 prono tope: pedir ${h} h → sello, el mando se queda en ${x.horas} h, P/F ${x.pf}`);
      await limpio('prono ' + h + ' h'); }
    ok(mal.length === 0, `S2 prono barrido 0-32 h: Vt/kg, VM, FR, meseta, ΔP, P/F y Cstat de un paciente posible${mal.length ? ' · fallan ' + mal.join(' | ') : ''}`);
    await horas(10); await clic('#pul-dock-panel [data-m="pos"][data-v="supino"]');
    // contraindicaciones: cada una de las cinco bloquea el giro con sello, constantes de supino
    for (const c of ['hemorragia', 'espinal', 'fracturas', 'pic', 'reciente']) { await clic(`#pul-dock-panel [data-m="ci"][data-v="${c}"]`); await clic('#pul-dock-panel [data-m="pos"][data-v="prono"]'); const x = await pr();
      ok(/Contraindicación absoluta/.test(x.sello) && x.pf === 120 && x.cons === 6, `S2 prono: con «${c}» no se gira (sello, P/F ${x.pf}, ${x.cons} consolidados)`); await clic(`#pul-dock-panel [data-m="ci"][data-v="${c}"]`); ok(!/Contraindicación/.test((await pr()).sello), `S2 prono: al quitar «${c}» se quita el sello`); }
    await clic('#pul-dock-panel [data-m="pos"][data-v="prono"]'); ok((await pr()).pf > 120, 'S2 prono: sin contraindicaciones se puede girar');
    await abrir('sdra-protector'); await espera(500); ok(await p.evaluate(() => document.querySelectorAll('.esc-alv.prono-cons').length === 0 && !document.querySelector('#pul-dock-panel [data-m="horas"]')), 'S2 prono: al salir del estado desaparecen los mandos y las rayas');
    await abrir('prono'); await espera(500); await llenar(); }
  // M1 · secreciones sobre el balón (Gaspar): mandos = presión del balón 0-30 (tope 25) y aspiración subglótica; barrido de extremos y medio
  await abrir('subglotica'); await espera(900); await llenar();
  { const pide = async (v) => { await p.evaluate((v) => { const d = document.querySelector('#pul-dock-panel input[data-m="cuff"]'); d.max = 200; d.value = v; d.dispatchEvent(new Event('input', { bubbles: true })); window.__pulPruebas().llenar(); }, v); await espera(150); await llenar(); };
    const sg = () => p.evaluate(() => { const q = window.__pulPruebas(), c = (k) => document.querySelector(`#pul-raiz [data-fila="${k}"]`), g = (k) => +(c(k)?.querySelector('.v, .g')?.textContent || 'NaN').replace(',', '.'); const l = q.L, v = (e) => e && !e.hasAttribute('hidden'); const d = document.querySelector('#pul-esc-subgl');
      return { p: q.est.cuff.p, asp: q.est.subgl.asp, vtI: Math.round(l.vtIns), vtE: g('vt'), fuga: g('fuga'), vm: g('vm'), fr: g('fr'), kg: g('vtkg'), sello: q.est.sello?.titulo || '', frase: document.getElementById('pul-frase-txt').innerText, secr: c('secr')?.querySelector('.g')?.textContent || '', visible: v(d), gotas: [...d.querySelectorAll('.sg-gota')].filter((x) => !x.hasAttribute('hidden')).length, chocan: [...d.querySelectorAll('.sg-t')].some((t) => parseFloat(getComputedStyle(t).fontSize) < 9), inicio: !!document.querySelector('#pul-dock-panel [data-m="asp"]'), tope: document.querySelector('#pul-dock-panel input[data-m="cuff"]').max }; });
    const a = await sg(); await limpio('subglotica inicio'); await foto('m1-inicio');
    ok(a.visible && a.p === 25 && !a.asp && a.vtE === 410 && a.fuga === 0 && a.secr === 'acumuladas' && a.gotas === 2 && a.inicio, `M1 inicio: balón 25, sin aspiración, secreciones ${a.secr}, ${a.gotas} gotas, Vt esp ${a.vtE}`);
    const f0 = a.frase; await clicM('asp'); const b = await sg(); await limpio('subglotica aspirando'); await foto('m1-aspirando');
    ok(b.asp && b.secr === 'despejadas' && b.gotas === 1 && b.frase !== f0, `M1 aspiración: secreciones ${b.secr}, ${b.gotas} gota, la frase viva cambia`);
    let mal = []; for (const asp of [false, true]) { if ((await sg()).asp !== asp) await clicM('asp');
      for (const v of [0, 8, 14, 15, 20, 24, 25, 26, 30, 60]) { await pide(v); const x = await sg(); const exp = Math.round(200 * (1 - Math.min(v, 25) / 25));
        const bajo = v < 15, selloOk = v > 25 ? /lesión de la mucosa/.test(x.sello) : bajo ? /Balón bajo/.test(x.sello) : x.sello === '';
        const gOk = x.gotas === (asp ? (bajo ? 2 : 1) : (bajo ? 4 : 2));
        if (!(x.p === Math.min(v, 25) && x.fuga === exp && x.vtE === 410 - exp && x.vtE >= 210 && x.vm >= 3 && x.vm <= 7 && x.fr === 16 && x.kg >= 3 && x.kg <= 6.1 && selloOk && gOk && !/NaN/.test(x.frase))) mal.push(`${asp ? 'asp' : 'sin'} ${v}: ${JSON.stringify({ p: x.p, f: x.fuga, vtE: x.vtE, vm: x.vm, s: x.sello, g: x.gotas })}`); } }
    ok(mal.length === 0, `M1 barrido balón 0-60 con y sin aspiración: fuga proporcional, Vt esp 210-410, VM 3-7, sello y gotas coherentes${mal.length ? ' · fallan ' + mal.join(' | ') : ''}`);
    await pide(60); const t = await sg(); await limpio('subglotica tope'); await foto('m1-tope');
    ok(t.p === 25 && /lesión de la mucosa/.test(t.sello) && t.fuga === 0 && t.vtE === 410, `M1 tope: pedir 60 → el mando queda en ${t.p}, sello «${t.sello}»`);
    await pide(5); await limpio('subglotica balón bajo'); await foto('m1-bajo');
    await pide(20); ok(/cerca del tope/.test((await sg()).frase + await p.evaluate(() => document.getElementById('pul-raiz').innerText)), 'M1: a 20 avisa de que está cerca del tope');
    await abrir('fuga-cuff'); await espera(500); ok(await p.evaluate(() => !document.querySelector('#pul-esc-subgl') || document.querySelector('#pul-esc-subgl').hasAttribute('hidden')), 'M1: al salir del estado la lupa se oculta');
    await abrir('subglotica'); await espera(500); await llenar(); }
  // B3c · derrame paraneumónico (Alonso): Tabla 29.5 (categoría y tubo) y horas con tubo; barrido de todos los datos y del mando 0-72 h
  await abrir('derrame-paraneumonico'); await espera(900); await llenar();
  { const clic = async (sel) => { await p.evaluate(sel => document.querySelector(sel).click(), sel); await espera(150); };
    const dq = () => p.evaluate(() => { const g = (k) => (document.querySelector(`#pul-derrame [data-fila="${k}"] .v`)?.textContent || ''); const sel = document.querySelector('#pul-raiz .tope-sello, #pul-raiz .tope-aviso');
      return { vis: !document.getElementById('pul-derrame').hidden && window.__pulPruebas().est.pac.k === 'alonso', cat: document.getElementById('pul-derrame-cat').textContent, liq: parseInt(g('der-liq')), sp: parseInt(g('der-spo2')), tope: [...document.querySelectorAll('#pul-raiz .tope-sello, #pul-raiz .tope-aviso')].filter(e => e.getClientRects().length).map(e => e.textContent).join('|'), msg: document.getElementById('pul-derrame-msg').textContent, pam: document.querySelector('#pul-corazon [data-fila="cor-pam"] .v')?.textContent }; });
    const g = (gr, v) => clic(`#pul-derrame button[data-g="${gr}"][data-v="${v}"]`);
    const hset = async (h) => { await p.evaluate((h) => { const r = document.querySelector('#pul-derrame input[type=range]'); r.value = h; r.dispatchEvent(new Event('input', { bubbles: true })); }, h); await espera(200); };
    let x = await dq(); await limpio('derrame inicio'); await foto('der-inicio');
    ok(x.vis && /Categoría 2 · NO tubo/.test(x.cat) && x.sp === 96, `Derrame inicio: ${x.cat}, SpO₂ ${x.sp}, PAM ${x.pam}`);
    const pam0 = x.pam;
    // barrido de datos: tamaño × pH × glucosa × Gram × pus
    let mal = [];
    for (const tam of ['peq', 'libre', 'locu']) for (const ph of ['alto', 'bajo']) for (const gl of ['alta', 'baja']) for (const gr of ['neg', 'pos']) for (const pus of ['no', 'si']) {
      await g('tam', tam); if (tam !== 'peq') { await g('ph', ph); await g('glu', gl); await g('gram', gr); } await g('pus', pus); x = await dq();
      const inf = tam === 'peq' ? 0 : (ph === 'bajo') + (gl === 'baja') + (gr === 'pos');
      const exp = pus === 'si' ? 4 : tam === 'peq' ? 1 : (tam === 'libre' && inf === 0) ? 2 : (tam === 'locu' && inf === 3) ? 3 : 0;
      const tuboE = exp === 3 || exp === 4 ? /TUBO/ : exp ? /NO tubo/ : /no define/;
      if (!(tuboE.test(x.cat) && (exp === 0 || x.cat.includes('Categoría ' + exp)) && x.sp >= 90 && x.sp <= 98 && x.liq >= 0 && x.liq <= 80 && x.pam === pam0 && !/NaN|undefined/.test(x.msg + x.cat))) mal.push(`${tam}/${ph}/${gl}/${gr}/${pus}→${x.cat}`);
    }
    ok(mal.length === 0, `Derrame barrido de 48 combinaciones de datos: categoría y tubo según la Tabla 29.5, SpO₂ 90-98, PAM sin cambio${mal.length ? ' · fallan ' + mal.slice(0, 4).join(' | ') : ''}`);
    // categoría 3 loculada: horas 0, 24, 36, 48, 72 con y sin segundo tubo
    await g('pus', 'no'); await g('tam', 'locu'); await g('ph', 'bajo'); await g('glu', 'baja'); await g('gram', 'pos'); x = await dq();
    ok(/Categoría 3 · TUBO/.test(x.cat) && x.liq >= 50, `Derrame cat. 3: ${x.cat}, líquido ${x.liq} %`);
    await clic('#pul-derrame [data-dr="tubo"]'); const res = {};
    for (const h of [0, 12, 24, 36, 48, 72]) { await hset(h); const y = await dq(); res[h] = y; await limpio('derrame ' + h + ' h'); }
    await hset(24); await foto('der-24h'); await hset(48); await foto('der-48h');
    ok(res[0].tope === '' && /Posible drenaje ineficaz/.test(res[24].tope) && /Drenaje ineficaz/.test(res[48].tope) && /Drenaje ineficaz/.test(res[72].tope) && res[72].liq >= 50 && res[72].sp <= 94 && res[72].sp >= 92, `Derrame loculado: sin aviso a 0 h, aviso a 24 h, sello a 48 y 72 h; a 72 h líquido ${res[72].liq} % y SpO₂ ${res[72].sp} % (bolsas)`);
    await clic('#pul-derrame [data-dr="seg"]'); const s2 = await dq();
    ok(s2.tope === '' && s2.liq < res[72].liq && s2.sp >= 96, `Derrame 2.º tubo con TC: sin sello, líquido ${s2.liq} %, SpO₂ ${s2.sp} %`);
    // libre: drena del todo a las 24 h
    await g('tam', 'libre'); await g('ph', 'bajo'); await g('pus', 'si'); await clic('#pul-derrame [data-dr="tubo"]'); await hset(24); const lib = await dq();
    ok(/Categoría 4 · TUBO/.test(lib.cat) && lib.liq <= 5 && lib.tope === '' && lib.sp >= 96, `Derrame empiema libre con tubo 24 h: líquido ${lib.liq} %, sin sello`);
    await abrir('fuga-cuff'); await espera(500); ok(await p.evaluate(() => document.getElementById('pul-derrame').hidden && !document.querySelector('#pul-raiz .tope-sello')), 'Derrame: al salir del estado el panel y su sello se apagan');
    await abrir('derrame-paraneumonico'); await espera(500); await llenar(); }
  // S3 · fuga del cuff y estridor (Benito): sin lupa ni tipo. Mandos: presión del cuff 0-30 (tope 25), edema, esteroide, desinflar, extubar, 30 min
  await abrir('fuga-cuff'); await espera(900); await llenar();
  { const clic = async (k) => { await p.evaluate(k => document.querySelector(`#pul-dock-panel [data-m="${k}"]`).click(), k); await espera(200); await llenar(); };
    const cuffPide = async (v) => { await p.evaluate((v) => { const d = document.querySelector('#pul-dock-panel input[data-m="cuff"]'); d.max = 200; d.value = v; d.dispatchEvent(new Event('input', { bubbles: true })); window.__pulPruebas().llenar(); }, v); await espera(150); await llenar(); };
    const cf = () => p.evaluate(() => { const q = window.__pulPruebas(), c = (k) => document.querySelector(`#pul-raiz [data-fila="${k}"]`), g = (k) => +(c(k)?.querySelector('.v, .g')?.textContent || 'NaN').replace(',', '.'); const l = q.L;
      return { p: q.est.cuff.p, ext: q.est.cuff.ext, vtI: Math.round(l.vtIns), vtE: g('vt'), fuga: g('fuga'), vm: g('vm'), fr: g('fr'), kg: g('vtkg'), spo2: +((c('fio2').querySelector('.sub')?.textContent || '').match(/SpO₂ (\d+)/) || [])[1] || null, int: document.querySelector('#pul-raiz [data-resp="int"]').textContent, sello: q.est.sello?.titulo || '', txt: document.getElementById('pul-raiz').innerText, flujo: Math.max(...q.mon.dato('flujo').filter((x) => x != null)), ps: q.P.S.resp.modo }; });
    const a25 = await cf(); await limpio('cuff 25');
    ok(a25.p === 25 && a25.vtI === 410 && a25.vtE === 410 && a25.fuga === 0 && a25.int === 'Tubo', `S3 cuff: a 25 Vt insp ${a25.vtI} = Vt esp ${a25.vtE}, fuga ${a25.fuga}`);
    await cuffPide(15); const a15 = await cf(); await limpio('cuff 15');
    ok(a15.fuga === 80 && a15.vtE === 330 && /Fuga audible/.test(a15.txt), `S3 cuff: a 15 fuga audible, Vt esp ${a15.vtE}, fuga ${a15.fuga}`);
    await cuffPide(22); ok(/Cuff cerca del tope/.test((await cf()).txt), 'S3 cuff: a 22 avisa de que está cerca del tope');
    await clic('apagar'); const sana = await cf(); await limpio('cuff 0 sin edema'); await foto('s3-fuga-sana');
    ok(sana.p === 0 && sana.fuga === 200 && sana.vtE === 210 && sana.fuga > 110 && /extubar, nada más/.test(sana.txt) && sana.vm >= 2, `S3 cuff 0 sin edema: Vt insp ${sana.vtI}, esp ${sana.vtE}, fuga ${sana.fuga} (>110: «extubar, nada más»)`);
    await clic('edema'); const ed = await cf(); await limpio('cuff 0 edema'); await foto('s3-fuga-edema');
    ok(ed.fuga === 80 && ed.vtE === 330 && /Fuga baja: riesgo ×7/.test(ed.sello) && ed.fuga < 110, `S3 cuff 0 con edema: Vt insp ${ed.vtI}, esp ${ed.vtE}, fuga ${ed.fuga} (<110) → sello «${ed.sello}»`);
    // tope: pedir 26..60 → el mando se queda en 25, sello de isquemia, constantes sin fuga
    for (const v of [26, 30, 50, 60]) { await cuffPide(v); const t = await cf(); await limpio('cuff pide ' + v);
      ok(t.p === 25 && /Presión del cuff por encima del tope/.test(t.sello) && t.fuga === 0 && t.vtE === 410 && t.vm >= 6 && t.vm <= 7, `S3 cuff tope: pedir ${v} → sello «${t.sello}», el mando queda en ${t.p}; Vt esp ${t.vtE}, fuga ${t.fuga}`); }
    await cuffPide(10); ok(!/por encima del tope/.test((await cf()).sello), 'S3 cuff tope: al volver a un valor válido se quita el sello');
    // barrido del cuff 0..30 con y sin edema: todo paciente posible
    let mal = []; for (const e of [false, true]) { if (((await p.evaluate(() => window.__pulPruebas().est.cuff.edema)) !== e)) await clic('edema');
      for (const v of [0, 5, 10, 15, 20, 24, 25, 30, 60]) { await cuffPide(v); const x = await cf(); const exp = Math.round((e ? 80 : 200) * (1 - Math.min(v, 25) / 25));
        if (!(x.fuga === exp && x.vtE === 410 - exp && x.vtE >= 210 && x.vm >= 3 && x.vm <= 7 && x.fr === 16 && x.kg >= 3 && x.kg <= 6.1)) mal.push(`${e ? 'edema' : 'sano'} ${v}: ${JSON.stringify({ f: x.fuga, vtE: x.vtE, vm: x.vm, kg: x.kg })}`); } }
    ok(mal.length === 0, `S3 cuff barrido 0-60 cmH₂O con y sin edema: fuga proporcional, Vt esp 210-410, VM 3-7${mal.length ? ' · fallan ' + mal.join(' | ') : ''}`);
    // Extubar: solo con el cuff a 0
    await clic('edema'); await cuffPide(10);
    ok(await p.evaluate(() => document.querySelector('#pul-dock-panel [data-m="extubar"]').disabled), 'S3 cuff: «Extubar» apagado con el cuff inflado');
    await clic('apagar'); await clic('edema');
    // con edema y sin esteroide: extubar → 30 min → estridor
    await clic('extubar'); const r0 = await cf(); await limpio('extubado');
    ok(r0.ext === 'recien' && r0.int === 'Sin tubo' && r0.ps === 'psv' && r0.spo2 === 96 && r0.vm >= 4, `S3 extubado: sin tubo, respira solo (Vt ${r0.vtE}, FR ${r0.fr}, VM ${r0.vm}), SpO₂ ${r0.spo2}`);
    await clic('esperar'); const es = await cf(); await limpio('estridor'); await foto('s3-estridor');
    ok(/reintubar sin demora/i.test(es.sello) && es.spo2 === 86 && es.vtE < r0.vtE && es.fr >= 25 && es.vm >= 2 && es.flujo < r0.flujo, `S3 estridor (edema, sin esteroide): sello «${es.sello}», SpO₂ ${es.spo2}, Vt ${es.vtE} (antes ${r0.vtE}), FR ${es.fr}, flujo máx. ${es.flujo.toFixed(1)} (antes ${r0.flujo.toFixed(1)})`);
    { const v = []; for (let i = 0; i < 4; i++) { await espera(900); v.push((await cf()).vtE); } ok(Math.max(...v) - Math.min(...v) <= 6, `S3 estridor: el Vt espirado en vivo es estable en cada respiración (${v.join(', ')})`); }
    await clic('reintubar'); const re = await cf(); ok(re.ext === null && re.int === 'Tubo' && re.p === 25 && re.fuga === 0, 'S3 cuff: «Reintubar» vuelve al respirador con el cuff a 25');
    // con el esteroide 12 h antes: sin estridor
    await clic('apagar'); await clic('ester'); await clic('extubar'); await clic('esperar'); const st = await cf(); await limpio('con esteroide');
    ok(st.ext === '30' && !/reintubar sin demora/i.test(st.sello) && !/Volumen bajo/.test(st.txt) && !/Volumen bajo/.test(es.txt) && st.spo2 === 96 && /22 % a 3 %/.test(st.txt) && st.fr === 16, `S3 con metilpred 12 h antes: sin estridor (SpO₂ ${st.spo2}, FR ${st.fr}), riesgo 22 % → 3 %`);
    await abrir('sdra-protector'); await espera(500); ok(await p.evaluate(() => !document.querySelector('#pul-dock-panel [data-m="cuff"]') && document.querySelector('#pul-raiz [data-resp="int"]').textContent === 'Tubo'), 'S3 cuff: al salir del estado desaparecen los mandos y la interfaz vuelve a «Tubo»');
    await abrir('fuga-cuff'); await espera(500); await llenar(); }
  await abrir('sbt-ok'); await espera(900); await llenar(); e = await esf(); const f1v = +(e.info.match(/FR\/Vt (\d+)/) || [])[1];
  ok(f1v >= 60 && f1v <= 105, `E4a SBT que sale bien: FR/Vt ${f1v} entre 60 y 105 (Tabla 30.1)`); await limpio('sbt-ok');
  await abrir('sbt-fracaso'); await espera(900); await llenar(); e = await esf(); const f2v = +(e.info.match(/FR\/Vt (\d+)/) || [])[1];
  ok(f2v > 105, `E4a SBT que fracasa: rápida y superficial, FR/Vt ${f2v} > 105 (Marino cap. 30 p. 52)`); await limpio('sbt-fracaso'); await foto('e4a-sbt');
  await abrir('sbt-ansiedad'); await espera(900); await llenar(); ok(await cifra('fvt') >= 60 && await cifra('fvt') <= 105 && await cifra('vtkg') >= 6 && await cifra('vtkg') <= 7, `sbt-ansiedad: rápido y profundo, casilla f/Vt ${await cifra('fvt')} (60-105) con ${await cifra('vtkg')} mL/kg`); await limpio('sbt-ansiedad');
}
// E4b · el neumotórax a tensión (par 9 de papel-pulmon.md §6): pico y meseta suben juntos, la PAM y la SpO₂ caen, el tope deja solo la descompresión
{
  const nx = (k) => p.evaluate(k => num2(document.querySelector(`#pul-neumo [data-fila="${k}"] .v`)?.textContent), k).catch(() => null);
  await p.evaluate(() => { window.num2 = s => { const m = String(s ?? '').replace(',', '.').match(/-?\d+(\.\d+)?/); return m ? +m[0] : null; }; });
  const pamNx = async () => num(await p.evaluate(() => document.querySelector('#pul-corazon [data-fila="cor-pam"] .v')?.textContent || ''));
  const estable = async () => { try { await p.waitForFunction(() => { const s = document.getElementById('pul-corazon'), n = window.__pulPruebas(); return !s.hidden && !/…/.test(s.textContent) && +s.dataset.presion === Math.round((n.L?.pMedia ?? 0) + (+document.querySelector('#pul-neumo [data-fila="neumo-p"] .v').textContent.replace(',', '.'))); }, null, { timeout: 12000 }); } catch {} await espera(200); };
  const tomar = async () => ({ pico: await cifra('pico'), mes: await cifra('meseta'), pam: await pamNx(), spo2: await nx('neumo-spo2'), ptx: await nx('neumo-p') });
  const clic = async (sel) => { await p.evaluate(sel => document.querySelector(sel).click(), sel); await espera(250); };
  await abrir('neumotorax-tension'); await espera(900); await llenar(); await estable();
  const a = await tomar();
  ok(await p.evaluate(() => !document.getElementById('pul-neumo').hidden && window.__pulPruebas().est.pac.k === 'rafael'), 'E4b: Rafael, y el panel del neumotórax se ve');
  ok(a.ptx === 0 && a.spo2 === 98 && a.mes > 10 && a.mes < 20, `E4b antes: presión 0, SpO₂ ${a.spo2} %, pico ${a.pico}, meseta ${a.mes}, PAM ${a.pam}`);
  await clic('#pul-neumo [data-nx="pasar"]'); await llenar(); await estable(); const m1 = await tomar();
  ok(m1.ptx > a.ptx && m1.pico > a.pico && m1.mes > a.mes && m1.pam < a.pam && m1.spo2 < a.spo2, `E4b: tras 5 respiraciones la presión crece (${m1.ptx}) y suben pico (${a.pico} → ${m1.pico}) y meseta (${a.mes} → ${m1.mes}); caen PAM (${m1.pam}) y SpO₂ (${m1.spo2})`);
  // paso a paso con «2 respiraciones» (+1,5): hasta 9 sin sello; el primer paso por encima de 10,5 trae el shock (PAM del monitor ≈59, medido con la app)
  const selloVis = () => p.evaluate(() => ({ s: [...document.querySelectorAll('#pul-raiz .tope-sello')].filter(e => e.getClientRects().length).map(e => e.textContent), inerte: document.getElementById('pul-dock-panel').inert }));
  let ult = m1; for (let i = 0; i < 12 && ult.ptx < 9; i++) { await clic('#pul-neumo [data-nx="pasar"]'); await llenar(); await estable(); ult = await tomar(); }
  { const s9 = await selloVis();
    ok(ult.ptx >= 9 && ult.ptx < 10.5 && s9.s.length === 0 && ult.pam > 65, `E4b antes del shock: presión ${ult.ptx}, PAM ${ult.pam}, sin sello`); }
  for (let i = 0; i < 3 && ult.ptx < 10.5; i++) { await clic('#pul-neumo [data-nx="pasar"]'); await llenar(); await estable(); ult = await tomar(); }
  { const sh = await selloVis(); const mh = ult;
    ok(sh.s.some(x => /Neumotórax a tensión: shock obstructivo/.test(x)) && sh.inerte && mh.ptx >= 10.5 && mh.ptx < 13 && (mh.ptx <= 10.5 ? mh.pam >= 40 && mh.pam <= 65 : mh.pam >= 30 && mh.pam <= 50) && mh.spo2 < 92.5, `E4b shock desde 10,5: con presión ${mh.ptx} sale el sello de shock (${sh.s.map(x => x.slice(0, 40)).join('|')}), mandos apagados, PAM ${mh.pam} (a 10,5: 40-65, la app da 52; a 12: 30-50, la app da 39), SpO₂ ${mh.spo2}`); }
  for (let i = 0; i < 4 && ult.ptx < 13.5; i++) { await clic('#pul-neumo [data-nx="pasar"]'); await llenar(); await estable(); ult = await tomar(); }
  try { await p.waitForFunction(() => /sin pulso/.test(document.querySelector('#pul-corazon [data-fila="cor-pam"] .v')?.textContent || ''), null, { timeout: 12000 }); } catch {} await espera(200); ult = await tomar();
  { const sp = await selloVis();
    ok(ult.ptx >= 13.5 && sp.s.some(x => /Parada: actividad eléctrica sin pulso/.test(x)) && !sp.s.some(x => /Neumotórax a tensión: shock obstructivo/.test(x)) && ult.pam === null && ult.spo2 === null, `E4b parada desde 13,5: con presión ${ult.ptx} el corazón ya no bombea y el sello es el de parada, sin PAM ni SpO₂ (PAM ${ult.pam}, SpO₂ ${ult.spo2}; ${sp.s.map(x => x.slice(0, 40)).join('|')})`); }
  for (let i = 0; i < 12 && ult.ptx < 20; i++) { await clic('#pul-neumo [data-nx="pasar"]'); }
  await llenar(); await estable(); await espera(4000); await llenar(); await estable();
  const t = await tomar();
  const sell = await p.evaluate(() => ({ s: [...document.querySelectorAll('#pul-raiz .tope-sello')].filter(e => e.getClientRects().length).map(e => e.textContent), inerte: document.getElementById('pul-dock-panel').inert }));
  ok(sell.s.some(x => /Parada: actividad eléctrica sin pulso/.test(x)) && sell.inerte && t.pam === null && t.ptx === 20, `E4b tope: sello «Parada: actividad eléctrica sin pulso» con PAM «sin pulso» (${t.pam}) y mandos del respirador apagados (${sell.inerte})`);
  ok(Math.abs((t.pico - t.mes) - (a.pico - a.mes)) < 1.5 && t.pico - a.pico > 15 && t.mes - a.mes > 15, `E4b tope: pico ${a.pico} → ${t.pico} y meseta ${a.mes} → ${t.mes} suben juntos; su diferencia (resistencia) se queda en ${(t.pico - t.mes).toFixed(1)}`);
  ok(t.pam === null && t.spo2 === null && /sin pulso/.test(await p.evaluate(() => document.querySelector('#pul-corazon [data-fila="cor-gc"]').textContent)) && /sin pulso/.test(await p.evaluate(() => document.querySelector('#pul-frase-txt').textContent)), `E4b tope: PAM, gasto y SpO₂ no se leen (sin pulso); antes PAM ${a.pam}, SpO₂ ${a.spo2} %`);
  ok(/Meseta alta/.test(await p.evaluate(() => document.getElementById('pul-raiz').innerText)), 'E4b tope: la meseta por encima de 30 da su aviso');
  await limpio('neumotórax en el tope'); await foto('e4b-tope');
  await clic('#pul-neumo [data-sitio="clasico"]'); await clic('#pul-neumo [data-nx="desc"]');
  { const r = await p.evaluate(() => ({ msg: document.querySelector('#pul-neumo [data-nx="msg"]').textContent, ptx: document.querySelector('#pul-neumo [data-fila="neumo-p"] .v').textContent, inerte: document.getElementById('pul-dock-panel').inert }));
    ok(/No descomprime/.test(r.msg) && r.inerte && num(r.ptx) === t.ptx, `E4b: el 2.º espacio con aguja corta falla (presión ${r.ptx} igual, sello sigue)`); }
  await clic('#pul-neumo [data-sitio="correcto"]'); await clic('#pul-neumo [data-nx="desc"]');
  { // recuperación gradual (P2): el aire pleural baja por respiraciones, no de golpe; PAM sube y SpO₂ sube sin pasar el basal
    const p0 = await tomar(); const serie = [p0]; let guardia = 0;
    while (!REDUCIDO && serie.at(-1).ptx > 0 && guardia++ < 40) { await p.waitForTimeout(1000); const m = await tomar(); if (m.ptx !== serie.at(-1).ptx) serie.push(m); }
    const ptxs = serie.map(x => x.ptx), pams = serie.map(x => x.pam), spos = serie.map(x => x.spo2);
    ok(REDUCIDO ? serie.at(-1).ptx === 0 : serie.length >= 4 && serie.length <= 9 && ptxs.every((v, i) => i === 0 || v < ptxs[i - 1]), `P2 recuperación gradual: el aire pleural baja en ${serie.length - 1} pasos (${ptxs.join(' → ')})`);
    const pn = pams.filter((v, i) => v !== null && serie[i].ptx <= 13.5);/* por encima de 13,5 (parada) el motor del corazón no es monótono: se avisa en el informe */ ok(spos.every((v, i) => i === 0 || v >= spos[i - 1]) && spos.at(-1) <= 98 && pn.every((v, i) => i === 0 || v >= pn[i - 1] - 1) && pn.at(-1) <= a.pam * 1.05, `P2: PAM (${pams.join(' → ')}) y SpO₂ (${spos.join(' → ')}) suben sin pasar el basal (${a.pam}, ${a.spo2})`); }
  await llenar(); await estable();
  const d = await tomar();
  const fin = await p.evaluate(() => ({ s: [...document.querySelectorAll('#pul-raiz .tope-sello')].filter(e => e.getClientRects().length).length, inerte: document.getElementById('pul-dock-panel').inert }));
  ok(d.ptx === 0 && fin.s === 0 && !fin.inerte && d.pam >= a.pam - 2 && d.spo2 === a.spo2 && Math.abs(d.pico - a.pico) < 1, `E4b descompresión correcta: PAM ${t.pam} → ${d.pam}, SpO₂ ${t.spo2} → ${d.spo2}, pico ${d.pico}; sin sello y con los mandos libres`);
  await limpio('neumotórax descomprimido'); await foto('e4b-descomprimido');
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

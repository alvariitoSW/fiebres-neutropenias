// Recorrido del profesor por el grupo 4B «El riñón que falla» (juicio, REGLAS §7 y §8), a 390 px.
// Abre cada ficha (la primera con los dos toques reales: tarjeta y botón), su Estudiar, contesta 2-3 preguntas de la
// guía y del examen, recorre entero cada caso (Matilde, Gregorio, Adela), pulsa «Compruébalo en el modelo» de los tres
// modelos nuevos (glomérulo PIA/crítico, nefrona rabdo y prerrenal|furosemida, filtro k-urgente), lleva los mandos a sus
// topes y lo cuenta todo en texto. Guarda ≤10 capturas en la carpeta que se le dé.
// Uso: node autonomo/bloques/b4/herramientas/4b-profesor.mjs [--capturas /tmp/plan-socialista/b4-4b/capturas/]
// Levanta su propio servidor (python3 -m http.server) en un puerto libre y lo cierra por su PID.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { createServer, connect } from 'node:net';
const RAIZ = new URL('../../../../', import.meta.url).pathname;
const { MAYEUTICA_B4 } = await import(new URL('../../../../js/data/mayeutica/b4.js', import.meta.url));
const { barajar } = await import(new URL('../../../../js/core/mayeutica-motor.js', import.meta.url));
const args = process.argv.slice(2);
const CAPTURAS = args.includes('--capturas') ? args[args.indexOf('--capturas') + 1].replace(/\/?$/, '/') : null;
if (CAPTURAS) mkdirSync(CAPTURAS, { recursive: true });

// ---------- servidor propio en un puerto libre ----------
const puerto = await new Promise(r => { const s = createServer(); s.listen(0, () => { const p = s.address().port; s.close(() => r(p)); }); });
const servidor = spawn('python3', ['-m', 'http.server', String(puerto)], { cwd: RAIZ, stdio: 'ignore' });
const BASE = `http://localhost:${puerto}/`;
const listo = () => new Promise(r => { const c = connect(puerto, 'localhost'); c.once('connect', () => { c.destroy(); r(true); }); c.once('error', () => r(false)); });
for (let i = 0; i < 50 && !(await listo()); i++) await new Promise(r => setTimeout(r, 200));
await new Promise(r => setTimeout(r, 300));
const NAV = { especialidad: 'libros', view: 'marinoRenal', panel: 'panel-marino-renal-tabs' };
const FICHAS = ['mr-fra-criterios', 'mr-fra-causas', 'mr-fra-indices', 'mr-fra-nefrotoxicos', 'mr-trr'];
const limpio = s => (s || '').replace(/\s+/g, ' ').trim();
const say = (...a) => console.log(...a);
let nFotos = 0;

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true });
const p = await ctx.newPage();
const errores = [];
p.on('console', m => { if (m.type() === 'error' && !/favicon/.test(m.text())) errores.push(m.text()); });
p.on('pageerror', e => errores.push('PAGE ' + e.message));
const pulsar = sel => p.evaluate(s => { const e = document.querySelector(s); if (!e) throw new Error('no hay ' + s); e.click(); }, sel);
const texto = (sel, n = 500) => p.evaluate(([s, k]) => (document.querySelector(s)?.textContent || '(nada)').replace(/\s+/g, ' ').trim().slice(0, k), [sel, n]);
const desborde = () => p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
const foto = async (nombre, sel) => {
    if (!CAPTURAS || nFotos >= 10) return;
    if (sel) await p.evaluate(s => document.querySelector(s)?.scrollIntoView({ block: 'start' }), sel);
    await p.waitForTimeout(500);
    nFotos++; await p.screenshot({ path: `${CAPTURAS}${nombre}.png` }); say(`   📷 ${nombre}.png`);
};
const abrirFicha = tab => p.evaluate(([t, nav]) => { const b = document.createElement('button'); Object.assign(b.dataset, { ...nav, tab: t }); document.body.append(b); b.click(); b.remove(); }, [tab, NAV]);
const fichaAbierta = tab => p.evaluate(t => { const e = document.getElementById(t); return !!e && e.classList.contains('active') && !!e.offsetParent; }, tab);
const volverVisible = () => p.evaluate(() => [...document.querySelectorAll('button')].find(b => /VOLVER A LA FICHA/.test(b.textContent) && b.offsetParent)?.id || null);
const PASO = (f, paso) => `#${f} .est-paso[data-paso="${paso}"]`;
const irPaso = (f, paso) => pulsar(`#${f} .est-ir[data-ir-paso="${paso}"]`);
const rango = (sel, v) => p.evaluate(([s, val]) => { const r = document.querySelector(s); r.value = val; r.dispatchEvent(new Event('input', { bubbles: true })); r.dispatchEvent(new Event('change', { bubbles: true })); }, [sel, v]);
// El glomérulo o el filtro que hay en la vista Visual de una ficha: sus medidores y avisos en texto.
const lecturas = async f => ({ medidores: await texto(`#${f} .gl-medidores`, 400), avisos: await texto(`#${f} .gl-avisos`, 900) });
const nefronaTxt = async () => ({ avisos: await texto('#nv-avisos', 900), tabla: await p.evaluate(() => [...document.querySelectorAll('#nv-ficha-fra tr, .nv-ficha tr')].map(t => t.textContent.replace(/\s+/g, ' ').trim()).join(' | ').slice(0, 500)), boton: await p.evaluate(() => document.getElementById('nv-rabdo-volumen')?.textContent || null), situacion: await p.evaluate(() => document.querySelector('#nv-situaciones .on')?.textContent || null) });

// Contesta una pregunta de la Mayéutica (zona Z), acertando o fallando a propósito; devuelve lo que se ve.
async function contestar(q, fallar, Z) {
    const antes = await p.evaluate(z => document.querySelector(z).innerHTML, Z);
    const fuga = [q.explicacion, ...(q.opciones || []).map(o => o.porque || ''), ...(q.frases || []).map(f => f.c || '')].filter(Boolean).map(t => t.replace(/<[^>]+>/g, '').slice(0, 40)).find(t => antes.replace(/<[^>]+>/g, '').includes(t));
    if (fuga) say(`   ❌ respuesta a la vista antes de contestar: «${fuga}»`);
    if (q.tipo === 'test') {
        const opsAntes = await p.evaluate(z => document.querySelectorAll(z + ' [data-op]').length, Z);
        await pulsar(`${Z} [data-accion="ops"]`);
        const orden = barajar(q.opciones, q.id);
        const k = orden.findIndex(o => fallar ? !o.ok : o.ok);
        say(`   test «piensa antes» (${opsAntes} opciones antes de pulsar): ` + orden.map((o, i) => `${i === k ? '▶' : ' '}${o.ok ? '✓' : '·'} ${limpio(o.t.replace(/<[^>]+>/g, ''))}`).join(' // '));
        await pulsar(`${Z} [data-op="${k}"]`);
    } else if (q.tipo === 'destapa') {
        if (await p.evaluate(z => !!document.querySelector(z + ' [data-accion="destapa"]'), Z)) await pulsar(`${Z} [data-accion="destapa"]`);
        await p.evaluate(([z, f]) => document.querySelectorAll(z + ' .may-pts input').forEach((c, i) => { c.checked = !f || i === 0; }), [Z, fallar]);
        say(`   destapa (${q.puntos.length} puntos; marco ${fallar ? 1 : 'todos'})`);
        await pulsar(`${Z} [data-accion="puntos"]`);
    } else {
        const marcar = fallar ? [q.frases.findIndex(f => !f.mal)] : q.frases.map((f, i) => f.mal ? i : -1).filter(i => i >= 0);
        say(`   error (${q.frases.filter(f => f.mal).length} malas de ${q.frases.length}; marco ${marcar.join(',')})`);
        for (const i of marcar) await pulsar(`${Z} [data-fr="${i}"]`);
        await pulsar(`${Z} [data-accion="corregir"]`);
        for (const i of q.frases.map((f, j) => f.mal ? j : -1).filter(j => j >= 0)) await pulsar(`${Z} [data-ver="${i}"]`);
    }
    await p.waitForTimeout(300);
    const r = await p.evaluate(z => { const res = document.querySelector(z + ' .may-res'); return { txt: res?.textContent.replace(/\s+/g, ' ').trim().slice(0, 260), sig: !!res?.querySelector('[data-accion="sig"]'), modelo: [...(res?.querySelectorAll('.may-modelo') || [])].map(b => b.textContent.trim()), ver: [...(res?.querySelectorAll('.may-ir') || [])].map(b => b.textContent.trim()).join(' / ') }; }, Z);
    say(`   → ${fallar ? 'fallo a propósito' : 'acierto'}: ${r.txt}`);
    say(`   → modelo: [${r.modelo.join(' | ')}] · ver: [${r.ver}] · siguiente: ${r.sig} · desborde ${await desborde()} px`);
    return r;
}
const siguiente = Z => pulsar(`${Z} [data-accion="sig"]`);
// Pulsa el «Compruébalo en el modelo» de la respuesta y cuenta dónde cae; vuelve con «← VOLVER» o «← Volver a».
async function comprobarModelo(Z, f, attr, nombreFoto, extra) {
    const sel = `${Z} .may-res .may-modelo[${attr}]`;
    if (!await p.evaluate(s => !!document.querySelector(s), sel)) { say(`   (no hay botón ${attr})`); return; }
    const txt = await texto(sel, 80);
    await pulsar(sel); await p.waitForTimeout(1500);
    const v = await volverVisible();
    const mira = await p.evaluate(ff => { const s = document.querySelector(`#${ff} .est-paso[data-paso="mira"]`); return s && !s.hidden && !!s.offsetParent; }, f);
    const miraVolver = await p.evaluate(ff => document.querySelector(`#${ff} .est-paso[data-paso="mira"] .est-volver-a`)?.textContent.replace(/\s+/g, ' ').trim() || null, f);
    say(`   «${txt}» → VOLVER A LA FICHA: ${v} · Mira abierto: ${mira} · volver-a: ${miraVolver}`);
    if (extra) await extra();
    if (nombreFoto) await foto(nombreFoto, attr.includes('nefrona') ? '#nv-escenario' : `#${f} .est-paso[data-paso="mira"] .gl-escenario`);
    if (v) await pulsar('#' + v); else if (miraVolver) await pulsar(`#${f} .est-paso[data-paso="mira"] .est-volver-a [data-ir-paso]`);
    await p.waitForTimeout(900);
    const vuelta = await p.evaluate(([ff, z]) => { const t = document.getElementById(ff); return { abierta: t.classList.contains('active') && !!t.offsetParent, est: t.classList.contains('modo-estudiar'), misma: !!document.querySelector(z + ' .may-res [data-accion="sig"]') && !!document.querySelector(z).offsetParent }; }, [f, Z]);
    say(`   vuelta: ${JSON.stringify(vuelta)}`);
}

try {
    await p.goto(BASE + 'index.html');
    await p.waitForFunction(() => document.getElementById('mar-cristaloides')?.querySelector(':scope > .vista-estudiar') && document.getElementById('mr-fra-criterios')?.querySelector(':scope > .vista-visual'), null, { timeout: 60000 });
    await p.waitForTimeout(1500);
    // Si el Estudiar del 4B no está montado (en libros/index.js se monta antes de initVisualMarinoCaps31a44, que crea el
    // interruptor), lo monta desde la página con los módulos ya cargados, para poder juzgar el contenido. Se anota como fallo.
    const montadoApp = await p.evaluate(() => !!document.getElementById('mr-fra-criterios')?.querySelector(':scope > .vista-estudiar'));
    say(`   Estudiar del 4B montado por la app al arrancar: ${montadoApp}${montadoApp ? '' : '  ❌ FALLO GRAVE (lo monto yo desde la página para seguir)'}`);
    if (!montadoApp) await p.evaluate(async () => { const m = await import('/js/core/mayeutica.js'); const d = await import('/js/data/mayeutica/b4.js'); Object.entries(d.MAYEUTICA_B4).forEach(([f, x]) => m.montarMayeutica(f, x)); });
    try { await p.waitForFunction(() => document.getElementById('mr-fra-criterios')?.querySelector(':scope > .vista-estudiar'), null, { timeout: 10000 }); }
    catch (e) { say('   arranque: ' + JSON.stringify(await p.evaluate(() => ({ ficha: !!document.getElementById('mr-fra-criterios'), hijos: document.getElementById('mr-fra-criterios')?.children.length, estudiar: !!document.getElementById('mr-fra-criterios')?.querySelector('.vista-estudiar'), b1: !!document.getElementById('mar-cristaloides')?.querySelector('.vista-estudiar') })))); throw e; }

    // ---------- 1. Primera ficha con los dos toques reales ----------
    say('\n══ Dos toques reales hasta mr-fra-criterios');
    await p.click('#btn-libros'); await p.waitForTimeout(200);
    await p.click('#btn-libro-marino'); await p.waitForTimeout(200);
    const botonRenal = await p.evaluate(() => { const b = [...document.querySelectorAll('button')].find(x => /renal/i.test(x.textContent) && x.offsetParent && /btn-marino/.test(x.id)); if (b) b.click(); return b?.id || null; });
    say(`   botón del cuaderno: ${botonRenal}`);
    await p.waitForTimeout(300);
    const tarjeta = await p.evaluate(() => { const c = document.querySelector('.field-card[data-tab="mr-fra-criterios"]'); if (!c) return null; c.scrollIntoView(); c.click(); return c.textContent.replace(/\s+/g, ' ').trim().slice(0, 120); });
    say(`   tarjeta: ${tarjeta}`);
    await p.waitForTimeout(300);
    await p.evaluate(() => { const c = document.querySelector('.field-card[data-tab="mr-fra-criterios"] .back-cta') || document.querySelector('.field-card[data-tab="mr-fra-criterios"] button'); c?.click(); });
    await p.waitForTimeout(500);
    say(`   ficha abierta: ${await fichaAbierta('mr-fra-criterios')}`);

    for (const f of FICHAS) {
        const d = MAYEUTICA_B4[f];
        say(`\n══════════ ${f} ══════════`);
        if (!await fichaAbierta(f)) { await abrirFicha(f); await p.waitForTimeout(500); }
        say(`   abierta: ${await fichaAbierta(f)} · interruptor: ${await p.evaluate(ff => [...document.querySelectorAll(`#${ff} > .vista-toggle button`)].map(b => b.textContent).join('|'), f)}`);
        // Carril de 30 s: lo primero que se ve del texto
        await p.evaluate(ff => document.getElementById(ff).scrollIntoView({ block: 'start' }), f);
        say(`   primera pantalla: ${await texto(`#${f} > .vista-texto`, 420)}`);
        say(`   botones a modelos en el texto: ${await p.evaluate(ff => [...document.querySelectorAll(`#${ff} [data-glomerulo], #${ff} [data-nefrona-viva], #${ff} [data-filtro-vivo]`)].map(b => b.textContent.trim().slice(0, 60)).join(' | '), f)}`);
        if (f === 'mr-fra-criterios') await foto('c01-criterios-primera', `#${f}`);

        // Estudiar → Mira
        await pulsar(`#${f} > .vista-toggle [data-vista="estudiar"]`); await p.waitForTimeout(500);
        say(`   resumen: ${await p.evaluate(ff => [...document.querySelectorAll(`#${ff} .est-ir`)].map(b => b.textContent.replace(/\s+/g, ' ').trim()).join(' | '), f)}`);
        say(`   Mira (paneles): ${await p.evaluate(ff => [...document.querySelectorAll(`#${ff} .est-paso[data-paso="mira"] .vista-visual h3, #${ff} .est-paso[data-paso="mira"] .vista-visual h4, #${ff} .est-paso[data-paso="mira"] .vista-visual .vk-titulo`)].map(h => h.textContent.trim()).join(' | ').slice(0, 400), f)}`);
        say(`   entrada: ${d.entrada}`);

        // Piezas de modelo dentro de la vista Visual de la ficha (glomérulo, filtro): mandos a sus topes
        if (f === 'mr-fra-criterios') {
            await pulsar(`#${f} [data-glomerulo="critico"]`); await p.waitForTimeout(800);
            say(`   glomérulo crítico: ${JSON.stringify(await lecturas(f))}`);
            await foto('c02-criterios-glomerulo-critico', `#${f} .est-paso[data-paso="mira"] .gl-escenario`);
        }
        if (f === 'mr-fra-causas') {
            await pulsar(`#${f} [data-glomerulo="pam=75,pia=19"]`); await p.waitForTimeout(800);
            say(`   glomérulo PAM 75 PIA 19: ${JSON.stringify(await lecturas(f))}`);
            await foto('c03-causas-glomerulo-pia19', `#${f} .est-paso[data-paso="mira"] .gl-escenario`);
            await rango(`#${f} .gl-pia`, 40); await p.waitForTimeout(400);
            say(`   PIA al tope (40): ${JSON.stringify(await lecturas(f))}`);
            await rango(`#${f} .gl-pam`, 60); await rango(`#${f} .gl-pia`, 20); await p.waitForTimeout(400);
            say(`   PAM 60 PIA 20: ${JSON.stringify(await lecturas(f))}`);
            await rango(`#${f} .gl-pia`, 7); await p.waitForTimeout(300);
            say(`   PIA 7 (normal): avisos ${await texto(`#${f} .gl-avisos`, 200)}`);
            say(`   desborde: ${await desborde()} px`);
        }
        if (f === 'mr-trr') {
            await pulsar(`#${f} [data-filtro-vivo="k-urgente"]`); await p.waitForTimeout(800);
            say(`   filtro k-urgente (inicio): ${JSON.stringify(await lecturas(f))}`);
            say(`   modos: ${await p.evaluate(ff => [...document.querySelectorAll(`#${ff} [data-fv="modo"]`)].map(b => b.textContent.trim() + (b.classList.contains('on') ? '(on)' : '')).join(' | '), f)}`);
            await rango(`#${f} [data-fv-rango="horas"]`, 3); await p.waitForTimeout(300);
            say(`   HD 3 h: ${JSON.stringify(await lecturas(f))}`);
            await pulsar(`#${f} [data-fv="calcio"][data-valor="si"]`); await rango(`#${f} [data-fv-rango="k0"]`, 8.5); await rango(`#${f} [data-fv-rango="horas"]`, 4); await p.waitForTimeout(300);
            say(`   K 8,5 + calcio, 4 h: ${JSON.stringify(await lecturas(f))}`);
            if (await p.evaluate(ff => !!document.querySelector(`#${ff} [data-fv="modo"][data-valor="hf"]`), f)) { await pulsar(`#${f} [data-fv="modo"][data-valor="hf"]`); await p.waitForTimeout(300); say(`   hemofiltración 4 h: ${JSON.stringify(await lecturas(f))}`); await pulsar(`#${f} [data-fv="modo"][data-valor="hd"]`); }
            await rango(`#${f} [data-fv-rango="k0"]`, 5.5); await rango(`#${f} [data-fv-rango="horas"]`, 4); await p.waitForTimeout(300);
            say(`   K 5,5, HD 4 h (suelo): ${await texto(`#${f} .gl-avisos`, 400)}`);
            say(`   desborde: ${await desborde()} px`);
        }

        // Juega
        await irPaso(f, 'juega'); await p.waitForTimeout(200);
        say(`   Juega: ${await p.evaluate(ff => [...document.querySelectorAll(`#${ff} .est-paso[data-paso="juega"] .est-juega`)].map(b => b.textContent.replace(/\s+/g, ' ').trim().slice(0, 90)).join(' || '), f)}`);

        // Piensa: 3 primeras de la guía (la 1.ª fallada)
        await irPaso(f, 'piensa'); await p.waitForTimeout(200);
        const ZG = `${PASO(f, 'piensa')} .may-zona`, ZE = `${PASO(f, 'examen')} .may-zona`, ZC = `${PASO(f, 'caso')} .may-zona`;
        await pulsar(`${ZG} [data-ir="seguir"]`);
        say(`\n   — Piensa (${d.guia.length} preguntas)`);
        for (const [i, q] of d.guia.slice(0, 3).entries()) {
            say(`  [${q.id}] ${q.enunciado}`);
            await contestar(q, i === 0, ZG);
            if (f === 'mr-fra-causas' && q.tipo === 'destapa') await foto('c04-causas-destapa', `${ZG} .may-res`);
            if (f === 'mr-fra-indices' && q.id === 'rin-ind-g4') await comprobarModelo(ZG, f, 'data-nefrona-viva', 'c05-nefrona-prerrenal-furosemida', async () => say(`   nefrona: ${JSON.stringify(await nefronaTxt())}`));
            await siguiente(ZG);
        }
        if (f === 'mr-fra-indices' && d.guia.length > 3) { const q = d.guia[3]; say(`  [${q.id}] ${q.enunciado}`); await contestar(q, false, ZG); await comprobarModelo(ZG, f, 'data-nefrona-viva', 'c05-nefrona-prerrenal-furosemida', async () => say(`   nefrona: ${JSON.stringify(await nefronaTxt())}`)); await siguiente(ZG); }

        // Examínate: la de «error» y otra
        await irPaso(f, 'examen'); await p.waitForTimeout(200);
        await pulsar(`${ZE} [data-ir="seguir"]`);
        say(`\n   — Examínate (${d.examen.length} preguntas)`);
        for (const [i, q] of d.examen.entries()) {
            if (i > 1 && q.tipo !== 'error') { await siguienteSinContestar(ZE, q); continue; }
            say(`  [${q.id}] ${q.enunciado}`);
            await contestar(q, q.tipo === 'error', ZE);
            if (f === 'mr-trr' && q.tipo === 'error') await foto('c10-trr-examen-error', `${ZE} .may-res`);
            await siguiente(ZE);
        }
        say(`   final del examen: ${await texto(ZE, 200)}`);

        // El caso, entero
        if (d.casos.length) {
            await irPaso(f, 'caso'); await p.waitForTimeout(200);
            for (const [k, caso] of d.casos.entries()) {
                say(`\n   — Caso ${caso.titulo} (${caso.pasos.length} pasos)`);
                await pulsar(`${ZC} [data-caso="${k}"]`);
                for (const [j, paso] of caso.pasos.entries()) {
                    const fichaPac = await p.evaluate(z => ({ nuevos: [...document.querySelectorAll(z + ' .may-paciente dd.may-cambia')].map(d => d.textContent.replace(/\s+/g, ' ').trim()).join(' ; '), dia: document.querySelector(z + ' .may-dia')?.textContent }), ZC);
                    say(`  ${fichaPac.dia} · nuevo: ${fichaPac.nuevos}`);
                    say(`  [${paso.pregunta.id}] ${paso.pregunta.enunciado}`);
                    const r = await contestar(paso.pregunta, j === 1, ZC);
                    if (caso.id === 'rin-mat' && paso.pregunta.id === 'rin-mat-4') await comprobarModelo(ZC, f, 'data-glomerulo', null, async () => say(`   glomérulo: ${JSON.stringify(await lecturas(f))}`));
                    if (caso.id === 'rin-mat' && paso.pregunta.id === 'rin-mat-6') await foto('c06-matilde-error', `${ZC} .may-res`);
                    if (caso.id === 'rin-gregorio' && j === 0) await comprobarModelo(ZC, f, 'data-nefrona-viva', 'c08-nefrona-rabdo-salino', async () => { say(`   nefrona rabdo: ${JSON.stringify(await nefronaTxt())}`); await pulsar('#nv-rabdo-volumen'); await p.waitForTimeout(600); say(`   nefrona rabdo + salino: ${JSON.stringify(await nefronaTxt())}`); say(`   desborde nefrona: ${await desborde()} px`); });
                    if (caso.id === 'rin-adela' && paso.pregunta.id === 'rin-ad-3') await comprobarModelo(ZC, f, 'data-filtro-vivo', 'c09-filtro-k-urgente-adela', async () => say(`   filtro: ${JSON.stringify(await lecturas(f))}`));
                    await siguiente(ZC);
                }
                say(`   fin: ${await texto(ZC, 700)}`);
                say(`   desborde: ${await desborde()} px`);
                if (caso.id === 'rin-mat') await foto('c07-matilde-fin', ZC);
            }
        }
        // Para profundizar
        const prof = await p.evaluate(ff => { const det = document.querySelector(`#${ff} .may-profundizar`); if (!det) return null; det.open = true; det.dispatchEvent(new Event('toggle')); return [...det.querySelectorAll('.may-prof-item')].map(s => s.querySelector('summary, b, strong')?.textContent.trim() + ' (' + s.textContent.trim().length + ' car.)').join(' | '); }, f);
        say(`   Para profundizar: ${prof}`);
        say(`   errores de consola hasta aquí: ${errores.length}`);
    }
} catch (e) {
    say('\n💥 ' + (e.stack || e));
} finally {
    say(`\nerrores de consola: ${errores.length ? errores.join('\n') : 'ninguno'}`);
    await b.close();
    process.kill(servidor.pid);
}

async function siguienteSinContestar(Z, q) {
    // Para no alargar: contesta bien y pasa, sin imprimir
    await contestarSilencio(q, Z); await siguiente(Z);
}
async function contestarSilencio(q, Z) {
    if (q.tipo === 'test') { await pulsar(`${Z} [data-accion="ops"]`); const k = barajar(q.opciones, q.id).findIndex(o => o.ok); await pulsar(`${Z} [data-op="${k}"]`); }
    else if (q.tipo === 'destapa') { if (await p.evaluate(z => !!document.querySelector(z + ' [data-accion="destapa"]'), Z)) await pulsar(`${Z} [data-accion="destapa"]`); await p.evaluate(z => document.querySelectorAll(z + ' .may-pts input').forEach(c => { c.checked = true; }), Z); await pulsar(`${Z} [data-accion="puntos"]`); }
    else { for (const i of q.frases.map((f, j) => f.mal ? j : -1).filter(j => j >= 0)) await pulsar(`${Z} [data-fr="${i}"]`); await pulsar(`${Z} [data-accion="corregir"]`); for (const i of q.frases.map((f, j) => f.mal ? j : -1).filter(j => j >= 0)) await pulsar(`${Z} [data-ver="${i}"]`); }
    await p.waitForTimeout(150);
}

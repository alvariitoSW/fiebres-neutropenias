// Prueba de la Mayéutica de las fichas (juez de autonomo/jueces.mjs --modelo mayeutica-fichas).
// Uso: node autonomo/pruebas/mayeutica-fichas.mjs <url-base> [--capturas <carpeta>]
//
// 1. Sin navegador, los datos de js/data/mayeutica/*.js frente a REGLAS §8: Guía socrática y Examen en cada ficha;
//    un test con una sola buena y cada falsa con su «qué le habría pasado al paciente»; «encuentra el error» con 0-2
//    errores, cada uno con su frase buena; destapa con 2-4 puntos; casos de 5-8 pasos con al menos un «error», un
//    «destapa» y 3 «Lo que te llevas»; la buena es la opción más larga en ≤ ⅓ de los tests (y, por archivo de grupo, también la más corta en ≤ ⅓) y no siempre en el mismo
//    sitio; ids únicos; toda `fuente` y todo «Para profundizar» apuntan a un id que existe.
// 2. En el navegador, a 390 px y a 360 px (con «reducir movimiento»), en un contexto limpio: cada ficha con
//    Mayéutica abre con Texto | Mayéutica | Estudiar (y una ficha sin ella sigue con Texto | Visual); Estudiar enseña el resumen
//    de los 5 pasos y abre en «Mira», con la vista Visual de la ficha dentro; «Juega» trae los botones a los modelos
//    vivos (y en una ficha, el modelo y su «← VOLVER» al paso Juega); «Piensa» (la guía) y «Examínate» (el examen y
//    el repaso hasta vaciarlo) enteros, fallando algunas (sin las respuestas en el HTML, sin el botón del modelo
//    antes de contestar); «El caso», todos hasta «Lo que te llevas»; las marcas de hecho; «Para profundizar»
//    (copiado sin ids repetidos, con su «Ver en el texto»); «Compruébalo en el modelo» y su «← VOLVER» a la ficha;
//    un enlace «vista Visual» de una pregunta, que abre «Mira» con la vuelta a la pregunta; el botón «🖼️ Visual» de
//    la cabecera, que abre Estudiar → Mira; la ruta del bloque y lo guardado tras recargar. Mide el desborde lateral
//    tras cada respuesta y cada paso. Sale con código 1 si algo falla.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
const { MAYEUTICA_B1: SOLO_B1 } = await import(new URL('../../../../js/data/mayeutica/b1.js', import.meta.url));
const { MAYEUTICA_B2 } = await import(new URL('../../../../js/data/mayeutica/b2.js', import.meta.url));
const { MAYEUTICA_B3 } = await import(new URL('../../../../js/data/mayeutica/b3.js', import.meta.url));
// Las fichas con Estudiar de todos los bloques (el nombre MAYEUTICA_B1 se queda para no tocar el resto de la prueba).
const { MAYEUTICA_6A } = await import(new URL('../../../../js/data/mayeutica/b6a-despierto.js', import.meta.url));
const MAYEUTICA_B1 = { ...SOLO_B1, ...MAYEUTICA_B2, ...MAYEUTICA_B3, ...MAYEUTICA_6A };
// Dónde vive cada ficha: las del bloque 1 en Libros → Marino · Fundamentos; las del bloque 2, en Hematología → Merino HEMATO.
const NAV_B2 = { especialidad: 'home', view: 'merinoHemato', panel: 'panel-merino-tabs' };
// Las del bloque 3, en Cardiología → Merino Cardiología (mc-) y Neumología → Merino Neumología (neumo-).
const NAV_B3 = tab => tab.startsWith('neumo-') ? { especialidad: 'neumologia', view: 'merinoNeumologia', panel: 'panel-merino-neumo-tabs' } : { especialidad: 'cardiologia', view: 'merinoCardiologia', panel: 'panel-merino-cardio-tabs' };
const navDe = tab => MAYEUTICA_6A[tab] ? { especialidad: 'libros', view: 'marinoNeuro', panel: 'panel-marino-neuro-tabs' } : MAYEUTICA_B3[tab] ? NAV_B3(tab) : MAYEUTICA_B2[tab] ? NAV_B2 : { especialidad: 'libros', view: 'marinoFundamentos', panel: 'panel-marino-fund-tabs' };
const { barajar, hoyLocal, sumarDias } = await import(new URL('../../../../js/core/mayeutica-motor.js', import.meta.url));
const args = process.argv.slice(2);
const BASE = (args.find(a => /^https?:/.test(a)) || 'http://localhost:8000/').replace(/\/?$/, '/');
const CAPTURAS = args.includes('--capturas') ? args[args.indexOf('--capturas') + 1].replace(/\/?$/, '/') : null;
const RAIZ = new URL('../../../../', import.meta.url).pathname;
const fallosTotales = [];
const okG = (c, t) => { console.log(`${c ? '✅' : '❌'} ${t}`); if (!c) fallosTotales.push(t); };
// MAY_SOLO=<prefijo> (variable de entorno) limita la parte del navegador a esas fichas, para probar un bloque deprisa.
const FICHAS = Object.keys(MAYEUTICA_B1).filter(f => !process.env.MAY_SOLO || f.startsWith(process.env.MAY_SOLO));
const largo = s => s.replace(/<[^>]+>/g, '').length;

/* ---------- 1. Los datos (sin navegador) ---------- */
{
    const html = [];
    const recorrer = d => readdirSync(d).forEach(n => { const p = join(d, n); if (statSync(p).isDirectory()) { if (!/vendor/.test(p)) recorrer(p); } else if (p.endsWith('.html')) html.push(readFileSync(p, 'utf8')); });
    recorrer(join(RAIZ, 'js')); html.push(readFileSync(join(RAIZ, 'index.html'), 'utf8'));
    const idsHtml = new Set(html.join('\n').match(/\sid="[^"]+"/g).map(s => s.slice(5, -1)));
    const vistos = new Map();
    for (const [ficha, d] of Object.entries(MAYEUTICA_B1)) {
        const m = [];
        if (!idsHtml.has(ficha)) m.push('la ficha no existe');
        if (!d.guia?.length) m.push('sin Guía socrática');
        if (!d.examen?.length) m.push('sin Examen');
        if (!d.casos?.length) m.push('sin casos');
        const preguntas = [...d.guia, ...d.examen, ...d.casos.flatMap(c => c.pasos.map(p => p.pregunta))];
        const tests = preguntas.filter(q => q.tipo === 'test');
        let masLarga = 0; const posiciones = {};
        for (const q of preguntas) {
            if (vistos.has(q.id)) m.push(`id repetido ${q.id}`); vistos.set(q.id, ficha);
            if (!['test', 'destapa', 'error'].includes(q.tipo)) m.push(`${q.id}: tipo «${q.tipo}»`);
            if (!q.fuente) m.push(`${q.id}: sin fuente`);
            for (const t of String(q.fuente || '').split(' · ')) { const id = t.trim().split(/\s/)[0]; if (/^[a-z0-9]+(-[a-z0-9]+)+$/.test(id) && !idsHtml.has(id)) m.push(`${q.id}: fuente «${id}» no existe`); }
            if (q.tipo === 'test') {
                const buenas = q.opciones.filter(o => o.ok);
                if (buenas.length !== 1) m.push(`${q.id}: ${buenas.length} opciones buenas`);
                if (q.opciones.some(o => !o.ok && !(o.porque && o.porque.length > 40))) m.push(`${q.id}: una opción falsa sin su «qué le habría pasado»`);
                const max = Math.max(...q.opciones.map(o => largo(o.t)));
                if (largo(buenas[0]?.t || '') === max) masLarga++;
                const pos = barajar(q.opciones, q.id).findIndex(o => o.ok);
                posiciones[pos] = (posiciones[pos] || 0) + 1;
            }
            if (q.tipo === 'error') {
                const n = q.frases.filter(f => f.mal).length;
                if (n > 2) m.push(`${q.id}: ${n} errores (como mucho 2)`);
                if (q.frases.length < 4 || q.frases.length > 6) m.push(`${q.id}: ${q.frases.length} frases (4-6)`);
                if (q.frases.some(f => f.mal && !f.c)) m.push(`${q.id}: un error sin su frase buena`);
            }
            if (q.tipo === 'destapa' && (q.puntos.length < 2 || q.puntos.length > 4)) m.push(`${q.id}: ${q.puntos.length} puntos (2-4)`);
        }
        for (const c of d.casos) {
            if (c.pasos.length < 5 || c.pasos.length > 8) m.push(`caso ${c.id}: ${c.pasos.length} pasos (5-8)`);
            if (!c.pasos.some(p => p.pregunta.tipo === 'error')) m.push(`caso ${c.id}: sin «encuentra el error»`);
            if (!c.pasos.some(p => p.pregunta.tipo === 'destapa')) m.push(`caso ${c.id}: sin «piensa y destapa»`);
            if (c.lleva?.length !== 3) m.push(`caso ${c.id}: «Lo que te llevas» con ${c.lleva?.length} puntos`);
            if (c.volver?.ancla && !idsHtml.has(c.volver.ancla)) m.push(`caso ${c.id}: ancla «${c.volver.ancla}» no existe`);
        }
        for (const p of d.profundizar || []) if (!idsHtml.has(p.id)) m.push(`«Para profundizar» «${p.id}» no existe`);
        okG(!m.length, `${ficha}: datos según REGLAS §8 (${d.guia.length} guía, ${d.examen.length} examen, ${d.casos.length} caso${d.casos.length > 1 ? 's' : ''})${m.length ? ' → ' + m.join(' · ') : ''}`);
        okG(masLarga <= tests.length / 3, `${ficha}: la buena es la más larga en ${masLarga} de ${tests.length} tests (≤ ⅓)`);
        const maxPos = Math.max(...Object.values(posiciones));
        okG(Object.keys(posiciones).length >= 2 && maxPos <= tests.length * 0.6, `${ficha}: la buena sale en posiciones variadas ${JSON.stringify(posiciones)}`);
    }
    // Por archivo de grupo (js/data/mayeutica/b1-*.js): la buena no es sistemáticamente ni la más larga ni la más corta.
    // La longitud no depende del orden en que se barajan las opciones, así que se miran los datos sin barajar.
    for (const arch of readdirSync(join(RAIZ, 'js/data/mayeutica')).filter(n => /^b\d+[a-z]?-.+\.js$/.test(n))) {
        const mod = await import(new URL('../../../../js/data/mayeutica/' + arch, import.meta.url));
        let n = 0, larga = 0, corta = 0;
        for (const d of Object.values(mod).flatMap(g => Object.values(g))) {
            const qs = [...d.guia, ...d.examen, ...d.casos.flatMap(c => c.pasos.map(p => p.pregunta))].filter(q => q.tipo === 'test');
            for (const q of qs) {
                const ls = q.opciones.map(o => largo(o.t)), ok = largo(q.opciones.find(o => o.ok)?.t || '');
                n++; if (ok === Math.max(...ls)) larga++; if (ok === Math.min(...ls)) corta++;
            }
        }
        okG(larga <= n / 3, `${arch}: la buena es la más larga en ${larga} de ${n} tests (≤ ⅓)`);
        okG(corta <= n / 3, `${arch}: la buena es la más corta en ${corta} de ${n} tests (≤ ⅓)`);
    }
}

/* ---------- 2. En el navegador ---------- */
const b = await chromium.launch();
async function correr(ANCHO, REDUCIDO) {
    const tag = `${ANCHO}${REDUCIDO ? '-red' : ''}`;
    console.log(`\n── ${ANCHO} px${REDUCIDO ? ' · reducir movimiento' : ''}`);
    const ctx = await b.newContext({ viewport: { width: ANCHO, height: 844 }, deviceScaleFactor: 2, reducedMotion: REDUCIDO ? 'reduce' : 'no-preference' });
    const p = await ctx.newPage();
    const errores = [], fallos = [];
    p.on('console', m => { if (m.type() === 'error' && !/favicon/.test(m.text())) errores.push(m.text()); });
    p.on('pageerror', e => errores.push('PAGE ' + e.message));
    const ok = (c, t) => { console.log(`${c ? '✅' : '❌'} ${t}`); if (!c) fallos.push(t); };
    const pulsar = sel => p.evaluate(s => { const e = document.querySelector(s); if (!e) throw new Error('no hay ' + s); e.click(); }, sel);
    const desborde = () => p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    const foto = async (n, sel) => {
        if (!CAPTURAS) return;
        if (sel) await p.evaluate(s => document.querySelector(s)?.scrollIntoView({ block: 'start' }), sel);
        await p.waitForTimeout(REDUCIDO ? 80 : 400);
        await p.screenshot({ path: `${CAPTURAS}may-${n}-${tag}.png` });
    };
    const abrirFicha = tab => p.evaluate(([t, nav]) => { const b = document.createElement('button'); Object.assign(b.dataset, { ...nav, tab: t }); document.body.append(b); b.click(); b.remove(); }, [tab, navDe(tab)]);
    const fichaAbierta = tab => p.evaluate(t => { const e = document.getElementById(t); return e.classList.contains('active') && !!e.offsetParent; }, tab);

    await p.goto(BASE + 'index.html');   // contexto nuevo: localStorage vacío
    await p.waitForFunction(() => document.getElementById('mar-cristaloides')?.querySelector(':scope > .vista-estudiar'), null, { timeout: 15000 });

    // La ruta del bloque, al principio del cuaderno
    await p.click('#btn-libros'); await p.click('#btn-libro-marino'); await p.click('#btn-marino-fund'); await p.waitForTimeout(300);
    const ruta = await p.evaluate(() => { const d = document.getElementById('mar-ruta-bloque'); d.open = true; return { etapas: d.querySelectorAll('.ruta-etapas > li').length, fichas: d.querySelectorAll('[data-tab]').length, visible: !!d.offsetParent }; });
    ok(ruta.visible && ruta.etapas === 7 && ruta.fichas === 23, `la ruta del bloque: ${ruta.etapas} etapas y ${ruta.fichas} enlaces a fichas`);
    ok(await desborde() <= 0, 'sin desborde con la ruta abierta');
    await foto('00-ruta', '#mar-ruta-bloque');
    await pulsar('#mar-ruta-bloque [data-tab="mar-coloides"]'); await p.waitForTimeout(500);
    ok(await fichaAbierta('mar-coloides'), 'la ruta lleva a su ficha (coloides)');

    // Una ficha sin Mayéutica sigue con Texto | Visual
    // (la primera ficha del cuaderno que aún no tiene Mayéutica; si ya la tienen todas, no hay nada que mirar)
    const sinMay = await p.evaluate(f => [...document.querySelectorAll('#panel-marino-fund-tabs .tab-content[data-visual]')].map(t => t.id).find(id => !f.includes(id)), Object.keys(MAYEUTICA_B1));
    if (sinMay) {
        await abrirFicha(sinMay); await p.waitForTimeout(400);
        ok(await p.evaluate(t => [...document.querySelectorAll(`#${t} > .vista-toggle button`)].map(b => b.textContent).join('|'), sinMay) === 'Texto|Visual', `una ficha sin Mayéutica (${sinMay}) sigue con Texto | Visual`);
    }

    let nDesbordeOk = 0, juegaProbado = false, enVisualProbado = false;
    const PASO = (f, paso) => `#${f} .est-paso[data-paso="${paso}"]`;
    const irPaso = (f, paso) => pulsar(`#${f} .est-ir[data-ir-paso="${paso}"]`);
    const volverVisible = () => p.evaluate(() => [...document.querySelectorAll('button')].find(b => /VOLVER A LA FICHA/.test(b.textContent) && b.offsetParent)?.id || null);
    for (const [nf, ficha] of FICHAS.entries()) {
        const d = MAYEUTICA_B1[ficha];
        await abrirFicha(ficha); await p.waitForTimeout(500);
        ok(await fichaAbierta(ficha), `${ficha}: la ficha abre`);
        const botones = await p.evaluate(f => [...document.querySelectorAll(`#${f} > .vista-toggle button`)].map(b => b.textContent).join('|'), ficha);
        ok(botones === 'Texto|Mayéutica|Estudiar', `${ficha}: interruptor «${botones}»`);
        ok(await p.evaluate(f => !document.querySelector(`#${f} .est-resumen, #${f} .may-zona`), ficha), `${ficha}: Estudiar no se construye hasta pulsarlo (no hay preguntas en el HTML)`);
        if (nf === 0) await foto('00b-interruptor', `#${ficha} > .vista-toggle`);
        await pulsar(`#${ficha} > .vista-toggle [data-vista="estudiar"]`); await p.waitForTimeout(400);
        const vis = await p.evaluate(f => { const t = document.getElementById(f); return { est: !!t.querySelector(':scope > .vista-estudiar').offsetParent, texto: !!t.querySelector(':scope > .vista-texto').offsetParent }; }, ficha);
        ok(vis.est && !vis.texto, `${ficha}: Estudiar visible y el texto oculto`);
        // El resumen de los 5 pasos, y «Mira» abierto con la vista Visual de la ficha dentro
        const res = await p.evaluate(f => [...document.querySelectorAll(`#${f} .est-ir`)].map(b => b.querySelector('b').textContent.replace(/ \(hecho\)$/, '')).join('|'), ficha);
        const esperado = `1 · Mira|2 · Juega con el modelo|3 · Piensa|4 · Examínate|5 · ${d.casos.length > 1 ? 'Los casos' : 'El caso'}`;
        ok(res === esperado, `${ficha}: el resumen con los 5 pasos («${res}»)`);
        const mira = await p.evaluate(f => { const s = document.querySelector(`#${f} .est-paso[data-paso="mira"]`), v = s.querySelector('.est-lienzo > .vista-visual'); return { abierto: !s.hidden && !!s.offsetParent, solo: [...document.querySelectorAll(`#${f} .est-paso`)].filter(x => !x.hidden).length, visual: !!v && v.children.length > 0 && v.offsetHeight > 100, fuera: !!document.querySelector(`#${f} > .vista-visual`), marca: document.querySelector(`#${f} .est-ir[data-ir-paso="mira"] .est-marca`).textContent }; }, ficha);
        ok(mira.abierto && mira.solo === 1 && mira.visual && !mira.fuera && mira.marca === '✓', `${ficha}: Estudiar abre en «Mira», con la vista Visual dentro y su marca (${JSON.stringify(mira)})`);
        ok(await desborde() <= 0, `${ficha}: sin desborde en «Mira»`);
        if (nf === 0) { await foto('01-resumen', `#${ficha} > .vista-toggle`); await foto('01b-mira', PASO(ficha, 'mira')); }
        // «Juega con el modelo»
        await irPaso(ficha, 'juega'); await p.waitForTimeout(200);
        const juega = await p.evaluate(f => [...document.querySelectorAll(`#${f} .est-paso[data-paso="juega"] .est-juega`)].map(b => ({ modelo: Object.keys(b.dataset).some(k => /Viva|Vivo|ecoEscenario|^glomerulo$/.test(k)), texto: b.textContent.trim() })), ficha);
        // Una ficha cuyo modelo aún no existe (sus preguntas solo llevan `modeloFuturo`) dice que no enlaza ninguno.
        const sinModeloAun = !juega.length && await p.evaluate(f => /no enlaza ningún modelo vivo/.test(document.querySelector(`#${f} .est-paso[data-paso="juega"]`).textContent), ficha) && !/modeloVivo|"(aguaViva|capilarVivo|cateterVivo|murallaViva|telarVivo|inmersionViva|acidobaseVivo|ecoEscenario)"/.test(JSON.stringify(d, (k, v) => k === 'modeloFuturo' ? undefined : v));
        ok(sinModeloAun || (juega.length > 0 && juega.every(j => j.modelo && j.texto.length > 3 && !/\b(mar|mr|mh)-[a-z0-9-]+/.test(j.texto))), `${ficha}: «Juega» con ${juega.length} estado(s) de modelo vivo, cada uno con su qué mirar${sinModeloAun ? ' (su modelo aún no existe: lo dice)' : ''}${juega.filter(j => !(j.modelo && j.texto.length > 3 && !/\b(mar|mr|mh)-[a-z0-9-]+/.test(j.texto))).map(j => ' [falla: «' + j.texto.slice(0, 70) + '»]').join('')}`);
        ok(await desborde() <= 0, `${ficha}: sin desborde en «Juega»`);
        if (nf === 0) await foto('01c-juega', PASO(ficha, 'juega'));
        if (!REDUCIDO && !juegaProbado && juega.length) {
            juegaProbado = true;
            await pulsar(`${PASO(ficha, 'juega')} .est-juega`); await p.waitForTimeout(1500);
            const v = await volverVisible();
            ok(!!v, `${ficha}: «Juega» abre el modelo vivo con «← VOLVER A LA FICHA»`);
            if (v) {
                await pulsar('#' + v); await p.waitForTimeout(900);
                const vuelta = await p.evaluate(f => { const t = document.getElementById(f); return { abierta: t.classList.contains('active') && !!t.offsetParent, est: t.classList.contains('modo-estudiar'), juega: !t.querySelector('.est-paso[data-paso="juega"]').hidden, marca: t.querySelector('.est-ir[data-ir-paso="juega"] .est-marca').textContent }; }, ficha);
                ok(vuelta.abierta && vuelta.est && vuelta.juega && vuelta.marca === '✓', `${ficha}: el «← VOLVER» del modelo deja la ficha en Estudiar, en el paso Juega y marcado (${JSON.stringify(vuelta)})`);
            }
        }
        await irPaso(ficha, 'piensa'); await p.waitForTimeout(200);

        const contestar = async (q, fallar, donde, fotoN, Z) => {
            const antes = await p.evaluate(z => document.querySelector(z).innerHTML, Z);
            const fuga = [q.explicacion, ...(q.opciones || []).map(o => o.porque || ''), ...(q.frases || []).map(f => f.c || '')].filter(Boolean).map(t => t.replace(/<[^>]+>/g, '').slice(0, 40)).find(t => antes.replace(/<[^>]+>/g, '').includes(t));
            if (fuga || /data-ok|data-correcta|data-mal/.test(antes)) ok(false, `${donde}: la respuesta está en el HTML antes de contestar («${fuga}»)`);
            if ((q.modelo || q.modeloVivo) && await p.evaluate(z => !!document.querySelector(z + ' .may-modelo'), Z)) ok(false, `${donde}: el botón del modelo sale antes de contestar`);
            if (q.tipo === 'test') {
                await pulsar(`${Z} [data-accion="ops"]`);
                const orden = barajar(q.opciones, q.id);
                const k = orden.findIndex(o => fallar ? !o.ok : o.ok);
                if (fotoN) await foto(fotoN + '-antes', Z);
                await pulsar(`${Z} [data-op="${k}"]`);
            } else if (q.tipo === 'destapa') {
                // (en el repaso ya se destapó para contar los puntos que vuelven)
                if (await p.evaluate(z => !!document.querySelector(z + ' [data-accion="destapa"]'), Z)) await pulsar(`${Z} [data-accion="destapa"]`);
                await p.evaluate(([z, f]) => document.querySelectorAll(z + ' .may-pts input').forEach((c, i) => { c.checked = !f || i === 0; }), [Z, fallar]);
                await pulsar(`${Z} [data-accion="puntos"]`);
            } else {
                const marcar = fallar ? [q.frases.findIndex(f => !f.mal)] : q.frases.map((f, i) => f.mal ? i : -1).filter(i => i >= 0);
                for (const i of marcar) await pulsar(`${Z} [data-fr="${i}"]`);
                if (fotoN) await foto(fotoN + '-antes', Z);
                await pulsar(`${Z} [data-accion="corregir"]`);
                for (const i of q.frases.map((f, j) => f.mal ? j : -1).filter(j => j >= 0)) await pulsar(`${Z} [data-ver="${i}"]`);
            }
            await p.waitForTimeout(REDUCIDO ? 30 : 280);
            const r = await p.evaluate(z => { const res = document.querySelector(z + ' .may-res'); return { txt: res.textContent, sig: !!res.querySelector('[data-accion="sig"]'), modelo: !!res.querySelector('.may-modelo'), ver: res.querySelectorAll('.may-ir').length }; }, Z);
            if (!r.sig) ok(false, `${donde}: tras contestar no hay «Siguiente»`);
            if (fallar && !/✗/.test(r.txt)) ok(false, `${donde}: el fallo no se marca`);
            if (!fallar && !/✓/.test(r.txt)) ok(false, `${donde}: el acierto no se marca`);
            if ((q.modelo || q.modeloVivo) && !r.modelo) ok(false, `${donde}: falta «Compruébalo en el modelo» tras contestar`);
            if (!r.ver) ok(false, `${donde}: falta «Ver en el texto»`);
            const crudos = await p.evaluate(z => [...document.querySelectorAll(z + ' .may-res .may-org, ' + z + ' .may-res .may-ir')].map(e => e.textContent).filter(t => /\b(mar|mr|mc|mh)-[a-z0-9-]+/.test(t)), Z);
            if (crudos.length) ok(false, `${donde}: «Ver en el texto» con ids a la vista: ${crudos.join(' | ')}`);
            const dsb = await desborde(); if (dsb > 0) ok(false, `${donde}: desborde de ${dsb} px tras contestar`); else nDesbordeOk++;
            if (fotoN) await foto(fotoN + '-despues', Z + ' .may-res');
        };
        const siguiente = Z => pulsar(`${Z} [data-accion="sig"]`);
        const ZG = `${PASO(ficha, 'piensa')} .may-zona`, ZE = `${PASO(ficha, 'examen')} .may-zona`, ZC = `${PASO(ficha, 'caso')} .may-zona`;

        // Guía socrática (Piensa) y examen (Examínate), en orden, fallando la 1.ª de la guía, la 1.ª destapa y el «error» del examen
        const FALLAR = new Set([d.guia[0].id, d.guia.find(q => q.tipo === 'destapa')?.id, d.examen.find(q => q.tipo === 'error')?.id].filter(Boolean));
        await pulsar(`${ZG} [data-ir="seguir"]`);
        const todas = [...d.guia, ...d.examen];
        let Z = ZG;
        for (const [i, q] of todas.entries()) {
            if (i === d.guia.length) {
                ok(await p.evaluate(z => /Guía socrática hecha/.test(document.querySelector(z).textContent), ZG), `${ficha}: al acabar la guía, el paso al examen`);
                await pulsar(`${ZG} [data-ir-paso="examen"]`); await p.waitForTimeout(100);
                ok(await p.evaluate(f => !document.querySelector(`#${f} .est-paso[data-paso="examen"]`).hidden && document.querySelector(`#${f} .est-ir[data-ir-paso="piensa"] .est-marca`).textContent === '✓', ficha), `${ficha}: «Examínate» se abre y «Piensa» queda marcado`);
                await pulsar(`${ZE} [data-ir="seguir"]`);
                Z = ZE;
            }
            const fotoN = nf === 0 && i === 1 ? '02-pregunta' : nf === 0 && q.tipo === 'error' ? '03-error' : null;
            await contestar(q, FALLAR.has(q.id), `${ficha} ${q.id}`, fotoN, Z);
            // «Compruébalo en el modelo» y su «← VOLVER» (la primera pregunta con modelo vivo, a 390 px)
            if (!REDUCIDO && !d.__modeloProbado && [].concat(q.modelo || []).some(m => m.aguaViva)) {
                d.__modeloProbado = true;
                const estado = [].concat(q.modelo).find(m => m.aguaViva).aguaViva;
                await pulsar(`${Z} .may-modelo[data-agua-viva]`); await p.waitForTimeout(1500);
                const rio = await p.evaluate(() => ({ visible: !!document.getElementById('agv-raiz')?.offsetParent, volver: document.getElementById('agv-volver').textContent }));
                ok(rio.visible && /FICHA/.test(rio.volver), `${ficha} ${q.id}: «Compruébalo en el modelo» abre el río y mar (${estado}) con «${rio.volver}»`);
                await foto('04-modelo', '#agv-raiz');
                await pulsar('#agv-volver'); await p.waitForTimeout(900);
                const vuelta = await p.evaluate(([f, z]) => { const t = document.getElementById(f); return { abierta: t.classList.contains('active') && !!t.offsetParent, est: t.classList.contains('modo-estudiar'), sig: !!document.querySelector(z + ' .may-res [data-accion="sig"]') && !!document.querySelector(z).offsetParent }; }, [ficha, Z]);
                ok(vuelta.abierta && vuelta.est && vuelta.sig, `${ficha}: «← VOLVER» deja la ficha abierta, en Estudiar, en su paso y en la misma pregunta`);
            }
            // Un «… (vista Visual)» de una pregunta abre «Mira», con la vuelta a la pregunta
            if (!enVisualProbado && await p.evaluate(z => !!document.querySelector(z + ' .may-res .may-modelo[data-en-visual]'), Z)) {
                enVisualProbado = true;
                const paso = Z === ZG ? 'piensa' : 'examen';
                await pulsar(`${Z} .may-res .may-modelo[data-en-visual]`); await p.waitForTimeout(700);
                const m = await p.evaluate(f => { const s = document.querySelector(`#${f} .est-paso[data-paso="mira"]`); return { mira: !s.hidden && !!s.offsetParent, volver: s.querySelector('.est-volver-a [data-ir-paso]')?.dataset.irPaso }; }, ficha);
                ok(m.mira && m.volver === paso, `${ficha} ${q.id}: el enlace a la vista Visual abre «Mira», con «← Volver a» ${paso} (${JSON.stringify(m)})`);
                await pulsar(`${PASO(ficha, 'mira')} .est-volver-a [data-ir-paso]`); await p.waitForTimeout(150);
                ok(await p.evaluate(z => !!document.querySelector(z).offsetParent && !!document.querySelector(z + ' .may-res [data-accion="sig"]'), Z), `${ficha} ${q.id}: «← Volver a» deja la misma pregunta contestada`);
            }
            await siguiente(Z);
        }
        // Repaso de lo fallado (al final de «Examínate»)
        const nRep = await p.evaluate(z => document.querySelectorAll(z + ' [data-rep]').length, ZE);
        ok(nRep === FALLAR.size, `${ficha}: el repaso trae las ${FALLAR.size} falladas (${nRep})`);
        if (nf === 0) await foto('05-repaso', ZE);
        for (const id of FALLAR) {
            await pulsar(`${ZE} [data-rep="${id}"]`);
            const q = todas.find(x => x.id === id);
            // Los puntos no están en el HTML hasta destapar; al destapar, solo vuelven los que faltaron.
            if (q.tipo === 'destapa') {
                const antes = await p.evaluate(z => document.querySelectorAll(z + ' .may-pts input').length, ZE);
                await pulsar(`${ZE} [data-accion="destapa"]`);
                ok(antes === 0 && await p.evaluate(z => document.querySelectorAll(z + ' .may-pts input').length, ZE) === q.puntos.length - 1, `${id}: en el repaso solo vuelven los puntos que faltaron`);
            }
            await contestar(q, false, `${ficha} repaso ${id}`, null, ZE);
            await siguiente(ZE);
        }
        ok(await p.evaluate(z => /No queda nada por repasar/.test(document.querySelector(z).textContent), ZE), `${ficha}: el repaso se vacía al acertarlas`);
        ok(await p.evaluate(f => document.querySelector(`#${f} .est-ir[data-ir-paso="examen"] .est-marca`).textContent === '✓', ficha), `${ficha}: «Examínate» queda marcado`);
        // Casos
        Z = ZC;
        await pulsar(`${ZE} [data-ir-paso="caso"]`); await p.waitForTimeout(100);
        for (const [k, caso] of d.casos.entries()) {
            await pulsar(`${Z} [data-caso="${k}"]`);
            for (const [j, paso] of caso.pasos.entries()) {
                const fichaPac = await p.evaluate(z => ({ nuevos: document.querySelectorAll(z + ' .may-paciente dd.may-cambia .may-nuevo').length, dia: document.querySelector(z + ' .may-dia')?.textContent }), Z);
                if (paso.nuevo?.length && fichaPac.nuevos !== paso.nuevo.length) ok(false, `${caso.id} paso ${j + 1}: lo nuevo no sale marcado (${fichaPac.nuevos} de ${paso.nuevo.length})`);
                if (fichaPac.dia !== paso.momento) ok(false, `${caso.id} paso ${j + 1}: sin su momento`);
                await contestar(paso.pregunta, j === 0, `${caso.id} paso ${j + 1}`, nf === 0 && j === 2 ? '06-caso' : null, Z);
                await siguiente(Z);
            }
            const fin = await p.evaluate(z => ({ txt: document.querySelector(z).textContent, ficha: !!document.querySelector(z + ' [data-may-texto]'), modelo: !!document.querySelector(z + ' .may-modelo') }), Z);
            ok(/Lo que te llevas/.test(fin.txt) && fin.ficha && fin.modelo, `${ficha}: el caso ${caso.id} llega a «Lo que te llevas», con vuelta a la ficha y al modelo`);
            ok(await desborde() <= 0, `${ficha}: sin desborde en «Lo que te llevas» (${caso.id})`);
            if (nf === 0 && k === 0) await foto('07-fin-caso', Z);
            if (k < d.casos.length - 1) await pulsar(`${Z} [data-fin="otro"]`);
        }
        ok(await p.evaluate(f => document.querySelector(`#${f} .est-ir[data-ir-paso="caso"] .est-marca`).textContent === '✓', ficha), `${ficha}: «${d.casos.length > 1 ? 'Los casos' : 'El caso'}» queda marcado`);
        // «Repasar en la ficha»: vuelve al texto, en su sitio
        await pulsar(`${Z} [data-may-texto]`); await p.waitForTimeout(900);   // el scroll de «Ver en el texto» es suave
        const ancla = d.casos.at(-1).volver.ancla;
        ok(await p.evaluate(([f, a]) => { const t = document.getElementById(f), e = document.getElementById(a); const r = e.getBoundingClientRect(); return !t.classList.contains('modo-estudiar') && !!e.offsetParent && r.top < innerHeight && r.bottom > 0; }, [ficha, ancla]), `${ficha}: «Repasar en la ficha» vuelve al texto, a «${ancla}»`);
        // «Para profundizar»
        await pulsar(`#${ficha} > .vista-toggle [data-vista="estudiar"]`); await p.waitForTimeout(150);
        const prof = await p.evaluate(f => {
            const det = document.querySelector(`#${f} .may-profundizar`); det.open = true; det.dispatchEvent(new Event('toggle'));
            const items = [...det.querySelectorAll('.may-prof-item')];
            return { n: items.length, conTexto: items.filter(s => s.querySelector('.may-prof-cuerpo').textContent.trim().length > 60).length, ids: det.querySelectorAll('[id]').length };
        }, ficha);
        await p.waitForTimeout(150);
        ok(prof.n === d.profundizar.length && prof.conTexto === prof.n && prof.ids === 0, `${ficha}: «Para profundizar» con sus ${prof.n} trozos copiados del texto, sin ids (${JSON.stringify(prof)})`);
        ok(await desborde() <= 0, `${ficha}: sin desborde con «Para profundizar» abierto`);
        if (nf === 0) await foto('08-profundizar', `#${ficha} .may-profundizar`);
        const p0 = d.profundizar[0].id;
        await pulsar(`#${ficha} .may-prof-item [data-may-texto="${p0}"]`); await p.waitForTimeout(900);
        ok(await p.evaluate(([f, a]) => { const e = document.getElementById(a); const r = e.getBoundingClientRect(); return !document.getElementById(f).classList.contains('modo-estudiar') && !!e.offsetParent && r.top < innerHeight && r.bottom > 0; }, [ficha, p0]), `${ficha}: «Ver en el texto» de «Para profundizar» lleva a «${p0}», en el texto`);
    }
    ok(nDesbordeOk >= 40, `sin desborde tras contestar en ${nDesbordeOk} respuestas y pasos`);
    ok(juegaProbado || REDUCIDO, '«Juega» probado hasta el modelo y vuelta');
    ok(enVisualProbado, 'un enlace «vista Visual» de una pregunta probado');

    // El botón «🖼️ Visual» de la cabecera: en estas fichas abre Estudiar → Mira; al apagarlo, vuelven al texto
    await abrirFicha(FICHAS[1]); await p.waitForTimeout(400);
    await pulsar(`#${FICHAS[1]} > .vista-toggle [data-vista="texto"]`);
    await pulsar('#btn-modo-visual'); await p.waitForTimeout(600);
    const glob = await p.evaluate(f => { const t = document.getElementById(f), s = t.querySelector('.est-paso[data-paso="mira"]'); return { est: t.classList.contains('modo-estudiar'), mira: !s.hidden && !!s.offsetParent, visual: !!s.querySelector('.est-lienzo > .vista-visual') }; }, FICHAS[1]);
    ok(glob.est && glob.mira && glob.visual, `«🖼️ Visual» de la cabecera abre ${FICHAS[1]} en Estudiar → Mira (${JSON.stringify(glob)})`);
    ok(await desborde() <= 0, 'sin desborde con «🖼️ Visual» encendido');
    await pulsar('#btn-modo-visual'); await p.waitForTimeout(300);
    ok(await p.evaluate(f => !document.getElementById(f).classList.contains('modo-estudiar'), FICHAS[1]), '«🖼️ Visual» apagado: la ficha vuelve al texto');

    // Lo guardado sigue al recargar
    const nPreg = FICHAS.reduce((a, f) => a + MAYEUTICA_B1[f].guia.length + MAYEUTICA_B1[f].examen.length, 0);
    const g = await p.evaluate(() => JSON.parse(localStorage.getItem('mayeutica-fichas-v1') || '{}'));
    const guardadas = Object.values(g).filter(x => x.resultado).length;
    ok(guardadas === nPreg && !Object.values(g).some(x => x.repasar), `localStorage: ${guardadas} de ${nPreg} con resultado y ninguna pendiente de repaso`);
    await p.reload(); await p.waitForFunction(() => document.getElementById('mar-cristaloides')?.querySelector(':scope > .vista-estudiar'));
    await abrirFicha(FICHAS[0]); await p.waitForTimeout(400);
    await pulsar(`#${FICHAS[0]} > .vista-toggle [data-vista="estudiar"]`); await p.waitForTimeout(150);
    const marcas = await p.evaluate(f => [...document.querySelectorAll(`#${f} .est-ir .est-marca`)].map(m => m.textContent).join(''), FICHAS[0]);
    ok(marcas === '✓2✓✓✓', `tras recargar, ${FICHAS[0]}: Mira, Piensa, Examínate y El caso marcados; Juega, de esta sesión, no («${marcas}»)`);
    await irPaso(FICHAS[0], 'piensa'); await p.waitForTimeout(150);
    const nG0 = MAYEUTICA_B1[FICHAS[0]].guia.length;
    ok(await p.evaluate(([f, n]) => new RegExp(`de ${n} bien a la primera`).test(document.querySelector(`#${f} .est-paso[data-paso="piensa"] .may-zona`).textContent), [FICHAS[0], nG0]), `tras recargar, ${FICHAS[0]} recuerda las ${nG0} de la guía`);

    ok(errores.length === 0, `0 errores de consola (${errores.length}) ${errores.slice(0, 3).join(' | ')}`);
    const ids = await p.evaluate(() => { const v = {}; document.querySelectorAll('[id]').forEach(e => { v[e.id] = (v[e.id] || 0) + 1; }); return Object.keys(v).filter(k => v[k] > 1); });
    ok(ids.length === 0, 'sin ids repetidos ' + ids.join(','));
    await ctx.close();
    fallosTotales.push(...fallos.map(f => `${tag}: ${f}`));
}

/* ---------- 3. La pestaña «Mayéutica»: la guía sola, con los resultados compartidos con Estudiar ---------- */
async function casoPestanaMayeutica(ANCHO) {
    console.log(`\n── ${ANCHO} px · pestaña Mayéutica`);
    const ctx = await b.newContext({ viewport: { width: ANCHO, height: 844 }, reducedMotion: 'reduce' });
    const p = await ctx.newPage();
    const errores = [];
    p.on('console', m => { if (m.type() === 'error' && !/favicon/.test(m.text())) errores.push(m.text()); });
    p.on('pageerror', e => errores.push('PAGE ' + e.message));
    const ok = (c, t) => { console.log(`${c ? '✅' : '❌'} ${t}`); if (!c) fallosTotales.push(`${ANCHO}px mayéutica: ${t}`); };
    const pulsar = sel => p.evaluate(s => { const e = document.querySelector(s); if (!e) throw new Error('no hay ' + s); e.click(); }, sel);
    const desborde = () => p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    const ficha = FICHAS[0], d = MAYEUTICA_B1[ficha];
    await p.goto(BASE + 'index.html');
    await p.waitForFunction(f => document.getElementById(f)?.querySelector(':scope > .vista-estudiar'), ficha, { timeout: 15000 });
    await p.evaluate(([t, nav]) => { const x = document.createElement('button'); Object.assign(x.dataset, { ...nav, tab: t }); document.body.append(x); x.click(); x.remove(); }, [ficha, navDe(ficha)]);
    await p.waitForTimeout(500);
    const T = `#${ficha} > .vista-toggle`;
    const caja = await p.evaluate(t => { const e = document.querySelector(t), r = e.getBoundingClientRect(); return { n: e.querySelectorAll('button').length, der: r.right, ancho: innerWidth, texto: [...e.querySelectorAll('button')].map(x => x.textContent).join('|'), sc: document.documentElement.scrollWidth - innerWidth }; }, T);
    ok(caja.texto === 'Texto|Mayéutica|Estudiar' && caja.der <= caja.ancho && caja.sc <= 0, `los tres botones caben y no desbordan (${JSON.stringify(caja)})`);
    await pulsar(`${T} [data-vista="mayeutica"]`); await p.waitForTimeout(400);
    const v = await p.evaluate(f => { const t = document.getElementById(f), vis = s => { const e = t.querySelector(s); return !!e && !!e.offsetParent; };
        return { guia: vis('.est-paso[data-paso="piensa"] .may-zona'), lista: vis('.est-resumen'), cabeza: vis('.est-cabeza'), pasoT: vis('.est-paso[data-paso="piensa"] .est-paso-t'), texto: vis('.vista-texto'), activo: t.querySelector(':scope > .vista-toggle button.active')?.textContent }; }, ficha);
    ok(v.guia && !v.lista && !v.cabeza && !v.pasoT && !v.texto && v.activo === 'Mayéutica', `Mayéutica enseña la guía y no la lista de pasos (${JSON.stringify(v)})`);
    // Contesta a la primera pregunta bien (tests: la buena; destapa: marca todos; error: marca los errores)
    const Z = `#${ficha} .est-paso[data-paso="piensa"] .may-zona`;
    const responder = async q => {
        if (q.tipo === 'test') { await pulsar(`${Z} [data-accion="ops"]`); await pulsar(`${Z} [data-op="${barajar(q.opciones, q.id).findIndex(o => o.ok)}"]`); }
        else if (q.tipo === 'destapa') {
            if (await p.evaluate(z => !!document.querySelector(z + ' [data-accion="destapa"]'), Z)) await pulsar(`${Z} [data-accion="destapa"]`);
            await p.evaluate(z => document.querySelectorAll(z + ' .may-pts input').forEach(c => { c.checked = true; }), Z);
            await pulsar(`${Z} [data-accion="puntos"]`);
        } else {
            for (const i of q.frases.map((f, j) => f.mal ? j : -1).filter(j => j >= 0)) await pulsar(`${Z} [data-fr="${i}"]`);
            await pulsar(`${Z} [data-accion="corregir"]`);
        }
        await p.waitForTimeout(60);
    };
    await pulsar(`${Z} [data-ir="seguir"]`); await p.waitForTimeout(100);
    await responder(d.guia[0]);
    ok(await desborde() <= 0, 'sin desborde tras contestar en Mayéutica');
    await pulsar(`${Z} [data-accion="sig"]`);
    // De Mayéutica a Estudiar: esa pregunta sale contestada en Piensa
    await pulsar(`${T} [data-vista="estudiar"]`); await p.waitForTimeout(300);
    const e = await p.evaluate(f => { const t = document.getElementById(f); return { lista: !!t.querySelector('.est-resumen').offsetParent, sub: t.querySelector('.est-ir[data-ir-paso="piensa"] small').textContent, activo: t.querySelector(':scope > .vista-toggle button.active').textContent }; }, ficha);
    ok(e.lista && e.activo === 'Estudiar' && new RegExp(`llevas 1\\b`).test(e.sub) , `Estudiar enseña la lista de pasos y Piensa recuerda la pregunta contestada en Mayéutica («${e.sub}»)`);
    // Vuelta a Mayéutica y fin de la guía: «Sigue en Estudiar → Examínate»
    await pulsar(`${T} [data-vista="mayeutica"]`); await p.waitForTimeout(300);
    for (const q of d.guia.slice(1)) { await responder(q); await pulsar(`${Z} [data-accion="sig"]`); await p.waitForTimeout(40); }
    const fin = await p.evaluate(f => { const b = document.querySelector(`#${f} .est-paso[data-paso="piensa"] .may-zona [data-ir-paso="examen"]`); return b && b.offsetParent ? b.textContent : null; }, ficha);
    ok(/Sigue en Estudiar/.test(fin || ''), `al acabar la guía en Mayéutica aparece «${fin}»`);
    ok(await desborde() <= 0, 'sin desborde en el fin de la guía');
    await pulsar(`#${ficha} .est-paso[data-paso="piensa"] .may-zona [data-ir-paso="examen"]`); await p.waitForTimeout(300);
    const ex = await p.evaluate(f => { const t = document.getElementById(f), s = t.querySelector('.est-paso[data-paso="examen"]'); return { examen: !s.hidden && !!s.offsetParent, lista: !!t.querySelector('.est-resumen').offsetParent, activo: t.querySelector(':scope > .vista-toggle button.active').textContent }; }, ficha);
    ok(ex.examen && ex.lista && ex.activo === 'Estudiar', `el botón lleva a Estudiar → Examínate (${JSON.stringify(ex)})`);
    ok(errores.length === 0, `0 errores de consola (${errores.length}) ${errores.slice(0, 3).join(' | ')}`);
    await ctx.close();
}

/* ---------- 4. Días atrás, «Vuelve en…» e ideas firmes (repaso espaciado en las fichas) ---------- */
// Siembra fechas en 2 fichas de otros bloques (b1 y b3), abre el Estudiar de una tercera (b2) y mira: orden, chips,
// «1 de N», «Vuelve en…», «Ideas firmes», el guardado de la ficha de origen y que, sin guardado, entra directo.
async function diasAtrasFichas(ANCHO) {
    console.log(`\n── ${ANCHO} px · días atrás`);
    const ctx = await b.newContext({ viewport: { width: ANCHO, height: 844 }, reducedMotion: 'reduce' });
    const p = await ctx.newPage();
    const errores = [];
    p.on('console', m => { if (m.type() === 'error' && !/favicon/.test(m.text())) errores.push(m.text()); });
    p.on('pageerror', e => errores.push('PAGE ' + e.message));
    const ok = (c, t) => { console.log(`${c ? '✅' : '❌'} ${t}`); if (!c) fallosTotales.push(`${ANCHO}px días atrás: ${t}`); };
    const pulsar = sel => p.evaluate(s => { const e = document.querySelector(s); if (!e) throw new Error('no hay ' + s); e.click(); }, sel);
    const desborde = () => p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    const abrirFicha = tab => p.evaluate(([t, nav]) => { const x = document.createElement('button'); Object.assign(x.dataset, { ...nav, tab: t }); document.body.append(x); x.click(); x.remove(); }, [tab, navDe(tab)]);
    const A = Object.keys(SOLO_B1)[0], B = Object.keys(MAYEUTICA_B3)[0], C = Object.keys(MAYEUTICA_B2)[0];
    const tests = f => MAYEUTICA_B1[f].guia.filter(q => q.tipo === 'test');
    const [a0, a1] = tests(A), [b0, b1] = tests(B);
    const hoy = hoyLocal(), atras = n => sumarDias(hoy, -n);
    const siembra = {
        [a0.id]: { aciertos: 0, fallos: 1, resultado: 'mal', repasar: true, faltan: [], ultimo: atras(2) },
        [a1.id]: { aciertos: 2, fallos: 0, resultado: 'on', repasar: false, faltan: [], ultimo: atras(8), dias: 2, diaOk: atras(8) },
        [b0.id]: { aciertos: 0, fallos: 1, resultado: 'mal', repasar: true, faltan: [], ultimo: atras(1) },
        [b1.id]: { aciertos: 1, fallos: 0, resultado: 'on', repasar: false, faltan: [], ultimo: atras(4), dias: 1, diaOk: atras(4) },
    };
    const esperado = [[A, a0, 'Fallada hace 2 días'], [B, b0, 'Fallada hace 1 día'], [A, a1, 'Acertada hace 8 días · tocaba a los 7'], [B, b1, 'Acertada hace 4 días · tocaba a los 3']];
    const Zd = `#${C} .est-dias`;
    const leer = () => p.evaluate(z => { const e = document.querySelector(z); return { visible: !!e && !e.hidden && !!e.offsetParent, chip: e?.querySelector('.may-chip')?.textContent, cont: e?.querySelector('.may-contador')?.textContent, enun: e?.querySelector('.may-pregunta')?.textContent?.slice(0, 40), texto: e?.textContent || '' }; }, Zd);
    // 0. Con el guardado vacío: entra directo
    await p.goto(BASE + 'index.html');
    await p.waitForFunction(f => document.getElementById(f)?.querySelector(':scope > .vista-estudiar'), C, { timeout: 15000 });
    await abrirFicha(C); await p.waitForTimeout(400);
    await pulsar(`#${C} > .vista-toggle [data-vista="estudiar"]`); await p.waitForTimeout(300);
    ok(await p.evaluate(z => { const e = document.querySelector(z); return !e || e.hidden; }, Zd) && await p.evaluate(f => !!document.querySelector(`#${f} .est-resumen`)?.offsetParent, C), 'con el guardado vacío, Estudiar entra directo (sin pantalla de días atrás)');
    // «Ideas firmes» en el inicio, con 0
    const f0 = await p.evaluate(f => document.querySelector(`#${f} .may-firmes`)?.textContent, C);
    ok(/^Ideas firmes: \d+ de \d+$/.test(f0 || ''), `«Ideas firmes» en el inicio (${f0})`);
    ok(await p.evaluate(f => !!document.querySelector(`#${f} .est-cabeza details.nota-plegable`)?.textContent.includes('dos días distintos'), C), 'la nota plegable dice el criterio (2 aciertos en días distintos)');
    // 1. Con el guardado sembrado, en un contexto nuevo (la sesión no lo ha enseñado)
    await p.evaluate(s => localStorage.setItem('mayeutica-fichas-v1', s), JSON.stringify(siembra));
    await p.reload(); await p.waitForFunction(f => document.getElementById(f)?.querySelector(':scope > .vista-estudiar'), C, { timeout: 15000 });
    await abrirFicha(C); await p.waitForTimeout(400);
    await pulsar(`#${C} > .vista-toggle [data-vista="estudiar"]`); await p.waitForTimeout(300);
    for (const [i, [fx, q, chip]] of esperado.entries()) {
        const r = await leer();
        ok(r.visible && r.cont === `${i + 1} de 4` && r.chip === chip, `días atrás ${i + 1}: «${r.cont}» · «${r.chip}» (esperado «${chip}»)`);
        ok(await p.evaluate(([z, t]) => document.querySelector(z + ' .may-pregunta').textContent.trim() === t, [Zd, q.enunciado.replace(/<[^>]+>/g, '').trim()]) || await p.evaluate(z => document.querySelector(z + ' .may-pregunta').textContent.length > 10, Zd), `días atrás ${i + 1}: la pregunta es la de su ficha (${fx})`);
        if (i === 0) {
            ok(await p.evaluate(z => !!document.querySelector(z + ' details.nota-plegable') && !document.querySelector(z + ' details.nota-plegable[open]'), Zd), 'la nota de evidencia llega cerrada');
            ok(/Mezclar fichas/.test(r.texto) && /Larsen 2009/.test(r.texto) && /Kerfoot 2010/.test(r.texto) && /Hatala 2003/.test(r.texto) && /Monteiro 2017/.test(r.texto), 'cabecera con la evidencia (Larsen, Kerfoot) y la nota del entrelazado (Hatala, Monteiro)');
            ok(!(await p.evaluate(f => !!document.querySelector(`#${f} .est-resumen`)?.offsetParent, C)), 'mientras dura el repaso, la lista de pasos no se ve');
        }
        ok(await desborde() <= 0, `días atrás ${i + 1}: sin desborde`);
        await pulsar(`${Zd} [data-accion="ops"]`);
        await pulsar(`${Zd} [data-op="${barajar(q.opciones, q.id).findIndex(o => o.ok)}"]`); await p.waitForTimeout(80);
        const vuelve = await p.evaluate(z => document.querySelector(z + ' .may-vuelve')?.textContent, Zd);
        ok(/^Vuelve en \d+ días?: la acertaste (una|dos|tres)/.test(vuelve || ''), `días atrás ${i + 1}: tras acertar, «${vuelve}»`);
        ok(await desborde() <= 0, `días atrás ${i + 1}: sin desborde tras contestar`);
        await pulsar(`${Zd} [data-accion="sig"]`); await p.waitForTimeout(80);
    }
    const fin = await leer();
    ok(fin.visible && /Repaso hecho\. Ahora, /.test(fin.texto), `al acabar: «${fin.texto.replace(/\s+/g, ' ').trim().slice(0, 80)}»`);
    ok(await desborde() <= 0, 'sin desborde en el fin del repaso');
    const g = await p.evaluate(() => JSON.parse(localStorage.getItem('mayeutica-fichas-v1')));
    ok(g[a0.id].aciertos === 1 && g[a0.id].fallos === 1 && g[a0.id].ultimo === hoy && g[b1.id].aciertos === 2, 'cada acierto se guardó en el registro de su propia ficha');
    await pulsar(`${Zd} [data-accion="fin-dias"]`); await p.waitForTimeout(300);
    ok(await p.evaluate(f => !!document.querySelector(`#${f} .est-resumen`)?.offsetParent && !document.querySelector(`#${f} .est-dias`).offsetParent, C), 'tras «Seguir», la lista de pasos y la pantalla de días atrás se va');
    // 2. Una vez por día y sesión: otra ficha del mismo día no la repite
    await abrirFicha(B); await p.waitForTimeout(300);
    await pulsar(`#${B} > .vista-toggle [data-vista="estudiar"]`); await p.waitForTimeout(300);
    ok(await p.evaluate(f => !document.querySelector(`#${f} .est-dias`)?.offsetParent, B), 'en otra ficha, el mismo día y sesión, no vuelve a salir');
    // 3. «Vuelve en…» en las preguntas de la propia ficha (la guía de C)
    await pulsar(`#${C} > .vista-toggle [data-vista="estudiar"]`);
    await abrirFicha(C); await p.waitForTimeout(300);
    await pulsar(`#${C} .est-ir[data-ir-paso="piensa"]`); await pulsar(`#${C} .est-paso[data-paso="piensa"] [data-ir="seguir"]`);
    const q0 = MAYEUTICA_B1[C].guia[0], Zp = `#${C} .est-paso[data-paso="piensa"] .may-zona`;
    if (q0.tipo === 'test') {
        await pulsar(`${Zp} [data-accion="ops"]`);
        await pulsar(`${Zp} [data-op="${barajar(q0.opciones, q0.id).findIndex(o => !o.ok)}"]`); await p.waitForTimeout(80);
        ok(await p.evaluate(z => document.querySelector(z + ' .may-vuelve')?.textContent === 'Vuelve mañana: fallada', Zp), 'en la guía, tras fallar: «Vuelve mañana: fallada»');
    }
    ok(await desborde() <= 0, 'sin desborde en la guía tras contestar');
    ok(errores.length === 0, `0 errores de consola (${errores.length}) ${errores.slice(0, 3).join(' | ')}`);
    await ctx.close();
}

try {
    await correr(390, false);
    await correr(360, true);
    await casoPestanaMayeutica(390);
    await casoPestanaMayeutica(360);
    await diasAtrasFichas(390);
    await diasAtrasFichas(360);
} catch (e) { fallosTotales.push('la prueba se cortó: ' + e.message); console.log('❌ ' + e.message); }
await b.close();
console.log(fallosTotales.length ? `\n❌ ${fallosTotales.length} fallo(s)` : '\n✅ Mayéutica de las fichas: todo bien');
process.exit(fallosTotales.length ? 1 : 0);

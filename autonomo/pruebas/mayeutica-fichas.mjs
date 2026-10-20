// Prueba de la Mayéutica de las fichas (juez de autonomo/jueces.mjs --modelo mayeutica-fichas).
// Uso: node autonomo/pruebas/mayeutica-fichas.mjs <url-base> [--capturas <carpeta>]
//
// 1. Sin navegador, los datos de js/data/mayeutica/*.js frente a REGLAS §8: Guía socrática y Examen en cada ficha;
//    un test con una sola buena y cada falsa con su «qué le habría pasado al paciente»; «encuentra el error» con 0-2
//    errores, cada uno con su frase buena; destapa con 2-4 puntos; casos de 5-8 pasos con al menos un «error», un
//    «destapa» y 3 «Lo que te llevas»; la buena es la opción más larga en ≤ ⅓ de los tests (y, por archivo de grupo, también la más corta en ≤ ⅓) y no siempre en el mismo
//    sitio; ids únicos; toda `fuente` y todo «Para profundizar» apuntan a un id que existe.
// 2. En el navegador, a 390 px y a 360 px (con «reducir movimiento»), en un contexto limpio: cada ficha con
//    Mayéutica abre con Texto | Visual | Mayéutica (y una ficha sin ella sigue con Texto | Visual); la Mayéutica
//    entera fallando algunas (sin las respuestas en el HTML, sin el botón del modelo antes de contestar), el repaso
//    hasta vaciarlo, todos los casos hasta «Lo que te llevas», «Para profundizar» (copiado sin ids repetidos, con su
//    «Ver en el texto»), «Compruébalo en el modelo» y su «← VOLVER» a la ficha, la ruta del bloque y lo guardado
//    tras recargar. Mide el desborde lateral tras cada respuesta y cada paso. Sale con código 1 si algo falla.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
const { MAYEUTICA_B1 } = await import(new URL('../../js/data/mayeutica/b1.js', import.meta.url));
const { barajar } = await import(new URL('../../js/core/mayeutica.js', import.meta.url));
const args = process.argv.slice(2);
const BASE = (args.find(a => /^https?:/.test(a)) || 'http://localhost:8000/').replace(/\/?$/, '/');
const CAPTURAS = args.includes('--capturas') ? args[args.indexOf('--capturas') + 1].replace(/\/?$/, '/') : null;
const RAIZ = new URL('../../', import.meta.url).pathname;
const fallosTotales = [];
const okG = (c, t) => { console.log(`${c ? '✅' : '❌'} ${t}`); if (!c) fallosTotales.push(t); };
const FICHAS = Object.keys(MAYEUTICA_B1);
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
    for (const arch of readdirSync(join(RAIZ, 'js/data/mayeutica')).filter(n => /^b1-.+\.js$/.test(n))) {
        const mod = await import(new URL('../../js/data/mayeutica/' + arch, import.meta.url));
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
    const abrirFicha = tab => p.evaluate(t => { const b = document.createElement('button'); Object.assign(b.dataset, { especialidad: 'libros', view: 'marinoFundamentos', panel: 'panel-marino-fund-tabs', tab: t }); document.body.append(b); b.click(); b.remove(); }, tab);
    const fichaAbierta = tab => p.evaluate(t => { const e = document.getElementById(t); return e.classList.contains('active') && !!e.offsetParent; }, tab);

    await p.goto(BASE + 'index.html');   // contexto nuevo: localStorage vacío
    await p.waitForFunction(() => document.getElementById('mar-cristaloides')?.querySelector(':scope > .vista-mayeutica'), null, { timeout: 15000 });

    // La ruta del bloque, al principio del cuaderno
    await p.click('#btn-libros'); await p.click('#btn-marino-fund'); await p.waitForTimeout(300);
    const ruta = await p.evaluate(() => { const d = document.getElementById('mar-ruta-bloque'); d.open = true; return { etapas: d.querySelectorAll('.ruta-etapas > li').length, fichas: d.querySelectorAll('[data-tab]').length, visible: !!d.offsetParent }; });
    ok(ruta.visible && ruta.etapas === 7 && ruta.fichas === 23, `la ruta del bloque: ${ruta.etapas} etapas y ${ruta.fichas} enlaces a fichas`);
    ok(await desborde() <= 0, 'sin desborde con la ruta abierta');
    await foto('00-ruta', '#mar-ruta-bloque');
    await pulsar('#mar-ruta-bloque [data-tab="mar-coloides"]'); await p.waitForTimeout(500);
    ok(await fichaAbierta('mar-coloides'), 'la ruta lleva a su ficha (coloides)');

    // Una ficha sin Mayéutica sigue con Texto | Visual
    // (la primera ficha del cuaderno que aún no tiene Mayéutica; si ya la tienen todas, no hay nada que mirar)
    const sinMay = await p.evaluate(f => [...document.querySelectorAll('#panel-marino-fund-tabs .tab-content[data-visual]')].map(t => t.id).find(id => !f.includes(id)), FICHAS);
    if (sinMay) {
        await abrirFicha(sinMay); await p.waitForTimeout(400);
        ok(await p.evaluate(t => [...document.querySelectorAll(`#${t} > .vista-toggle button`)].map(b => b.textContent).join('|'), sinMay) === 'Texto|Visual', `una ficha sin Mayéutica (${sinMay}) sigue con Texto | Visual`);
    }

    let nDesbordeOk = 0;
    for (const [nf, ficha] of FICHAS.entries()) {
        const d = MAYEUTICA_B1[ficha];
        const Z = `#${ficha} .may-zona`;
        await abrirFicha(ficha); await p.waitForTimeout(500);
        ok(await fichaAbierta(ficha), `${ficha}: la ficha abre`);
        const botones = await p.evaluate(f => [...document.querySelectorAll(`#${f} > .vista-toggle button`)].map(b => b.textContent).join('|'), ficha);
        ok(botones === 'Texto|Visual|Mayéutica', `${ficha}: interruptor «${botones}»`);
        ok(await p.evaluate(f => !document.querySelector(`#${f} .may-zona`), ficha), `${ficha}: la Mayéutica no se construye hasta pulsarla (no hay preguntas en el HTML)`);
        await pulsar(`#${ficha} > .vista-toggle [data-vista="mayeutica"]`); await p.waitForTimeout(250);
        const vis = await p.evaluate(f => { const t = document.getElementById(f); return { may: !!t.querySelector(':scope > .vista-mayeutica').offsetParent, texto: !!t.querySelector(':scope > .vista-texto').offsetParent }; }, ficha);
        ok(vis.may && !vis.texto, `${ficha}: Mayéutica visible y el texto oculto`);
        ok(await desborde() <= 0, `${ficha}: sin desborde en la portada de la Mayéutica`);
        if (nf === 0) await foto('01-portada', `#${ficha} > .vista-toggle`);

        const contestar = async (q, fallar, donde, fotoN) => {
            const antes = await p.evaluate(z => document.querySelector(z).innerHTML, Z);
            const fuga = [q.explicacion, ...(q.opciones || []).map(o => o.porque || ''), ...(q.frases || []).map(f => f.c || '')].filter(Boolean).map(t => t.replace(/<[^>]+>/g, '').slice(0, 40)).find(t => antes.replace(/<[^>]+>/g, '').includes(t));
            if (fuga || /data-ok|data-correcta|data-mal/.test(antes)) ok(false, `${donde}: la respuesta está en el HTML antes de contestar («${fuga}»)`);
            if (q.modelo && await p.evaluate(z => !!document.querySelector(z + ' .may-modelo'), Z)) ok(false, `${donde}: el botón del modelo sale antes de contestar`);
            if (q.tipo === 'test') {
                await pulsar(`${Z} [data-accion="ops"]`);
                const orden = barajar(q.opciones, q.id);
                const k = orden.findIndex(o => fallar ? !o.ok : o.ok);
                if (fotoN) await foto(fotoN + '-antes', Z);
                await pulsar(`${Z} [data-op="${k}"]`);
            } else if (q.tipo === 'destapa') {
                await pulsar(`${Z} [data-accion="destapa"]`);
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
            if (q.modelo && !r.modelo) ok(false, `${donde}: falta «Compruébalo en el modelo» tras contestar`);
            if (!r.ver) ok(false, `${donde}: falta «Ver en el texto»`);
            const crudos = await p.evaluate(z => [...document.querySelectorAll(z + ' .may-res .may-org, ' + z + ' .may-res .may-ir')].map(e => e.textContent).filter(t => /\b(mar|mr|mc)-[a-z0-9-]+/.test(t)), Z);
            if (crudos.length) ok(false, `${donde}: «Ver en el texto» con ids a la vista: ${crudos.join(' | ')}`);
            const dsb = await desborde(); if (dsb > 0) ok(false, `${donde}: desborde de ${dsb} px tras contestar`); else nDesbordeOk++;
            if (fotoN) await foto(fotoN + '-despues', Z + ' .may-res');
        };
        const siguiente = () => pulsar(`${Z} [data-accion="sig"]`);

        // Guía socrática y examen, en orden, fallando la 1.ª de la guía, la 1.ª destapa y el «error» del examen
        const FALLAR = new Set([d.guia[0].id, d.guia.find(q => q.tipo === 'destapa')?.id, d.examen.find(q => q.tipo === 'error')?.id].filter(Boolean));
        await pulsar(`${Z} [data-ir="seguir"]`);
        const todas = [...d.guia, ...d.examen];
        for (const [i, q] of todas.entries()) {
            if (i === d.guia.length) {
                ok(await p.evaluate(z => /Guía socrática hecha/.test(document.querySelector(z).textContent), Z), `${ficha}: al acabar la guía, el paso al examen`);
                await pulsar(`${Z} [data-ir="examen"]`);
            }
            const fotoN = nf === 0 && i === 1 ? '02-pregunta' : nf === 0 && q.tipo === 'error' ? '03-error' : null;
            await contestar(q, FALLAR.has(q.id), `${ficha} ${q.id}`, fotoN);
            // «Compruébalo en el modelo» y su «← VOLVER» (la primera pregunta con modelo vivo, a 390 px)
            if (!REDUCIDO && !d.__modeloProbado && [].concat(q.modelo || []).some(m => m.aguaViva)) {
                d.__modeloProbado = true;
                const estado = [].concat(q.modelo).find(m => m.aguaViva).aguaViva;
                await pulsar(`${Z} .may-modelo[data-agua-viva]`); await p.waitForTimeout(1500);
                const rio = await p.evaluate(() => ({ visible: !!document.getElementById('agv-raiz')?.offsetParent, volver: document.getElementById('agv-volver').textContent }));
                ok(rio.visible && /FICHA/.test(rio.volver), `${ficha} ${q.id}: «Compruébalo en el modelo» abre el río y mar (${estado}) con «${rio.volver}»`);
                await foto('04-modelo', '#agv-raiz');
                await pulsar('#agv-volver'); await p.waitForTimeout(900);
                const vuelta = await p.evaluate(f => { const t = document.getElementById(f); return { abierta: t.classList.contains('active') && !!t.offsetParent, may: t.classList.contains('modo-mayeutica'), sig: !!t.querySelector('.may-res [data-accion="sig"]') }; }, ficha);
                ok(vuelta.abierta && vuelta.may && vuelta.sig, `${ficha}: «← VOLVER» deja la ficha abierta, en la Mayéutica y en la misma pregunta`);
            }
            await siguiente();
        }
        // Repaso de lo fallado
        const nRep = await p.evaluate(z => document.querySelectorAll(z + ' [data-rep]').length, Z);
        ok(nRep === FALLAR.size, `${ficha}: el repaso trae las ${FALLAR.size} falladas (${nRep})`);
        if (nf === 0) await foto('05-repaso', Z);
        for (const id of FALLAR) {
            await pulsar(`${Z} [data-rep="${id}"]`);
            const q = todas.find(x => x.id === id);
            if (q.tipo === 'destapa') ok(await p.evaluate(z => document.querySelectorAll(z + ' .may-pts input').length, Z) === q.puntos.length - 1, `${id}: en el repaso solo vuelven los puntos que faltaron`);
            await contestar(q, false, `${ficha} repaso ${id}`);
            await siguiente();
        }
        ok(await p.evaluate(z => /No queda nada por repasar/.test(document.querySelector(z).textContent), Z), `${ficha}: el repaso se vacía al acertarlas`);
        // Casos
        await pulsar(`${Z} [data-ir="casos"]`);
        for (const [k, caso] of d.casos.entries()) {
            await pulsar(`${Z} [data-caso="${k}"]`);
            for (const [j, paso] of caso.pasos.entries()) {
                const fichaPac = await p.evaluate(z => ({ nuevos: document.querySelectorAll(z + ' .may-paciente dd.may-cambia .may-nuevo').length, dia: document.querySelector(z + ' .may-dia')?.textContent }), Z);
                if (paso.nuevo?.length && fichaPac.nuevos !== paso.nuevo.length) ok(false, `${caso.id} paso ${j + 1}: lo nuevo no sale marcado (${fichaPac.nuevos} de ${paso.nuevo.length})`);
                if (fichaPac.dia !== paso.momento) ok(false, `${caso.id} paso ${j + 1}: sin su momento`);
                await contestar(paso.pregunta, j === 0, `${caso.id} paso ${j + 1}`, nf === 0 && j === 2 ? '06-caso' : null);
                await siguiente();
            }
            const fin = await p.evaluate(z => ({ txt: document.querySelector(z).textContent, ficha: !!document.querySelector(z + ' [data-may-texto]'), modelo: !!document.querySelector(z + ' .may-modelo') }), Z);
            ok(/Lo que te llevas/.test(fin.txt) && fin.ficha && fin.modelo, `${ficha}: el caso ${caso.id} llega a «Lo que te llevas», con vuelta a la ficha y al modelo`);
            ok(await desborde() <= 0, `${ficha}: sin desborde en «Lo que te llevas» (${caso.id})`);
            if (nf === 0 && k === 0) await foto('07-fin-caso', Z);
            if (k < d.casos.length - 1) await pulsar(`${Z} [data-fin="otro"]`);
        }
        // «Repasar en la ficha»: vuelve al texto, en su sitio
        await pulsar(`${Z} [data-may-texto]`); await p.waitForTimeout(900);   // el scroll de «Ver en el texto» es suave
        const ancla = d.casos.at(-1).volver.ancla;
        ok(await p.evaluate(([f, a]) => { const t = document.getElementById(f), e = document.getElementById(a); const r = e.getBoundingClientRect(); return !t.classList.contains('modo-mayeutica') && !!e.offsetParent && r.top < innerHeight && r.bottom > 0; }, [ficha, ancla]), `${ficha}: «Repasar en la ficha» vuelve al texto, a «${ancla}»`);
        // «Para profundizar»
        await pulsar(`#${ficha} > .vista-toggle [data-vista="mayeutica"]`); await p.waitForTimeout(150);
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
        ok(await p.evaluate(([f, a]) => { const e = document.getElementById(a); const r = e.getBoundingClientRect(); return !document.getElementById(f).classList.contains('modo-mayeutica') && !!e.offsetParent && r.top < innerHeight && r.bottom > 0; }, [ficha, p0]), `${ficha}: «Ver en el texto» de «Para profundizar» lleva a «${p0}», en el texto`);
    }
    ok(nDesbordeOk >= 40, `sin desborde tras contestar en ${nDesbordeOk} respuestas y pasos`);

    // Lo guardado sigue al recargar
    const nPreg = FICHAS.reduce((a, f) => a + MAYEUTICA_B1[f].guia.length + MAYEUTICA_B1[f].examen.length, 0);
    const g = await p.evaluate(() => JSON.parse(localStorage.getItem('mayeutica-fichas-v1') || '{}'));
    const guardadas = Object.values(g).filter(x => x.resultado).length;
    ok(guardadas === nPreg && !Object.values(g).some(x => x.repasar), `localStorage: ${guardadas} de ${nPreg} con resultado y ninguna pendiente de repaso`);
    await p.reload(); await p.waitForFunction(() => document.getElementById('mar-cristaloides')?.querySelector(':scope > .vista-mayeutica'));
    await abrirFicha(FICHAS[0]); await p.waitForTimeout(400);
    await pulsar(`#${FICHAS[0]} > .vista-toggle [data-vista="mayeutica"]`); await p.waitForTimeout(150);
    const n0 = MAYEUTICA_B1[FICHAS[0]].guia.length + MAYEUTICA_B1[FICHAS[0]].examen.length;
    ok(await p.evaluate(([f, n]) => new RegExp(`Seguir \\(${n} de ${n}\\)`).test(document.querySelector(`#${f} .may-zona`).textContent), [FICHAS[0], n0]), `tras recargar, ${FICHAS[0]} recuerda las ${n0}`);

    ok(errores.length === 0, `0 errores de consola (${errores.length}) ${errores.slice(0, 3).join(' | ')}`);
    const ids = await p.evaluate(() => { const v = {}; document.querySelectorAll('[id]').forEach(e => { v[e.id] = (v[e.id] || 0) + 1; }); return Object.keys(v).filter(k => v[k] > 1); });
    ok(ids.length === 0, 'sin ids repetidos ' + ids.join(','));
    await ctx.close();
    fallosTotales.push(...fallos.map(f => `${tag}: ${f}`));
}

try {
    await correr(390, false);
    await correr(360, true);
} catch (e) { fallosTotales.push('la prueba se cortó: ' + e.message); console.log('❌ ' + e.message); }
await b.close();
console.log(fallosTotales.length ? `\n❌ ${fallosTotales.length} fallo(s)` : '\n✅ Mayéutica de las fichas: todo bien');
process.exit(fallosTotales.length ? 1 : 0);

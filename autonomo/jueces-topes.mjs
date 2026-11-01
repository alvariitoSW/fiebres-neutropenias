// Juez de topes (REGLAS §1.14; tarea jueces-topes). Lo llama autonomo/jueces.mjs con --modelo y --forma (a 390 px).
// En cada modelo vivo lleva cada mando a sus extremos y, tras cada tope, falla si:
//   1. aparece NaN / undefined / Infinity en el texto visible del modelo;
//   2. hay errores de consola;
//   3. la página desborda de lado (> 0 px);
//   4. una cifra con rótulo reconocible sale de lo posible en un paciente (autonomo/jueces-topes-rangos.mjs);
//   5. un botón que acumula (suero, dosis, bolo…) se pulsa 15 veces, deja de cambiar algo (llegó a su tope) y no hay
//      consecuencia visible: ni se apaga el botón, ni sale un sello o aviso nuevo, ni cambia la frase viva.
// Mandos: <input range/number> a su mínimo y máximo (input + change), <select> a la primera y la última opción,
// casillas marcadas y desmarcadas, y cada botón de acción pulsado 15 veces. Los selectores de estado (3 o más
// botones hermanos con el mismo atributo data-*) se pulsan solo en el primero y el último. Las pestañas internas
// del modelo se recorren todas para llegar a los mandos de cada panel.
import { MODELOS } from './jueces-forma.mjs';
import { RANGOS, NO_NEGATIVOS } from './jueces-topes-rangos.mjs';

// Ajustes propios de un modelo si hicieran falta: { raiz: '#x', noPulsar: /^Texto del botón/ }. Vacío por defecto.
const AJUSTES = {
    // El «Paso a paso» de la lupa recorre piezas: no es un mando que acumule
    // El vaso vivo: el reloj «horas desde el dolor» (#vso-m-horas, 0-24 h) se lleva a 0 y a 24 como todo range; su
    // rango de paciente posible está en jueces-topes-rangos.mjs y el sello de las 12 h lo comprueba pruebas/vaso-vivo.mjs
    'vaso-vivo': {},
    // El shock vivo, estado «diseccion» (b3-paso4 g5): los topes nuevos son nicardipino 15 mg/h, esmolol 200 µg/kg/min, labetalol 300 mg y nitroprusiato
    // (botones que se apagan en su máximo) y los sellos «Cizalla ↑», «Objetivo», «Por debajo de lo tolerado» y bradicardia; los recorre este juez y
    // pruebas/shock-vivo.mjs (sección A4) comprueba la dirección de la FC. No hace falta ajuste: ningún botón del dock es un paso a paso.
    'shock-vivo': {},
    // El pulmón con respirador: sus mandos son los deslizadores del dock, los alternadores de maniobra y las teclas de la pantalla
    // (Insp./Esp. mantenida, Congelar: alternan, no acumulan). Los sellos de tope duro (Vt > 12 mL/kg, VM > 20 L/min) y de
    // «Hiperinflación» los comprueba pruebas/pulmon-vivo.mjs (par 10) con las constantes del paciente.
    // E4a: el deslizador «Esfuerzo (Pmus)» (0-15, aviso a 12) y el sello P-SILI (Vt ≥9,5 mL/kg en presión de soporte) los lleva al tope
    // pruebas/pulmon-vivo.mjs (bloque «E4a»): Pmus 15 en Elvira pasa el tope de 12 mL/kg y el mando vuelve; Pmus 9 conserva el P-SILI.
    // E4b: el estado «neumotorax-tension» lleva dos sellos: «Neumotórax a tensión: shock obstructivo» (desde 10,5 cmH₂O de aire pleural; PAM ≈54, gasto ≈1,9 L/min); la parada sin pulso, desde 13,5 y «Parada: actividad eléctrica sin pulso» (el tope, 20 cmH₂O; PAM ≈20, gasto ≈0,2 L/min; Marino cap. 28 p. 28) (en el tope: «Dejar pasar 5
    // respiraciones» se apaga y los mandos del respirador quedan inertes hasta descomprimir); «Empezar otra vez» reinicia el caso y no es un mando.
    // Lo recorre pruebas/pulmon-vivo.mjs (bloque «E4b»): pico y meseta suben juntos, PAM y SpO₂ caen, el sitio clásico falla y el correcto los recupera.
    'pulmon-vivo': { noPulsar: /^(Empezar otra vez)/ },
    // Iones vivos: «Hazlo / Siguiente / Cerrar» de la guía son pasos y «Esperar 15 min» un reloj que solo deja decaer el bolo: no son mandos que acumulen (la prueba propia los recorre)
    'iones-vivos': { noPulsar: /^(Explícam|Empezar de nuevo|Reiniciar|Reinicio|Volver|←|Hazlo|Siguiente|Cerrar|‹ Anterior|Pausa|Esperar)/ },
    // Hepatocito vivo: la guía (Hazlo / Siguiente), el carril animado y las respuestas de las pruebas no son mandos que acumulen
    'hepatocito-vivo': { noPulsar: /^(Explícam|Empezar de nuevo|Reiniciar|Reinicio|Volver|←|Hazlo|Siguiente|Cerrar|‹ Anterior|▶ Ver el carril|Ver la frase buena|Ver la modalidad)/ },
    // [HUECO termostato: noPulsar]
    'receptor-vivo': { noPulsar: /^(Explícam|Empezar de nuevo|Reiniciar|Reinicio|Volver|←|▶ Paso|■ Parar)/ },
};
// Botones que nunca son mandos: navegación, cambio de modo, enlaces cruzados, cerrar lupas, explicaciones y reinicios.
const NO_MANDO = '[data-especialidad], [data-view], [data-resaltar], [data-volver], [data-modo], .back-btn, [class*="-org-ir"], [class*="-ir"], [id$="-lupa-cerrar"], [id*="-modo-"], [id$="-guia-abrir"], [data-accion]';
const NO_PULSAR = '^(Explícam|Empezar de nuevo|Reiniciar|Reinicio|Volver|←)';
const REPETICIONES = 15;
// Mandos candidatos; se localizan por su posición en esta lista (si el modelo rehace el DOM al mover, el mando se encuentra igual)
const CANDIDATOS = 'input[type=range], input[type=number], select, input[type=checkbox], button';
const ALERTAS = '[role=alert], [class*="sello"], [class*="tope"], [class*="aviso"], [class*="alerta"], [class*="warn"], [class*="peligro"], [class*="danger"], [class*="parada"]';

/* ---------- En la página (cada función es autónoma: se serializa tal cual) ---------- */
// Estado visible del modelo: texto (con los rótulos de los SVG), frase viva, avisos y desborde lateral.
function leer([raiz, alertas]) {
    const R = document.querySelector(raiz); if (!R) return null;
    const vis = e => e.getClientRects().length > 0 && !e.closest('[hidden]') && getComputedStyle(e).visibility !== 'hidden';
    const sv = [...R.querySelectorAll('svg text')].filter(vis).map(t => t.textContent.trim()).filter(Boolean).join(' | ');
    const frase = R.querySelector('[id$="-frase"]');
    // Cifras de los botones (composición de un suero, sodio del sudor…) son de la sustancia, no del paciente: se dejan fuera
    const w = document.createTreeWalker(R, NodeFilter.SHOW_TEXT), partes = [];
    for (let n; (n = w.nextNode());) { const p = n.parentElement; if (n.textContent.trim() && p && !p.closest('button, script, style') && vis(p) && !p.closest('svg')) partes.push(n.textContent.replace(/\s+/g, ' ')); }
    return { texto: partes.join('\n') + '\n' + sv, frase: frase ? frase.textContent.replace(/\s+/g, ' ').trim() : '',
        alertas: [...R.querySelectorAll(alertas)].filter(vis).map(e => e.textContent.replace(/\s+/g, ' ').trim()).filter(Boolean).join(' || '),
        desborde: document.documentElement.scrollWidth - document.documentElement.clientWidth };
}

// Pestañas internas del modelo (no los modos Explorar/Conceptos/Mayéutica), numeradas con data-jp.
function pestanas(raiz) {
    const R = document.querySelector(raiz); if (!R) return [];
    const l = [...R.querySelectorAll('[role=tab]')].filter(e => e.getClientRects().length && !e.matches('[id*="-modo-"], [data-modo]'));
    l.forEach((e, i) => e.setAttribute('data-jp', String(i)));
    return { nombres: l.map(e => e.textContent.trim().slice(0, 20)), activa: l.findIndex(e => e.getAttribute('aria-selected') === 'true') };
}

// Marca (data-jt) y lista los mandos visibles del modelo.
function listar([raiz, noMando, noPulsar, candidatos]) {
    const R = document.querySelector(raiz); if (!R) return [];
    R.querySelectorAll('details').forEach(d => { d.open = true; });
    const vis = e => e.getClientRects().length > 0 && !e.closest('[hidden]') && getComputedStyle(e).visibility !== 'hidden';
    const rx = new RegExp(noPulsar, 'i');
    R.querySelectorAll('[data-jt]').forEach(e => e.removeAttribute('data-jt'));
    const out = [];
    const todos = [...R.querySelectorAll(candidatos)];
    for (const e of todos) {
        if (!vis(e) || e.disabled || e.matches('[role=tab]') || e.closest('dialog')) continue;
        const boton = e.tagName === 'BUTTON';
        if (boton && (e.matches(noMando) || rx.test(e.textContent.trim()))) continue;
        let grupo = null;
        if (boton) {
            const h = [...e.parentElement.children].filter(x => x.tagName === 'BUTTON');
            const attr = [...e.attributes].find(a => a.name.startsWith('data-') && h.filter(x => x.hasAttribute(a.name)).length >= 3);
            if (attr) { const g = h.filter(x => x.hasAttribute(attr.name)); grupo = { n: g.length, pos: g.indexOf(e) }; }
        }
        e.setAttribute('data-jt', String(out.length));
        const t = (e.getAttribute('aria-label') || e.textContent.replace(/\s+/g, ' ').trim() || e.id || Object.values(e.dataset)[0] || e.tagName).slice(0, 26);
        out.push({ i: out.length, o: todos.indexOf(e), tipo: e.tagName === 'SELECT' ? 'select' : boton ? 'boton' : e.type === 'checkbox' ? 'casilla' : 'rango', grupo, t });
    }
    return out;
}

// Mueve un mando a sus extremos o pulsa un botón N veces; devuelve la lista de pasos (antes de leer cada uno, el
// Node vuelve a leer el estado). Para el botón, devuelve el resumen de la repetición.
async function mover([raiz, i, paso, candidatos, o]) {
    const e = document.querySelector(`${raiz} [data-jt="${i}"]`) || document.querySelector(raiz)?.querySelectorAll(candidatos)[o]; if (!e) return { perdido: true };
    const ev = (...n) => n.forEach(x => e.dispatchEvent(new Event(x, { bubbles: true })));
    if (e.matches('input[type=range], input[type=number]')) { window.__jv = window.__jv || {}; if (paso === 2) { e.value = window.__jv[o]; ev('input', 'change'); return { etq: 'restaurado' }; } if (paso === 0) window.__jv[o] = e.value; const v = paso === 0 ? e.min : e.max; if (v === '') return { etq: 'sin ' + (paso ? 'máx' : 'mín') }; e.value = v; ev('input', 'change'); return { etq: `${paso ? 'máx' : 'mín'} = ${v}` }; }
    if (e.tagName === 'SELECT') { const n = e.options.length, k = paso === 0 ? 0 : n - 1; e.selectedIndex = k; ev('input', 'change'); return { etq: `opción ${k + 1}/${n} «${e.options[k].text.slice(0, 18)}»` }; }
    if (e.type === 'checkbox') { e.checked = paso === 0; ev('input', 'change'); return { etq: paso === 0 ? 'marcada' : 'desmarcada' }; }
    e.click(); return { etq: 'pulsado' };
}

// Pulsa un botón `n` veces y resume: cuántas veces cambió el modelo, si se apagó, y avisos/frase antes y después.
async function repetir([raiz, i, n, alertas, candidatos, o]) {
    const R = document.querySelector(raiz), buscar = () => R.querySelector(`[data-jt="${i}"]`) || R.querySelectorAll(candidatos)[o]; let e = buscar(); if (!e) return { perdido: true };
    const vis = x => x.getClientRects().length > 0 && !x.closest('[hidden]');
    const foto = () => R.innerText + '|' + [...R.querySelectorAll('svg text')].map(t => t.textContent).join('|');
    const sello = () => [...R.querySelectorAll(alertas)].filter(vis).map(x => x.textContent.replace(/\s+/g, ' ').trim()).filter(Boolean).join(' || ');
    const frase = () => (R.querySelector('[id$="-frase"]')?.textContent || '').replace(/\s+/g, ' ').trim();
    const espera = ms => new Promise(f => setTimeout(f, ms));
    const ini = { sello: sello(), frase: frase() };
    let antes = foto(); const cambios = [], fotos = [antes]; let apagadoEn = 0, tras2 = null;
    for (let k = 1; k <= n; k++) {
        if (e.disabled) { apagadoEn = k; break; }
        if (!vis(e)) break;   // se fue de pantalla (abrió una lupa o cambió de panel): no es un tope
        e = buscar() || e; e.click(); await espera(80);
        for (let j = 0, u = foto(); j < 8; j++) { await espera(70); const v = foto(); if (v === u) break; u = v; }   // espera a que se asiente
        const d = foto(); cambios.push(d !== antes); antes = d; fotos.push(d);
        if (k === 2) tras2 = { sello: sello(), frase: frase() };
    }
    const alterna = fotos.some((f, j) => j >= 2 && f === fotos[j - 2] && f !== fotos[j - 1]);   // un interruptor: vuelve a lo de antes
    if (!apagadoEn && e.disabled) apagadoEn = n + 1;
    return { cambios, apagadoEn, alterna, ini, tras2, fin: { sello: sello(), frase: frase() } };
}

/* ---------- En Node ---------- */
const num = s => parseFloat(s.replace('−', '-').replace(',', '.'));
// Cifras imposibles y NaN en un texto visible → lista de problemas (texto corto, sin repetirse)
function problemas(txt) {
    const p = [];
    const nan = txt.match(/(?<![\p{L}\p{N}])(-?Infinity|NaN|undefined)(?![\p{L}])/u);
    if (nan) p.push(`«${nan[1]}» en el texto visible (${(txt.slice(Math.max(0, nan.index - 25), nan.index + 15)).replace(/\s+/g, ' ')})`);
    // Composición de un líquido (sudor, orina, diarrea, suero…) no es una cifra del paciente: se mira la línea antes del rótulo
    const SUSTANCIA = /sudor|orina|diarrea|est[óo]mago|g[áa]stric|saliva|bilis|moco|diur[ée]tico|p[ée]rdida|suero|salino|ringer|soluci[óo]n|fluido|infus|bolo/i;
    const medida = (r, f) => { for (const m of txt.matchAll(r.re)) { const linea = txt.slice(Math.max(txt.lastIndexOf('\n', m.index), m.index - 60), m.index); if (SUSTANCIA.test(linea)) continue; if (r.ignorarSi && r.ignorarSi.test(txt.slice(Math.max(0, m.index - 100), m.index + 60))) continue; f(num(m[1]), (linea.replace(/\s+/g, ' ').slice(-34) + m[0]).trim()); } };
    for (const r of RANGOS) medida(r, (v, ctx) => { if (v < 0 && !r.neg) return; if (v < r.min || v > r.max) p.push(`${r.nombre} imposible: «${ctx}» (rango posible ${r.min} a ${r.max}; fisiología general)`); });
    for (const r of NO_NEGATIVOS) medida(r, (v, ctx) => { if (v < 0) p.push(`${r.nombre} negativo: «${ctx}»`); });
    return [...new Set(p)];
}

export async function juzgarTopes({ nav, base, ok, mal, modelos = [], todo = false, antes = null, ancho = 390 }) {
    const claves = [...new Set([...modelos.filter(k => MODELOS[k]), ...(todo ? Object.keys(MODELOS) : [])])];
    if (!claves.length) return;
    const ctx = await nav.newContext({ viewport: { width: ancho, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' });
    const pag = await ctx.newPage();
    const consola = [];
    pag.on('console', m => { if (m.type() === 'error') consola.push(m.text().slice(0, 140)); });
    pag.on('pageerror', e => consola.push('pageerror: ' + String(e.message).slice(0, 140)));
    await pag.goto(base); await pag.waitForTimeout(1500);
    if (antes) await antes(pag);
    for (const k of claves) {
        const M = MODELOS[k], aj = AJUSTES[k] || {}, raiz = aj.raiz || M.raiz, noPulsar = aj.noPulsar ? aj.noPulsar.source : NO_PULSAR;
        const lineas = [], malas = new Set(), vistos = new Set(), hechos = new Set();
        const enlace = e => pag.evaluate(d => { const b = document.createElement('button'); for (const [x, v] of Object.entries(d)) b.dataset[x] = v; document.body.appendChild(b); b.click(); b.remove(); }, { ...M.enlace, [M.clave]: e });
        let abierto = false;
        for (let t = 0; t < 3 && !abierto; t++) {   // con la máquina cargada el modelo tarda más: hasta 3 intentos
            await enlace(M.estados[0]); await pag.waitForTimeout(900 + 700 * t);
            await pag.evaluate(s => { const b = document.querySelector(s); if (b && b.getAttribute('aria-selected') !== 'true') b.click(); }, M.modo.explorar);
            await pag.waitForTimeout(400);
            abierto = await pag.evaluate(r => !!document.querySelector(r)?.offsetParent, raiz);
        }
        if (!abierto) { mal(`Topes · ${k}: no se abre`); continue; }
        consola.length = 0;
        // Revisa el estado tras un tope: NaN, cifras imposibles, desborde, consola. Devuelve los ❌ nuevos.
        const revisar = async (mando, etq) => {
            await pag.waitForTimeout(150);
            const s = await pag.evaluate(leer, [raiz, ALERTAS]); const nuevos = [];
            const anota = m => { if (!vistos.has(m)) { vistos.add(m); nuevos.push(m); } };
            if (!s) return ['el modelo desapareció'];
            problemas(s.texto).forEach(anota);
            if (s.desborde > 0) anota(`desborde lateral de ${s.desborde} px`);
            consola.splice(0).forEach(c => anota(`error de consola: ${c}`));
            return nuevos.map(m => `${m} [${mando} → ${etq}]`);
        };
        const grupos = [{ nombre: 'panel inicial', pest: null }];
        const pe = await pag.evaluate(pestanas, raiz);
        pe.nombres.forEach((t, i) => grupos.push({ nombre: `pestaña «${t}»`, pest: i }));
        // Cada mando se toca con su pestaña abierta (un selector de estado puede haber cambiado de panel)
        const abrir = g => { const i = g.pest !== null ? g.pest : pe.activa; return i < 0 ? 0 : pag.evaluate(([r, i]) => document.querySelector(`${r} [data-jp="${i}"]`)?.click(), [raiz, i]).then(() => pag.waitForTimeout(250)); };
        for (const g of grupos) {
            await abrir(g);
            const mandos = await pag.evaluate(listar, [raiz, NO_MANDO, noPulsar, CANDIDATOS]);
            for (const m of mandos) {
                const clave = m.tipo + m.t; if (hechos.has(clave)) continue; hechos.add(clave);   // el mismo mando en varios paneles, una vez
                await pag.evaluate(() => { document.querySelectorAll('dialog[open]').forEach(d => d.close()); document.querySelectorAll('[id$="-lupa-cerrar"]').forEach(b => b.getClientRects().length && b.click()); });
                await abrir(g);
                if (m.grupo && m.grupo.pos > 0 && m.grupo.pos < m.grupo.n - 1) continue;   // selector de estado: solo el primero y el último
                const nom = `${g.nombre} · ${m.tipo} «${m.t}»`, fallos = [];
                if (m.tipo !== 'boton' || m.grupo) {
                    const pasos = m.tipo === 'boton' ? [0] : m.tipo === 'rango' ? [0, 1, 2] : [0, 1], etqs = [];
                    for (const p of pasos) {
                        const r = await pag.evaluate(mover, [raiz, m.i, p, CANDIDATOS, m.o]); if (r.perdido) break;
                        if (p < 2) etqs.push(r.etq); fallos.push(...await revisar(`${g.nombre} · «${m.t}»`, r.etq));
                    }
                    lineas.push(`${fallos.length ? '❌' : '✅'} ${nom}: ${etqs.join(' / ')}`);
                } else {
                    const r = await pag.evaluate(repetir, [raiz, m.i, REPETICIONES, ALERTAS, CANDIDATOS, m.o]);
                    if (r.perdido) continue;
                    const n = r.cambios.length, acumula = n >= 4 && r.cambios[0] && r.cambios[1] && r.cambios[2] && !r.alterna;
                    // Consecuencia visible: se apaga, o tras la 2ª pulsación sale un sello/aviso nuevo o cambia la frase viva
                    const consecuencia = r.apagadoEn > 0 || (r.tras2 && (r.fin.sello !== r.tras2.sello || r.fin.frase !== r.tras2.frase));
                    fallos.push(...await revisar(`${g.nombre} · «${m.t}»`, `×${n}`));
                    if (acumula && !consecuencia) fallos.push(`tope sin consecuencia: tras ${n} pulsaciones el botón sigue acumulando o se atasca, y no se apaga ni sale sello/aviso ni cambia la frase [${g.nombre} · «${m.t}»]`);
                    const cuando = r.apagadoEn ? `se apaga en la pulsación ${r.apagadoEn - 1}` : !n ? 'no estaba a la vista al pulsar' : n < REPETICIONES ? `cambia de vista tras ${n}` : r.alterna ? 'interruptor (alterna)' : !acumula ? 'no acumula' : consecuencia ? 'acumula, con sello/frase nuevo' : 'acumula';
                    lineas.push(`${fallos.length ? '❌' : '✅'} ${nom}: ×${n}, ${cuando}`);
                }
                fallos.forEach(f => malas.add(f));
            }
        }
        const cuerpo = lineas.map(l => '   ' + l).join('\n');
        malas.size ? mal(`Topes ${ancho}px · ${k}: ${malas.size} fallo(s)\n   ${[...malas].map(f => '❌ ' + f).join('\n   ')}\n${cuerpo}`)
            : ok(`Topes ${ancho}px · ${k}: ${lineas.length} mandos llevados al tope: sin textos rotos, cifras imposibles, errores ni desborde\n${cuerpo}`);
    }
    await ctx.close();
}

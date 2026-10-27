// «Lee este trazado» (ficha 11) y la tarjeta «¿Rápido o lento? ¿Estable?» (ficha 8) del cuaderno «ECG y arritmias».
// Fuente: López Ramírez JH. La alegría de leer el electrocardiograma, 3.ª ed., 2012, caps. 8, 11 y 12. Datos en js/data/pif-ecg-ejercicios.js.
// Los botones se crean una vez y se repintan; las respuestas viven en los datos, no en el HTML.
import { initSiNoWizard } from '../../core/wizard.js';
import { EJERCICIOS, ERRORES, GALERIA, CASOS, pdfPag, IMG } from '../../data/pif-ecg-ejercicios.js';

const PANEL = 'panel-pif-ecg-tabs';
const imgSrc = n => (typeof n === 'number' ? IMG(n) : `js/modules/pif-cardio/img/ecg/${n}.png`);
const pg = (parte, p, txt) => `<a class="biblio-link" href="${pdfPag(parte, p)}" target="_blank" rel="noopener">${txt || `p. ${p}`}</a>`;
const verFicha = (tab, ref, txt = 'Ver en la ficha') => `<button type="button" class="especialidad-link" data-especialidad="pifCardio" data-view="ecgArritmias" data-panel="${PANEL}" data-tab="${tab}" data-resaltar="${ref}">${txt}</button>`;
const latir = (estado, txt = '⚡ Verlo latir →') => estado ? `<button type="button" class="especialidad-link" data-especialidad="libros" data-view="ritmoVivo" data-ritmo-vivo="${estado}">${txt}</button>` : '';
const el = (tag, attrs = {}, html = '') => { const e = document.createElement(tag); Object.entries(attrs).forEach(([k, v]) => (k === 'style' ? (e.style.cssText = v) : e.setAttribute(k, v))); e.innerHTML = html; return e; };

// ---------- Tarjeta de guardia (ficha 8) ----------
const hoja = (nombre, pags, tab, ref, vivo, extra = '') =>
    `${nombre}</strong><div style="font-weight:400;font-size:0.82rem;margin-top:6px;">${pags.map(([parte, p]) => pg(parte, p)).join(' · ')} ${extra}<div style="margin-top:6px;display:flex;flex-wrap:wrap;gap:6px;">${verFicha(tab, ref)}${latir(vivo)}</div></div><strong></strong>`;
const FV = { estado: 'tfg-estado-danger', final: hoja('Fibrilación ventricular: actividad caótica sin P-QRS-T', [[1, 37]], 'ecg-f3', '#ecg-f3-fv-que', 'fv') };
const TV = { estado: 'tfg-estado-danger', final: hoja('Taquicardia ventricular', [[2, 123], [2, 125]], 'ecg-f8', '#ecg8-brugada', 'tv', '<br>Nota de fuentes sobre los pasos de Brugada (ESC 2019) en la ficha.') };
const hojaNeutra = (n, pags, tab, ref, vivo, extra) => ({ estado: 'tfg-estado-neutro', final: hoja(n, pags, tab, ref, vivo, extra) });
const ARBOL = {
    inicio: { pregunta: '¿Se identifican QRS en el trazado?', si: 'fc', no: FV },
    fc: { pregunta: '¿La frecuencia de los QRS es mayor de 100 por minuto?', si: 'qrs', no: 'lenta' },
    lenta: { pregunta: '¿La frecuencia es menor de 60 por minuto?', si: 'pqrs',
        no: { estado: 'tfg-estado-ok', final: hoja('Frecuencia normal: ritmo sinusal si hay una P igual antes de cada QRS', [[2, 113], [2, 114]], 'ecg-f8', '#ecg8-sinusal', 'sinusal') } },
    pqrs: { pregunta: '¿Cada P va seguida de un QRS?', si: 'pr', no: 'wenck' },
    pr: { pregunta: '¿El PR mide más de 0,20 s (5 mm)?',
        si: hojaNeutra('BAV de 1.er grado', [[2, 116], [2, 117]], 'ecg-f8', '#ecg8-tabla-bav', ''),
        no: hojaNeutra('Bradicardia sinusal o disfunción sinusal (con escape nodal 40-60 o ventricular < 40 si falta el sinusal)', [[2, 114], [2, 116]], 'ecg-f8', '#ecg8-tabla-escapes', '') },
    wenck: { pregunta: '¿El PR se alarga latido a latido hasta que una P no conduce?',
        si: hojaNeutra('BAV de 2.º grado Mobitz I (Wenckebach)', [[2, 117]], 'ecg-f8', '#ecg8-fig-bav2', ''), no: 'relacion' },
    relacion: { pregunta: '¿Las P que conducen llevan siempre el mismo PR?',
        si: { estado: 'tfg-estado-danger', final: hoja('BAV de 2.º grado Mobitz II: requiere marcapasos según el libro', [[2, 117], [2, 98]], 'ecg-f7', '#ecg-f7-bav3-causas', '', 'Con 2:1 mira la nota de la ficha.') },
        no: { estado: 'tfg-estado-danger', final: hoja('BAV completo: disociación entre P y QRS; requiere marcapasos según el libro', [[2, 117], [2, 98]], 'ecg-f7', '#ecg-f7-bav3-causas', '') } },
    qrs: { pregunta: '¿El QRS es estrecho (menos de 120 ms = 3 mm)?', si: 'rr', no: 'irr' },
    rr: { pregunta: '¿Los R-R son regulares?', si: 'f150', no: 'pmulti' },
    pmulti: { pregunta: '¿Hay tres o más formas de P, con PR variable?',
        si: hojaNeutra('Taquicardia auricular multifocal', [[2, 119]], 'ecg-f8', '#ecg8-tam', 'tam'), no: 'fvar' },
    fvar: { pregunta: '¿Se ven ondas F en dientes de sierra?',
        si: hojaNeutra('Flúter auricular con conducción variable', [[2, 119]], 'ecg-f8', '#ecg8-fig-flutter', 'flutter'),
        no: hojaNeutra('Fibrilación auricular: sin P y con R-R irregular', [[2, 119], [2, 120]], 'ecg-f8', '#ecg8-fig-fa', 'fa') },
    f150: { pregunta: '¿La frecuencia ronda los 150 o se ven ondas F?',
        si: hojaNeutra('Flúter auricular con conducción 2:1', [[2, 119]], 'ecg-f8', '#ecg8-sospecha-flutter', 'flutter'), no: 'pnormal' },
    pnormal: { pregunta: '¿Hay una P normal (positiva en DII) antes de cada QRS?',
        si: { estado: 'tfg-estado-ok', final: hoja('Taquicardia sinusal', [[2, 118]], 'ecg-f3', '#ecg-f3-ts-que', 'taquiSinusal') },
        no: hojaNeutra('TPSV: reentrada nodal (r′ en V1, pseudo-S inferior) u ortodrómica (P negativa tras el QRS, RP > 100 ms)', [[2, 120], [2, 121]], 'ecg-f8', '#ecg8-circuito-nodo', 'nodal') },
    irr: { pregunta: '¿Los R-R son irregulares?',
        si: hojaNeutra('FA con bloqueo de rama o con preexcitación', [[2, 121], [2, 122]], 'ecg-f8', '#ecg8-ancho-def', 'wpwFa'), no: 'b1' },
    b1: { pregunta: 'Brugada 1: ¿falta el patrón R/S en todas las precordiales?', si: TV, no: 'b2' },
    b2: { pregunta: 'Brugada 2: ¿del inicio de la R al nadir de la S pasan más de 100 ms en alguna precordial?', si: TV, no: 'b3' },
    b3: { pregunta: 'Brugada 3: ¿hay disociación AV?', si: TV, no: 'b4' },
    b4: { pregunta: 'Brugada 4: ¿la morfología es de TV en V1-V2 y en V6?', si: TV,
        no: hojaNeutra('Taquicardia supraventricular con aberrancia', [[2, 125]], 'ecg-f8', '#ecg8-fig-aberrancia', 'aberrancia', '<br>Nota de fuentes sobre los pasos de Brugada (ESC 2019) en la ficha.') },
};

// ---------- Piezas de la ficha 11 ----------
function montarChips(cont, chips) {
    const EJES = [['fc', 'Frecuencia', ['rápida', 'lenta']], ['qrs', 'QRS', ['estrecha', 'ancha']], ['rr', 'R-R', ['regular', 'irregular']]].filter(([k]) => chips[k]);
    const elegido = {}; const fila = el('div', { style: 'display:flex;flex-direction:column;gap:6px;margin:8px 0;' });
    const frase = el('p', { 'aria-live': 'polite', style: 'font-size:0.8rem;margin:4px 0;color:var(--text-dim);' }, 'Primero elige; luego se comprueba.');
    EJES.forEach(([k, nombre, vals]) => {
        const f = el('div', { style: 'display:flex;gap:6px;align-items:center;flex-wrap:wrap;' }, `<span style="font-size:0.78rem;min-width:78px;">${nombre}</span>`);
        vals.forEach(v => {
            const b = el('button', { type: 'button', class: 'quiz-opcion', 'aria-pressed': 'false', style: 'padding:6px 10px;' }, v);
            b.addEventListener('click', () => {
                elegido[k] = v; f.querySelectorAll('button').forEach(x => { const on = x === b; x.setAttribute('aria-pressed', on); x.style.borderColor = on ? 'var(--accent-yellow)' : ''; });
                if (EJES.every(([kk]) => elegido[kk])) {
                    const ok = EJES.every(([kk]) => elegido[kk] === chips[kk]);
                    frase.innerHTML = ok ? `<strong>Coincide con el libro:</strong> ${EJES.map(([kk]) => chips[kk]).join(' · ')}.` : `<strong>El libro:</strong> ${EJES.map(([kk]) => chips[kk]).join(' · ')}. Tú elegiste ${EJES.map(([kk]) => elegido[kk]).join(' · ')}: revisa la tira.`;
                }
            });
            f.appendChild(b);
        });
        fila.appendChild(f);
    });
    cont.append(fila, frase);
}

function montarTest(cont, d, extra = '', alAcabar = () => {}) {
    const caja = el('div', { class: 'card', style: 'padding:12px 14px;margin:8px 0;' });
    caja.appendChild(el('p', { style: 'font-size:0.88rem;margin:0 0 8px;' }, d.enun));
    const ver = el('button', { type: 'button', class: 'quiz-siguiente' }, 'Ya lo tengo: ver opciones');
    const lista = el('div', { class: 'quiz-opciones', hidden: '' }); const out = el('div', { hidden: '' });
    const botones = d.opc.map((t, i) => {
        const b = el('button', { type: 'button', class: 'quiz-opcion' }, t);
        b.addEventListener('click', () => {
            botones.forEach((x, k) => { x.disabled = true; if (k === d.ok) x.classList.add('correcta'); else if (k === i) x.classList.add('incorrecta'); });
            out.hidden = false; out.innerHTML = `<div class="quiz-explicacion"><strong>${i === d.ok ? 'Correcto.' : 'No.'}</strong> ${d.exp}<div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:6px;">${extra}</div></div>`;
            alAcabar(i === d.ok);
        });
        lista.appendChild(b); return b;
    });
    ver.addEventListener('click', () => { lista.hidden = false; ver.hidden = true; });
    caja.append(ver, lista, out); cont.appendChild(caja);
}

function montarError(cont, d, extra = '', alAcabar = () => {}) {
    const caja = el('div', { class: 'card', style: 'padding:12px 14px;margin:8px 0;' });
    caja.appendChild(el('p', { style: 'font-size:0.88rem;margin:0 0 8px;' }, `${d.enun || 'Un informe de este trazado. Hay 0, 1 o 2 frases erróneas: marca las que lo sean.'}`));
    const lista = el('div', { class: 'quiz-opciones' }); const marcadas = new Set(); let ninguno = false;
    const botones = d.frases.map((t, i) => {
        const b = el('button', { type: 'button', class: 'quiz-opcion', 'aria-pressed': 'false' }, t);
        b.addEventListener('click', () => { ninguno = false; nin.setAttribute('aria-pressed', 'false'); nin.style.borderColor = ''; marcadas.has(i) ? marcadas.delete(i) : marcadas.add(i); const on = marcadas.has(i); b.setAttribute('aria-pressed', on); b.style.borderColor = on ? 'var(--accent-yellow)' : ''; });
        lista.appendChild(b); return b;
    });
    const nin = el('button', { type: 'button', class: 'quiz-opcion', 'aria-pressed': 'false' }, 'No hay ningún error');
    nin.addEventListener('click', () => { ninguno = true; marcadas.clear(); botones.forEach(b => { b.setAttribute('aria-pressed', 'false'); b.style.borderColor = ''; }); nin.setAttribute('aria-pressed', 'true'); nin.style.borderColor = 'var(--accent-yellow)'; });
    lista.appendChild(nin);
    const comprobar = el('button', { type: 'button', class: 'quiz-siguiente' }, 'Comprobar'); const out = el('div', { hidden: '' });
    comprobar.addEventListener('click', () => {
        if (!marcadas.size && !ninguno) { out.hidden = false; out.innerHTML = '<div class="quiz-explicacion">Marca las frases erróneas o «No hay ningún error».</div>'; return; }
        const bien = d.errores.length === marcadas.size && d.errores.every(i => marcadas.has(i));
        [...botones, nin].forEach(b => { b.disabled = true; });
        botones.forEach((b, i) => { const esErr = d.errores.includes(i); if (esErr) b.classList.add(marcadas.has(i) ? 'correcta' : 'incorrecta'); else if (marcadas.has(i)) b.classList.add('incorrecta'); });
        if (!d.errores.length) nin.classList.add(ninguno ? 'correcta' : 'incorrecta');
        comprobar.hidden = true; out.hidden = false;
        const correcciones = d.errores.map(i => `<div style="margin-top:6px;"><em>«${d.frases[i]}»</em> → ${'<button type="button" class="quiz-siguiente" style="margin-top:4px;">Piénsala y ve la frase buena</button>'}<span hidden> <strong>${d.bien[i]}</strong></span></div>`).join('');
        out.innerHTML = `<div class="quiz-explicacion"><strong>${bien ? 'Correcto.' : 'No del todo.'}</strong> ${d.exp}${correcciones}<div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:6px;">${extra}</div></div>`;
        out.querySelectorAll('button.quiz-siguiente').forEach(b => b.addEventListener('click', () => { b.nextElementSibling.hidden = false; b.hidden = true; }));
        alAcabar(bien);
    });
    caja.append(lista, comprobar, out); cont.appendChild(caja);
}

function montarDestapa(cont, d, extra = '', alAcabar = () => {}) {
    const caja = el('div', { class: 'card', style: 'padding:12px 14px;margin:8px 0;' });
    caja.appendChild(el('p', { style: 'font-size:0.88rem;margin:0 0 8px;' }, d.enun));
    const b = el('button', { type: 'button', class: 'quiz-siguiente' }, 'Ya lo pensé: destapar'); const out = el('div', { hidden: '' });
    b.addEventListener('click', () => {
        b.hidden = true; out.hidden = false;
        out.innerHTML = `<div class="quiz-explicacion"><ul style="margin:0 0 6px;padding-left:18px;">${d.puntos.map(p => `<li><label><input type="checkbox"> <span class="hl-azul">${p}</span> <small>(lo tenía)</small></label></li>`).join('')}</ul>${d.exp}<div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:6px;">${extra}</div></div>`;
        alAcabar(true);
    });
    caja.append(b, out); cont.appendChild(caja);
}

const figura = (n, pagT, parte = 3, alt) => `<figure class="article-figure" style="margin:8px 0;"><img loading="lazy" src="${imgSrc(n)}" alt="${alt || 'Trazado de ECG del libro'}"><figcaption class="article-figure-caption">${pg(parte, pagT, `Trazado, p. ${pagT}`)}</figcaption></figure>`;
const extraDe = (d) => `${pg(3, d.pagR, `Respuesta del libro, p. ${d.pagR}`)} ${verFicha(d.tab, d.id || d.ref)} ${latir(d.vivo)}`;
const plegable = (titulo, abierto = false) => { const d = el('details', { class: 'nota-plegable', style: 'margin:8px 0;' }); if (abierto) d.open = true; d.appendChild(el('summary', { style: 'font-size:0.88rem;color:var(--text-main);padding:8px 0;' }, titulo)); return d; };

function seccionEjercicios(cont) {
    cont.appendChild(el('p', { class: 'section-label' }, 'Ejercicios del libro'));
    EJERCICIOS.forEach(e => {
        const d = plegable(`Ejercicio ${e.n}`); d.id = `ecg-f11-ej-${e.n}`;
        d.appendChild(el('div', {}, figura(e.n, e.pagT, e.parteT)));
        if (e.chips) montarChips(d, e.chips);
        montarTest(d, e, extraDe(e)); cont.appendChild(d);
    });
}
function seccionErrores(cont) {
    cont.appendChild(el('p', { class: 'section-label', style: 'margin-top:16px;' }, 'Encuentra el error'));
    ERRORES.forEach(e => {
        const d = plegable(`Informe sobre el ejercicio ${e.n}`); d.id = `ecg-f11-error-${e.id}`;
        d.appendChild(el('div', {}, figura(e.img, e.pagT, 3)));
        montarError(d, e, `${pg(3, e.pagR, `Respuesta del libro, p. ${e.pagR}`)} ${verFicha(e.tab, e.ref)}`); cont.appendChild(d);
    });
}
function seccionGaleria(cont) {
    cont.appendChild(el('p', { class: 'section-label', style: 'margin-top:16px;' }, 'Galería: más trazados del libro'));
    cont.appendChild(el('p', { style: 'font-size:0.82rem;color:var(--text-dim);margin:0 0 8px;' }, 'Mira cada trazado, di tu lectura y despliega la respuesta del libro.'));
    const tira = el('div', { id: 'ecg-f11-galeria', style: 'display:flex;gap:10px;overflow-x:auto;padding-bottom:8px;scroll-snap-type:x mandatory;' });
    GALERIA.forEach(g => {
        const t = el('div', { class: 'card', style: 'flex:0 0 86%;scroll-snap-align:start;padding:10px 12px;' }, `<strong style="font-size:0.85rem;">Ejercicio ${g.n}</strong>${figura(g.n, g.pagT, g.parteT || 3)}`);
        const det = el('details', { class: 'nota-plegable' }, `<summary>Respuesta del libro</summary><p style="font-size:0.82rem;margin:4px 0;">${g.resp}</p><div style="display:flex;flex-wrap:wrap;gap:6px;">${pg(3, g.pagR, `Respuesta, p. ${g.pagR}`)} ${verFicha(g.tab, g.id)}</div>`);
        t.appendChild(det); tira.appendChild(t);
    });
    cont.appendChild(tira);
}

// Casos: la ficha del paciente se va rellenando; lo nuevo, en rojo.
function montarCaso(cont, c) {
    const caja = el('div', { class: 'card', id: `ecg-caso-${c.id}`, style: 'padding:12px 14px;margin:10px 0;' });
    caja.appendChild(el('h4', { style: 'margin:0 0 8px;color:var(--accent-red);font-size:0.95rem;' }, c.titulo));
    const ficha = el('ul', { style: 'font-size:0.8rem;margin:0 0 8px;padding-left:18px;' });
    const cabeza = el('p', { style: 'font-size:0.75rem;margin:0;color:var(--text-dim);' }); const paso = el('div'); const sig = el('button', { type: 'button', class: 'quiz-siguiente', hidden: '' }, 'Siguiente paso →');
    const fin = el('div', { hidden: '' });
    caja.append(el('p', { class: 'section-label', style: 'margin:0 0 4px;' }, 'Ficha del paciente'), ficha, cabeza, paso, sig, fin);
    let k = -1;
    function ir() {
        k++; const p = c.pasos[k];
        ficha.querySelectorAll('.hl-rojo').forEach(x => x.classList.remove('hl-rojo'));
        ficha.appendChild(el('li', {}, `<span class="hl-rojo">${p.nuevo}</span> <small>(${p.momento})</small>`));
        cabeza.textContent = `Paso ${k + 1} de ${c.pasos.length} · ${p.momento}`; paso.innerHTML = ''; sig.hidden = true;
        paso.appendChild(el('p', { style: 'font-size:0.85rem;margin:6px 0;' }, `<strong>${p.ficha}</strong>`));
        if (p.img) paso.appendChild(el('div', {}, figura(p.img, p.pagT, typeof p.img === 'string' ? 3 : 3)));
        if (p.chips) montarChips(paso, p.chips);
        if (p.calc) paso.appendChild(el('div', { style: 'margin:6px 0;' }, verFicha(p.calc.tab, p.calc.ref, `🧮 ${p.calc.txt}`)));
        const extra = `${verFicha(p.tab, p.ref)} ${latir(p.vivo)}`;
        const alAcabar = () => {
            if (k + 1 < c.pasos.length) sig.hidden = false;
            else { fin.hidden = false; fin.innerHTML = `<div class="quiz-explicacion"><strong>Lo que te llevas</strong><ul style="margin:6px 0;padding-left:18px;">${c.llevas.map(x => `<li>${x}</li>`).join('')}</ul><div style="display:flex;flex-wrap:wrap;gap:6px;">${verFicha(c.vuelta.tab, c.id === 'c2' ? '#ecg-guardia-pregunta' : '#ecg9-tabla-ekg', c.vuelta.txt)} ${latir(c.vuelta.vivo, '⚡ Ver el estado en el corazón →')}</div></div>`; }
        };
        (p.tipo === 'error' ? montarError : p.tipo === 'destapa' ? montarDestapa : montarTest)(paso, p, extra, alAcabar);
    }
    sig.addEventListener('click', ir); ir(); cont.appendChild(caja);
}

function renderFicha11() {
    const f = document.getElementById('ecg-f11'); if (!f) return;
    f.innerHTML = '';
    f.append(
        el('h3', { style: 'color: var(--accent-red);' }, 'Lee este trazado'),
        el('p', { class: 'fuente-ficha' }, `López Ramírez, <em>La alegría de leer el electrocardiograma</em>, caps. 11-12 (${pg(3, 165, 'ejercicios, pp. 165-183')}; ${pg(3, 185, 'respuestas, pp. 185-190')}).`),
        el('div', { class: 'card', id: 'ecg-f11-idea', style: 'padding:12px 14px;' }, '<p style="margin:0;font-size:0.9rem;"><strong>La idea:</strong> primero lee el trazado tú (frecuencia, QRS, R-R), luego mira las opciones. Los distractores son los ritmos vecinos del árbol de la tarjeta de guardia.</p>'),
    );
    seccionEjercicios(f); seccionErrores(f);
    f.appendChild(el('p', { class: 'section-label', style: 'margin-top:16px;' }, 'Dos casos'));
    CASOS.forEach(c => montarCaso(f, c));
    seccionGaleria(f);
    f.appendChild(el('p', { id: 'ecg-f11-profundizar', style: 'font-size:0.85rem;color:var(--text-dim);margin-top:14px;' },
        `Para profundizar: los ejercicios 1-39 del libro están en los capítulos 1-8 y solo se cubren aquí los trazados de los ejercicios 16, 17 y 37. Las arritmias, en ${verFicha('ecg-f8', '#ecg8-pasos', 'Ficha 8 · Arritmias')} y la ${verFicha('ecg-f8', '#ecg-guardia-pregunta', 'tarjeta de guardia')}.`));
}

export function init() {
    renderFicha11();
    initSiNoWizard('ecg-guardia', ARBOL);
}

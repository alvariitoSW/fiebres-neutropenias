// Maqueta B · error productivo en el capilar vivo (educacion-pionera, fase 3). No es parte de la app.
// Usa el motor real (capilar-vivo-escena.js + capilar-vivo-data.js). El tope «transfundir con Hb ≥7 sin indicación»
// (Marino cap. 12, p. 8) y el sello de TACO viven solo aquí. No guarda nada.
import { initEscena, medir, ponerVisible, aplicarModelo, ponerGoteo, mirarCelda, Lupa, $, estado, D } from '../../../../js/modules/libros/capilar-vivo-escena.js';
import { estadoDe, copia, gastoDe, HB_POR_CH, ESTADOS } from '../../../../js/data/capilar-vivo-data.js';

const PDF = '../../../docs/marino-2024-anemia-transfusion-hemostasia-uci.pdf';
const pg = (n, t) => `<a class="pdf" href="${PDF}#page=${n}" target="_blank" rel="noopener">${t || 'p. ' + n}</a>`;
const $$ = s => document.querySelector(s);
const raiz = $$('#cpv-raiz');

// ---- Escena: el bloque real del capilar vivo, tomado de su fragmento de la app
async function montarEscena() {
    const html = await (await fetch('../../../js/modules/libros/capilar-vivo.html')).text();
    const doc = new DOMParser().parseFromString(html, 'text/html');
    const bloque = doc.getElementById('cpv-escena-bloque');
    raiz.prepend(bloque);
    // las gráficas vivas y la fórmula que el motor repinta (aquí escondidas: el estudio no las enseña)
    const oculto = document.createElement('div'); oculto.hidden = true;
    oculto.append(doc.getElementById('cpv-vista-explorar'), doc.getElementById('cpv-formula'));
    document.body.append(oculto);
    // la leyenda de formas y la fila de lupas sobran en el estudio (la propia hoja de estilos las oculta)
    initEscena();
    ponerVisible(true);
    medir();
    new ResizeObserver(() => { medir(); Lupa.colocar(); }).observe($('lamina-caja'));
}

const CARMEN = { hb: 7.4, compensa: true, toma: 'scvo2' };
const poner = (e, lupa) => {
    aplicarModelo(estadoDe(e));
    if (lupa) { if (Lupa.abierta !== lupa) Lupa.abrir(lupa); $('libro').hidden = true; } else if (Lupa.abierta) Lupa.cerrar();
};

// ---- Pantallas
let pant = 1;
const secs = [...document.querySelectorAll('.pant[data-p]')];
function mostrar(n) {
    pant = n;
    secs.forEach(s => { s.hidden = +s.dataset.p !== n; });
    $$('#mandos-caja').hidden = !(n <= 3);
    $$('#entender').hidden = n !== 3;
    $('escena-bloque').hidden = n >= 5;
    window.scrollTo(0, 0);
}

// ---- Mandos (se crean una vez: aquí solo cambian texto, marca y estado)
const mT = $$('#m-transf'), mS = $$('#m-scv'), mP = $$('#m-parar'), chip = $$('#chip-tope'), scv = $$('#scv-txt');
const K = { fc: $$('#k-fc'), pa: $$('#k-pa'), pvc: $$('#k-pvc') };
const bloquear = v => [mT, mS, mP].forEach(b => { b.disabled = v; });
let segunda = false;   // ya pasó la 1.ª bolsa

// «Transfundir 1 CH»: la Hb sube 1 g/dL (p. 10) con el gasto quieto; gotea 2 h (2 s en pantalla)
function transfundir(fin) {
    const e0 = copia(estado), de = e0.hb, gc = gastoDe(e0), a = +(de + HB_POR_CH).toFixed(1);
    bloquear(true);
    const listo = () => { ponerGoteo(false); aplicarModelo(Object.assign(copia(e0), { hb: a, gcFijo: gc, transf: { de, a } })); fin(); };
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { listo(); return; }
    ponerGoteo(true);
    const t0 = performance.now();
    const paso = ahora => {
        const u = Math.min(1, (ahora - t0) / 2000);
        if (u < 1) { aplicarModelo(Object.assign(copia(e0), { hb: +(de + (a - de) * u).toFixed(1), gcFijo: gc, transf: { de, a: null } })); requestAnimationFrame(paso); }
        else listo();
    };
    requestAnimationFrame(paso);
}

function irP2() {
    segunda = true;
    K.pa.textContent = '120/66'; K.pvc.textContent = '10';
    mT.textContent = 'Transfundir otro CH'; mP.textContent = 'Parar aquí'; mS.hidden = true;
    // Aviso al ≈80 %: un dato de la hoja del laboratorio, sin consejo
    chip.innerHTML = `Hb 8,4 · umbrales de las guías: 7 y 8 g/dL (${pg(8)})`; chip.hidden = false;
    bloquear(false); mostrar(2);
}

// El sello: modelo en TACO con la lupa del alvéolo abierta, mando apagado
function irP3(rama) {
    poner({ hb: 9.4, gcFijo: gastoDe(estadoDe(CARMEN)), pao2: 55, alveolo: 'taco', compensa: true, toma: 'scvo2' }, 'alveolo');
    const r = $$('#rama-txt'); r.hidden = !rama; r.textContent = rama || '';
    mirarCelda(null);
    mT.textContent = 'Transfundir (apagado)'; mT.disabled = true; mT.title = 'Apagado: fuera de indicación, con TACO';
    mS.hidden = true; mP.hidden = true; chip.hidden = true; scv.hidden = true; $$('#consts').hidden = true;
    mostrar(3);
}

mT.addEventListener('click', () => {
    if (pant === 1) transfundir(irP2);
    else if (pant === 2) transfundir(() => irP3());
});
mS.addEventListener('click', () => {
    mirarCelda('ven');
    scv.hidden = false; scv.innerHTML = `ScvO₂ de control: ${D.R.ven} % <span class="org ilu">modelo · ilustrativo</span>`;
});
mP.addEventListener('click', () => {
    irP3(pant === 1
        ? 'El R1 de la mañana la ve «todavía baja» (7,4) y cuelga dos bolsas seguidas a las 8:00.'
        : 'El R1 de la mañana la ve «todavía baja» y cuelga otra bolsa a las 8:00.');
});

// ---- P4 · El ejemplo resuelto: seis pasos, el modelo en cada uno
const P4 = [
    { t: 'No se transfunde', e: CARMEN, m: null, f: '#mh-umbral-7',
      x: `Hb 7,4 en un crítico estable sin cardiopatía isquémica: <span class="hl-a">no se transfunde</span>. El umbral es 7; el 8 es solo con cardiopatía isquémica (${pg(8)}).` },
    { t: 'Si dudas, mira al tejido', e: CARMEN, m: 'o2er', f: '#mh-umbral-7', disc: true,
      x: `Si dudas, mira al tejido, no a la Hb: extracción <b>34 %</b>, lejos del 50 % que Marino propone como disparador (${pg(6)} y ${pg(8)}). ScvO₂ <b>65 %</b>: algunas guías proponen &lt;70 % (${pg(8, 'p. 8-9')}). Tras la 1.ª bolsa (ScvO₂ 69 %, extracción 30 %) la extracción sigue lejos del 50 %, y la ScvO₂ aún roza el 70 %: las reglas siguen sin coincidir.` },
    { t: 'La sangre sube el aporte', e: { hb: 8.4, gcFijo: gastoDe(estadoDe(CARMEN)), transf: { de: 7.4, a: 8.4 }, compensa: true, toma: 'scvo2' }, m: 'do2', f: '#mh-efecto-transfusion',
      x: `Transfundir sube el aporte (DO₂ 742 → 843), no el consumo (250): cae la extracción (Fig. 12.4, ${pg(10, 'p. 10-11')}). «No es un método absoluto para oxigenar» (${pg(11)}).` },
    { t: 'En el crítico, los riesgos pesan', e: { hb: 8.4, gcFijo: gastoDe(estadoDe(CARMEN)), transf: { de: 7.4, a: 8.4 }, compensa: true, toma: 'scvo2' }, m: null, f: '#mh-efecto-transfusion',
      x: `En 42 de 45 estudios los riesgos superan los beneficios; en 17 de 18, la transfusión fue factor de riesgo independiente (${pg(16)}).` },
    { t: 'Amenaza la hipovolemia, no la anemia', e: ESTADOS['anemia-hipovolemia'].p, m: 'gc', f: '#mh-efecto-transfusion',
      x: `Lo que sí amenaza al tejido es la <span class="hl-r">hipovolemia</span>, no la anemia (${pg(16, 'p. 16-17')}). Modelo: volemia baja, el gasto no sube (<span class="org ilu">ilustrativo</span>).` },
    { t: 'Si aparece TACO', e: { hb: 9.4, gcFijo: gastoDe(estadoDe(CARMEN)), pao2: 55, alveolo: 'taco', compensa: true, toma: 'scvo2' }, lupa: 'alveolo', f: '#mh-taco',
      x: `TACO: <span class="hl-r">parar la transfusión</span>, avisar al banco, diurético de asa i.v. y soporte; antes de otra transfusión, corregir el balance positivo (${pg(16)}).` },
];
let paso4 = 0;
function pintarP4() {
    const s = P4[paso4];
    poner(s.e, s.lupa);
    mirarCelda(s.m || null);
    $$('#p4-n').textContent = `Paso ${paso4 + 1} de ${P4.length}`;
    $$('#p4-t').textContent = s.t; $$('#p4-txt').innerHTML = s.x;
    $$('#p4-src').innerHTML = `Modelo: <span class="org">ficha</span> / <span class="org ilu">ilustrativo</span> (gasto y constantes)`;
    $$('#p4-disc').hidden = !s.disc;
    $$('#p4-ficha').dataset.resaltar = s.f;
    $$('#p4-aviso').hidden = true;
    $$('#p4-ant').disabled = paso4 === 0;
    $$('#p4-sig').textContent = paso4 === P4.length - 1 ? 'Ir a las preguntas →' : 'Siguiente paso →';
}
$$('#entender').addEventListener('click', () => { paso4 = 0; mostrar(4); pintarP4(); });
$$('#p4-ant').addEventListener('click', () => { if (paso4 > 0) { paso4--; pintarP4(); } });
$$('#p4-sig').addEventListener('click', () => { if (paso4 < P4.length - 1) { paso4++; pintarP4(); } else { mostrar(5); irPregunta(0); } });
document.addEventListener('click', ev => {
    const b = ev.target.closest('[data-resaltar],[data-capilar-vivo]');
    if (!b) return;
    const av = pant === 4 ? $$('#p4-aviso') : $$('#p6-aviso');
    av.hidden = false;
});

// ---- P5 · Las tres preguntas (se pintan al llegar; las respuestas no están en el HTML)
const NOTAS = { esc: 'Fuente: Marino cap. 12' };
const Q = [
    { fmt: 'Test con «piensa antes»',
      enun: 'Don Julián, 68 años, día 2 de un infarto sin elevación del ST, estable, Hb 7,6 g/dL, no sangra. ¿Qué haces?',
      ops: [
        ['Nada: está por encima del umbral de 7, como Carmen.', false, `Con cardiopatía isquémica el umbral es &lt;8 (${pg(8)}): dejarías anémico al miocardio que más O₂ necesita.`],
        ['Transfundir 1 CH y controlar la Hb.', true, `Hb &lt;8 con cardiopatía isquémica (${pg(8)}); 1 CH sube ≈1 g/dL (${pg(10)}).`],
        ['Transfundir 2 CH para pasar de 9.', false, `Es el estándar de 10 g/dL de 1942 que duró 60 años (${pg(7, 'p. 7-8')}): la 2.ª bolsa no está indicada y suma riesgo (${pg(16)}).`],
        ['Pedir ScvO₂ y no transfundir mientras la extracción sea &lt;50 %.', false, `Con coronariopatía la guía indica transfundir a Hb &lt;8 (${pg(8)}); la extracción del 50 % es un disparador propuesto (${pg(8)}), no anula el umbral: el miocardio seguiría anémico.`],
      ], ex: `Umbral 8 con cardiopatía isquémica o cirugía cardíaca/ortopédica; 7 en el resto del crítico estable (${pg(8)}).` },
    { fmt: 'Piensa y destapa',
      enun: 'Son las 4 h de la 2.ª bolsa de Carmen: disnea y SpO₂ 86 %. El adjunto, por teléfono: «¿TACO o TRALI, y qué haces ya?». Son cuatro cosas.',
      tapas: [
        [`Parar la transfusión si no acabó y avisar al banco de sangre: vale para los dos (${pg(14, 'p. 14-16')}).`],
        [`Hacia <b>TACO</b>: IC previa, sobrecarga de líquido o insuficiencia renal (${pg(16)}); hacia <b>TRALI</b>: PCR alta y ausencia de IC o de sobrecarga (${pg(14, 'p. 14-15')}). Los dos dan hipoxemia en 6 h y el TACO puede tener fiebre (30 %) (${pg(16)}).`],
        [`Si es TACO: diurético de asa i.v. (${pg(16)}). Si es TRALI: soporte como en el SDRA (${pg(14, 'p. 14-15')}).`],
        [`No pedir «otra bolsa más lenta»: el TACO no se relaciona con el número de unidades (${pg(15)}; del ritmo de infusión el libro no dice nada). Antes de futuras transfusiones, corregir el balance positivo con diuréticos (${pg(16)}).`],
      ] },
    { fmt: 'Encuentra el error',
      enun: 'Nota del R1 de la mañana. Hay 0, 1 o 2 errores: márcalos.',
      fr: [
        ['Carmen, 71 a, IC crónica. Hb 8,4 tras 1 CH, todavía baja: cuelgo otro CH para dejarla por encima de 9.', true, `Con Hb 8,4 en crítico estable sin isquemia no hay indicación: el umbral es 7 (${pg(8)}).`],
        ['(1) Cada CH sube la Hb ≈1 g/dL y el Hto ≈3 %.', false, `Cierto (${pg(10)}).`],
        ['(2) Lo paso en 2 h, sin diluir: la dilución no hace falta en el paciente estable.', false, `Cierto (${pg(10)}).`],
        ['(3) Con solo 2 unidades el riesgo de TACO es despreciable, porque depende del número de bolsas.', true, `El TACO no se relaciona con el número de unidades; ≈1 % y más con IC previa (${pg(15)}).`],
        ['(4) Si hace disnea, paro y pido Rx.', false, `Cierto: parar y valorar la Rx (${pg(16)}).`],
      ] },
];
let qi = 0;
const qCuerpo = $$('#q-cuerpo'), qRes = $$('#q-res'), qSig = $$('#q-sig');
function irPregunta(i) {
    qi = i; const q = Q[i];
    $$('#p5-prog').textContent = `Pantalla 5 de 6 · Pregunta ${i + 1} de 3`;
    $$('#q-fmt').textContent = q.fmt; $$('#q-enun').textContent = q.enun;
    qCuerpo.innerHTML = ''; qRes.innerHTML = ''; qSig.hidden = true; delete qRes.dataset.hecho; qCuerpo.onclick = null; qRes.onclick = null;
    qSig.textContent = i === 2 ? 'Ir a lo que te llevas →' : 'Siguiente pregunta →';
    window.scrollTo(0, 0);
    if (i === 0) pregTest(q); else if (i === 1) pregDestapa(q); else pregError(q);
}
function pregTest(q) {
    qCuerpo.innerHTML = '<p class="peq">Piensa antes qué harías. Cuando lo tengas, ves las opciones.</p><button class="btn suave" type="button" id="q-ya">Ya lo tengo: ver opciones</button>';
    $$('#q-ya').addEventListener('click', () => {
        qCuerpo.innerHTML = q.ops.map((o, k) => `<button class="btn" type="button" data-k="${k}"><b>${'ABCD'[k]}.</b> ${o[0]}</button>`).join('');
        qCuerpo.onclick = ev => {
            const b = ev.target.closest('button[data-k]'); if (!b || qRes.dataset.hecho) return;
            qRes.dataset.hecho = '1';
            q.ops.forEach((o, k) => {
                const bt = qCuerpo.querySelector(`[data-k="${k}"]`); bt.disabled = true;
                bt.classList.add(o[1] ? 'ok' : (+b.dataset.k === k ? 'mal' : 'x'));
            });
            qRes.innerHTML = q.ops.map((o, k) => `<div class="expl"><span class="${o[1] ? 'si' : 'no'}">${'ABCD'[k]} · ${o[1] ? 'Correcta' : (+b.dataset.k === k ? 'Elegiste esta' : 'Falsa')}</span>${o[2]}</div>`).join('') + `<div class="expl">${q.ex}</div>`;
            qSig.hidden = false;
        };
    });
}
function pregDestapa(q) {
    qCuerpo.innerHTML = '<p class="peq">Piensa tus cuatro cosas antes de destapar. Destapa de una en una.</p>' + q.tapas.map((t, k) => `<button class="btn suave" type="button" data-k="${k}">Destapar la ${k + 1}</button><div class="expl" data-r="${k}" hidden></div>`).join('');
    let n = 0;
    qCuerpo.onclick = ev => {
        const b = ev.target.closest('button[data-k]'); if (!b) return;
        const k = +b.dataset.k, r = qCuerpo.querySelector(`[data-r="${k}"]`);
        r.innerHTML = q.tapas[k][0]; r.hidden = false; b.hidden = true;
        if (++n === q.tapas.length) qSig.hidden = false;
    };
}
function pregError(q) {
    qCuerpo.innerHTML = q.fr.map((f, k) => `<button class="btn" type="button" data-k="${k}" aria-pressed="false">${f[0]}</button>`).join('') + '<button class="btn prim" type="button" id="q-comp">Comprobar</button>';
    qCuerpo.onclick = ev => {
        const b = ev.target.closest('button[data-k]'); if (!b || qRes.dataset.hecho) return;
        b.setAttribute('aria-pressed', String(b.getAttribute('aria-pressed') !== 'true'));
    };
    $$('#q-comp').addEventListener('click', () => {
        qRes.dataset.hecho = '1'; $$('#q-comp').hidden = true;
        qCuerpo.querySelectorAll('button[data-k]').forEach(b => { b.disabled = true; });
        qRes.innerHTML = q.fr.map((f, k) => {
            const marc = qCuerpo.querySelector(`[data-k="${k}"]`).getAttribute('aria-pressed') === 'true';
            const lbl = f[1] ? (marc ? '<span class="si">Error: lo marcaste</span>' : '<span class="no">Error: no lo marcaste</span>') : (marc ? '<span class="no">Está bien: no era un error</span>' : '<span class="si">Está bien</span>');
            const pedir = f[1] ? `<button class="btn suave" type="button" data-pensar="${k}">Ya pensé la frase buena: verla</button><div data-buena="${k}" hidden>${f[2]}</div>` : f[2];
            return `<div class="expl"><span class="peq">${f[0]}</span>${lbl}${pedir}</div>`;
        }).join('');
        qRes.onclick = ev => {
            const p = ev.target.closest('[data-pensar]'); if (!p) return;
            qRes.querySelector(`[data-buena="${p.dataset.pensar}"]`).hidden = false; p.hidden = true;
        };
        qSig.hidden = false;
    });
}
qSig.addEventListener('click', () => { if (qi < 2) irPregunta(qi + 1); else mostrar(6); });

// ---- Arranque
(async () => {
    await montarEscena();
    poner(CARMEN);
    mostrar(1);
    window.__B = { get pant() { return pant; }, get paso4() { return paso4; }, D: () => D };
})();

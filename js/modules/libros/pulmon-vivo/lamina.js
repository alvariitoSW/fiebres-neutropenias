// Lámina de entrada del pulmón vivo: tórax y vía aérea → alvéolo → membrana y capilar (2D, plegable).
// La monta index.js al arrancar. Sin animación en bucle: cada estado es fijo; con «reducir movimiento», sin transiciones.
// Fuentes: LA1 = El Libro Azul IV, parte 1 (pdf 5-7 = p. 389-391); M22 = Marino caps. 22-26, pdf 34 (Fig. 24.1).
import { instalarCss } from '../../../core/dibujo-iso.js';

const LA1 = 'docs/libro-azul-seccion-iv-respiratorio-parte1.pdf', M22 = 'docs/marino-2024-respiratory-management-caps22-26.pdf';
const FOTO = 'js/modules/neumologia/img/neumo-fig24-1-histologia-sdra.jpg';
const org = (t, ilu = false) => `<span class="org${ilu ? ' ilu' : ''}">${t}</span>`;
const pdf = (u, p, txt) => `<a href="${u}#page=${p}" target="_blank" rel="noopener">${txt}</a>`;
const IR = (tab, txt, resaltar = '') => `<button type="button" class="lam-ir" data-especialidad="neumologia" data-view="merinoNeumologia" data-panel="panel-merino-neumo-tabs" data-tab="${tab}"${resaltar ? ` data-resaltar="${resaltar}"` : ''}>${txt} →</button>`;

const NIVELES = [
    { n: 'Tórax y vía aérea', fr: `Con un Vt de 500 mL, <b>150 mL</b> se quedan en la vía que solo conduce (espacio muerto anatómico) y <b>350 mL</b> llegan al alvéolo. ${org('ficha · LA1 p. 389')} Los 150 mL son los de una persona de 68 kg. ${org('ficha · LA1 p. 389')}` },
    { n: 'Alvéolo', fr: `La vía acaba en conductos y sacos alveolares, que son los que intercambian gas. ${org('ficha · LA1 p. 389')} Abajo, la foto real: muchos espacios aéreos separados por tabiques finos que llevan los capilares. ${org('ficha · M22 Fig. 24.1')}` },
    { n: 'Membrana y capilar', fr: `El gas pasa por difusión pasiva a través de la membrana alveolocapilar: de dentro afuera, surfactante, epitelio alveolar, su membrana, intersticio, membrana basal capilar y endotelio. ${org('ficha · LA1 p. 390')} Cifra de la fuente: ~0,6 µm «de diámetro» (sic: es un grosor; ver la nota de fidelidad) y 50-100 m² en ambos pulmones. ${org('ficha · LA1 p. 390')}` },
];
const CAPAS = ['surfactante', 'epitelio alveolar', 'membrana del epitelio', 'espacio intersticial', 'membrana basal capilar', 'endotelio capilar'];
const OPCIONES = [
    { t: '9,0 L/min: 300 mL × 30, como si todo el Vt llegara al alvéolo.', ok: false, e: 'Ignora el espacio muerto: el monitor marcaría 9 L/min de ventilación minuto, pero 150 mL de cada soplo no intercambian gas y el paciente retendría CO₂ sin que la cifra lo avisara.' },
    { t: '4,5 L/min: (300 − 150) mL × 30; en cada soplo, 150 mL se quedan en la vía que conduce.', ok: true, e: 'Cada soplo de 300 mL deja 150 mL en la vía que conduce y solo 150 mL llegan al alvéolo; a 30 por minuto son 4 500 mL/min.' },
    { t: '10,5 L/min: 350 mL × 30, repitiendo el reparto del ejemplo de Vt 500 mL con el Vt de 300.', ok: false, e: 'El 350 vale para Vt 500; con Vt 300 llegan 150. Creerías que ventila 10,5 L/min cuando es menos de la mitad, y pasarías por alto la hipercapnia que viene detrás.' },
];
const PASOS = [
    { tit: 'El tórax', n: 1, f: '#pl-diaf', txt: 'Al inspirar baja el diafragma y los pulmones se llenan: pulsa «Inspirar» y mira cómo baja la cúpula. Aquí entra el Vt.' },
    { tit: 'La vía que conduce', n: 1, f: '#pl-barra', txt: 'De un Vt de 500 mL, 150 mL se quedan en la vía que solo conduce (en rojo) y 350 mL llegan al alvéolo. La barra de abajo lo reparte. Con Vt 300, los mismos 150 mL son la mitad del soplo.' },
    { tit: 'El alvéolo', n: 2, f: '#pl-foto', txt: 'La vía acaba en alvéolos. En la foto real, los espacios aéreos están separados por tabiques finos con los capilares: ahí se hace el intercambio.' },
    { tit: 'La membrana', n: 3, f: '#pl-memb', txt: 'El O₂ cruza la membrana hacia el hematíe y el CO₂ hace el camino inverso. Las capas no están a escala: la cifra de la fuente es ~0,6 µm (la fuente dice «de diámetro»: un grosor) sobre 50-100 m².' },
];

const CSS = `
#pul-lamina-entrada { margin: 0 0 8px; }
#pul-lamina-entrada .lam { display: grid; gap: 8px; padding: 4px 0 8px; }
#pul-lamina-entrada .lam-regla { display: flex; gap: 4px; align-items: center; }
#pul-lamina-entrada .lam-regla button { flex: 1; min-height: 44px; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-card); color: var(--text-dim); font: 600 .72rem/1.2 system-ui, sans-serif; cursor: pointer; padding: 2px 4px; }
#pul-lamina-entrada .lam-regla button[aria-pressed="true"] { border-color: var(--accent-yellow); color: var(--text-main); background: color-mix(in srgb, var(--accent-yellow) 16%, var(--bg-card)); }
#pul-lamina-entrada .lam-svg { width: 100%; height: auto; display: block; border-radius: 10px; border: 1px solid var(--border-color); }
#pul-lamina-entrada .tr { fill: none; stroke: var(--text-dim); stroke-width: 1.6; }
#pul-lamina-entrada .tr-f { fill: color-mix(in srgb, var(--text-main) 7%, var(--bg-main)); stroke: var(--text-dim); stroke-width: 1.4; }
#pul-lamina-entrada .aire { fill: var(--accent-yellow); }
#pul-lamina-entrada .t10 { font: 10px system-ui, sans-serif; fill: var(--text-dim); }
#pul-lamina-entrada .gran { font: 700 12px system-ui, sans-serif; fill: var(--text-main); }
#pul-lamina-entrada .rojo { fill: var(--accent-red); }
#pul-lamina-entrada .foco { stroke: var(--accent-yellow) !important; stroke-width: 3 !important; }
#pul-lamina-entrada img.foco { outline: 3px solid var(--accent-yellow); }
#pul-lamina-entrada .lam-foto { display: block; width: 100%; height: auto; border-radius: 8px; background: var(--text-main); }
#pul-lamina-entrada .lam-frase { font: .8rem/1.45 system-ui, sans-serif; color: var(--text-main); margin: 0; }
#pul-lamina-entrada .lam-frase .org { font: .66rem/1.25 system-ui, sans-serif; color: var(--text-muted); border: 1px solid var(--border-color); border-radius: 999px; padding: 0 6px; }
#pul-lamina-entrada .lam-b { min-height: 44px; min-width: 44px; border-radius: 10px; border: 1px solid var(--accent-yellow); background: transparent; color: var(--text-main); font: 700 .78rem system-ui, sans-serif; cursor: pointer; padding: 4px 12px; }
#pul-lamina-entrada .lam-b.prim { background: var(--accent-yellow); color: var(--bg-main); }
#pul-lamina-entrada .lam-b[aria-pressed="true"] { background: color-mix(in srgb, var(--accent-yellow) 22%, var(--bg-card)); }
#pul-lamina-entrada .lam-fila { display: flex; gap: 8px; flex-wrap: wrap; }
#pul-lamina-entrada .lam-q { border: 1px solid var(--border-color); border-radius: 12px; padding: 8px 10px; display: grid; gap: 6px; background: var(--bg-card); }
#pul-lamina-entrada .lam-q p { margin: 0; font: .84rem/1.45 system-ui, sans-serif; color: var(--text-main); }
#pul-lamina-entrada .lam-op { text-align: left; min-height: 44px; border-radius: 10px; border: 1px solid var(--border-color); background: var(--bg-main); color: var(--text-main); font: .8rem/1.4 system-ui, sans-serif; padding: 6px 10px; cursor: pointer; }
#pul-lamina-entrada .lam-op.bien { border-color: var(--accent-green); }
#pul-lamina-entrada .lam-op.mal { border-color: var(--accent-red); }
#pul-lamina-entrada .lam-exp { font: .78rem/1.45 system-ui, sans-serif; color: var(--text-dim); }
#pul-lamina-entrada .lam-guia { border: 1px solid var(--accent-yellow); border-radius: 12px; padding: 8px 10px; display: grid; gap: 6px; }
#pul-lamina-entrada .lam-guia p { margin: 0; font: .8rem/1.45 system-ui, sans-serif; color: var(--text-main); }
#pul-lamina-entrada .lam-ir { min-height: 44px; border-radius: 10px; border: 1px solid var(--border-color); background: transparent; color: var(--accent-yellow); font: 600 .72rem/1.2 system-ui, sans-serif; cursor: pointer; padding: 2px 8px; text-align: left; }
#pul-lamina-entrada .lam-fuentes { margin: 0; padding-left: 18px; font: .74rem/1.45 system-ui, sans-serif; color: var(--text-dim); display: grid; gap: 4px; }
#pul-lamina-entrada .lam-fuentes a { color: var(--accent-yellow); }
#pul-lamina-entrada .nota-plegable { font: .74rem/1.45 system-ui, sans-serif; color: var(--text-dim); }
#pul-lamina-entrada .nota-plegable summary { min-height: 44px; display: flex; align-items: center; cursor: pointer; }
@media (prefers-reduced-motion: no-preference) { #pul-lamina-entrada .mueve { transition: all .35s ease; } }
`;

const svgNivel1 = () => {
    const C = [[160, 8, 160, 50], [160, 50, 110, 90], [160, 50, 210, 90], [110, 90, 82, 124], [110, 90, 132, 124], [210, 90, 188, 124], [210, 90, 238, 124]];
    const fin = [[82, 124], [132, 124], [188, 124], [238, 124]];
    const arbol = C.map(([a, b, c, d]) => `M${a} ${b} L${c} ${d}`).join(' ') + ' ' + fin.map(([x, y]) => `M${x} ${y} L${x - 12} ${y + 26} M${x} ${y} L${x + 12} ${y + 26}`).join(' ');
    const hojas = fin.flatMap(([x, y]) => [[x - 12, y + 26], [x + 12, y + 26]]);
    return `<path class="tr-f" d="M96 22 Q62 34 64 96 L68 168 Q160 190 252 168 L256 96 Q258 34 224 22 Z"/>
 <ellipse id="pl-pi" class="tr-f mueve" cx="118" cy="98" rx="40" ry="54"/><ellipse id="pl-pd" class="tr-f mueve" cx="202" cy="98" rx="40" ry="54"/>
 <path d="${arbol}" fill="none" stroke="var(--accent-red)" stroke-opacity=".4" stroke-width="9" stroke-linecap="round"/><path class="tr" d="${arbol}" stroke-width="2"/>
 ${hojas.map(([x, y]) => `<circle cx="${x}" cy="${y + 6}" r="7" class="tr-f"/>`).join('')}
 <path id="pl-diaf" class="tr mueve" stroke-width="3.2" d="M68 168 Q160 168 252 168"/>
 <text x="4" y="40" class="t10 rojo">espacio</text><text x="4" y="52" class="t10 rojo">muerto</text><text x="316" y="150" class="t10" text-anchor="end">alvéolos</text>
 <path class="tr" stroke-width="1" d="M36 188 L72 171"/><text x="4" y="200" class="t10">diafragma</text>
 <text x="316" y="40" class="gran" text-anchor="end">150 + 350</text>
 <rect id="pl-barra" x="20" y="208" width="280" height="14" class="tr-f"/><rect x="20" y="208" width="84" height="14" class="rojo" fill-opacity=".45"/>
 <rect id="pl-aire1" class="aire mueve" x="20" y="208" width="0" height="14"/><rect id="pl-aire2" class="aire mueve" x="104" y="208" width="0" height="14"/>
 <text x="20" y="236" class="t10">150 mL de espacio muerto</text><text x="300" y="236" class="t10" text-anchor="end">350 mL al alvéolo</text>`;
};
const svgNivel2 = () => `<path class="tr" stroke-width="2.4" d="M160 6 V62 M160 62 L112 96 M160 62 L208 96"/>
 ${[[112, 112], [150, 124], [188, 118], [226, 112], [96, 150], [134, 164], [172, 160], [210, 164], [248, 150], [118, 196], [160, 202], [200, 196]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="19" class="tr-f"/>`).join('')}
 <text x="4" y="30" class="t10">conducto</text><text x="316" y="236" class="t10" text-anchor="end">racimo de alvéolos · esquema sin escala</text>`;
const svgNivel3 = () => {
    const y0 = 66, h = 14;
    return `<rect x="20" y="8" width="160" height="58" class="aire" fill-opacity=".25"/><text x="28" y="24" class="t10">aire del alvéolo</text>
 <g id="pl-memb">${CAPAS.map((c, i) => `<rect x="20" y="${y0 + i * h}" width="160" height="${h}" style="fill:color-mix(in srgb,var(--text-dim) ${60 - i * 7}%,transparent)" stroke="var(--bg-main)" stroke-width=".8"/><text x="186" y="${y0 + i * h + 10.5}" class="t10">${c}</text>`).join('')}</g>
 <rect x="20" y="${y0 + 6 * h}" width="160" height="62" style="fill:color-mix(in srgb,var(--accent-red) 14%,transparent)" stroke="var(--accent-red)" stroke-opacity=".5"/>
 <ellipse cx="100" cy="${y0 + 6 * h + 34}" rx="34" ry="16" style="fill:var(--accent-red)" fill-opacity=".55"/><text x="100" y="${y0 + 6 * h + 38}" text-anchor="middle" class="t10" style="fill:var(--text-main)">hematíe</text>
 ${[50, 100, 150].map((x) => `<path d="M${x} 34 V${y0 + 6 * h + 4} M${x - 5} ${y0 + 6 * h - 4} L${x} ${y0 + 6 * h + 4} L${x + 5} ${y0 + 6 * h - 4}" class="tr" style="stroke:var(--accent-yellow)"/>`).join('')}
 <text x="56" y="40" class="t10" style="fill:var(--accent-yellow)">O₂ →</text><text x="186" y="${y0 + 6 * h + 14}" class="t10" style="fill:var(--accent-green)">← CO₂ vuelve al alvéolo</text>
 <text x="186" y="${y0 + 6 * h + 32}" class="gran">~0,6 µm</text><text x="186" y="${y0 + 6 * h + 46}" class="t10">50-100 m² en ambos</text><text x="186" y="${y0 + 6 * h + 57}" class="t10">pulmones; capas sin</text><text x="186" y="${y0 + 6 * h + 68}" class="t10">escala</text>`;
};

export function montarLamina() {
    const host = document.getElementById('pul-lamina-entrada');
    if (!host || host.dataset.listo) return;
    host.dataset.listo = '1';
    instalarCss('pul-lamina', CSS);
    host.innerHTML = `<details class="plegable" id="pl-det"><summary>Entrada: del tórax al capilar, en tres niveles</summary><div class="lam">
 <div class="lam-regla" id="pl-regla" role="group" aria-label="Nivel de la lámina"></div>
 <svg id="pl-svg" class="lam-svg" viewBox="0 0 320 244" role="img" aria-label="Lámina en tres niveles: tórax y vía aérea, alvéolo, membrana y capilar">
  <rect width="320" height="244" style="fill:var(--bg-main)"/>
  <g id="pl-g1">${svgNivel1()}</g><g id="pl-g2" hidden>${svgNivel2()}</g><g id="pl-g3" hidden>${svgNivel3()}</g></svg>
 <img id="pl-foto" class="lam-foto" src="${FOTO}" alt="Fig. 24.1: pulmón normal, con abundantes espacios aéreos separados por tabiques finos con capilares, frente a un pulmón con SDRA" loading="lazy" hidden>
 <div class="lam-guia" id="pl-guia" hidden></div>
 <p class="lam-frase" id="pl-frase"></p>
 <div class="lam-fila"><button type="button" class="lam-b prim" id="pl-insp" aria-pressed="false">Inspirar</button><span id="pl-ir" hidden>${IR('neumo-sdra-diagnostico', 'Ver en la ficha: Fig. 24.1', '#nep-fig-24-1')}</span></div>
 <details class="nota-plegable"><summary>Nota de fidelidad: «0,6 µm de diámetro»</summary><p>La fuente escribe que la membrana mide «aproximadamente 0,6 μm de diámetro y una superficie de 50-100 m² en ambos pulmones». Un grosor de membrana no se mide en diámetro; se reproduce la cifra tal como la imprime el libro. ${org('ficha · LA1 p. 390')} El libro no da el tamaño ni el número de alvéolos y aquí tampoco se dibujan a escala.</p></details>
 <section class="lam-q" aria-label="Piensa antes"><p><b>Piensa antes.</b> Un paciente recibe Vt 300 mL a FR 30/min. Con los 150 mL de espacio muerto de la ficha, ¿cuánta ventilación alveolar tiene por minuto?</p>
  <button type="button" class="lam-b" id="pl-ver">Ya lo tengo: ver opciones</button><div id="pl-ops" hidden style="display:grid; gap:6px"></div>
  <p class="lam-exp" id="pl-exp" hidden></p></section>
 <div id="pl-guia-zona" hidden><button type="button" class="lam-b prim" id="pl-guia-b">Explícame el dibujo</button></div>
 <ul class="lam-fuentes" id="pl-fuentes"></ul></div></details>`;
    const $ = (id) => host.querySelector('#' + id);
    const S = { nivel: 1, insp: false };
    const regla = $('pl-regla');
    NIVELES.forEach((n, i) => { const b = document.createElement('button'); b.type = 'button'; b.dataset.k = i + 1; b.setAttribute('aria-pressed', 'false'); b.textContent = `${i + 1} · ${n.n}`; b.addEventListener('click', () => { S.nivel = i + 1; pintar(); }); regla.append(b); });
    const set = (id, a, v) => $(id).setAttribute(a, v);
    function pintar() {
        regla.querySelectorAll('button').forEach((b) => b.setAttribute('aria-pressed', String(+b.dataset.k === S.nivel)));
        [1, 2, 3].forEach((i) => $('pl-g' + i).toggleAttribute('hidden', i !== S.nivel));
        $('pl-foto').hidden = S.nivel !== 2;
        $('pl-frase').innerHTML = `<b>Nivel ${S.nivel} de 3 · ${NIVELES[S.nivel - 1].n}.</b> ${NIVELES[S.nivel - 1].fr}`;
        const g = S.insp ? 1 : 0;
        set('pl-diaf', 'd', `M68 168 Q160 ${168 + 20 * g} 252 168`);
        ['pl-pi', 'pl-pd'].forEach((id) => { set(id, 'ry', 54 + 12 * g); set(id, 'cy', 98 + 6 * g); });
        set('pl-aire1', 'width', 84 * g); set('pl-aire2', 'width', 196 * g);
        const bi = $('pl-insp'); bi.setAttribute('aria-pressed', String(S.insp)); bi.textContent = S.insp ? 'Espirar' : 'Inspirar'; bi.hidden = S.nivel !== 1; $('pl-ir').hidden = S.nivel !== 2;
    }
    $('pl-insp').addEventListener('click', () => { S.insp = !S.insp; pintar(); });

    // Piensa antes: las opciones salen al pulsar; la explicación y la guía, después de contestar
    const ops = $('pl-ops');
    OPCIONES.forEach((o) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'lam-op'; b.textContent = o.t; b.addEventListener('click', () => {
        if (ops.dataset.hecho) return; ops.dataset.hecho = '1';
        [...ops.children].forEach((x, i) => { x.classList.add(OPCIONES[i].ok ? 'bien' : 'mal'); x.setAttribute('aria-disabled', 'true'); });
        const e = $('pl-exp'); e.hidden = false;
        e.innerHTML = `<b>${o.ok ? 'Correcto.' : 'No.'}</b> ${o.e} ${org('ficha · LA1 p. 389')}<br>Cuenta: (300 − 150) × 30 = 4 500 mL/min, con el 150 de la ficha; el Vt y la FR del enunciado son ilustrativos ${org('ilustrativo', true)}. Con Vt 500 a la misma FR serían (500 − 150) × 30 = 10,5 L/min: la ventilación minuto baja de 15 a 9 L/min, pero la alveolar baja a menos de la mitad ${org('fisiología general', true)}.<br>` + OPCIONES.filter((x) => x !== o).map((x) => `<br><b>${x.ok ? 'La correcta' : 'Falsa'}:</b> ${x.t} ${x.e}`).join('');
        $('pl-guia-zona').hidden = false;
    }); ops.append(b); });
    $('pl-ver').addEventListener('click', () => { ops.hidden = false; $('pl-ver').hidden = true; });

    // Explicación guiada: cada paso señala el dibujo
    let paso = -1;
    const guia = $('pl-guia');
    const limpia = () => host.querySelectorAll('.foco').forEach((e) => e.classList.remove('foco'));
    function verPaso() {
        limpia(); if (paso < 0) { guia.hidden = true; return; }
        const p = PASOS[paso]; S.nivel = p.n; if (paso === 0) S.insp = true; pintar();
        const t = host.querySelector(p.f); if (t) { t.classList.add('foco'); }
        guia.hidden = false;
        guia.innerHTML = `<b class="t">Paso ${paso + 1} de ${PASOS.length} · ${p.tit}</b><p>${p.txt}</p><div class="lam-fila"><button type="button" class="lam-b" data-d="-1" ${paso ? '' : 'disabled'}>← Anterior</button><button type="button" class="lam-b prim" data-d="1">${paso === PASOS.length - 1 ? 'Terminar' : 'Siguiente →'}</button></div>`;
    }
    guia.addEventListener('click', (ev) => { const b = ev.target.closest('button[data-d]'); if (!b) return; paso += +b.dataset.d; if (paso >= PASOS.length) paso = -1; verPaso(); });
    $('pl-guia-b').addEventListener('click', () => { paso = 0; verPaso(); host.querySelector('#pl-svg').scrollIntoView({ block: 'center' }); });

    $('pl-fuentes').innerHTML = [
        `Vt 500 mL = 150 mL de espacio muerto anatómico + 350 mL al alvéolo (persona de 68 kg) ${org('ficha')} ${pdf(LA1, 5, 'Libro Azul, pág. 5 (impresa 389)')}`,
        `Membrana alveolocapilar, sus capas, ~0,6 µm «de diámetro» (ver la nota de fidelidad) y 50-100 m² ${org('ficha')} ${pdf(LA1, 6, 'Libro Azul, pág. 6 (impresa 390)')}; neumocitos y surfactante: ${pdf(LA1, 7, 'pág. 7 (impresa 391)')}`,
        `Fig. 24.1, pulmón normal frente a SDRA ${org('ficha')} ${pdf(M22, 34, 'Marino, pág. 34')}`,
        `Dibujos esquemáticos, sin escala ${org('ilustrativo', true)}`,
    ].map((x) => `<li>${x}</li>`).join('');
    pintar();
}

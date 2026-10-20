// «La cama 7»: la cama compartida de las tres escenas del bloque 1 de Marino (caps. 4-6). Andrés, 62 años, intubado,
// con tres ventanas: la cabeza (La inmersión: dolor y sedación), el vientre (La muralla de papel: intestino, estómago
// y boca) y la pierna (El telar de la trombina: tromboprofilaxis). Viene del bloque común «CAMA 7» de las maquetas
// aprobadas (autonomo/maquetas/b1-muralla.html, b1-telar.html y b1-inmersion.html; dibujo de la muralla).
//
// ─────────────────────────────── API para las tres escenas ───────────────────────────────
//   import { montarCama7 } from './cama7.js';
//   const cama = montarCama7(contenedor, 'muralla' | 'telar' | 'inmersion');
//     - contenedor: un <div> vacío dentro de la vista de la escena, encima de su lámina.
//     - La ventana de la escena se enciende (borde dorado); tocarla hace el zoom de entrada.
//     - Las otras dos ventanas son ENLACES CRUZADOS de verdad: <button data-especialidad="libros" data-view="…"
//       data-…-viva=""> (ver ESCENAS abajo). Los resuelve el listener delegado de home/index.js con `modelosVivos`
//       de libros/index.js: ningún listener nuevo. Si la vista de destino aún no existe en index.html, la ventana sale
//       apagada («pronto»). El monitor y la bolsa de suero también son enlaces (capilar y oxígeno; río y mar).
//   cama.mostrar({ intro })   llamar cuando la vista aparece. intro: true (desde el menú) = cama grande y, a los
//                             1,5 s, zoom de entrada hacia la ventana; intro: false (desde una ficha, en un estado) =
//                             compacta enseguida. Con «reducir movimiento», siempre compacta y sin zoom.
//   cama.entrar()             zoom de entrada (Motion, cargado con cargarMotion()); al acabar, compacta.
//   cama.compactar()          tira de 48 px: «Cama 7 · Andrés, 62 años · toca para ver sus tres ventanas».
//   cama.ampliar()            vuelve la cama grande, con las ventanas tocables.
//   cama.parar()              cancela el zoom pendiente (llamarlo al cambiar de modo o al salir de la vista).
//   Eventos (suben por el DOM desde el contenedor; escúchalos en el contenedor o en la raíz de la escena):
//     'c7-entrada'                      al terminar el zoom de entrada (o al tocar la ventana propia ya compacta).
//     'c7-aparato' (detail: 'respirador')  al tocar el respirador: cada escena dice qué orden de su hoja lo representa.
//   Ocultarla en Conceptos y Mayéutica: contenedor.hidden = true (lo hace cada escena en su setModo).
//   Ids: todos llevan el prefijo c7-<escena>- (las tres vistas están en el DOM a la vez).
// ───────────────────────────────────────────────────────────────────────────────────────────
import { cargarMotion, sinMovimiento } from '../../core/motion.js';

const PACIENTE = 'Andrés, 62 años';
// view: clave de la vista en librosLevel (libros/index.js); atributo: el data-… del enlace cruzado (modelosVivos);
// vista: id del contenedor de la vista en index.html; origen: hacia dónde va el zoom (centro de la ventana, en %).
export const ESCENAS = {
    inmersion: { nombre: 'La inmersión', tema: 'dolor y sedación', sitio: 'la cabeza', view: 'inmersionViva', atributo: 'inmersion-viva', vista: 'inmersion-viva-view', origen: '17.2% 44%', caja: [37, 41, 50, 50] },
    muralla: { nombre: 'La muralla de papel', tema: 'intestino, estómago y boca', sitio: 'el vientre', view: 'murallaViva', atributo: 'muralla-viva', vista: 'muralla-viva-view', origen: '46.7% 42.7%', caja: [139, 35, 58, 58] },
    telar: { nombre: 'El telar de la trombina', tema: 'tromboprofilaxis', sitio: 'la pierna', view: 'telarVivo', atributo: 'telar-vivo', vista: 'telar-vivo-view', origen: '74.4% 48%', caja: [243, 47, 50, 50] },
};
// Aparatos de la cama que llevan a otro modelo vivo de Libros (enlace cruzado) o avisan a la escena (evento).
const APARATOS = [
    { k: 'respirador', caja: [0, 20, 30, 46], nombre: 'El respirador' },
    { k: 'monitor', caja: [30, 0, 46, 40], nombre: 'El monitor: capilar y oxígeno', view: 'capilarVivo', atributo: 'capilar-vivo', vista: 'capilar-vivo-view' },
    { k: 'bolsa', caja: [98, 0, 40, 40], nombre: 'La bolsa de suero: río y mar', view: 'aguaViva', atributo: 'agua-viva', vista: 'agua-viva-view' },
];
const pct = (v, total) => `${+(v / total * 100).toFixed(2)}%`;
const posicion = ([x, y, w, h]) => `left:${pct(x, 360)};top:${pct(y, 150)};width:${pct(w, 360)};height:${pct(h, 150)}`;

// El dibujo (grabado crema y oro), con los ids de sus patrones prefijados por escena.
function dibujo(p) {
    const ventana = (v, cx, cy, r, arte, lblY, lbl) => `
        <g class="c7-v" data-v="${v}">
          <circle cx="${cx}" cy="${cy}" r="${r}" style="fill:var(--bg-main)"/>
          <g class="c7-arte" clip-path="url(#${p}cv-${v})">${arte}</g>
          <circle class="c7-off" cx="${cx}" cy="${cy}" r="${r}" style="fill:none;stroke:var(--text-muted)" stroke-dasharray="3 3"/>
          <g class="c7-on"><circle cx="${cx}" cy="${cy}" r="${r}" style="fill:none;stroke:var(--accent-blue)" stroke-width="3"/><circle cx="${cx}" cy="${cy}" r="${r - 3}" style="fill:none;stroke:var(--accent-blue)" stroke-width=".7"/></g>
          <text class="c7-lbl" x="${cx}" y="${lblY}" text-anchor="middle">${lbl}<tspan class="c7-off"> →</tspan></text>
        </g>`;
    const celula = x => `<rect x="${x}" y="62" width="5.6" height="10" style="fill:var(--text-main);stroke:var(--accent-yellow)" fill-opacity=".15" stroke-width=".5"/>`;
    const bacilo = (x, y, g) => `<path transform="translate(${x} ${y}) rotate(${g})" d="M-1.67 -1.12H1.67A1.12 1.12 0 0 1 1.67 1.12H-1.67A1.12 1.12 0 0 1 -1.67 -1.12Z"/>`;
    return `<svg class="c7-svg" viewBox="0 0 360 150" role="img" aria-label="La cama 7: ${PACIENTE}, intubado, con tres ventanas: la cabeza, el vientre y la pierna">
      <defs>
        <pattern id="${p}rayado" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="5" style="stroke:var(--accent-yellow)" stroke-opacity=".3" stroke-width=".8"/></pattern>
        <pattern id="${p}rayado-fino" width="3" height="3" patternUnits="userSpaceOnUse" patternTransform="rotate(-35)"><line x1="0" y1="0" x2="0" y2="3" style="stroke:var(--accent-yellow)" stroke-opacity=".22" stroke-width=".6"/></pattern>
        <pattern id="${p}cruzado" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M0 0L7 7M7 0L0 7" style="stroke:var(--text-muted)" stroke-opacity=".2" stroke-width=".6"/></pattern>
        <pattern id="${p}punteado" width="7" height="6" patternUnits="userSpaceOnUse"><circle cx="1.6" cy="1.5" r=".7" style="fill:var(--text-dim)" fill-opacity=".3"/><circle cx="5.1" cy="4.4" r=".55" style="fill:var(--text-dim)" fill-opacity=".24"/></pattern>
        <pattern id="${p}sabana" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(-20)"><line x1="0" y1="0" x2="0" y2="6" style="stroke:var(--text-dim)" stroke-opacity=".28" stroke-width=".7"/></pattern>
        <clipPath id="${p}cv-inmersion"><circle cx="62" cy="66" r="14"/></clipPath>
        <clipPath id="${p}cv-muralla"><circle cx="168" cy="64" r="18"/></clipPath>
        <clipPath id="${p}cv-telar"><circle cx="268" cy="72" r="14"/></clipPath>
      </defs>
      <rect width="360" height="150" style="fill:var(--bg-main)"/>
      <line x1="0" y1="141" x2="360" y2="141" style="stroke:var(--accent-yellow)" stroke-opacity=".35"/>
      <g class="c7-aparato" opacity=".55"><rect x="2" y="30" width="20" height="30" rx="3" style="fill:var(--bg-card);stroke:var(--text-muted)"/><rect x="2" y="30" width="20" height="30" rx="3" fill="url(#${p}cruzado)"/><line x1="12" y1="60" x2="12" y2="140" style="stroke:var(--text-muted)"/><text x="2" y="26" style="font:italic 7px Georgia, serif;fill:var(--text-muted)">respirador</text></g>
      <g class="c7-aparato" opacity=".55"><rect x="36" y="6" width="34" height="22" rx="3" style="fill:var(--bg-card);stroke:var(--text-muted)"/><path d="M39 20 L46 20 L48 13 L51 24 L53 18 L67 18" style="fill:none;stroke:var(--accent-green)" stroke-width="1"/></g>
      <g class="c7-aparato" opacity=".55"><line x1="118" y1="8" x2="118" y2="84" style="stroke:var(--text-muted)"/><path d="M109 10 h18 v18 q-9 7 -18 0Z" style="fill:var(--bg-card);stroke:var(--text-muted)"/><path d="M109 10 h18 v18 q-9 7 -18 0Z" fill="url(#${p}rayado-fino)"/><path d="M118 31 C118 50 100 58 86 66" style="fill:none;stroke:var(--text-muted)" stroke-dasharray="2 2"/></g>
      <path d="M22 118 V56 Q22 48 30 48 Q36 48 36 56 V118Z" style="fill:var(--bg-card);stroke:var(--accent-yellow)" stroke-opacity=".7"/><path d="M22 118 V56 Q22 48 30 48 Q36 48 36 56 V118Z" fill="url(#${p}rayado)"/>
      <path d="M326 118 V70 Q326 62 333 62 Q340 62 340 70 V118Z" style="fill:var(--bg-card);stroke:var(--accent-yellow)" stroke-opacity=".7"/><path d="M326 118 V70 Q326 62 333 62 Q340 62 340 70 V118Z" fill="url(#${p}rayado)"/>
      <rect x="327" y="80" width="12" height="16" rx="2" style="fill:var(--bg-main);stroke:var(--accent-yellow)"/><text x="333" y="92" text-anchor="middle" style="font:700 10px Georgia, serif;fill:var(--accent-yellow)">7</text>
      <rect x="36" y="96" width="290" height="8" style="fill:var(--bg-card);stroke:var(--accent-yellow)" stroke-opacity=".6"/>
      <rect x="36" y="84" width="290" height="12" rx="4" style="fill:var(--text-main)" fill-opacity=".1"/><rect x="36" y="84" width="290" height="12" rx="4" fill="url(#${p}rayado-fino)"/>
      <line x1="52" y1="104" x2="52" y2="128" style="stroke:var(--accent-yellow)" stroke-opacity=".6"/><circle cx="52" cy="133" r="7" style="fill:none;stroke:var(--accent-yellow)" stroke-opacity=".6"/>
      <line x1="310" y1="104" x2="310" y2="128" style="stroke:var(--accent-yellow)" stroke-opacity=".6"/><circle cx="310" cy="133" r="7" style="fill:none;stroke:var(--accent-yellow)" stroke-opacity=".6"/>
      <ellipse cx="66" cy="80" rx="24" ry="7" style="fill:var(--text-main)" fill-opacity=".12"/>
      <circle cx="66" cy="66" r="12.5" style="fill:var(--bg-card);stroke:var(--text-dim)"/><path d="M76 60 q4 -2 5 2" style="fill:none;stroke:var(--text-dim)"/>
      <path d="M78 64 C70 40 40 34 22 44" style="fill:none;stroke:var(--accent-yellow)" stroke-width="2" stroke-opacity=".75"/>
      <path d="M80 74 C95 58 120 54 140 56 C160 58 178 54 196 62 C214 70 250 68 290 70 C300 64 310 58 316 66 C320 72 322 80 322 84 L82 84Z" style="fill:var(--bg-card);stroke:var(--text-dim)"/>
      <path d="M80 74 C95 58 120 54 140 56 C160 58 178 54 196 62 C214 70 250 68 290 70 C300 64 310 58 316 66 C320 72 322 80 322 84 L82 84Z" fill="url(#${p}sabana)"/>
      <path d="M130 62 C140 72 150 74 160 70 M220 70 C230 76 250 77 262 74" style="fill:none;stroke:var(--text-dim)" stroke-opacity=".5"/>
      <path d="M84 66 l6 -3" style="stroke:var(--accent-red)" stroke-width="2"/>
      ${ventana('inmersion', 62, 66, 15, `<rect x="47" y="62" width="30" height="20" style="fill:var(--accent-blue)" fill-opacity=".14"/>
          <path d="M46 62 q4 -3 8 0 t8 0 t8 0 t8 0 M46 69 q4 -3 8 0 t8 0 t8 0 t8 0 M46 76 q4 -3 8 0 t8 0 t8 0 t8 0" style="fill:none;stroke:var(--accent-blue)" stroke-width=".9" stroke-opacity=".8"/>
          <circle cx="62" cy="58" r="2.4" style="fill:var(--text-main)" fill-opacity=".7"/><path d="M62 61 V74" style="stroke:var(--text-main)" stroke-opacity=".5" stroke-dasharray="1.5 1.5"/>`, 35, 'La inmersión')}
      ${ventana('muralla', 168, 64, 19, `<rect x="149" y="45" width="38" height="15" style="fill:var(--accent-purple)" fill-opacity=".08"/>
          ${[150.6, 157.2, 163.8, 170.4, 177, 183.6].map(celula).join('')}
          <g style="fill:var(--accent-purple)">${bacilo(159, 55, -60)}${bacilo(166, 52, 10)}${bacilo(174, 56, 40)}${bacilo(178, 52, -20)}${bacilo(156, 60, 80)}</g>
          <rect x="149" y="73" width="38" height="12" fill="url(#${p}punteado)"/>`, 40, 'La muralla de papel')}
      ${ventana('telar', 268, 72, 15, `<rect x="253" y="65" width="30" height="14" style="fill:var(--accent-purple)" fill-opacity=".18"/>
          <path d="M253 65 H283 M253 79 H283" style="stroke:var(--accent-purple)" stroke-width=".8"/>
          <path d="M256 66 L278 78 M260 78 L282 66 M254 72 L284 72 M266 65 L272 79" style="fill:none;stroke:var(--text-dim)" stroke-width=".7" stroke-opacity=".9"/>
          <ellipse cx="262" cy="71" rx="2.6" ry="1.9" style="fill:var(--accent-red)"/><ellipse cx="275" cy="74" rx="2.6" ry="1.9" style="fill:var(--accent-red)"/>`, 53, 'El telar')}
    </svg>`;
}

// El botón de una ventana o de un aparato: enlace cruzado si su vista existe; si no, apagado.
function botonDestino(d, etiqueta, v = '') {
    const existe = !!document.getElementById(d.vista), marca = v ? ` data-c7-v="${v}"` : '';
    if (!existe) return `<button type="button" class="c7-boton c7-pronto" style="${posicion(d.caja)}"${marca} disabled aria-label="${etiqueta} (pronto)"></button>`;
    return `<button type="button" class="c7-boton" style="${posicion(d.caja)}"${marca} data-especialidad="libros" data-view="${d.view}" data-${d.atributo}="" aria-label="${etiqueta}"></button>`;
}

export function montarCama7(contenedor, escena) {
    const aqui = ESCENAS[escena];
    if (!contenedor || !aqui) return null;
    const p = `c7-${escena}-`;
    let botones = '';
    for (const [k, d] of Object.entries(ESCENAS)) {
        const etiqueta = `${d.sitio[0].toUpperCase()}${d.sitio.slice(1)}: ${d.nombre} (${d.tema})`;
        botones += k === escena
            ? `<button type="button" class="c7-boton c7-propia" style="${posicion(d.caja)}" data-c7-v="${k}" data-c7-entrar aria-label="${etiqueta}: entrar"></button>`
            : botonDestino(d, etiqueta, k);
    }
    for (const a of APARATOS) {
        botones += a.view ? botonDestino(a, a.nombre)
            : `<button type="button" class="c7-boton c7-aparato-b" style="${posicion(a.caja)}" data-c7-aparato="${a.k}" aria-label="${a.nombre}"></button>`;
    }
    contenedor.classList.add('c7-cama', 'c7-grande');
    contenedor.dataset.escena = escena;
    contenedor.innerHTML = `${dibujo(p)}<div class="c7-botones">${botones}</div>
        <button type="button" class="c7-tapa" aria-label="Ver las tres ventanas de la cama 7"></button>
        <p class="c7-pie"></p>`;
    // Las ventanas apagadas («pronto») no llevan flecha ni brillo
    contenedor.querySelectorAll('.c7-pronto[data-c7-v]').forEach(b => contenedor.querySelector(`.c7-v[data-v="${b.dataset.c7V}"]`)?.classList.add('c7-v-pronto'));
    const svg = contenedor.querySelector('.c7-svg'), pie = contenedor.querySelector('.c7-pie');
    let espera = null, anim = null;
    const avisar = (tipo, detalle) => contenedor.dispatchEvent(new CustomEvent(tipo, { bubbles: true, detail: detalle }));
    const parar = () => { clearTimeout(espera); espera = null; };
    function compactar() {
        parar();
        contenedor.classList.remove('c7-grande'); contenedor.classList.add('c7-compacta');
        pie.innerHTML = `<b>Cama 7 · ${PACIENTE}</b><br>Toca para ver sus tres ventanas`;
    }
    function ampliar() {
        contenedor.classList.remove('c7-compacta'); contenedor.classList.add('c7-grande');
        pie.textContent = `${PACIENTE} · toca ${aqui.sitio} para entrar`;
    }
    function entrar() {
        parar();
        if (contenedor.classList.contains('c7-compacta')) { avisar('c7-entrada'); return; }
        const fin = () => { svg.style.transform = ''; svg.style.opacity = ''; anim = null; compactar(); avisar('c7-entrada'); };
        if (sinMovimiento()) { fin(); return; }
        cargarMotion().then(M => {
            svg.style.transformOrigin = aqui.origen;
            anim = M.animate(svg, { transform: ['scale(1)', 'scale(3.6)'], opacity: [1, 0] }, { duration: 0.7, ease: 'easeIn' });
            return anim.finished;
        }).then(fin, fin);
    }
    function mostrar({ intro = true } = {}) {
        parar(); anim?.stop?.(); anim = null; svg.style.transform = ''; svg.style.opacity = '';
        if (!intro || sinMovimiento()) { compactar(); return; }
        ampliar();
        espera = setTimeout(entrar, 1500);
    }
    contenedor.addEventListener('click', ev => {
        if (ev.target.closest('.c7-tapa')) { ampliar(); return; }
        if (ev.target.closest('[data-c7-entrar]')) { entrar(); return; }
        const a = ev.target.closest('[data-c7-aparato]');
        if (a) avisar('c7-aparato', a.dataset.c7Aparato);
        if (ev.target.closest('[data-especialidad]')) parar();
    });
    compactar();
    return { entrar, compactar, ampliar, mostrar, parar, raiz: contenedor };
}

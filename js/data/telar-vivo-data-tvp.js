/* El estado «TVP: eco de compresión» del telar vivo (Marino cap. 22, p. 4: ecografía venosa de la pierna).
   Datos puros, sin DOM. telar-vivo-data.js los registra en ESTADOS y GUIAS; el dibujo y los mandos, en
   js/modules/libros/telar-vivo-tvp.js. Cada cifra, con su página; la presión de la sonda es ilustrativa (el libro no da fuerza). */
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

export const PDF_22 = 'docs/marino-2024-respiratory-management-caps22-26.pdf';
export const PDF_1 = 'docs/marino-2024-acceso-vascular-practicas-caps1-4.pdf';
const EV = (id, pag = 4) => ({ libro: 'Marino, cap. 22', ficha: 'neumo-ep-diagnostico', id, pag, pdf: PDF_22 });
const COMP = { libro: 'Marino, cap. 1', ficha: 'mar-eco-intraosea', id: 'mar-compresibilidad', pag: 16, pdf: PDF_1 };

// Cifras del libro (cap. 22, p. 4)
export const TVP = {
    dupl: { sens: 95, esp: 97, vpp: 97, vpn: 98 },      // dúplex para TVP proximal de la pierna: S ≥95 %, E ≥97 %, VPP 97 %, VPN 98 %
    tvpEnEP: [30, 50],                                  // % de las EP agudas con TVP proximal en la eco
    brazo: { epSintomatica: 10, sens: 97, esp: 96 },    // TVP del brazo con catéter: EP sintomática <10 %; eco S 97 %, E 96 %
    sondaAviso: 70,                                     // % de la sonda a partir del cual avisa (ilustrativo)
    sondaTope: 100,                                     // % máximo de la sonda (ilustrativo: el libro no da fuerza)
    colapsoSana: 60,                                    // % de sonda con el que la vena sana ya está aplastada (ilustrativo)
};

// Lo que se ve, derivado de la hoja de órdenes (e.tvp, e.sonda 0-100, e.doppler, e.brazo)
export function derivarEco(e) {
    const sonda = clamp(Math.round(+e.sonda || 0), 0, TVP.sondaTope), tvp = !!e.tvp;
    const colapso = tvp ? 0 : clamp(sonda / TVP.colapsoSana, 0, 1);
    return { sonda, tvp, brazo: !!e.brazo, doppler: !!e.doppler, colapso, venaColapsa: colapso >= 1, arteriaColapsa: false,
        flujoArteria: e.doppler ? 'pulsátil' : null, flujoVena: e.doppler ? (tvp ? 'lento o ausente' : 'presente') : null,
        aviso: tvp && sonda >= TVP.sondaAviso && sonda < TVP.sondaTope, sello: tvp && sonda >= TVP.sondaTope };
}

export const ESTADO_TVP = { nombre: 'TVP: eco de compresión', clave: 'eco', e: { vista: 'eco', tvp: true, sonda: 0 },
    cifra: d => d.eco.tvp && !d.eco.venaColapsa && !d.eco.arteriaColapsa && !d.eco.sello
        && derivarEco({ tvp: true, sonda: 100 }).sello && !derivarEco({ tvp: true, sonda: 100 }).venaColapsa
        && derivarEco({ tvp: false, sonda: 100 }).venaColapsa && !derivarEco({ tvp: false, sonda: 100 }).arteriaColapsa };

export const GUIA_TVP = [
    { t: 'La mayoría de los émbolos nacen de una <span class="hl">TVP del muslo o la ingle</span>: la sospecha de EP puede empezar por la eco de las venas proximales de la pierna, sin viajar a radiología. Aquí, el corte transversal de la femoral con su arteria al lado.',
        e: { tvp: false, sonda: 0 }, resalta: '#tel-eco-vena', cita: EV('nep-eco-venosa') },
    { t: 'Se aprieta con la sonda. La vena normal <span class="hl-verde">se colapsa y la luz desaparece</span>; la arteria sigue redonda, porque no se comprime (cap. 1, p. 16); su pared gruesa es fisiología general.',
        e: { tvp: false, sonda: 100 }, resalta: ['#tel-eco-vena', '#tel-eco-arteria'], cita: [EV('nep-eco-venosa'), COMP], org: 'presión de la sonda: ilustrativo' },
    { t: 'Con trombo la vena <span class="hl-rojo">no se comprime</span>, ni apretando al máximo: una vena incompresible es evidencia de trombosis venosa.',
        e: { tvp: true, sonda: 100 }, resalta: '#tel-eco-vena', cita: EV('nep-eco-venosa'), org: 'presión de la sonda: ilustrativo' },
    { t: 'El <span class="hl-azul">Doppler color</span> lo completa: flujo <span class="hl-rojo">lento o ausente</span> en la vena incompresible. Compresión más Doppler es el dúplex: sensibilidad ≥95 %, especificidad ≥97 %, VPP 97 % y VPN 98 %.',
        e: { tvp: true, sonda: 100, doppler: true }, resalta: ['#tel-eco-vena', '#tel-tablero .tel-celda:nth-child(3)'], cita: EV('nep-eco-venosa') },
    { t: 'Si hay TVP (la tienen el <span class="hl">30-50 %</span> de las EP), no hacen falta más pruebas salvo inestabilidad y se anticoagula como la EP. Si la eco no ve nada, hace falta otra prueba.',
        e: { tvp: true, sonda: 100, doppler: true }, resalta: '#tel-tablero .tel-celda:nth-child(3)', cita: EV('nep-eco-venosa') },
];

const A = '<span class="hl-rojo">', Z = '</span>';
export const FRASE_ECO = {
    entrada: () => ['Corte transversal de la femoral: la vena y, al lado, la arteria. Aprieta con la sonda y mira cuál se aplasta. Una vena llena de trombo <span class="hl-rojo">no se comprime</span>.', 'nep-eco-venosa (p. 4)'],
    cambio: (v, n) => {
        const ev = derivarEco(v), en = derivarEco(n);
        if (!!n.brazo !== !!v.brazo) return n.brazo
            ? ['Brazo con catéter central: la TVP de subclavia o axilar da EP sintomática en <span class="hl">menos del 10 %</span>, pero se mira el edema del brazo. La eco acierta (S 97 %, E 96 %).', 'nep-tvp-brazo (p. 4)']
            : ['La femoral: la TVP proximal de la pierna es la fuente de la mayoría de las EP.', 'nep-eco-venosa (p. 4)'];
        if (!!n.doppler !== !!v.doppler) return n.doppler
            ? ['Doppler color: la arteria muestra flujo pulsátil (fisiología general); en la vena, ' + (en.tvp ? A + 'flujo lento o ausente' + Z + ' (' + A + 'trombosis' + Z + ')' : 'flujo presente con la sonda suelta') + '. Compresión más Doppler es el dúplex.', 'nep-eco-venosa (p. 4)']
            : ['Sin Doppler: solo la imagen en grises y la compresión.', 'nep-eco-venosa (p. 4)'];
        if (!!n.tvp !== !!v.tvp) return n.tvp
            ? ['Vena con trombo: ocupa la luz. Aprieta y comprueba que ' + A + 'no se aplasta' + Z + '.', 'nep-eco-venosa (p. 4)']
            : ['Vena sana: al apretar se colapsa y la luz desaparece.', 'nep-eco-venosa (p. 4)'];
        if (en.sello) return [(n.brazo ? 'Positiva en el brazo: ' : 'Incompresible: ') + A + (n.brazo ? 'anticoagular y retirar el catéter' : 'TVP') + Z + '. ' + (n.brazo ? '' : 'Estable: sin más pruebas; se anticoagula como la EP.'), 'nep-eco-venosa · nep-tvp-brazo (p. 4)'];
        if (en.aviso) return ['Apretando fuerte y la vena sigue abierta: ' + A + 'no se comprime' + Z + '. El libro no da la fuerza de la sonda: es ilustrativa.', 'nep-eco-venosa (p. 4) · ilustrativo'];
        if (en.venaColapsa && !ev.venaColapsa) return ['La vena sana se aplasta del todo y la arteria no: así se distingue la vena de la arteria.', 'nep-eco-venosa (p. 4)'];
        return ['Presión de la sonda ' + en.sonda + ' %' + (en.tvp ? ': la vena con trombo sigue igual.' : ': la vena sana ' + (en.venaColapsa ? 'está aplastada.' : 'se va cerrando.')), 'ilustrativo'];
    },
};

// El tablero de la vista (tres celdas) y el sello
export function celdasEco(e) {
    const d = derivarEco(e);
    return [
        ['Vena', 'eco-vena', d.tvp ? 'no se aplasta' : d.venaColapsa ? 'se aplasta' : 'se cierra', d.tvp ? 'nep-eco-venosa (p. 4)' : 'nep-eco-venosa (p. 4)', d.tvp && d.sonda >= TVP.sondaAviso ? 'alarma' : d.venaColapsa ? 'bien' : ''],
        ['Presión de la sonda', 'eco-sonda', d.sonda + ' %', 'ilustrativo'],
        d.brazo ? ['EP sintomática (brazo)', 'eco-ep', '<10 %', 'nep-tvp-brazo (p. 4)'] : ['Dúplex S · E', 'eco-dupl', `≥${TVP.dupl.sens}\u00a0% · ≥${TVP.dupl.esp}\u00a0%`, 'nep-eco-venosa (p. 4)'],
    ];
}
export const SELLO_TVP = e => {
    const d = derivarEco(e);
    if (d.sello) return d.brazo
        ? { titulo: 'Anticoagular y retirar el catéter', texto: 'TVP de subclavia o axilar: anticoagular y retirar el catéter responsable.', origen: 'ficha · p. 4' }
        : { titulo: 'No compresible = TVP', texto: 'La vena no cede: hay trombo. Estable: sin más pruebas; se anticoagula como la EP.', origen: 'ficha · p. 4' };
    if (d.aviso) return { nivel: 'aviso', titulo: 'Sigue abierta', texto: 'Apretando casi al máximo, la vena con trombo no cede. La fuerza de la sonda es ilustrativa.', origen: 'ilustrativo' };
    return null;
};

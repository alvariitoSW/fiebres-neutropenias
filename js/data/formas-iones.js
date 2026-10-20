// Tabla única de formas de iones y moléculas: la misma forma para la misma
// especie en todos los modelos vivos (nefrona viva, glomérulo, filtro de la
// TRR, nefronas que quedan, escenas del potasio y río y mar). Aprobada por el usuario el
// 19/10/2026 sobre la lámina autonomo/maquetas/formas-iones.html.
//
// Datos puros, sin DOM. Los dibuja js/core/particulas.js (lienzo y SVG) y
// monta con ellos la leyenda. La forma dice qué es; el color ayuda, pero
// nunca decide solo (CLAUDE §5). Solo tokens de css/variables.css.
//
// Cada especie: nombre (leyenda), forma, color (token) y, si hace falta, la
// variante ya va en la forma (rombo con 1 o 2 halos, triángulo hueco, óvalo
// hueco). `reserva`: forma guardada que hoy no dibuja ningún modelo.

export const FORMAS_IONES = {
    // Agua y sal
    agua: { nombre: 'Agua', forma: 'gota', color: '--text-main' },
    dulce: { nombre: 'Agua sin sal (glucosado)', forma: 'anillo', color: '--text-main' },
    na: { nombre: 'Na⁺', forma: 'circulo', color: '--accent-blue' },
    cl: { nombre: 'Cl⁻', forma: 'rombo', color: '--accent-purple' },
    salino3: { nombre: 'Salino 3 %', forma: 'rombo1', color: '--accent-purple' },
    salino75: { nombre: 'Salino 7,5 %', forma: 'rombo2', color: '--accent-purple' },
    // Ácido-base
    hco3: { nombre: 'HCO₃⁻', forma: 'triangulo', color: '--accent-green' },
    ringer: { nombre: 'Ringer', forma: 'triangulo', color: '--accent-green' },
    plasmalyte: { nombre: 'Plasma-Lyte', forma: 'trianguloHueco', color: '--accent-green' },
    h: { nombre: 'H⁺', forma: 'cruz', color: '--accent-red' },
    co2: { nombre: 'CO₂', forma: 'voluta', color: '--accent-blue' },
    nh4: { nombre: 'NH₄⁺', forma: 'pentagono', color: '--text-dim' },
    anion: { nombre: 'Aniones no medidos', forma: 'estrella', color: '--accent-yellow' },
    // Otros iones
    k: { nombre: 'K⁺', forma: 'cuadrado', color: '--text-dim' },
    ca: { nombre: 'Ca²⁺', forma: 'ovalo', color: '--text-main' },
    mg: { nombre: 'Mg²⁺', forma: 'ovaloHueco', color: '--text-main' },
    p: { nombre: 'Fosfato', forma: 'trianguloInv', color: '--text-muted' },
    // Moléculas y células
    glu: { nombre: 'Glucosa', forma: 'copo', color: '--accent-yellow' },
    urea: { nombre: 'Urea', forma: 'hexagono', color: '--text-muted' },
    alb: { nombre: 'Albúmina', forma: 'grano', color: '--accent-purple' },
    alb25: { nombre: 'Albúmina 25 %', forma: 'grano1', color: '--accent-purple' }, // grano con un halo (lámina: «25 %: con halo»)
    cito: { nombre: 'Citoquinas', forma: 'trebol', color: '--text-dim' },
    cacit: { nombre: 'Ca²⁺ unido al citrato', forma: 'caCitrato', color: '--text-main', anillo: '--accent-yellow' },
    citrato: { nombre: 'Citrato', forma: 'aro', color: '--accent-yellow' }, // el anillo del Ca²⁺ unido, vacío
    rbc: { nombre: 'Hematíes', forma: 'disco', color: '--accent-red' },
    celula: { nombre: 'Célula desprendida (NTA)', forma: 'celula', color: '--text-muted' },
    osmol: { nombre: 'Osmolitos (neurona)', forma: 'pajarita', color: '--accent-yellow' }, // río y mar: no un círculo ámbar como la albúmina
    creat: { nombre: 'Creatinina', forma: 'luna', color: '--text-dim', reserva: true },
    // Capilar y oxígeno (Marino cap. 9): las dos formas que propuso su maqueta (autonomo/maquetas/b1-capilar-oxigeno.html),
    // pendientes de que el usuario las confirme. Ninguna choca con las de arriba.
    o2: { nombre: 'O₂', forma: 'pesa', color: '--text-main' },              // dos átomos unidos: O=O
    lact: { nombre: 'Lactato', forma: 'tripode', color: '--accent-yellow' }, // medio copo: una glucosa da dos lactatos
    // Catéter vivo (Marino caps. 1-3): las dos formas que propuso su maqueta (autonomo/maquetas/b1-cateter-vivo.html),
    // pendientes de que el usuario las confirme. El coco es la única con adhesinas; la burbuja recuerda al anillo del
    // glucosado, pero solo sale en la lupa del aire, donde no hay glucosado.
    coco: { nombre: 'Coco (bacteria)', forma: 'coco', color: '--accent-green' },
    burbuja: { nombre: 'Burbuja de aire', forma: 'burbuja', color: '--text-dim' },
    // La muralla de papel (Marino cap. 4; maqueta aprobada autonomo/maquetas/b1-muralla.html, 20/10/2026). El bacilo es
    // un bastón de extremos redondos (sin adhesinas: eso es el coco); el huso, la flora residente anaerobia; el
    // linfocito, un círculo claro con un núcleo grande; la cadena corta, un zigzag abierto (no confundir con la voluta).
    bacilo: { nombre: 'Bacilo gramnegativo', forma: 'bacilo', color: '--accent-purple' },
    huso: { nombre: 'Flora residente (anaerobios)', forma: 'huso', color: '--text-dim' },
    linfocito: { nombre: 'Linfocito del GALT', forma: 'linfocito', color: '--text-main' },
    cadena: { nombre: 'Ácidos grasos de cadena corta', forma: 'cadena', color: '--accent-yellow' },
    // El telar de la trombina (Marino cap. 5; maqueta aprobada autonomo/maquetas/b1-telar.html, 20/10/2026): las
    // formas que propuso la maqueta con borde discontinuo. El escudo es la antitrombina (la guardiana); el collar, la
    // heparina (su largo decide qué ata); las cuatro bolitas, el FP4; la Y, la IgG; la plaqueta es un disco pequeño con
    // gránulos (con espinas al activarse) y el hilo, la fibrina de la red. Ninguna choca con las de arriba.
    at: { nombre: 'Antitrombina', forma: 'escudo', color: '--accent-blue' },
    heparina: { nombre: 'Heparina', forma: 'collar', color: '--accent-purple' },
    fp4: { nombre: 'Factor plaquetario 4 (FP4)', forma: 'fp4', color: '--text-dim' },
    igg: { nombre: 'IgG', forma: 'igg', color: '--accent-red' },
    plaqueta: { nombre: 'Plaqueta', forma: 'plaqueta', color: '--text-main' },
    plaquetaActiva: { nombre: 'Plaqueta activada', forma: 'plaquetaActiva', color: '--text-main' },
    fibrina: { nombre: 'Fibrina', forma: 'hilo', color: '--accent-yellow' },
    // La sangre y la hemostasia (Marino caps. 12-13; lámina autonomo/maquetas/b2-formas.html, aprobada por el usuario
    // el 20/10/2026 tal como está: el dímero-D en «8», el FvW en oro y las fichas de los factores con su número). El
    // esquistocito es el disco del hematíe con un mordisco y sin el centro pálido; el FvW, un cordón con cuentas (la
    // heparina es un collar sin hilo, en ciruela); el fibrinógeno, un bastón recto de tres nudos que se hace hilo de
    // fibrina; el neutrófilo, claro con el núcleo en tres lóbulos (el linfocito lo tiene redondo); el macrófago, grande
    // y con brazos. La ficha de factor es la única forma con letras: se dibuja grande (r ≥ 7,5) para que se lea.
    esquisto: { nombre: 'Esquistocito', forma: 'casco', color: '--accent-red' },
    fvw: { nombre: 'Factor de von Willebrand (FvW)', forma: 'cordon', color: '--accent-blue' },
    adamts13: { nombre: 'ADAMTS-13', forma: 'tijera', color: '--accent-green' },
    fibrinogeno: { nombre: 'Fibrinógeno (factor I)', forma: 'baston', color: '--accent-yellow' },
    dimero: { nombre: 'Dímero-D', forma: 'dimero', color: '--accent-yellow' },
    ft: { nombre: 'Factor tisular', forma: 'chispa', color: '--accent-red' },
    neutrofilo: { nombre: 'Neutrófilo', forma: 'neutrofilo', color: '--text-dim' },
    macrofago: { nombre: 'Macrófago', forma: 'macrofago', color: '--text-muted' },
    fII: { nombre: 'Factor II', forma: 'ficha', color: '--accent-blue', etiqueta: 'II' },
    fVII: { nombre: 'Factor VII', forma: 'ficha', color: '--accent-blue', etiqueta: 'VII' },
    fIX: { nombre: 'Factor IX', forma: 'ficha', color: '--accent-blue', etiqueta: 'IX' },
    fX: { nombre: 'Factor X', forma: 'ficha', color: '--accent-blue', etiqueta: 'X' },
};

// Borde fino de todas las partículas, para que se lean sobre cualquier fondo.
export const BORDE_PARTICULA = '--bg-main';

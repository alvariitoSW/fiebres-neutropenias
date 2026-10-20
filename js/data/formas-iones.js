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
};

// Borde fino de todas las partículas, para que se lean sobre cualquier fondo.
export const BORDE_PARTICULA = '--bg-main';

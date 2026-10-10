// Hiperpotasemia (Nefrología → Fisiología, ficha 12). Datos puros, sin DOM.
//
// Una sola fuente para la tabla de tratamiento de la vista Texto y para la
// simulación de la vista Visual (js/modules/nefrologia/hiperpotasemia-sim.js).
// Fuente: de Sequera Ortíz P, Alcázar Arroyo R, Albalate Ramón M. Trastornos
// del potasio. Nefrología al día (SEN), 2024.

// Tabla "Tratamiento — hiperpotasemia grave sintomática", tal cual (7 filas).
export const tratamientoHiperpotasemia = [
    { id: 'calcio', agente: 'Gluconato cálcico 10%', dosis: '10-30 ml en 2-5 min IV', tiempo: '5-10 min / 30-60 min', mecanismo: 'Antagoniza el efecto cardíaco (no baja el K⁺ plasmático)' },
    { id: 'salbutamol', agente: 'Salbutamol nebulizado o IV', dosis: "10-20 mg (2-4cc) en 10' inhalado, o 0,5 mg en 100 ml de glucosado 5% en 15' IV", tiempo: '30 min / 2-3h', mecanismo: 'Desplazamiento de K⁺ al interior celular' },
    { id: 'insulina', agente: 'Insulina + glucosa', dosis: '10 U rápida en 500 ml glucosado 10% (o 50 ml glucosado 50%) IV', tiempo: '15 min / 6-8h', mecanismo: 'Desplazamiento de K⁺ al interior celular' },
    { id: 'bicarbonato', agente: 'Bicarbonato sódico', dosis: 'Sobre todo si hay acidosis concomitante', tiempo: '30-60 min / 6-8h', mecanismo: 'Desplazamiento de K⁺ al interior celular' },
    { id: 'diuretico', agente: 'Diuréticos de asa', dosis: 'Furosemida 40-200 mg IV / torasemida', tiempo: '30 min / horas', mecanismo: 'Eliminan K⁺ del organismo' },
    { id: 'captores', agente: 'Captores de potasio (CSZ, patirómero)', dosis: 'CSZ 5-10 g/día; patirómero 8,4-25,2 g/día', tiempo: '1-2h / 7-24h', mecanismo: 'Eliminan K⁺ del organismo' },
    { id: 'dialisis', agente: 'Diálisis', dosis: 'Hemodiálisis o diálisis peritoneal', tiempo: 'Minutos/hora', mecanismo: 'Eliminan K⁺ del organismo' },
];

// Fármacos de la simulación. `fila` = id de la fila de la tabla de arriba;
// `ini`/`fin` = rangos en minutos traducidos de su columna "Inicio/duración"
// (fin null = la fuente no da una duración cerrada). `extra` = otra línea de
// la ficha a resaltar con "Texto ↓".
export const farmacosHiperpotasemia = [
    { id: 'calcio', grupo: 'protege', nombre: 'Gluconato cálcico 10%', fila: 'calcio', ini: [5, 10], fin: [30, 60], repetible: true },
    { id: 'salbutamol', grupo: 'desplaza', nombre: 'Salbutamol nebulizado o IV', fila: 'salbutamol', ini: [30, 30], fin: [120, 180], repetible: true },
    { id: 'insulina', grupo: 'desplaza', nombre: 'Insulina + glucosa', fila: 'insulina', ini: [15, 15], fin: [360, 480], repetible: true },
    { id: 'bicarbonato', grupo: 'desplaza', nombre: 'Bicarbonato sódico', fila: 'bicarbonato', ini: [30, 60], fin: [360, 480], repetible: true },
    { id: 'diuretico', grupo: 'elimina', nombre: 'Diuréticos de asa', fila: 'diuretico', ini: [30, 30], fin: null },
    {
        id: 'csz', grupo: 'elimina', nombre: 'Ciclosilicato de zirconio (CSZ)', fila: 'captores', extra: 'hk-quel-inicio',
        ini: [60, 60], fin: [420, 1440], repetible: true,
        tiempo: 'Inicio 1 h (tabla de la forma crónica) · duración 7-24 h',
        fidelidad: 'La tabla de urgencia da 1-2 h / 7-24 h para los dos captores juntos; la tabla de la forma crónica, 1 h para el CSZ.',
    },
    {
        id: 'patiromero', grupo: 'elimina', nombre: 'Patirómero', fila: 'captores', extra: 'hk-quel-inicio',
        ini: [420, 420], fin: null,
        tiempo: 'Inicio 7 h (tabla de la forma crónica)',
        fidelidad: 'La tabla de urgencia da 1-2 h para los dos captores; la tabla de la forma crónica, 7 h para el patirómero. El modelo usa 7 h y no da duración.',
    },
    { id: 'dialisis', grupo: 'elimina', nombre: 'Diálisis', fila: 'dialisis', ini: [5, 30], fin: null },
];

export const gruposHiperpotasemia = {
    protege: { rotulo: 'Protege el corazón', color: 'var(--accent-red)' },
    desplaza: { rotulo: 'Mete K⁺ en la célula', color: 'var(--accent-blue)' },
    elimina: { rotulo: 'Saca K⁺ del cuerpo', color: 'var(--accent-green)' },
};

// Causas = punto de partida de la escena. `fuente` = id de la línea de la
// ficha. Las cantidades (base, acido, lisis, aporte, pseudo) son ILUSTRATIVAS.
export const causasHiperpotasemia = {
    'renal': { etiqueta: '↓Eliminación renal · K⁺ 7,2', base: 7.2, renal: 'ir', fuente: 'hk-causa-renal', texto: 'IRA/ERC, Addison, hipoaldosteronismo, IECA/ARA2, espironolactona, finerenona, trimetoprim… El riñón no saca el K⁺.' },
    'renal-grave': { etiqueta: '↓Eliminación renal · K⁺ 8,3', base: 8.3, renal: 'ir', fuente: 'hk-causa-renal', texto: 'La misma causa con un K⁺ más alto. Prueba también el ECG "normal pese al K⁺ alto".' },
    'acidosis': { etiqueta: 'Acidosis metabólica', base: 6.4, renal: 'ok', acido: 0.8, fuente: 'hk-causa-salida', texto: 'Acidosis inorgánica: entra H⁺ en la célula y sale K⁺. Mucho menos marcado en las de anión gap alto (láctica, cetoacidosis), según la ficha de regulación del potasio.' },
    'lisis': { etiqueta: 'Lisis celular', base: 6.0, renal: 'ok', lisis: 1.4, fuente: 'hk-causa-salida', texto: 'Traumatismos, quemaduras, lisis tumoral, rabdomiólisis, hemólisis: la célula rota sigue soltando K⁺ mientras corre el reloj.' },
    'aporte': { etiqueta: 'Aporte excesivo oral o IV', base: 4.5, renal: 'ok', aporte: 2.6, fuente: 'hk-causa-aporte', texto: 'Solo relevante si coexiste insuficiencia renal. Mira qué pasa al cambiar la función renal.' },
    'pseudo': { etiqueta: 'Pseudohiperpotasemia', base: 4.5, renal: 'ok', pseudo: 2.5, fuente: 'hk-causa-pseudo', texto: 'Muestra hemolizada, leucocitosis o trombocitosis extremas, torniquete apretado: el K⁺ sube en el tubo, no en el paciente.' },
};

// Magnitudes ILUSTRATIVAS: la ficha no dice cuántos mEq/l mueve cada medida.
export const magnitudesHiperpotasemia = {
    desplaza: { insulina: 0.8, salbutamol: 0.7 },          // mEq/l al máximo efecto
    bicarbonato: { conAcidosis: 0.8, sinAcidosis: 0.25 },  // mEq/l
    elimina: { diuretico: 0.35, csz: 0.3, patiromero: 0.3, dialisis: 1.4 }, // mEq/l por hora
    renalBasal: 0.8,      // mEq/l por hora que saca un riñón conservado con el K⁺ alto
    diureticoEnIR: 0.2,   // fracción del efecto del diurético con IR grave
};

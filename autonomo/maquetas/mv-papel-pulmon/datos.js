// Textos y fuentes de la maqueta (lámina por lámina). Páginas del PDF; la impresa del Libro Azul = PDF + 384 (parte 1) o + 464 (parte 2).
const D = '../../docs/';
export const PDF = { M22: D + 'marino-2024-respiratory-management-caps22-26.pdf', M27: D + 'marino-2024-respiratory-management-caps27-30.pdf',
  LA1: D + 'libro-azul-seccion-iv-respiratorio-parte1.pdf', LA2: D + 'libro-azul-seccion-iv-respiratorio-parte2.pdf' };
export const NEUMO = ['neumologia', 'merinoNeumologia', 'panel-merino-neumo-tabs'];
// f: ficha de la app a la que lleva «Ver en la ficha» (los ids nep- que no existan aún se crean al llevarlo a la app)
export const FUENTES = {
  1: [
    { t: 'Vt 500 mL = 150 mL de espacio muerto anatómico + 350 mL que llegan al alvéolo', o: 'ficha', pdf: 'LA1', p: 5, imp: 389, nota: 'Libro Azul IV, parte 1, p. 389' },
    { t: 'Membrana alveolocapilar: capilar de ~0,6 µm de diámetro y superficie de 50-100 m² en ambos pulmones', o: 'ficha', pdf: 'LA1', p: 6, imp: 390, nota: 'Nota de fidelidad: la fuente dice «0,6 μm de diámetro» (de la capa capilar que recubre al alvéolo); el dibujo no pone medidas a escala.' },
    { t: 'Fig. 24.1: pulmón normal (muchos espacios aéreos separados por tabiques finos con los capilares) frente a SDRA', o: 'ficha', pdf: 'M22', p: 34, f: 'neumo-sdra-ventilacion', id: 'nep-fig-24-1', sitio: 'Fig. 24.1' },
    { t: 'El alto flujo nasal lava el espacio muerto de la nasofaringe (≈30 % de un Vt sale del espacio muerto anatómico) y reduce el espacio muerto', o: 'ficha', pdf: 'M22', p: '64-65', f: 'neumo-vm-modos', id: 'nep-hfno', sitio: 'Oxígeno nasal de alto flujo' },
    { t: '(300 − 150) × 30 = 4 500 mL/min: cuenta de ventilación alveolar con el 150 de la ficha', o: 'fisiología general', pdf: 'LA1', p: 5, imp: 389 },
  ],
  2: [
    { t: 'PEEP 5-10 evita el colapso distal; 10-20 abre lo colapsado (reclutamiento) pero también sobredistiende lo sano (volutrauma)', o: 'ficha', pdf: 'M27', p: 10, f: 'neumo-vm-ajuste', id: 'nep-peep-efectos', sitio: 'PEEP: reclutamiento y sobredistensión' },
    { t: 'Vt inicial 8 mL/kg PBW, bajar 1 mL/kg cada 2 h hasta 6; si la meseta pasa de 30, bajar hasta 4 (Tabla 27.1)', o: 'ficha', pdf: 'M27', p: '13-14', f: 'neumo-vm-ajuste', id: 'nep-tabla-27-1', sitio: 'Tabla 27.1 (PBW, Vt, PEEP)' },
    { t: 'Meseta ≤30 cmH₂O: uno de los objetivos mayores de la ventilación protectora', o: 'ficha', pdf: 'M27', p: 4, f: 'neumo-vm-modos', id: 'nep-riesgo-alveolar', sitio: 'Riesgo de lesión alveolar: meseta ≤30', nota: 'La ficha escribe «≤30» en el texto y «<30» en el protocolo de la Tabla 27.1 (nota ya anotada en la app).' },
    { t: 'Atelectrauma: abrir y cerrar cada ciclo la vía aérea pequeña la daña; la PEEP la mantiene abierta', o: 'ficha', pdf: 'M22', p: 48, f: 'neumo-sdra-ventilacion', id: 'nep-atelectrauma', sitio: 'Atelectrauma' },
    { t: 'Reclutamiento/desreclutamiento «alrededor de 30 000 veces por día»; hay poblaciones de alvéolos con presiones de apertura distintas y abrirlos exige más presión que mantenerlos abiertos (histéresis)', o: 'ficha', pdf: 'LA1', p: '66-67', imp: '450-451' },
    { t: 'Curva P-V (Fig. 19): puntos de inflexión inferior y superior; el reclutamiento empieza al pasar el punto bajo; el colapso empieza al caer la presión por debajo del punto de máxima curvatura; se propuso la PEEP 2 cmH₂O por encima del inferior (Amato)', o: 'ficha', pdf: 'LA2', p: 87, imp: 551, nota: 'El «índice de estrés» de la misma página queda fuera (la página imprime «convexa» donde corresponde otra forma).' },
    { t: 'Presiones de apertura (16-24), de cierre (6-10), rigidez de cada unidad, posición de los puntos de inflexión y el reparto en 4 unidades', o: 'ilustrativo' },
  ],
  3: [
    { t: 'Ecuación del movimiento: Pmus + Pvent = flujo × resistencia + Vt/(ΔV/ΔP) + PEEP', o: 'ficha', pdf: 'LA2', p: 47, imp: 511 },
    { t: 'El paciente dispara con una presión negativa de 2 a 3 cmH₂O; cerca de un tercio de los esfuerzos no disparan', o: 'ficha', pdf: 'M27', p: 8, f: 'neumo-vm-modos', id: 'nep-disparo', sitio: 'Disparos del respirador' },
    { t: 'Esfuerzo ineficaz: el esfuerzo no genera la asistencia; es la asincronía más frecuente', o: 'ficha', pdf: 'LA2', p: 93, imp: 557 },
    { t: 'Doble disparo: dos inspiraciones en un tiempo inferior a la mitad del tiempo inspiratorio', o: 'ficha', pdf: 'LA2', p: 94, imp: 558 },
    { t: 'Disparo inverso: nuevo disparo dentro de un ciclo inspiratorio; riesgo de sobredistensión por el volumen añadido; mecanismo en investigación', o: 'ficha', pdf: 'LA2', p: '94-95', imp: '558-559' },
    { t: 'Presión inspiratoria máxima media reportada: −120 cmH₂O en varones y −84 en mujeres', o: 'ficha', pdf: 'M27', p: 58 },
    { t: 'Forma del esfuerzo (seno²), amplitud 0-15, resistencia del circuito, flujo y Vt del respirador, ritmo de los esfuerzos', o: 'ilustrativo', nota: 'Las asincronías salen de la dinámica del modelo; la idea de generarlas así es de VentLoop (estudiada, sin copiar nada; no es fuente clínica).' },
  ],
};
export const TARJETAS = [
  { q: 'Vt 300 mL a FR 30: ¿cuánto llega al alvéolo por minuto?', a: '(300 − 150) × 30 = 4 500 mL/min, 4,5 L. Con Vt 500 y FR 12 serían 350 × 12 = 4,2 L: respirar rápido y poco no ventila más.', o: 'fisiología general · el 150, de la ficha (Libro Azul, p. 389)' },
  { q: '¿Por qué el alto flujo nasal ayuda aunque no sea PEEP?', a: 'Porque lava el espacio muerto de la nasofaringe: el aire que entra ya no arrastra gas espirado, y baja el espacio muerto (Marino, cap. 25).', o: 'ficha · Marino PDF 64-65' },
];
export const NIVELES = [
  { n: 'Tórax', fr: 'Al inspirar, el diafragma baja y el aire entra: un Vt de 500 mL.', o: 'Vt 500 mL: ejemplo de la ficha (LA1 p. 389)' },
  { n: 'Vía aérea', fr: 'De los 500 mL, 150 se quedan en la vía que conduce y no llegan a intercambiar; solo 350 llegan al alvéolo.', o: 'ficha · LA1 p. 389' },
  { n: 'Alvéolos', fr: 'La vía termina en racimos de alvéolos; en el pulmón normal los separan tabiques finos con el capilar (Fig. 24.1).', o: 'ficha · Marino PDF 34' },
  { n: 'Membrana', fr: 'El O₂ cruza al capilar y el CO₂ sale por una membrana de ~0,6 µm (50-100 m² en ambos pulmones).', o: 'ficha · LA1 p. 390' },
];
export const NOMBRES_AS = { sincronico: 'Sincrónico', ineficaz: 'Esfuerzo ineficaz', doble: 'Doble disparo', inverso: 'Disparo inverso' };
export const OPCIONES_AS = {
  sincronico: 'Cada esfuerzo dispara una respuesta única y sigue a la curva del respirador: el paciente y la máquina van a la vez.',
  ineficaz: 'Hay esfuerzo (la presión baja un poco) y el respirador no responde: el paciente trabaja sin recibir aire.',
  doble: 'Dos respuestas seguidas con un solo esfuerzo: el volumen se apila y puede llegar al doble del programado.',
  inverso: 'La insuflación empieza sin esfuerzo y el esfuerzo llega después, disparando una segunda respuesta apilada.',
};
export const EXPL = {
  sincronico: 'El esfuerzo baja la presión 2 cmH₂O, el respirador responde una vez y el Vt es el programado.',
  ineficaz: 'El esfuerzo es débil y la presión no llega a bajar los 2 cmH₂O del umbral; el paciente trabaja y no recibe aire (Vt de ese ciclo = 0).',
  doble: 'El esfuerzo dura más que la insuflación; al acabar esta, sigue tirando y dispara otra: el volumen se apila.',
  inverso: 'La insuflación empezó sin esfuerzo y el esfuerzo llega después; dispara una segunda respuesta apilada sobre la primera.',
};

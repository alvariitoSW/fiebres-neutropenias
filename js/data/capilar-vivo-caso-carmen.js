// Caso 5 del capilar y oxígeno: Carmen, 71 años, Hb 7,4. Es el «equivocarse sin guía»: decide sin ayudas, ve el sello del
// TACO y solo después la explicación (diseño de la maqueta B, autonomo/ideas/educacion-pionera/diseno-b.md).
// Paciente inventada; la medicina sale de Merino HEMATO (Marino cap. 12; PDF docs/marino-2024-anemia-transfusion-hemostasia-uci.pdf,
// página impresa = página del PDF). Cifras del monitor del modelo (las da la app a 390 px, no la maqueta):
//   Hb 7,4 / 8,4 / 9,4 → DO₂ 742 / 843 / 826, VO₂ 250, extracción 34 / 30 / 30 %, ScvO₂ 65 / 69 / 60 %, SaO₂ 98 / 98 / 86 %, lactato 1,0, gasto 7,6 L/min.
// Las constantes (FC, PA, FR, PVC, SpO₂ del edema) son fisiología general / ilustrativas: el libro solo da la hipoxemia en 6 h,
// la Rx con edema y la IC previa (p. 15-16). En el TACO el modelo deja el gasto en 7,6; en una IC real caería.

// Carmen y su tope clínico: Hb ≥7 g/dL en el crítico estable sin cardiopatía isquémica = fuera de indicación (p. 8, #mh-umbral-7).
export const CARMEN = { hb: 7.4, compensa: true, toma: 'scvo2' };
export const CARMEN_UMBRAL = 7;
export const CARMEN_BOLSA1 = { ...CARMEN, hb: 8.4, gcFijo: 7.64, transf: { de: 7.4, a: 8.4 } };
export const CARMEN_TACO = { hb: 9.4, gcFijo: 7.6, pao2: 55, alveolo: 'taco' };
export const CARMEN_TACO_CONSTANTES = [['FR', '30 /min'], ['SpO₂', '86 %'], ['FC', '110 /min'], ['PA', '152/90'], ['PVC', '16 mmHg']];
const HIPOVOLEMIA = { hb: 7.5, compensa: true, volemia: 'baja', gc: 4 };   // = ESTADOS['anemia-hipovolemia'].p
const TACO = { ...CARMEN, ...CARMEN_TACO };

const MT = 'merino-transfusion', MR = 'merino-riesgos';
const ILU = 'ilustrativas';

// Los 6 pasos del ejemplo resuelto (pantalla 4): cada uno mueve el modelo (data-cm-paso) y cita su página.
const CONS_VO2 = { estado: CARMEN_BOLSA1, mirar: 'vo2', rotulo: 'Lo que ves ahora', fuente: `${MT}#mh-efecto-transfusion`,
    texto: '<table class="data-table"><thead><tr><th></th><th>Antes</th><th>Después</th></tr></thead><tbody><tr><td>Hb (g/dL)</td><td>7,4</td><td>8,4</td></tr><tr><td>DO₂ (mL/min)</td><td>742</td><td>843</td></tr><tr><td>VO₂ (mL/min)</td><td>250</td><td>250</td></tr><tr><td>Extracción (%)</td><td>34</td><td>30</td></tr><tr><td>ScvO₂ (%)</td><td>65</td><td>69</td></tr></tbody></table><p><span class="hl">El aporte sube</span>, <span class="hl-rojo">el consumo no cambia</span> y cae la extracción (Fig. 12.4, p. 10-11). DO₂ con el gasto quieto: ilustrativo.</p>' };
export const ENSENANZA = [
    { estado: CARMEN, mirar: 'o2er', t: '<b>Hb 7,4 en un crítico estable sin cardiopatía isquémica: no se transfunde.</b> El umbral es 7 g/dL; el 8 es solo para la cardiopatía isquémica y la cirugía cardíaca u ortopédica (p. 8).' },
    { estado: CARMEN, mirar: 'ven', t: '<b>Si dudas, mira al tejido, no a la Hb.</b> Extracción 34 %, lejos del 50 % que Marino propone como disparador (p. 6 y 8); ScvO₂ 65 %, y se ha propuesto transfundir con &lt;70 % (p. 9). Tras la 1.ª bolsa (ScvO₂ 69 %, extracción 30 %) la extracción sigue lejos del 50 % y la ScvO₂ aún roza el 70 %. <span class="hl-purpura">Las dos reglas no coinciden del todo en Carmen y el libro no las reconcilia: aquí no se elige una.</span>' },
    { estado: CARMEN_BOLSA1, mirar: 'do2', t: '<b>Transfundir sube el aporte, no el consumo.</b> DO₂ 742 → 843 mL/min con el gasto quieto (ilustrativo); VO₂ sigue en 250 y cae la extracción (34 → 30 %) (Fig. 12.4, p. 10-11). «No es un método absoluto para oxigenar» (p. 11).' },
    { estado: CARMEN_BOLSA1, mirar: 'hb', t: '<b>En el crítico, los riesgos pesan más.</b> En 42 de 45 estudios los riesgos superan los beneficios; en 17 de 18, la transfusión fue factor de riesgo independiente (p. 16).' },
    { estado: HIPOVOLEMIA, mirar: 'do2', t: '<b>Lo que sí amenaza al tejido es la hipovolemia, no la anemia.</b> Sin volumen el corazón no puede compensar (p. 16-17). Aquí, Hb 7,5 sin volumen: gasto 4 L/min (ilustrativo).' },
    { estado: TACO, lupa: 'alveolo', mirar: 'spo2', t: '<b>Si hay TACO:</b> parar la transfusión, avisar al banco de sangre, diurético de asa i.v. y soporte; antes de otra transfusión, corregir el balance positivo (p. 16). En el modelo, la DO₂ cae a 826 (SaO₂ 86 %) y la ScvO₂ a 60 %.' },
];
const cajaEnsenanza = () => `<div class="cpv-ensenanza"><p class="cpv-para"><b>El ejemplo resuelto, con Carmen.</b> Cada paso mueve el modelo.</p><ol class="cpv-lista-n">${ENSENANZA.map((p, i) => `<li>${p.t} <button type="button" class="cpv-b" data-cm-paso="${i}">Verlo en el modelo</button></li>`).join('')}</ol>
    <details class="nota-plegable"><summary>Por qué te dejamos equivocarte primero</summary><p>Resolver sin ayuda y recibir la explicación después mejora la comprensión (fracaso productivo; evidencia <b>moderada</b>: 53 estudios, g 0,36, Sinha y Kapur 2021, Rev Educ Res). En medicina solo hay un ensayo pequeño (42 estudiantes, sutura, Willis 2020, J Surg Educ). Durante el intento no te dimos pistas porque añadirlas no mejoró el aprendizaje de los errores (Klein 2019, Adv Health Sci Educ). Sin esta explicación después, el error solo no enseña.</p></details>
    <p class="cpv-para"><small>Cifras del monitor del modelo; constantes y gasto quieto: fisiología general / ${ILU}.</small></p></div>`;
const cajaSello = () => `<div class="tfg-estado tfg-estado-warn cpv-consecuencia" role="note"><b>⛔ Edema pulmonar a las 4 h de la 2.ª bolsa</b><ul class="term-chips">${CARMEN_TACO_CONSTANTES.map(([k, v]) => `<li>${k} ${v}</li>`).join('')}</ul><p>Hb 9,4 · DO₂ no sube (826) · ScvO₂ 60. <small>Constantes: fisiología general / ${ILU}; el libro da la hipoxemia en 6 h y la Rx con edema (p. 16).</small></p></div>`;

export const CASO_CARMEN = {
    id: 'B5', titulo: 'Carmen, 71 años: la guardia de la bolsa', corto: 'Caso 5 · Carmen', sub: 'anemia en una paciente con IC',
    paciente: { Edad: '71 años', Ingreso: 'neumonía, hace 3 días; hoy estable, sin vasoactivos, gafas 2 L, no sangra', Antecedente: 'insuficiencia cardíaca crónica (FEVI 35 %), sin cardiopatía isquémica', Hb: '7,4 g/dL (ayer 7,9)', Constantes: 'FC 92, PA 118/64, FR 20, SpO₂ 98 %, PVC 8 (ilustrativas)' },
    pasos: [
        { momento: '3:00 · Decide tú, sin guía', datos: {}, nuevo: [], estado: CARMEN, mirar: 'hb',
          pregunta: { id: 'cm-1', tipo: 'test', sinPensar: true, fuente: `${MT}#mh-umbral-7 · #mh-efecto-transfusion`,
            enunciado: '3:00. Te llama la enfermera: «Carmen tiene la Hb en 7,4, ¿le pongo sangre?». Nadie más despierto. Decide con el modelo.',
            opciones: [
                { t: 'Transfundir 1 CH', ok: false, porque: 'Con Hb 7,4 ≥7 y sin cardiopatía isquémica no hay indicación (umbral 7, p. 8): le pondrías a una paciente con IC una bolsa que corre el riesgo de TACO sin necesitarla (p. 15).',
                  consecuencia: { estado: CARMEN, mirar: 'hb', corto: 'se transfundió con Hb 7,4 ≥7, sin indicación (p. 8).', fuente: `${MT}#mh-efecto-transfusion`,
                    texto: '5:10. Pasó la primera bolsa (≈2 h, p. 10). Hb de control 8,4.' } },
                { t: 'Pedir una ScvO₂ de control antes de decidir', ok: false, porque: 'Es una prueba válida, pero no cambia la decisión: con Hb ≥7 no hay indicación (p. 8) y no hay signos de extracción alta (34 %, lejos del 50 %, p. 8). La ScvO₂ 65 % (se ha propuesto transfundir con <70 %, p. 9) y la extracción no coinciden y el libro no las reconcilia: perderías tiempo con una cifra que no te da la indicación.' },
                { t: 'Dejar así y seguir la guardia', ok: true }],
            explicacion: 'Crítico estable sin cardiopatía isquémica: el umbral es 7 g/dL (p. 8) y Carmen está en 7,4. Mirar al tejido (extracción 34 %, ScvO₂ 65 %) no da indicación clara: las dos reglas no coinciden y el libro no las reconcilia (p. 6-9).' } },
        { momento: '5:10 · antes de mirar el monitor', datos: {}, nuevo: [], estado: CARMEN, mirar: 'hb',
          cab: r => r.b1 ? '' : '<p class="tfg-estado tfg-estado-neutro cpv-tras">En esta rama la bolsa es la del R1 de la mañana (≈2 h, p. 10).</p>',
          pregunta: { id: 'cm-8', tipo: 'test', fuente: `${MT}#mh-efecto-transfusion`,
            enunciado: 'La bolsa ha pasado. Antes de ver el monitor: ¿qué ha hecho el consumo (VO₂) y por qué?',
            opciones: [
                { t: 'Sube con el aporte: llega más O₂ y se consume más', ok: false, porque: 'Creerías que el tejido ha mejorado y que la bolsa «oxigena»: el consumo lo marca el metabolismo, no el aporte, y «no es un método absoluto para oxigenar» (p. 10-11).', consecuencia: CONS_VO2 },
                { t: 'Baja, porque la extracción cae y el tejido usa menos', ok: false, porque: 'Al revés: buscarías un hipometabolismo que no existe. Lo que cae es la extracción; el VO₂ se queda en 250 (Fig. 12.4, p. 10-11).', consecuencia: CONS_VO2 },
                { t: 'No cambia: el tejido coge lo que necesita y cae la extracción', ok: true, consecuencia: CONS_VO2 }],
            explicacion: 'La bolsa sube el aporte (DO₂) y el consumo (VO₂) no cambia: el tejido coge lo que necesita, así que cae la extracción (Fig. 12.4, p. 10-11).' } },
        { momento: 'La bolsa · Hb de control', datos: {}, nuevo: [], estado: CARMEN_BOLSA1, mirar: 'hb',
          pregunta: { id: 'cm-2', tipo: 'test', sinPensar: true, fuente: `${MT}#mh-umbral-7 · #mh-taco`,
            enunciado: 'Hb de control. Sigue «baja» y hay una bolsa a mano. ¿Qué haces?',
            opciones: [
                { t: 'Transfundir otro CH', ok: false, porque: 'Sigues sin indicación (Hb ≥7, p. 8) y la paciente tiene IC previa: el TACO aparece en ≈1 % y es más frecuente con IC (p. 15); la bolsa sin indicación no aporta beneficio (p. 8) y suma ese riesgo. El libro no dice que 2 bolsas den más TACO que 1: lo que castiga es transfundir sin indicación.',
                  consecuencia: { estado: TACO, lupa: 'alveolo', mirar: 'spo2', corto: 'una 2.ª bolsa sin indicación acabó en TACO (p. 8 y 15-16).', fuente: `${MR}#mh-taco`,
                    texto: 'A las 4 h de empezar la 2.ª bolsa: disnea, SpO₂ 86 %, crepitantes bilaterales. <span class="hl-rojo">Edema pulmonar</span> hidrostático en las primeras 6 h de la transfusión (p. 15-16). Hb 9,4, pero la DO₂ no sube (826 mL/min: la SaO₂ cae al 86 %) y la ScvO₂ baja a 60 %.' } },
                { t: 'Pedir Rx y gasometría antes de decidir', ok: false, porque: 'No cambia la indicación (Hb 8,4, sobre el umbral 7, p. 8) y la bolsa sigue a mano: mientras pruebas, el R1 o la enfermera pueden colgarla.' },
                { t: 'Parar aquí', ok: true }],
            explicacion: 'Con Hb sobre el umbral 7 y sin cardiopatía isquémica, la siguiente bolsa no tiene indicación (p. 8) y el TACO aparece en ≈1 % y es más frecuente con IC previa (p. 15); la bolsa sin indicación no aporta beneficio (p. 8) y suma ese riesgo.' },
          cab: r => r.b1 ? '<p class="tfg-estado tfg-estado-neutro cpv-tras">5:10. Pasó la primera bolsa. Hb de control 8,4 (umbrales de las guías: 7 y 8 g/dL, p. 8).</p>' : '<p class="tfg-estado tfg-estado-neutro cpv-tras">8:00. El R1 de la mañana la ve «todavía baja» y cuelga una bolsa. 10:00: Hb de control 8,4.</p>' },
        { momento: '4 h después de empezar la 2.ª bolsa · el sello', sinNombre: true, datos: { Hb: '9,4 g/dL', Constantes: 'FR 30, SpO₂ 86 % con gafas, FC 110, PA 152/90, PVC 16 (ilustrativas); crepitantes bilaterales' }, nuevo: ['Hb', 'Constantes'],
          estado: TACO, lupa: 'alveolo', mirar: 'spo2', carmen: 'taco', antes: cajaSello,
          cab: r => r.b2 ? '' : '<p class="tfg-estado tfg-estado-neutro cpv-tras">El R1 no te hace caso: a las 10:30 cuelga la 2.ª bolsa. Así todos ven el sello.</p>',
          pregunta: { id: 'cm-3', tipo: 'test', fuente: `${MR}#mh-taco`,
            enunciado: 'Pasó. Ahora, por qué: ¿qué le ha pasado a Carmen?',
            opciones: [
                { t: 'TACO: sobrecarga circulatoria por la transfusión, sobre su IC', ok: true },
                { t: 'TRALI: anticuerpos del donante que inflaman el pulmón', ok: false, porque: 'El TRALI da también hipoxemia en 6 h (p. 14-16), pero orientan al TACO la IC previa y la sobrecarga de líquido (p. 16). En los dos se para la transfusión y se avisa al banco (p. 14 y 16); lo que cambia es el diurético de asa i.v., apropiado en el TACO (p. 16), frente al soporte tipo SDRA del TRALI (p. 14-15).' },
                { t: 'Neumonía: su infección pulmonar que empeora por sí sola', ok: false, porque: 'TACO y TRALI son las complicaciones pulmonares de la transfusión y pueden ser indistinguibles (p. 14-16); atribuirlo a la neumonía sin descartarlas deja la bolsa goteando.' }],
            explicacion: 'TACO: edema pulmonar hidrostático en las primeras 6 h, más frecuente con IC o insuficiencia renal previas (p. 15-16).' } },
        { momento: 'La enseñanza · el ejemplo resuelto', datos: {}, nuevo: [], estado: CARMEN, mirar: 'o2er', antes: cajaEnsenanza,
          pregunta: { id: 'cm-4', tipo: 'test', fuente: `${MT}#mh-umbral-7`,
            enunciado: 'Con el ejemplo resuelto delante: Hb de control 8,4 tras la bolsa, ¿qué debía hacer el R1 a las 8:00?',
            opciones: [
                { t: 'Cuelga otro CH para dejarla por encima de 9', ok: false, porque: 'Es el estándar de 10 g/dL de 1942, que duró 60 años (p. 7-8): sin indicación y con más riesgo (p. 16); en Carmen acabó en edema pulmonar.' },
                { t: 'Transfunde, porque con IC el umbral es 8', ok: false, porque: 'El umbral 8 es para la cardiopatía isquémica y la cirugía cardíaca u ortopédica (p. 8); Carmen tiene IC sin isquemia y su 8,4 supera incluso el 8. Transfundirla es la bolsa sin indicación que le llena el pulmón.' },
                { t: 'No transfundir más: 8,4 ya está sobre el umbral 7', ok: true }],
            explicacion: 'Umbral 7 en el crítico estable sin cardiopatía isquémica; 8 solo con isquemia o cirugía cardíaca/ortopédica (p. 8).' } },
        { momento: 'Recuperación · otro paciente, la misma idea', datos: {}, nuevo: [], estado: { hb: 7.6, compensa: true }, mirar: 'hb',
          pregunta: { id: 'cm-5', tipo: 'test', fuente: `${MT}#mh-umbral-7 · #mh-efecto-transfusion`,
            enunciado: 'Don Julián, 68 años, día 2 de un infarto sin elevación del ST, estable, Hb 7,6 g/dL, no sangra. ¿Qué haces?',
            opciones: [
                { t: 'Nada: está por encima del umbral de 7, como Carmen', ok: false, porque: 'Con cardiopatía isquémica el umbral es <8 (p. 8): le dejarías anémico al miocardio que más lo necesita.' },
                { t: 'Transfundir 1 CH y controlar la Hb', ok: true },
                { t: 'Transfundir 2 CH para pasar de 9', ok: false, porque: 'Es el estándar de 10 g/dL de 1942 que duró 60 años (p. 7-8): la 2.ª bolsa no está indicada y suma riesgo (p. 16).' },
                { t: 'Pedir ScvO₂ y no transfundir mientras la extracción sea <50 %', ok: false, porque: 'Ignoras que con coronariopatía la guía indica transfundir con Hb <8 (p. 8); la extracción ≈ SaO₂ − ScvO₂ (p. 8) y su 50 % es un disparador propuesto, no anula el umbral.' }],
            explicacion: 'Umbral 8 con cardiopatía isquémica o cirugía cardíaca/ortopédica; 7 en el resto del crítico estable (p. 8). Cada CH sube la Hb ≈1 g/dL (p. 10).' } },
        { momento: 'Recuperación · TACO o TRALI', datos: {}, nuevo: [], estado: TACO, lupa: 'alveolo', mirar: 'spo2',
          pregunta: { id: 'cm-6', tipo: 'destapa', fuente: `${MR}#mh-taco · #mh-trali`, cuantas: 'son cuatro',
            enunciado: 'Son las 4 h de la 2.ª bolsa de Carmen: disnea y SpO₂ 86 %. El adjunto, por teléfono: «¿TACO o TRALI, y qué haces ya?». Son cuatro cosas.',
            puntos: [
                'Parar la transfusión si no acabó y <span class="hl">avisar al banco de sangre</span>: vale para los dos (p. 14-16).',
                'Hacia <span class="hl">TACO</span>: IC previa, sobrecarga de líquido o insuficiencia renal (p. 16); hacia <span class="hl">TRALI</span>: PCR alta y ausencia de IC o de sobrecarga (p. 14-15). Los dos dan hipoxemia en 6 h y el TACO puede tener fiebre (30 %) (p. 16).',
                'Si es TACO: <span class="hl-verde">diurético de asa i.v.</span> (p. 16). Si es TRALI: soporte como en el SDRA (p. 14-15).',
                'El TACO no se relaciona con el número de unidades (p. 15); antes de futuras transfusiones, corregir el balance positivo con diuréticos (p. 16).'],
            explicacion: 'TACO y TRALI se parecen y se separan por el contexto (IC, balance, PCR); en los dos se para la transfusión y se avisa al banco.' } },
        { momento: 'Recuperación · la nota del R1', datos: {}, nuevo: [], estado: CARMEN_BOLSA1, mirar: 'hb',
          pregunta: { id: 'cm-7', tipo: 'error', fuente: `${MT}#mh-umbral-7 · #mh-efecto-transfusion · ${MR}#mh-taco`,
            enunciado: 'Nota del R1 de la mañana. Puede haber 0, 1 o 2 errores.',
            frases: [
                { t: 'Carmen, 71 a, IC crónica. Hb 8,4 tras 1 CH, todavía baja: cuelgo otro CH para dejarla por encima de 9.', mal: true, c: 'Con Hb 8,4, crítico estable sin cardiopatía isquémica, ya está sobre el umbral 7 (p. 8): no hay indicación.' },
                { t: 'Cada CH sube la Hb ≈1 g/dL y el Hto ≈3 %.', mal: false },
                { t: 'Lo paso en 2 h, sin diluir: probablemente no hace falta diluir en el paciente estable (p. 10).', mal: false },
                { t: 'Con solo 2 unidades el riesgo de TACO es despreciable, porque depende del número de bolsas.', mal: true, c: 'El TACO no se relaciona con el número de unidades; ≈1 % y más con IC previa (p. 15).' },
                { t: 'Si hace disnea, paro y pido Rx.', mal: false }],
            explicacion: 'Dos errores: la bolsa sin indicación (umbral 7, p. 8) y creer que el TACO depende del número de bolsas (p. 15). Cada CH sube ≈1 g/dL y el Hto ≈3 % (p. 10).' } }
    ],
    lleva: [
        'La Hb no dice si el tejido recibe O₂: el umbral es 7, u 8 con cardiopatía isquémica (p. 8). <button type="button" class="especialidad-link" data-especialidad="libros" data-view="capilarVivo" data-capilar-vivo="umbral-7">Ver el umbral 7 en el modelo →</button> <span data-cpv-fuente="merino-transfusion#mh-umbral-7"></span>',
        'Transfundir sube el aporte, no el consumo (p. 10-11), y en el crítico sus riesgos pesan más que sus beneficios (p. 16). <span data-cpv-fuente="merino-transfusion#mh-efecto-transfusion"></span>',
        'TACO en 6 h, más con IC previa, sin relación con el número de bolsas; se para y se da diurético de asa (p. 15-16). <button type="button" class="especialidad-link" data-especialidad="libros" data-view="capilarVivo" data-capilar-vivo="taco">Ver el TACO en el modelo →</button> <span data-cpv-fuente="merino-riesgos#mh-taco"></span>'],
    volver: { nombre: 'Transfusión de hematíes', ficha: 'merino-transfusion', estado: 'umbral-7' }
};

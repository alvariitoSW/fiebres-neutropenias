// Mayéutica del shock vivo: la escala SCAI, el ECMO con el Impella y el caso de Fermín (infarto del VD). Mismo formato crudo que
// PREGUNTAS y CASO de shock-vivo-data.js (se convierten en shock-vivo-mayeutica.js). Cada cifra de un enunciado sale del monitor
// de la app (autonomo/pruebas/shock-scai-fermin.mjs); las fijas son ilustrativas y lo dicen.
import { C } from './shock-vivo-data.js';
const c1 = (x) => (+x).toFixed(1).replace('.', ',');
// Citas nuevas: ESC 2026 parte 1 (PDF p. 44, Tabla 13 y apartados 7.3.2 y 7.3.4), Marino caps. 18-21 (PDF p. 45-46)
const ESC = { f: 'ic-descompensada', id: 'ic-scai-tabla', sitio: 'Tabla 13 · escala SCAI', p: 44 };
const ESC732 = { f: 'ic-descompensada', id: 'ic-scai-tabla', sitio: 'Shock cardiogénico (7.3.2) y escala SCAI', p: 44 };
const NTG = { f: 'mc-sca-tratamiento', id: 'mc-tabla-20-3', sitio: 'Tabla 20.3 · nitroglicerina', p: 45 };
const O2 = { f: 'mc-sca-tratamiento', id: 'mc-tabla-20-3', sitio: 'Tabla 20.3 · oxígeno', p: 45 };
const REGLA = 'Regla del modelo sobre la Tabla 13 (ESC 2026, p. 44): C/D/E según las intervenciones puestas y la evolución del lactato; la Tabla 13 no lleva ninguna cifra: el lactato >2 mmol/L sale del texto 7.3.4';
const AUR1 = { pac: 'aurelio', rec: { g: 1 }, escena: 'corazon' };
const AUR_LEVE = { pac: 'aurelio', rec: { g: 0.8 }, escena: 'corazon' };   // gravedad 80 %: lactato algo por encima de 2 y PAM 72 (medido en el monitor)

export const PREG_SCAI = [
  { id: 'S1', grupo: 'guia', predice: true, prepara: AUR_LEVE,
    enunciado: (R) => `Aurelio, IAM anterior, aún sin ningún tratamiento: PAM ${R.pam} mmHg y lactato ${c1(R.lact)} mmol/L. <b>Antes de mirar el rótulo del monitor: ¿qué estadio SCAI es?</b>`,
    opciones: [
      { t: 'C, «clásico»: hipoperfusión (lactato alto) que ya necesita una intervención.', ok: true },
      { t: 'A, «en riesgo»: aún no tiene signos de shock.', porque: 'Con ese lactato (>2) sí los tiene: A es el paciente sin signos ni síntomas de shock. Dejarlo en A retrasaría el inotrópico, el vasopresor o el soporte.' },
      { t: 'B, «inicial / pre-shock»: está inestable, pero sin hipoperfusión.', porque: 'B pide inestabilidad sin hipoperfusión, y un lactato >2 mmol/L es hipoperfusión. Llamarlo B lo trataría como un paciente que todavía perfunde bien.' },
      { t: 'D, «deteriorante»: ya no responde.', porque: 'D es el paciente parecido al C que empeora pese a las primeras intervenciones; Aurelio aún no tiene ninguna. Con D saltarías a escalar el soporte antes de probar lo básico.' }],
    explica: 'El estadio C es el paciente con hipoperfusión que requiere una intervención (inotrópico, vasopresor o soporte mecánico). La hipoperfusión se mide mejor con el lactato arterial: se exige >2 mmol/L (ESC 2026, p. 44, texto 7.3.4; la Tabla 13 no da cifras). La letra del monitor sigue esa tabla.', cita: ESC,
    org: REGLA },
  { id: 'S2', grupo: 'guia', predice: true, prepara: { ...AUR1, horas: 5, ajuste: { dobuta: true } },
    enunciado: (R) => `Cinco horas después, con dobutamina: el lactato de Aurelio ha bajado a ${c1(R.lact)} mmol/L y la PAM es ${R.pam} mmHg. <b>Antes de mirar el rótulo: ¿qué estadio SCAI es ahora?</b>`,
    opciones: [
      { t: 'C: sigue con hipoperfusión (lactato >2), pero responde.', ok: true },
      { t: 'D: el lactato sigue por encima de 2 mmol/L pese al fármaco.', porque: 'D exige no responder a las primeras intervenciones; el lactato de Aurelio baja. Llamarlo D lo llevaría a escalar el soporte cuando el fármaco está funcionando.' },
      { t: 'A: el lactato ya mejora, así que está en riesgo, no en shock.', porque: 'Con lactato >2 mmol/L la hipoperfusión sigue ahí; A es no tener aún signos de shock. Retirar la vigilancia ahora lo dejaría sin seguimiento mientras todavía perfunde mal.' },
      { t: 'B: está estable, pero perfunde mal según el lactato.', porque: 'B es la inestabilidad sin hipoperfusión; Aurelio tiene hipoperfusión, así que B no encaja con lo que ves en el lactato.' }],
    explica: 'Mientras el lactato siga por encima de 2 hay hipoperfusión, y con una intervención puesta es C si responde (la Tabla 13 no define el estadio tras responder: la letra, y su rótulo «en respuesta (regla del modelo)», son regla del modelo). D es «parecido al C, pero empeorando sin responder a las primeras intervenciones» (ESC 2026, p. 44).', cita: ESC,
    org: REGLA + '. Los lactatos de Aurelio son del modelo (ilustrativo)' },
  { id: 'S3', grupo: 'examen', tipo: 'error', prepara: { pac: 'fermin', escena: 'corazon' },
    enunciado: 'El R1 anota la escala SCAI de varios pacientes (cifras de ejemplo, ilustrativas). <b>Puede haber 0, 1 o 2 errores.</b>',
    frases: [
      { t: 'La hipoperfusión se mide mejor con el lactato arterial: se exige >2 mmol/L.' },
      { t: 'Un paciente con PAM 58, FC 120 y lactato 1,4 mmol/L está en estadio C.', mal: true, buena: 'Sin hipoperfusión (lactato ≤2) no es C: con hipotensión relativa o taquicardia pero sin hipoperfusión es el estadio B, «inicial / pre-shock» (sin ninguna intervención puesta). ', cita: ESC },
      { t: 'El estadio D es el paciente parecido al C que empeora sin responder a las primeras intervenciones.' }],
    explica: 'Solo la segunda es falsa: el estadio lo marca la hipoperfusión, no la PA sola (ESC 2026, p. 44).', cita: ESC,
    org: 'El PAM 58 y la FC 120 son un ejemplo ilustrativo; la Tabla 13 no da cifras de PA («no specific blood pressure cut-off»)' },
  { id: 'S4', grupo: 'examen', predice: true, prepara: { pac: 'aurelio', rec: { esc: 'fallo', g: 1, volemia: 0 }, ajuste: { soporte: 'ecmo', ecmo: 6 }, escena: 'ecmo' },
    enunciado: (R) => `Aurelio, en ECMO VA a ${c1(R.ecmo)} L/min: la aórtica abre ${R.aoAbre} de ${R.aoDe} latidos y la PCP es ${R.pcp} mmHg. El VI no se vacía. <b>¿Qué añades?</b>`,
    opciones: [
      { t: 'Un Impella o un balón de contrapulsación, para descargar el VI.', ok: true },
      { t: 'Más flujo de ECMO: así la bomba hace más trabajo y el VI descansa.', porque: 'El flujo retrógrado de la aorta es justo lo que sube la poscarga del VI. Con más flujo, el VI de Aurelio abriría aún menos y el edema agudo de pulmón se acercaría.' },
      { t: 'Más noradrenalina, para sostener la presión de la aorta y la perfusión.', porque: 'Los vasopresores pueden agravar el fallo de bomba (Marino, p. 43): un vasoconstrictor sube la presión contra la que eyecta el VI. A un ventrículo ya cerrado le pondrías más poscarga, no menos.' },
      { t: 'Un bolo de volumen para llenar el circuito y mantener el flujo.', porque: 'El problema es que el VI recibe más de lo que saca. Con la PCP ya alta, más volumen encharcaría el pulmón de Aurelio.' }],
    explica: 'El flujo retrógrado del ECMO sube la poscarga del VI y puede reducir su gasto y causar edema agudo de pulmón. Se combina el ECMO con un balón o un Impella para bajar la poscarga, o se drena el VI («venteo») para bajar su presión telediastólica (Marino, pp. 48-49).', cita: C.ecmoPoscarga,
    org: 'Marino, PDF pp. 48-49; los motivos de las opciones falsas aplican esa misma frase (la poscarga y la PCP). Cuánto baja la PCP lo calcula el modelo (ilustrativo)',
    comprueba: { txt: 'Compruébalo: añade un Impella', ajuste: { venteo: 'impella', impella: 2.5 }, mira: 'Mira la PCP: baja aunque la aórtica siga cerrada, porque el Impella saca la sangre del VI a través de la válvula (Marino, pp. 47-48).', cifras: ['pcp', 'ecmo'] } },
];

// ── El caso de Fermín (70 años, 80 kg, IAM inferior con el VD afectado): la gravedad al máximo, para que haya hipoperfusión
const FER = { pac: 'fermin', rec: { g: 1 }, escena: 'corazon', canales: 'todos' };
const filaF = (R, ...extra) => [['Paciente', 'Fermín, 70 años, 80 kg'], ['Motivo', 'IAM inferior con el VD afectado', 1], ['PA', `${R.pas}/${R.pad} mmHg`, 1], ['PVC / PCP', `${R.pvc} / ${R.pcp} mmHg`, 1], ['IC', `${c1(R.ic)} L/min/m²`, 1], ['Lactato', `${c1(R.lact)} mmol/L`, 1], ...extra];
export const CASO_FERMIN = {
  titulo: 'El infarto que se come el ventrículo derecho (Fermín)',
  sub: 'Un infarto inferior que falla por la derecha: volumen con juicio, el fármaco que toca y lo que no se da',
  pasos: [
    { dia: 'Hora 2 · ¿qué ventrículo y es shock?', prepara: FER, tipo: 'destapa', ficha: (R) => filaF(R, ['FEVI', '52 %']),
      enunciado: (R) => `PA ${R.pas}/${R.pad} mmHg (PAM del monitor ${R.pam}), PVC ${R.pvc}, PCP ${R.pcp} mmHg, IC ${c1(R.ic)} L/min/m², FEVI 52 % y lactato ${c1(R.lact)} mmol/L. <b>¿Qué ventrículo falla y es ya un shock? Son tres datos.</b>`,
      puntos: [
        { t: 'La <span class="hl-rojo">PVC supera a la PCP</span>: sube más la presión derecha que la izquierda, el cociente PVC/PCP aumenta.', org: 'Marino, p. 40; las cifras del monitor son del modelo (ilustrativo)', c: C.vd },
        { t: 'La <span class="hl-azul">FEVI se conserva</span> (52 %) y el VD dilatado empuja el tabique hacia el VI, que se llena peor: falla el derecho, no la bomba izquierda.', org: 'Marino, p. 40; los 52 % son ilustrativos', c: C.vd },
        { t: 'Es shock aunque la PAM sea normal: hay <span class="hl-rojo">hipoperfusión</span> (lactato >2 mmol/L) y la hipotensión puede faltar.', org: 'ESC 2026, p. 44 (texto 7.3.2 y 7.3.4)', c: ESC732 }],
      explica: 'En el fallo del VD suben la PVC más que la PCP y la FEVI se conserva (Marino, p. 40). Es shock porque hay hipoperfusión (lactato >2 mmol/L): puede haberla con presión normal (ESC 2026, p. 44).' },
    { dia: 'Hora 2 · el volumen', prepara: FER, tipo: 'test', predice: true, ficha: (R) => filaF(R),
      enunciado: (R) => `La PVC ya es ${R.pvc} mmHg y el IC, ${c1(R.ic)}. Un compañero propone «llenar al VD». <b>¿Qué haces con el volumen?</b>`,
      opciones: [
        { t: '250 mL como prueba, mirando PVC e IC.', ok: true },
        { t: 'Un litro rápido: el VD necesita más precarga para empujar sangre.', porque: 'La PVC ya está alta; más volumen dilata más el VD y empuja el tabique hacia el VI, que se llena peor (Marino, p. 40). Fermín perdería gasto en vez de ganarlo.' },
        { t: 'Furosemida para bajar la PVC y descongestionar al VD.', porque: 'El VI ya se llena mal por el VD dilatado (Marino, p. 40); quitar volumen, en mi inferencia (fisiología general), le restaría aún más llenado y gasto. Fermín sí tiene congestión derecha (PVC alta), pero su problema es el gasto, no el exceso de agua. Inferencia (fisiología general), no dicha por la fuente.' },
        { t: 'Nada de volumen en ningún caso, porque el VD ya está dilatado.', porque: 'La guía pide un manejo «prudente» de los líquidos, no ninguno (ESC 2026, p. 44). Negarse a probar dejaría sin tratar un posible déficit de llenado.' }],
      explica: 'La guía pide «judicious fluid management»: volumen con juicio, no a ciegas (ESC 2026, p. 44). En el modelo, 250 mL suben la PVC de 15 a 16 y el IC no mejora: la prueba se para.', cita: ESC732,
      org: 'La guía no da cuánto volumen ni la meta en el VD; los 250 mL y lo que hace el modelo son ilustrativos',
      comprueba: { txt: 'Compruébalo: dale 250 mL', volumen: 250, mira: 'Mira la PVC y el IC: el volumen no mejora el gasto.', cifras: ['pvc', 'pcp', 'ic'] } },
    { dia: 'Hora 2 · el fármaco', prepara: FER, tipo: 'test', ficha: (R) => filaF(R),
      enunciado: (R) => `Con PAM ${R.pam} mmHg, IC ${c1(R.ic)} y lactato ${c1(R.lact)}. <b>¿Qué eliges?</b>`,
      opciones: [
        { t: 'Un inotrópico, dobutamina: el problema es el gasto, no la presión.', ok: true },
        { t: 'Noradrenalina, para subir la PAM y mejorar la perfusión de los órganos.', porque: 'Con la PAM normal no hay hipotensión que corregir; en el modelo la noradrenalina no cambia el IC de Fermín. Se quedaría con la hipoperfusión y un vasoconstrictor de más.' },
        { t: 'Esperar a que baje la PA antes de tratar, para no anticiparse.', porque: 'El shock cardiogénico puede presentarse con hipoperfusión y normotensión (ESC 2026, p. 44). Esperar a la hipotensión sería llegar tarde.' },
        { t: 'Otro bolo grande de volumen, para subir el gasto del VD.', porque: 'La PVC ya está alta y el IC no sube con volumen (paso anterior). Seguirías dilatando el VD sin ganar gasto.' }],
      explica: 'La guía cita el uso apropiado de inotrópicos y vasopresores (ESC 2026, p. 44); el inotrópico más usado en el shock cardiogénico es la dobutamina, aunque sube la FC y el consumo de O₂ y puede ser perjudicial en el infarto agudo (Marino, p. 43): por eso se vigila. Elegirla para el VD es aplicación del modelo, no una indicación de la fuente. En el modelo, tras 5 h con dobutamina el IC sube a 2,2 y el lactato baja a cerca de 1 mmol/L.', cita: C.dobuta,
      org: REGLA.split(':')[0] + '; la respuesta en horas es del modelo (ilustrativo)',
      comprueba: { txt: 'Compruébalo: dobutamina', ajuste: { dobuta: true }, mira: 'Mira el IC y la FC: la dobutamina sube el gasto y acelera el corazón; el lactato tarda horas (pasa el reloj).', cifras: ['ic', 'fc', 'pam'] } },
    { dia: 'Hora 4 · dolor torácico', prepara: { ...FER, horas: 4, ajuste: { dobuta: true } }, tipo: 'error', ficha: (R) => filaF(R, ['Dolor', 'vuelve el dolor torácico']),
      enunciado: 'Fermín vuelve a tener dolor torácico (SaO₂ 96 %). Otro residente deja escrito el plan. <b>Puede haber 0, 1 o 2 errores.</b>',
      frases: [
        { t: 'Nitroglicerina sublingual por el dolor, como en cualquier infarto.', mal: true, buena: 'La nitroglicerina es venodilatadora y puede ser contraproducente en el infarto del VD (Tabla 20.3: «evitar en infarto de VD»).', cita: NTG },
        { t: 'Sigo con la dobutamina que ya lleva, para sostener el gasto.', cita: C.dobuta },
        { t: 'Oxígeno a 4 L/min, aunque la SaO₂ sea de 96 %.', mal: true, buena: 'El oxígeno suplementario se reserva para la hipoxemia (SaO₂ <90 %); con 96 % no está indicado.', cita: O2 },
        { t: 'No doy más volumen: la PVC ha subido sin ganar IC.', cita: ESC732 }],
      explica: 'La nitroglicerina no se aconseja en el infarto del ventrículo derecho porque sus efectos venodilatadores pueden ser contraproducentes (Marino, pp. 45-46); el oxígeno, solo si hay hipoxemia (Marino, p. 45). La dobutamina sostiene el gasto y el volumen se maneja con juicio (ESC 2026, p. 44).', cita: NTG,
      org: 'El 96 % de SaO₂ es ilustrativo. El modelo no tiene nitroglicerina ni oxígeno: este paso no se puede probar en el monitor. «Parar el volumen si la PVC sube sin ganar gasto» es la aplicación del modelo (ilustrativo), no una indicación de la fuente' },
    { dia: 'Hora 5 · ¿hace falta más?', prepara: { ...FER, horas: 5, ajuste: { dobuta: true } }, tipo: 'test', ficha: (R) => filaF(R, ['Hora', '5 h con dobutamina']),
      enunciado: (R) => `Cinco horas con dobutamina: IC ${c1(R.ic)}, PAM ${R.pam} mmHg y lactato ${c1(R.lact)} mmol/L; el rótulo del monitor marca el estadio SCAI. <b>¿Pasas ya a un soporte mecánico?</b>`,
      opciones: [
        { t: 'No: ha respondido; el soporte se reserva por si no responde.', ok: true },
        { t: 'Sí, un Impella ya: todo shock cardiogénico acaba necesitándolo.', porque: 'La guía lo prevé «cuando esté indicado» (ESC 2026, p. 44). Fermín responde al fármaco: pondría un dispositivo con sus riesgos de sangrado e isquemia de la pierna sin necesidad (Marino, p. 48).' },
        { t: 'Sí, un ECMO: el IC aún no es normal y conviene asegurar el gasto.', porque: 'El ECMO añade poscarga al VI y complicaciones (Marino, p. 48-49). Con el lactato normalizado, Fermín no lo necesita.' },
        { t: 'Es el estadio D: el tratamiento inicial ya ha fallado.', porque: 'D es no responder a las primeras intervenciones (ESC 2026, p. 44); Fermín ha respondido. Escalarlo como D lo expondría a un soporte que no necesita.' }],
      explica: 'El estadio D es «parecido al C, pero empeorando sin responder a las primeras intervenciones»; el soporte circulatorio mecánico entra cuando está indicado (ESC 2026, p. 44). Fermín responde: lactato normal y gasto mejor. Con el fármaco aún puesto, el monitor lo rotula C «en respuesta (regla del modelo)»: la Tabla 13 no define el estadio tras responder, es regla del modelo.', cita: ESC,
      org: REGLA + '. Qué cifras hacen «responder» no las da la fuente: son del modelo (ilustrativo)' },
  ],
  llevas: ['El infarto del VD es shock con la PAM normal si hay hipoperfusión: lo marca el lactato (>2 mmol/L).', 'El volumen se prueba con juicio y se para si la PVC sube sin ganar gasto.', 'Se trata el gasto con un inotrópico; la nitroglicerina no se da.', 'El soporte mecánico se reserva en general para el shock refractario (Marino, p. 45).'],
};

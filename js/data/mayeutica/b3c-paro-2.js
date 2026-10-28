// Mayéutica del bloque 3, sub-bloque 3C · La parada, parte 2 (Marino cap. 21, págs. 64-68): ficha 24 (posresucitación y pronóstico) y
// la tercera parte del caso C5 (Leandro). Datos puros; el formato está en la cabecera de b1-fluidos.js.
// Modelos: ritmoVivo `rce`; shockVivo `posparo` y capilarVivo `reperfusion` (modeloVivo).
const PDF = 'docs/marino-2024-cardiac-disorders-caps18-21.pdf';
const pag = (n, txt) => `<a class="biblio-link" href="${PDF}#page=${n}" target="_blank" rel="noopener">${txt || `PDF pág. ${n}`}</a>`;
const p = n => pag(n, `pág. ${n}`);
// «Ver en la ficha» dentro de una nota (REGLAS §7.9): el enlace cruzado de siempre al párrafo exacto.
const enFicha = (tab, id) => ` <button type="button" class="may-ir" data-especialidad="cardiologia" data-view="merinoCardiologia" data-panel="panel-merino-cardio-tabs" data-tab="${tab}" data-resaltar="#${id}">Ver en la ficha ↗</button>`;
const rv = (clave, texto) => ({ ritmoVivo: clave, texto });
const posparo = { shockVivo: 'posparo', texto: '⚡ El aturdimiento, en el shock vivo' };
const reperfusion = { capilarVivo: 'reperfusion', texto: '🧪 El oxígeno de más, en el capilar vivo' };

export const MAYEUTICA_PARO_2 = {
  /* =================================================================================================
     Ficha 24 · Síndrome posparo y pronóstico neurológico (cap. 21, págs. 64-68)
     ================================================================================================= */
  'mc-posresucitacion': {
    entrada: 'Qué mata después del RCE, por qué el corazón aturdido se recupera, por qué no se da más oxígeno del necesario, qué hacer con la temperatura, la presión y la glucemia, y cuándo y cómo se predice el pronóstico neurológico.',
    guia: [
      { id: 'prp-g1', corto: 'qué mata', tipo: 'test', fuente: 'mc-posparo', modeloVivo: rv('rce', '⚡ El RCE en el corazón eléctrico'),
        enunciado: 'Un paciente recupera el pulso, pero cerca del 70 % de los que sobreviven a la reanimación no sobreviven a la hospitalización. ¿Qué manifestación del síndrome posparo es la más frecuente?',
        opciones: [
          { t: 'El fallo del corazón aturdido, que causa shock cardiogénico en la mayoría', porque: `La disfunción cardíaca puede progresar a shock cardiogénico en horas, pero el aturdimiento suele resolverse en 72 h (${p(65)}). La más frecuente es la lesión cerebral; mirar solo al corazón deja sin vigilar el cerebro.` },
          { t: 'La respuesta inflamatoria: casi universal, y la causa de la mayoría de las muertes', porque: `Es casi universal y puede dar fallo multiorgánico (${p(65)}), pero el libro señala la lesión cerebral como la manifestación más frecuente (${p(64)}); no ordena por frecuencia las otras ni dice que sea la causa de la mayoría de las muertes.` },
          { t: 'La lesión cerebral: responsable del 23-68 % de las muertes tras el paro', ok: true }],
        explicacion: `Tras el RCE hay lesión isquémica por el paro y <span class="hl-azul">lesión de reperfusión</span>. La <span class="hl-rojo">lesión cerebral</span> es la manifestación más frecuente (23-68 % de las muertes); le siguen la disfunción cardíaca y la respuesta inflamatoria sistémica (${p(64)}-65). Cerca del 70 % de los reanimados no sobrevive a la hospitalización (${p(64)}).` },
      { id: 'prp-g2', corto: 'el aturdimiento', tipo: 'test', fuente: 'mc-posparo', modeloVivo: posparo,
        enunciado: 'Predice, y luego lo compruebas en el modelo: el corazón de un paciente reanimado está aturdido y su presión es baja. ¿Cuánto tarda en recuperarse el aturdimiento?',
        opciones: [
          { t: 'Hacia las 72 horas', ok: true },
          { t: 'Unas 6 horas: por la tarde ya no necesitará soporte', porque: `Es demasiado corto: el aturdimiento suele resolverse en 72 h (${p(65)}). Retirar el vasopresor a las 6 h dejaría al paciente hipotenso, con el cerebro dependiente de la presión arterial (${p(67)}).` },
          { t: 'Semanas: es una miocardiopatía establecida', porque: `La fuente lo describe como «aturdimiento», una forma de lesión de reperfusión que suele resolverse en 72 h (${p(65)}). Tratarlo como definitivo llevaría a decisiones de limitación sin base.` }],
        explicacion: `El problema de fondo es el <span class="hl">aturdimiento miocárdico</span> (lesión de reperfusión): disfunción sistólica y diastólica que puede progresar a shock cardiogénico en horas y <span class="hl">suele resolverse en 72 h</span> (${p(65)}).`,
        nota: `<b>La fuente no lo dice así.</b> El libro da el plazo (72 h) pero no la forma de la recuperación; la curva del modelo es <i>ilustrativa</i>. Si a las 72 h el corazón sigue mal, el libro no dice más.` },
      { id: 'prp-g3', corto: 'el oxígeno de más', tipo: 'test', fuente: 'mc-tabla-21-4', modeloVivo: reperfusion,
        enunciado: 'Tras el RCE, la SaO₂ es 97 % con FiO₂ 1,0. ¿Por qué no se mantiene el oxígeno al máximo si la SaO₂ ya es 97 %?',
        opciones: [
          { t: 'Porque el oxígeno en exceso baja la temperatura del paciente y complica el control de la temperatura', porque: `La fuente no relaciona el O₂ con la temperatura. La razón es neurológica: la hiperoxia agrava la lesión (${p(66)}).` },
          { t: 'La hiperoxia agrava la lesión neurológica y las especies reactivas del O₂ la reperfusión', ok: true },
          { t: 'Porque con SaO₂ ≥90 % el cerebro ya no consume oxígeno', porque: `El cerebro sigue consumiéndolo; el O₂ solo se usa para corregir la hipoxemia (SaO₂ <90 %) (${p(66)}). Mantener FiO₂ 1,0 «por seguridad» expone a una lesión añadida.` }],
        explicacion: `La hiperoxia agrava la lesión neurológica tras el paro: el O₂ <span class="hl">solo se usa para corregir la hipoxemia (SaO₂ <90 %)</span>; con 97 % no hay indicación de FiO₂ 1,0 (bajarla es una consecuencia razonable, no una cifra objetivo escrita). Las especies reactivas de oxígeno participan en la lesión de reperfusión, otra razón para limitarlo (${p(66)}).`,
        nota: `<b>La fuente no lo dice.</b> El libro no da una PaO₂ ni una FiO₂ concretas para el posparo: solo el umbral de SaO₂ <90 % (${p(66)}).` },
      { id: 'prp-g4', corto: 'del frío a la normotermia', tipo: 'test', fuente: 'mc-posparo · mc-tabla-21-3',
        enunciado: 'Primero se enfriaba a 32-34 °C; luego se vio que 36 °C era equivalente, y después que 37,5 °C también. ¿Qué enseña esa historia?',
        opciones: [
          { t: 'Que hoy se previene la fiebre del comatoso, sin buscar hipotermia por sí misma', ok: true },
          { t: 'Que 33 °C era peor y debe abandonarse en todos los casos, aunque el paciente esté estable', porque: `El libro dice que 36 °C y 37,5 °C fueron equivalentes a 33 °C, no peores, y que la opción de 33 °C queda sin resolver (${p(65)}-66). Prohibirla no está en la fuente.` },
          { t: 'Que cuanto más frío, mejor, y 32 °C es el objetivo si se puede', porque: `La hipotermia inducida añade riesgos: hipotensión, bradicardia y escalofríos que obligan a sedar o a paralizar (${p(66)}). Y 37,5 °C resultó equivalente a 33 °C (${p(65)}).` }],
        explicacion: `Hipotermia 32-34 °C (2002) → 36 °C equivalente y con menos compromiso hemodinámico → 37,5 °C equivalente. Hoy: <span class="hl">prevenir la fiebre</span> en el superviviente comatoso (${p(65)}).` },
      { id: 'prp-g5', corto: 'la temperatura de 37,9', tipo: 'test', fuente: 'mc-tabla-21-3 · mc-ttm-temp',
        enunciado: 'Abre la calculadora si quieres. Un comatoso tras el RCE tiene 37,9 °C central. ¿Qué haces?',
        opciones: [
          { t: 'Solo paracetamol y bajar la temperatura de la habitación, sin enfriador ni objetivo', porque: `Eso es para mantener ≤37,5 °C; por encima de 37,7 °C ya se inicia el enfriamiento activo (${p(65)}). Con 37,9 °C seguirías subiendo la temperatura de un cerebro que la tolera mal (${p(65)}).` },
          { t: 'Inducir hipotermia a 33 °C durante 24 h', porque: `La guía actual es normotérmica; 33 °C queda sin resolver (${p(66)}) y trae hipotensión, bradicardia y escalofríos.` },
          { t: 'Enfriamiento activo con objetivo 37,5 °C (el de superficie es aceptable)', ok: true }],
        explicacion: `Si la temperatura pasa de <span class="hl-rojo">37,7 °C</span>, se inicia el <span class="hl">enfriamiento activo con objetivo 37,5 °C</span>; el enfriamiento de superficie es aceptable (Tabla 21.3, ${p(65)}-66).` },
      { id: 'prp-g6', corto: 'PAM y vasopresor', tipo: 'test', fuente: 'mc-tabla-21-4',
        enunciado: 'Un paciente hipotenso tras el RCE. ¿Qué PAM buscas en las primeras horas y con qué vasopresor?',
        opciones: [
          { t: 'PAM ≥65 mmHg con adrenalina, porque es la que ya se usaba en la parada', porque: `Hay tendencia a seguir con adrenalina, pero la noradrenalina se asocia a menos muertes cardiovasculares y mejor resultado neurológico (${p(67)}). El 65 es la cifra habitual del shock (cap. 14), no la de aquí.` },
          { t: 'PAM ≥75 mmHg con noradrenalina', ok: true },
          { t: 'PAM ≥90 mmHg con vasopresina, para asegurar la perfusión cerebral', porque: `El libro propone ≥75 como cifra razonable (${p(67)}); no da el 90 ni la vasopresina para este fin.` }],
        explicacion: `La autorregulación cerebral está dañada y el flujo depende de la presión arterial: se trata la hipotensión sin demora (${p(67)}). Una PAM <span class="hl">≥75 mmHg</span> es una consideración razonable en las primeras horas (el libro la da como ejemplo, con estudios observacionales), y la <span class="hl">noradrenalina</span> se prefiere a la adrenalina (${p(66)}-67).`,
        nota: `<b>Nota de fuentes.</b> El ≥65 mmHg habitual del shock es del cap. 14 (${p(67)}); aquí el libro propone ≥75 «como ejemplo». Son dos objetivos de dos contextos: no se elige ganador.` },
      { id: 'prp-g7', corto: 'el calendario del pronóstico', tipo: 'destapa', cuantas: 'son tres momentos', fuente: 'mc-tabla-21-5 · mc-pron-1',
        enunciado: 'Un comatoso tras el RCE. ¿Qué hallazgos clave de la Tabla 21.5 se miran, y cuándo?',
        puntos: [
          `<span class="hl-rojo">Pupilas y córneas</span> abolidas bilateralmente: el <span class="hl">día 4</span>.`,
          `Reflejo <span class="hl-rojo">oculocefálico o nauseoso</span> ausente: el <span class="hl">día 2</span>.`,
          `<span class="hl-rojo">Estatus mioclónico</span>: en cualquier momento.`],
        explicacion: `Los predictores de mal resultado con alto grado de certeza (Tabla 21.5, ${p(67)}-68). Completan la tabla: N20 ausente bilateral, EEG con estatus no convulsivo o supresión con descargas, y TC con edema cerebral difuso.` },
    ],
    examen: [
      { id: 'prp-e1', corto: 'pupilas el día 2', tipo: 'test', fuente: 'mc-tabla-21-5 · mc-pron-1',
        enunciado: 'Día 2 tras el RCE: pupilas arreflécticas bilaterales. Un compañero dice «mal pronóstico seguro». ¿Qué contestas?',
        opciones: [
          { t: 'Tiene razón: la abolición pupilar es un predictor seguro cualquier día', porque: `El criterio pupilar y corneal vale el día 4, no el 2 (${p(67)}). Con ese atajo darías un pronóstico fatal antes de tiempo.` },
          { t: 'Solo si además hay N20 ausente: sin él, nunca vale', porque: `Cada criterio de la Tabla 21.5 predice por separado con alto grado de certeza, cada uno en su momento (${p(67)}); no se exige combinarlos.` },
          { t: 'Aún no: el criterio pupilar vale el día 4; el día 2 solo valen el oculocefálico y el nauseoso', ok: true }],
        explicacion: `Pupilas y córneas bilaterales: <span class="hl">día 4</span>. Oculocefálico y nauseoso: <span class="hl">día 2</span> (Tabla 21.5, ${p(67)}).` },
      { id: 'prp-e2', corto: 'la PAM', tipo: 'test', fuente: 'mc-tabla-21-4',
        enunciado: 'Primeras horas tras el RCE, PAM 66 mmHg con noradrenalina, 1 h tras el pulso. ¿Qué haces?',
        opciones: [
          { t: 'Subir la noradrenalina hasta PAM ≥75 mmHg', ok: true },
          { t: 'Cambiar a adrenalina, que ya se usaba en la parada', porque: `La noradrenalina se prefiere: menos muertes cardiovasculares y mejor resultado neurológico (${p(67)}).` },
          { t: 'Nada: está por encima de 65, que es el objetivo del shock', porque: `Para estos pacientes el libro considera razonable una PAM más alta que la habitual (≥75, «e.g.») en las primeras horas (${p(67)}). Quedarte en 66 deja un cerebro con autorregulación dañada con menos presión de la que necesita.` }],
        explicacion: `Ejemplo del libro: PAM <span class="hl">≥75 mmHg</span> en las primeras horas (${p(67)}).` },
      { id: 'prp-e3', corto: 'glucemia 110', tipo: 'test', fuente: 'mc-tabla-21-4',
        enunciado: 'Tras el RCE, glucemia de 110 mg/dL con insulina. La enfermera dice «bien controlada». ¿Lo es?',
        opciones: [
          { t: 'Sí: lo normal es 80-110 mg/dL y cuanto más estricto sea el control, mejor para el cerebro', porque: `El control estricto da episodios frecuentes de hipoglucemia, que promueve la lesión neurológica (${p(67)}). El libro propone 145-180 mg/dL.` },
          { t: 'No: el objetivo es 145-180 mg/dL; lo muy estricto da hipoglucemias, que agravan la lesión', ok: true },
          { t: 'No: hay que subirla a 250 mg/dL, porque la hiperglucemia protege el cerebro', porque: `La hiperglucemia precoz se asocia a mal resultado neurológico (${p(67)}); lo razonable es 145-180 mg/dL.` }],
        explicacion: `Objetivo razonable <span class="hl">145-180 mg/dL</span>; la hiperglucemia y la hipoglucemia agravan la lesión. Conviene evitar las soluciones IV con dextrosa (${p(67)}).` },
      { id: 'prp-e4', corto: 'T 35 °C tras el RCE', tipo: 'test', fuente: 'mc-tabla-21-3 · mc-ttm-temp',
        enunciado: 'Un comatoso llega a UCI tras el RCE con 35,0 °C central. ¿Qué haces con la temperatura?',
        opciones: [
          { t: 'No recalentar activamente; vigilar y mantener ≤37,5 °C a partir de ahí', ok: true },
          { t: 'Recalentar activamente hasta 37,5 °C, porque la hipotermia es peligrosa', porque: `Una hipotermia leve espontánea (32-36 °C) tras el RCE no se recalienta activamente (${p(65)}). Recalentar a ritmo forzado no es lo que dice la tabla.` },
          { t: 'Enfriarlo más, a 33 °C, para proteger el cerebro', porque: `La guía actual es normotérmica y 33 °C queda sin resolver (${p(66)}); inducir más frío añade hipotensión y escalofríos.` }],
        explicacion: `Si hay hipotermia leve espontánea (32-36 °C) tras el RCE, <span class="hl">no se recalienta activamente</span> (Tabla 21.3, ${p(65)}).` },
      { id: 'prp-e5', corto: 'descerebración', tipo: 'test', fuente: 'mc-pronostico-texto',
        enunciado: 'Un comatoso tras el RCE responde al dolor con postura de descerebración. ¿Qué valor tiene?',
        opciones: [
          { t: 'Predice con alto grado de certeza un mal resultado', porque: `Contra lo que se cree, la respuesta extensora anómala al dolor no es muy predictiva de mala recuperación neurológica (${p(68)}). Retirar medidas por ella sería un error.` },
          { t: 'Solo predice mal resultado si se acompaña de mioclonías precoces', porque: `Las mioclonías precoces son desfavorables pero no descartan la recuperación (${p(68)}); no convierten la descerebración en un predictor.` },
          { t: 'No es muy predictiva de mal resultado, al contrario de la percepción popular', ok: true }],
        explicacion: `La postura de descerebración <span class="hl">no es muy predictiva</span> de mala recuperación (${p(68)}).` },
      { id: 'prp-e6', corto: 'los apuntes del pronóstico', tipo: 'error', fuente: 'mc-tabla-21-5 · mc-despertar · mc-pronostico-texto',
        enunciado: 'Apuntes de un compañero sobre el pronóstico neurológico. Hay dos errores: encuéntralos.',
        frases: [
          { t: 'El estatus mioclónico, en cualquier momento tras el RCE, predice mal resultado con casi total certeza.' },
          { t: 'Las mioclonías precoces son desfavorables, pero no excluyen la recuperación.' },
          { t: 'Si a las 72 h no despierta, el pronóstico es malo: el 80-95 % ya está despierto.', mal: true, c: `Entre los pacientes que recuperan la consciencia, el 80-95 % ya está despierto a las 72 h, pero el resto puede tardar <span class="hl">5 días o más</span>; el tiempo hasta despertar es mal predictor en la primera semana, sobre todo con sedación intensa (${p(68)}).` },
          { t: 'La ausencia bilateral del pico N20 es un predictor de mal resultado.' },
          { t: 'La TC con edema cerebral difuso predice peor resultado si se hace el día 1.', mal: true, c: `Predice peor resultado <span class="hl">sobre todo si está presente el día 2 o después</span> (${p(68)}).` }],
        explicacion: 'Dos errores: dar por malo al que no despierta a las 72 h y situar el edema de la TC el día 1.' },
      { id: 'prp-e7', corto: 'cuánto dura el TTM', tipo: 'test', fuente: 'mc-tabla-21-3',
        enunciado: 'Un comatoso con TTM normotérmico. ¿Hasta cuándo mantienes la temperatura ≤37,5 °C?',
        opciones: [
          { t: 'Durante 24 h fijas, y después se acaba el TTM aunque siga comatoso, sin más control', porque: `La tabla pide ≤37,5 °C durante 72 h (${p(65)}-66); acortarlo a 24 h deja una ventana de fiebre sobre un cerebro lesionado.` },
          { t: 'Durante 72 h desde el RCE, o hasta que el paciente despierte', ok: true },
          { t: 'Hasta salir de la UCI', porque: `El libro no pone el alta de UCI como límite: son 72 h desde el RCE, salvo que despierte antes (${p(66)}).` }],
        explicacion: `Objetivo <span class="hl">≤37,5 °C durante 72 h</span> desde el RCE, o hasta que el paciente despierte (${p(65)}-66).` },
    ],
    casos: [
      { id: 'c5c', titulo: 'Leandro, 49 años: después de la parada', corto: 'Caso · Leandro (el posparo)', sub: 'de la hora 1 al día 4',
        paciente: { Edad: '49 años, varón', Peso: '84 kg', Antecedentes: 'sin cardiopatía conocida', Motivo: 'RCE a las 03:59 tras una FV en planta (día 3 de una pancreatitis aguda)' },
        pasos: [
          { momento: 'Hora 1 · UCI', datos: { Estado: 'comatoso', Constantes: 'PA 84/50 (PAM 61) · FC 110 sinusal', Oxigenación: 'SaO₂ 97 % con FiO₂ 1,0', Temperatura: '35,4 °C (vejiga)', Analítica: 'glucemia 232 mg/dL · lactato 6,0 mmol/L', Ecografía: 'FEVI 30 % · IC 1,9 L/min/m² · PCP 20 mmHg' }, nuevo: ['Estado', 'Constantes', 'Oxigenación', 'Temperatura', 'Analítica', 'Ecografía'],
            pregunta: { id: 'c5c-1', tipo: 'test', fuente: 'mc-tabla-21-4', modeloVivo: posparo,
              enunciado: 'Leandro llega comatoso a UCI con esas cifras. ¿Qué haces con el oxígeno y con la presión?',
              opciones: [
                { t: 'Bajar la FiO₂ hasta SaO₂ 80 % para limitar al máximo las especies reactivas de oxígeno', porque: `El umbral es SaO₂ <90 %: por debajo habría hipoxemia (${p(66)}). Dejarlo en 80 % añade isquemia a un cerebro ya lesionado.` },
                { t: 'Mantener FiO₂ 1,0 por seguridad y subir adrenalina hasta PAM ≥65 mmHg', porque: `La hiperoxia agrava la lesión neurológica: el O₂ es solo para SaO₂ <90 % (${p(66)}); la noradrenalina se prefiere a la adrenalina (${p(67)}) y el objetivo es más alto que 65 (${p(67)}). Con ese plan, Leandro recibiría más O₂ y menos presión de los necesarios.` },
                { t: 'Dar O₂ solo si SaO₂ <90 % y considerar noradrenalina con PAM ≥75 mmHg', ok: true }],
              explicacion: `O₂ solo si SaO₂ <90 % (hiperoxia agrava la lesión neurológica) y PAM <span class="hl">≥75 mmHg</span> como consideración razonable («e.g.»), con <span class="hl">noradrenalina</span> preferida, en las primeras horas (${p(66)}-67).` } },
          { momento: 'Hora 1 · el plan del R1', datos: { Plan: 'la hoja del residente de guardia' }, nuevo: ['Plan'],
            pregunta: { id: 'c5c-2', tipo: 'error', fuente: 'mc-tabla-21-3 · mc-tabla-21-4',
              enunciado: 'El R1 escribe el plan de las primeras horas de Leandro. Hay dos errores: encuéntralos.',
              frases: [
                { t: 'Mantengo la FiO₂ en 1,0 mientras la SaO₂ esté en 97 %, por seguridad.', mal: true, c: `La hiperoxia agrava la lesión neurológica: el O₂ se usa <span class="hl-rojo">solo</span> para SaO₂ <90 % (${p(66)}).` },
                { t: 'Noradrenalina para llevar la PAM a ≥75 mmHg en las primeras horas.' },
                { t: 'Temperatura 35,4 °C: no la recalentaré activamente.' },
                { t: 'Glucemia 232: insulina con objetivo 145-180 mg/dL y sin soluciones con dextrosa.' },
                { t: 'Como vasopresor de elección, adrenalina en infusión, porque ya la usamos en la parada.', mal: true, c: `La <span class="hl">noradrenalina</span> se asocia a menos muertes cardiovasculares y mejor resultado neurológico que la adrenalina (${p(67)}).` }],
              explicacion: 'Dos errores: la FiO₂ innecesariamente alta y la adrenalina como vasopresor.' } },
          { momento: 'Hora 30 · fiebre', datos: { Temperatura: '38,0 °C (vejiga)', Constantes: 'PA 104/62 (PAM 76) con noradrenalina 5 µg/min', Ecografía: 'FEVI 45 % · IC 2,4 L/min/m² · PCP 15 mmHg' }, nuevo: ['Temperatura', 'Constantes', 'Ecografía'], calculadora: { ir: 'mc-ttm-temp', nombre: 'Control de la temperatura' },
            pregunta: { id: 'c5c-3', tipo: 'test', fuente: 'mc-tabla-21-3 · mc-ttm-temp', modeloVivo: posparo,
              enunciado: 'Abre la calculadora si quieres. La temperatura de Leandro sube a 38,0 °C. La enfermera dice «con 37,6 no habríamos usado el enfriador». ¿Qué toca ahora?',
              opciones: [
                { t: 'Enfriamiento activo de superficie, objetivo 37,5 °C, hasta 72 h desde el RCE', ok: true },
                { t: 'Solo paracetamol y bajar la temperatura de la habitación, todavía sin enfriador activo', porque: `Eso es hasta 37,7 °C (${p(65)}). A 38,0 °C la fiebre puede agravar la lesión isquémica (${p(65)}).` },
                { t: 'Hipotermia inducida a 33 °C, porque la guía la deja como opción', porque: `La guía actual es normotérmica (${p(66)}). La opción de 33 °C queda sin resolver y añade hipotensión y escalofríos.` }],
              explicacion: `Por encima de <span class="hl-rojo">37,7 °C</span>, enfriamiento activo con objetivo 37,5 °C; el de superficie es aceptable, hasta 72 h desde el RCE o hasta que despierte (Tabla 21.3, ${p(65)}-66). Con 37,6 °C: paracetamol y ambiente.` } },
          { momento: 'Hora 30 · la familia', datos: { Pregunta: 'la mujer de Leandro: «ayer estaba en shock y hoy mejora; ¿se ha curado el corazón?»' }, nuevo: ['Pregunta'],
            pregunta: { id: 'c5c-4', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'mc-posparo', modeloVivo: posparo,
              enunciado: 'Le explicas a la familia por qué el corazón de Leandro está mejor. ¿Qué le cuentas?',
              puntos: [
                `Fue un <span class="hl">aturdimiento</span> del corazón, una forma de lesión de reperfusión (${p(65)}).`,
                `Puede <span class="hl-rojo">progresar a shock cardiogénico</span> en las primeras horas, por eso se vigila la presión (${p(65)}).`,
                `Suele <span class="hl-verde">resolverse en unas 72 h</span> (${p(65)}).`],
              explicacion: `Disfunción sistólica y diastólica por aturdimiento, que suele resolverse en 72 h (${p(65)}). Si siguiera mal a las 72 h, el libro no dice más.` } },
          { momento: 'Día 2 · hora 40 · mioclonías', datos: { Exploración: 'mioclonías precoces breves', Pregunta: 'un compañero: «esto es un estatus mioclónico: hablad con la familia»' }, nuevo: ['Exploración', 'Pregunta'],
            pregunta: { id: 'c5c-5', tipo: 'test', fuente: 'mc-pronostico-texto · mc-tabla-21-5',
              enunciado: 'Es el giro. ¿Qué le respondes al compañero?',
              opciones: [
                { t: 'Tiene razón: las mioclonías precoces predicen mal resultado con certeza y hay que avisar a la familia', porque: `Las mioclonías precoces son desfavorables, pero no eliminan la posibilidad de recuperación (${p(68)}). Hablar de pronóstico fatal ahora sería prematuro.` },
                { t: 'Las mioclonías precoces no excluyen la recuperación; el estatus mioclónico sí, y hoy valen el oculocefálico y el nauseoso', ok: true },
                { t: 'Hay que mirar ya las pupilas y las córneas: si están abolidas, es definitivo', porque: `Pupilas y córneas valen el día 4 (${p(67)}). Hoy (día 2) solo valen los reflejos oculocefálico y nauseoso.` }],
              explicacion: `Las mioclonías precoces son <span class="hl-rojo">desfavorables, pero no excluyen la recuperación</span>; el <span class="hl">estatus mioclónico</span> sí predice mal resultado con casi 100 % de certeza (${p(68)}). Día 2: reflejos oculocefálico y nauseoso; día 4: pupilas y córneas (${p(67)}).` } },
          { momento: 'Día 4 · despierta', datos: { Estado: 'abre los ojos y obedece órdenes', Constantes: 'PA 118/70 (PAM 86) sin noradrenalina', Ecografía: 'FEVI 55 % · IC 2,9 L/min/m² · PCP 10 mmHg' }, nuevo: ['Estado', 'Constantes', 'Ecografía'],
            pregunta: { id: 'c5c-6', tipo: 'test', fuente: 'mc-despertar',
              enunciado: 'Leandro despierta el día 4, pasadas las 72 h. ¿Qué enseña?',
              opciones: [
                { t: 'Que el despertar puede tardar 5 días o más, y el tiempo hasta despertar es un mal predictor en la primera semana', ok: true },
                { t: 'Que lo normal es despertar a las 72 h: pasado ese tiempo, el despertar ya es excepcional y no hay que esperar más', porque: `Entre los que recuperan la consciencia, el 80-95 % ya está despierto a las 72 h, pero algunos tardan 5 días o más (${p(68)}). Retirar medidas a las 72 h dejaría sin oportunidad a quien tarda más.` },
                { t: 'Que despertó porque se le enfrió a 33 °C', porque: `El caso lleva normotermia, ≤37,5 °C, que resultó equivalente a 33 °C (${p(65)}).` }],
              explicacion: `El 80-95 % de los que recuperan la consciencia está despierto a las 72 h, pero puede tardar <span class="hl">5 días o incluso más</span>; el tiempo hasta despertar es mal predictor en la primera semana (${p(68)}).` } },
        ],
        lleva: [
          'Tras el RCE: O₂ solo para SaO₂ <90 %, PAM ≥75 con noradrenalina y glucemia 145-180 sin dextrosa.',
          'Temperatura: no recalentar de 32-36 °C; por encima de 37,7 °C, enfriamiento activo con objetivo 37,5 °C hasta 72 h o hasta que despierte.',
          'Mioclonías precoces no son un estatus mioclónico; pupilas y córneas, el día 4. Espera: despertar puede tardar 5 días o más.'],
        volver: { nombre: 'Predicción de la recuperación neurológica', ancla: 'mc-pronostico-texto', modeloVivo: posparo } },
    ],
    profundizar: [
      { id: 'mc-pronostico-texto', titulo: 'EEG isoeléctrico y TC en el pronóstico (texto del capítulo)' },
      { id: 'mc-rcp-percepcion-texto', titulo: 'Una palabra final: percepción frente a realidad' },
    ],
  },
};

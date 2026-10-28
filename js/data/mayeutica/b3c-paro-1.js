// Mayéutica del bloque 3, sub-bloque 3C · La parada, parte 1 (Marino cap. 21, págs. 55-64): fichas 22 (soporte vital) y 23
// (monitorización) y sus dos partes del caso C5 (Leandro). Datos puros; el formato está en la cabecera de b1-fluidos.js.
// La ficha es js/modules/cardiologia/merino-cardiologia.html. Modelo vivo: ritmoVivo, claves fv, aesp, rce, fv:rcp, fv:rcp-adre,
// fv:rcp-insufl (js/data/ritmo-vivo-data.js); capilarVivo capno-rcp; circulación viva, escenario derrame.
const PDF = 'docs/marino-2024-cardiac-disorders-caps18-21.pdf';
const pag = (n, txt) => `<a class="biblio-link" href="${PDF}#page=${n}" target="_blank" rel="noopener">${txt || `PDF pág. ${n}`}</a>`;
const p = n => pag(n, `pág. ${n}`);
const AHA = `<a class="biblio-link" href="docs/aha-2025-parte9-soporte-vital-avanzado.pdf#page=1" target="_blank" rel="noopener">AHA 2025, Parte 9, pág. 1</a>`;
// «Ver en la ficha» dentro de una nota (REGLAS §7.9): el enlace cruzado de siempre al párrafo exacto.
const enFicha = (tab, id) => ` <button type="button" class="may-ir" data-especialidad="cardiologia" data-view="merinoCardiologia" data-panel="panel-merino-cardio-tabs" data-tab="${tab}" data-resaltar="#${id}">Ver en la ficha ↗</button>`;
const rv = (clave, texto) => ({ ritmoVivo: clave, texto });
const capno = { capilarVivo: 'capno-rcp', texto: '🩸 La capnografía en la RCP, en el capilar vivo' };
const eco = (escenario, texto) => ({ ecoEscenario: escenario, ecoVista: 'a4c', texto });

export const MAYEUTICA_PARO_1 = {
  /* =================================================================================================
     Ficha 22 · Paro cardíaco: soporte vital básico y avanzado (cap. 21, págs. 55-62)
     ================================================================================================= */
  'mc-paro-soporte': {
    entrada: 'Por qué cada minuto sin choque cuenta, qué cambian la adrenalina y las insuflaciones de más en la presión que riega el corazón, qué se da tras cada choque y qué se busca si no hay ritmo para desfibrilar.',
    guia: [
      { id: 'prs-g1', corto: 'los 4 minutos', tipo: 'test', fuente: 'mc-svb-tiempo · mc-tabla-21-1', modeloVivo: rv('fv', '⚡ La FV en el corazón eléctrico'),
        enunciado: 'Un paciente deja de tener flujo sanguíneo. Antes de leer: ¿por qué la muerte celular por falta de oxígeno se espera a los 4-5 min y no a los 20?',
        opciones: [
          { t: 'El cuerpo guarda unos 20 min de glucosa, y el cerebro la consume despacio', porque: `La fuente no habla de glucosa: da la cuenta del oxígeno (${p(56)}). Si esperas 20 min de margen, retrasarás el choque, y con él caen las posibilidades: 40 % al llegar a los 5 min, menos del 10 % a los 20 (${p(58)}).` },
          { t: 'El frío del paro baja el consumo de O₂ en todos los pacientes, y por eso se aguanta hasta ese punto', porque: `Solo en el ahogamiento en agua fría el frío reduce el consumo y alarga la ventana (${p(56)}). Si lo generalizas, darás por «tranquilo» a un paciente que en planta lleva 5 min sin flujo.` },
          { t: 'Hay ~1 L de O₂ en el cuerpo y se gastan ~250 mL/min: se agota en unos 4 min', ok: true }],
        explicacion: `El contenido total de O₂ del adulto es <span class="hl">~1 L</span> y el consumo en reposo ~<span class="hl">250 mL/min</span>: tras cesar el flujo quedan ~4 min, y la muerte celular anóxica se espera a los <span class="hl-rojo">4-5 min</span>. Excepción: el ahogamiento en agua fría (${p(56)}). Por eso la «necesidad de velocidad».` },
      { id: 'prs-g2', corto: 'el reloj del choque', tipo: 'test', fuente: 'mc-desfibrilacion · mc-fig-21-1', modeloVivo: rv('fv', '⚡ Compruébalo: la FV y el minuto del choque'),
        enunciado: 'Predice, y luego lo compruebas en el modelo: en 1.667 paros extrahospitalarios con FV o TV sin pulso, el primer choque llega a los 10 min del colapso. ¿Qué proporción sobrevive?',
        opciones: [
          { t: 'Un 29 %: ha bajado desde el 40 % de los 5 min', ok: true },
          { t: 'Un 9 %, como si hubiera esperado 20 min', porque: `El «menos del 10 %» es el de los 20 min (${p(58)}). A los 10 min la curva todavía no ha tocado fondo: aún se gana mucho con rapidez.` },
          { t: 'Un 40 %, igual que si el choque hubiera llegado a los 5 min', porque: `El 40 % es el de los 5 min (${p(58)}). Si no cuentas el tiempo, creerás que da igual tardar: cada minuto sin choque se paga en supervivencia.` }],
        explicacion: `La supervivencia cae con el tiempo hasta el primer choque (Fig. 21.1, ${p(59)}): <span class="hl">40 % a los 5 min</span> y <span class="hl-rojo">menos del 10 % a los 20</span> (texto, ${p(58)}). Los 29 %, 19 % y 9 % de los 10, 15 y 20 min son <i>lectura de la figura</i>.`,
        nota: `<b>Nota de fidelidad.</b> El texto del libro solo da el 40 % (5 min) y el «menos del 10 %» (20 min); los valores intermedios se leen de la Fig. 21.1 (${p(59)}). ${enFicha('mc-paro-soporte', 'mc-fig-21-1')}` },
      { id: 'prs-g3', corto: 'el triple de insuflaciones', tipo: 'test', fuente: 'mc-insuflaciones · mc-tabla-21-2', modeloVivo: rv('fv:rcp-insufl', '⚡ Compruébalo: de 10 a 30 insuflaciones por minuto'),
        enunciado: 'Predice: tras intubar, el que ventila pasa de 10 a 30 insuflaciones por minuto «para oxigenar mejor». ¿Qué pasa con el retorno venoso, con la presión que riega las coronarias y con la ETCO₂?',
        opciones: [
          { t: 'Entra más oxígeno y llega más sangre al corazón: la presión coronaria y la ETCO₂ suben a la vez', porque: `Al revés. No da tiempo a vaciar el pulmón: hiperinsuflación y PEEP intrínseca, que reducen el retorno venoso y la presión de perfusión coronaria (${p(58)}). Seguirías ventilando de más mientras el corazón recibe menos sangre.` },
          { t: 'Menos retorno venoso y menos presión coronaria; en el modelo, la ETCO₂ baja de 20 a 13', ok: true },
          { t: 'Nada: el volumen total por minuto lo compensa si cada insuflación es pequeña', porque: `El problema no es el volumen por insuflación, sino que no hay tiempo para que el pulmón se vacíe entre una y otra (${p(58)}). Una frecuencia triple deja a la RCP con menos gasto aunque cada insuflación sea correcta.` }],
        explicacion: `Se han descrito rondas de <span class="hl-rojo">30 insuflaciones/min</span> (3 veces lo recomendado): no hay tiempo de vaciado, hay hiperinsuflación y «PEEP intrínseca», con <span class="hl">dos efectos</span>: baja el retorno venoso y baja la presión de perfusión coronaria (${p(58)}). La ETCO₂ sigue al gasto cuando la ventilación es constante (${p(62)}); al cambiar la ventilación deja de medir solo el gasto.`,
        nota: `<b>La fuente no lo dice así.</b> Marino describe los dos efectos (${p(58)}) pero no da cifras de presión coronaria ni de ETCO₂ con 30/min: el 13 mmHg y los 18 mmHg del modelo son <i>ilustrativos</i>.` },
      { id: 'prs-g4', corto: 'tras cada choque', tipo: 'test', fuente: 'mc-desfibrilacion',
        enunciado: 'FV que no cede. ¿Qué fármaco entra tras el 2.º choque fallido y cuál tras el 3.º, y con qué dosis?',
        opciones: [
          { t: 'Tras el 2.º, adrenalina 1 mg IV/IO cada 3-5 min; tras el 3.º, amiodarona 300 mg y luego 150', ok: true },
          { t: 'Tras el 2.º, amiodarona 300 mg en bolo; tras el 3.º, adrenalina 1 mg cada 3-5 min', porque: `Está cambiado el orden. La adrenalina entra al necesitar el 2.º choque y la amiodarona al necesitar el 3.º (${p(59)}). Con ese orden retrasarías el vasopresor y gastarías el antiarrítmico antes de tiempo.` },
          { t: 'Adrenalina y amiodarona juntas tras el 1.er choque, para no perder tiempo', porque: `El primer choque va solo, con 2 min de compresiones después (${p(59)}). Los fármacos entran por escalones, uno por cada choque fallido.` }],
        explicacion: `Hasta 3 choques (el 1.º de 120-200 J bifásico). Tras el 2.º: <span class="hl">adrenalina 1 mg IV/IO cada 3-5 min</span> durante toda la reanimación. Tras el 3.º: <span class="hl">amiodarona 300 mg</span> y, si hace falta, 150 mg; sin amiodarona, lidocaína 1-1,5 mg/kg, luego 0,5-0,75 mg/kg cada 5-10 min, máximo 3 mg/kg (${p(59)}).` },
      { id: 'prs-g5', corto: 'las T de la AESP', tipo: 'destapa', cuantas: 'son cuatro causas', fuente: 'mc-aesp · mc-r5-nota-t-aesp',
        enunciado: 'El monitor muestra un ritmo organizado, pero no hay pulso: AESP. No se desfibrila. ¿Qué causas reversibles buscas, según el texto del capítulo?',
        puntos: [
          `<span class="hl-rojo">Neumotórax a tensión</span> (la «T» de Tensión).`,
          `<span class="hl-rojo">Taponamiento</span> pericárdico.`,
          `<span class="hl-rojo">Tromboembolismo</span> venoso.`,
          `<span class="hl-rojo">Trombosis</span> de las coronarias (oclusión trombótica).`],
        explicacion: `Texto del capítulo (${p(60)}): 4 «T». No hay tiempo para un estudio, pero la ecografía a pie de cama ayuda a descubrir algunas. La intervención principal es la adrenalina con la misma pauta; no se desfibrila salvo que el ritmo pase a FV o TV (${p(60)}).`,
        nota: `<b>Las fuentes discrepan.</b> El texto enumera 4 «T» (${p(60)}); el algoritmo de la Fig. 21.2 (${p(61)}) añade los Tóxicos, las «H» y la hipotermia. No se elige una. ${enFicha('mc-paro-soporte', 'mc-r5-nota-t-aesp')}` },
      { id: 'prs-g6', corto: 'lo que da la adrenalina', tipo: 'test', fuente: 'mc-epinefrina-paro · mc-fig-21-3', modeloVivo: rv('fv:rcp-adre', '⚡ Compruébalo: la adrenalina y la presión coronaria'),
        enunciado: 'Predice, y luego lo compruebas en el monitor: das 1 mg de adrenalina IV en plena RCP. ¿Qué pasa con la presión de perfusión coronaria y cuánto dura el efecto?',
        opciones: [
          { t: 'Se duplica y dura 20 min, hasta el siguiente choque', porque: `Es mucho más de lo que dice el libro: alrededor de un 30 % más y al menos 3 min (${p(62)}). Si esperas 20 min de efecto, no repetirás la dosis y la presión volverá a su sitio.` },
          { t: 'No cambia: la adrenalina actúa sobre el ritmo, no sobre la presión', porque: `Su beneficio viene de la vasoconstricción sistémica, que sube el flujo cerebral y coronario por aumento de la presión coronaria (${p(61)}-62). Pensar que solo «activa el ritmo» lleva a esperar un choque que no llega.` },
          { t: 'Sube alrededor de un 30 % durante al menos 3 min', ok: true }],
        explicacion: `La presión de perfusión coronaria es la aórtica menos la de la aurícula derecha entre compresiones. Tras la adrenalina IV sube <span class="hl">un 30 %</span> y el efecto dura <span class="hl">al menos 3 min</span>, el intervalo recomendado entre dosis (${p(62)}).`,
        nota: `<b>Las fuentes discrepan.</b> El texto da un 30 % (${p(62)}); la Fig. 21.3, en la misma página, se lee de unos 22 a unos 33 mmHg, algo más de un 30 %. El libro no lo aclara. ${enFicha('mc-paro-soporte', 'mc-fig-21-3')}` },
      { id: 'prs-g7', corto: 'sube el RCE, ¿y la supervivencia?', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'mc-epinefrina-paro · mc-fig-21-3',
        enunciado: 'El adjunto dice: «la adrenalina sube el retorno de la circulación, pero no garantiza que el paciente sobreviva». ¿Qué le sustenta?',
        puntos: [
          `Aumenta la tasa de <span class="hl">retorno de la circulación espontánea</span>, pero la mayoría de los estudios no muestran mejor supervivencia (${p(60)}).`,
          `Solo un estudio mostró más supervivencia a 30 días, y <span class="hl-rojo">muchos supervivientes no estaban mentalmente íntegros</span> (${p(60)}).`,
          `La estimulación cardíaca <span class="hl-azul">mediada por receptores β</span> puede borrar el beneficio de la mayor perfusión coronaria y se ha implicado en la insuficiencia cardíaca posresucitación (${p(62)}).`],
        explicacion: `Es el único fármaco de soporte circulatorio de la RCP (${p(60)}), pero lo que sube es el RCE, no necesariamente el alta con buen estado funcional (Tabla 21.1, ${p(55)}).` },
    ],
    examen: [
      { id: 'prs-e1', corto: 'la energía del 1.º', tipo: 'test', fuente: 'mc-desfibrilacion',
        enunciado: 'FV con un desfibrilador manual bifásico. ¿Con qué energía das el primer choque?',
        opciones: [
          { t: '360 J desde el primero, para no perder tiempo con un choque fallido', porque: `Los 360 J son el extremo alto del rango efectivo, reservado a FV recurrente o resistente (${p(59)}). Empezar por ahí no está en la pauta: el 1.º va con 120-200 J y se sube si no funciona (${p(59)}).` },
          { t: '120-200 J, o la que indique el fabricante', ok: true },
          { t: 'Una energía fija; ningún desfibrilador permite subirla entre choques', porque: `Solo los desfibriladores externos automáticos suelen dar energía fija: otros permiten elegirla, y se sube en los choques siguientes si el aparato lo permite (${p(59)}).` }],
        explicacion: `Choque inicial <span class="hl">120-200 J bifásico</span> (o según el fabricante); si no funciona, mayor energía en los siguientes si el aparato lo permite. Los bifásicos convierten a menos energía que los monofásicos (rango efectivo 100-360 J) (${p(59)}).` },
      { id: 'prs-e2', corto: 'tras el choque', tipo: 'test', fuente: 'mc-desfibrilacion',
        enunciado: 'Acabas de dar el 1.er choque y el monitor muestra un ritmo organizado. ¿Qué haces?',
        opciones: [
          { t: 'Parar y palpar el pulso carotídeo 10 s para decidir si hace falta dar otro choque enseguida', porque: `La pauta es reanudar las compresiones de inmediato y esperar al menos 2 min antes de mirar el ritmo (${p(59)}). Cada pausa para palpar es compresión que no riega el corazón; además, palpar tiene baja sensibilidad (${p(62)}).` },
          { t: 'Dar ya adrenalina 1 mg y comprobar el ritmo después', porque: `La adrenalina entra al necesitar el 2.º choque, no tras el primero (${p(59)}). Y lo primero tras el choque son las compresiones.` },
          { t: 'Reanudar las compresiones de inmediato; al menos 2 min antes de volver a mirar el ritmo', ok: true }],
        explicacion: `Las compresiones se pausan solo para el choque y se reanudan al instante: <span class="hl">al menos 2 min ininterrumpidos</span> antes de comprobar el ritmo (${p(59)}).` },
      { id: 'prs-e3', corto: 'los apuntes de la RCP', tipo: 'error', fuente: 'mc-tabla-21-2 · mc-svb-tiempo',
        enunciado: 'Apuntes de un compañero sobre el soporte vital básico. Hay dos errores: encuéntralos.',
        frases: [
          { t: 'Las compresiones empiezan en menos de 10 s desde que detectas la ausencia de pulso.' },
          { t: 'Cada compresión baja el tercio inferior del esternón 5-6 cm y deja que el tórax recupere del todo.' },
          { t: 'Frecuencia de 100-120/min; con el paciente intubado, una insuflación cada 6 s sin parar las compresiones.' },
          { t: 'Se releva a quien comprime cada 5 min, para que no se canse.', mal: true, c: `El relevo es <span class="hl-rojo">cada 2 min</span>: la fatiga baja la profundidad de la compresión (${p(56)}-57).` },
          { t: 'Hasta conectar el desfibrilador, se pausa cada 2 min para palpar el pulso.', mal: true, c: `Las compresiones <span class="hl">continúan sin interrupción hasta conectar el desfibrilador</span>; las interrupciones pueden suponer hasta el 50 % del tiempo y se asocian a peores resultados (${p(56)}-57).` }],
        explicacion: 'Dos errores: el relevo es cada 2 min, no cada 5, y no se pausa para palpar antes de tener el desfibrilador.' },
      { id: 'prs-e4', corto: 'el acceso', tipo: 'test', fuente: 'mc-acceso-paro',
        enunciado: 'Compresiones en marcha y sin vía. ¿Qué acceso eliges y con qué condición?',
        opciones: [
          { t: 'Intraósea: se pone sin interrumpir las compresiones y es más segura que una periférica', ok: true },
          { t: 'Esperar al 2.º choque para canalizar y dar adrenalina por la misma vía', porque: `La adrenalina no puede esperar a una vía que se busque tarde: el acceso se establece con las compresiones en marcha desde el principio (${p(58)}).` },
          { t: 'Una vía central yugular, pidiendo que se paren 1-2 min las compresiones mientras se canaliza', porque: `Se debe establecer sin interrumpir las compresiones (${p(58)}). Parar 2 min por una central es perder el riego del corazón; la central no figura entre las opciones del capítulo.` }],
        explicacion: `El acceso periférico es adecuado, pero el <span class="hl">intraóseo</span> suele preferirse: se pone sin interrumpir las compresiones y es más seguro que una vía periférica (${p(58)}).` },
      { id: 'prs-e5', corto: 'tres choques fallidos', tipo: 'test', fuente: 'mc-desfibrilacion',
        enunciado: 'Tres desfibrilaciones sin convertir la FV. ¿Qué pronóstico tiene y qué consideras?',
        opciones: [
          { t: 'Igual que tras el 1.º: la probabilidad de buen resultado no depende de cuántos choques fallen', porque: `Fallar 3 choques tiene muy mal pronóstico: solo un 5 % de resultado satisfactorio (${p(59)}-60). Ignorarlo retrasa la decisión de escalar.` },
          { t: 'Un 5 % de buen resultado; considera la ECMO si hay equipo las 24 h', ok: true },
          { t: 'Un 29 %, porque las cifras mejoran con la amiodarona', porque: `El 29 % es la supervivencia con el primer choque a los 10 min (${p(59)}), otra pregunta. Tras 3 choques fallidos el libro da un 5 %.` }],
        explicacion: `El fallo de tres choques tiene muy mal pronóstico: <span class="hl-rojo">solo un 5 %</span> de resultado satisfactorio. Se han descrito mejores resultados con la ECMO de urgencia en la FV/TV resistente: es una opción si se dispone de ella durante las 24 h (${p(59)}-60).` },
      { id: 'prs-e6', corto: 'cuánto aprietas la bolsa', tipo: 'test', fuente: 'mc-insuflaciones',
        enunciado: 'Ventilas con una bolsa de 1 L. ¿Cuánto la comprimes para dar el volumen recomendado?',
        opciones: [
          { t: 'Hasta la mitad de la bolsa (~500 mL)', ok: true },
          { t: 'Hasta vaciarla: 1 L por insuflación asegura que el tórax suba', porque: `El volumen recomendado es 500-600 mL, o el que eleve visiblemente el tórax (${p(57)}). Insuflar 1 L es un volumen grande, frecuente en la RCP, que puede dañar el pulmón.` },
          { t: 'Con las dos manos y hasta un tercio, unos 300 mL', porque: `Se queda por debajo de lo recomendado: 500-600 mL (${p(57)}). El tórax apenas subirá y el paciente no se ventilará lo necesario.` }],
        explicacion: `Volumen recomendado <span class="hl">500-600 mL</span>. Con una bolsa de 1 L, comprimir hasta la mitad da ~500 mL; con una mano, 600-700 mL (observación personal del autor), un rango que no suele dar insuflaciones problemáticas (${p(57)}).` },
      { id: 'prs-e7', corto: 'AESP: ¿choque?', tipo: 'test', fuente: 'mc-aesp · mc-epinefrina-paro',
        enunciado: 'Parada sin pulso con un ritmo organizado a 60 lpm en el monitor. Un compañero quiere dar un choque de 200 J «por si hay FV debajo». ¿Qué le contestas?',
        opciones: [
          { t: 'Que dé el choque: un ritmo organizado en el monitor puede esconder una FV por debajo', porque: `En la AESP no se desfibrila salvo que el ritmo pase a FV o TV (${p(60)}). Perderías tiempo de compresiones con un choque que no está indicado.` },
          { t: 'No: en la AESP no se da adrenalina hasta el 2.º ciclo', porque: `La adrenalina es la intervención principal y se da con la misma pauta que en la FV/TV: 1 mg cada 3-5 min (${p(60)}).` },
          { t: 'No: compresiones y adrenalina 1 mg cada 3-5 min; choque solo si pasa a FV/TV', ok: true }],
        explicacion: `AESP y asistolia: <span class="hl">vasopresor (adrenalina) con la misma pauta</span> que en FV/TV sin pulso; no se desfibrila salvo que cambie a FV/TV; se buscan las «T» (${p(60)}).` },
    ],
    casos: [
      { id: 'c5a', titulo: 'Leandro, 49 años: la FV en planta', corto: 'Caso · Leandro (la FV)', sub: 'minutos 0-14 de una parada presenciada',
        paciente: { Edad: '49 años, varón', Peso: '84 kg', Antecedentes: 'sin cardiopatía conocida', Motivo: 'Día 3 de una pancreatitis aguda, en planta' },
        pasos: [
          { momento: '03:40 · el colapso', datos: { Situación: 'no responde, sin pulso', Monitor: 'fibrilación ventricular', Tiempo: 'colapso presenciado hace 3 min' }, nuevo: ['Situación', 'Monitor', 'Tiempo'],
            pregunta: { id: 'c5a-1', tipo: 'test', fuente: 'mc-tabla-21-2 · mc-svb-tiempo · mc-fig-21-1', modeloVivo: rv('fv', '⚡ La FV en el corazón eléctrico'),
              enunciado: 'Leandro no responde y no hay pulso. Está en FV. ¿Qué haces primero?',
              opciones: [
                { t: 'Palpar el pulso carotídeo unos 30 s para estar seguro antes de empezar a comprimir el esternón', porque: `La orden es empezar las compresiones en menos de 10 s desde que detectas la ausencia de pulso (${p(56)}). Medio minuto de duda es medio minuto sin riego, con ~4 min de oxígeno en el cuerpo (${p(56)}).` },
                { t: 'Comprimir 5-6 cm a 100-120/min en menos de 10 s y pedir ya el desfibrilador, con 30:2', ok: true },
                { t: 'Buscar primero la causa de la FV: la pancreatitis puede explicarla', porque: `Aunque la causa importe, la urgencia es el flujo: la supervivencia pasa del 40 % si el primer choque llega a los 5 min a menos del 10 % a los 20 (${p(58)}). La ficha no da la causa de la FV de Leandro.` }],
              explicacion: `Compresiones en <span class="hl">menos de 10 s</span>, 5-6 cm, 100-120/min, ciclos 30:2 y compresiones continuas hasta conectar el desfibrilador (${p(56)}). Cada minuto cuenta: 40 % si el choque llega a los 5 min, menos del 10 % a los 20 (${p(58)}).` } },
          { momento: 'Minuto 3 · 1.er y 2.º choque', datos: { Choque: '1.er choque 150 J bifásico y 2 min de compresiones', Monitor: 'sigue en FV; 2.º choque' }, nuevo: ['Choque', 'Monitor'],
            pregunta: { id: 'c5a-2', tipo: 'test', fuente: 'mc-desfibrilacion · mc-epinefrina-paro', modeloVivo: rv('fv:rcp-adre', '⚡ La adrenalina en la RCP: la presión coronaria'),
              enunciado: 'Leandro sigue en FV tras el 1.er choque y se prepara el 2.º. ¿Qué empiezas ahora, y con qué pauta?',
              opciones: [
                { t: 'Amiodarona 300 mg, porque ya son dos choques fallidos y toca pasar al antiarrítmico', porque: `La amiodarona entra al necesitar el 3.er choque (${p(59)}). Darla ahora adelanta un antiarrítmico y deja a Leandro sin el vasopresor que sube su presión coronaria.` },
                { t: 'Adrenalina 1 mg una sola vez: más dosis no aportan', porque: `La adrenalina se repite cada 3-5 min durante toda la reanimación (${p(59)}). Con una sola dosis perderías el efecto a los 3 min (${p(62)}).` },
                { t: 'Adrenalina 1 mg IV/IO, repetida cada 3-5 min mientras dure la reanimación', ok: true }],
              explicacion: `Al necesitar el 2.º choque entra la <span class="hl">adrenalina 1 mg IV/IO cada 3-5 min</span> durante toda la reanimación (${p(59)}). Sube la presión coronaria alrededor de un 30 % durante al menos 3 min (${p(62)}).`,
              nota: `<b>Las fuentes discrepan.</b> El texto da un 30 % (${p(62)}); la Fig. 21.3 se lee de ~22 a ~33 mmHg. El libro no lo aclara.` } },
          { momento: 'Minuto 9 · intubado', datos: { Vía: 'intraósea', Ventilación: 'bolsa a 30 insuflaciones/min', Capnografía: 'ETCO₂ 13 mmHg', Plan: 'el plan del R1 de guardia' }, nuevo: ['Vía', 'Ventilación', 'Capnografía', 'Plan'],
            pregunta: { id: 'c5a-3', tipo: 'error', fuente: 'mc-insuflaciones · mc-acceso-paro · mc-desfibrilacion', modeloVivo: rv('fv:rcp-insufl', '⚡ Compruébalo: 30 insuflaciones/min'),
              enunciado: 'El R1 lee su plan en voz alta. Hay dos errores: encuéntralos.',
              frases: [
                { t: 'Ventilar a 30/min, para oxigenar mejor.', mal: true, c: `Son <span class="hl-rojo">3 veces</span> lo recomendado (10/min, una cada 6 s): hiperinsuflación y PEEP intrínseca, menos retorno venoso y menos presión coronaria (${p(58)}). La ETCO₂ en 13 lo refleja.` },
                { t: 'Seguir con la vía intraósea sin parar las compresiones.' },
                { t: 'Tras el 3.er choque, amiodarona 300 mg y, si hace falta, 150 mg.' },
                { t: 'Si no hubiera amiodarona, lidocaína 1-1,5 mg/kg.' },
                { t: 'Comprobar el pulso tras cada choque antes de seguir.', mal: true, c: `Tras el choque se reanudan las compresiones de inmediato y <span class="hl">al menos 2 min</span> antes de comprobar el ritmo (${p(59)}).` }],
              explicacion: 'Dos errores: la frecuencia triple de insuflaciones y palpar el pulso tras cada choque.' } },
          { momento: 'Minuto 12 · 3.er choque', datos: { Choque: '3.er choque fallido', Fármaco: 'amiodarona 300 mg IO', Monitor: 'sigue en FV' }, nuevo: ['Choque', 'Fármaco', 'Monitor'],
            pregunta: { id: 'c5a-4', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'mc-desfibrilacion',
              enunciado: 'Leandro sigue en FV tras el 3.er choque y la amiodarona. El adjunto pregunta qué sigue y qué pronóstico tiene. ¿Qué respondes?',
              puntos: [
                `Si hace falta, una <span class="hl">segunda dosis de amiodarona de 150 mg</span> (o lidocaína si no hay amiodarona) (${p(59)}).`,
                `Tres choques fallidos tienen muy mal pronóstico: <span class="hl-rojo">~5 %</span> de resultado satisfactorio (${p(59)}-60).`,
                `Considerar la <span class="hl-azul">ECMO de urgencia</span>, si se dispone de ella las 24 h (${p(60)}).`],
              explicacion: `Tras el 3.er choque entra la amiodarona 300 mg y, si hace falta, 150 mg. La FV resistente tiene un pronóstico muy malo, y la ECMO de urgencia es una opción donde esté disponible (${p(59)}-60).` } },
          { momento: 'Minuto 14 · de vuelta a 10 insuflaciones por minuto', datos: { Ventilación: 'corregida a 10/min (cada 6 s)', Fármaco: 'última adrenalina hace 2 min' }, nuevo: ['Ventilación', 'Fármaco'],
            pregunta: { id: 'c5a-5', tipo: 'test', fuente: 'mc-epinefrina-paro · mc-fig-21-3', modeloVivo: rv('fv:rcp-adre', '⚡ La adrenalina: repetir antes de tiempo'),
              enunciado: 'Un compañero propone repetir ya la adrenalina, hace 2 min de la última, «para subir más la presión». ¿Qué le contestas?',
              opciones: [
                { t: 'Todavía no: la pauta es cada 3-5 min y el efecto de una dosis dura al menos 3 min', ok: true },
                { t: 'Ahora toca pasar a amiodarona, que sustituye a la adrenalina después del 3.er choque', porque: `La amiodarona se añade a la adrenalina, no la sustituye: la adrenalina sigue cada 3-5 min durante toda la reanimación (${p(59)}).` },
                { t: 'Sí, cada minuto hasta que vuelva el pulso: se acumula el efecto', porque: `La pauta es cada 3-5 min (${p(59)}). No hay en la ficha ninguna ventaja por adelantar la dosis.` }],
              explicacion: `El intervalo recomendado es <span class="hl">3-5 min</span>, porque el efecto sobre la presión coronaria dura <span class="hl">al menos 3 min</span> (${p(62)}). Qué pasa si se adelanta, la fuente no lo dice.` } },
        ],
        lleva: [
          'Cada minuto sin choque cuenta: 40 % de supervivencia si llega a los 5 min, menos del 10 % a los 20.',
          'La adrenalina entra al necesitar el 2.º choque (1 mg cada 3-5 min) y la amiodarona al necesitar el 3.º (300 mg y luego 150).',
          'Ventilar a 10/min: el triple baja el retorno venoso y la presión coronaria. Tras el choque, 2 min de compresiones antes de mirar el ritmo.'],
        volver: { nombre: 'Desfibrilación', ancla: 'mc-desfibrilacion', modeloVivo: rv('fv:rcp', '⚡ La RCP de Leandro en el corazón eléctrico') } },
    ],
    profundizar: [
      { id: 'mc-tabla-21-1', titulo: 'Tabla 21.1 — Datos de paro cardíaco en EE. UU., 2021' },
      { id: 'mc-algoritmo-texto', titulo: 'El algoritmo de la AHA (Fig. 21.2), paso a paso', nota: `Esta ficha sigue el algoritmo que recoge Marino (AHA 2020). Las guías AHA 2025 son otra fuente: se leen aparte, no se mezclan con esta.` },
    ],
  },

  /* =================================================================================================
     Ficha 23 · Paro cardíaco: monitorización de la reanimación (cap. 21, págs. 62-64)
     ================================================================================================= */
  'mc-paro-monitorizacion': {
    entrada: 'Qué mide la ETCO₂ durante la RCP, qué cambia al comprimir mejor, qué dice a los 20 min y por qué no basta sola, y qué aporta la ecografía sin parar las compresiones.',
    guia: [
      { id: 'prm-g1', corto: 'qué mide la ETCO₂', tipo: 'test', fuente: 'mc-etco2', modeloVivo: capno,
        enunciado: 'Durante la RCP, con la ventilación constante, un descenso de la ETCO₂ del 30 %. ¿Qué te dice?',
        opciones: [
          { t: 'Que la PaO₂ ha bajado un 30 %', porque: `La ETCO₂ es el CO₂ del final de la espiración, reflejo del equilibrio ventilación-perfusión, no de la PaO₂ (${p(62)}). Mirar el oxígeno llevaría a subir el O₂ cuando lo que falla es el flujo.` },
          { t: 'Que la ventilación no cambia, así que no dice nada del gasto', porque: `Justo porque la ventilación es constante, los cambios de ETCO₂ reflejan cambios proporcionales del gasto (${p(62)}). Ignorarlo te quita el único dato continuo de circulación durante la RCP.` },
          { t: 'Que el gasto cardíaco ha bajado un 30 %', ok: true }],
        explicacion: `La ETCO₂ varía directamente con el gasto relativo a la ventilación: con la <span class="hl">ventilación constante</span>, sus cambios son proporcionales a los del <span class="hl">gasto</span> (−30 % de ETCO₂ = −30 % de gasto) (${p(62)}). Su valor basal normal equivale a la PaCO₂, ~40 mmHg.` },
      { id: 'prm-g2', corto: 'comprimir más hondo', tipo: 'test', fuente: 'mc-etco2', modeloVivo: rv('fv:rcp', '⚡ Compruébalo: la ETCO₂ durante la RCP'),
        enunciado: 'Predice: la RCP va con una ETCO₂ estable de 20 y empiezas a comprimir más hondo, sin cambiar la ventilación. ¿Qué le pasa a la ETCO₂?',
        opciones: [
          { t: 'Sube: empuja más sangre, y la ETCO₂ refleja la calidad de las compresiones', ok: true },
          { t: 'Baja, porque comprimir más hondo vacía los pulmones de CO₂ y reduce el aire espirado', porque: `Es al revés: el aumento de la profundidad de las compresiones se acompaña de un aumento de la ETCO₂ (${p(63)}). Reducirías la profundidad por miedo a «vaciar» y harías peor RCP.` },
          { t: 'No cambia: depende solo de las insuflaciones y de la PaCO₂ previa', porque: `Con ventilación constante, la ETCO₂ sigue al gasto (${p(62)}), y por eso se ha propuesto para vigilar la calidad de las compresiones (${p(63)}).` }],
        explicacion: `El aumento de la profundidad de las compresiones se acompaña de un aumento de la ETCO₂: sirve para <span class="hl">vigilar la calidad de la RCP</span> (${p(63)}).`,
        nota: `<b>La fuente no lo dice así.</b> La ETCO₂ de 20 mmHg del modelo en RCP es un valor ilustrativo; el libro no da una cifra de ETCO₂ en RCP de calidad (${p(63)}).` },
      { id: 'prm-g3', corto: 'la curva sin RCE', tipo: 'test', fuente: 'mc-fig-21-4',
        enunciado: 'Predice (Fig. 21.4, 737 paros extrahospitalarios): en los que no recuperaron el pulso, ¿hacia dónde va la ETCO₂ a lo largo de 20 min de RCP?',
        opciones: [
          { t: 'Sube hasta ~32 mmHg, como en los que recuperan el pulso', porque: `Los 32 mmHg a los 20 min son de los pacientes con RCE (${p(63)}). Si crees que sube en todos, la ETCO₂ no te servirá para separar a los que van a responder de los que no.` },
          { t: 'Cae progresivamente, hasta unos 7 mmHg a los 20 min', ok: true },
          { t: 'Se queda en ~19 mmHg, el valor del primer minuto', porque: `Los ~19 mmHg son el punto de partida de los que no recuperan el pulso, pero después cae, no se mantiene (${p(63)}). La tendencia es lo informativo.` }],
        explicacion: `Con RCE, la ETCO₂ <span class="hl-verde">sube</span> (de ~27 a ~32 mmHg); sin RCE, <span class="hl-rojo">cae</span> (de ~19 a ~7 mmHg). Las trayectorias divergen desde los primeros minutos (Fig. 21.4, ${p(63)}).`,
        nota: `<b>Nota de fidelidad.</b> Los valores de la figura son lecturas del gráfico (medias por grupo); el texto del libro solo describe «aumento progresivo» y «descenso progresivo» (${p(63)}).` },
      { id: 'prm-g4', corto: 'el umbral de los 20 min', tipo: 'test', fuente: 'mc-etco2 · mc-etco2-20min',
        enunciado: 'A los 20 min de RCP, la ETCO₂ no supera 10-15 mmHg. ¿Qué dice Marino?',
        opciones: [
          { t: 'Que una reanimación exitosa es improbable', ok: true },
          { t: 'Que es imposible y hay que parar de inmediato', porque: `El libro dice «improbable», no «imposible», y no da una orden de parar (${p(63)}). Tratarlo como regla absoluta termina reanimaciones que aún podían responder.` },
          { t: 'Que lo que importa es el valor aislado a los 5 min, no el de los 20', porque: `El criterio se aplica tras 20 min de RCP y se apoya en la tendencia (${p(63)}). Un valor a los 5 min no lo sustituye.` }],
        explicacion: `La suma de la evidencia: una reanimación exitosa es <span class="hl-rojo">improbable</span> si la ETCO₂ no supera 10-15 mmHg tras 20 min de RCP (un estudio, 15; otros, 10) (${p(63)}).`,
        nota: `<b>Las fuentes discrepan.</b> Marino cita 15 mmHg (un estudio) y 10 mmHg (otros) (${p(63)}) sin elegir un único corte. Aparte, ${AHA} (mensajes clave) dice que la ETCO₂ no debe usarse sola para terminar la reanimación. Fuentes distintas: no se mezclan.` },
      { id: 'prm-g5', corto: 'si sigue alta', tipo: 'test', fuente: 'mc-etco2 · mc-etco2-20min',
        enunciado: 'A los 20 min, la ETCO₂ sigue claramente por encima de 15 mmHg. ¿Hasta cuándo puedes seguir?',
        opciones: [
          { t: 'Hasta los 30 min, que es el máximo de cualquier reanimación', porque: `El libro no pone ese máximo: sigue hasta 1½ h cuando la ETCO₂ se mantiene por encima del umbral (${p(63)}). Parar a los 30 min pierde los casos que aún responden.` },
          { t: 'Sin límite: si está por encima del umbral, el RCE llegará siempre', porque: `El libro habla de resultado favorable asociado, no de garantía (${p(63)}). Una ETCO₂ alta no asegura el RCE.` },
          { t: 'Hasta 1½ h: continuar así se ha asociado a un resultado favorable', ok: true }],
        explicacion: `Cuando la ETCO₂ se mantiene por encima de ese nivel, <span class="hl">continuar hasta 1½ h</span> se ha asociado a un resultado favorable (${p(63)}).` },
      { id: 'prm-g6', corto: 'taponamiento en la parada', tipo: 'test', fuente: 'mc-eco-paro · mc-fig-21-5', modeloVivo: eco('derrame', '🫀 El derrame pericárdico en la circulación viva'),
        enunciado: 'En plena parada, la eco subcostal muestra un derrame pericárdico. ¿Esperas ver colapso diastólico del VD antes de actuar?',
        opciones: [
          { t: 'Sí: sin colapso diastólico del VD no hay taponamiento y no se drena por precaución', porque: `Los signos clásicos, como el colapso diastólico del VD, no son fiables durante la parada por las presiones intracardíacas bajas (${p(64)}). Esperarlo retrasa un drenaje que podría salvar al paciente.` },
          { t: 'No es fiable con presiones tan bajas: cualquier derrame pide pericardiocentesis inmediata', ok: true },
          { t: 'Solo si el derrame es muy grande, y se confirma antes con una TC', porque: `El libro no pone un tamaño mínimo: la presencia de cualquier derrame debe motivar la pericardiocentesis inmediata (${p(64)}). Llevar a una TC a un paciente en parada no figura en la pauta.` }],
        explicacion: `Los signos clásicos del taponamiento (colapso diastólico del VD) son <span class="hl-rojo">poco fiables en la parada</span> por las presiones intracardíacas bajas: <span class="hl">cualquier derrame</span> pericárdico debe motivar la pericardiocentesis inmediata (${p(64)}).` },
      { id: 'prm-g7', corto: 'corazón inmóvil en la eco', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'mc-eco-paro',
        enunciado: 'En un paro por trauma, la eco muestra el corazón inmóvil y un compañero dice «paramos». ¿Por qué esto solo no basta?',
        puntos: [
          `En el paro por trauma, la parada cardíaca por eco predice <span class="hl">100 %</span> la no supervivencia (${p(64)}).`,
          `Hay <span class="hl-rojo">desacuerdo considerable</span> entre los médicos que hacen la eco a la hora de reconocer la parada cardíaca (${p(64)}).`,
          `Por eso las guías <span class="hl-rojo">no recomiendan</span> usar este hallazgo aislado como motivo para terminar la RCP (${p(64)}).`],
        explicacion: `La eco a pie de cama es valiosa para las causas reversibles (neumotórax a tensión, taponamiento), pero el hallazgo de «parada cardíaca» no se usa solo para parar (${p(64)}).` },
    ],
    examen: [
      { id: 'prm-e1', corto: 'un único 12', tipo: 'test', fuente: 'mc-etco2 · mc-etco2-20min',
        enunciado: 'Minuto 5 de RCP: la ETCO₂ marca un único 12. Un compañero dice «RCE improbable, paramos». ¿Qué contestas?',
        opciones: [
          { t: 'Tiene razón: bajo 15 mmHg, la RCE es improbable en cualquier momento de la reanimación', porque: `El umbral de 10-15 mmHg se aplica tras 20 min de RCP (${p(63)}). A los 5 min un valor aislado no decide nada; parar ahora termina una RCP que apenas ha empezado.` },
          { t: 'Un 12 a los 5 min equivale a un gasto normal; con eso basta', porque: `La ETCO₂ normal es ~40 mmHg (${p(62)}); en la RCP la ETCO₂ está baja porque el gasto de las compresiones es bajo. Un 12 no es un gasto normal.` },
          { t: 'El criterio de 10-15 mmHg es a los 20 min; ahora vigila la tendencia y las compresiones', ok: true }],
        explicacion: `El umbral es <span class="hl">tras 20 min</span> de RCP, y lo informativo es la tendencia: sube en los que recuperan el pulso y cae en los que no (${p(63)}).` },
      { id: 'prm-e2', corto: 'eco del neumotórax', tipo: 'test', fuente: 'mc-eco-paro',
        enunciado: 'Sensibilidad y especificidad de la eco para detectar un neumotórax en un paciente en supino:',
        opciones: [
          { t: 'Sensibilidad 91 % y especificidad 99 %', ok: true },
          { t: 'Sensibilidad 99 % y especificidad 91 %', porque: `Están cambiadas (${p(64)}). Con una especificidad menor, tendrías más falsos positivos y descomprimirías neumotórax que no existen.` },
          { t: 'Sensibilidad y especificidad cercanas al 100 % en cualquier posición', porque: `La cifra es para el decúbito supino (${p(64)}); además la sensibilidad no es del 100 %: aún se pierde alguno.` }],
        explicacion: `Para neumotórax en supino: <span class="hl">sensibilidad 91 %, especificidad 99 %</span> (${p(64)}).` },
      { id: 'prm-e3', corto: 'ETCO₂ y EPOC', tipo: 'test', fuente: 'mc-etco2',
        enunciado: 'En un paciente con EPOC, ¿cómo es la ETCO₂ respecto a su PaCO₂?',
        opciones: [
          { t: 'Mayor, porque retiene CO₂', porque: `Con más espacio muerto la ETCO₂ es menor que la PaCO₂, no mayor (${p(63)}). Si lo piensas al revés, un valor «normal» te hará creer que hay más gasto del real.` },
          { t: 'Menor: hay más espacio muerto fisiológico (V/Q >1)', ok: true },
          { t: 'Igual: el valor basal siempre equivale a la PaCO₂ en todos los pacientes', porque: `Lo es en condiciones normales (~40 mmHg), pero no con mayor espacio muerto fisiológico (V/Q >1) (${p(63)}).` }],
        explicacion: `La ETCO₂ basal equivale a la PaCO₂ (~40 mmHg), pero es <span class="hl">menor</span> con más espacio muerto fisiológico, como en la EPOC (${p(63)}). Así, una ETCO₂ baja en un EPOC no se compara con la de otro paciente.` },
      { id: 'prm-e4', corto: 'los apuntes de monitorización', tipo: 'error', fuente: 'mc-etco2 · mc-eco-paro',
        enunciado: 'Apuntes de un compañero sobre la monitorización de la RCP. Hay dos errores: encuéntralos.',
        frases: [
          { t: 'Palpar el pulso tiene baja sensibilidad y exige interrumpir las compresiones.' },
          { t: 'Con ventilación constante, una ETCO₂ que baja un 30 % indica un gasto que baja un 30 %.' },
          { t: 'Una ETCO₂ que baja progresivamente durante la reanimación anuncia un RCE probable.', mal: true, c: `Es al revés: el RCE probable se acompaña de un <span class="hl-verde">aumento</span> progresivo de la ETCO₂; el descenso progresivo, de RCE improbable (${p(63)}).` },
          { t: 'Cuando la ETCO₂ sigue por encima de 15 mmHg a los 20 min, se ha seguido hasta 1½ h con buen resultado.' },
          { t: 'Un corazón inmóvil en la eco en el paro por trauma es motivo suficiente para terminar la RCP.', mal: true, c: `Las guías <span class="hl-rojo">no recomiendan</span> usar la parada cardíaca por eco aislada para terminar la RCP, por el desacuerdo entre quienes la interpretan (${p(64)}).` }],
        explicacion: 'Dos errores: el sentido de la tendencia de la ETCO₂ y la eco aislada como motivo para parar.' },
    ],
    casos: [
      { id: 'c5b', titulo: 'Leandro, 49 años: la capnografía de su RCP', corto: 'Caso · Leandro (la ETCO₂)', sub: 'minutos 14-20 y la revisión posterior',
        paciente: { Edad: '49 años, varón', Peso: '84 kg', Antecedentes: 'sin cardiopatía conocida', Motivo: 'Día 3 de una pancreatitis aguda; en parada con FV desde las 03:40' },
        pasos: [
          { momento: 'Minuto 14 · ventilación corregida', datos: { Ventilación: '10 insuflaciones/min', Capnografía: 'ETCO₂ 20 mmHg', Ritmo: 'FV' }, nuevo: ['Ventilación', 'Capnografía', 'Ritmo'],
            pregunta: { id: 'c5b-1', tipo: 'test', fuente: 'mc-etco2', modeloVivo: rv('fv:rcp', '⚡ Compruébalo: la ETCO₂ de la RCP'),
              enunciado: 'Con la ventilación fija a 10/min, la ETCO₂ de Leandro es 20. ¿Cómo la usas?',
              opciones: [
                { t: 'Como señal del gasto: si comprimes más hondo debe subir; si cae, la RCP empeora', ok: true },
                { t: 'Como PaCO₂: Leandro hiperventila y hay que bajar la frecuencia de insuflaciones ya', porque: `En la parada, la ETCO₂ baja por el gasto bajo, no por hiperventilar (${p(62)}). Bajar aún más la frecuencia empeora la ventilación sin mejorar el flujo.` },
                { t: 'Como señal de que el RCE ya está cerca: 20 es un valor normal', porque: `El valor normal es ~40 mmHg (${p(62)}). Con 20, el gasto es el de las compresiones, no el de un corazón que late.` }],
              explicacion: `Con ventilación constante, la ETCO₂ sigue al <span class="hl">gasto</span>: aumenta con compresiones más profundas (${p(63)}) y su caída indica caída del gasto (${p(62)}).`,
              nota: `<b>La fuente no lo dice así.</b> La cifra de 20 mmHg es del modelo (ilustrativa); Marino no da un valor de ETCO₂ para una RCP buena (${p(63)}).` } },
          { momento: 'Minuto 17 · ¿pulso?', datos: { Compresiones: 'continúan', Pregunta: 'el equipo duda si ya hay pulso' }, nuevo: ['Compresiones', 'Pregunta'],
            pregunta: { id: 'c5b-2', tipo: 'test', fuente: 'mc-etco2', modeloVivo: rv('fv:rcp', '⚡ La ETCO₂ en la RCP'),
              enunciado: 'El equipo duda si ya hay pulso. ¿Cómo lo vigilas sin parar las compresiones?',
              opciones: [
                { t: 'Parar 10 s y palpar el pulso carotídeo cada minuto, para estar seguros de que lo hay', porque: `Palpar tiene baja sensibilidad y suele exigir interrumpir las compresiones durante periodos prolongados (${p(62)}). Cada pausa es sangre que no llega al corazón.` },
                { t: 'Con la ETCO₂ de un solo momento: si es mayor de 20, hay RCE seguro', porque: `El libro usa la tendencia, no un valor aislado, y no da 20 como corte (${p(63)}). Con un valor aislado, declararías el RCE de más o de menos.` },
                { t: 'Con la ETCO₂: un aumento progresivo durante la reanimación hace probable el RCE', ok: true }],
              explicacion: `La ETCO₂ ofrece una evaluación más fiable y fisiológica de la circulación y no obliga a parar (${p(62)}). Su aumento progresivo hace probable el RCE (${p(63)}).` } },
          { momento: 'Minuto 19 · el RCE', datos: { Capnografía: 'ETCO₂ 42 mmHg', Pulso: 'carotídeo palpable', Ritmo: 'sinusal' }, nuevo: ['Capnografía', 'Pulso', 'Ritmo'],
            pregunta: { id: 'c5b-3', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'mc-etco2', modeloVivo: rv('rce', '⚡ El RCE: ETCO₂ 42'),
              enunciado: 'La ETCO₂ pasa de 20 a 42 y aparece pulso. ¿Qué cuenta ese 42?',
              puntos: [
                `Con la ventilación constante, la ETCO₂ <span class="hl">sigue al gasto</span>: que suba así dice que la circulación se ha recuperado (${p(62)}).`,
                `Una ETCO₂ normal equivale a la <span class="hl">PaCO₂ basal, ~40 mmHg</span>: el 42 es un valor de quien tiene circulación (${p(62)}-63).`,
                `La subida <span class="hl-azul">anuncia el RCE</span> sin parar las compresiones, a diferencia de palpar el pulso (${p(62)}-63).`],
              explicacion: `El libro describe un <i>aumento progresivo</i> en quienes recuperan el pulso; el salto a 42 es la cifra del modelo (${p(63)}).` } },
          { momento: 'Revisión del caso', datos: { Nota: 'un compañero: «a los 9 min la ETCO₂ marcaba 13, ya se podía parar»' }, nuevo: ['Nota'],
            pregunta: { id: 'c5b-4', tipo: 'test', fuente: 'mc-etco2 · mc-insuflaciones', modeloVivo: rv('fv:rcp-insufl', '⚡ Aquel 13: 30 insuflaciones/min'),
              enunciado: 'Al revisar la RCP, un compañero dice que a los 9 min, con ETCO₂ 13, ya se podía parar. ¿Qué le respondes?',
              opciones: [
                { t: 'Tiene razón: bajo 15 mmHg, la RCE es improbable en cualquier momento, y se ahorraba esfuerzo', porque: `El umbral de 10-15 mmHg se aplica a los 20 min de RCP (${p(63)}). Con ese atajo habrías terminado una reanimación que acabó con RCE.` },
                { t: 'Aquel 13 era con 30 insuflaciones/min, que bajan el retorno venoso; el umbral es a los 20 min', ok: true },
                { t: 'No: el 13 era normal para una RCP, y con 15 o más se habría parado', porque: `Un valor normal es ~40 mmHg (${p(62)}) y por encima de 15 a los 20 min el libro no manda parar, sino seguir hasta 1½ h (${p(63)}).` }],
              explicacion: `Con 30 insuflaciones/min baja el retorno venoso y la presión coronaria (${p(58)}), y la ETCO₂ ya no mide solo el gasto (${p(62)}). El umbral de <span class="hl">10-15 mmHg</span> es a los <span class="hl">20 min</span> (${p(63)}).` } },
          { momento: 'Nota del R1 sobre la monitorización', datos: { Plan: 'la nota de evolución del R1' }, nuevo: ['Plan'],
            pregunta: { id: 'c5b-5', tipo: 'error', fuente: 'mc-etco2 · mc-etco2-20min',
              enunciado: 'El R1 resume la RCP en su nota. Hay dos errores: encuéntralos.',
              frases: [
                { t: 'El criterio de la ETCO₂ para el pronóstico se aplica a los 20 min de RCP.' },
                { t: 'La ETCO₂ basal normal equivale a la PaCO₂, unos 40 mmHg.' },
                { t: 'Si a los 20 min la ETCO₂ hubiera seguido por encima de 15, se podía continuar hasta 1½ h.' },
                { t: 'La ETCO₂ subió a 42 porque aumentamos las insuflaciones a 30/min.', mal: true, c: `Con ventilación constante la ETCO₂ sigue al gasto (${p(62)}); a 30/min el retorno venoso y la presión coronaria <span class="hl-rojo">bajan</span> (${p(58)}). Subió porque volvió la circulación.` },
                { t: 'El pulso carotídeo es el método más sensible para detectar el RCE.', mal: true, c: `Palpar el pulso tiene <span class="hl-rojo">baja sensibilidad</span> y exige interrumpir las compresiones; la ETCO₂ es más fiable (${p(62)}).` }],
              explicacion: 'Dos errores: atribuir la subida a las insuflaciones y elogiar la palpación del pulso.' } },
          { momento: 'Si no hubiera habido RCE', datos: { Hipótesis: 'otra RCP: a los 20 min la ETCO₂ marca 8 mmHg' }, nuevo: ['Hipótesis'], calculadora: { ir: 'mc-etco2-20min', nombre: 'ETCO₂ a los 20 min' },
            pregunta: { id: 'c5b-6', tipo: 'test', fuente: 'mc-etco2-20min · mc-fig-21-4',
              enunciado: 'Abre la calculadora si quieres. En otra RCP, a los 20 min la ETCO₂ marca 8 mmHg. ¿Qué indica, y qué haces con ese dato?',
              opciones: [
                { t: 'Hay que seguir 1½ h, porque la ETCO₂ está en la zona buena', porque: `La prolongación hasta 1½ h se asoció a ETCO₂ por encima de 10-15 mmHg (${p(63)}). Con 8 no se da esa situación.` },
                { t: 'RCE casi seguro: 8 mmHg está dentro del rango de quienes recuperan el pulso en la figura', porque: `Los que recuperan el pulso van de ~27 a ~32 mmHg (Fig. 21.4, ${p(63)}). Con 8 esperarías un RCE que la curva no apoya.` },
                { t: 'RCE improbable (la curva sin RCE acaba cerca de 7): un dato más, no una orden', ok: true }],
              explicacion: `Menos de 10 mmHg a los 20 min: <span class="hl-rojo">RCE improbable</span> (${p(63)}). Si hubiera estado en 18, la fuente dice seguir hasta 1½ h.`,
              nota: `<b>Opinión del autor / otra fuente.</b> ${AHA}: la ETCO₂ no debe usarse sola para terminar la reanimación. Marino dice «improbable», no ordena parar.` } },
        ],
        lleva: [
          'Con ventilación constante, la ETCO₂ es el gasto de tus manos: sube si comprimes mejor y cae si la RCP empeora.',
          'El umbral de 10-15 mmHg se aplica a los 20 min; por encima, se ha seguido hasta 1½ h. Un valor aislado antes de tiempo no decide.',
          'La ETCO₂ y la eco ayudan, pero ninguna sola decide parar: la parada cardíaca por eco no es motivo para terminar la RCP.'],
        volver: { nombre: 'La ETCO₂ durante la RCP', ancla: 'mc-etco2', modeloVivo: rv('rce', '⚡ El RCE de Leandro: ETCO₂ 42') } },
    ],
    profundizar: [
      { id: 'mc-fig-21-5', titulo: 'Figura 21.5 — Derrame pericárdico, vista subcostal' },
    ],
  },
};

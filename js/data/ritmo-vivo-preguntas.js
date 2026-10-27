// Las preguntas del corazón eléctrico (Mayéutica del modelo vivo ritmo-vivo): 10 del recorrido (guía socrática y examen,
// en el orden de las fichas de Marino cap. 19-21) y el caso de Teodoro en 6 pasos. Datos puros; el modo Mayéutica los pinta
// con js/core/mayeutica-motor.js (js/modules/libros/ritmo-vivo/mayeutica.js). Cada cita `fuente` lleva a su párrafo de la
// ficha (id comprobado) y a la página del PDF. Las cifras del paciente son del caso; las conductas, dosis y umbrales, de la ficha.
import { C } from './ritmo-vivo-data.js';

const RECORRIDO_BASE = [
  { grupo: 'guia', num: 'G1', predice: true, estado: 'nodal',
    enunciado: 'La onda da vueltas dentro del nodo AV. Vas a poner 6 mg de adenosina. Antes de mirar: <b>¿qué verás en la tira mientras actúa?</b>',
    opciones: [
      { t: 'QRS anchos: la adenosina desvía la onda por las ramas.', porque: 'La adenosina enlentece el nodo AV y da un bloqueo AV transitorio (p. 29-30); no cambia el camino por las ramas. Si esperas QRS anchos, tomarás la pausa esperada (bradicardia o bloqueo AV en la mitad de los casos, Tabla 19.4) por un problema nuevo.' },
      { t: 'Ondas P sin su QRS durante unos segundos, y luego el sinusal.', ok: true },
      { t: 'La misma taquicardia, más lenta, durante horas.', porque: 'Su efecto dura 1-2 min y lo que hace es cortar el circuito (p. 30). Si esperas horas de efecto, no repetirás 12 mg a los 2 min cuando no responde (Tabla 19.4).' },
      { t: 'Nada: la adenosina actúa en las aurículas, no en el nodo.', porque: 'Actúa en el nodo AV, justo por donde pasa este circuito (p. 29-30). Si crees que no sirve, cardiovertirás a un paciente que casi nunca está inestable con esta arritmia (p. 29).' }],
    explicacion: 'La adenosina da un bloqueo AV transitorio: salen P sin QRS unos segundos. El circuito pasaba por el nodo AV: se rompe y vuelve el sinusal (p. 29-30).', fuente: C.adeno,
    tocar: { txt: 'Compruébalo: pon la adenosina', confirma: 'Mira el torniquete con su cerrojo y la tira: P sin QRS, y luego vuelve el sinusal.' } },
  { grupo: 'guia', num: 'G2', predice: true, estado: 'wpw',
    enunciado: 'Este corazón tiene un atajo a través del anillo, sin torniquete. Antes de ver la tira: <b>¿cómo serán el PR y el comienzo del QRS?</b>',
    opciones: [
      { t: 'PR largo, porque la onda da un rodeo por el atajo.', porque: 'El atajo no tiene el freno del nodo: la onda llega antes, no después (PR corto, p. 27). Si buscas un PR largo, no reconocerás el WPW y, ante una FA, podrías frenar el nodo, lo que puede precipitar una FV (p. 28).' },
      { t: 'PR normal y QRS estrecho: en sinusal el atajo no se nota.', porque: 'En sinusal sí se nota: PR corto y onda delta (p. 27). Si no lo buscas, el WPW pasa por un ECG normal y, en una FA, le darías un bloqueante del nodo (p. 28).' },
      { t: 'PR corto y un QRS que arranca despacio: la onda delta.', ok: true },
      { t: 'Sin P: las aurículas se saltan y el atajo manda.', porque: 'Las aurículas se activan igual, con su P; lo que cambia es el paso al ventrículo (p. 27). Si no ves la P, buscarás una FA o una reentrada que no tiene.' }],
    explicacion: 'Por el atajo, parte del ventrículo se activa antes y despacio, de músculo a músculo: PR corto y onda delta antes del QRS (p. 27). Que la delta nazca de esa activación lenta es fisiología general.', fuente: C.wpw },
  { grupo: 'examen', num: 'E1', estado: 'wpw', wpwFa: true,
    enunciado: 'Un paciente con WPW conocido llega en FA a 190 lpm, con QRS anchos e irregulares y PA de 110/70. <b>¿Qué haces?</b>',
    opciones: [
      { t: 'Diltiazem 0,25 mg/kg en 2 min: es el que antes controla la FC.', porque: 'Frenar el nodo no frena la vía accesoria: la FC no baja, y el bloqueo selectivo del nodo puede precipitar una FV (p. 28). El mejor fármaco de la FA sin vía (Fig. 19.5) aquí puede matarle.' },
      { t: 'Amiodarona o procainamida, o cardioversión eléctrica.', ok: true },
      { t: 'Digoxina IV, porque no baja la PA como el diltiazem.', porque: 'La digoxina también bloquea el nodo (p. 28): la vía accesoria sigue libre y comparte el riesgo de FV. Además tarda horas (Fig. 19.5).' },
      { t: 'Esmolol en bolo y perfusión, que se ajusta minuto a minuto.', porque: 'El esmolol es un betabloqueante: bloquea el nodo y la vía accesoria sigue libre (p. 28). Que se ajuste rápido no evita la FV que puede precipitar.' }],
    explicacion: 'Con una vía accesoria, los fármacos que bloquean el nodo AV (antagonistas del calcio, betabloqueantes, digoxina) no frenan la frecuencia y pueden precipitar una FV. Se trata con cardioversión eléctrica, o con amiodarona o procainamida (p. 28).', fuente: C.wpw },
  { grupo: 'examen', num: 'E2', estado: 'fv',
    enunciado: 'Leandro sigue en FV tras el 2.º choque. <b>¿Qué toca ahora?</b>',
    opciones: [
      { t: 'Amiodarona 300 mg IV o IO ya, y 150 mg si hace falta.', porque: 'La amiodarona va si hace falta un 3.er choque (p. 59). Darla ahora, en lugar de la adrenalina, retrasa el fármaco que toca tras el 2.º choque.' },
      { t: 'Parar las compresiones para buscar el pulso.', porque: 'Tras el choque se sigue con 2 min de compresiones antes de mirar el ritmo (p. 59). Buscar el pulso, que además se palpa mal (p. 62), le quita minutos de flujo: las interrupciones llegan al 50 % del tiempo de RCP (p. 57).' },
      { t: 'Adrenalina 1 mg cada 3-5 min, y compresiones.', ok: true },
      { t: 'Lidocaína 1-1,5 mg/kg IV, que funciona mejor que la amiodarona.', porque: 'La lidocaína es la alternativa si no hay amiodarona, y también va tras el 3.er choque (p. 59). El libro no dice que funcione mejor; ahora toca la adrenalina.' }],
    explicacion: 'Si hace falta un 2.º choque, empieza la adrenalina: 1 mg IV o IO cada 3-5 min. Tras cada choque, 2 min de compresiones antes de mirar el ritmo. Si hace falta un 3.º, amiodarona 300 mg (p. 59).', fuente: C.algoritmo },
  { grupo: 'guia', num: 'G3', predice: true, estado: 'flutter',
    enunciado: 'Un circuito gira en la aurícula y el nodo AV deja pasar uno de cada dos impulsos (2:1). Antes de mirar: <b>¿qué verás en la tira?</b>',
    opciones: [
      { t: 'P iguales, cada una con su QRS: una taquicardia sinusal.', porque: 'P uniformes con PR igual son la taquicardia sinusal (p. 18-19); aquí la línea de base no tiene P. Si las esperas, buscarás fiebre o dolor en vez de un circuito.' },
      { t: 'Ninguna actividad auricular y un QRS estrecho y regular: la reentrada del nodo.', porque: 'La ausencia de P sugiere la reentrada nodal (p. 18-19), pero el flúter sí deja actividad auricular visible. Si no la buscas, pensarás en el nodo y no en la aurícula.' },
      { t: 'Una línea de base sin orden y QRS irregulares: una FA.', porque: 'En la FA los R-R son irregulares (p. 20); el flúter con bloqueo fijo (2:1, 3:1) da un ritmo regular (p. 18-19). Si los confundes, mirarás el control de la frecuencia de una FA donde hay un ritmo regular.' },
      { t: 'Dientes de sierra, y un QRS estrecho y regular por cada dos dientes.', ok: true }],
    explicacion: 'Los dientes de sierra son la señal del flúter; con un bloqueo AV fijo (2:1, 3:1) el ritmo es regular y el QRS, estrecho (p. 18-19). La frecuencia de la aurícula no la da el libro: fisiología general.', fuente: C.regular },
  { grupo: 'examen', num: 'E3', estado: 'tam',
    enunciado: 'Un hombre de 71 años con EPOC reagudizada tiene 128 lpm, P de varias formas, PR variable y un ritmo irregular. El magnesio sérico es normal. <b>¿Qué haces primero?</b>',
    opciones: [
      { t: 'Magnesio IV empírico: 2 g en 15 min y 6 g en 6 h.', ok: true },
      { t: 'Verapamilo, porque hay EPOC y el metoprolol no está indicado en ese caso.', porque: 'El verapamilo corrige menos de la mitad y es inotrópico negativo (p. 28); no es lo primero. Si empiezas por él, dejas sin dar la medida de mayor éxito (88 % con magnesio) y arriesgas la IC con FE reducida.' },
      { t: 'Metoprolol IV: 80 % de éxito en la TAM.', porque: 'El metoprolol va si fallan las medidas previas y solo si la EPOC no es la causa (p. 28); aquí lo es. Si lo das primero, un betabloqueante cae sobre un pulmón enfermo.' },
      { t: 'Ningún magnesio: con el sérico normal no hay déficit que corregir.', porque: 'El magnesio sérico puede ser normal con el total del cuerpo agotado, y la respuesta fue independiente del valor sérico (p. 28). Si lo descartas, dejas sin tratar a un paciente con una arritmia que ya es tozuda.' }],
    explicacion: 'En la TAM, lo primero es corregir, si hace falta, el magnesio y el potasio; el magnesio IV empírico (2 g en 15 min y 6 g en 6 h) pasó a sinusal al 88 %, con independencia del magnesio sérico. Después, metoprolol si la EPOC no es la causa, o verapamilo (p. 28).', fuente: C.tam },
  { grupo: 'examen', num: 'E4', estado: 'torsade',
    enunciado: 'Una paciente de UCI con haloperidol tiene un QTc de 0,52 s en la hoja de la mañana, sin arritmias. <b>¿Cómo lo interpretas?</b>',
    opciones: [
      { t: 'Normal: el límite sube a 0,5 s en las mujeres, que tienen el QT algo más largo.', porque: 'Normal es ≤0,44 s y >0,5 s es riesgo de torsade (p. 35); el libro no da otro límite por sexo. Si lo aceptas, no tocarás el fármaco ni los electrolitos.' },
      { t: 'La torsade es inevitable: retiras todo y dejas el desfibrilador cargado.', porque: 'El libro insiste en que el QT largo es común en la UCI y la torsade, poco frecuente (p. 35). Desfibrilar es para la torsade sostenida (p. 35), no para un QT largo sin arritmia.' },
      { t: 'Riesgo de torsade (>0,5 s), no sentencia: mira K⁺, Mg²⁺ y el fármaco.', ok: true },
      { t: 'Magnesio 1-2 g en 15 min a todo el que pase de 0,5 s.', porque: 'El magnesio se cita para terminar la torsade (p. 35); lo que previene las recaídas es corregir la hipopotasemia y la hipomagnesemia y retirar el fármaco (p. 35). Darlo a ciegas no corrige la causa.' }],
    explicacion: 'Un QTc normal es ≤0,44 s y >0,5 s es un riesgo de torsade; pero un QT largo es común en la UCI y la torsade es rara. Se corrigen el potasio y el magnesio y se retira el fármaco de riesgo (p. 35).', fuente: C.qtc },
  { grupo: 'examen', num: 'E5', estado: 'stemi',
    enunciado: 'Una mujer de 63 años con dolor opresivo tiene un ST elevado 1,7 mm en el punto J en V2 y en V3; el resto de las derivaciones, sin cambios. <b>¿Cumple el criterio de STEMI?</b>',
    opciones: [
      { t: 'No: en V2-V3 hacen falta ≥2 mm.', porque: 'Los 2 mm son el umbral del varón; en la mujer es ≥1,5 mm en V2-V3 (Tabla 20.1, p. 41). Si aplicas el del varón, retrasas la reperfusión de una mujer que sí lo cumple.' },
      { t: 'Solo con la troponina elevada: sin ella el ECG no basta.', porque: 'El criterio de la tabla es del ECG (p. 41); la troponina detecta la lesión de la célula y se mide a la llegada y a la hora (p. 41). Si esperas la troponina para decidirlo, atrasas la decisión de reperfundir.' },
      { t: 'Sí, pero solo si el ST de II también sube ≥1 mm, como en las demás derivaciones.', porque: 'El criterio pide ≥2 derivaciones contiguas (p. 41), y V2 y V3 lo son; no hace falta que cambie II. Si lo exiges, pasas por alto un STEMI anterior.' },
      { t: 'Sí: ≥1,5 mm en V2-V3 en una mujer, en dos derivaciones contiguas.', ok: true }],
    explicacion: 'Tabla 20.1: STEMI es ST elevado en el punto J en ≥2 derivaciones contiguas, ≥1,5 mm (mujeres) o ≥2 mm (varones) en V2-V3, o ≥1 mm en las demás (p. 41).', fuente: C.t201 },
  { grupo: 'examen', num: 'E6', estado: 'fv',
    enunciado: 'A los 20 min de RCP, la ETCO₂ de Leandro es de 7 mmHg y no ha subido desde el principio. <b>¿Qué te dice?</b>',
    opciones: [
      { t: 'La reanimación con éxito es improbable: no pasa de 10-15 mmHg a los 20 min.', ok: true },
      { t: 'Que las compresiones son demasiado profundas.', porque: 'Una compresión más profunda se acompaña de más ETCO₂, no de menos (p. 63). Si la lees al revés, comprimirás menos justo cuando necesitas flujo.' },
      { t: 'Que está normal: en la parada la ETCO₂ es como el PCO₂ arterial, de unos 40 mmHg.', porque: 'El valor de ≈40 es el de la circulación normal (p. 62-63); en la RCP la ETCO₂ cae con el flujo bajo y la Fig. 21.4 muestra cifras bajas y en descenso en quien no recupera el pulso. Si lo das por normal, no lo usarás como señal.' },
      { t: 'Que hay que parar ya, porque nadie se recupera con una cifra así.', porque: 'El libro habla de probabilidad: por encima de ese umbral se ha seguido hasta 1½ h con buen resultado (p. 63). Una cifra baja pesa mucho, pero es una decisión de equipo, no una regla automática.' }],
    explicacion: 'La ETCO₂ en serie durante la RCP orienta hacia el retorno de la circulación: sube en quienes la recuperan y cae en los demás; con menos de 10-15 mmHg a los 20 min es improbable un buen desenlace (p. 63, Fig. 21.4).', fuente: C.etco2 },
  { grupo: 'examen', num: 'E7', tipo: 'destapa', estado: 'sinusal',
    enunciado: 'Ante una taquicardia en el monitor, el libro dice que el diagnóstico se apoya en 3 hallazgos del ECG. <b>¿Cuáles?</b>',
    puntos: [
      { t: 'La <span class="hl-azul">duración del QRS</span>: estrecho (≤0,12 s) nace por encima del sistema de conducción; ancho (>0,12 s): una TV o una supraventricular con conducción aberrante (p. 20-21).', c: C.hallazgos },
      { t: 'La <span class="hl-azul">uniformidad de los intervalos R-R</span>: regular o irregular.', c: C.regular },
      { t: 'Las <span class="hl-azul">características de la actividad auricular</span>: P iguales, ausencia de P o dientes de sierra.', c: C.regular }],
    explicacion: 'Son la duración del QRS, la uniformidad del R-R y la actividad auricular (Fig. 19.1, p. 18-19).', fuente: C.hallazgos },
];
// El caso de Teodoro (C2 de la cobertura del bloque): evoluciona del día 2 al día 3, con el giro de la estenosis mitral.
// Las cifras del paciente son del caso; las conductas, dosis y umbrales, de la ficha (Marino, cap. 19).
const CASO_BASE = { titulo: 'La lobectomía (Teodoro)', pasos: [
  { num: 'Paso 1', estado: 'fa', fcFA: 148, dia: 'Día 2 de la lobectomía · tarde',
    paciente: [['Paciente', 'Teodoro, 74 años, 78 kg'], ['Antecedentes', 'HTA, diabetes'], ['Motivo', 'lobectomía pulmonar hace 2 días'], ['Monitor', '148 lpm', 1], ['Síntomas', 'palpitaciones', 1]],
    enunciado: 'Mira la tira de Teodoro. <b>¿Qué ritmo es?</b>',
    opciones: [
      { t: 'Taquicardia sinusal: hay que buscar su causa y tratarla.', porque: 'Habría una P antes de cada QRS y el RR sería regular (p. 19). Si la tomas por sinusal, Teodoro sigue a 148 sin control de la frecuencia.' },
      { t: 'Taquicardia auricular multifocal, típica del pulmón enfermo.', porque: 'La TAM tiene P de varias formas y PR variable (p. 20); aquí no hay P. Con magnesio para una TAM, la FA seguiría a 148.' },
      { t: 'Reentrada nodal: QRS estrecho sin P visibles.', porque: 'La reentrada nodal es regular (p. 19, 29) y este RR es irregular. Si la tratas como reentrada, los fármacos y las dosis no serían los de la FA (Tabla 19.1) y su frecuencia seguiría en 148.' },
      { t: 'Fibrilación auricular: RR irregular y ninguna P.', ok: true }],
    explicacion: 'QRS estrecho e irregular, sin P y con ondas de fibrilación: FA (p. 20). Tras la cirugía torácica aparece hasta en el 45 % de los casos, casi siempre en los primeros 5 días (p. 21).', fuente: C.irregular,
  },
  { num: 'Paso 2', estado: 'fa', fcFA: 148, dia: 'Día 2 · tarde, 5 min después',
    paciente: [['PA', '108/66 mmHg', 1], ['Peso', '78 kg', 1]],
    enunciado: 'Teodoro tolera la PA. Quieres frenar la frecuencia. <b>¿Qué le das y cuánto, para sus 78 kg?</b>',
    opciones: [
      { t: 'Diltiazem 78 mg IV: 1 mg/kg en 2 min y luego 5-15 mg/h.', porque: 'La dosis es 0,25 mg/kg (Tabla 19.1): con 1 mg/kg le darías cuatro veces más. El diltiazem ya da hipotensión en el 20-30 % a la dosis buena (p. 23); a esta, Teodoro se hundiría.' },
      { t: 'Diltiazem ≈ 20 mg IV en 2 min (0,25 mg/kg) y 5-15 mg/h.', ok: true },
      { t: 'Digoxina 0,25 mg IV cada 2 h hasta 1,5 mg: no baja la PA.', porque: 'La digoxina tarda: casi nada en la primera hora y a las 6 h aún no baja de 100 lpm (Fig. 19.5); sola no sirve para frenar deprisa (p. 25). Teodoro seguiría horas a 148.' },
      { t: 'Cardioversión sincronizada a 100 J: es lo más rápido.', porque: 'La cardioversión se reserva para el paciente inestable (p. 25), y Teodoro tolera 108/66. Además exige antes una eco para buscar trombos en la aurícula (p. 25).' }],
    explicacion: 'El diltiazem es el más usado para frenar deprisa la FA: 0,25 mg/kg IV en 2 min (0,25 × 78 ≈ 20 mg) y después 5-15 mg/h (Tabla 19.1).', fuente: C.t191, fuente2: C.dilt },
  { num: 'Paso 3', estado: 'fa', fcFA: 118, dia: 'Día 2 · 40 min después · el giro',
    paciente: [['PA', '84/50 mmHg', 1], ['Monitor', 'FA a 118 lpm', 1], ['Diltiazem', 'en perfusión', 1]],
    enunciado: 'La frecuencia baja, pero la PA cae a 84/50. <b>¿Qué haces ahora?</b>',
    opciones: [
      { t: 'Otro bolo de diltiazem: la FC aún no baja de 100.', porque: 'La hipotensión es la complicación que limita el diltiazem: aparece en el 20-30 % (p. 23). Otro bolo bajaría aún más la PA de Teodoro.' },
      { t: 'Esmolol, que se ajusta minuto a minuto.', porque: 'Los betabloqueantes se parecen al diltiazem en el riesgo de hipotensión y en el efecto inotrópico negativo (Tabla 19.1). Cambiarías un hipotensor por otro.' },
      { t: 'Paro el diltiazem y paso a amiodarona 150 mg en 10 min.', ok: true },
      { t: 'Digoxina sola, que no baja la PA.', porque: 'Sola no sirve para el control rápido: a las 6 h aún no baja de 100 lpm (Fig. 19.5, p. 25). Se usa como añadido al diltiazem o al betabloqueante con IC o PA lábil (p. 25).' }],
    explicacion: 'La amiodarona es la alternativa en quien no tolera el diltiazem o los betabloqueantes: deprime menos el corazón y da mucha menos hipotensión que el diltiazem. 150 mg IV en 10 min, repetibles, y después la perfusión (Tabla 19.1; p. 24-25).', fuente: C.amio, fuente2: C.t191 },
  { num: 'Paso 4', tipo: 'destapa', estado: 'fa', fcFA: 104, dia: 'Día 2 · noche',
    paciente: [['Amiodarona', 'en perfusión', 1], ['Monitor', 'FA a 104 lpm', 1]],
    enunciado: 'El adjunto te pregunta: <b>«¿Hasta dónde vas a bajar la frecuencia de Teodoro, y por qué?»</b>',
    puntos: [
      { t: 'No hay acuerdo en la cifra: los estudios han usado de <span class="hl-azul">80 a 110 lpm</span> como punto final.', c: C.final },
      { t: 'Un punto final más fisiológico: que <span class="hl-verde">desaparezca el déficit de pulso</span> (o que la sistólica deje de variar latido a latido), porque dos latidos muy juntos no llenan el ventrículo (Fig. 19.4).', c: C.f194 }],
    explicacion: 'El libro propone mirar el pulso, no solo la cifra del monitor (p. 22, 25).', fuente: C.final },
  { num: 'Paso 5', estado: 'fa', fcFA: 104, llenadoMalo: true, dia: 'Día 3 · la eco',
    paciente: [['Ritmo', 'sigue en FA', 1], ['Eco', 'estenosis mitral significativa', 1]],
    enunciado: 'Sigue en FA. Antes de pensar en el CHA₂DS₂-VASc (74 años, HTA, diabetes: 3 puntos), la eco enseña una estenosis mitral significativa. <b>¿Qué cambia?</b>',
    opciones: [
      { t: 'Es una FA valvular: siempre se anticoagula, y con warfarina.', ok: true },
      { t: 'Nada: con 3 puntos, anticoagulo con un ACOD, que sangra menos.', porque: 'La escala no vale para la FA valvular (p. 26) y la preferencia por los ACOD no llega a la FA con estenosis mitral significativa: ahí la warfarina es superior (p. 27). Teodoro quedaría peor protegido del ictus.' },
      { t: 'Solo antiagregar, porque con la estenosis la escala no vale.', porque: 'Que la escala no valga no quita la anticoagulación: la FA valvular la necesita siempre (p. 26). Antiagregado, Teodoro se quedaría sin la protección que pide la fuente.' },
      { t: 'Esperar a ver si sale de la FA antes de anticoagular.', porque: 'La FA valvular siempre requiere anticoagulación (p. 26). Esperar deja a Teodoro expuesto al trombo de la aurícula izquierda.' }],
    explicacion: 'La FA con estenosis mitral o con una prótesis es valvular: la escala de la Tabla 19.2 no se aplica y siempre se anticoagula; la warfarina (INR 2-3) es superior a los ACOD (p. 26-27). Y explica por qué se hundió: con el llenado ya limitado por la estenosis, una FC rápida baja el volumen latido (p. 21-22).', fuente: C.valv, fuente2: C.faCons },
  { num: 'Paso 6', tipo: 'error', estado: 'fa', fcFA: 96, llenadoMalo: true, dia: 'Día 3 · el plan del residente',
    paciente: [['Por la noche', 'se cayó al ir al baño, sin lesiones', 1]],
    enunciado: 'El R1 escribe el plan del alta a planta. <b>Puede haber 0, 1 o 2 errores.</b> Toca las frases que creas falsas.',
    frases: [
      { t: 'Se ha caído esta noche: no lo anticoagulo.', mal: true, buena: 'Una historia de caídas no contraindica la anticoagulación en la FA (p. 26).', cita: C.cha },
      { t: 'Warfarina, ajustada a un INR de 2-3.', cita: C.warf },
      { t: 'Ojo: la amiodarona frena el metabolismo de la warfarina.', cita: C.amio },
      { t: 'Mejor un ACOD, que no necesita controles.', mal: true, buena: 'En la FA valvular (estenosis mitral significativa) la warfarina es superior a los ACOD (p. 27).', cita: C.warf }],
    explicacion: 'Dos errores: las caídas no contraindican la anticoagulación, y con una estenosis mitral significativa la warfarina va antes que los ACOD.', fuente: C.warf },
], llevas: [
  'Diltiazem 0,25 mg/kg en 2 min y 5-15 mg/h; si cae la PA (20-30 %), amiodarona 150 mg en 10 min (p. 22-25).',
  'El punto final más fisiológico: que desaparezca el déficit de pulso (p. 22, 25).',
  'FA con estenosis mitral = valvular: siempre anticoagular, y con warfarina, no con un ACOD (p. 26-27).',
], vuelta: C.final };


// ---------- Del formato de la maqueta al del motor común (id, tipo, serie, chip del repaso, «Compruébalo» de G1) ----------
const CORTO = { G1: 'adenosina en la reentrada', G2: 'WPW: PR y onda delta', E1: 'WPW en FA', E2: 'FV tras el 2.º choque', G3: 'flúter 2:1', E3: 'TAM en la EPOC',
  E4: 'QTc de 0,52 s', E5: 'STEMI en la mujer', E6: 'ETCO₂ a los 20 min', E7: 'los tres hallazgos' };
export const PREGUNTAS = RECORRIDO_BASE.map(q => ({ ...q, id: 'rtv-' + q.num.toLowerCase(), serie: q.grupo, tipo: q.tipo || 'test', corto: CORTO[q.num],
  tocar: q.tocar ? { ...q.tocar, accion: 'ade6', pista: 'Pulsa «Adenosina 6 mg» y mira el torniquete del nodo.' } : undefined }));
export const CASOS = [{
  id: 'rtv-teodoro', titulo: CASO_BASE.titulo, sub: 'FA tras una lobectomía', corto: 'Teodoro',
  paciente: Object.fromEntries(CASO_BASE.pasos[0].paciente.map(([k, v]) => [k, v])),
  pasos: CASO_BASE.pasos.map((p, i) => ({
    momento: p.dia, datos: i ? Object.fromEntries(p.paciente.map(([k, v]) => [k, v])) : {}, nuevo: i ? p.paciente.map(([k]) => k) : [],
    pregunta: { ...p, id: 'rtv-teodoro-' + (i + 1), tipo: p.tipo || 'test', grupo: 'caso' } })),
  lleva: CASO_BASE.llevas, volver: { nombre: C.final.sitio, ancla: C.final.id }, fuenteVuelta: CASO_BASE.vuelta,
}];

// La frase buena de «encuentra el error» también va como `c` (la lee el juez de forma y el motor la enseña al pulsar «ver»)
CASOS[0].pasos.forEach(p => (p.pregunta.frases || []).forEach(f => { if (f.mal) f.c = f.buena; }));
PREGUNTAS.forEach(q => (q.frases || []).forEach(f => { if (f.mal) f.c = f.buena; }));

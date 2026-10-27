// Las preguntas y el caso de la Mayéutica del receptor vivo (Marino caps. 14, 16 y 17). Solo datos; el motor es
// js/core/mayeutica-motor.js. Las respuestas viven aquí: el HTML no las lleva hasta que se contesta.
import { C, coma } from './receptor-vivo-data.js';
const PREG_RECORRIDO = [
  { grupo: 'guia', num: 'G1', predice: true, estado: 'na-baja', ajustes: { na: 5 },
    enunciado: 'Amparo: vas a subir la noradrenalina de 5 a 25 µg/min. Antes de tocar la bomba, <b>¿qué cifra del monitor se mueve primero?</b>',
    opciones: [
      { t: 'La IRVS: la noradrenalina aprieta los vasos desde la primera gota.', porque: 'Por debajo de 10 µg/min pesa más el β y lo que sube es el gasto (p. 13). Si esperas ver la PAM arriba con 5, subirás la bomba de golpe sin ver lo que hace en el corazón de Amparo.' },
      { t: 'El IC: por debajo de 10 µg/min pesa el β del corazón.', ok: true },
      { t: 'La FC: la noradrenalina es, sobre todo, un fármaco que acelera.', porque: 'Su acción principal es el α y el β es débil (p. 12). Si esperas taquicardia para saber que actúa, creerás que no hace nada y la subirás de más.' },
      { t: 'Ninguna hasta los 30 µg/min: antes no se nota.', porque: 'A 30 se llega al techo, no al comienzo (p. 13). Esperar hasta ahí deja a Amparo con una PAM de 51 mucho más tiempo.' }],
    explicacion: 'Por debajo de 10 µg/min, el β de la noradrenalina puede subir el gasto; por encima de 10 predomina el α y sube la resistencia; a 30, no hay más respuesta.', fuente: C.naDosis,
    tocar: { txt: 'Compruébalo: sube la bomba de 5 a 25', de: 5, a: 25, k: 'na' } },
  { grupo: 'guia', num: 'G2', predice: true, estado: 'dopamina', ajustes: { dopamina: 10 },
    enunciado: 'Amparo está con dopamina a 10 µg/kg/min. Vas a subirla a 20. <b>¿Qué pasa con el IC en el monitor?</b>',
    opciones: [
      { t: 'Sigue subiendo: más dosis, más β₁ y más volumen latido.', porque: 'Por encima de 10 entra el α y la resistencia sube (p. 14). Subirías la dosis buscando gasto y lo que le darías a Amparo es más poscarga, más taquicardia y más riesgo de arritmia.' },
      { t: 'Baja algo: el α sube la poscarga y deshace parte de lo ganado.', ok: true },
      { t: 'No cambia: a más de 10 solo se estimulan los receptores de dopamina.', porque: 'Esos receptores son de la dosis baja, hasta 3 µg/kg/min (p. 14). Si creyeras que a 20 solo abre riñón e intestino, no esperarías que la PA suba por apretar los vasos.' },
      { t: 'La IRVS baja: la dopamina dilata el lecho renal y el esplácnico.', porque: 'Eso ocurre con dosis ≤3 µg/kg/min y solo en esos lechos (p. 14). A 20 manda el α: si esperas vasodilatación, pondrás dopamina a un shock que ya está vasodilatado.' }],
    explicacion: 'Con ≤3 µg/kg/min actúan los receptores de dopamina, con 3-10 el β del corazón, y por encima de 10 el α: la RVS sube y la poscarga puede deshacer la subida del volumen latido.', fuente: C.dopa,
    tocar: { txt: 'Compruébalo: sube la dopamina de 10 a 20', de: 10, a: 20, k: 'dopamina', cuenta: (r0, r1) => `el IC pasa de ${coma(r0.ic, 1)} a ${coma(r1.ic, 1)} y la IRVS sube de ${coma(r0.irvs, 1)} a ${coma(r1.irvs, 1)}: el α aprieta el anillo.` } },
  { grupo: 'guia', num: 'G3', predice: true, estado: 'fenilefrina', ajustes: { fenilefrina: 0 },
    enunciado: 'Hipotensión de la anestesia: vas a poner fenilefrina a 35 µg/min. <b>¿Qué hará la FC?</b> Mira el metrónomo después.',
    opciones: [
      { t: 'Subirá: al apretar los vasos, el corazón tiene que empujar más.', porque: 'La fenilefrina no trae llave para el β (p. 15) y la FC baja por reflejo (p. 42). Si esperas taquicardia, pensarás que no actúa y subirás la dosis hacia el máximo de 200 µg/min.' },
      { t: 'No cambiará: solo actúa en los vasos y no toca el corazón, así que el metrónomo sigue igual.', porque: 'Es cierto que solo abre el α₁, pero la FC baja de forma refleja (p. 42). Si no lo esperas, una FC que cae te hará buscar otra causa en vez de mirar la fenilefrina.' },
      { t: 'Bajará, aunque no toca el β: la fuente la describe como una posible bradicardia.', ok: true },
      { t: 'Subirá un poco, porque a dosis altas también abre el β₁.', porque: 'Es un agonista α puro (p. 15): no hay llave para el β a ninguna dosis. Si la crees β, la pondrías para sostener la FC y conseguirías lo contrario.' }],
    explicacion: 'La fenilefrina es un agonista α puro: aprieta los vasos y sube la PA, y puede acompañarse de bradicardia, que es refleja.', fuente: C.fenil, fuente2: C.csFenil,
    tocar: { txt: 'Compruébalo: pon la fenilefrina a 35', de: 0, a: 35, k: 'fenilefrina' } },
  { grupo: 'guia', num: 'G4', tipo: 'destapa', sinModelo: true,
    enunciado: 'Amparo lleva noradrenalina a 26 µg/min y la PAM no pasa de 62. El R1 pregunta: «¿la vasopresina la subo poco a poco, como la noradrenalina?». <b>¿Qué le contestas?</b> Son tres cosas.',
    puntos: [
      { t: 'No se titula: <span class="hl-azul">dosis fija de 0,03-0,04 U/min</span> (el libro imprime «U/h»: ver la nota).', c: C.vasoDosis },
      { t: 'Entra por <span class="hl-azul">otra cerradura, la V₁</span>: sube la PA y ahorra catecolamina, sin beneficio probado de supervivencia.', c: C.vasopresina },
      { t: 'Es el <span class="hl-rojo">segundo vasopresor</span> del séptico resistente a la noradrenalina: en voluntarios sanos no sube la PA; en el shock vasodilatador, sí.', c: C.vasopresina }],
    explicacion: 'La vasopresina se pone a dosis fija como segundo vasopresor; por eso en el modelo su bomba lleva candado.', fuente: C.vasoDosis },
  { grupo: 'guia', num: 'G5', predice: true, estado: 'dobutamina', ajustes: { dobutamina: 0 },
    enunciado: 'Aurelio, cardiogénico, con noradrenalina a 5 µg/min. Vas a poner dobutamina a 10 µg/kg/min. <b>¿Qué hará su PAM?</b>',
    opciones: [
      { t: 'Bajará: la dobutamina vasodilata y la PA cae.', porque: 'Tiene una vasodilatación leve, pero el volumen latido la compensa y mantiene la PA (p. 43). Si esperas una caída, no la pondrías por miedo a la hipotensión y Aurelio seguiría con IC 2,1.' },
      { t: 'Subirá mucho: aprieta el anillo de las arteriolas como la noradrenalina.', porque: 'Su receptor es el β₁, no el α (p. 43). Si la tomas por vasopresor, la usarás para subir la PA y Aurelio seguirá con el gasto bajo.' },
      { t: 'Subirá algo: el gasto compensa la vasodilatación.', ok: true },
      { t: 'No cambiará: solo mueve la FC.', porque: 'Sube también el volumen latido y la FC sube +5-15 lpm, y puede pasar de 30 (p. 43). Si crees que solo acelera, la retirarás por taquicardia sin ver que es lo que sostiene la PA.' }],
    explicacion: 'La dobutamina es el inotrópico más usado en el shock cardiogénico: mantiene la PA porque el volumen latido compensa la vasodilatación.', fuente: C.dobuta,
    tocar: { txt: 'Compruébalo: sube la dobutamina de 0 a 10', de: 0, a: 10, k: 'dobutamina', cuenta: (r0, r1) => `la PAM pasa de ${Math.round(r0.pam)} a ${Math.round(r1.pam)}, el IC de ${coma(r0.ic, 1)} a ${coma(r1.ic, 1)} y la IRVS baja de ${coma(r0.irvs, 1)} a ${coma(r1.irvs, 1)}: la vasodilatación se ve, y el gasto la compensa.` } },
  { grupo: 'guia', num: 'G6', predice: true, estado: 'milrinona', ajustes: { milrinona: 0 },
    enunciado: 'Aurelio, con noradrenalina a 5 µg/min. La milrinona no tiene cerradura propia: atasca la trituradora (la PDE). Vas a ponerla a 0,375 µg/kg/min. <b>¿Qué temes en su PAM?</b>',
    opciones: [
      { t: 'Que suba demasiado: es un inotrópico y el gasto lo compensa todo.', porque: 'Además de inotrópico, vasodilata, y esa hipotensión es un inconveniente mayor en el cardiogénico (p. 44). Si esperas que suba, la pondrás con PA justa y Aurelio caerá.' },
      { t: 'Que baje, porque también es vasodilatador.', ok: true },
      { t: 'Que no cambie: la PDE solo está en el miocito.', porque: 'El libro dice que también vasodilata (p. 44). Si lo ignoras, la pondrás sin vigilar la PA y Aurelio puede quedarse hipotenso.' },
      { t: 'Que acelere el corazón como la dobutamina.', porque: 'Con la milrinona hay menos riesgo de taquicardia que con la dobutamina (p. 44). Lo que debes temer es otra cosa: la PA.' }],
    explicacion: 'La milrinona es inotrópica y vasodilatadora: más apropiada en la insuficiencia cardíaca descompensada sin hipotensión que en el shock cardiogénico.', fuente: C.milri,
    tocar: { txt: 'Compruébalo: pon la milrinona a 0,375', de: 0, a: 0.375, k: 'milrinona', cuenta: (r0, r1) => `la PAM pasa de ${Math.round(r0.pam)} a ${Math.round(r1.pam)} y la IRVS de ${coma(r0.irvs, 1)} a ${coma(r1.irvs, 1)} aunque el IC sube de ${coma(r0.ic, 1)} a ${coma(r1.ic, 1)}: no hay cerradura, pero el anillo se afloja igual.` } },
  { grupo: 'guia', num: 'G7', sinModelo: true,
    enunciado: 'Amparo lleva noradrenalina por una vía periférica del brazo. De pronto la piel de alrededor se pone pálida y el brazo se hincha: es una extravasación. <b>¿Qué haces?</b>',
    opciones: [
      { t: 'Lavas el catéter con suero para arrastrar el fármaco que queda dentro, lo retiras y avisas a enfermería para que vigile la zona.', porque: 'No se lava la vía antes de quitarla (p. 12): empujarías el vasoconstrictor hacia el tejido y la zona isquémica sería mayor.' },
      { t: 'Esperas a ver si la palidez se resuelve sola; la fentolamina vale a las 24 h.', porque: 'La fentolamina solo funciona si se usa antes de 12 horas (p. 12). Esperar un día deja la piel sin riego hasta que ya no responde.' },
      { t: 'Paras la infusión, aspiras sin lavar, quitas el catéter e inyectas fentolamina 5-10 mg en 10 mL en la zona.', ok: true },
      { t: 'Das la fentolamina por vena, en bolo, para que llegue a todo el brazo.', porque: 'Se inyecta directamente en la zona de la extravasación (p. 12). Por vena, un bloqueante α bajaría más la PA de una paciente séptica ya hipotensa (fisiología general).' }],
    explicacion: 'Se para la infusión, se aspira lo que se pueda sin lavar la vía, se retira el catéter y se inyecta fentolamina (bloqueante α) en la zona, antes de 12 h. Si hay palidez, debería desaparecer casi enseguida.', fuente: C.extrav },
  { grupo: 'examen', num: 'E1', sinModelo: true,
    enunciado: 'Amparo, hora 10: noradrenalina 26 µg/min, vasopresina y, desde la hora 8, adrenalina a 0,1 µg/kg/min (≈8 µg/min). El lactato pasa de 3,1 a 5,0 mmol/L y la glucemia es de 262 mg/dL. <b>¿Qué cambio explica el receptor α de la adrenalina?</b>',
    opciones: [
      { t: 'El lactato: el α cierra el intestino y el lactato sale de ahí.', porque: 'El libro atribuye la subida del lactato a la producción aeróbica, no a la isquemia (p. 14). Leído como hipoperfusión, a Amparo le subirías volumen o fármacos que no necesita.' },
      { t: 'La taquicardia que aparece al subir la dosis.', porque: 'La taquicardia es del β (pp. 13-14). Si la culpas al α, bajarías la noradrenalina y dejarías la adrenalina, que es la que acelera a Amparo.' },
      { t: 'La glucemia: el α frena la secreción de insulina.', ok: true },
      { t: 'El gasto metabólico de todo el cuerpo, que se dispara.', porque: 'El libro cita el aumento del metabolismo sin darle receptor (p. 14). Dárselo al α no tiene base, y lo que le importa a Amparo es que ese gasto sobra en un shock.' }],
    explicacion: 'La adrenalina sube la glucemia porque el α inhibe la secreción de insulina, y sube el lactato por producción aeróbica: los dos engañan en el shock.', fuente: C.adre },
  { grupo: 'examen', num: 'E2', sinModelo: true,
    enunciado: '<b>¿En qué shock considera Marino la fenilefrina más apropiada que la noradrenalina?</b>',
    opciones: [
      { t: 'En el séptico con FA rápida: es la indicación que da el libro.', porque: 'Ahí el libro la llama «útil» como observación del autor (p. 15), no como regla. Tomarla por norma te haría cambiar la NA en cualquier séptico con FA, algo que el libro no pide.' },
      { t: 'En el cardiogénico por obstrucción del tracto de salida.', ok: true },
      { t: 'En el anafiláctico, como primer vasopresor tras la adrenalina.', porque: 'En la anafilaxia refractaria el libro la pone junto a la NA como segundo vasopresor posible, sin preferirla; y si la paciente toma betabloqueantes, antes va el glucagón (p. 67). Le faltaría el fármaco que funciona.' },
      { t: 'En el hipovolémico, mientras llega la sangre.', porque: 'El libro no la recomienda en ningún shock (p. 15). Al que sangra solo le subirías la PA del monitor, apretando además el riñón y el intestino, que se quedan con menos riego (p. 15).' }],
    explicacion: 'En el shock cardiogénico por obstrucción dinámica del tracto de salida del VI, un vasoconstrictor puro como la fenilefrina (que puede dar bradicardia refleja) es más apropiado que la noradrenalina; los inotrópicos están contraindicados.', fuente: C.csFenil, fuente2: C.csIno },
  { grupo: 'examen', num: 'E3', tipo: 'error', sinModelo: true,
    enunciado: 'Nota de evolución de Amparo, hora 12. <b>Puede haber 0, 1 o 2 errores.</b> Toca las frases que creas falsas.',
    frases: [
      { t: 'Noradrenalina a 30 µg/min: es improbable más respuesta, así que se añade un segundo vasopresor.', cita: C.naDosis },
      { t: 'Vasopresina a 0,03-0,04 U/min, subiéndola cada 5 min según la PA, como la noradrenalina.', mal: true, buena: 'La vasopresina va a dosis fija y no se titula, a diferencia de las catecolaminas (p. 16).', cita: C.vasoDosis },
      { t: 'Con la dopamina a 5 µg/kg/min se espera más volumen latido; el α entra por encima de 10.', cita: C.dopa },
      { t: 'Si se extravasa la noradrenalina, fentolamina en la zona antes de 12 h.', cita: C.extrav }],
    explicacion: 'Un error: la vasopresina no se titula (p. 16). La noradrenalina deja de dar respuesta hacia los 30 µg/min y entonces se añade otro vasopresor (p. 13); la dopamina pasa de β a α hacia los 10 µg/kg/min y la fentolamina local vale antes de 12 h.', fuente: C.vasoDosis },
];
// El caso de Begoña: anafilaxia en planta que no responde porque toma bisoprolol.
// Las cifras del paciente son del caso; conductas y dosis, de la ficha (Marino, cap. 17, p. 64-67).
const CASO = { titulo: 'El betabloqueante (Begoña)', pasos: [
  { num: 'Paso 1', sinModelo: true, estado: 'betabloqueo', dia: 'Planta · minuto 4 de la amoxicilina-clavulánico IV',
    paciente: [['Paciente', 'Begoña, 52 años, 65 kg; ingresada por neumonía'], ['Piel', 'habones y la cara hinchada', 1], ['Pulmón', 'sibilancias', 1], ['PA', '70/40 mmHg', 1]],
    enunciado: '<b>¿Qué le das primero, y por dónde?</b>',
    opciones: [
      { t: 'Hidrocortisona 200 mg IV: corta la reacción alérgica.', porque: 'No hay pruebas de que los corticoides frenen o eviten la reacción: «no tienen papel en el manejo agudo» (p. 66). Mientras, Begoña seguiría soltando mediadores con 70/40.' },
      { t: 'Adrenalina 0,5 mg IM en el muslo (0,5 mL de 1:1.000).', ok: true },
      { t: 'Adrenalina 0,5 mg subcutánea en el brazo.', porque: 'Por vía subcutánea se absorbe más despacio (p. 65): la dosis buena va IM profunda, en la cara anterolateral del muslo. Begoña tardaría más en recibir el único fármaco que para la reacción.' },
      { t: 'Difenhidramina y ranitidina IV, y ver cómo responde.', porque: 'Los antihistamínicos alivian síntomas, no cambian el curso, y nunca sustituyen a la adrenalina (p. 66). Begoña seguiría en shock.' }],
    explicacion: 'La adrenalina es el único fármaco que para la reacción: frena la salida de mediadores del mastocito. 0,3-0,5 mg (0,3-0,5 mL de la solución 1:1.000) IM profunda en el muslo, repetible cada 5-15 min (p. 65; Tabla 17.5).', fuente: C.anaAdre, fuente2: C.t175 },
  { num: 'Paso 2', tipo: 'destapa', sinModelo: true, estado: 'betabloqueo', dia: 'Minuto 10',
    paciente: [['Adrenalina', '2.ª dosis IM', 1], ['PA', '72/40 mmHg', 1]],
    enunciado: 'Sigue hipotensa. <b>¿Por qué necesita volumen, y cuánto le pones?</b> Son dos cosas.',
    puntos: [
      { t: 'Los capilares fugan: puede perder hasta el <span class="hl-rojo">35 % del volumen intravascular</span>, bastante para un shock hipovolémico.', c: C.anaShock },
      { t: 'Empezar con <span class="hl-azul">1-2 L de cristaloide (20-30 mL/kg) o 500 mL de albúmina al 5 %</span> en los primeros 5-10 min; después, según cómo responda.', c: C.anaShock }],
    explicacion: 'Con la fuga, casi todo el cristaloide sale del vaso y suma edema: la fuente sugiere añadir un coloide como la albúmina al 5 % (p. 67).', fuente: C.anaShock },
  { num: 'Paso 3', sinModelo: true, estado: 'betabloqueo', dia: 'Minuto 20 · la perfusión',
    paciente: [['Volumen', '2 L de cristaloide', 1], ['PA', '74/42 mmHg', 1]],
    enunciado: 'Pasas a adrenalina IV: 2 mg (2 mL de 1:1.000) en 200 mL de suero, que son 10 µg/mL. <b>Para 10 µg/min, ¿a qué ritmo pones la bomba?</b>',
    opciones: [
      { t: 'A 60 mL/h: 600 µg/h entre 10 µg/mL.', ok: true },
      { t: 'A 1 mL/h: 10 µg/min entre 10 µg/mL.', porque: 'Eso es 1 mL por minuto, no por hora: 10 µg/min × 60 = 600 µg/h, entre 10 µg/mL. A 1 mL/h Begoña recibiría 0,17 µg/min, nada.' },
      { t: 'A 6 mL/h: 600 µg/h entre 100 µg/mL.', porque: 'La solución lleva 10 µg/mL, no 100 (Tabla 17.5): a 6 mL/h le darías 1 µg/min, un décimo de lo pensado, y la PA de Begoña no subiría.' },
      { t: 'A 600 mL/h: los µg por hora, en mL.', porque: 'Falta dividir por la concentración: 600 mL/h serían 100 µg/min, unas siete veces el máximo de 15 (p. 67). Begoña haría taquiarritmias y una isquemia.' }],
    explicacion: 'En el shock anafiláctico, adrenalina IV a 5-15 µg/min, con la dilución 1:100.000 (10 µg/mL); puede ir precedida de un bolo de 10 µg, repetible, para mantener la PAM ≥65 (Tabla 17.5; p. 67).', fuente: C.t175, fuente2: C.anaShock },
  { num: 'Paso 4', estado: 'betabloqueo', ajustes: { adrenalina: 10, bisoprolol: 1, glucagon: 0 }, predice: true, dia: 'Minuto 30 · el giro',
    paciente: [['Adrenalina', '10 µg/min IV', 1], ['PA', '72/40 mmHg; FC 87 lpm', 1], ['En su hoja', 'bisoprolol, para la HTA', 1]],
    enunciado: 'No responde a la adrenalina ni al volumen, y la FC no pasa de 87. En su hoja de tratamiento aparece el bisoprolol. <b>¿Qué le das?</b>',
    opciones: [
      { t: 'Vasopresina, otra cerradura distinta del α y el β.', porque: 'La vasopresina no se ha evaluado en el shock anafiláctico (p. 67). Y lo que falla aquí es el β tapado, que deja a la adrenalina sin efecto en el mastocito (p. 66).' },
      { t: 'Subir la adrenalina hasta 30 µg/min.', porque: 'Con el β tapado por el bisoprolol, la respuesta a la adrenalina se atenúa o desaparece (p. 66). Le darías el doble del máximo de 15 µg/min (p. 67) sin que la llave gire.' },
      { t: 'Metilprednisolona IV, por si es una reacción bifásica.', porque: 'Los corticoides no previenen la recurrencia ni la frenan (p. 66). Begoña seguiría hipotensa.' },
      { t: 'Glucagón 1-5 mg IV en 5 min y 5-15 µg/min, de lado.', ok: true }],
    explicacion: 'El betabloqueante atenúa o anula la respuesta a la adrenalina; en la anafilaxia refractaria con β-bloqueo, el glucagón puede devolverla: 1-5 mg IV lento (5 min) y 5-15 µg/min. Da vómitos: si está obnubilada, de lado (p. 66-67).', fuente: C.anaGluc, fuente2: C.glucMec,
    tocar: { txt: 'Compruébalo: pon el glucagón', k: 'glucagon' } },
  { num: 'Paso 5', tipo: 'error', sinModelo: true, estado: 'betabloqueo', dia: 'Hora 1 · el plan del residente',
    paciente: [['Glucagón', 'en perfusión; ya responde', 1], ['PA', '96/58 mmHg', 1]],
    enunciado: 'El R1 escribe el plan para la noche. <b>Puede haber 0, 1 o 2 errores.</b> Toca las frases que creas falsas.',
    frases: [
      { t: 'Hidrocortisona IV cada 6 h para cortar la reacción.', mal: true, buena: 'Los corticoides no tienen papel en el manejo agudo: no revierten, no frenan ni evitan la reacción (p. 66).', cita: C.anaSeg },
      { t: 'Difenhidramina y ranitidina, después de la adrenalina.', cita: C.anaSeg },
      { t: 'Si aparece estridor, adrenalina nebulizada (2,5 mg).', cita: C.t175 },
      { t: 'Si vuelve a caer la PA, vasopresina como segundo vasopresor.', mal: true, buena: 'Si no responde a la adrenalina, el segundo vasopresor es la noradrenalina o la fenilefrina (con betabloqueante, el glucagón): la vasopresina no se ha evaluado en el shock anafiláctico (p. 67).', cita: C.anaShock }],
    explicacion: 'Dos errores. Los antihistamínicos alivian síntomas y van después de la adrenalina; la adrenalina nebulizada para el edema de laringe está en la Tabla 17.5, aunque su eficacia no está clara.', fuente: C.anaSeg },
], llevas: [
  'Adrenalina IM en el muslo primero: es la única que para la reacción; nada la sustituye (p. 65-66).',
  'Si toma un betabloqueante y no responde: glucagón 1-5 mg en 5 min y 5-15 µg/min, de lado (p. 66).',
  'Volumen a manos llenas (fuga del 35 %) y adrenalina IV a 5-15 µg/min: 10 µg/mL son 60 mL/h para 10 µg/min (p. 67).',
], vuelta: C.anaGluc };

/* ---------- Del formato de la maqueta al del motor común ---------- */
const CORTO = { G1: 'noradrenalina 5 → 25', G2: 'dopamina 10 → 20', G3: 'fenilefrina y FC', G4: 'vasopresina fija', G5: 'dobutamina y PAM', G6: 'milrinona y PAM', G7: 'extravasación', E1: 'adrenalina y α', E2: 'fenilefrina: cuándo', E3: 'nota de Amparo' };
const sinHtml = s => String(s).replace(/<[^>]+>/g, '');
// Una pregunta de la maqueta → una del motor: tipo test por defecto, id, rótulo corto, puntos como texto y frases con su corrección.
// Las citas de la pregunta, de cada punto y de cada frase se juntan en `fuente` (lista) (el «Ver en la ficha» de la respuesta las lleva todas).
function adaptar(q, id, corto) {
  const tipo = q.tipo === 'destapa' || q.tipo === 'error' ? q.tipo : 'test';
  const citas = [q.fuente, q.fuente2, ...(q.puntos || []).map(p => p.c), ...(q.frases || []).map(f => f.cita)].filter(Boolean);
  const unicas = [...new Map(citas.map(c => [c.id, c])).values()];
  const o = { ...q, id, tipo, corto: corto || sinHtml(q.enunciado).slice(0, 28), fuente: unicas };
  delete o.fuente2;
  if (q.puntos) o.puntos = q.puntos.map(p => p.t);
  if (q.frases) o.frases = q.frases.map(f => ({ t: f.t, mal: !!f.mal, c: f.mal ? f.buena : '' }));
  if (q.tocar) o.tocar = { ...q.tocar, pista: 'Pulsa el botón y mira el monitor.' };
  return o;
}
export const PREGUNTAS = PREG_RECORRIDO.map(q => adaptar(q, 'rcv-' + q.num.toLowerCase(), CORTO[q.num]));
export const CASOS = [(() => {
  const [p1, ...resto] = CASO.pasos;
  const dic = pares => Object.fromEntries(pares.map(([k, v]) => [k, v]));
  return {
    id: 'rcv-begona', titulo: CASO.titulo, sub: 'Anafilaxia en planta · el betabloqueante', corto: 'Begoña',
    paciente: dic(p1.paciente),
    pasos: CASO.pasos.map((s, i) => ({
      momento: s.dia, estado: s.estado, datos: i ? dic(s.paciente) : {}, nuevo: s.paciente.filter(x => x[2]).map(x => x[0]),
      pregunta: adaptar({ ...s, grupo: undefined }, `rcv-caso-${i + 1}`, `paso ${i + 1}`),
    })),
    lleva: CASO.llevas, volver: { nombre: 'Shock anafiláctico (Marino, cap. 17)', ancla: CASO.vuelta.id },
  };
})()];

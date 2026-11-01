// Las preguntas de «Lo que ves y lo que hay» (Mayéutica del modelo vivo iones-vivos): 13 del recorrido (7 de guía socrática y
// 6 de examen, en el orden de las fichas de Marino caps. 36-38) y dos casos: Adela (hiperpotasemia) y Valentín (transfusión
// masiva). Datos puros: el motor común (js/core/mayeutica-motor.js) los pinta desde js/modules/libros/iones-vivos/mayeutica.js.
// Las citas son páginas del PDF «E» (docs/marino-2024-electrolitos-caps35-38.pdf); la app las enlaza con la ficha por PAG_FICHA.
// `estado`: cómo se pone el modelo antes de la pregunta { preset, ion, s (cambios al paciente), acc (acciones ya hechas) }.
// Las cifras de los casos son las del monitor de la app (leer de motor.js), no cálculos aparte.
const G = (num, o) => ({ grupo: 'guia', num, predice: true, ...o });
const X = (num, o) => ({ grupo: 'examen', num, ...o });

const RECORRIDO_BASE = [
  G('G1', { estado: { preset: 'normal', ion: 'k' }, corto: 'el iceberg del K⁺',
    enunciado: 'Un adulto de 70 kg tiene unos 3.500 mEq de potasio y casi todo está dentro de las células. Antes de mirar la ventanita: <b>si el K⁺ del suero baja de 4 a 3 mEq/L por pérdida, ¿cuánto potasio total ha perdido? ¿Y cuánto habría ganado si hubiera subido de 4 a 5?</b>',
    opciones: [
      { t: 'Lo mismo en los dos sentidos: 100-200 mEq por cada mEq/L.', porque: 'Eso vale solo para el exceso. Con déficit, el potasio de dentro de la célula repone el del suero y hacen falta 200-400 mEq (p. 19). Si lo supones simétrico, repondrás la mitad de lo que falta.' },
      { t: 'Solo unos 10 mEq: el suero guarda casi todo el potasio del cuerpo.', porque: 'El plasma tiene menos del 1 % del potasio del cuerpo (p. 29): 10 mEq no mueven el suero 1 mEq/L. Si lo crees, tomarás un 3,0 por un descuido leve cuando faltan cientos de mEq.' },
      { t: 'Perdió unos cientos de mEq (200-400 por mEq/L); para subir 1 mEq/L bastan 100-200.', ok: true },
      { t: 'Más al subir que al bajar: el exceso se reparte por toda la célula y cuesta más retirarlo del suero.', porque: 'Es al revés: al subir bastan 100-200 mEq y al bajar hacen falta 200-400, el doble (p. 19). Si lo crees, retirarás de más en la hiperpotasemia o repondrás de menos en la hipopotasemia.' }],
    explicacion: 'Con el potasio bajo, el de dentro de la célula repone el del suero, y hace falta el doble de pérdida para el mismo cambio: 200-400 mEq por cada mEq/L de descenso, frente a 100-200 mEq por cada mEq/L de subida (p. 19, Fig. 36.2). Nota de fuentes: el texto da 200-400 mEq por mEq/L, pero la Tabla 36.1 da 175 mEq para un K⁺ de 3,0 (p. 22); por eso se habla de «unos cientos». El suero es la punta del iceberg: menos del 1 % del potasio del cuerpo (p. 29).', fuente: 19, fuente2: 20, fuente3: 29 }),
  G('G2', { estado: { preset: 'damian', ion: 'k' }, corto: 'insulina y K⁺', tras: 'real',
    enunciado: 'Damián, alcohólico desnutrido, empieza la nutrición con glucosa e insulina. El K⁺ y el fosfato del suero están tapados. Antes de mirar: <b>¿cuánto cae el K⁺ del suero y cuánto potasio total pierde el cuerpo?</b>',
    opciones: [
      { t: 'El suero baja del orden de medio punto y el total no cambia: el potasio solo cambia de sitio.', ok: true },
      { t: 'El suero baja y el total cae 100-200 mEq: la glucosa se lo lleva por la orina.', porque: 'El potasio solo cambia de sitio: entra en el músculo (p. 21, 28) y el total no varía. Si lo crees, repondrás 100-200 mEq que Damián no ha perdido y le pasarás potasio de más.' },
      { t: 'El suero sube, porque la glucosa arrastra potasio al plasma; la hipopotasemia se corrige sola.', porque: 'Es al contrario: la insulina lo lleva al músculo (p. 28). Si lo crees, no repondrás a Damián y su K⁺ seguirá bajo, con el déficit total sin cubrir.' },
      { t: 'No cambia: la insulina solo mueve la glucosa.', porque: 'También mueve potasio, activando la bomba Na⁺-K⁺ de la célula (p. 28). Damián perdería medio punto de K⁺ sin que lo vigiles.' }],
    explicacion: 'La insulina (y los β₂-adrenérgicos) mete el potasio en la célula: el suero baja y el total no cambia (p. 20-21, 28). El modelo baja 0,6 mEq/L por dosis: en la hiperpotasemia, 10 U con 50 mL de glucosa al 50 % bajan al menos 0,6 mEq/L (p. 28).', fuente: 21, fuente2: 28 }),
  G('G3', { estado: { preset: 'rufino', ion: 'mg' }, corto: 'el Mg²⁺ que frena al K⁺',
    enunciado: 'Rufino lleva 5 días con sonda nasogástrica y furosemida. Con ClK a 20 mEq/h, el K⁺ no sube. Las cifras del suero están tapadas. <b>¿Qué haces?</b>',
    opciones: [
      { t: 'Subo el ClK a 40 mEq/h por la cava superior para que llegue antes.', porque: 'Por encima de 20 mEq/h el libro desaconseja la cava superior por el riesgo de asistolia (p. 23), y el potasio se seguiría perdiendo por la orina.' },
      { t: 'Espero: la curva es plana y el suero tarda en subir mientras el déficit es grande.', porque: 'La parte plana explica una subida lenta al principio (p. 23), pero si no responde hay que sospechar el magnesio (p. 29); esperar deja la pérdida renal activa.' },
      { t: 'Repongo magnesio: sin él, el riñón sigue perdiendo potasio y el K⁺ no sube.', ok: true },
      { t: 'Paso más ClK: el déficit es mayor de lo que creo (200-400 mEq por cada mEq/L).', porque: 'El déficit puede ser grande (p. 19), pero cuando el K⁺ no responde a la reposición el libro manda pensar en el magnesio (p. 29); con más ClK, el riñón seguiría perdiendo potasio (p. 21).' }],
    explicacion: 'La depleción de magnesio impide la reabsorción renal de potasio, sobre todo con diuréticos, y la hipopotasemia se resiste al ClK hasta reponer el magnesio (p. 21, 23). Si el potasio no corrige, el déficit de magnesio es la causa probable (p. 29). El modelo no acopla Mg²⁺ y K⁺: el vínculo es de la fuente.', fuente: 21, fuente2: 23, fuente3: 29 }),
  G('G4', { estado: { preset: 'rufino', ion: 'k' }, corto: 'ClK: ritmo y vía', tras: 'clk40',
    enunciado: 'El K⁺ de Rufino es muy bajo y quieres pasarle ClK a 40 mEq/h. Antes de tocar los mandos: <b>¿por dónde lo pones?</b>',
    opciones: [
      { t: '40 mEq/h por la cava superior: el catéter llega más cerca del corazón y se mezcla mejor.', porque: 'Por la cava superior, con más de 20 mEq/h, hay riesgo (mal documentado) de asistolia (p. 23). En el modelo, ese tope es el sello de asistolia.' },
      { t: 'Por una vena central grande, y si pasas de 20 mEq/h, no por la cava superior.', ok: true },
      { t: 'Por una vena periférica: 40 mEq/h son tolerables si el calibre es bueno.', porque: 'El ClK concentrado es muy hiperosmótico e irrita: el libro prefiere una vena central grande (p. 23). En una periférica, Rufino acabaría con la vena dañada.' },
      { t: 'Nunca más de 20 mEq/h, aunque el K⁺ sea muy bajo.', porque: 'El máximo habitual es 20 mEq/h, pero 40 puede hacer falta en la hipopotasemia grave (p. 23). Si te limitas, tardarás en corregir una pérdida de cientos de mEq.' }],
    explicacion: 'Pauta estándar: 20 mEq de K⁺ en 100 mL de salino en 1 h; el máximo habitual es 20 mEq/h, aunque 40 mEq/h pueden hacer falta en la grave. Se prefiere una vena central grande; por la cava superior no más de 20 mEq/h (p. 23).', fuente: 23 }),
  X('E1', { estado: { preset: 'valentin', ion: 'k' }, corto: 'K⁺ de las bolsas',
    enunciado: 'Valentín, politrauma, recibe 10 concentrados de hematíes de 18 días de almacenamiento. <b>¿Cuánto potasio le entra con las bolsas?</b>',
    opciones: [
      { t: 'Unos 20-30 mEq (2-3 por concentrado), más que el potasio de todo su plasma.', ok: true },
      { t: 'Casi nada: 2-3 mEq en total.', porque: 'Es lo que trae cada concentrado (p. 25); con 10, la carga es 10 veces mayor. Si lo ignoras, no vigilarás el K⁺ de un paciente que quizá no filtra.' },
      { t: 'Unos 200-300 mEq, y por eso todo politrauma transfundido se hace hiperpotasémico.', porque: 'La carga es de 2-3 mEq por concentrado, no 20-30 por concentrado (p. 25); y la hiperpotasemia es una complicación reconocida pero inconstante (p. 25).' },
      { t: 'Nada: el K⁺ de los hematíes se queda dentro durante el almacenamiento.', porque: 'A 4 °C la bomba Na⁺-K⁺ del hematíe se apaga y el potasio sale poco a poco (p. 25). Si lo ignoras, olvidarás la carga de las transfusiones masivas.' }],
    explicacion: 'Tras 18 días de almacenamiento, cada concentrado trae 2-3 mEq de potasio (la bomba del hematíe se apaga a 4 °C): una transfusión masiva (6 o más concentrados) supone al menos 12-18 mEq, frente a unos 9-10 mEq de K⁺ en todo el plasma (p. 25). La hiperpotasemia es una complicación reconocida pero inconstante, y empieza a aparecer tras 7 concentrados (p. 25).', fuente: 25 }),
  X('E2', { estado: { preset: 'adela', ion: 'k' }, corto: 'gluconato o cloruro',
    enunciado: 'Un paciente con K⁺ de 6,6 mEq/L (grave, por encima de 6,5) entra en <b>colapso circulatorio</b>. Quieres proteger el corazón ya. <b>¿Qué calcio das, y cuánto?</b>',
    opciones: [
      { t: 'Gluconato al 10 %: 10 mL (90 mg) en 3 min, que es el habitual.', porque: 'Es el calcio del paciente estable; en el colapso circulatorio o la parada el libro reserva el cloruro (p. 27), con 27 mg/mL frente a 9 mg/mL (p. 45). Con gluconato llegaría un tercio del calcio por mL.' },
      { t: 'Gluconato: 22 mL (200 mg) en 100 mL de salino en 10 min.', porque: 'Es la pauta de la hipocalcemia sintomática (p. 45). En la hiperpotasemia el bolo es de 10 mL en 3 min (p. 27); a ese ritmo el calcio llega tarde al corazón en colapso.' },
      { t: 'No calcio: primero baja el K⁺ con insulina, porque el calcio no hace nada por él y solo retrasa.', porque: 'El calcio no baja el K⁺, pero protege la conducción en minutos y es el primer objetivo (Tabla 36.3, p. 27). Esperar a la insulina deja el corazón sin proteger 30-60 min.' },
      { t: 'Cloruro al 10 %: 10 mL (270 mg), el triple de calcio elemental que el gluconato.', ok: true }],
    explicacion: 'El calcio antagoniza la despolarización de la hiperpotasemia: el efecto se ve en minutos y se disipa en 30-60 min (p. 27). En el colapso circulatorio o la parada se usa el cloruro (27 mg/mL, el triple de calcio elemental); en el paciente estable, el gluconato (9 mg/mL) (p. 27, 45). Con cualquiera, comprueba cuál tienes en la mano (p. 29).', fuente: 27, fuente2: 29 }),
  X('E3', { estado: { preset: 'adela', ion: 'k', acc: [['ca', 90]] }, corto: 'eliminar el potasio',
    enunciado: 'Un paciente con hiperpotasemia grave ya tiene calcio e insulina con glucosa, y la insulina es temporal. Para <b>sacar potasio del cuerpo</b>, ¿qué eliges?',
    opciones: [
      { t: 'Poliestireno sulfonato (SPS) 15 g cada 6 h por boca: es la resina de siempre y la más probada.', porque: 'El libro cuestiona el SPS por su eficacia incierta, su inicio lento y las lesiones necróticas del intestino; hoy se favorece el SZC (p. 28).' },
      { t: 'SZC 10 g por vía oral cada 8 h durante 48 h; hemodiálisis si hace falta más.', ok: true },
      { t: 'Salbutamol inhalado a dosis ×4, solo, para bajar 0,5-1 mEq/L.', porque: 'Mueve el potasio a la célula, no lo elimina; con 4 veces la dosis da taquicardia y nunca debe usarse solo (p. 28).' },
      { t: 'Bicarbonato sódico para alcalinizarlo y sacar el potasio.', porque: 'Sin acidosis metabólica no tiene efecto sobre el K⁺ en 4 h, y forma complejos con el calcio que acabas de dar (p. 28).' }],
    explicacion: 'Hay que eliminar el potasio, no solo moverlo: resinas de intercambio por el intestino (el SZC, 10 g tres veces al día durante 48 h, es hoy la favorita y actúa tras una hora) o hemodiálisis, lo más eficaz: 1 mEq/L en 1 h y 2 mEq/L en 3 h (p. 28-29).', fuente: 28, fuente2: 29 }),
  G('G5', { estado: { preset: 'rufino', ion: 'mg' }, corto: 'reponer Mg²⁺: el doble',
    enunciado: 'Rufino tiene un Mg²⁺ bajo pero silente (1-1,4 mEq/L) y el riñón funciona. El libro supone un déficit total de 1-2 mEq/kg. <b>¿Cuánto Mg²⁺ tienes que prever dar en total, y por qué?</b>',
    opciones: [
      { t: 'El doble del déficit, porque hasta el 50 % de lo que infundes se pierde por la orina.', ok: true },
      { t: 'Justo el déficit: lo infundido se retiene entero.', porque: 'Hasta el 50 % del magnesio infundido se pierde por la orina (p. 37). Con la dosis exacta, Rufino seguiría con el depósito a medias.' },
      { t: 'La mitad: el hueso, con el 53 % del magnesio, repone el resto.', porque: 'El libro no dice que el hueso lo reponga (el reparto es de la Tabla 37.1, p. 32); asume el doble de déficit (p. 37). Rufino seguiría vacío y su K⁺ sin subir.' },
      { t: 'Igual con insuficiencia renal: el riñón sigue eliminando lo que sobre, así que no hay que ajustar.', porque: 'Con insuficiencia renal se da no más del 50 % de la pauta (p. 37): el riñón elimina menos y el Mg²⁺ puede subir hacia cifras de bloqueo.' }],
    explicacion: 'Se asume un déficit de 1-2 mEq/kg y, como hasta el 50 % se pierde por la orina, se prevé el doble: 1 mEq/kg el primer día y 0,5 mEq/kg los 3-5 siguientes. El bolo sube el suero, pero empieza a caer a los 15 min (p. 37-38). Con insuficiencia renal, no más del 50 % de la pauta (p. 37).', fuente: 37, fuente2: 38 }),
  X('E4', { estado: { preset: 'rufino', ion: 'mg' }, corto: 'Mg²⁺ con torsade',
    enunciado: 'Rufino, con hipomagnesemia, hace una torsade de pointes. <b>¿Cómo repones el magnesio?</b>',
    opciones: [
      { t: '2 g de MgSO₄ (16 mEq) IV en 2-5 min, y luego 5 g en 250-500 mL de salino en 6 h.', ok: true },
      { t: '6 g de MgSO₄ en 250-500 mL de salino en 3 h: la pauta estándar de la hipomagnesemia, sin prisa.', porque: 'Es la pauta de la hipomagnesemia moderada sin arritmia (p. 37). Con la torsade en curso, 3 h es demasiado lento.' },
      { t: '6 g de MgSO₄ de golpe en 5 min, para corregirlo antes.', porque: 'El libro da 2 g en 2-5 min y el resto en perfusión (p. 37) y no ofrece base para dosis mayores en bolo; el Mg²⁺ por encima de 10 mEq/L da bloqueo AV y por encima de 13, parada (p. 39).' },
      { t: '1 mEq/kg en 24 h y 0,5 mEq/kg los días siguientes.', porque: 'Es la pauta de la hipomagnesemia leve y silente (p. 37); con una torsade, Rufino seguiría arrítmico durante horas.' }],
    explicacion: 'En la hipomagnesemia con arritmia grave (torsade) o convulsiones: 2 g de MgSO₄ (16 mEq) IV en 2-5 min, 5 g en 6 h y 5 g cada 12 h durante 5 días. Si el riñón falla, no más del 50 % (p. 37). El suero normaliza en 1-2 días; el depósito, en varios días (p. 38).', fuente: 37, fuente2: 38 }),
  G('G6', { estado: { preset: 'normal', ion: 'ca', s: { alb: 2.0 } }, corto: 'Ca total con poca albúmina',
    enunciado: 'Albúmina 2,0 g/dL. El laboratorio da un calcio <b>total</b> de 7,4 mg/dL. El iónico está tapado. Antes de mirar: <b>¿qué esperas del iónico?</b>',
    opciones: [
      { t: 'Bajo, como el total: son lo mismo.', porque: 'El total suma tres fracciones y la albúmina solo mueve la que va unida a ella (Fig. 38.1, p. 43). Si lo crees, le darás calcio a un paciente con iónico normal, y el calcio IV se asocia a fallo multiorgánico (p. 46).' },
      { t: 'La albúmina baja no lo explica: el iónico no depende de ella; hay que medirlo.', ok: true },
      { t: 'Alto: el calcio que suelta la albúmina queda libre.', porque: 'La fracción libre no sube al caer la albúmina (p. 43). Si lo crees, dejarás sin explicar el total bajo y buscarás un exceso que no existe.' },
      { t: 'Me da igual: lo corrijo con la fórmula de la albúmina y me fío del resultado corregido.', porque: 'Ninguno de los factores de corrección es fiable; hay que medir el iónico con electrodo (p. 43). Con la fórmula, un iónico real alterado pasaría inadvertido.' }],
    explicacion: 'El ensayo mide las tres fracciones: con poca albúmina baja el total y el iónico, la fracción activa, no se mueve (Fig. 38.1, p. 43); en UCI el iónico bajo es muy frecuente (88 % en una encuesta, p. 44), por eso se mide. Ninguna fórmula de corrección es fiable: se mide con electrodo, sin burbujas y sin tubos con heparina, citrato o EDTA (p. 43).', fuente: 43 }),
  X('E5', { estado: { preset: 'normal', ion: 'ca', s: { ph: 7.52 } }, corto: 'alcalosis y tubo',
    tipo: 'error',
    enunciado: 'Paciente con pH 7,52 y calcio total normal. Un compañero escribe su plan. <b>Puede haber 0, 1 o 2 errores.</b> Toca las frases que creas falsas.',
    frases: [
      { t: 'La alcalosis o una infusión de bicarbonato pueden bajar el Ca iónico con el total normal.', cita: 44 },
      { t: 'Saco la muestra del iónico en un tubo con heparina, citrato o EDTA.', mal: true, buena: 'Los anticoagulantes ligan calcio: la muestra no va en tubos con heparina, citrato ni EDTA, y sin burbujas de gas (p. 43).', cita: 43 },
      { t: 'Con la albúmina baja, el Ca total baja y el iónico no se mueve.', cita: 43 }],
    explicacion: 'Un error: heparina, citrato y EDTA ligan calcio y falsean el iónico (p. 43). La alcalosis une calcio a la albúmina y baja el iónico sin tocar el total (p. 44).', fuente: 43, fuente2: 44 }),
  X('E6', { estado: { preset: 'valentin', ion: 'ca' }, corto: 'lo que baja el iónico',
    tipo: 'destapa',
    enunciado: 'Valentín: albúmina 3,0, pH 7,22 y 10 concentrados. El libro nombra varias cosas que bajan el Ca iónico sin mover el total que da el laboratorio. <b>¿Cuáles?</b>',
    puntos: [
      { t: 'La <span class="hl-azul">alcalosis</span>: une calcio a la albúmina y baja la fracción iónica.', c: 44 },
      { t: 'El <span class="hl-azul">bicarbonato</span> infundido: forma complejos con el calcio libre.', c: 44 },
      { t: 'El <span class="hl-azul">citrato</span> de la sangre almacenada: forma complejos con el calcio y es la causa en la transfusión masiva.', c: 44 }],
    explicacion: 'El ensayo del total incluye los complejos, así que en este modelo el citrato y el bicarbonato bajan el iónico y no el total. En la insuficiencia renal, la acidosis ayuda a mantener el iónico (p. 44). En el modelo, el pH 7,22 de Valentín sube un poco su iónico y el citrato lo baja mucho más.', fuente: 44 }),
  G('G7', { estado: { preset: 'damian', ion: 'p' }, corto: 'fosfato y realimentación', tras: 'real',
    enunciado: 'Damián lleva días con nutrición rica en glucosa y su fosfato era marginal. El fosfato del suero está tapado. Antes de mirar: <b>¿qué le pasa al fosfato y por qué importa?</b>',
    opciones: [
      { t: 'Sube: la glucosa y la insulina sacan el fosfato de la célula hacia el suero y lo elevan.', porque: 'La glucosa entra en la célula acompañada de fosfato (p. 49). Si lo crees, no lo medirás durante la nutrición y la hipofosfatemia pasará inadvertida.' },
      { t: 'No cambia: la insulina solo mueve la glucosa y el potasio.', porque: 'También mueve el fosfato: la carga de glucosa es la causa más común de hipofosfatemia del hospitalizado (p. 49). Damián llegaría a la debilidad respiratoria sin aviso.' },
      { t: 'Cae, pero no importa: no da síntomas.', porque: 'La hipofosfatemia es una fuente importante del síndrome de realimentación, que puede acabar en insuficiencia respiratoria y colapso cardiovascular (p. 49).' },
      { t: 'Cae: la glucosa entra en la célula con el fosfato; por debajo de 1 mg/dL es grave.', ok: true }],
    explicacion: 'La glucosa entra en las células acompañada de fosfato: es la causa más común de hipofosfatemia del hospitalizado, típica de la realimentación del alcohólico o desnutrido; con nutrición parenteral aparece a los 2 días y es grave (<1 mg/dL) a la semana (Fig. 38.2, p. 49). El salto de una dosis en el modelo es ilustrativo.', fuente: 49 }),
];

// ---------- Del formato de la maqueta al del motor común (id, tipo, serie) ----------
export const PREGUNTAS = RECORRIDO_BASE.map((q, i) => ({ ...q, id: 'iov-' + q.num.toLowerCase(), serie: q.grupo, tipo: q.tipo || 'test' }));
PREGUNTAS.forEach(q => (q.frases || []).forEach(f => { if (f.mal) f.c = f.buena; }));

// ---------- Casos ----------
const T = { preset: 'adela', ion: 'k' };
const ADELA = [
  { momento: 'Urgencias · la analítica', datos: {}, nuevo: [], estado: T,
    pregunta: { num: 'Paso 1', estado: T, enunciado: 'El laboratorio informa de un K⁺ de 6,9 mEq/L en un tubo «hemolizado». <b>¿Qué haces?</b>',
      opciones: [
        { t: 'Lo descarto como hemólisis y no hago nada más.', porque: 'La hemólisis puede dar un K⁺ falso (p. 23-24), pero Adela toma enalapril y espironolactona, que causan hiperpotasemia real (p. 25). Si lo descartas sin repetir, dejarás sin tratar una hiperpotasemia verdadera.' },
        { t: 'Pongo ya insulina con glucosa: mover el potasio no puede esperar.', porque: 'Sin confirmar la cifra, tratarías un posible valor falso (p. 23-24) y Adela recibiría un tratamiento que quizá no necesita.' },
        { t: 'Espero a ver si el laboratorio lo repite solo.', porque: 'Ante una hiperpotasemia sin razón aparente, el libro pide extraer tú la muestra evitando el puño y la succión (p. 24); aquí sí hay razón (p. 25), y esperar retrasa el tratamiento si es real.' },
        { t: 'Repito la extracción yo mismo, sin puño ni succión excesiva, y miro el ECG mientras tanto.', ok: true }],
      explicacion: 'La pseudohiperpotasemia viene de hemólisis, de apretar el puño o de aspirar con fuerza; se sospecha cuando no hay razón y se extrae la muestra uno mismo (p. 23-24). Con enalapril y espironolactona sí hay razón (p. 25): se repite sin demorar el ECG. La cifra de 6,9 es del caso inventado, no del libro.', fuente: 24, fuente2: 25 } },
  { momento: 'Urgencias · muestra repetida', datos: { 'K⁺ repetido': '6,6 mEq/L' }, nuevo: ['K⁺ repetido'], estado: T, haz: ['ca', 90],
    pregunta: { num: 'Paso 2', estado: T, enunciado: 'El K⁺ repetido es de 6,6 mEq/L (grave: >6,5, p. 27). <b>¿Qué haces primero?</b>',
      opciones: [
        { t: 'Insulina con glucosa: es lo que más baja el K⁺.', porque: 'La insulina no protege la conducción y su pico llega a los 30-60 min (p. 28). El primer objetivo es estabilizar el corazón con calcio (Tabla 36.3, p. 27).' },
        { t: 'Gluconato cálcico al 10 %, 10 mL (90 mg) en 3 min, repetible a los 5.', ok: true },
        { t: 'Cloruro cálcico, que tiene el triple de calcio.', porque: 'Se reserva para el colapso circulatorio o la parada (p. 27). Adela está estable.' },
        { t: 'Espero al ECG antes de tratar: el 6,6 es solo un número.', porque: 'Es hiperpotasemia grave por la cifra (>6,5) aunque el ECG no cambie (p. 27); esperar deja a Adela sin protección cardíaca.' }],
      explicacion: 'Hiperpotasemia grave es K⁺ >6,5 mEq/L, o cualquier K⁺ con cambios en el ECG (p. 27); el modelo no dibuja el ECG de la hiperpotasemia. Primero se estabiliza el corazón: gluconato al 10 %, 10 mL en 3 min, repetible a los 5. El monitor lo confirma: el K⁺ del suero no baja con el calcio.', fuente: 27 } },
  { momento: 'Urgencias · mover el potasio', datos: { 'Calcio': 'gluconato 10 mL (90 mg)', 'Ca iónico': '1,26 mmol/L' }, nuevo: ['Calcio', 'Ca iónico'], estado: { ...T, acc: [['ca', 90]] }, haz: ['real'],
    pregunta: { num: 'Paso 3', estado: { ...T, acc: [['ca', 90]] }, enunciado: 'Ya tiene el gluconato (el Ca iónico del monitor sube a 1,26 mmol/L). Ahora pones insulina regular 10 U con 50 mL de glucosa al 50 %. <b>¿Qué esperas, y qué más tienes que hacer?</b>',
      opciones: [
        { t: 'Baja al menos 0,6 mEq/L, pico a los 30-60 min y efecto temporal: hay que eliminar potasio.', ok: true },
        { t: 'Lo normaliza del todo y para siempre: ya no hace falta nada más.', porque: 'El efecto es temporal (pico a los 30-60 min) y baja al menos 0,6 mEq/L, no todo el exceso (p. 28). Si lo crees, el K⁺ de Adela volvería a subir sin que lo vigiles.' },
        { t: 'Baja 3 mEq/L en pocos minutos, igual que el calcio protege el ECG, y con eso el potasio queda resuelto.', porque: 'La cifra del libro es de al menos 0,6 mEq/L y de efecto pico a los 30-60 min (p. 28), no minutos. Esperar más de la cuenta retrasa la eliminación.' },
        { t: 'No baja el K⁺, solo protege el corazón como el calcio.', porque: 'La insulina sí mueve el potasio a las células (p. 28); el que protege la conducción es el calcio (p. 27).' }],
      explicacion: 'La insulina-glucosa baja el K⁺ al menos 0,6 mEq/L, con efecto temporal (pico a los 30-60 min): hay que añadir medidas para eliminar el potasio (resinas, SZC o hemodiálisis) (p. 28). El modelo baja 0,6 mEq/L por dosis.', fuente: 28, fuente2: 27 } },
  { momento: 'Pasan 45 minutos', datos: { 'K⁺ ahora': '6,0 mEq/L (era 6,6)', 'Ca iónico': '1,15 mmol/L (1,26 con el calcio)' }, nuevo: ['K⁺ ahora', 'Ca iónico'], estado: { ...T, acc: [['ca', 90], ['real'], ['esperar', 45]] },
    pregunta: { num: 'Paso 4', estado: { ...T, acc: [['ca', 90], ['real'], ['esperar', 45]] }, enunciado: 'Pasan 45 minutos desde el gluconato y la insulina. En el monitor, el K⁺ ha bajado de 6,6 a 6,0 mEq/L y el Ca iónico ha vuelto a 1,15 mmol/L (era 1,26 con el calcio). <b>¿Qué ha pasado y qué haces?</b>',
      opciones: [
        { t: 'Repito el calcio cada pocos minutos hasta que el Ca iónico se mantenga.', porque: 'El libro repite el calcio a los 5 min si hace falta, sumado a otras medidas (p. 27), pero el calcio no baja el K⁺: se disiparía otra vez en 30-60 min con el potasio sin eliminar.' },
        { t: 'Ha bajado casi un punto: está resuelto y basta con vigilar.', porque: 'La insulina es temporal (pico a los 30-60 min, p. 28) y el calcio ya no protege (iónico de vuelta a 1,15); sin eliminar potasio, el K⁺ de Adela volvería a subir.' },
        { t: 'Paso directo a hemodiálisis, sin resina: es lo único que elimina potasio.', porque: 'La hemodiálisis es lo más eficaz, pero las resinas (SZC, favorita) también lo eliminan (p. 28); Adela, estable, empezaría una técnica invasiva sin necesitarla aún.' },
        { t: 'El calcio se disipó y la insulina es temporal: elimino potasio (SZC; hemodiálisis si no baja).', ok: true }],
      explicacion: 'El efecto del calcio se disipa en 30-60 min (p. 27) y el de la insulina es temporal (p. 28): el modelo lo muestra con el iónico de vuelta a 1,15 y el K⁺ en 6,0 (la bajada mínima de la insulina, 0,6 mEq/L, p. 28). Se elimina potasio con SZC (10 g tres veces al día) o, si no baja, con hemodiálisis: 1 mEq/L en 1 h y 2 mEq/L en 3 h (p. 28-29).', fuente: 27, fuente2: 29 } },
  { momento: 'Antes de pasarla a planta', datos: { 'Hemodiálisis': 'en marcha' }, nuevo: ['Hemodiálisis'], estado: { ...T, acc: [['ca', 90], ['real'], ['esperar', 45]] },
    pregunta: { num: 'Paso 5', tipo: 'error', estado: { ...T, acc: [['ca', 90], ['real'], ['esperar', 45]] }, enunciado: 'El residente escribe el plan. <b>Puede haber 0, 1 o 2 errores.</b> Toca las frases que creas falsas.',
      frases: [
        { t: 'Hemodiálisis: baja el K⁺ 1 mEq/L tras una hora y 2 mEq/L tras tres.', cita: 29 },
        { t: 'SZC 10 g tres veces al día durante 48 h: elimina potasio por el intestino.', cita: 28 },
        { t: 'Cloruro cálcico, porque es más potente.', mal: true, buena: 'El cloruro se reserva para el colapso circulatorio; en la estable se usa gluconato (p. 27).', cita: 27 }],
      explicacion: 'Un error: el cloruro cálcico solo va en el colapso circulatorio; en la estable, gluconato (p. 27). El SZC y la hemodiálisis eliminan potasio (p. 28-29).', fuente: 27 } },
];
const VAL = { preset: 'valentin', ion: 'ca' };
const VALENTIN = [
  { momento: 'Quirófano · 3 h de transfusión', datos: {}, nuevo: [], estado: VAL,
    pregunta: { num: 'Paso 1', estado: VAL, enunciado: 'Valentín: PA 98/60, pH 7,22, albúmina 3,0 g/dL, 10 concentrados en 3 h. El laboratorio da un Ca total de 8,4 mg/dL («casi normal»). <b>¿En qué te fías?</b>',
      opciones: [
        { t: 'Corrijo el total por la albúmina con la fórmula y, si sale normal, no hago nada.', porque: 'Ninguna fórmula es fiable (p. 43), y un total «normal» tapa un iónico de 0,82 mmol/L; seguirías transfundiendo sin vigilar el calcio.' },
        { t: 'Doy bicarbonato para el pH y vuelvo a pedir el total.', porque: 'El bicarbonato forma complejos con el calcio y baja aún más el iónico (p. 44).' },
        { t: 'Me fío del total: la transfusión no toca el calcio.', porque: 'El citrato de las bolsas forma complejos con el calcio: el iónico es grave (<0,9 mmol/L) en más de la mitad de las transfusiones masivas (p. 44).' },
        { t: 'Pido un Ca iónico: el total incluye los complejos con el citrato y no los nota.', ok: true }],
      explicacion: 'La hipocalcemia iónica es casi universal tras una transfusión masiva por el citrato (p. 44): el ensayo del total no la ve (p. 43). En el modelo de Valentín, el iónico es de 0,82 mmol/L (3,3 mg/dL).', fuente: 44, fuente2: 43 } },
  { momento: 'Quirófano · Ca iónico 0,82 mmol/L', datos: { 'Ca iónico': '0,82 mmol/L (3,3 mg/dL)' }, nuevo: ['Ca iónico'], estado: VAL, haz: ['ca', 200],
    pregunta: { num: 'Paso 2', estado: VAL, enunciado: 'Ca iónico 0,82 mmol/L. El libro reserva el calcio IV a la reacción adversa grave, y avisa de que se asocia a fallo multiorgánico (p. 45-46). Supón que la hipotensión se atribuye al calcio bajo y decides tratar. <b>¿Cuánto y cuál?</b>',
      opciones: [
        { t: '10 mL de cloruro cálcico: es más potente y lo arregla de golpe.', porque: 'Son 270 mg de golpe, por encima del bolo de 200 mg; el cloruro se reserva para el colapso (p. 27, 45).' },
        { t: '100 mL de gluconato de golpe, para ir sobrados.', porque: 'Son 900 mg de golpe: el calcio IV puede producir sobrecarga de calcio en la célula y lesión (p. 46); en el modelo, el sello de bolo excesivo (tope ilustrativo).' },
        { t: 'Solo la perfusión de 1-2 mg/kg/h, sin bolo.', porque: 'El bolo de 200 mg va primero; la perfusión es su continuación (p. 46). Valentín seguiría con el iónico bajo durante horas.' },
        { t: '22 mL de gluconato al 10 % (200 mg de calcio elemental) y luego 1-2 mg/kg/h.', ok: true }],
      explicacion: 'Bolo de 200 mg de calcio elemental (22 mL de gluconato al 10 %) en 100 mL de salino en 5-10 min, seguido de 1-2 mg/kg/h durante al menos 6 h (p. 45-46). El monitor muestra el iónico en 1,07 mmol/L, ilustrativo: el libro da 0,5 mg/dL del total por 200 mg.', fuente: 45, fuente2: 46 } },
  { momento: 'Siguen sangrando · 14 concentrados', datos: { 'Concentrados': '14', 'K⁺': '5,9 mEq/L', 'Ca iónico': '0,90 mmol/L' }, nuevo: ['Concentrados', 'K⁺', 'Ca iónico'], estado: { ...VAL, s: { units: 14 }, acc: [['ca', 200]] },
    pregunta: { num: 'Paso 3', estado: { ...VAL, s: { units: 14 }, acc: [['ca', 200]] }, enunciado: 'Siguen sangrando: 4 concentrados más, 14 en total. <b>¿Qué haces con el calcio y el potasio?</b>',
      opciones: [
        { t: 'Paro el calcio: el iónico ya se corrigió.', porque: 'Con 4 bolsas más, el iónico vuelve a 0,90 mmol/L, en el límite de lo grave (<0,9, p. 44), y el efecto del bolo cae a los 30 min (p. 46).' },
        { t: 'Pongo bolos de 500 mg cada vez que baje.', porque: 'Cada bolo pasa de los 200 mg recomendados (p. 45): en el modelo, el sello de exceso, y el calcio IV puede dañar la célula (p. 46).' },
        { t: 'Sigo con la perfusión de 1-2 mg/kg/h y mido el iónico y el K⁺ con frecuencia.', ok: true },
        { t: 'Ignoro el K⁺: el riñón filtra bien y las bolsas casi no traen potasio.', porque: 'Cada concentrado de 18 días trae 2-3 mEq (p. 25); con 14, el K⁺ sube a 5,9 mEq/L en el monitor y se acumula si el riñón no filtra.' }],
      explicacion: 'Cada concentrado de 18 días trae 2-3 mEq de K⁺ y quela calcio (p. 25, 44): con 14 el monitor da K⁺ 5,9 mEq/L y Ca iónico 0,90 mmol/L (ilustrativo). Se sigue con la perfusión y se mide el iónico (p. 45-46).', fuente: 25, fuente2: 46 } },
];
const caso = (id, titulo, sub, corto, paciente, pasos, lleva, volver, fuenteVuelta) => ({ id, titulo, sub, corto, paciente,
  pasos: pasos.map((p, i) => ({ momento: p.momento, datos: p.datos, nuevo: p.nuevo, haz: p.haz, estado: p.estado,
    pregunta: { ...p.pregunta, haz: p.haz, id: id + '-' + (i + 1), tipo: p.pregunta.tipo || 'test', grupo: 'caso' } })),
  lleva, volver, fuenteVuelta });
export const CASOS = [
  caso('iov-adela', 'La hiperpotasemia de Adela', 'enalapril + espironolactona', 'Adela',
    { Paciente: 'Adela, 72 años', Antecedentes: 'ERC estadio 3', Fármacos: 'enalapril, espironolactona, ibuprofeno' }, ADELA,
    ['Un tubo hemolizado puede dar un K⁺ falso: se repite sin puño ni succión, sin demorar el ECG (p. 23-24).',
     'Calcio primero: gluconato 10 mL en 3 min, repetible a los 5; se disipa en 30-60 min (p. 27).',
     'Insulina-glucosa baja ≥0,6 mEq/L, con efecto temporal: hay que eliminar potasio con SZC o hemodiálisis, que baja 1 mEq/L en 1 h (p. 28-29).'],
    { nombre: 'Hiperpotasemia: tratamiento', ancla: 'mr-calcio-preparados' }),
  caso('iov-valentin', 'La transfusión masiva de Valentín', 'citrato y potasio de las bolsas', 'Valentín',
    { Paciente: 'Valentín, 45 años', Motivo: 'politrauma, 10 concentrados en 3 h', PA: '98/60 mmHg', pH: '7,22', 'Albúmina': '3,0 g/dL', 'Ca total': '8,4 mg/dL' }, VALENTIN,
    ['El citrato quela calcio: el total no lo nota y el iónico, sí (p. 43-44).',
     'Bolo de 200 mg de calcio elemental y luego 1-2 mg/kg/h; el calcio IV se reserva a la reacción grave (p. 45-46).',
     'Cada concentrado de 18 días trae 2-3 mEq de K⁺ (p. 25).'],
    { nombre: 'Hipocalcemia en la transfusión masiva', ancla: 'mr-hipoca-transfusion' }),
];
CASOS.forEach(c => c.pasos.forEach(p => (p.pregunta.frases || []).forEach(f => { if (f.mal) f.c = f.buena; })));

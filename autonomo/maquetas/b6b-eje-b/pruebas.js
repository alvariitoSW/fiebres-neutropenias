// Eje B · apuesta, «encuentra el error» y caso. Opción: [texto, correcta, qué le pasaría al paciente, página, id de la ficha, efecto en el modelo]
export const APUESTA = { p: 'toribio', enun: 'Toribio, 61 años, shock séptico: noradrenalina 0,4 µg/kg/min y PA 78/40 tras 3 L de suero. ¿Qué haces? Decide antes de ver qué pasa.',
  ops: [
    ['Pido un cortisol y espero el resultado antes de tocar el tratamiento.', false, 'Mientras esperas, la PA sigue baja: en el shock séptico no hace falta medir el cortisol y se da la hidrocortisona.', 51, 'mu-sr-practica'],
    ['Pongo hidrocortisona 100 mg IV cada 8 h ya, sin esperar al cortisol.', true, 'La PA sube. Es la pauta de la ficha para la hipotensión que no responde a volumen. Se retira sin vasopresor y con el lactato normal, poco a poco.', 51, 'mu-sr-tto'],
    ['Subo el suero por encima de 3 L y sigo subiendo la noradrenalina.', false, 'La PA no responde: la hipotensión que no responde a volumen es la clínica de la insuficiencia suprarrenal del crítico, y sin hidrocortisona no se corrige.', 50, 'mu-sr-clinica'],
  ], fin: { hc: 1 } };
export const ERROR = { p: 'obdulia', enun: 'Lee la nota de evolución de Obdulia, 77 años, hallada en casa con T 33,5 °C y Na⁺ 122. Toca la frase que contiene un error (puede haber uno o ninguno).',
  fr: [
    ['TSH 48 mU/mL y T4 libre 0,2 ng/dL: hipotiroidismo primario con mixedema.', false, 'Correcta: la T4 baja con TSH alta es hipotiroidismo primario.', 56, 'mu-hipo-dx'],
    ['Levotiroxina 300 µg IV en bolo lento y, a continuación, hidrocortisona 100 mg cada 8 h.', true, 'Error: la primera dosis de hidrocortisona va antes de la hormona tiroidea. Dada al revés, la insuficiencia suprarrenal asociada queda sin cubrir.', 57, 'mu-hipo-coma-tto'],
    ['Liotironina IV: carga de 10 µg y 5 µg cada 8 h hasta que despierte.', false, 'Correcta: carga de 5-20 µg y mantenimiento de 2,5-10 µg cada 8 h.', 57, 'mu-hipo-coma-tto'],
    ['Vigilar el QT: el hipotiroidismo lo alarga y aumenta el riesgo de torsade de pointes.', false, 'Correcta: el hipotiroidismo prolonga el QT.', 56, 'mu-hipo-cardio'],
    ['Mortalidad de hasta el 60 % pese al tratamiento.', false, 'Correcta: es la cifra de la ficha.', 56, 'mu-hipo-coma'],
  ], nada: ['Hay un error: relee la frase del orden de los fármacos.', 'Hay un error: la nota no estaba limpia.'] };
export const CASO = { titulo: 'Obdulia, 77 años', pasos: [
  { e: {}, enun: 'Hallada en casa: T 33,5 °C, Na⁺ 122, FC 48 y confusa. ¿Qué haces al llegar?', ops: [
    ['Espero a la TSH antes de dar nada: sin el resultado del laboratorio no empiezo ningún tratamiento.', false, 'Pierdes horas con una mortalidad de hasta el 60 % incluso tratada: hay que tratarla ya.', 57, 'mu-hipo-coma'],
    ['Sospecho mixedema, pido TSH y T4 libre y pongo hidrocortisona 100 mg IV sin esperar.', true, 'Hidrocortisona desde el principio: suele haber insuficiencia suprarrenal asociada.', 57, 'mu-hipo-coma-tto', { hc: 1 }],
    ['Pongo levotiroxina IV de entrada y la hidrocortisona después, solo si baja la presión arterial.', false, 'Con la insuficiencia suprarrenal sin cubrir, la hormona primero puede descompensarla: la primera dosis de hidrocortisona va antes.', 57, 'mu-hipo-coma-tto', { intento: 'levo' }],
  ] },
  { e: { hc: 1 }, enun: 'Laboratorio: TSH 48 mU/mL y T4 libre 0,2 ng/dL. ¿Qué tipo de hipotiroidismo es?', ops: [
    ['Central: la hipófisis no estimula la glándula y por eso la T4 está tan baja.', false, 'En el central la TSH estaría deprimida, no en 48: buscarías un tumor o una necrosis hipofisaria sin necesidad.', 56, 'mu-hipo-dx'],
    ['Eutiroideo enfermo: la TSH es normal en esa situación y no se trata.', false, 'Con TSH 48 no es eutiroideo enfermo: no tratarla dejaría un mixedema sin tratar.', 56, 'mu-hipo-eutiroideo'],
    ['Primario: el fallo está en la glándula y la TSH sube al máximo.', true, 'La T4 siempre está baja y la TSH alta (a menudo >10) en el primario.', 56, 'mu-hipo-dx'],
  ] },
  { e: { hc: 1 }, enun: 'La hidrocortisona ya está puesta. ¿Qué hormona le das ahora?', ops: [
    ['Levotiroxina oral a 1,5-1,8 µg/kg/día, la pauta habitual del hipotiroidismo leve-moderado.', false, 'Es la pauta del hipotiroidismo leve; en el coma, la absorción oral no sirve y la hormona llega tarde.', 56, 'mu-hipo-tto'],
    ['Levotiroxina en bolo IV lento de 200-400 µg; la liotironina de carga se puede añadir.', true, 'La T4 IV corrige el déficit; la liotironina cubre la conversión deprimida de T4 a T3.', 57, 'mu-hipo-coma-tto', { hor: 'levo' }],
    ['Solo liotironina IV de carga, sin levotiroxina, porque la T3 es la hormona activa y actúa antes.', false, 'La liotironina se puede añadir a la levotiroxina; sola deja sin reponer la T4.', 57, 'mu-hipo-coma-tto'],
  ] },
  { e: { hc: 1, hor: 'levo' }, enun: 'Tras el bolo, ¿qué mantenimiento dejas?', ops: [
    ['Repetir cada día el bolo IV de 200-400 µg de levotiroxina hasta que la TSH baje del todo.', false, 'Sobredosificas: el mantenimiento es de 50-100 µg al día.', 57, 'mu-hipo-coma-tto'],
    ['Parar la liotironina en cuanto la T4 suba y dejar solo la levotiroxina oral de mantenimiento.', false, 'La liotironina se continúa hasta que el paciente despierte y se estabilice.', 57, 'mu-hipo-coma-tto'],
    ['Levotiroxina 50-100 µg/día (IV, el 75 % de la oral) y liotironina 2,5-10 µg IV cada 8 h.', true, 'Es el mantenimiento de la ficha.', 57, 'mu-hipo-coma-tto'],
  ] },
], llevas: [['La primera dosis de hidrocortisona va antes que la hormona tiroidea.', 57, 'mu-hipo-coma-tto'], ['Levotiroxina IV lenta de 200-400 µg; la liotironina cubre la conversión deprimida.', 57, 'mu-hipo-coma-tto'], ['Hipotermia, Na⁺ bajo y TSH alta con T4 baja: mixedema; mortalidad de hasta el 60 %.', 56, 'mu-hipo-coma']] };

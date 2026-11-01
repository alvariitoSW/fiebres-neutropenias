// Eje B · apuestas, «encuentra el error» y caso. Opción: [texto, correcta, qué le pasaría al paciente, página, id de la ficha, efecto en el modelo]
export const APUESTAS = [
  { p: 'toribio', vista: 'eje', enun: 'Toribio, 61 años, shock séptico: noradrenalina 0,4 µg/kg/min y PA 78/40 tras 3 L de suero. ¿Qué haces? Decide antes de ver qué pasa.',
    ops: [
      ['Pido un cortisol y espero el resultado antes de tocar el tratamiento.', false, 'Mientras esperas, la PA sigue baja: con hipotensión que no responde a volumen ni a vasopresor a dosis moderadas, la ficha da la hidrocortisona sin esperar al cortisol.', 51, 'mu-sr-practica'],
      ['Pongo hidrocortisona 100 mg IV cada 8 h ya, sin esperar al cortisol.', true, 'La PA sube. Es la pauta de la ficha para la hipotensión que no responde a volumen ni a vasopresor a dosis moderadas. Se retira sin vasopresor y con el lactato normal, poco a poco.', 51, 'mu-sr-tto'],
      ['Subo el suero por encima de 3 L y sigo subiendo la noradrenalina.', false, 'La PA no responde: la hipotensión que no responde a volumen es la clínica de la insuficiencia suprarrenal del crítico, y sin hidrocortisona no se corrige.', 50, 'mu-sr-clinica'],
    ], fin: { hc: 1, hcD: 0 } },
  { p: 'bibiana', vista: 'mapa', enun: 'Bibiana, 74 años, lleva un año con prednisona 10 mg y ingresa tras la operación. Cortisol aleatorio: 22 µg/dL. ¿Qué haces con ese número? Decide antes de ver qué pasa.',
    ops: [
      ['Es menor de 35, así que hay supresión y la trato ya como insuficiencia.', false, 'Por debajo de 10 hay supresión y por encima de 35 la función es adecuada; entre 10 y 35 no decide. Tratar o descartar con ese número es decidir sin base.', 50, 'mu-sr-criterios'],
      ['Está entre 10 y 35: no decide. Mido la ACTH o hago la prueba de la ACTH.', true, 'Entre 10 y 35 el cortisol aleatorio no decide: la ficha pide la ACTH o la prueba con 250 µg. Con ella, un aumento menor de 9 µg/dL es supresión. Son cortes del paciente crítico.', 51, 'mu-sr-practica'],
      ['Es mayor de 10, así que la glándula responde y no necesito hacer nada más.', false, 'Con 22 sigue en la zona indeterminada: sin la ACTH o la prueba la supresión no se descarta, y una glándula atrofiada no responde al estrés de la operación.', 51, 'mu-sr-practica'],
    ], fin: { acth: true } },
];
export const ERRORES = [
  { p: 'obdulia', lup: 'ti', enun: 'Lee la nota de evolución de Obdulia, 77 años, hallada en casa con T 33,5 °C y Na⁺ 122. Toca la frase que contiene un error (puede haber 0, 1 o 2).',
    fr: [
      ['TSH 48 mU/mL y T4 libre 0,2 ng/dL: hipotiroidismo primario con mixedema.', false, 'Correcta: la T4 baja con TSH alta es hipotiroidismo primario.', 56, 'mu-hipo-dx'],
      ['Levotiroxina 300 µg IV en bolo lento y, a continuación, hidrocortisona 100 mg cada 8 h.', true, 'Error: la primera dosis de hidrocortisona va antes de la hormona tiroidea. Dada al revés, la insuficiencia suprarrenal asociada queda sin cubrir.', 57, 'mu-hipo-coma-tto'],
      ['Liotironina IV: carga de 10 µg y 5 µg cada 8 h hasta que despierte.', false, 'Correcta: carga de 5-20 µg y mantenimiento de 2,5-10 µg cada 8 h.', 57, 'mu-hipo-coma-tto'],
      ['Vigilar el QT: el hipotiroidismo lo alarga y aumenta el riesgo de torsade de pointes.', false, 'Correcta: el hipotiroidismo prolonga el QT.', 56, 'mu-hipo-cardio'],
      ['Mortalidad de hasta el 60 % pese al tratamiento.', false, 'Correcta: es la cifra de la ficha.', 56, 'mu-hipo-coma'],
    ] },
  { p: 'lucrecia', lup: 'ti', enun: 'Lee la nota de evolución de Lucrecia, 31 años, Graves y neumonía, con T 40,8 °C y FC 152. Toca las frases con un error (puede haber 0, 1 o 2).',
    fr: [
      ['Propiltiouracilo: carga de 500-1.000 mg y 250 mg cada 4 h.', false, 'Correcta: es la pauta de la tormenta en la Tabla 51.4.', 55, 'mu-tabla-51-4'],
      ['Yoduro: 5 gotas cada 6 h como único tratamiento, sin antitiroideo.', true, 'Error: la ficha da el yodo añadido al antitiroideo, en combinación; no lo plantea como único fármaco.', 55, 'mu-ti-yodo'],
      ['Propranolol oral 60-80 mg cada 4 h; con asma, metoprolol (nunca en una crisis).', false, 'Correcta: Tabla 51.3. Con asma el metoprolol es la alternativa y en la crisis están contraindicados todos.', 54, 'mu-tabla-51-3'],
      ['Hidrocortisona 300 mg de carga y 100 mg cada 8 h por la insuficiencia relativa.', false, 'Correcta: la tormenta acelera el metabolismo del cortisol.', 55, 'mu-ti-tormenta-extra'],
      ['Mortalidad de hasta el 60 % pese al tratamiento.', true, 'Error: en la tormenta es de hasta el 25 %; el 60 % es la del coma mixedematoso.', 53, 'mu-ti-tormenta'],
    ] },
];
const OBDULIA = { pac: 'obdulia', lup: 'ti', titulo: 'Obdulia, 77 años', pasos: [
  { e: {}, vista: 'eje', fr: ['Obdulia, día 0: T 33,5 °C, Na⁺ 122 y FC 48. Decide qué das primero.', 'caso inventado · constantes: ilustrativo'], enun: 'Hallada en casa: T 33,5 °C, Na⁺ 122, FC 48 y confusa. ¿Qué haces al llegar?', ops: [
    ['Espero a la TSH antes de dar nada: sin el resultado del laboratorio no empiezo ningún tratamiento.', false, 'Pierdes horas con una mortalidad de hasta el 60 % incluso tratada: hay que tratarla ya.', 57, 'mu-hipo-coma'],
    ['Sospecho mixedema, pido TSH y T4 libre y pongo hidrocortisona 100 mg IV sin esperar.', true, 'Hidrocortisona desde el principio: suele haber insuficiencia suprarrenal asociada.', 57, 'mu-hipo-coma-tto', { hc: 1, hcD: 0 }],
    ['Pongo levotiroxina IV de entrada y la hidrocortisona después, solo si baja la presión arterial.', false, 'Con la insuficiencia suprarrenal sin cubrir, la hormona primero puede descompensarla: la primera dosis de hidrocortisona va antes.', 57, 'mu-hipo-coma-tto', { intento: 'levo' }],
  ] },
  { e: { hc: 1, hcD: 0, dia: 1 }, vista: 'mapa', fr: ['Obdulia, día 1: TSH 48 y T4 libre 0,2; mira el punto en el mapa.', 'caso inventado · constantes: ilustrativo'], enun: 'Día 1, tras la primera dosis de hidrocortisona: T 33,8 °C, FC 51 y Na⁺ 123. Laboratorio: TSH 48 mU/mL y T4 libre 0,2 ng/dL; mira dónde cae el punto en el mapa. ¿Qué tipo de hipotiroidismo es?', ops: [
    ['Central: la hipófisis no estimula la glándula y por eso la T4 está tan baja.', false, 'En el central la TSH estaría deprimida, no en 48: buscarías un tumor o una necrosis hipofisaria sin necesidad.', 56, 'mu-hipo-dx'],
    ['Eutiroideo enfermo: la TSH es normal en esa situación y no se trata.', false, 'Con TSH 48 no es eutiroideo enfermo: no tratarla dejaría un mixedema sin tratar.', 56, 'mu-hipo-eutiroideo'],
    ['Primario: el fallo está en la glándula y la TSH está alta.', true, 'La T4 siempre está baja y la TSH alta (a menudo >10) en el primario.', 56, 'mu-hipo-dx'],
  ] },
  { e: { hc: 0, hor: 'levo', horD: 1, dia: 2 }, vista: 'eje', fr: ['Obdulia, día 2: PA 77/40 tras la hormona sin la hidrocortisona de las 6 h.', 'caso inventado · constantes: ilustrativo'], enun: 'Día 2: el turno anterior pasó la levotiroxina IV y no dio la dosis de hidrocortisona de las 6 h. Ahora PA 77/40, T 34 °C, FC 52 y Na⁺ 124. ¿Qué haces?', ops: [
    ['Subo la dosis de levotiroxina, porque la hipotermia indica que todavía falta hormona.', false, 'La hormona sin hidrocortisona es lo que ha dejado la presión baja: más hormona sin cubrir la insuficiencia suprarrenal asociada la empeora (inferencia: la ficha solo dice que la hidrocortisona va antes).', 57, 'mu-hipo-coma-tto'],
    ['Pongo ya la hidrocortisona 100 mg IV cada 8 h y vigilo la presión arterial.', true, 'La insuficiencia suprarrenal asociada era lo que faltaba cubrir: la hidrocortisona va antes que la hormona y debe estar puesta.', 57, 'mu-hipo-coma-tto', { hc: 1, hcD: 2 }],
    ['Doy un bolo de suero y espero a ver si la presión sube sola con la hormona.', false, 'El suero no cubre la insuficiencia suprarrenal: la presión sigue baja mientras no se ponga la hidrocortisona (inferencia: la ficha solo pide la hidrocortisona antes).', 57, 'mu-hipo-coma-tto'],
  ] },
  { e: { hc: 1, hcD: 2, hor: 'levo', horD: 1, dia: 3 }, vista: 'eje', fr: ['Obdulia, día 3: mejora despacio; elige el mantenimiento.', 'caso inventado · constantes: ilustrativo'], enun: 'Día 3, con la hidrocortisona y la levotiroxina: PA 110/56, T 34,8 °C, FC 59 y Na⁺ 128. Mejora despacio y sigue confusa. ¿Qué mantenimiento dejas?', ops: [
    ['Repetir cada día el bolo IV de 200-400 µg de levotiroxina hasta que la TSH baje del todo.', false, 'Sobredosificas: el bolo es la carga y el mantenimiento es de 50-100 µg al día.', 57, 'mu-hipo-coma-tto'],
    ['Parar la liotironina en cuanto la T y la FC suben y dejar solo la levotiroxina de mantenimiento.', false, 'La liotironina se continúa hasta que despierte y se estabilice, y sigue confusa.', 57, 'mu-hipo-coma-tto'],
    ['Levotiroxina 50-100 µg/día (la IV, el 75 % de esa dosis) y liotironina 2,5-10 µg IV cada 8 h.', true, 'Es el mantenimiento de la ficha: la liotironina sigue hasta que despierte y se estabilice.', 57, 'mu-hipo-coma-tto'],
  ] },
], llevas: [['La primera dosis de hidrocortisona va antes que la hormona tiroidea; sin ella, la presión cae.', 57, 'mu-hipo-coma-tto'], ['Levotiroxina IV lenta de 200-400 µg y, de mantenimiento, 50-100 µg/día (la IV, el 75 %); la liotironina sigue hasta que despierte.', 57, 'mu-hipo-coma-tto'], ['Hipotermia, Na⁺ bajo y TSH alta con T4 baja: mixedema; mortalidad de hasta el 60 %.', 56, 'mu-hipo-coma']] };

// Toribio, 61: el seguimiento de la apuesta (ya con hidrocortisona). Sus cifras de cortisol, PA y lactato son del caso o ilustrativas; el sentido, el de la ficha (p. 51).
const TORIBIO = { pac: 'toribio', lup: 'sr', titulo: 'Toribio, 61 años (seguimiento)', pasos: [
  { e: { hc: 1, hcD: 0, dia: 1 }, vista: 'mapa', fr: ['Toribio, día 1: cortisol 28 y noradrenalina 0,4 con hidrocortisona.', 'caso inventado · constantes: ilustrativo'], enun: 'Día 1: ayer le pusiste hidrocortisona 100 mg cada 8 h; sigue con noradrenalina 0,4 y hoy llega el cortisol que extrajo urgencias: 28 µg/dL, nada bajo. El residente propone suspender la hidrocortisona porque «el cortisol sale normal». ¿Qué haces?', ops: [
    ['Sigo con la hidrocortisona: en el shock séptico la cifra de cortisol no cambia la pauta.', true, 'En el shock séptico el cortisol no es necesario para decidir quién se beneficia: se prueba hidrocortisona intravenosa. El enfermo crítico puede tener un cortisol total normal o alto (Langouche 2023), y la ficha explica la acción insuficiente por el bloqueo de la respuesta del órgano (Fig. 51.1).', 51, 'mu-sr-practica'],
    ['La suspendo: con 28 µg/dL la suprarrenal responde y la hidrocortisona ya sobra.', false, 'Con hipotensión que no responde, la cifra no decide en el shock séptico; quitarla dejaría la hipotensión sin tratar.', 51, 'mu-sr-practica'],
    ['Pido la prueba de ACTH y no sigo con la hidrocortisona hasta tener el resultado, por seguridad.', false, 'El shock séptico es la excepción a la prueba: mientras esperas, Toribio queda sin tratamiento de la hipotensión que no responde.', 51, 'mu-sr-practica'],
  ] },
  { e: { hc: 1, hcD: 0, dia: 3 }, vista: 'eje', fr: ['Toribio, día 3: lactato 1,6 y noradrenalina aún puesta.', 'caso inventado · constantes: ilustrativo'], enun: 'Día 3: PA 99/51 con noradrenalina 0,4 y lactato 1,6. ¿Qué haces con la hidrocortisona?', ops: [
    ['La retiro hoy de golpe, porque la PA ya es buena y el lactato es normal, y observo.', false, 'Sigue la noradrenalina, y la retirada brusca da un rebote de mediadores proinflamatorios con la PA otra vez lábil.', 51, 'mu-sr-retirada'],
    ['La mantengo hasta quitar la noradrenalina y entonces la bajo poco a poco, varios días.', true, 'Se retira al resolverse la causa, en el shock séptico sin vasopresor y con el lactato normal, y poco a poco.', 51, 'mu-sr-retirada'],
    ['La dejo a 100 mg cada 8 h hasta el alta, por si acaso la presión vuelve a caer algún día.', false, 'La ficha la retira al resolverse la causa; mantenerla sin motivo expone a Toribio a más corticoide.', 51, 'mu-sr-retirada'],
  ] },
  { e: { hc: 1, hcD: 0, dia: 5, parada: true }, vista: 'eje', fr: ['Toribio, día 5: PA lábil y FC en alza tras suspender la hidrocortisona de golpe.', 'caso inventado · constantes: ilustrativo'], enun: 'Día 5: otro residente la suspendió de golpe el día 4. Hoy Toribio tiene la PA lábil y la FC sube. ¿Qué haces?', ops: [
    ['Reinicio la hidrocortisona y la retiro de nuevo poco a poco, durante varios días.', true, 'La retirada brusca da un rebote de mediadores proinflamatorios; la ficha pide retirarla poco a poco, durante al menos unos días. Reiniciarla es inferencia de la maqueta.', 51, 'mu-sr-retirada', { parada: false }],
    ['Lo atribuyo a fiebre medicamentosa y subo la noradrenalina para sostener la presión.', false, 'La ficha no dice que la hidrocortisona dé fiebre al quitarla: subir la noradrenalina trata la cifra y deja el rebote sin explicar.', 51, 'mu-sr-retirada'],
    ['Concluyo que la suprarrenal se atrofió en cuatro días y la mantengo de por vida.', false, 'La atrofia exige semanas de corticoide; con menos de 10-14 días el eje se recupera pronto (Younes 2017, serie pediátrica). Mantenerla sin fin expone a más corticoide.', 51, 'mu-sr-retirada'],
  ] },
], llevas: [['En el shock séptico no se espera al cortisol, y su cifra no cambia la hidrocortisona.', 51, 'mu-sr-practica'], ['Se retira sin vasopresor y con lactato normal, poco a poco.', 51, 'mu-sr-retirada'], ['Retirada brusca: rebote de mediadores proinflamatorios.', 51, 'mu-sr-retirada']] };
export const CASOS = [OBDULIA, TORIBIO];
export const CASO = OBDULIA;

// Mayéutica del bloque 3, sub-bloque 3B · Síndromes coronarios agudos (Marino cap. 20, PDF págs. 38-49 y 52): fichas 19
// (diagnóstico) y 20 (tratamiento), y el caso A (Sagrario). Datos puros; el formato está en la cabecera de b1-fluidos.js.
// Las fichas son js/modules/cardiologia/merino-cardiologia.html. Modelos vivos: vasoVivo `placa`, `placa-antiagregantes`
// y `trombolisis` (js/data/vaso-vivo-data-sca.js) y ritmoVivo `stemi`. Las cifras de los modelos NO van en el texto de las
// preguntas (primero predices, luego compruebas). La disección (ficha 21) está en otro archivo.
const PDF = 'docs/marino-2024-cardiac-disorders-caps18-21.pdf';
const pag = (n, txt) => `<a class="biblio-link" href="${PDF}#page=${n}" target="_blank" rel="noopener">${txt || `PDF pág. ${n}`}</a>`;
const p = n => pag(n, `pág. ${n}`);
const enFicha = (tab, id) => ` <button type="button" class="may-ir" data-especialidad="cardiologia" data-view="merinoCardiologia" data-panel="panel-merino-cardio-tabs" data-tab="${tab}" data-resaltar="#${id}">Ver en la ficha ↗</button>`;
const DED = '<i>Deducción; la fuente no lo dice.</i>';
const D = 'mc-sca-diagnostico', R = 'mc-sca-tratamiento';
const vv = (clave, texto) => ({ vasoVivo: clave, texto });
const rv = (clave, texto) => ({ ritmoVivo: clave, texto });

export const MAYEUTICA_SCA = {
  /* =================================================================================================
     Ficha 19 · SCA: diagnóstico (cap. 20, págs. 38-41)
     ================================================================================================= */
  'mc-sca-diagnostico': {
    entrada: 'Qué rompe la placa y cómo se forma el trombo, qué síndrome da cada oclusión, qué prueba el dolor y qué no, y cuándo fiarte del ECG y de la troponina.',
    guia: [
      { id: 'scd-g1', corto: 'qué rompe la placa', tipo: 'test', fuente: 'mc-placa', modeloVivo: vv('placa', '🩸 Mira la placa en la bifurcación (tiempo 1)'),
        enunciado: 'Predice, y luego lo compruebas: una placa de ateroma se rompe y se forma un trombo que ocluye la coronaria. ¿Qué se atribuye la rotura y dónde suele ocurrir?',
        opciones: [
          { t: 'A la inflamación, con ayuda del estrés de cizalla; en los puntos de bifurcación', ok: true },
          { t: 'Al colesterol, que revienta la placa en los tramos rectos y más estrechos', porque: `La rotura se atribuye a la inflamación, y las placas rotas se localizan típicamente en las bifurcaciones (${p(38)}). Buscar solo en tramos rectos o culpar solo al colesterol te haría mirar donde no está el riesgo (${DED}).` },
          { t: 'Solo al roce del flujo (la cizalla), sin inflamación, en cualquier tramo de la arteria', porque: `La cizalla puede contribuir, pero la causa que se atribuye es la inflamación (${p(38)}); y la localización es típica, en las bifurcaciones.` }],
        explicacion: `La rotura <span class="hl-azul">se atribuye a la inflamación</span>, aunque el estrés de cizalla hidráulico también puede contribuir; las placas rotas se sitúan típicamente en los <span class="hl">puntos de bifurcación</span> (${p(38)}).`,
        nota: `<b>La fuente no lo dice.</b> El libro no da el grado de estenosis de la placa que se rompe; el modelo no pone un porcentaje.` + enFicha(D, 'mc-placa') },
      { id: 'scd-g2', corto: 'qué sale de la placa', tipo: 'test', fuente: 'mc-placa · mc-fig-20-1', modeloVivo: vv('placa', '🩸 Pulsa ▶ y mira qué sale al romperse'),
        enunciado: 'Predice: la placa se ha roto. ¿Qué sale por la rotura y qué activa?',
        opciones: [
          { t: 'Calcio de la placa, que cierra la luz de la arteria por sí mismo sin necesitar plaquetas ni coagulación', porque: `Lo que sale son lípidos trombogénicos, que activan las plaquetas y los factores de la coagulación (${p(39)}). Si crees que el calcio tapa la arteria, no entenderás por qué hacen falta antiagregantes y anticoagulante.` },
          { t: 'Lípidos trombogénicos, que activan las plaquetas y los factores de la coagulación', ok: true },
          { t: 'Hipoclorito, que activa directamente las plaquetas y forma el trombo', porque: `El hipoclorito oxida las lipoproteínas de la placa antes de la rotura (${p(39)}); lo que sale y activa a plaquetas y factores son los lípidos trombogénicos.` }],
        explicacion: `Por la rotura salen <span class="hl-rojo">lípidos trombogénicos</span>, que activan las plaquetas y los factores de la coagulación; después se forma el agregado plaquetario y el trombo con hebras de fibrina (Fig. 20.1, ${p(39)}).` + enFicha(D, 'mc-fig-20-1') },
      { id: 'scd-g3', corto: 'la MPO y la lejía', tipo: 'test', fuente: 'mc-placa', modeloVivo: vv('placa', '🩸 Tiempo 2: la mieloperoxidasa'),
        enunciado: 'Un compañero dice que la mieloperoxidasa (MPO) «es la lejía de la placa». ¿Qué es y qué hace?',
        opciones: [
          { t: 'Una enzima de los leucocitos que genera hipoclorito, el principio activo de la lejía, y oxida las lipoproteínas de la placa', ok: true },
          { t: 'Un marcador de necrosis, como la troponina, que sube en sangre cuando el miocito ya está muerto y confirma el infarto', porque: `La MPO se mide en la placa y su nivel plasmático se correlaciona con la presencia y la gravedad de la enfermedad coronaria (${p(39)}); no es el marcador de necrosis del protocolo, que es la hs-cTn (${p(41)}).` },
          { t: 'Una enzima del hígado que limpia las lipoproteínas de la placa y la estabiliza', porque: `La libera el leucocito y oxida las lipoproteínas de la placa (${p(39)}); estabilizarla sería lo contrario: en las autopsias tiñe el sitio de la rotura.` }],
        explicacion: `La MPO, liberada por leucocitos, <span class="hl-azul">genera hipoclorito</span> (el ingrediente activo de la lejía doméstica) y oxida las lipoproteínas de la placa; hay correlación directa entre su nivel plasmático y la enfermedad coronaria, y en las autopsias tiñe de forma extensa el sitio de rotura (${p(39)}).`,
        nota: `<b>La fuente no lo dice.</b> El libro no propone medir la MPO ni tratarla; es el mecanismo, no una prueba ni una diana.` + enFicha(D, 'mc-placa') },
      { id: 'scd-g4', corto: 'tres oclusiones', tipo: 'test', fuente: 'mc-sca-sindromes', modeloVivo: vv('placa', '🩸 Cambia la oclusión: completa, parcial y a ratos'),
        enunciado: 'Predice, y luego lo compruebas: el trombo cierra la arteria de tres maneras. ¿Qué síndrome da cada una?',
        opciones: [
          { t: 'Completa: STEMI (transmural). Parcial: NSTEMI. A ratos, on-off: angina inestable', ok: true },
          { t: 'Completa: NSTEMI (sin ST elevado). Parcial: angina inestable. A ratos, on-off: STEMI', porque: `El infarto transmural, con ST elevado, es el de la oclusión completa (${p(40)}). Llamar NSTEMI a un STEMI te haría esperar la troponina en vez de reperfundir de inmediato (${p(41)}).` },
          { t: 'Completa: STEMI (transmural). Parcial: angina inestable. A ratos, on-off: NSTEMI', porque: `El NSTEMI es la oclusión incompleta y la angina inestable, los episodios repetitivos de oclusión intermitente (${p(40)}). Confundirlos cambia el pronóstico que explicas y la urgencia de la ICP.` }],
        explicacion: `Oclusión completa: <span class="hl-rojo">STEMI</span>, infarto transmural. Incompleta: <span class="hl">NSTEMI</span>. Intermitente: <span class="hl">angina inestable</span>. NSTEMI y angina inestable se agrupan como SCASEST (${p(40)}).`,
        nota: `<b>La fuente no lo dice.</b> El libro no da el porcentaje de estenosis de cada síndrome: el modelo usa tres posiciones, no una cifra.` + enFicha(D, 'mc-sca-sindromes') },
      { id: 'scd-g5', corto: 'la NTG no prueba nada', tipo: 'test', fuente: 'mc-sca-clinica',
        enunciado: 'Un paciente con dolor torácico se alivia al darle nitroglicerina sublingual. ¿Qué concluyes?',
        opciones: [
          { t: 'Que es isquémico: la nitroglicerina solo alivia el dolor de origen coronario', porque: `También alivia el espasmo esofágico (${p(40)}). Si lo das por isquémico, ante un espasmo esofágico te quedarías sin buscar la causa real (${DED}).` },
          { t: 'Que no es isquémico: si fuera un infarto, la nitroglicerina no habría hecho nada', porque: `Tampoco lo descarta: el alivio no es evidencia de isquemia ni de su ausencia, y un SCA seguiría pendiente del ECG y la troponina (${p(40)}-${p(41)}). Darlo de alta por esto sería un error con riesgo vital (${DED}).` },
          { t: 'Nada: no es evidencia de isquemia, porque también alivia el espasmo esofágico', ok: true }],
        explicacion: `<span class="hl-rojo">El alivio con nitroglicerina no es evidencia de isquemia miocárdica</span>: también alivia el espasmo esofágico (${p(40)}). Ni el alivio ni su ausencia deciden; deciden el ECG y la troponina.`,
        nota: `El mecanismo del alivio con nitroglicerina es incierto: se atribuye a su efecto vasodilatador, pero otros vasodilatadores no alivian el dolor isquémico (${p(46)}).` + enFicha(D, 'mc-sca-clinica') },
      { id: 'scd-g6', corto: 'cuándo fiarse de la hs-cTn', tipo: 'test', fuente: 'mc-troponina', modeloVivo: vv('placa', '🩸 Mueve el reloj de horas desde el dolor'),
        enunciado: 'Predice, y luego lo compruebas: la hs-cTn se mide al llegar y una hora después. ¿Desde cuántas horas del inicio del dolor se fía de que una cifra inicial alta es necrosis, y qué cambio en la segunda muestra indica isquemia aguda?',
        opciones: [
          { t: 'Desde las 6 h; un cambio mayor del 50 %', porque: `La hs-cTn detecta la lesión desde las 3 h y el umbral del cambio es >10 % (${p(41)}). Esperar 6 h o exigir el 50 % retrasaría la reperfusión de un infarto real (${DED}).` },
          { t: 'Desde las 3 h; un cambio mayor del 10 %', ok: true },
          { t: 'Desde las 3 h; cualquier cifra por encima del percentil 99 en la segunda muestra', porque: `Estar por encima del p99 no basta: miocardiopatía, taquicardia sostenida, IC, hipertensión pulmonar o sepsis también la elevan, y no producen el cambio agudo (${p(41)}). Llamar infarto a todas ellas llevaría a un cateterismo innecesario.` }],
        explicacion: `Necrosis probable si el nivel inicial supera el percentil 99 y han pasado <span class="hl">≥3 h</span> desde el inicio de los síntomas; un <span class="hl-rojo">cambio >10 %</span> en la segunda determinación es evidencia de isquemia aguda (${p(41)}).`,
        nota: `Las horas intermedias del reloj del modelo (todas salvo 3 y 12) son ilustrativas; la ficha solo da las 3 h.` + enFicha(D, 'mc-troponina') },
      { id: 'scd-g7', corto: 'ECG tapado', tipo: 'destapa', cuantas: 'son dos', fuente: 'mc-sca-ecg',
        enunciado: 'Un paciente con dolor típico tiene un bloqueo de rama (o un marcapasos) y el ECG no muestra un ST elevado claro. Tu respuesta tiene dos partes: ¿qué pasa con el ECG y qué haces?',
        puntos: [
          `El bloqueo de rama o el ritmo de marcapasos pueden <span class="hl-azul">enmascarar los cambios isquémicos</span>.`,
          `Si se sospecha isquemia coronaria, se maneja <span class="hl-rojo">como un STEMI</span>: reperfusión emergente.`],
        explicacion: `Los cambios isquémicos pueden enmascararse por un bloqueo de rama o un ritmo de marcapasos; si se sospecha isquemia coronaria se maneja como STEMI, con reperfusión emergente (${p(40)}-${p(41)}). El ECG de 12 derivaciones se hace en <10 min del primer contacto (${p(40)}).`,
        modeloVivo: rv('stemi', '⚡ El ST elevado en el corazón eléctrico'),
        nota: `<b>La fuente no lo dice.</b> El libro no da criterios para sospechar el infarto cuando el ECG está tapado: lo deja a la sospecha clínica.` + enFicha(D, 'mc-sca-ecg') },
    ],
    examen: [
      { id: 'scd-e1', corto: '1,7 mm en un varón', tipo: 'test', fuente: 'mc-tabla-20-1',
        enunciado: 'Un varón de 70 años con dolor opresivo tiene una elevación del punto J de 1,7 mm en V2 y V3. ¿Cómo lo clasificas?',
        opciones: [
          { t: 'STEMI: ≥1,5 mm en V2-V3 en dos derivaciones contiguas basta para reperfundir', porque: `El umbral de 1,5 mm es el de la mujer; en el varón hacen falta ≥2,0 mm en V2-V3 (Tabla 20.1, ${p(41)}). Con 1,7 mm llevarías a ICP emergente a quien aún no cumple el criterio (${DED}).` },
          { t: 'Aún no cumple el criterio de STEMI en V2-V3: en el varón hacen falta ≥2,0 mm; se vigila y se repite el ECG', ok: true },
          { t: 'Descartas la isquemia: sin 1 mm en las demás derivaciones no hay nada', porque: `El ≥1 mm es el criterio de las demás derivaciones; un ECG con 1,7 mm en V2-V3 no es normal (${p(41)}), y se repite si el dolor persiste. Darlo de alta sería un riesgo (${DED}).` }],
        explicacion: `Tabla 20.1: STEMI si el punto J se eleva en ≥2 derivaciones contiguas <span class="hl-rojo">≥2,0 mm (varones) o ≥1,5 mm (mujeres) en V2-V3</span>, o ≥1 mm en el resto (${p(41)}). Que se repita el ECG es deducción (${DED}).` + enFicha(D, 'mc-tabla-20-1') },      { id: 'scd-e2', corto: 'descenso en V1-V3', tipo: 'test', fuente: 'mc-tabla-20-1',
        enunciado: 'Un varón con dolor torácico tiene un descenso del ST en V1-V3 con ondas T positivas. ¿Qué patrón es?',
        opciones: [
          { t: 'STEMI posterior: descenso del ST en V1-V3 con onda T positiva, que obliga a reperfundir', ok: true },
          { t: 'SCASEST: la depresión del punto J en V2-V3 es lo que define al NSTEMI', porque: `El descenso de V1-V3 con T positiva es un STEMI posterior (Tabla 20.1, ${p(41)}). Con la ruta del SCASEST el paciente esperaría 24-72 h sin reperfusión emergente.` },
          { t: 'Isquemia subendocárdica de bajo riesgo: sin elevación del ST no hay urgencia', porque: `Sin ST elevado en V1-V3 puede haber igualmente un infarto posterior transmural que obliga a reperfundir (${p(41)}); tratarlo como bajo riesgo retrasaría la reperfusión.` }],
        explicacion: `Tabla 20.1: el <span class="hl-rojo">STEMI posterior</span> es una depresión del ST en V1-V3 con onda T positiva (${p(41)}). El SCASEST es depresión del punto J ≥0,5 mm en V2-V3 o ≥1 mm en el resto, o T invertida >1 mm en ≥5 derivaciones (${p(41)}).` + enFicha(D, 'mc-tabla-20-1') },
      { id: 'scd-e3', corto: 'sepsis y troponina', tipo: 'test', fuente: 'mc-troponina-resultado', origen: 'ilustrativo: el paciente es inventado; la regla, de la ficha',
        enunciado: 'Un paciente séptico, sin dolor torácico, tiene la hs-cTn inicial por encima del p99 y a la hora el cambio es de un 3 %. ¿Es un infarto agudo?',
        opciones: [
          { t: 'Sí: con un nivel inicial por encima del p99 y más de 3 horas de evolución, hay necrosis y es infarto', porque: `Las causas no isquémicas, como la sepsis, también elevan la hs-cTn, pero no producen un cambio agudo (${p(41)}); el infarto se apoya en el cambio >10 %, no solo en la cifra.` },
          { t: 'No se puede saber hasta repetirla a las 6 horas: el protocolo de una hora no sirve en sepsis', porque: `El protocolo de las dos muestras ya da la respuesta: sin cambio agudo no es isquemia aguda (${p(41)}). Esperar 6 h retrasaría el diagnóstico (${DED}).` },
          { t: 'No: hay lesión miocárdica por la sepsis, pero sin cambio >10 % no es isquemia aguda', ok: true }],
        explicacion: `Entre las causas <span class="hl-azul">no isquémicas de hs-cTn elevada</span> están la miocardiopatía, la taquicardia sostenida, la IC, la hipertensión pulmonar y la sepsis, pero <span class="hl-rojo">no producen un cambio agudo</span>; lo que indica isquemia es el cambio >10 % (${p(41)}).`,
        nota: `<b>La fuente no lo dice.</b> El libro no da una cifra de «cambio estable»: el 3 % es del paciente inventado.` + enFicha(D, 'mc-troponina-resultado') },
      { id: 'scd-e4', corto: 'dolor punzante', tipo: 'test', fuente: 'mc-sca-clinica',
        enunciado: 'Una paciente describe un dolor torácico agudo, fugaz, que localiza con un dedo, que aumenta al inspirar y que se reproduce al palpar. ¿Qué piensas del SCA?',
        opciones: [
          { t: 'Es poco probable: agudo, fugaz, localizable, con la inspiración y reproducible lo hacen improbable', ok: true },
          { t: 'Es probable: el 80 % de los SCA presentan molestia torácica, así que cualquier dolor torácico es sospechoso', porque: `El dolor típico es profundo, no localizable en un punto, de inicio abrupto y >15 min (${p(40)}); los rasgos de esta paciente lo hacen improbable. Tratarla como infarto expondría a heparina y a pruebas sin motivo (${DED}).` },
          { t: 'Queda descartado: no hace falta ECG ni troponina porque el dolor es mecánico', porque: `Poco probable no es descartado, y el ECG se hace en <10 min del primer contacto (${p(40)}). Si omites el ECG, un SCA atípico pasaría sin verse (${DED}).` }],
        explicacion: `El SCA es <span class="hl-verde">poco probable</span> si el dolor es agudo o fugaz, localizable en un punto preciso, con la inspiración o reproducible con el movimiento o la percusión torácica (${p(40)}). El típico es profundo, abrupto, >15 min y puede irradiarse a hombros, cuello, brazos o abdomen (${p(40)}).` + enFicha(D, 'mc-sca-clinica') },
      { id: 'scd-e5', corto: 'qué obliga el ST elevado', tipo: 'test', fuente: 'mc-sca-ecg', modeloVivo: rv('stemi', '⚡ Mira el ST elevado en el corazón eléctrico'),
        enunciado: 'El ECG de una paciente con dolor muestra un ST elevado que cumple el criterio del STEMI. ¿Qué haces con la troponina, que aún no tiene resultado?',
        opciones: [
          { t: 'Esperar el resultado de la hs-cTn antes de decidir, para no reperfundir a quien no es infarto', porque: `La elevación del ST obliga a reperfusión emergente (${p(40)}); esperar la troponina consume el tiempo del que depende el miocardio (${p(42)}).` },
          { t: 'Repetir el ECG a las 6 horas para confirmar que el ST sigue elevado', porque: `El STEMI obliga a reperfusión emergente en el momento, sin repetir (${p(40)}); cada retraso por encima de 120 min añade mortalidad (${p(43)}).` },
          { t: 'Nada: el STEMI se diagnostica por el ECG y obliga a reperfusión emergente', ok: true }],
        explicacion: `La elevación del ST (STEMI, Tabla 20.1) <span class="hl-rojo">obliga a reperfusión emergente</span>; el ECG se hace en <10 min del primer contacto (${p(40)}-${p(41)}). La troponina no retrasa esa decisión.` + enFicha(D, 'mc-sca-ecg') },
    ],
    profundizar: [
      { id: 'mc-sca-historia', titulo: 'El descubrimiento de 1980: el trombo oclusivo' },
      { id: 'mc-tabla-20-1', titulo: 'Tabla 20.1: todos los criterios del ECG (SCASEST y T invertida)' },
    ],
    casos: [
      { id: 'c-sca0', titulo: 'Sagrario, 72 años: el ECG que cambia', corto: 'Caso · Sagrario', sub: 'diabética; hospital sin ICP; un ECG sin elevación que pasa a STEMI, y la troponina',
        paciente: { Edad: '72 años, mujer', Antecedentes: 'diabetes tipo 2', Lugar: 'hospital sin ICP' },
        pasos: [
          { momento: '06:10 · urgencias', datos: { Dolor: 'opresivo, de 70 min', ECG: 'depresión del punto J de 0,8 mm en V2 y V3, con T negativa' }, nuevo: ['Dolor', 'ECG'],
            pregunta: { id: 'scd-c1', tipo: 'test', fuente: 'mc-tabla-20-1 · mc-sca-ecg', modeloVivo: rv('stemi', '⚡ El ECG del STEMI, para compararlo'), origen: 'ilustrativo: el ECG es de la paciente; los criterios, de la ficha',
              enunciado: 'Sagrario tiene dolor opresivo de 70 minutos y el ECG muestra una depresión del punto J de 0,8 mm en V2 y V3, con onda T negativa. Un residente dice: «Sin elevación del ST no hay infarto». ¿Qué le contestas?',
              opciones: [
                { t: 'Que tiene razón: sin ST elevado el ECG no es isquémico y se puede esperar a la troponina', porque: `La depresión del punto J ≥0,5 mm en V2-V3 ya es un criterio de SCASEST (Tabla 20.1, ${p(41)}); un ECG así no es normal, y descartarlo dejaría sin tratar una isquemia.` },
                { t: 'Que es un STEMI posterior: toda depresión del ST en V1-V3 obliga a reperfundir ya', porque: `El STEMI posterior es el descenso del ST en V1-V3 con onda T positiva (${p(41)}); aquí la T es negativa. Reperfundir de emergencia sin ese patrón sería tratar a la paciente por la vía equivocada (${DED}).` },
                { t: 'Que es un SCASEST: la depresión del punto J ≥0,5 mm en V2-V3 cumple el criterio', ok: true }],
              explicacion: `Tabla 20.1: el SCASEST es <span class="hl-azul">depresión del punto J ≥0,5 mm en V2-V3</span> o ≥1 mm en las demás derivaciones (${p(41)}). El ECG se hizo en los 10 min que pide la ficha (${p(40)}).`,
              nota: `<b>La fuente no lo dice.</b> La depresión de 0,8 mm y la T negativa son datos de la paciente inventada.` + enFicha(D, 'mc-tabla-20-1') } },
          { momento: '06:15 · troponina', datos: { 'hs-cTn': 'inicial sobre el p99', Dolor: 'sigue, de 75 min' }, nuevo: ['hs-cTn'],
            pregunta: { id: 'scd-c3', tipo: 'test', fuente: 'mc-troponina · mc-troponina-resultado', modeloVivo: vv('placa', '🩸 Mueve el reloj: ¿cuántas horas lleva Sagrario?'), origen: 'ilustrativo: el resultado es de la paciente; el protocolo, de la ficha',
              enunciado: 'La hs-cTn inicial de Sagrario sale sobre el p99, con 75 minutos de dolor. ¿Es ya necrosis probable?',
              opciones: [
                { t: 'Sí: una cifra inicial sobre el p99 basta para hablar de necrosis miocárdica', porque: `La necrosis probable exige además ≥3 h desde el inicio de los síntomas (${p(41)}); con 75 min sobreinterpretarías una cifra aislada.` },
                { t: 'Todavía no: pide ≥3 h de síntomas; se repite la hs-cTn a la hora y se sigue como SCASEST', ok: true },
                { t: 'No cuenta: con menos de 3 h la hs-cTn no sirve y se descarta el infarto', porque: `Sirve para seguir el cambio en la 2.ª determinación (${p(41)}); descartarlo por el tiempo dejaría sin vigilar una isquemia (${DED}).` }],
              explicacion: `Necrosis probable: nivel inicial sobre el p99 y <span class="hl-rojo">≥3 h</span> desde el inicio de los síntomas (${p(41)}). Con 75 min no se cumple; la 2.ª determinación, a la hora, buscará un cambio >10 % (${p(41)}).`,
              nota: `<b>La fuente no lo dice.</b> El libro no da cifras de troponina: el caso solo usa el umbral del p99 y el tiempo.` + enFicha(D, 'mc-troponina') } },
          { momento: '07:10 · el giro', datos: { Dolor: 'vuelve, más intenso', ECG: 'ST +1,7 mm en V2 y V3' }, nuevo: ['Dolor', 'ECG'],
            pregunta: { id: 'scd-c2', tipo: 'test', fuente: 'mc-tabla-20-1 · mc-sca-ecg', modeloVivo: rv('stemi', '⚡ El ST elevado en V2-V3'), origen: 'ilustrativo: el ECG es de la paciente; los umbrales, de la ficha',
              enunciado: 'A las 07:10 el dolor de Sagrario vuelve y el ECG muestra una elevación del punto J de 1,7 mm en V2 y V3. Un residente dice: «No llega a 2 mm; esperamos la 2.ª troponina». ¿Qué decides?',
              opciones: [
                { t: 'Esperar la 2.ª hs-cTn: hasta los 2 mm no se confirma el STEMI', porque: `Los 2 mm son el umbral del varón; en la mujer, en V2-V3 es ≥1,5 mm (${p(41)}). Esperar la troponina retrasaría una reperfusión emergente (${p(40)}).` },
                { t: 'Es STEMI: en la mujer basta ≥1,5 mm en dos derivaciones contiguas de V2-V3, y se reperfunde ya sin esperar la troponina', ok: true },
                { t: 'Seguir como SCASEST: la elevación no llega a 2 mm en ninguna derivación', porque: `El SCASEST es depresión del ST o T invertida (${p(41)}); una elevación que cumple el umbral es STEMI, y en la mujer el umbral es 1,5 mm.` }],
              explicacion: `Tabla 20.1: elevación del punto J en ≥2 derivaciones contiguas, <span class="hl-rojo">≥1,5 mm en mujeres</span> (≥2,0 en varones) en V2-V3 (${p(41)}). Merece reperfusión emergente (${p(40)}); que la troponina no deba retrasarla es deducción (${DED}).`,
              nota: `<b>La fuente no lo dice.</b> La elevación de 1,7 mm y el regreso del dolor son datos de la paciente inventada.` + enFicha(D, 'mc-tabla-20-1') } },
          { momento: '07:15 · la 2.ª troponina', datos: { 'hs-cTn': 'a la hora, cambio >10 %' }, nuevo: ['hs-cTn'],
            pregunta: { id: 'scd-c5', tipo: 'destapa', cuantas: 'son dos', fuente: 'mc-troponina · mc-troponina-resultado',
              enunciado: 'La 2.ª hs-cTn de Sagrario, una hora después de la primera, ha cambiado más del 10 %. Tu respuesta tiene dos partes: ¿qué significa y cambia la conducta?',
              puntos: [
                `Un <span class="hl-rojo">cambio >10 %</span> en la segunda determinación es evidencia de isquemia aguda.`,
                `No cambia la conducta: <span class="hl-azul">el ECG ya indicaba la reperfusión emergente</span>.`],
              explicacion: `Un cambio significativo (por lo común >10 %) en la segunda hs-cTn es evidencia de isquemia aguda (${p(41)}). El STEMI se reperfunde por el ECG (${p(40)}); que la conducta no cambie es deducción (${DED}).` + enFicha(D, 'mc-troponina') } },
          { momento: '07:20 · nota del residente', datos: { Plan: 'nota de urgencias' }, nuevo: ['Plan'],
            pregunta: { id: 'scd-c4', tipo: 'error', fuente: 'mc-tabla-20-1 · mc-sca-ecg · mc-troponina-resultado',
              enunciado: 'La nota del residente sobre Sagrario. Puede tener un error. Encuéntralo.',
              frases: [
                { t: 'ECG de 12 derivaciones en menos de 10 min desde el primer contacto.' },
                { t: 'A las 06:15, una hs-cTn sobre el p99 con 75 min de dolor aún no era necrosis probable.' },
                { t: 'Con 1,7 mm en V2-V3 a las 07:10, la mujer cumple el criterio de STEMI y se reperfunde sin esperar la troponina.' },
                { t: 'Si hubiera un bloqueo de rama, el ST no se podría valorar y se descartaría el infarto.', mal: true, c: `Un bloqueo de rama o un ritmo de marcapasos <span class="hl-rojo">enmascara el ST</span>; si se sospecha isquemia coronaria se maneja como un STEMI (${p(40)}).` },
                { t: 'El cambio >10 % de la hs-cTn a la hora indica isquemia aguda.' }],
              explicacion: 'Un error: con un bloqueo de rama no se descarta el infarto; se maneja como un STEMI si hay sospecha.' } },
        ],
        lleva: [
          'Un ECG sin elevación puede pasar a STEMI: se repite si el dolor vuelve.' + enFicha(D, 'mc-sca-ecg'),
          'En la mujer, 1,5 mm en V2-V3 ya es STEMI; el ECG decide, no la troponina.' + enFicha(D, 'mc-tabla-20-1'),
          'La necrosis probable pide ≥3 h; un cambio de la hs-cTn >10 % es isquemia aguda.' + enFicha(D, 'mc-troponina')],
        volver: { nombre: 'El ECG del STEMI', ancla: 'mc-tabla-20-1', modelo: rv('stemi', '⚡ El ST elevado en el corazón eléctrico') } },
    ],
  },

  /* =================================================================================================
     Ficha 20 · SCA: tratamiento (cap. 20, págs. 41-49 y 52)
     ================================================================================================= */
  'mc-sca-tratamiento': {
    entrada: 'Cuándo reperfundir y con qué, para qué sirve (y para qué no) la trombólisis, qué bloquea cada antiagregante y cuándo se evitan el betabloqueante y el oxígeno.',
    guia: [
      { id: 'sct-g1', corto: 'el retraso que pesa', tipo: 'test', fuente: 'mc-puerta-balon · mc-fig-20-2',
        enunciado: 'Predice: en un STEMI tratado con angioplastia, ¿a partir de qué retraso desde la llegada la mortalidad sube de forma significativa?',
        opciones: [
          { t: 'Desde los 30 min: cada minuto cuenta y ya se nota', porque: `El objetivo de la trombólisis es <30 min, pero la mortalidad con ICP se eleva significativamente por encima de 120 min (${p(43)}). Con el umbral de 30 min decidirías mal los traslados que sí compensan.` },
          { t: 'Por encima de 120 min, aunque la AHA recomienda 90 min', ok: true },
          { t: 'Solo por encima de 180 min: antes de esa hora la espera no importa', porque: `La diferencia significativa empieza a partir de 121 min (${p(43)}); esperar hasta los 180 sería cargar mortalidad evitable (${DED}).` }],
        explicacion: `La ICP se hace en <span class="hl">90-120 min</span> desde la llegada (puerta-balón; la AHA recomienda 90). <span class="hl-rojo">La mortalidad aumenta significativamente por encima de 120 min</span> (Fig. 20.2, ${p(42)}-${p(43)}).`,
        nota: `<b>Nota de fidelidad.</b> En la Fig. 20.2 el eje dice «vidas salvadas por 100 tratados», pero el pie y el texto del libro hablan de mortalidad; se reproduce tal cual (${p(43)}).` + enFicha(R, 'mc-fig-20-2') },
      { id: 'sct-g2', corto: 'sin ICP en 120 min', tipo: 'test', fuente: 'mc-puerta-balon',
        enunciado: 'Un STEMI llega a un hospital sin ICP y el traslado a un centro con ICP superaría los 120 min. ¿Qué haces?',
        opciones: [
          { t: 'Trasladar y esperar la angioplastia, con heparina por si acaso: la trombólisis es peor que la ICP', porque: `Si se prevé superar 120 min, se hace trombólisis previa al traslado (${p(42)}); esperar sin reperfusión añade mortalidad por retraso (${p(43)}).` },
          { t: 'Trombólisis ya, iniciada en menos de 30 min (puerta-aguja), y trasladar', ok: true },
          { t: 'Esperar a llegar al centro con ICP y entonces dar la trombólisis, que es la alternativa a la angioplastia', porque: `La trombólisis se pone antes de la transferencia, en <30 min (${p(42)}); darla al llegar a un centro con ICP es hacer lo menos eficaz cuando ya tienes lo mejor (${p(41)}-${p(42)}).` }],
        explicacion: `Si no hay ICP disponible: transferencia inmediata (objetivo total <120 min). Si se prevé superarlo, <span class="hl-azul">trombólisis antes de trasladar</span>, iniciada en <span class="hl-rojo"><30 min</span> (puerta-aguja) (${p(42)}).` + enFicha(R, 'mc-puerta-balon') },
      { id: 'sct-g3', corto: 'cuándo deja de ayudar', tipo: 'test', fuente: 'mc-trombolisis · mc-fig-20-3', modeloVivo: vv('trombolisis', '🩸 Mueve el reloj y mira cuándo se apaga la lisis'),
        enunciado: 'Predice, y luego lo compruebas: el beneficio de la trombólisis depende del reloj. ¿Cuándo se pierde y deja de recomendarse?',
        opciones: [
          { t: 'Pasadas las 3 h: después el trombo ya está organizado', porque: `El beneficio es máximo en las primeras horas pero sigue hasta las 12 h (${p(43)}). Negarla a las 4 h dejaría sin reperfusión a un paciente sin ICP cercana.` },
          { t: 'Pasadas las 24 h, cuando termina la fase aguda', porque: `No se recomienda pasadas 12 h desde el inicio de los síntomas (${p(43)}); a las 24 h daría un sangrado de ~10 % sin beneficio de supervivencia (${p(45)}).` },
          { t: 'Pasadas las 12 h desde el inicio de los síntomas', ok: true }],
        explicacion: `El beneficio es <span class="hl-azul">máximo en las primeras horas</span> y se pierde tras las <span class="hl-rojo">12 h</span>: no se recomienda pasado ese plazo (Fig. 20.3, ${p(43)}-${p(44)}). Además es menos eficaz que la ICP y se limita al STEMI no complicado sin ICP inmediata (${p(43)}).`,
        nota: `Las cifras de vidas salvadas de la Fig. 20.3 están en el modelo, leídas del gráfico del libro. <b>La fuente no lo dice:</b> los valores entre las horas de cada barra son ilustrativos.` + enFicha(R, 'mc-fig-20-3') },
      { id: 'sct-g4', corto: 'la plasmina y el sangrado', tipo: 'test', fuente: 'mc-trombolitico-mecanismo · mc-trombolisis', modeloVivo: vv('trombolisis', '🩸 La plasmina corta la fibrina del trombo'),
        enunciado: 'Un paciente sangra tras la trombólisis y su fibrinógeno es bajo. Antes de decidir: ¿qué hace la plasmina y qué se hace con ese sangrado?',
        opciones: [
          { t: 'Disuelve las plaquetas del trombo; el sangrado se trata con ácido tranexámico para frenar la lisis', porque: `La plasmina corta los hilos de fibrina, no las plaquetas, y los antifibrinolíticos están desaconsejados por el riesgo de trombosis (${p(44)}-${p(45)}). Darlo podría reocluir la coronaria.` },
          { t: 'Corta la fibrina del coágulo, sobre todo donde hay fibrina; si el fibrinógeno es <100 mg/dL, crioprecipitado o concentrado de fibrinógeno', ok: true },
          { t: 'Disuelve por igual toda la fibrina del cuerpo; el sangrado no tiene relación con el fibrinógeno y se trata con plasma', porque: `Actúa sobre el plasminógeno unido a la fibrina del coágulo, lo que limita la fibrinólisis sistémica (${p(44)}); el sangrado se asocia con fibrinógeno bajo y se trata con crio o concentrado (${p(45)}).` }],
        explicacion: `El trombolítico convierte el plasminógeno en plasmina, que <span class="hl-azul">rompe los hilos de fibrina</span> en fragmentos; actúa sobre el plasminógeno unido a la fibrina del coágulo, lo que limita la fibrinólisis sistémica (${p(44)}). El sangrado grave se asocia con fibrinógeno <span class="hl-rojo"><100 mg/dL</span> y se trata con crio o concentrado; el ácido tranexámico está desaconsejado (${p(45)}).`,
        nota: `<b>La fuente no lo dice.</b> El libro asocia el sangrado con el fibrinógeno bajo, pero no explica por qué baja; que se consuma al lisar es una deducción, y la cifra de fibrinógeno del modelo es ilustrativa.` + enFicha(R, 'mc-trombolitico-mecanismo') },
      { id: 'sct-g5', corto: 'qué bloquea cada uno', tipo: 'test', fuente: 'mc-tabla-20-4', modeloVivo: vv('placa-antiagregantes', '🩸 Activa los tres interruptores sobre la plaqueta'),
        enunciado: 'Predice, y luego lo compruebas: aspirina, un P2Y12 y un anti-IIb/IIIa frenan la plaqueta. ¿Qué bloquea cada uno?',
        opciones: [
          { t: 'Aspirina: el receptor del ADP. P2Y12: la síntesis de tromboxano. IIb/IIIa: la activación de los factores', porque: `Están cambiados: la aspirina inhibe la producción de tromboxano y los P2Y12 bloquean el receptor del ADP (${p(47)}). Con esa idea no sabrías por qué se asocian las dos primeras ni por qué cada una tiene su contraindicación.` },
          { t: 'Aspirina: la síntesis de tromboxano (irreversible). P2Y12: el receptor del ADP. IIb/IIIa: los puentes de fibrinógeno entre plaquetas', ok: true },
          { t: 'Aspirina: el tromboxano. P2Y12: el fibrinógeno. IIb/IIIa: el receptor del ADP', porque: `El IIb/IIIa es el receptor que liga fibrinógeno y forma puentes entre plaquetas (${p(48)}); el P2Y12 es el del ADP (${p(47)}). Además, ninguno disuelve el trombo, solo evitan que crezca (${p(47)}).` }],
        explicacion: `Aspirina: <span class="hl-azul">inhibe la producción de tromboxano</span> de forma irreversible. P2Y12: bloquean el receptor plaquetario por el que el ADP agrega las plaquetas. IIb/IIIa: bloquean la unión del fibrinógeno que une las plaquetas (${p(47)}-${p(48)}). Previenen el crecimiento del trombo, no lo disuelven (${p(47)}).`,
        nota: `<b>La fuente no lo dice.</b> «Ninguno disuelve el trombo» se deduce de que se usan «para prevenir el crecimiento de un trombo existente» (${p(47)}).` + enFicha(R, 'mc-tabla-20-4') },
      { id: 'sct-g6', corto: 'cuándo no betabloqueo', tipo: 'destapa', cuantas: 'son tres', fuente: 'mc-betabloqueo-sca · mc-betabloqueo-sca-pas',
        enunciado: 'El metoprolol IV baja la demanda de oxígeno del miocardio, pero no siempre se da. Tu respuesta tiene tres partes: ¿en qué tres situaciones del SCA lo evitas?',
        puntos: [
          `<span class="hl-rojo">Insuficiencia cardíaca aguda</span>: no se aconseja el uso precoz.`,
          `<span class="hl-rojo">PAS <120 mmHg</span>: aumenta el riesgo de shock cardiogénico.`,
          `<span class="hl-rojo">Isquemia por cocaína</span>: vasoconstricción α no antagonizada.`],
        explicacion: `Además de las contraindicaciones tradicionales (bradicardia, hipotensión, bloqueo AV de alto grado), se evita en la IC aguda, con PAS <120 mmHg y en la isquemia por cocaína (${p(46)}-${p(47)}). Tras estabilizar, se recomiendan a largo plazo en la IC con FE reducida (${p(47)}).`,
        nota: `El libro da para el metoprolol IV la misma pauta que para la morfina (4-8 mg y 2-8 mg cada 5-15 min); se reproduce tal cual.` + enFicha(R, 'mc-betabloqueo-sca') },
      { id: 'sct-g7', corto: 'oferta y demanda', tipo: 'destapa', cuantas: 'son dos', fuente: 'mc-oferta-demanda',
        enunciado: 'Si el infarto fuera solo falta de oxígeno, el shock circulatorio progresivo, con el aporte de oxígeno muy comprometido, daría infartos agudos. No los da. Tu respuesta tiene dos partes: ¿por qué?',
        puntos: [
          `El infarto lo causa <span class="hl-rojo">un coágulo que obstruye una arteria coronaria</span>.`,
          `No lo causa una caída global del aporte de O₂ al miocardio: la anemia o la hipoxemia, por sí solas, no bastan.`],
        explicacion: `La noción de oferta y demanda de O₂ como causa del infarto es engañosa: <span class="hl-azul">el infarto lo causa un coágulo en una coronaria</span>, no un desequilibrio global del aporte de oxígeno (${p(53)}).`,
        nota: `Las medidas cardioprotectoras (oxígeno, nitroglicerina, betabloqueo) sí mejoran el equilibrio local de oxígeno, pero no sustituyen la reperfusión (${p(45)}).` + enFicha(R, 'mc-oferta-demanda') },
    ],
    examen: [
      { id: 'sct-e1', corto: 'lisis en NSTEMI', tipo: 'test', fuente: 'mc-scasest', origen: 'ilustrativo: el paciente es inventado; la regla, de la ficha',
        enunciado: 'Un varón de 66 años tiene un NSTEMI con dolor que cede y está estable, en un hospital sin ICP. Un compañero propone tenecteplasa «por si acaso». ¿Qué le dices?',
        opciones: [
          { t: 'Que sí: la trombólisis es la alternativa a la ICP cuando esta no está disponible, también en el NSTEMI, aunque sea menos eficaz', porque: `En el STEMI es la alternativa; en el NSTEMI no tiene beneficio de supervivencia (${p(43)}). Pondrías un riesgo de sangrado de ~10 % sin ganancia (${p(45)}).` },
          { t: 'Que no: no tiene beneficio de supervivencia en el NSTEMI; ICP urgente si hay inestabilidad, si no, entre las 24 y 72 h', ok: true },
          { t: 'Que sí, pero a mitad de dosis, porque el trombo es parcial', porque: `La dosis de la tenecteplasa va por peso (${p(45)}); no hay media dosis para el NSTEMI y tampoco beneficio de supervivencia (${p(43)}).` }],
        explicacion: `<span class="hl-rojo">La trombólisis no tiene beneficio de supervivencia en el NSTEMI</span> y no se usa como alternativa a la ICP. ICP urgente si hay inestabilidad hemodinámica, shock, IC aguda o dolor persistente; si no, en 24-72 h (${p(43)}).` + enFicha(R, 'mc-scasest') },
      { id: 'sct-e2', corto: 'tenecteplasa 92 kg', tipo: 'test', fuente: 'mc-tabla-20-2', origen: 'ilustrativo: el peso es del paciente; los tramos, de la Tabla 20.2',
        enunciado: 'Un STEMI de 2 horas, sin ICP, pesa 92 kg. ¿Qué dosis de tenecteplasa en bolo único?',
        opciones: [
          { t: '30 mg, la dosis más baja, por la edad avanzada del paciente', porque: `La dosis va por peso, no por edad: 30 mg es para <60 kg (${p(45)}). Dejaría al paciente infradosificado y el trombo sin lisar (${DED}).` },
          { t: '45 mg, el tramo de 80-89 kg', porque: `Ese es el tramo de 80-89 kg; a los 90 kg o más son 50 mg (${p(45)}). Quedaría por debajo de la dosis eficaz (${DED}).` },
          { t: '50 mg: el tramo de ≥90 kg', ok: true }],
        explicacion: `Tenecteplasa, bolo único por peso: 30 mg (<60 kg), 35 mg (60-69), 40 mg (70-79), 45 mg (80-89) y <span class="hl">50 mg (≥90 kg)</span>; permeabilidad a los 90 min, 85 % (${p(45)}).`,
        modeloVivo: vv('trombolisis', '🩸 Cambia el peso y mira el tramo'),
        nota: `El libro la describe como la más popular, sin ventaja de supervivencia demostrada frente a las otras (${p(45)}).` + enFicha(R, 'mc-tabla-20-2') },
      { id: 'sct-e3', corto: 'oxígeno con SaO₂ 93 %', tipo: 'test', fuente: 'mc-tabla-20-3', origen: 'ilustrativo: la saturación es del paciente; la regla, de la ficha',
        enunciado: 'Un paciente con STEMI respira aire ambiente con SaO₂ del 93 %. ¿Qué haces con el oxígeno?',
        opciones: [
          { t: 'Lo doy: en un infarto, más oxígeno llega al miocardio y reduce la zona infartada', porque: `No beneficia si la saturación es normal (≥90 %) y puede estrechar la coronaria y generar especies reactivas de O₂ en la reperfusión (${p(45)}).` },
          { t: 'No lo doy: solo se indica con SaO₂ <90 %, porque si no promueve vasoconstricción coronaria', ok: true },
          { t: 'Lo doy a poco flujo, 2 L/min: no hace daño y es lo habitual en el infarto', porque: `Era la práctica rutinaria, pero el O₂ suplementario no aporta beneficio con SaO₂ ≥90 % y tiene un lado oscuro (${p(45)}).` }],
        explicacion: `El oxígeno <span class="hl-rojo">solo se da si la SaO₂ es <90 %</span>: con saturación normal no beneficia, produce vasoconstricción coronaria y se implican especies reactivas de O₂ en la lesión por reperfusión (${p(45)}).` + enFicha(R, 'mc-tabla-20-3') },
      { id: 'sct-e4', corto: 'sangrado tras lisis', tipo: 'test', fuente: 'mc-trombolisis', origen: 'ilustrativo: el fibrinógeno es del paciente; la regla, de la ficha',
        enunciado: 'Un paciente sangra por las encías tras la tenecteplasa y su fibrinógeno es de 85 mg/dL. ¿Qué haces?',
        opciones: [
          { t: 'Ácido tranexámico IV: frena la fibrinólisis y el sangrado', porque: `Los antifibrinolíticos están desaconsejados por el riesgo de trombosis (${p(45)}): podrías ocluir la coronaria que acabas de abrir.` },
          { t: 'Plasma fresco sin más: repone todos los factores', porque: `El libro trata el sangrado con productos concentrados de fibrinógeno (crio o concentrado) cuando está bajo (${p(45)}); con plasma, la reposición de fibrinógeno sería menor (${DED}).` },
          { t: 'Crioprecipitado o concentrado de fibrinógeno, y no ácido tranexámico', ok: true }],
        explicacion: `Con fibrinógeno bajo (habitualmente <100 mg/dL) se usan <span class="hl-azul">crioprecipitado o concentrado de fibrinógeno</span>; <span class="hl-rojo">los antifibrinolíticos como el ácido tranexámico se desaconsejan</span> por el riesgo de trombosis (${p(45)}).` + enFicha(R, 'mc-trombolisis') },
      { id: 'sct-e5', corto: 'heparina en 70 kg', tipo: 'test', fuente: 'mc-sca-anticoagulacion', origen: 'ilustrativo: el peso es del paciente; las dosis y los topes, de la ficha',
        enunciado: 'Un paciente de 70 kg con STEMI va a ICP emergente. ¿Qué heparina no fraccionada le pones?',
        opciones: [
          { t: '4.200 U en bolo (60 U/kg) y 840 U/h', porque: `El bolo tiene un máximo de 4.000 U (${p(49)}); 60 × 70 = 4.200 superaría el tope y aumentaría el riesgo de sangrado (${DED}).` },
          { t: '4.000 U en bolo y 1.000 U/h: los máximos, para asegurar la anticoagulación', porque: `La infusión es 12 U/kg/h; con 70 kg salen 840 U/h, y 1.000 U/h es solo el tope (${p(49)}). Daría de más sin necesidad (${DED}).` },
          { t: '4.000 U en bolo (tope) y 840 U/h, con aPTT entre 1,5 y 2 veces el control', ok: true }],
        explicacion: `HNF: bolo de 60 U/kg con un <span class="hl">máximo de 4.000 U</span> (60 × 70 = 4.200 → 4.000) e infusión de 12 U/kg/h con máximo de 1.000 U/h (12 × 70 = 840), titulada a un aPTT de 1,5-2 veces el control, 24-48 h (${p(49)}).`,
        nota: `<b>Errata de la fuente.</b> El libro imprime «60 Units» sin «/kg» (${p(49)}); se usa la dosis habitual por peso, como en la ficha.` + enFicha(R, 'mc-r5-nota-hnf-sca') },
      { id: 'sct-e6', corto: 'enoxaparina a los 78', tipo: 'test', fuente: 'mc-sca-anticoagulacion', origen: 'ilustrativo: el paciente es inventado; la regla, de la ficha',
        enunciado: 'Una paciente de 78 años, con función renal normal, tiene un NSTEMI cuya ICP se difiere. Se elige enoxaparina. ¿Cómo la pautas?',
        opciones: [
          { t: '30 mg IV en bolo y 1 mg/kg SC cada 12 h, como en cualquier adulto', porque: `El bolo no se recomienda por encima de 75 años (${p(49)}); en una paciente de 78 aumentaría el riesgo de sangrado (${DED}).` },
          { t: '1 mg/kg SC cada 12 h, sin el bolo IV de 30 mg por tener más de 75 años, y sin reducir la dosis', ok: true },
          { t: '1 mg/kg SC cada 24 h, la mitad, porque a esa edad el aclaramiento está disminuido', porque: `La reducción del 50 % es para aclaramiento de creatinina <30 mL/min (${p(49)}); aquí la función renal es normal y quedaría infratratada.` }],
        explicacion: `Enoxaparina: bolo IV de 30 mg y luego 1 mg/kg SC cada 12 h; <span class="hl-rojo">el bolo no se recomienda en >75 años</span>, y la dosis se reduce un 50 % con aclaramiento de creatinina <30 mL/min (${p(49)}). Se usa cuando la ICP no es emergente o se difiere (${p(49)}).` + enFicha(R, 'mc-sca-anticoagulacion') },
      { id: 'sct-e7', corto: 'ticagrelor con HIC', tipo: 'test', fuente: 'mc-tabla-20-4', modeloVivo: vv('placa-antiagregantes', '🩸 Activa «HIC previa» y mira el sello'), origen: 'ilustrativo: el paciente es inventado; la regla, de la ficha',
        enunciado: 'Un STEMI va a ICP y tuvo una hemorragia intracraneal hace 2 años. El cardiólogo prepara ticagrelor porque «es el más potente». ¿Qué le dices?',
        opciones: [
          { t: 'Que adelante: la potencia es lo que importa y el riesgo de hemorragia intracraneal es solo de los primeros días', porque: `Está contraindicado si hay hemorragia intracraneal previa, porque aumenta el riesgo de nueva hemorragia (${p(48)}); una recaída intracraneal sería devastadora (${DED}).` },
          { t: 'Que está contraindicado con hemorragia intracraneal previa: se elige otro P2Y12', ok: true },
          { t: 'Que lo cambie por prasugrel, que es aún más potente y de menos riesgo hemorrágico', porque: `El prasugrel tiene más sangrado que el clopidogrel y está contraindicado en ictus o AIT reciente (${p(48)}). Cambiar de uno a otro sin mirar la contraindicación no resuelve el problema.` }],
        explicacion: `El ticagrelor es más potente que el clopidogrel y mejora la mortalidad y el reinfarto, pero <span class="hl-rojo">aumenta el riesgo de hemorragia intracraneal y está contraindicado si la hubo antes</span>; el prasugrel lo está en el ictus o el AIT reciente (${p(48)}).`,
        nota: `<b>La fuente no lo dice.</b> El libro no indica qué P2Y12 elegir en su lugar: solo da las contraindicaciones y las pautas de la Tabla 20.4 (${p(47)}).` + enFicha(R, 'mc-tabla-20-4') },
    ],
    profundizar: [
      { id: 'mc-tabla-20-3', titulo: 'Tabla 20.3: oxígeno, nitroglicerina, morfina y metoprolol' },
      { id: 'mc-tabla-20-4', titulo: 'Tabla 20.4: dosis de todos los antiagregantes' },
    ],
    casos: [
      { id: 'c-sca1', titulo: 'Sagrario, 72 años: la aguja en 30 minutos', corto: 'Caso · Sagrario', sub: 'diabética; 64 kg; hospital sin ICP; la dosis por peso y el sangrado',
        paciente: { Edad: '72 años, mujer', Peso: '64 kg', Antecedentes: 'diabetes tipo 2', Lugar: 'hospital sin ICP; el traslado a un centro con ICP tarda 150 min' },
        pasos: [
          { momento: '07:20 · decisión', datos: { Traslado: '150 min a un centro con ICP', Dolor: 'persiste' }, nuevo: ['Traslado'],
            pregunta: { id: 'scc-2', tipo: 'test', fuente: 'mc-puerta-balon', origen: 'ilustrativo: el tiempo de traslado es del caso; la regla, de la ficha',
              enunciado: 'El traslado de Sagrario al centro con ICP tardaría 150 min. ¿Qué haces y en cuánto tiempo?',
              opciones: [
                { t: 'Traslado inmediato y angioplastia al llegar: con 150 min la ICP sigue siendo la mejor opción', porque: `Si el tiempo total supera 120 min, la ICP deja de ser superior: la mortalidad crece por encima de ese retraso (${p(42)}-${p(43)}). Sagrario llegaría al cateterismo con el infarto ya establecido.` },
                { t: 'Trombólisis antes del traslado, empezando en menos de 30 min desde que llega', ok: true },
                { t: 'Esperar la hs-cTn y, si sube, trombólisis a las 3 h', porque: `El STEMI no espera la troponina (${p(40)}); la trombólisis se inicia en <30 min (${p(42)}), no a las 3 h.` }],
              explicacion: `Si el tiempo previsto supera los 120 min, <span class="hl-azul">trombólisis previa a la transferencia</span>, iniciada en <span class="hl-rojo"><30 min</span> (puerta-aguja) (${p(42)}). Se traslada después a un centro con ICP.` + enFicha(R, 'mc-puerta-balon') } },
          { momento: '07:30 · prescripción', datos: { Peso: '64 kg', Plan: 'tenecteplasa, heparina y doble antiagregación' }, nuevo: ['Peso', 'Plan'],
            pregunta: { id: 'scc-3', tipo: 'test', fuente: 'mc-tabla-20-2 · mc-sca-anticoagulacion · mc-tabla-20-4', modeloVivo: vv('trombolisis', '🩸 Pon el peso de Sagrario y mira el tramo'), origen: 'ilustrativo: el peso es de la paciente; las dosis, de las Tablas 20.2 y 20.4 y de la ficha',
              enunciado: 'Sagrario pesa 64 kg. ¿Qué pautas la tenecteplasa, la heparina no fraccionada y los antiagregantes?',
              opciones: [
                { t: 'Tenecteplasa 35 mg; HNF 3.840 U en bolo y 768 U/h; aspirina masticada 162-325 mg y clopidogrel 300-600 mg', ok: true },
                { t: 'Tenecteplasa 40 mg; HNF 4.000 U en bolo y 1.000 U/h; aspirina masticada 162-325 mg y clopidogrel 300-600 mg', porque: `Los 40 mg son para 70-79 kg; con 64 kg corresponden 35 mg (${p(45)}). Y los 4.000 U y 1.000 U/h son los máximos, no la dosis por peso: 60 × 64 = 3.840 y 12 × 64 = 768 (${p(49)}).` },
                { t: 'Tenecteplasa 35 mg; HNF 3.840 U y 768 U/h; aspirina 81 mg tragada y clopidogrel después de la ICP', porque: `La primera dosis de aspirina es de 162-325 mg masticada, sin tragar (${p(47)}); y el P2Y12 se da antes de la ICP, sumado a la aspirina (${p(47)}-${p(48)}). Retrasarlos dejaría la plaqueta sin frenar durante el traslado.` }],
              explicacion: `Por peso, 64 kg están en el tramo de 60-69: <span class="hl">35 mg</span> de tenecteplasa (${p(45)}). HNF: 60 U/kg = 3.840 U (por debajo del tope de 4.000) y 12 U/kg/h = 768 U/h (por debajo de 1.000) (${p(49)}). Aspirina <span class="hl-azul">162-325 mg masticada</span> al primer contacto y un P2Y12 (clopidogrel 300-600 mg) antes de la ICP (${p(47)}-${p(48)}).`,
              nota: `<b>Errata de la fuente.</b> El libro imprime «60 Units» sin «/kg» en el bolo de heparina (${p(49)}); se usa 60 U/kg, como la ficha. Con fondaparinux o HBPM en lugar de HNF, la pauta cambia (${p(49)}).` + enFicha(R, 'mc-tabla-20-2') } },
          { momento: '07:45 · orden del tratamiento', datos: { SaO2: '95 % con aire ambiente' }, nuevo: ['SaO2'],
            pregunta: { id: 'scc-4', tipo: 'error', fuente: 'mc-tabla-20-2 · mc-puerta-balon · mc-tabla-20-4 · mc-tabla-20-3',
              enunciado: 'La orden de enfermería que escribe el residente para Sagrario. Hay dos errores. Encuéntralos.',
              frases: [
                { t: 'Tenecteplasa 50 mg en bolo único.', mal: true, c: `Con 64 kg corresponden <span class="hl">35 mg</span> (tramo de 60-69 kg); los 50 mg son para ≥90 kg (${p(45)}).` },
                { t: 'Esperar al centro con ICP sin dar la trombólisis, porque es más eficaz.', mal: true, c: `Con traslado previsto de más de 120 min, <span class="hl-rojo">trombólisis antes del traslado</span>, en <30 min (${p(42)}).` },
                { t: 'Aspirina masticada en el primer contacto.' },
                { t: 'Oxígeno solo si la saturación baja de 90 %.' }],
              explicacion: 'Dos errores: la dosis de tenecteplasa de otro tramo de peso y renunciar a la trombólisis cuando el traslado supera los 120 min.',
              nota: `<b>La fuente no lo dice.</b> La saturación de 95 % es de la paciente inventada.` } },
          { momento: '09:30 · constantes', datos: { Constantes: 'PA 104/62, FC 88', Dolor: 'cede a la mitad' }, nuevo: ['Constantes'],
            pregunta: { id: 'scc-5', tipo: 'test', fuente: 'mc-betabloqueo-sca · mc-betabloqueo-sca-pas', origen: 'ilustrativo: las constantes son de la paciente; la regla, de la ficha',
              enunciado: 'A las 09:30 Sagrario tiene PA 104/62 y FC 88, con el dolor aún presente. Un compañero pide metoprolol IV «para bajar la demanda de oxígeno». ¿Qué haces?',
              opciones: [
                { t: 'Metoprolol 4-8 mg IV ya: los betabloqueantes se empiezan en las primeras 24 h del SCA', porque: `Con PAS <120 mmHg aumentan el riesgo de shock cardiogénico (${p(47)}). Con 104, el betabloqueante podría llevarla al shock (${DED}).` },
                { t: 'No: con PAS <120 mmHg el betabloqueante aumenta el riesgo de shock cardiogénico', ok: true },
                { t: 'Sí, pero a media dosis, porque la FC de 88 es alta', porque: `La contraindicación no se arregla con la dosis: la PAS <120 mmHg aumenta el riesgo de shock cardiogénico (${p(47)}), y una FC de 88 no es la taquicardia que justificaría el riesgo (${DED}).` }],
              explicacion: `Los betabloqueantes se empiezan en las primeras 24 h, pero <span class="hl-rojo">con PAS <120 mmHg aumentan el riesgo de shock cardiogénico</span> (${p(46)}-${p(47)}). Con PA 104/62 no se dan. Si el dolor persiste, la morfina es el fármaco de elección para el dolor refractario a la nitroglicerina (${p(46)}).`,
              nota: `<b>La fuente no lo dice.</b> El libro no da una dosis reducida de metoprolol para estos casos.` + enFicha(R, 'mc-betabloqueo-sca-pas') } },
          { momento: '10:40 · el giro', datos: { Exploración: 'gingivorragia y hematoma en el punto de punción', Hb: '10,1 g/dL', Fibrinógeno: '84 mg/dL' }, nuevo: ['Exploración', 'Hb', 'Fibrinógeno'],
            pregunta: { id: 'scc-6', tipo: 'test', fuente: 'mc-trombolisis', origen: 'ilustrativo: las cifras son de la paciente; el manejo, de la ficha',
              enunciado: 'Tres horas después de la tenecteplasa, Sagrario sangra por las encías y tiene un hematoma en el punto de punción. Hb 10,1 y fibrinógeno 84 mg/dL. El residente pregunta si pone ácido tranexámico. ¿Qué haces?',
              opciones: [
                { t: 'Ácido tranexámico IV: frena la fibrinólisis que está causando el sangrado', porque: `Los antifibrinolíticos están desaconsejados por el riesgo de trombosis (${p(45)}); abierta la coronaria hace unas horas, podrías reocluirla.` },
                { t: 'Crioprecipitado o concentrado de fibrinógeno; el ácido tranexámico no', ok: true },
                { t: 'Nada, salvo vigilar: el sangrado de la trombólisis es esperable y se acepta mientras la hemoglobina se mantenga estable', porque: `El sangrado significativo se da en ~10 % y el potencialmente mortal en ~1 % (${p(45)}); con fibrinógeno <100 mg/dL, la ficha manda reponerlo.` }],
              explicacion: `Se asocia con fibrinógeno bajo (usualmente <100 mg/dL) y se trata con <span class="hl-azul">crioprecipitado o concentrado de fibrinógeno</span>; el ácido tranexámico se desaconseja por el riesgo de trombosis (${p(45)}). Con 84 mg/dL, Sagrario está por debajo del umbral.`,
              nota: `<b>La fuente no lo dice.</b> El libro no da cuántas unidades de crio ni la dosis del concentrado en este capítulo: remite al último apartado del capítulo 13 (${p(45)}).` + enFicha(R, 'mc-trombolisis') } },
          { momento: '10:55 · repaso', datos: { Evolución: 'sangrado controlado; sigue el traslado' }, nuevo: ['Evolución'],
            pregunta: { id: 'scc-7', tipo: 'destapa', cuantas: 'son dos', fuente: 'mc-trombolisis · mc-scasest', modeloVivo: vv('trombolisis', '🩸 Mira el reloj y la oclusión: cuándo se apaga la lisis'),
              enunciado: 'Dos preguntas para cerrar. ¿Por qué la lisis de Sagrario hace sangrar lejos del coágulo y en qué otra situación del SCA no la habrías puesto? Tu respuesta tiene dos partes.',
              puntos: [
                `Porque <span class="hl-azul">limita pero no elimina la fibrinólisis sistémica</span>: el sangrado grave se asocia con un fibrinógeno bajo (<100 mg/dL).`,
                `En el <span class="hl-rojo">NSTEMI</span> (sin beneficio de supervivencia) ni pasadas las <span class="hl-rojo">12 h</span> del inicio de los síntomas.`],
              explicacion: `La plasmina actúa sobre el plasminógeno unido a la fibrina del coágulo, lo que limita, no suprime, la fibrinólisis sistémica (${p(44)}); el sangrado significativo se da en ~10 % y se asocia con el fibrinógeno bajo (${p(45)}). No se usa en el NSTEMI (${p(43)}) ni pasadas 12 h (${p(43)}).`,
              nota: `<b>La fuente no lo dice.</b> Que el fibrinógeno se consuma al lisar es una deducción; el libro solo lo asocia con el sangrado (${p(45)}).` + enFicha(R, 'mc-trombolisis') } },
        ],
        lleva: [
          'Si la ICP no llega en 120 min, la trombólisis va antes del traslado, con la aguja en menos de 30.' + enFicha(R, 'mc-puerta-balon'),
          'La tenecteplasa y la heparina van por el peso, con sus topes.' + enFicha(R, 'mc-tabla-20-2'),
          'Si sangra, fibrinógeno (crio o concentrado), no ácido tranexámico.' + enFicha(R, 'mc-trombolisis')],
        volver: { nombre: 'La trombólisis', ancla: 'mc-trombolisis', modelo: vv('trombolisis', '🩸 La lisis, el peso y el reloj') } },
    ],
  },
};

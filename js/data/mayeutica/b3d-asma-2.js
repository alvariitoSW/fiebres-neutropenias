// Mayéutica del bloque 3D · neumo-asma-agudo (Marino cap. 23, págs. 19-25) y la continuación del caso de Eulalia en la UCI.
// Datos puros; el formato está en la cabecera de b1-fluidos.js. Se funde en b3d-asma.js (MAYEUTICA_ASMA).
// Modelos vivos: receptorVivo `bronquio` (β₂) y pulmonVivo `eulalia-ajustada` (menos FR = menos atrapamiento). Eulalia: 27 años,
// 60 kg, PBW 54 kg. Las cifras de los casos son del paciente (inventado); la conducta, de la fuente. El caso termina al decidir
// intubar: la intubada (auto-PEEP, oclusión) sigue en la ficha «PEEP oculta».
const PDF = 'docs/marino-2024-respiratory-management-caps22-26.pdf';
const p = n => `<a class="biblio-link" href="${PDF}#page=${n}" target="_blank" rel="noopener">pág. ${n}</a>`;
const NEU = 'data-especialidad="neumologia" data-view="merinoNeumologia" data-panel="panel-merino-neumo-tabs"';
const AG = 'neumo-asma-agudo';
const enFicha = id => ` <button type="button" class="may-ir" ${NEU} data-tab="${AG}" data-resaltar="#${id}">Ver en la ficha ↗</button>`;
const pl = (clave, texto) => ({ pulmonVivo: clave, texto });
const rc = (clave, texto) => ({ receptorVivo: clave, texto });

export const MAYEUTICA_ASMA_AGUDO = {
  [AG]: {
    entrada: 'Por qué una PaCO₂ normal en el asma grave es retención, qué hace cada fármaco y cuándo se retira, y qué se hace cuando nada de eso basta.',
    guia: [
      { id: 'as2-g1', corto: 'PaCO₂ 42', tipo: 'destapa', cuantas: 'son dos cosas', fuente: 'nep-paco2-42 · nep-algoritmo',
        enunciado: 'Tras los broncodilatadores, un asmático tiene una PaCO₂ de 42 mmHg y el algoritmo lo manda a la UCI. ¿Por qué un valor "normal" es tan grave?',
        puntos: [
          `<span class="hl-azul">La ventilación minuto está aumentada</span> en el asma aguda (a menudo duplicada), y eso por sí solo haría bajar la PaCO₂ (${p(20)}).`,
          `<span class="hl-rojo">Una PaCO₂ normal frente a una ventilación minuto alta es retención de CO₂</span>: signo de obstrucción grave de la vía aérea (${p(20)}).`],
        explicacion: `En la Fig. 23.3, la evaluación final con PaCO₂ ≥42 mmHg es una respuesta pobre que ingresa en UCI (${p(21)}); el texto la llama "normal" (${p(20)}).`,
        nota: `<b>Lo que dice la fuente:</b> el texto llama «normal» a una PaCO₂ de 42 y justifica el ingreso en UCI (${p(20)}); la Fig. 23.3 usa «PaCO₂ ≥42» para la respuesta pobre y «<42» para la incompleta (${p(21)}). Se reproducen las dos formas tal cual.` + enFicha('nep-paco2-42') },
      { id: 'as2-g2', corto: 'SABA en aerosol', tipo: 'test', fuente: 'nep-saba',
        enunciado: 'El β₂-agonista de acción corta es el broncodilatador de elección en la crisis. ¿Qué vía y qué cinética tiene el albuterol?',
        opciones: [
          { t: 'Oral o IV, más rápidos que el aerosol; el efecto pico llega a las 4 horas', porque: `El aerosol es más eficaz que la vía oral o IV y con menos efectos secundarios (${p(20)}); esperar horas para el pico dejaría la crisis sin tratar.` },
          { t: 'Aerosol: inicio en menos de 5 minutos, pico a los 15-60 minutos y duración de 2-5 horas', ok: true },
          { t: 'Aerosol con inicio a los 30 minutos y pico a las 2 horas; el levalbuterol a media dosis es claramente superior', porque: `Inicio en menos de 5 min y pico a los 15-60 min; el levalbuterol es igual de eficaz a la mitad de dosis, pero los estudios no han mostrado ventaja sobre el albuterol (${p(20)}).` }],
        explicacion: `Estimula los receptores β₂ del músculo liso bronquial; <span class="hl-azul">aerosol</span> mejor que oral o IV (${p(20)}). Los β de acción prolongada se reservan para el mantenimiento. El levalbuterol (R-enantiómero) vale a la mitad de dosis, pero sin ventaja demostrada.` + enFicha('nep-saba') },
      { id: 'as2-g3', corto: 'pauta de aerosol', tipo: 'test', fuente: 'nep-regimenes · nep-tabla-23-2',
        enunciado: 'Pautas de albuterol en la exacerbación. ¿Cuál es la secuencia que recomienda Marino?',
        opciones: [
          { t: 'Una nebulización cada 4-6 horas desde el principio, y continuo solo en la UCI, con el esteroide oral como único apoyo hasta que mejore', porque: `Eso es el mantenimiento del paciente ingresado. Al inicio van hasta tres tratamientos de 20 min (${p(20)}); quedarse en cada 4-6 h es infratratar la crisis.` },
          { t: 'Tres tratamientos de 20 min; luego cada hora hasta 3 h o continuo 5-15 mg/h; ingresado, cada 4-6 h', ok: true },
          { t: 'Una nebulización de 2,5 mg cada 20 min durante 24 horas', porque: `Son tres de 20 min, y después cada hora o continuo (${p(20)}); mantener la dosis agresiva durante un día amplifica la taquicardia, la hipopotasemia y el lactato.` }],
        explicacion: `<span class="hl-azul">Tres de 20 min</span> (2,5-5 mg por nebulizador o 4-8 puffs con espaciador), después horario hasta 3 h o <span class="hl-azul">continuo a 5-15 mg/h</span>, que puede ser más eficaz en la obstrucción grave; al ingresar, cada 4-6 h (${p(20)}).` + enFicha('nep-regimenes'),
        nota: `<b>Las fuentes discrepan:</b> para el paciente ingresado, el texto da 2,5-5 mg por nebulizador o 4-8 puffs cada 4-6 h (${p(20)}); la Tabla 23.2, 2,5 mg o 2 puffs (${p(22)}). Se muestran las dos; no se elige una.` },
      { id: 'as2-g4', corto: 'adrenalina subcutánea', tipo: 'test', fuente: 'nep-parenteral',
        enunciado: '¿Cuándo se usa la epinefrina subcutánea en una crisis de asma?',
        opciones: [
          { t: 'En el raro paciente que no tolera los aerosoles, por tos excesiva: 0,3-0,5 mg cada 20 min, tres dosis', ok: true },
          { t: 'Siempre a la vez que el aerosol cuando el PEFR es <40 %, para sumar efecto, y mantenerla hasta el ingreso en planta', porque: `Es la alternativa para quien no tolera el aerosol (${p(22)}); sumarla de rutina añade taquicardia y arritmias sin respaldo en la fuente.` },
          { t: 'Si fallan tres nebulizaciones, 0,3-0,5 mg cada 4-6 horas como mantenimiento', porque: `Tampoco: la pauta es cada 20 min, tres dosis, y solo si no tolera el aerosol (${p(22)}); el fallo del aerosol va a ipratropio, esteroides y UCI.` }],
        explicacion: `La vía parenteral (epinefrina sc 0,3-0,5 mg o terbutalina sc 0,25 mg, cada 20 min, 3 dosis) es para el paciente que <span class="hl-rojo">no tolera los broncodilatadores en aerosol</span> (${p(22)}).` + enFicha('nep-parenteral') },
      { id: 'as2-g5', corto: 'potasio y lactato', tipo: 'error', fuente: 'nep-efectos-secundarios', modeloVivo: rc('bronquio', '💉 El albuterol en el bronquio y en la célula: por qué el K baja'),
        enunciado: 'Nota de guardia sobre una asmática con albuterol a dosis altas. Hay un error. Encuéntralo.',
        frases: [
          { t: 'Con aerosol agresivo de SABA pueden aparecer taquicardia, temblor e hiperglucemia.' },
          { t: 'La hipopotasemia es un desplazamiento del potasio hacia las células mediado por receptores β.' },
          { t: 'Un lactato de 3,5 en estas condiciones es de metabolismo anaerobio: hay que subir la noradrenalina.', mal: true, c: `La fuente probable del lactato es un aumento de la tasa metabólica, no el metabolismo anaeróbico (${p(22)}).` },
          { t: 'También pueden bajar el magnesio y el fósforo séricos.' }],
        explicacion: `Los SABA a dosis altas producen taquicardia, temblor, hiperglucemia, <span class="hl-azul">hipopotasemia</span> (entrada de K a la célula por receptores β), hipomagnesemia, hipofosfatemia y <span class="hl-azul">lactato elevado, probablemente de origen metabólico</span> (${p(22)}).` + enFicha('nep-efectos-secundarios') },
      { id: 'as2-g6', corto: 'ipratropio', tipo: 'test', fuente: 'nep-ipratropio · nep-tabla-23-2',
        enunciado: 'Eulalia llega a la UCI con ipratropio en la pauta de urgencias. ¿Cuánto tiempo lo mantienes?',
        opciones: [
          { t: 'Solo las primeras 3-4 horas junto al SABA en la exacerbación grave; se retira al ingresar', ok: true },
          { t: 'Todo el ingreso, 0,5 mg cada 4 horas, porque suma broncodilatación mientras persista la obstrucción en la UCI', porque: `No tiene beneficio demostrado más allá de las primeras horas y debe discontinuarse en quien ingresa (${p(23)}). Seguirlo da riesgo y coste sin ganancia.` },
          { t: 'Solo si la respuesta al SABA ya es satisfactoria, para mantenerla', porque: `Se usa si la respuesta inicial al albuterol no es satisfactoria (${p(22)}); con buena respuesta no hace falta.` }],
        explicacion: `Beneficio solo marginal: <span class="hl-rojo">únicamente en las primeras 3-4 horas</span>, 0,5 mg cada 20 min ×3 (o 8 puffs de 18 μg), y se discontinúa al ingresar para manejo continuado. Absorción sistémica mínima (${p(22)}-${p(23)}).` + enFicha('nep-ipratropio') },
      { id: 'as2-g7', corto: 'esteroides', tipo: 'destapa', cuantas: 'son cuatro cosas', fuente: 'nep-corticoides-asma · nep-tabla-23-2',
        enunciado: 'Quieres explicarle al adjunto cómo se usan los esteroides en el asma aguda. ¿Qué cuatro cosas dice Marino?',
        puntos: [
          `<span class="hl-azul">Oral = IV</span>: no hay diferencia de eficacia entre las dos vías (${p(23)}).`,
          `<span class="hl-rojo">Tardan hasta 12 h</span> en notarse, así que no cambian el curso en urgencias (${p(23)}).`,
          `<span class="hl-azul">Sin curva dosis-respuesta</span>: por encima de 100 mg de prednisona al día (o equivalente) no hay beneficio añadido (${p(23)}).`,
          `<span class="hl-verde">Un ciclo de 10 días</span> se puede parar de golpe, sin descenso progresivo (${p(23)}).`],
        explicacion: `Se recomiendan en todos los que no responden tras 1-2 broncodilatadores: 40-80 mg diarios de prednisona (oral) o metilprednisolona (IV) en 1-2 dosis; los inhalados pueden iniciarse en cualquier momento y seguir tras suspender los sistémicos (${p(23)}).`,
        nota: `<b>Las fuentes discrepan:</b> el texto continúa la dosis «hasta que hay evidencia de resolución satisfactoria» (${p(23)}); la Tabla 23.2 dice «durante 7-10 días» (${p(22)}). Se muestran las dos formulaciones; no se elige una.` + enFicha('nep-corticoides-asma') },
      { id: 'as2-g8', corto: 'dexametasona', tipo: 'test', fuente: 'nep-tabla-23-3',
        enunciado: 'Según la Tabla 23.3, ¿qué corticoide es el antiinflamatorio más potente y qué observa Marino?',
        opciones: [
          { t: 'La hidrocortisona, porque necesita la dosis equivalente más alta, 20 mg', porque: `Una dosis equivalente alta significa menos potencia: la hidrocortisona es la referencia, con actividad 1 (${p(24)}).` },
          { t: 'La metilprednisolona, con actividad 5, que por eso es la recomendada en el asma y se prefiere a la prednisona', porque: `La más potente es la dexametasona (30-40) (${p(24)}); la metilprednisolona vale 5.` },
          { t: 'La dexametasona (30-40 veces la hidrocortisona) y, sin embargo, no está recomendada en el asma', ok: true }],
        explicacion: `La dexametasona (0,75 mg equivalentes; actividad antiinflamatoria <span class="hl-rojo">30-40</span>) es la más potente y no se recomienda en el asma: eso <span class="hl-azul">plantea dudas sobre cómo actúan los esteroides</span> en el asma (${p(23)}-${p(24)}). Es una duda del autor.` + enFicha('nep-tabla-23-3') },
      { id: 'as2-g9', corto: 'magnesio', tipo: 'test', fuente: 'nep-magnesio',
        enunciado: 'Persiste la obstrucción tras albuterol, ipratropio y esteroides. ¿Cómo das el magnesio?',
        opciones: [
          { t: '2 g de MgSO₄ IV en 15-30 minutos; el inhalado (150 mg) ha dado resultados inconsistentes y no se aconseja', ok: true },
          { t: '150 mg de MgSO₄ nebulizado cada 20 minutos junto al albuterol, como refuerzo cuando la respuesta al aerosol es incompleta y la vía IV no es posible', porque: `El magnesio inhalado dio resultados inconsistentes y no se aconseja (${p(24)}); perderías minutos con una vía sin respaldo.` },
          { t: '2 g de MgSO₄ IV en bolo de 1-2 minutos, para que actúe más rápido', porque: `La pauta es una infusión de 15-30 minutos (${p(22)}, ${p(24)}); un bolo rápido no figura en la fuente.` }],
        explicacion: `Broncodilatador leve (quizá por bloqueo de canales de calcio): <span class="hl-azul">2 g IV en 15-30 min</span> acelera la resolución cuando falla la respuesta al albuterol, el ipratropio y los esteroides (${p(24)}).` + enFicha('nep-magnesio') },
      { id: 'as2-g10', corto: 'ketamina', tipo: 'test', fuente: 'nep-ketamina', modeloVivo: pl('eulalia-ajustada', '🫁 Eulalia con menos FR: mira el aire atrapado y la espiración'),
        enunciado: 'En un asma refractaria se plantea sedar con ketamina. ¿Por qué ayuda?',
        opciones: [
          { t: 'Baja la FR y con ella el atrapamiento y la hiperinflación; además broncodilata algo', ok: true },
          { t: 'Sube el volumen minuto y lava el CO₂: la hiperventilación mejora el intercambio y reduce la acidosis', porque: `La sedación ayuda al contrario: baja la FR y con ella el atrapamiento (${p(24)}). Subir la ventilación minuto en el asma aumenta la hiperinflación y la PEEP intrínseca.` },
          { t: 'Reduce el edema de la pared bronquial y la producción de moco, como lo hace el esteroide', porque: `Marino la propone por bajar la FR y por una broncodilatación discreta; sus efectos adversos incluyen más secreciones (${p(24)}), así que el paciente podría taponarse con moco.` }],
        explicacion: `Menos FR = menos tendencia al <span class="hl-azul">atrapamiento de aire</span> y a la hiperinflación; la ketamina da además cierta broncodilatación. Efectos adversos: disforia, alucinaciones y más secreciones (${p(24)}). La dosis se pregunta en el caso.` + enFicha('nep-ketamina') },
      { id: 'as2-g11', corto: 'oxígeno de alto flujo', tipo: 'test', fuente: 'nep-o2-asma',
        enunciado: 'La SaO₂ de una asmática grave no sube con la mascarilla a 15 L/min. ¿Qué objetivo y qué alternativa propone Marino?',
        opciones: [
          { t: 'SaO₂ 88-92 %; no hay alternativa, pues el flujo máximo es 15 L/min', porque: `Ese objetivo es el del EPOC; en el asma es SaO₂ ≥90 %, y puede hacer falta un sistema de alto flujo (${p(24)}).` },
          { t: 'SaO₂ ≥90 %; el flujo inspiratorio supera los 60 L/min: puede hacer falta O₂ nasal de alto flujo (40-60 L/min)', ok: true },
          { t: 'SaO₂ del 100 % con reservorio a 15 L/min, que cubre el flujo inspiratorio sin necesidad de humidificar ni calentar el gas', porque: `Los sistemas convencionales dan hasta 15 L/min y el flujo inspiratorio supera los 60 (${p(24)}): arrastrarías aire ambiente y la hipoxemia seguiría.` }],
        explicacion: `Se da O₂ para mantener la SaO₂ ≥90 %. Los sistemas convencionales llegan a 15 L/min y el flujo inspiratorio en el asma aguda puede superar <span class="hl-rojo">60 L/min</span>: <span class="hl-azul">HFNO a 40-60 L/min</span> (${p(24)}).` + enFicha('nep-o2-asma') },
      { id: 'as2-g12', corto: 'BiPAP y fracaso', tipo: 'test', fuente: 'nep-vni-asma',
        enunciado: 'Una asmática hipercápnica prueba BiPAP. ¿Qué dato te dice que hay que intubar?',
        opciones: [
          { t: 'Que la saturación suba al 94 %: la oxigenación no era el problema', porque: `Lo que se vigila es la PaCO₂ (${p(24)}); la saturación puede mejorar mientras la ventilación sigue fallando.` },
          { t: 'Que la BiPAP no consiga bajar la PCO₂ arterial', ok: true },
          { t: 'Que la PaCO₂ baje de 60 a 50 en una hora', porque: `Ese descenso es la respuesta que se busca; es el fracaso en reducirla lo que sugiere intubar (${p(24)}).` }],
        explicacion: `Los casos más graves cursan con hipercapnia y pueden requerir un ensayo de BiPAP; <span class="hl-rojo">el fracaso de la BiPAP en reducir la PaCO₂</span> es a menudo indicación de intubar y ventilar (${p(24)}-${p(25)}).` + enFicha('nep-vni-asma') },
    ],
    examen: [
      { id: 'as2-e1', corto: '200 mg de metilprednisolona', tipo: 'test', fuente: 'nep-corticoides-asma',
        enunciado: 'Un residente propone subir de 60 a 200 mg diarios de metilprednisolona "para que haga efecto antes". ¿Qué le dices?',
        opciones: [
          { t: 'Que no hay curva dosis-respuesta ni beneficio por encima de 100 mg de prednisona, y el efecto tarda 12 horas', ok: true },
          { t: 'Que por vía oral absorbería menos y por eso conviene la IV a dosis altas', porque: `No hay diferencia de eficacia entre oral e IV (${p(23)}); subir la dosis solo añade efectos secundarios.` },
          { t: 'Que puede subir, pero luego hay que bajar la dosis de forma progresiva a lo largo de 10 días, porque suspenderlo de golpe provoca recaída', porque: `Un ciclo de 10 días puede suspenderse de golpe, y no hay beneficio por encima de 100 mg diarios (${p(23)}).` }],
        explicacion: `<span class="hl-rojo">Sin curva dosis-respuesta</span>: nada por encima de 100 mg de prednisona (o equivalente); el beneficio no aparece hasta unas 12 h (${p(23)}).` + enFicha('nep-corticoides-asma') },
      { id: 'as2-e2', corto: 'levalbuterol', tipo: 'test', fuente: 'nep-saba · nep-tabla-23-2',
        enunciado: 'El servicio quiere cambiar a levalbuterol "porque es la forma activa y causa menos efectos". ¿Qué dice la Tabla 23.2?',
        opciones: [
          { t: 'Que sin beneficio demostrado sobre el albuterol: es igual de eficaz a la mitad de dosis (1,25-2,5 mg), no mejor', ok: true },
          { t: 'Que reduce la taquicardia y la hipopotasemia, y justifica el cambio al ser el enantiómero activo y necesitar la mitad de dosis', porque: `La tabla anota "sin beneficio demostrado frente a albuterol" (${p(22)}); el cambio sería un coste sin ventaja clínica.` },
          { t: 'Que es más potente y se da a la misma dosis, 2,5-5 mg', porque: `Es el R-enantiómero, igual de eficaz a la mitad de dosis (1,25-2,5 mg) (${p(20)}, ${p(22)}); la misma dosis sería doblar la exposición.` }],
        explicacion: `Levalbuterol 1,25-2,5 mg: <span class="hl-rojo">sin beneficio demostrado</span> frente al albuterol (${p(20)}, ${p(22)}).` + enFicha('nep-tabla-23-2') },
      { id: 'as2-e3', corto: 'perfil de la Fig. 23.3', tipo: 'test', fuente: 'nep-algoritmo',
        enunciado: 'Algoritmo de la Fig. 23.3. Un asmático grave (PEFR <40 %) tras el primer tratamiento. ¿Qué se pauta y cuál es el criterio final para UCI?',
        opciones: [
          { t: 'SABA solo por MDI cada 20 min ×3 y esteroides orales; UCI si la PaCO₂ final es <42', porque: `Eso es la leve-moderada, y el criterio de UCI es PaCO₂ ≥42 (${p(21)}); infratratarías al grave y mandarías a casa al retenedor.` },
          { t: 'SABA + ipratropio por nebulizador cada 20 min ×3 o continuo 1 h, más esteroides IV; UCI con PaCO₂ final ≥42', ok: true },
          { t: 'SABA + ipratropio cada 60 min ×3 y alta si el PEFR llega al 40-69 % sostenido durante 60 minutos tras el tratamiento', porque: `Eso es la reevaluación de la respuesta incompleta, y el alta exige PEFR ≥70 % sostenido (${p(21)}).` }],
        explicacion: `Grave (PEFR <40 %): SABA + ipratropio por nebulizador cada 20 min ×3 o continuo 1 h + esteroides IV; evaluación final: PaCO₂ <42 = incompleta (alta o ingreso), <span class="hl-rojo">PaCO₂ ≥42 = pobre, UCI</span> (${p(21)}).` + enFicha('nep-algoritmo') },
      { id: 'as2-e4', corto: 'mantenimiento del ingreso', tipo: 'test', fuente: 'nep-regimenes · nep-tabla-23-2',
        enunciado: 'Eulalia mejora y pasa a planta. ¿Qué dice Marino del albuterol, el ipratropio y el esteroide?',
        opciones: [
          { t: 'Albuterol cada 4-6 horas, ipratropio fuera y esteroide diario hasta la resolución o 7-10 días', ok: true },
          { t: 'Albuterol continuo mientras esté ingresada, ipratropio cada 4 horas y esteroide en descenso', porque: `El mantenimiento es cada 4-6 h, el ipratropio no se continúa tras el ingreso y el ciclo de 10 días no precisa descenso (${p(22)}, ${p(23)}).` },
          { t: 'Todo igual hasta el alta, porque el esteroide tarda 12 horas en actuar y no conviene cambiar la pauta en las primeras 24 horas del ingreso', porque: `Esas 12 horas son el retraso del efecto, no una razón para mantener ipratropio ni albuterol agresivo (${p(23)}).` }],
        explicacion: `Mantenimiento: albuterol cada 4-6 h; <span class="hl-rojo">no continuar el ipratropio</span> tras el ingreso; esteroide diario durante 7-10 días sin pauta descendente (${p(22)}-${p(23)}).`,
        nota: `<b>Las fuentes discrepan:</b> el albuterol de mantenimiento es 2,5-5 mg o 4-8 puffs en el texto (${p(20)}) y 2,5 mg o 2 puffs en la Tabla 23.2 (${p(22)}); se muestran las dos.` + enFicha('nep-tabla-23-2') },
    ],
    profundizar: [
      { id: 'neumo-nota-albuterol-mantenimiento', titulo: 'Nota de fuentes: albuterol de mantenimiento, texto frente a Tabla 23.2' },
      { id: 'neumo-nota-esteroides-duracion', titulo: 'Nota de fuentes: duración de los esteroides, texto frente a Tabla 23.2' },
    ],
    casos: [
      { id: 'c-asma-2', titulo: 'Eulalia, 27 años: en la UCI, hasta la puerta del tubo', corto: 'Caso · Eulalia (UCI)', sub: 'continúa en urgencias; termina al decidir intubar',
        paciente: { Edad: '27 años, mujer', Peso: '60 kg, 1,62 m (PBW 54 kg)', Antecedentes: 'asma', Motivo: 'asma casi fatal: PaCO₂ 42 tras tres nebulizaciones' },
        pasos: [
          { momento: '00:30 · ingreso en UCI', datos: { PEFR: '30 % del predicho', 'PaCO₂': '42 mmHg', FR: '30', Tratamiento: '3 nebulizaciones de albuterol' }, nuevo: ['PaCO₂'],
            pregunta: { id: 'as2-c1', tipo: 'test', fuente: 'nep-paco2-42', origen: 'ficha; las cifras de Eulalia, del caso',
              enunciado: 'Llega con FR 30 y PaCO₂ 42 tras tres nebulizaciones. El residente propone pasarla a planta porque "la PaCO₂ es normal". ¿Qué le dices?',
              opciones: [
                { t: 'Que con esa ventilación minuto una PaCO₂ de 42 es retención de CO₂: obstrucción grave, a la UCI', ok: true },
                { t: 'Que la PaCO₂ se considera controlada solo por debajo de 35, y 42 es una respuesta incompleta que se resuelve con una cuarta nebulización en planta', porque: `La Fig. 23.3 llama pobre a la PaCO₂ ≥42 y la manda a la UCI (${p(21)}); otra nebulización en planta retrasaría el soporte a una paciente que se agota.` },
                { t: 'Que sí es normal, pero con el PEFR en 30 % conviene observarla seis horas más en planta con corticoide oral', porque: `Con PaCO₂ ≥42 la respuesta es pobre y el algoritmo ingresa en UCI (${p(21)}); el corticoide oral tarda horas y la paciente puede agotarse antes.` }],
              explicacion: `La Fig. 23.3 manda a la UCI la respuesta pobre con PaCO₂ ≥42 (${p(21)}).` + enFicha('nep-paco2-42') } },
          { momento: '03:15 · la pauta, 2 h 30 min después', datos: { Albuterol: 'continuo 10 mg/h', Ipratropio: '0,5 mg/h añadido', Metilprednisolona: '60 mg IV' }, nuevo: ['Albuterol', 'Ipratropio', 'Metilprednisolona'],
            pregunta: { id: 'as2-c2', tipo: 'test', fuente: 'nep-ipratropio · nep-tabla-23-2', origen: 'ficha: las dosis están en la Tabla 23.2; la paciente es inventada',
              enunciado: 'Sigue grave, sin mejoría, ya ingresada en la UCI. De la pauta (albuterol continuo, ipratropio, metilprednisolona), ¿cuál tiene su límite en horas y se retira al ingresar?',
              opciones: [
                { t: 'La metilprednisolona, porque tarda 12 horas, no ha influido todavía y se puede reintroducir si hay recaída', porque: `Tarda hasta 12 h, pero es un pilar del manejo (${p(23)}); suspenderla por no haber efecto aún sería quitarlo antes de que actúe.` },
                { t: 'El albuterol continuo: pasar a 2,5 mg cada 4-6 horas', porque: `El continuo tiene tope de 3 h en la Tabla 23.2 y no se "retira": pasa a mantenimiento al mejorar (${p(20)}, ${p(22)}); cambiarlo ahora con la paciente grave la dejaría con menos broncodilatador.` },
                { t: 'El ipratropio: beneficio solo en las primeras 3-4 horas y se retira al ingresar', ok: true }],
              explicacion: `<span class="hl-rojo">El ipratropio se discontinúa en el paciente que ingresa</span>: no tiene beneficio demostrado más allá de las primeras horas (${p(23)}).` + enFicha('nep-ipratropio') } },
          { momento: '04:30 · analítica y plan', datos: { K: '2,9 mEq/L', Lactato: '3,5 mmol/L', FC: '130', Plan: 'cuatro líneas del residente' }, nuevo: ['K', 'Lactato', 'FC', 'Plan'],
            pregunta: { id: 'as2-c3', tipo: 'error', fuente: 'nep-efectos-secundarios · nep-ipratropio', modeloVivo: rc('bronquio', '💉 Albuterol: por qué el K baja y el lactato sube'), origen: 'ficha; las cifras de Eulalia, del caso',
              enunciado: 'Plan del residente con K 2,9 y lactato 3,5. Hay dos errores. Encuéntralos.',
              frases: [
                { t: 'El potasio bajo es un desplazamiento hacia las células por el albuterol, mediado por receptores β.' },
                { t: 'El lactato de 3,5 indica shock: pido ecografía y un bolo de volumen.', mal: true, c: `La fuente probable del lactato es un aumento de la tasa metabólica por el SABA, no el metabolismo anaeróbico (${p(22)}).` },
                { t: 'La taquicardia de 130 y el temblor son efectos esperables del aerosol agresivo.' },
                { t: 'Dejo el ipratropio cada 4 horas durante todo el ingreso.', mal: true, c: `El ipratropio solo tiene beneficio las primeras horas y debe retirarse en quien ingresa (${p(23)}).` }],
              explicacion: 'Dos errores: tratar como shock un lactato probablemente metabólico por β y mantener el ipratropio.',
              nota: `K bajo y lactato alto son efectos de los SABA a dosis altas (${p(22)}).` + enFicha('nep-efectos-secundarios') } },
          { momento: '06:45 · dos horas sin mejoría', datos: { 'Tiempo sin mejoría': '2 h', Tratamiento: 'albuterol, ipratropio y esteroide' }, nuevo: ['Tiempo sin mejoría'],
            pregunta: { id: 'as2-c4', tipo: 'test', fuente: 'nep-magnesio', origen: 'ficha',
              enunciado: 'Tras dos horas sin mejoría con los tres fármacos, ¿qué añades?',
              opciones: [
                { t: 'Duplicar la metilprednisolona a 120 mg para acelerar el efecto', porque: `No hay curva dosis-respuesta y el efecto tarda hasta 12 h (${p(23)}); aumentar la dosis no acorta ese plazo.` },
                { t: 'Sulfato de magnesio nebulizado 150 mg', porque: `El inhalado ha dado resultados inconsistentes y no se aconseja (${p(24)}).` },
                { t: 'Sulfato de magnesio 2 g IV en 15-30 minutos', ok: true }],
              explicacion: `Con respuesta no satisfactoria a albuterol, ipratropio y esteroides: <span class="hl-azul">MgSO₄ 2 g IV en 15-30 min</span> (${p(24)}).` + enFicha('nep-magnesio') } },
          { momento: '08:00 · el giro', datos: { Conciencia: 'somnolienta', 'PaCO₂': '58 mmHg', Soporte: 'tras 1 h de BiPAP' }, nuevo: ['Conciencia', 'PaCO₂', 'Soporte'],
            pregunta: { id: 'as2-c5', tipo: 'test', fuente: 'nep-vni-asma', origen: 'ficha: la conducta; las cifras de Eulalia, del caso',
              enunciado: 'Está somnolienta y la PaCO₂ es 58 mmHg después de una hora de BiPAP. ¿Qué haces?',
              opciones: [
                { t: 'Subir la presión de la BiPAP y repetir la gasometría en 6 horas', porque: `La BiPAP no ha bajado la PCO₂ y ahora hay somnolencia; esperar 6 horas deja avanzar la hipercapnia (${p(24)}).` },
                { t: 'Cambiar a O₂ nasal de alto flujo a 60 L/min para corregir la hipoxemia', porque: `El problema es la ventilación (CO₂ al alza), no la oxigenación; el HFNO no la corrige (${p(24)}).` },
                { t: 'Intubar: la BiPAP no ha conseguido bajar la PaCO₂', ok: true }],
              explicacion: `<span class="hl-rojo">El fracaso de la BiPAP en reducir la PaCO₂</span> es a menudo indicación de intubar y ventilar (${p(24)}-${p(25)}).` + enFicha('nep-vni-asma') } },
          { momento: '08:15 · antes del tubo', datos: { Decisión: 'intubar', Peso: '60 kg (PBW 54)', Pendiente: 'sedación una vez conectada al respirador' }, nuevo: ['Decisión', 'Pendiente'],
            pregunta: { id: 'as2-c6', tipo: 'test', fuente: 'nep-ketamina', modeloVivo: pl('eulalia-ajustada', '🫁 Eulalia con menos FR: el aire atrapado baja'), origen: 'ficha: la dosis; la paciente es inventada',
              enunciado: 'Una vez conectada al respirador, sigue el asma refractaria. Para bajar la FR y el atrapamiento de aire, ¿qué ketamina pautas?',
              opciones: [
                { t: 'Infusión de ketamina de 0,15-0,25 mg/kg/min, sin carga previa, durante 1-5 horas', porque: `La infusión de Marino es por hora, no por minuto (${p(24)}); en minutos serían 60 veces más dosis y la paciente tendría disforia y alucinaciones intensas.` },
                { t: 'Ketamina: carga de 0,1-0,2 mg/kg y luego 0,15-0,25 mg/kg/h', ok: true },
                { t: 'Una sedación ligera que deje la FR espontánea alta, para seguir lavando CO₂ con más respiraciones', porque: `Una FR alta acorta la espiración y aumenta el atrapamiento de aire; sedar sirve para bajarla (${p(24)}), y la paciente seguiría hiperinsuflándose.` }],
              explicacion: `Menos FR = <span class="hl-azul">menos atrapamiento de aire</span>; la ketamina aporta además cierta broncodilatación: carga 0,1-0,2 mg/kg y 0,15-0,25 mg/kg/h durante 1-5 h (${p(24)}). Al conectarla, el problema pasa a ser el aire atrapado: sigue en la ficha «PEEP oculta».` + enFicha('nep-ketamina') } },
        ],
        lleva: [
          'Una PaCO₂ de 42 frente a una ventilación minuto alta es retención de CO₂: UCI.' + enFicha('nep-paco2-42'),
          'Los β₂ a dosis altas bajan el K y suben el lactato sin shock; el ipratropio y el esteroide tienen su tiempo.' + enFicha('nep-efectos-secundarios'),
          'Si la BiPAP no baja la PaCO₂, se intuba, y sedar baja la FR y el aire atrapado.' + enFicha('nep-vni-asma')],
        volver: { nombre: 'Por qué una PaCO₂ de 42 manda a la UCI', ancla: 'nep-paco2-42', modelo: pl('eulalia-ajustada', '🫁 Eulalia con menos FR: el aire atrapado baja') } },
    ],
  },
};

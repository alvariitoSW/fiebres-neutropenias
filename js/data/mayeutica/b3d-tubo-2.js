// Mayéutica del bloque 3D, G5: ficha 15 neumo-cuidado-barotrauma (caso de Rafael, día 2: sigue de la ficha de modos del respirador,
// con meseta 44, SpO₂ 89 % y PA 84/50). Marino cap. 28, págs. 23-31 del PDF caps27-30. Formato: cabecera de b1-fluidos.js.
// Las cifras del neumotórax a tensión (PAM ≈59 mmHg con 10,5 cmH₂O de aire pleural) son las del monitor de la app (guía del estado
// neumotorax-tension en pulmon-vivo-data.js), ilustrativas; las demás de Rafael son del caso.
const PDF = 'docs/marino-2024-respiratory-management-caps27-30.pdf';
const p = n => `<a class="biblio-link" href="${PDF}#page=${n}" target="_blank" rel="noopener">pág. ${n}</a>`;
const NEU = 'data-especialidad="neumologia" data-view="merinoNeumologia" data-panel="panel-merino-neumo-tabs"';
const enFicha = (tab, id) => ` <button type="button" class="may-ir" ${NEU} data-tab="${tab}" data-resaltar="#${id}">Ver en la ficha ↗</button>`;
const CB = 'neumo-cuidado-barotrauma';
const pv = (estado, texto) => ({ pulmonVivo: estado, texto });
const ok = t => ({ t, ok: true });
const no = (t, porque) => ({ t, porque });
const ILU = 'ilustrativo: las cifras de Rafael son del caso; la regla, de la ficha';

export const MAYEUTICA_TUBO_2 = {
  [CB]: {
    entrada: 'No se aspira por horario ni con salino; el aire que escapa del alvéolo se ve en el cuello y, en supino, en la base; sin deslizamiento se sospecha, el punto pulmonar confirma y el tensión se pincha ya.',
    guia: [
      { id: 'baro-g1', corto: 'aspirar', tipo: 'test', fuente: 'nep-aspiracion',
        enunciado: 'Una práctica estándar es aspirar las secreciones del intubado. Antes de leer: ¿qué efectos desfavorables tiene y qué recomiendan las guías?',
        opciones: [
          no('Solo baja algo la SpO₂; las guías recomiendan aspirar de forma programada para evitar el biofilm, cada 4 a 6 horas en todo ventilado', `Además sube la FC, la PA, la PIC y la PEEP oculta, y el catéter puede arrastrar el biofilm del tubo; las guías no recomiendan aspirar de rutina (${p(23)}).`),
          ok('Sube la FC, la PA, la PIC y la PEEP oculta, baja la SpO₂ y puede inocular el biofilm del tubo; no se aspira de rutina'),
          no('Sube la FC y la PA, pero no la PIC; el biofilm no se movilizaría, así que la aspiración rutinaria es segura', `Sube también la presión intracraneal y el catéter puede desprender el biofilm; por eso las guías no la recomiendan de rutina (${p(23)}).`)],
        explicacion: `Aspirar sube <span class="hl-rojo">FC, PA, PIC y PEEP oculta</span> y baja la SpO₂; el catéter puede arrastrar el <span class="hl-rojo">biofilm</span> del tubo (Figura 28.4) y las guías no recomiendan la aspiración rutinaria (${p(23)}).` + enFicha(CB, 'nep-aspiracion') },
      { id: 'baro-g2', corto: 'cuándo aspirar', tipo: 'test', fuente: 'nep-indicaciones-aspiracion',
        enunciado: 'Si solo se aspira cuando hay evidencia de secreciones, ¿cuáles son los mejores indicadores?',
        opciones: [
          no('Una caída brusca de la oxigenación y una atelectasia segmentaria en la radiografía', `Son indicaciones posibles, pero no las mejores: pueden deberse a otras causas distintas de las secreciones (${p(23)}).`),
          ok('Secreciones visibles en los tubos, secreciones en la auscultación y un patrón de dientes de sierra en la curva de flujo'),
          no('El aumento de la presión pico y de la frecuencia respiratoria, aunque no se vean secreciones, porque indican retención de secreciones aunque no se vean ni se oigan', `Los mejores indicadores son las secreciones visibles, la auscultación y el patrón de dientes de sierra del flujo (${p(23)}).`)],
        explicacion: `Mejores indicadores: <span class="hl-azul">secreciones visibles, auscultación y dientes de sierra</span> en el flujo; atelectasia segmentaria o caída brusca de la oxigenación son otras posibles (${p(23)}).` + enFicha(CB, 'nep-indicaciones-aspiracion') },
      { id: 'baro-g3', corto: 'el salino', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'nep-salino · nep-viscosidad',
        enunciado: 'Instilar salino para «fluidificar» fue estándar. ¿Por qué no fluidifica, qué riesgo tiene y qué sí rompe la viscosidad?',
        puntos: [
          `La capa que da viscosidad es <span class="hl-azul">hidrofóbica</span>, de mucoproteínas unidas por puentes disulfuro: el salino sobre ella es como agua sobre grasa (${p(24)}).`,
          `5 mL de salino pueden desprender hasta <span class="hl-rojo">300.000 colonias</span> de bacterias del interior del tubo (${p(24)}).`,
          `La <span class="hl-verde">N-acetilcisteína</span> rompe esos puentes disulfuro y sí fluidifica (${p(25)}).`],
        explicacion: `El salino ni reduce la viscosidad ni es inocuo para el biofilm; el mucolítico adecuado es la NAC (${p(24)}-${p(25)}).` + enFicha(CB, 'nep-viscosidad') },
      { id: 'baro-g4', corto: 'NAC en aerosol', tipo: 'test', fuente: 'nep-tabla-28-1', origen: 'ficha: Tabla 28.1',
        enunciado: 'Antes de mirar la Tabla 28.1: ¿cómo se da la NAC en aerosol y con qué advertencia?',
        opciones: [
          no('Solución al 20 %, 5 mL sin diluir en nebulizador cada 4 h; segura en asmáticos, y es la forma de elección en el paciente ventilado de forma prolongada', `El aerosol es al 10 %, mezclando 2,5 mL de NAC con 2,5 mL de suero, y se repite cada 8 h; en asmáticos no se recomienda (${p(25)}).`),
          ok('Solución al 10 %: 2,5 mL de NAC con 2,5 mL de suero en nebulizador, repetible cada 8 h; no se recomienda en asmáticos'),
          no('Solución al 10 %, 2,5 mL + 2,5 mL de suero, cada 8 h; buena opción en asmáticos porque también broncodilata', `El aerosol de NAC es irritante y puede provocar tos y broncoespasmo, sobre todo en asmáticos (${p(25)}).`)],
        explicacion: `Aerosol: <span class="hl-azul">NAC al 10 %, 2,5 + 2,5 mL</span>, cada 8 h; <span class="hl-rojo">irritante, puede dar broncoespasmo</span> y no se recomienda en asmáticos (${p(25)}, Tabla 28.1).` + enFicha(CB, 'nep-tabla-28-1') },
      { id: 'baro-g5', corto: 'volutrauma y barotrauma', tipo: 'test', fuente: 'nep-barotrauma', modelo: pv('volutrauma', '🫁 Isidro con Vt de 600: el volutrauma'),
        enunciado: 'Volutrauma y barotrauma se confunden. Según Marino, ¿qué es cada uno?',
        opciones: [
          no('Son sinónimos: los dos nombran el escape de gas desde los alvéolos', `No lo son: el escape de gas es el barotrauma; el volutrauma es la rotura de la interfaz alveolo-capilar por sobredistensión (${p(25)}).`),
          no('El barotrauma expresa la deformación del alvéolo y el volutrauma la presión transpulmonar', `Es al revés: el volutrauma expresa la deformación (strain) y el barotrauma el estrés, la presión transpulmonar (${p(25)}).`),
          ok('Volutrauma: deformación del alvéolo por sobredistensión; barotrauma: escape de gas, que expresa el estrés')],
        explicacion: `<span class="hl-purpura">Volutrauma = strain</span> (deformación): rompe la interfaz alveolo-capilar y da un infiltrado parecido al SDRA. <span class="hl-purpura">Barotrauma = stress</span> (presión transpulmonar): el gas escapa de los alvéolos (${p(25)}).` + enFicha(CB, 'nep-barotrauma') },
      { id: 'baro-g6', corto: 'adónde va el gas', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'nep-presentacion-baro',
        enunciado: 'El gas escapa de un alvéolo roto en un ventilado. ¿Por dónde se abre paso y cómo termina?',
        puntos: [
          `Disecciona los planos de tejido: <span class="hl-azul">enfisema intersticial</span>, y puede pasar al mediastino (${p(25)}).`,
          `Del mediastino sube al cuello (<span class="hl-azul">enfisema subcutáneo</span>) o baja bajo el diafragma (<span class="hl-azul">neumoperitoneo</span>) (${p(25)}).`,
          `Si se rompe la pleura visceral, el gas se acumula en la pleura: <span class="hl-rojo">neumotórax</span>; cada entidad puede aparecer sola o junta (${p(25)}).`],
        explicacion: `Del alvéolo al intersticio, al mediastino y de ahí al cuello, al abdomen o a la pleura (${p(25)}).` + enFicha(CB, 'nep-presentacion-baro') },
      { id: 'baro-g7', corto: 'signo del neumotórax', tipo: 'test', fuente: 'nep-neumo-clinica',
        enunciado: 'Sospechas un neumotórax por barotrauma en un ventilado. ¿Qué hallazgo clínico es el más específico y cuál es poco fiable?',
        opciones: [
          no('El más específico es la ausencia de ruidos respiratorios; el poco fiable, el enfisema del cuello, porque el tubo y el ventilador transmiten sonidos fáciles de reconocer', `Es justo al revés: la ausencia de ruidos es poco fiable porque el tubo y la tubuladura transmiten sonidos que se confunden con ruidos del pulmón (${p(26)}).`),
          ok('El más específico es el enfisema subcutáneo, que empieza en el cuello y el tórax alto; la ausencia de ruidos es poco fiable'),
          no('El más específico es la hipotensión; el poco fiable, el enfisema subcutáneo, que aparece al final', `El enfisema subcutáneo es el hallazgo más específico y aparece primero en el cuello y el tórax superior; la hipotensión aparece si hay tensión (${p(26)}-${p(27)}).`)],
        explicacion: `<span class="hl-rojo">Enfisema subcutáneo</span> (cuello y tórax superior al inicio): el hallazgo más específico. Los ruidos respiratorios ausentes son <span class="hl-azul">poco fiables</span> en el ventilado (${p(26)}).` + enFicha(CB, 'nep-neumo-clinica') },
      { id: 'baro-g8', corto: 'sliding en la eco', tipo: 'test', fuente: 'nep-eco-pleural', origen: 'ficha',
        enunciado: 'Pones una sonda lineal en el tórax anterior para buscar un neumotórax. ¿Dónde la colocas y qué conclusión permite ver el deslizamiento pulmonar?',
        opciones: [
          no('En el 3.º-4.º espacio intercostal, línea medioclavicular; ver deslizamiento sugiere neumotórax pequeño', `Ver el deslizamiento pleural, al revés, descarta el neumotórax (${p(26)}).`),
          ok('En el 3.º-4.º espacio, línea medioclavicular, perpendicular a la pared: ver el deslizamiento descarta el neumotórax'),
          no('En el 5.º espacio, línea axilar media, en posición oblicua: ver el deslizamiento solo lo hace menos probable', `La sonda lineal va perpendicular en el 3.º-4.º espacio medioclavicular, y con deslizamiento presente el diagnóstico queda descartado (${p(26)}).`)],
        explicacion: `Sonda lineal <span class="hl-azul">perpendicular, 3.º-4.º espacio, línea medioclavicular</span>: la línea pleural brilla y se desliza. El <span class="hl-verde">deslizamiento presente descarta</span> el neumotórax (${p(26)}).` + enFicha(CB, 'nep-eco-pleural') },
      { id: 'baro-g9', corto: 'plan de la tensión', tipo: 'error', fuente: 'nep-neumotorax-tension · nep-descompresion', origen: ILU, modelo: pv('neumotorax-tension', '🫁 Rafael: deja pasar respiraciones y descomprime'),
        enunciado: 'Un residente apunta cómo descomprimir un neumotórax a tensión. Hay dos errores. Encuéntralos.',
        frases: [
          { t: 'Es una emergencia médica: descomprimo de inmediato.' },
          { t: 'Uso un catéter de 5 cm en el 2.º espacio intercostal, línea medioclavicular.', mal: true, c: `Se recomienda un angiocatéter 14 G de 8 cm en el 5.º espacio, justo por delante de la línea axilar media; con catéteres cortos y en el 2.º espacio el fracaso es mayor (${p(29)}).` },
          { t: 'Si el catéter se acoda o no llega a la pleura, repito la aguja las veces que haga falta.', mal: true, c: `Si la aguja no funciona, se recomienda la descompresión con el dedo (dedo en el espacio pleural) (${p(29)}).` },
          { t: 'Tras descomprimir, dejo un tubo torácico de calibre fino.' }],
        explicacion: 'Dos errores: el sitio y el catéter corto, y insistir con la aguja cuando falla.',
        nota: 'La cifra de 5 cm del catéter es ilustrativa: la fuente solo dice «más corto» (pág. 29).' + enFicha(CB, 'nep-descompresion') },
      { id: 'baro-g10', corto: 'tubo torácico', tipo: 'test', fuente: 'nep-tubo-toracico',
        enunciado: 'Vas a evacuar aire de la pleura con un tubo torácico. ¿Por qué espacio entra y hacia dónde lo diriges?',
        opciones: [
          no('Por el 2.º-3.º espacio medioclavicular, dirigido hacia abajo para evacuar el aire', `Se entra por el 4.º-5.º espacio en la línea axilar media; hacia abajo se dirige para evacuar líquido, no aire (${p(29)}).`),
          ok('Por el 4.º-5.º espacio, línea axilar media, avanzando hacia delante y arriba para el aire'),
          no('Por el 4.º-5.º espacio, línea axilar media, avanzando hacia abajo para el aire', `Hacia abajo se evacua el líquido; para el aire, el tubo va hacia delante y arriba (${p(29)}).`)],
        explicacion: `Entrada por el <span class="hl-azul">4.º o 5.º espacio, línea axilar media</span>; <span class="hl-azul">anterior y superior para el aire</span>, inferior para el líquido (${p(29)}).` + enFicha(CB, 'nep-tubo-toracico') },
      { id: 'baro-g11', corto: 'las tres cámaras', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'nep-fig-28-8 · nep-sello-agua',
        enunciado: 'En el sistema de drenaje de tres cámaras: ¿qué hace cada una?',
        puntos: [
          `La primera <span class="hl-azul">recoge el líquido</span> y deja pasar el aire; su entrada no toca el líquido, así que no hace contrapresión (${p(30)}).`,
          `La segunda es el <span class="hl-azul">sello de agua</span>: una columna de unos 2 cm que es una válvula unidireccional y evita que entre aire (${p(30)}).`,
          `La tercera <span class="hl-azul">regula la succión</span> de la pared; suele fijarse en −20 cmH₂O (${p(30)}).`],
        explicacion: `Líquido, válvula de agua y succión regulada (${p(30)}).` + enFicha(CB, 'nep-fig-28-8') },
    ],
    examen: [
      { id: 'baro-e1', corto: 'burbujeo', tipo: 'test', fuente: 'nep-sello-agua',
        enunciado: 'En el drenaje torácico de un paciente aparecen burbujas en la cámara del sello de agua. ¿Qué indican?',
        opciones: [
          no('Que el sello está roto y entra aire del exterior hacia la pleura y, con ello, deja pasar el aire de fuera hacia el espacio pleural', `El sello de agua es una válvula unidireccional que impide la entrada de aire; las burbujas son aire que sale de la pleura (${p(30)}).`),
          no('Que la succión está demasiado baja y no evacúa el líquido', `Las burbujas no hablan de líquido: el aire evacuado de la pleura pasa por el agua y burbujea (${p(30)}).`),
          ok('Aire que sale de la pleura: evidencia de una fístula broncopleural, un agujero en el pulmón')],
        explicacion: `<span class="hl-rojo">Burbujas en el sello = aire que escapa por una fístula broncopleural</span> (${p(30)}).` + enFicha(CB, 'nep-sello-agua') },
      { id: 'baro-e2', corto: 'calibre del tubo', tipo: 'test', fuente: 'nep-descompresion',
        enunciado: 'Acabas de descomprimir un neumotórax a tensión. ¿Qué colocas a continuación?',
        opciones: [
          no('Nada más: la aguja de 14 G basta como tratamiento definitivo', `Tras descomprimir hay que colocar un tubo torácico fino; la aguja no es definitiva (${p(29)}).`),
          ok('Un tubo torácico de calibre fino, de 8,5 a 14 French'),
          no('Un tubo torácico grueso, de 28 a 36 French', `La fuente indica un tubo de calibre fino, de 8,5 a 14 French (${p(29)}).`)],
        explicacion: `Después de descomprimir: <span class="hl-azul">tubo torácico de 8,5-14 Fr</span> (${p(29)}).` + enFicha(CB, 'nep-descompresion') },
      { id: 'baro-e3', corto: 'sin sliding', tipo: 'test', fuente: 'nep-eco-pleural',
        enunciado: 'La ecografía de un ventilado no muestra deslizamiento pleural. ¿Cuánto vale ese hallazgo por sí solo?',
        opciones: [
          no('Es patognomónico: confirma el neumotórax con una sola imagen, sin repetir la exploración ni buscar nada más', `Es sugestivo, no patognomónico; el patognomónico es el punto pulmonar (${p(26)}-${p(27)}).`),
          ok('Sugiere el neumotórax pero no lo confirma; se busca el punto donde el deslizamiento reaparece'),
          no('No tiene valor: solo el deslizamiento presente informa', `Su ausencia es sugestiva de neumotórax y obliga a buscar el punto pulmonar (${p(26)}).`)],
        explicacion: `La <span class="hl-azul">ausencia de deslizamiento</span> es sugestiva pero no patognomónica (${p(26)}).` + enFicha(CB, 'nep-eco-pleural') },
      { id: 'baro-e4', corto: 'NAC traqueal', tipo: 'test', fuente: 'nep-tabla-28-1', origen: 'ficha: Tabla 28.1',
        enunciado: 'Un paciente ventilado tiene secreciones espesas y vas a dar NAC por el tubo. ¿Qué pautas da la tabla para la inyección traqueal y qué vigilas?',
        opciones: [
          no('NAC al 10 %, 5 mL por el tubo cada 8 h; se vigila la tos, que es la misma pauta del nebulizador, sin diluir ni limitar los días', `La inyección traqueal es con NAC al 20 %, 1 mL de NAC con 1 mL de suero (2 mL), cada 8 h (${p(25)}).`),
          ok('NAC al 20 %: 1 mL con 1 mL de suero (2 mL) en la tráquea, cada 8 h; más de 48 h puede favorecer la broncorrea'),
          no('NAC al 20 %: 1 mL con 1 mL de suero (2 mL), cada 8 h; sin límite de duración', `Su uso prolongado, más de 48 horas, puede favorecer la broncorrea (${p(25)}).`)],
        explicacion: `Inyección traqueal: <span class="hl-azul">NAC al 20 %, 1 + 1 mL</span>, cada 8 h; <span class="hl-rojo">>48 h puede dar broncorrea</span>; en el ventilado se prefiere a la forma en aerosol (${p(25)}).` + enFicha(CB, 'nep-tabla-28-1') },
      { id: 'baro-e5', corto: 'incidencia', tipo: 'test', fuente: 'nep-neumotorax',
        enunciado: 'En ventilados con ventilación protectora, ¿qué incidencia de neumotórax da la fuente, y qué otras causas hay además del barotrauma?',
        opciones: [
          no('Del 35 % con ventilación protectora; la causa única es el barotrauma', `El 35 % se refiere a la neumonía por COVID-19 (modo de ventilación desconocido); con ventilación protectora es de 3 a 10 %, y los procedimientos también causan neumotórax (${p(25)}-${p(26)}).`),
          ok('Del 3 al 10 %; también se producen por procedimientos: catéteres centrales, toracocentesis, broncoscopia'),
          no('Menos del 1 %; los procedimientos no la causan si se hacen con ecografía y el barotrauma casi no existe con la ventilación actual', `La incidencia es de 3-10 % en ventilación protectora y los procedimientos son causa conocida de neumotórax (${p(25)}-${p(26)}).`)],
        explicacion: `Incidencia <span class="hl-azul">3-10 %</span> con ventilación protectora; se ha comunicado un <span class="hl-azul">35 %</span> en COVID-19. También por catéteres centrales, toracocentesis y broncoscopia (${p(25)}-${p(26)}).` + enFicha(CB, 'nep-neumotorax') },
    ],
    casos: [
      { id: 'c-baro-rafael', titulo: 'Rafael, 52 años: el aire que no se ve', corto: 'Caso · Rafael (barotrauma)', sub: 'politrauma ventilado, día 2: de la caída de compliance al drenaje',
        paciente: { Edad: '52 años, varón', Talla: '1,80 m (PBW 75 kg)', Motivo: 'politrauma, intubado (tubo 8, a 23 cm)', Ventilador: 'VCV 500 mL, FR 14, PEEP 5' },
        pasos: [
          { momento: 'Día 2 · mañana', datos: { Meseta: '44 cmH₂O', 'SpO₂': '89 %', PA: '84/50 mmHg' }, nuevo: ['Meseta', 'SpO₂', 'PA'],
            pregunta: { id: 'baro-c1', tipo: 'error', fuente: 'nep-salino · nep-neumo-clinica', origen: ILU,
              enunciado: 'El residente de guardia apunta su plan de la mañana para Rafael. Hay dos errores. Encuéntralos.',
              frases: [
                { t: 'Aspiro solo si veo secreciones o un patrón de dientes de sierra en la curva de flujo.' },
                { t: 'Instilo 5 mL de suero salino cada 4 horas para fluidificar las secreciones.', mal: true, c: `El salino rutinario no se recomienda: no reduce la viscosidad y arrastra gérmenes del biofilm del tubo (${p(24)}).` },
                { t: 'La auscultación es simétrica, así que descarto un neumotórax.', mal: true, c: `En el ventilado los ruidos del tubo y de la tubuladura se confunden con los del pulmón: la auscultación es poco fiable y una simétrica no descarta el neumotórax (${p(26)}).` },
                { t: 'Vigilo la saturación y la FC mientras aspiro.' }],
              explicacion: 'Dos errores: el salino de rutina y fiarse de la auscultación para descartar el neumotórax.',
              nota: 'La frecuencia de 4 horas es del caso; la fuente solo dice que no se instila de rutina.' + enFicha(CB, 'nep-salino') } },
          { momento: 'Día 2 · radiografía', datos: { 'Rx portátil supina': 'sin línea pleural visible', Meseta: '44 cmH₂O' }, nuevo: ['Rx portátil supina'],
            pregunta: { id: 'baro-c2', tipo: 'destapa', cuantas: 'son tres cosas', fuente: 'nep-rx-supino · nep-fig-28-5', origen: ILU,
              enunciado: 'La radiografía portátil de Rafael, tumbado, no muestra línea pleural. ¿Descarta el neumotórax? Piensa dónde se junta el aire.',
              puntos: [
                `En supino el aire <span class="hl-azul">no sube al vértice</span> (${p(26)}).`,
                `Se junta en la región más alta del hemitórax: <span class="hl-rojo">anterior, delante de las dos bases</span>; las colecciones basales y subpulmónicas son las características (${p(26)}).`,
                `La Figura 28.5 lo muestra: neumotórax anterior visible en la TC y no en la radiografía; la <span class="hl-verde">eco</span> es más sensible que la placa (${p(26)}-${p(27)}).`],
              explicacion: `Una placa supina sin línea pleural no descarta el neumotórax: hay que buscar el aire basal y anterior, o ir a la eco (${p(26)}-${p(27)}).` + enFicha(CB, 'nep-rx-supino') } },
          { momento: 'Día 2 · ecografía', datos: { 'Eco pulmonar': 'sin deslizamiento; al mover la sonda lateral e inferior reaparece' }, nuevo: ['Eco pulmonar'],
            pregunta: { id: 'baro-c3', tipo: 'test', fuente: 'nep-eco-pleural', origen: 'ficha: el punto pulmonar; el hallazgo en Rafael es del caso',
              enunciado: 'En Rafael desaparece el deslizamiento y, al mover la sonda lateral e inferiormente, reaparece en un punto. ¿Qué has encontrado?',
              opciones: [
                no('Un artefacto de la sonda; hay que repetir con otra y esperar a la radiografía', `Ese punto es el borde del neumotórax, el punto pulmonar, y es patognomónico (${p(27)}).`),
                ok('El punto pulmonar: el borde del neumotórax, patognomónico del diagnóstico'),
                no('Un deslizamiento normal, que descarta el neumotórax', `Si el deslizamiento reaparece solo en un punto, ese punto marca dónde vuelven a tocarse las pleuras: el borde del neumotórax (${p(27)}).`)],
              explicacion: `El <span class="hl-rojo">punto pulmonar</span> es donde las dos pleuras vuelven a contactar y reaparece el deslizamiento; es patognomónico (${p(27)}).` + enFicha(CB, 'nep-eco-pleural') } },
          { momento: 'Día 2 · giro: se hunde', datos: { PAM: '≈59 mmHg (monitor del modelo, ilustrativo)', Presiones: 'pico y meseta siguen subiendo', Aire: 'el pulmón del lado afectado, colapsado' }, nuevo: ['PAM', 'Presiones', 'Aire'],
            pregunta: { id: 'baro-c4', tipo: 'test', fuente: 'nep-neumotorax-tension', origen: 'ficha: la urgencia; la PAM, ilustrativa del monitor del modelo', modelo: pv('neumotorax-tension', '🫁 Rafael: deja pasar respiraciones hasta el sello de shock (unas 5: aire pleural 10,5 cmH₂O, PAM ≈59)'),
              enunciado: 'Con el neumotórax confirmado, la PAM de Rafael cae a 59 y el pico y la meseta suben a cada respiración. ¿Qué haces?',
              opciones: [
                no('Pides una radiografía de control para confirmar antes de actuar y esperando a que suba la PAM por sí sola', `El neumotórax a tensión es una emergencia médica y requiere descompresión inmediata (${p(28)}-${p(29)}).`),
                ok('Descomprimes ya: una emergencia con shock obstructivo, que puede acabar en actividad eléctrica sin pulso'),
                no('Subes la PEEP y el volumen para mejorar la saturación mientras se prepara el tubo', `Más presión positiva añade aire a una pleura que ya lo retiene (${p(27)}-${p(28)}); que además empeore el gasto cardíaco es fisiología general.`)],
              explicacion: `Aire pleural a presión → colapso del pulmón, caída progresiva del gasto → <span class="hl-rojo">shock obstructivo</span> y, si no se trata, paro por AESP: se considera en todo ventilado con hipoxemia o hipotensión inexplicadas (${p(27)}-${p(28)}).`,
              nota: 'La PAM de 59 sale del monitor del modelo (aire pleural de 10,5 cmH₂O): ilustrativa; la fuente no da cifras.' + enFicha(CB, 'nep-neumotorax-tension') } },
          { momento: 'Día 4 · 48 h con el tubo', datos: { Tubo: '12 Fr', Succión: '−20 cmH₂O', 'Sello de agua': 'burbujea a cada ciclo', Evolución: '48 horas así' }, nuevo: ['Tubo', 'Succión', 'Sello de agua', 'Evolución'],
            pregunta: { id: 'baro-c5', tipo: 'test', fuente: 'nep-succion', origen: ILU,
              enunciado: 'A las 48 horas el drenaje de Rafael, con succión de −20, sigue burbujeando. ¿Qué haces?',
              opciones: [
                no('Subes la succión para evacuar la fístula y que el pulmón sane antes', `La presión negativa aumenta la presión transpulmonar y favorece el paso de aire por la fístula, que no cierra (${p(30)}-${p(31)}).`),
                ok('Apagas la succión: mantiene la fístula; el sello de agua sigue evacuando el aire que escapa'),
                no('Quitas el tubo, ya que si burbujea no está evacuando el aire', `Las burbujas son aire de la fístula que el tubo evacúa; apagar la succión es la medida, no retirar el tubo (${p(30)}-${p(31)}).`)],
              explicacion: `Si hay fuga persistente con succión, <span class="hl-rojo">se apaga la succión</span>: la presión negativa sube la presión transpulmonar y sostiene la fístula; el aire sigue saliendo cuando la presión pleural supera la del sello (${p(31)}).` + enFicha(CB, 'nep-succion') } },
        ],
        lleva: [
          'No se aspira por horario ni con salino: la mejor guía son las secreciones visibles y el patrón de dientes de sierra.' + enFicha(CB, 'nep-indicaciones-aspiracion'),
          'En supino el aire se junta delante de las bases; la eco con punto pulmonar confirma el neumotórax.' + enFicha(CB, 'nep-eco-pleural'),
          'Un neumotórax a tensión se descomprime ya; y si el drenaje burbujea con succión, se apaga la succión.' + enFicha(CB, 'nep-descompresion')],
        volver: { nombre: 'La descompresión del neumotórax a tensión', ancla: 'nep-descompresion', modelo: pv('neumotorax-tension', '🫁 Descomprimir a Rafael') } },
    ],
    profundizar: [
      { id: 'nep-fig-28-4', titulo: 'Figura 28.4: el biofilm del interior del tubo' },
      { id: 'nep-fig-28-6', titulo: 'Figura 28.6: la línea pleural en la ecografía' },
      { id: 'nep-fig-28-7', titulo: 'Figura 28.7: radiografía del neumotórax a tensión' },
    ],
  },
};

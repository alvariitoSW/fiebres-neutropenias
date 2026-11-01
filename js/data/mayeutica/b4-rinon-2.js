// Mayéutica de las fichas del bloque 4, grupo 4B (E2) · El riñón que falla (Marino cap. 34 y cap. 36):
// «FRA: fármacos, contraste y rabdomiólisis» (mr-fra-nefrotoxicos) y «Terapia de reemplazo renal» (mr-trr).
// La pinta js/core/mayeutica.js. Datos puros. Mismo formato que b1-fluidos.js.
//
// Toda la medicina sale de la ficha (js/modules/libros/marino-renal.html) y de su PDF:
//   A = docs/marino-2024-acido-base-renal-caps31-34.pdf (cap. 34, págs. 51-52 y 55-58 del PDF)
//   E = docs/marino-2024-electrolitos-caps35-38.pdf (cap. 36, págs. 26-29 del PDF; hiperpotasemia de Adela)
// Cada pregunta dice dónde con `fuente`. Los pacientes (Gregorio, Adela) se inventan; sus cifras de laboratorio son
// del caso y la medicina que se decide con ellas es la de la ficha. Cobertura: autonomo/bloques/b4/cobertura-anexo.md.

const IR = { especialidad: 'libros', view: 'marinoRenal', panel: 'panel-marino-renal-tabs' };
const filtro = (valor, texto) => ({ ...IR, tab: 'mr-trr', filtroVivo: valor, texto });
const rabdo = texto => ({ nefronaViva: 'rabdo', texto });

export const MAYEUTICA_RINON_2 = {
  /* =================================================================================================
     9 · FRA: fármacos, contraste y rabdomiólisis (A págs. 51-52)
     ================================================================================================= */
  'mr-fra-nefrotoxicos': {
    entrada: 'Qué fármacos lesionan el riñón y por qué mecanismo, cuándo el contraste es de verdad un riesgo, y cómo se reconoce y se trata la rabdomiólisis sin forzar la diuresis.',
    guia: [
      { id: 'rin-nt-g1', corto: 'cuatro mecanismos', tipo: 'test', fuente: 'mr-tabla-34-3',
        enunciado: 'Un residente apunta «los almidones y los aminoglucósidos dañan el riñón igual». Antes de mirar la tabla: ¿por qué mecanismo lesiona cada uno?',
        opciones: [
          { t: 'Los dos lesionan el túbulo directamente', porque: 'Eso solo vale para el aminoglucósido. Si tratas al almidón como un tóxico tubular, no pensarás en su verdadera lesión (la osmótica) cuando el paciente con almidones suba su creatinina.' },
          { t: 'Almidón: nefropatía osmótica; aminoglucósido: lesión tubular', ok: true },
          { t: 'Almidón: nefritis intersticial; aminoglucósido: cambio de la hemodinámica renal', porque: 'Los dos mecanismos están al revés: la nefritis intersticial es de antimicrobianos como penicilinas o vancomicina, y la hemodinámica la cambian AINE e IECA. Con ese mapa, buscarías la causa en el sitio equivocado.' }],
        explicacion: 'Tabla 34.3: <span class="hl">hemodinámica renal</span> (AINE; IECA, ARA-II, ciclosporina, tacrolimus), <span class="hl">nefropatía osmótica</span> (hidroxietilalmidones; manitol, inmunoglobulinas IV), <span class="hl">lesión tubular</span> (aminoglucósidos; anfotericina B, cisplatino) y <span class="hl">nefritis intersticial</span> (penicilinas, cefalosporinas, vancomicina; fenitoína, IBP).' },
      { id: 'rin-nt-g2', corto: 'contraste y UCI', tipo: 'test', fuente: 'mr-contraste-evidencia',
        enunciado: 'Un crítico con FRA necesita un TC con contraste yodado. ¿Qué dicen los estudios mejor controlados sobre el riesgo de lesión renal?',
        opciones: [
          { t: 'Que el contraste duplica el FRA en el crítico, así que solo se usa si no hay alternativa y con mucha cautela', porque: 'Esa fama venía de estudios observacionales. Si la sigues, retrasarás un TC que le puede salvar la vida por un riesgo que los estudios controlados no encuentran en el crítico.' },
          { t: 'Que no aumenta el FRA del crítico ni empeora al que ya lo tiene; sigue siendo de riesgo en la ERC con filtrado <30', ok: true },
          { t: 'Que es inocuo en cualquier paciente, también con filtrado <30 mL/min/1,73 m²', porque: 'Con ERC y filtrado <30 sigue considerándose arriesgado. Si lo tratas como inocuo, te saltarás el salino profiláctico en quien más lo necesita.' }],
        explicacion: 'La fama del contraste venía de estudios <span class="hl-rojo">observacionales</span>; los mejor controlados muestran que <span class="hl-verde">no aumenta el FRA en el crítico</span> ni empeora la función de quien ya tiene FRA. Se mantiene el riesgo en la <span class="hl">ERC con filtrado <30 mL/min/1,73 m²</span>.',
        nota: '<b>Nota de fuentes.</b> El protocolo hospitalario de prevención y la escala de Mehran (ficha de ERC, Nefrología) incluyen medidas que este capítulo no menciona. No se elige ganadora; la ficha enlaza las dos.' },
      { id: 'rin-nt-g3', corto: 'salino con contraste', tipo: 'destapa', fuente: 'mr-contraste-profilaxis',
        enunciado: 'Vas a poner contraste a una paciente con filtrado de 25 mL/min/1,73 m². ¿Qué dice el consenso más reciente sobre el salino profiláctico? Son cuatro cosas.',
        cuantas: 'son cuatro cosas',
        puntos: [
          'Está recomendado si hay <span class="hl">FRA o filtrado <30 mL/min/1,73 m²</span>.',
          '<span class="hl-rojo">No necesariamente</span> en la insuficiencia cardíaca.',
          'Se empieza <span class="hl">1 h antes</span> del estudio.',
          'Sigue <span class="hl">3-12 h después</span>; sin una recomendación firme de volumen.'],
        explicacion: 'Consenso citado por Marino (A pág. 51). El volumen no tiene cifra firme: no inventes una.' },
      { id: 'rin-nt-g4', corto: 'CK o mioglobina', tipo: 'test', fuente: 'mr-rabdo-diagnostico', modelo: rabdo('Mira la mioglobina en la nefrona'),
        enunciado: 'Dos pacientes con rabdomiólisis: uno tiene CK de 60.000 y mioglobina en orina de 5 μg/L; el otro, CK de 15.000 y mioglobina de 40 μg/L. Predice: ¿cuál tiene más riesgo de FRA?',
        opciones: [
          { t: 'El de CK 60.000: la CK mide la gravedad renal', porque: 'La CK se correlaciona más con la lesión muscular que con el riesgo renal. Si vigilas solo la CK, subestimarás al segundo paciente, el que tiene el riñón en peligro.' },
          { t: 'El de mioglobina 40 μg/L: la mioglobinuria es un componente crítico del diagnóstico', ok: true },
          { t: 'Los dos igual: ambos cumplen criterios de rabdomiólisis', porque: 'Cumplen criterios de rabdomiólisis, sí, pero la CK se correlaciona más con la lesión muscular, y la mioglobinuria (>20 μg/L es significativa) es un componente crítico del diagnóstico del FRA. Tratarlos igual deja sin vigilancia estrecha al que más la necesita.' }],
        explicacion: 'La <span class="hl-rojo">mioglobina</span>, liberada por el músculo, es la que daña el epitelio tubular (quizá por el hierro del hemo). La CK es imprescindible para diagnosticar la rabdomiólisis, pero la <span class="hl">mioglobinuria</span> es un «componente crítico» del diagnóstico del FRA (A p. 52); >20 μg/L es significativa y la orina empieza a verse marrón.' },
      { id: 'rin-nt-g5', corto: 'la tira de orina', tipo: 'destapa', fuente: 'mr-rabdo-tira',
        enunciado: 'No te dan la mioglobina en orina, pero tienes una tira. ¿Cómo la usas para sospechar mioglobinuria? Son tres cosas.',
        cuantas: 'son tres cosas',
        puntos: [
          'La tira detecta <span class="hl">sangre oculta</span> (ortotoluidina, Hemastix): no distingue hemoglobina de mioglobina.',
          'Si es positiva: <span class="hl">centrifugar</span> (quita los hematíes) y <span class="hl">filtrar</span> el sobrenadante (quita la hemoglobina); si sigue positiva, hay mioglobina.',
          'Atajo: tira positiva <span class="hl-azul">sin hematíes en el sedimento</span>.'],
        explicacion: 'A pág. 52. El atajo del sedimento sirve cuando no puedes centrifugar y filtrar.' },
      { id: 'rin-nt-g6', corto: 'volumen o furosemida', tipo: 'test', fuente: 'mr-rabdo-manejo', modelo: rabdo('Compruébalo en la nefrona'),
        enunciado: 'Tras la tira positiva, el adjunto pregunta qué medida protege más al riñón en la rabdomiólisis. ¿Qué respondes?',
        opciones: [
          { t: 'Furosemida para forzar la diuresis y arrastrar la mioglobina', porque: 'Va en contra de la reanimación con volumen: el paciente pierde líquido que necesita para mantener el flujo tubular y la mioglobina se concentra en el túbulo.' },
          { t: 'Volumen agresivo, para mantener el flujo en el túbulo', ok: true },
          { t: 'Alcalinizar la orina a pH >6,5 como medida principal', porque: 'Inhibe los cilindros, pero cuesta conseguirlo y el bicarbonato tiene sus problemas. Es una medida secundaria, no la más eficaz.' }],
        explicacion: 'El <span class="hl-verde">volumen agresivo</span> es la medida más eficaz. Alcalinizar a pH >6,5 inhibe los cilindros pero es difícil y el bicarbonato tiene sus problemas. <span class="hl-rojo">Manitol o furosemida</span>: arriesgados, van en contra de la reanimación con volumen. <i>Errata del libro: imprime «1 mg/kg/hr» para la diuresis; por el contexto son mL/kg/h.</i>' },
    ],
    examen: [
      { id: 'rin-nt-e1', corto: 'almidón o AINE', tipo: 'test', fuente: 'mr-tabla-34-3',
        enunciado: 'Varón de 70 años con shock séptico que recibe hidroxietilalmidón y, días después, sube la creatinina. ¿Qué mecanismo de la Tabla 34.3 vincula ese fármaco con el FRA?',
        opciones: [
          { t: 'Alteración de la hemodinámica renal', porque: 'Ese es el mecanismo de los AINE, IECA y ARA-II. Con el almidón no hay vasoconstricción aferente: pensarlo así te llevaría a buscar hipoperfusión y a seguir dando almidón.' },
          { t: 'Lesión tubular directa', porque: 'Es el de los aminoglucósidos, la anfotericina B y el cisplatino. Retirar un aminoglucósido que no lleva no cambiaría la causa.' },
          { t: 'Nefropatía osmótica por almidón', ok: true },
          { t: 'Nefritis intersticial', porque: 'Es la reacción alérgica de antimicrobianos, anticonvulsivos o IBP. El almidón no la produce; esperarías eosinofilia o fiebre que aquí no hay.' }],
        explicacion: 'Tabla 34.3: <span class="hl">nefropatía osmótica</span> → hidroxietilalmidones (más citados); manitol e inmunoglobulinas IV (otros).' },
      { id: 'rin-nt-e2', corto: 'la creatinina miente', tipo: 'test', fuente: 'mr-rabdo-diagnostico',
        enunciado: 'En la rabdomiólisis, ¿por qué es más difícil diagnosticar el FRA con la creatinina?',
        opciones: [
          { t: 'Porque el músculo lesionado libera creatina, que eleva la creatinina sérica', ok: true },
          { t: 'Porque la mioglobina interfiere con la técnica de laboratorio de la creatinina', porque: 'La fuente no dice nada de interferencia analítica; el problema es biológico. Buscar un error del laboratorio retrasaría reconocer que la creatinina alta no es toda FRA.' },
          { t: 'Porque la creatinina baja por la hemodilución del volumen agresivo', porque: 'No es lo que cuenta la ficha y daría una falsa tranquilidad, cuando el problema de partida es una creatinina que sube por la creatina liberada.' }],
        explicacion: 'El músculo lesionado libera <span class="hl">creatina</span>, que sube la creatinina sérica. Por eso la mioglobinuria es "un componente crítico" del diagnóstico de FRA en estos pacientes.' },
      { id: 'rin-nt-e3', corto: 'diuresis objetivo', tipo: 'test', fuente: 'mr-rabdo-manejo',
        enunciado: 'Ya has puesto 10-20 mL/kg de salino. ¿Hasta cuándo sigues con el volumen agresivo si la diuresis no llega a 1 mL/kg/h?',
        opciones: [
          { t: 'Hasta lograrla, pase lo que pase: la mioglobina se lava solo con diuresis abundante', porque: 'Si la oliguria persiste unas horas hay que abandonar la estrategia para no sobrecargar: un paciente anúrico con 10 L de más acaba con edema pulmonar.' },
          { t: 'Si la oliguria persiste unas horas, se abandona para no sobrecargar', ok: true },
          { t: 'Se pasa a furosemida desde el primer minuto de oliguria', porque: 'La furosemida va en contra del plan de volumen y no es lo que propone el autor; tendrías al paciente seco con la mioglobina concentrada.' }],
        explicacion: 'Salino isotónico <span class="hl">10-20 mL/kg al inicio</span>, luego el ritmo que mantenga <span class="hl">≥1 mL/kg/h</span> de diuresis. Si la oliguria persiste unas horas, <span class="hl-rojo">se abandona</span> para no sobrecargar.',
        nota: '<b>Nota de fidelidad.</b> El libro imprime «1 mg/kg/hr» para la diuresis; por el contexto son mL/kg/h. Se reproduce con esta nota.' },
      { id: 'rin-nt-e4', corto: 'texto del contraste', tipo: 'error', fuente: 'mr-contraste-evidencia · mr-contraste-profilaxis',
        enunciado: 'Nota del residente antes de un TC con contraste a un paciente de UCI con FRA. Puede haber 0, 1 o 2 errores. Encuéntralos.',
        frases: [
          { t: 'El contraste yodado no aumenta la incidencia de FRA en el paciente crítico, según los estudios mejor controlados.' },
          { t: 'Al tener ya un FRA, el contraste empeorará su función renal, así que lo contraindico.', mal: true,
            c: 'Los estudios controlados muestran que el contraste <span class="hl-verde">no empeora la función</span> de quien ya tiene FRA.' },
          { t: 'Pongo salino profiláctico, que se recomienda con FRA o filtrado <30 mL/min/1,73 m².' },
          { t: 'Lo empiezo justo al acabar el estudio y lo mantengo 1 hora.', mal: true,
            c: 'Se empieza <span class="hl">1 h antes</span> y se sigue <span class="hl">3-12 h después</span>.' }],
        explicacion: 'Dos confusiones reales: seguir creyendo en la fama del contraste y colocar el salino después del estudio.' },
      { id: 'rin-nt-e5', corto: 'la mioglobina en la tira', tipo: 'test', fuente: 'mr-rabdo-tira',
        enunciado: 'La tira de orina da positiva para sangre. El sedimento no tiene hematíes. ¿Qué concluyes?',
        opciones: [
          { t: 'Hemoglobinuria por hemólisis intravascular', porque: 'La hemoglobina libre también positiviza la tira; por eso hay que centrifugar y filtrar para descartarla. Un diagnóstico precipitado de hemólisis te alejaría de la rabdomiólisis.' },
          { t: 'Falso positivo: sin hematíes no hay sangre', porque: 'Es lo contrario: la tira detecta sangre oculta (hemo) aunque no haya hematíes. Descartarla sería perder a un paciente con riesgo de FRA.' },
          { t: 'Mioglobinuria probable: tira sin hematíes', ok: true }],
        explicacion: 'Tira positiva <span class="hl">sin hematíes</span> en el sedimento es evidencia de mioglobinuria. Para confirmarlo, centrifugar y filtrar el sobrenadante: si persiste positiva, es mioglobina.' },
    ],
    casos: [
      { id: 'rin-gregorio', titulo: 'Gregorio, 57 años: 14 horas en el suelo', corto: 'Caso · Gregorio', sub: 'rabdomiólisis tras una caída, 80 kg',
        paciente: { Edad: '57 años', Peso: '80 kg', Motivo: 'Caída en el domicilio; 14 h en el suelo hasta que lo encuentran' },
        pasos: [
          { momento: 'Urgencias · hora 0', datos: { CK: '48.000 U/L', Orina: 'marrón; tira de sangre positiva', Sedimento: 'sin hematíes' }, nuevo: ['CK', 'Orina', 'Sedimento'],
            pregunta: { id: 'rin-gr-1', tipo: 'test', fuente: 'mr-rabdo-tira · mr-rabdo-diagnostico', modelo: rabdo('Mira la mioglobina en la nefrona'),
              enunciado: 'La orina es marrón, la tira da sangre positiva y el sedimento no tiene hematíes. ¿Qué te dice, y qué aporta la CK de 48.000 sobre su riesgo renal?',
              opciones: [
                { t: 'Hemoglobinuria; la CK de 48.000 predice con exactitud el FRA', porque: 'Sin hematíes y con la clínica, lo probable es mioglobinuria. Y la CK se correlaciona más con la lesión muscular que con el riesgo renal: te fiarías de una cifra que no lo mide.' },
                { t: 'Sangre en la orina; la CK no importa', porque: 'No hay hematíes: no es hematuria. Y la CK es imprescindible para el diagnóstico de rabdomiólisis, aunque no mida el riesgo renal.' },
                { t: 'Mioglobinuria; la CK diagnostica, pero se correlaciona más con la lesión muscular', ok: true }],
              explicacion: 'Tira positiva <span class="hl">sin hematíes</span> = mioglobinuria. La CK es esencial para <span class="hl">diagnosticar</span> la rabdomiólisis, pero se correlaciona más con la lesión muscular que con el riesgo de FRA.' } },
          { momento: 'Urgencias · hora 1', datos: { 'Creatinina': '2,4 mg/dL' }, nuevo: ['Creatinina'],
            pregunta: { id: 'rin-gr-2', tipo: 'test', fuente: 'mr-rabdo-diagnostico · mr-rabdo-manejo', origen: 'ficha · la cuenta, del caso',
              enunciado: 'Con 80 kg: ¿qué volumen de salino pones al inicio, a qué diuresis apuntas, y cómo interpretas la creatinina de 2,4?',
              opciones: [
                { t: '800-1.600 mL; ≥80 mL/h; creatinina sobrestimada por la creatina', ok: true },
                { t: '80-160 mL de inicio; diuresis ≥8 mL/h; la creatinina sigue siendo un marcador fiable', porque: 'Es un error de coma (10-20 mL/kg × 80 kg son 800-1.600 mL): quedarías 10 veces corto y la mioglobina seguiría atascando el túbulo. Y la creatinina no es fiable aquí.' },
                { t: '4.000 mL de golpe; diuresis ≥200 mL/h; la creatinina es fiable', porque: 'No es la cifra de la ficha: volumen inicial 10-20 mL/kg y luego el ritmo que dé ≥1 mL/kg/h. Y con la creatina liberada, la creatinina sobreestima el FRA.' }],
              explicacion: '80 kg × 10-20 mL/kg = <span class="hl">800-1.600 mL</span>; luego, ritmo para <span class="hl">≥1 mL/kg/h</span> = 80 mL/h (el libro imprime «1 mg/kg/hr»: errata, por el contexto son mL/kg/h). La creatinina sube también por la <span class="hl-rojo">creatina</span> que libera el músculo.' } },
          { momento: 'Hora 3 · el plan del R1', datos: { Diuresis: '45 mL/h' }, nuevo: ['Diuresis'],
            pregunta: { id: 'rin-gr-3', tipo: 'error', fuente: 'mr-rabdo-manejo · mr-rabdo-diagnostico',
              enunciado: 'La diuresis es de 45 mL/h. El R1 de guardia deja este plan. Puede haber 0, 1 o 2 errores. Encuéntralos.',
              frases: [
                { t: 'La tira positiva sin hematíes en el sedimento orienta a mioglobinuria.' },
                { t: 'Para forzar la diuresis le pongo manitol y furosemida; así se arrastra la mioglobina.', mal: true,
                  c: 'Manitol o furosemida son <span class="hl-rojo">arriesgados</span>: van en contra de la reanimación con volumen. Lo más eficaz es el volumen agresivo.' },
                { t: 'Con CK de 48.000 el riesgo de FRA es el máximo: la CK es lo que mejor lo predice.', mal: true,
                  c: 'La CK se correlaciona más con la <span class="hl">lesión muscular</span> que con el riesgo de FRA; la mioglobinuria es un componente crítico del diagnóstico (A p. 52).' },
                { t: 'Intento alcalinizar la orina a pH >6,5, aunque cuesta conseguirlo y el bicarbonato tiene sus problemas.' }],
              explicacion: 'Dos confusiones reales: forzar la diuresis con fármacos y fiarse de la CK. Pedir bicarbonato no es un error si se hace sabiendo lo que cuesta.' } },
          { momento: 'Hora 5', datos: { 'K⁺': '6,3 mEq/L', ECG: 'T picudas', 'Ca iónico': '0,95 mmol/L' }, nuevo: ['K⁺', 'ECG', 'Ca iónico'],
            pregunta: { id: 'rin-gr-4', tipo: 'test', fuente: 'mr-hiperk-grave · mr-tabla-36-3 · mr-ecg-hiperk', origen: 'ficha (E págs. 26-28)',
              enunciado: 'El K⁺ es 6,3 y el ECG muestra T picudas. La rabdomiólisis libera potasio de las células. ¿Qué haces primero?',
              opciones: [
                { t: 'Esperar al control de la tarde: el K⁺ no llega a 6,5 y todavía no hace falta tratarlo', porque: 'El umbral de gravedad es K⁺ >6,5 o cualquier K⁺ con cambios del ECG. Aquí hay cambios: esperar es dejar una conducción cardíaca sin proteger.' },
                { t: 'Gluconato cálcico al 10 %, 10 mL en 3 min, y luego insulina con glucosa', ok: true },
                { t: 'Bicarbonato sódico en bolo para meter el K⁺ en las células', porque: 'Sin acidosis metabólica no cambia el K⁺, y forma complejos con el calcio, contraproducente si lo estás dando.' }],
              explicacion: 'Hiperpotasemia grave: <span class="hl-rojo">K⁺ >6,5 o cambios del ECG con cualquier K⁺</span>. Primero estabilizar el corazón con gluconato cálcico al 10 % (10 mL en 3 min, repetible a los 5); luego insulina regular 10 U + 50 mL de glucosa al 50 %.' } },
          { momento: 'Hora 8 · el giro', datos: { Diuresis: '20 mL/h', 'K⁺': '6,8 mEq/L (tras el tratamiento)', Pulmón: 'crepitantes bibasales' }, nuevo: ['Diuresis', 'K⁺', 'Pulmón'],
            pregunta: { id: 'rin-gr-5', tipo: 'destapa', fuente: 'mr-fra-nefrotoxicos · mr-rabdo-manejo · mr-rabdo-trr · mr-trr-indicaciones', modelo: filtro('k-urgente', 'Compruébalo en el filtro'),
              enunciado: 'Tras horas de salino, la diuresis cae a 20 mL/h, aparecen crepitantes y el K⁺ vuelve a 6,8 tras el tratamiento. ¿Qué decides, y por qué? Son tres cosas.',
              cuantas: 'son tres cosas',
              puntos: [
                'Se <span class="hl-rojo">abandona el volumen agresivo</span>: la oliguria persiste unas horas y hay riesgo de sobrecarga.',
                'Cumple dos indicaciones de reemplazo renal: <span class="hl">sobrecarga de volumen</span> e <span class="hl">hiperpotasemia grave refractaria</span> (hasta el <span class="hl">30 %</span> de la rabdomiólisis lo necesita).',
                'Para el potasio, <span class="hl-azul">hemodiálisis</span>: baja 1 mEq/L en 1 h y 2 mEq/L en 3 h; la hemofiltración sola aclara despacio.'],
              explicacion: 'Marino: si la oliguria persiste unas horas, abandonar el volumen (A pág. 52); indicaciones b y c de la TRR (A pág. 55); K⁺ >6,5 sigue siendo hiperpotasemia grave (E p. 27); la hemodiálisis es el método más eficaz para sacar K⁺ (E págs. 28-29).' } },
        ],
        lleva: [
          'En la rabdomiólisis la CK diagnostica y se correlaciona más con la lesión muscular; la mioglobinuria es un componente crítico del diagnóstico del FRA; la creatinina engaña por la creatina del músculo.',
          'Lo más eficaz es el volumen agresivo (10-20 mL/kg y ≥1 mL/kg/h; el libro imprime «1 mg/kg/hr», errata); manitol y furosemida son arriesgados, y si la oliguria persiste unas horas se abandona el volumen.',
          'Hasta el 30 % necesita diálisis; con hiperpotasemia refractaria la hemodiálisis es lo más rápido.'],
        volver: { nombre: 'Rabdomiólisis', ancla: 'mr-rabdo-mecanismo', modelo: { nefronaViva: 'rabdo' } } },
    ],
    profundizar: [
      { id: 'mr-tabla-34-3', titulo: 'Tabla 34.3 · el resto de fármacos («otros»)' },
      { id: 'mr-rabdo-trr', titulo: 'La diálisis en la rabdomiólisis (hasta el 30 %)' },
    ],
  },

  /* =================================================================================================
     11 · Terapia de reemplazo renal (A págs. 55-58)
     ================================================================================================= */
  'mr-trr': {
    entrada: 'Cuándo se dializa, qué cruza la membrana por difusión y qué por convección, por qué la hemofiltración sola no baja deprisa un potasio y por qué la hemodiafiltración continua es la favorita de la UCI.',
    guia: [
      { id: 'rin-trr-g1', corto: 'cuándo dializar', tipo: 'destapa', fuente: 'mr-trr-indicaciones',
        enunciado: 'Un 10-15 % de los pacientes de UCI recibe terapia de reemplazo renal. ¿Para qué problemas se indica de forma habitual? Son cuatro cosas.',
        cuantas: 'son cuatro cosas',
        puntos: [
          '<span class="hl">Uremia sintomática</span> (p. ej., encefalopatía).',
          '<span class="hl">Sobrecarga de volumen</span>.',
          '<span class="hl-rojo">Hiperpotasemia grave refractaria</span>.',
          '<span class="hl">Eliminar un tóxico</span>.'],
        explicacion: 'A pág. 55.',
        nota: '<b>Nota de fidelidad.</b> El capítulo dice aquí 10-15 % y, al presentar el FRA, un 15 %. Se reproducen las dos cifras tal cual.' },
      { id: 'rin-trr-g2', corto: 'difusión', tipo: 'test', fuente: 'mr-hemodialisis',
        enunciado: 'En la hemodiálisis, la sangre y el líquido de diálisis circulan en sentidos opuestos a cada lado de la membrana. ¿Qué mueve los solutos y por qué se hace a contracorriente?',
        opciones: [
          { t: 'La presión hidrostática de la bomba; así se arrastra el agua con el soluto', porque: 'Eso es la hemofiltración (convección, arrastre por solvente). Confundirlas te haría esperar que la hemodiálisis retire mucho volumen, cuando retira poco.' },
          { t: 'La difusión por gradiente de concentración; la contracorriente lo mantiene', ok: true },
          { t: 'La presión oncótica de la albúmina; el líquido de diálisis la compensa', porque: 'No es un mecanismo de la ficha. Con esa idea no entenderías por qué el potasio cae en horas: lo que lo saca es el gradiente.' }],
        explicacion: 'Difusión a favor del gradiente de concentración, a través de una membrana semipermeable. La <span class="hl">contracorriente</span> (sangre 200-300 mL/min, líquido 500-800 mL/min) mantiene el gradiente.' },
      { id: 'rin-trr-g3', corto: 'el soluto no baja', tipo: 'destapa', fuente: 'mr-hemofiltracion',
        enunciado: 'En la hemofiltración sale mucho líquido con sus solutos, pero la concentración de urea o potasio en plasma no baja. ¿Por qué, y qué hay que hacer? Son tres cosas.',
        cuantas: 'son tres cosas',
        puntos: [
          'Los solutos salen <span class="hl-azul">arrastrados con el agua</span> (convección, «arrastre por solvente»).',
          'Como salen a la misma concentración que tenía el plasma, <span class="hl">la concentración no baja</span> por sí sola.',
          'Solo baja si se <span class="hl-verde">repone parte del ultrafiltrado con un líquido sin solutos</span>; por eso la técnica es continua.'],
        explicacion: 'A págs. 57-58: «la concentración plasmática de estos solutos no disminuye a menos que se infunda un líquido libre de solutos que reponga parte del ultrafiltrado». Aclara despacio los solutos pequeños.' },
      { id: 'rin-trr-g4', corto: 'potasio urgente', tipo: 'test', fuente: 'mr-trr-comparar · mr-hiperk-grave', modelo: filtro('k-urgente', 'Compruébalo en el filtro'),
        enunciado: 'Predice, y luego lo compruebas en el modelo: un K⁺ de 7 con QRS ancho en un paciente anúrico. ¿Qué técnica usas, y cuánto baja el potasio en una hora?',
        opciones: [
          { t: 'Hemofiltración continua; baja 3 mEq/L en una hora', porque: 'La hemofiltración quita hasta 3 L de líquido por hora, pero aclara despacio los solutos pequeños: no es la adecuada para un potasio que mata en minutos. Perderías horas.' },
          { t: 'Hemodiálisis; baja unos 1 mEq/L en una hora', ok: true },
          { t: 'Hemodiálisis; no baja hasta pasadas 24 h', porque: 'Pocas horas de hemodiálisis bastan para aclarar un potasio peligroso. Esperar un día dejaría un K⁺ letal sin tratar.' }],
        explicacion: 'La hemodiálisis es el método más eficaz para sacar K⁺: baja <span class="hl">1 mEq/L en 1 h y 2 mEq/L en 3 h</span> (E págs. 28-29); unas horas bastan para aclarar un potasio peligroso (A pág. 57). La hemofiltración, en cambio, es <span class="hl-rojo">lenta</span> para la hiperpotasemia grave.' },
      { id: 'rin-trr-g5', corto: 'tipo de catéter', tipo: 'test', fuente: 'mr-cateter-hd',
        enunciado: 'Vas a poner el catéter de hemodiálisis a un paciente que probablemente quedará crónico. ¿Dónde lo pones, y por qué ese calibre?',
        opciones: [
          { t: 'Yugular interna o femoral; 12 G para flujos de 200-300 mL/min', ok: true },
          { t: 'Subclavia, que es la más cómoda; 12 G para flujos de 200-300 mL/min', porque: 'La subclavia no se canaliza para hemodiálisis: evita una estenosis que limitaría los accesos de una hemodiálisis crónica.' },
          { t: 'Yugular interna o femoral; un catéter fino basta con 50 mL/min', porque: 'El catéter lleva dos luces de 12 G precisamente para los flujos de 200-300 mL/min de la hemodiálisis; uno fino no daría el flujo que necesita la sesión.' }],
        explicacion: 'Catéter venoso central de <span class="hl">dos luces de 12 G</span> (20 cm) en <span class="hl">yugular interna o femoral</span>. <span class="hl-rojo">No en la subclavia</span>, para evitar la estenosis.' },
      { id: 'rin-trr-g6', corto: 'la favorita', tipo: 'test', fuente: 'mr-hemodiafiltracion',
        enunciado: 'Un paciente inestable necesita sacar volumen y también solutos pequeños. ¿Qué modalidad ha pasado a ser la favorita de la UCI?',
        opciones: [
          { t: 'Hemodiálisis intermitente de unas 4 h por sesión', porque: 'Retira poco líquido (≤2-3 L por sesión) y puede causar hipotensión en el inestable.' },
          { t: 'Hemofiltración continua sola', porque: 'Retira mucho volumen y tolera mejor la inestabilidad, pero aclara despacio los solutos pequeños: no sirve para residuos nitrogenados ni potasio grave.' },
          { t: 'Hemodiafiltración venovenosa continua', ok: true }],
        explicacion: 'Suma la <span class="hl">diálisis</span> (aclaramiento rápido de solutos pequeños) y la <span class="hl">hemofiltración</span> (retirada de líquido y tóxicos), de forma continua. Es el método favorito en la UCI, aunque su rendimiento puede ser caprichoso.',
        nota: '<b>Nota de interpretación.</b> El libro la llama «CVVHD»; la sigla habitual de la hemodiafiltración venovenosa continua es CVVHDF, y CVVHD suele designar la hemodiálisis venovenosa continua. Se reproduce lo que imprime el libro (fisiología general: nomenclatura habitual de las técnicas continuas).' },
    ],
    examen: [
      { id: 'rin-trr-e1', corto: 'qué paciente dializar', tipo: 'test', fuente: 'mr-trr-indicaciones',
        enunciado: 'Cuatro pacientes con FRA en UCI. ¿En cuál es indicación habitual de terapia de reemplazo renal?',
        opciones: [
          { t: 'Creatinina de 3,1 mg/dL, diuresis conservada y sin otro problema', porque: 'Una creatinina elevada sola no es indicación: las indicaciones son uremia sintomática, sobrecarga de volumen, hiperpotasemia refractaria o tóxico. Dializar a este paciente lo expondría a un catéter y a hipotensión sin necesidad.' },
          { t: 'Encefalopatía con urea alta en el FRA', ok: true },
          { t: 'Oliguria de 10 horas con tensión normal y sin sobrecarga', porque: 'La oliguria aislada no figura entre las indicaciones; hace falta uremia, sobrecarga, hiperpotasemia grave refractaria o un tóxico.' }],
        explicacion: 'Indicaciones habituales: <span class="hl">uremia sintomática</span> (p. ej., encefalopatía), sobrecarga de volumen, hiperpotasemia grave refractaria y eliminar un tóxico (A pág. 55).' },
      { id: 'rin-trr-e2', corto: 'inestable y sobrecargado', tipo: 'test', fuente: 'mr-hemofiltracion · mr-hemodialisis',
        enunciado: 'Paciente con shock séptico a dosis altas de noradrenalina, anúrico y con 8 L positivos. ¿Qué técnica tolera mejor y retira más volumen?',
        opciones: [
          { t: 'Hemodiálisis intermitente: aclara rápido', porque: 'Retira poco líquido (≤2-3 L por sesión) y arriesga hipotensión en el inestable.' },
          { t: 'Hemofiltración venovenosa continua: hasta 3 L/h y mejor tolerancia', ok: true },
          { t: 'Ninguna: se espera a que mejore la tensión', porque: 'Con sobrecarga de volumen y anuria hay indicación; esperar deja al paciente cada vez más edematoso y con peor pulmón.' }],
        explicacion: 'La hemofiltración continua <span class="hl-verde">tolera mejor la inestabilidad</span>, retira <span class="hl">hasta 3 L/h</span> y elimina fármacos y tóxicos; con poro mayor, también citocinas.' },
      { id: 'rin-trr-e3', corto: 'cifras de la diálisis', tipo: 'error', fuente: 'mr-hemodialisis · mr-hemofiltracion',
        enunciado: 'Resumen de un residente sobre las técnicas de reemplazo renal. Puede haber 0, 1 o 2 errores. Encuéntralos.',
        frases: [
          { t: 'La hemodiálisis intermitente dura unas 4 h, con sangre a 200-300 mL/min.' },
          { t: 'Con una sesión se pueden retirar sin problema 6-8 litros de líquido.', mal: true,
            c: 'En una sesión de hemodiálisis no se retiran más de <span class="hl">2-3 L</span> de líquido: retira poco volumen.' },
          { t: 'La hemofiltración arrastra los solutos con el agua por convección.' },
          { t: 'Para un potasio de 7 con QRS ancho, lo más rápido es la hemofiltración, porque retira hasta 3 L/h.', mal: true,
            c: 'La hemofiltración aclara <span class="hl-rojo">despacio</span> los solutos pequeños; para la hiperpotasemia grave, la hemodiálisis.' }],
        explicacion: 'Dos confusiones reales: pedirle volumen a la hemodiálisis y velocidad a la hemofiltración.' },
      { id: 'rin-trr-e4', corto: 'tóxico grande', tipo: 'test', fuente: 'mr-trr-comparar · mr-hemofiltracion',
        enunciado: 'Un tóxico de molécula grande, además de cierta inestabilidad. ¿Qué técnica lo elimina, y por qué no la hemodiálisis?',
        opciones: [
          { t: 'Hemodiálisis: la difusión aclara bien las moléculas grandes, también los tóxicos de gran tamaño', porque: 'La hemodiálisis retira poco las moléculas grandes (fármacos, tóxicos). Dializarlo sería dejar el tóxico en sangre mientras el paciente se hipotensa.' },
          { t: 'Hemofiltración: por convección salen las partículas grandes, que la hemodiálisis no aclara', ok: true },
          { t: 'Ninguna: los tóxicos solo salen con diuresis forzada', porque: 'La eliminación de tóxico es una de las indicaciones de reemplazo renal; confiar en la diuresis forzada retrasa el aclaramiento.' }],
        explicacion: 'Figura 34.4: las partículas pequeñas (urea) se aclaran con las dos; las grandes (toxinas), <span class="hl">solo con la hemofiltración</span>. La hemodiálisis tiene limitada la eliminación de fármacos y tóxicos.' },
    ],
    casos: [
      { id: 'rin-adela', titulo: 'Adela, 72 años: el calcio no basta', corto: 'Caso · Adela', sub: 'hiperpotasemia en ERC, la parte de la diálisis',
        paciente: { Edad: '72 años', Motivo: 'ERC estadio 3; en tratamiento con enalapril, espironolactona e ibuprofeno', Aviso: 'debilidad y palpitaciones' },
        pasos: [
          { momento: 'Urgencias · hora 0', datos: { 'K⁺': '6,6 mEq/L', ECG: 'PR largo y QRS 130 ms', Fármacos: 'enalapril, espironolactona, ibuprofeno' }, nuevo: ['K⁺', 'ECG', 'Fármacos'],
            pregunta: { id: 'rin-ad-1', tipo: 'test', fuente: 'mr-hiperk-grave · mr-tabla-36-3 · mr-tabla-36-2', origen: 'ficha (E págs. 26-28)',
              enunciado: 'K⁺ de 6,6 con PR largo y QRS ensanchado. Toma tres fármacos que favorecen la hiperpotasemia. ¿Qué haces primero?',
              opciones: [
                { t: 'Cloruro cálcico, porque aporta el triple de calcio', porque: 'El cloruro se reserva para el colapso circulatorio o la parada. Aquí no hay colapso circulatorio: dar el triple de calcio sin necesitarlo no es la pauta de la ficha, que usa el gluconato.' },
                { t: 'Gluconato cálcico al 10 %, 10 mL en 3 min', ok: true },
                { t: 'Bicarbonato sódico para meter el K⁺ en las células', porque: 'Sin acidosis metabólica no mueve el K⁺ en perfusiones cortas, y forma complejos con el calcio. Mientras tanto el QRS ancho seguiría sin proteger.' }],
              explicacion: 'Hiperpotasemia grave: <span class="hl-rojo">K⁺ >6,5 o cambios en el ECG</span>. Primero <span class="hl">gluconato cálcico al 10 %, 10 mL IV en 3 min</span> (repetible a los 5). El cloruro cálcico solo en colapso. Tabla 36.2 (E p. 24): IECA, espironolactona y AINE favorecen la hiperpotasemia; grave = K⁺ >6,5 o ECG alterado (E p. 27).' } },
          { momento: 'Hora 0 · +3 min', datos: { ECG: 'QRS 100 ms (se estrecha)' }, nuevo: ['ECG'],
            pregunta: { id: 'rin-ad-2', tipo: 'destapa', fuente: 'mr-hiperk-grave · mr-tabla-36-3', origen: 'ficha (E págs. 27-28)',
              enunciado: 'El calcio ha estrechado el QRS. ¿Qué haces ahora, aunque el ECG se vea mejor? Son tres cosas.',
              cuantas: 'son tres cosas',
              puntos: [
                'Meter K⁺ en las células: <span class="hl">insulina regular 10 U IV + 50 mL de glucosa al 50 %</span> (baja ≥0,6 mEq/L, pico a los 30-60 min).',
                'Sacar el K⁺ del cuerpo: <span class="hl">ciclosilicato de sodio y zirconio 10 g</span> (efecto a la 1 h).',
                'Si el K⁺ <span class="hl-azul">no baja con la insulina y el ciclosilicato</span>, es hiperpotasemia refractaria: indicación de <span class="hl-azul">hemodiálisis</span>, el método más eficaz.'],
              explicacion: 'Tres objetivos en orden: estabilizar, meter en las células y sacar el exceso (Tabla 36.3, E p. 27). El calcio dura 30-60 min: hay que combinarlo con lo demás; la diálisis queda para el K⁺ refractario a insulina y ciclosilicato (E p. 27; A p. 55).' } },
          { momento: 'Hora 0 · +45 min · el giro', datos: { ECG: 'QRS 130 ms de nuevo', 'K⁺': '6,4 mEq/L' }, nuevo: ['ECG', 'K⁺'],
            pregunta: { id: 'rin-ad-3', tipo: 'test', fuente: 'mr-hiperk-grave · mr-trr-indicaciones', origen: 'ficha (E págs. 27-29)', modelo: filtro('k-urgente,k0=6.4', 'Compruébalo en el filtro'),
              enunciado: 'A los 45 min el QRS vuelve a ensancharse y el K⁺ sigue en 6,4. ¿Por qué ha pasado, y qué haces?',
              opciones: [
                { t: 'Se disipa el efecto del calcio (30-60 min): repites calcio y vas a hemodiálisis', ok: true },
                { t: 'Es un error del ECG: se repite al cabo de una hora', porque: 'Con un K⁺ que sigue alto, el QRS ancho no es un artefacto: se disipa el calcio. Esperar una hora es dejar al corazón sin protección.' },
                { t: 'Se pone más insulina y se espera a que haga efecto', porque: 'El efecto de la insulina es temporal (pico a los 30-60 min) y solo mueve el K⁺ dentro de las células; no lo saca del cuerpo. Esperarla no resuelve un K⁺ refractario.' }],
              explicacion: 'El efecto del calcio <span class="hl">se disipa en 30-60 min</span>; la insulina es temporal. El potasio refractario es una indicación de reemplazo renal, y la <span class="hl">hemodiálisis</span> es el método más eficaz.' } },
          { momento: 'Hora 1', datos: { Plan: 'otro residente propone bicarbonato y cloruro cálcico' }, nuevo: ['Plan'],
            pregunta: { id: 'rin-ad-4', tipo: 'error', fuente: 'mr-hiperk-grave · mr-tabla-36-3', origen: 'ficha (E págs. 27-28)',
              enunciado: 'Plan del residente de guardia mientras llega la máquina. Puede haber 0, 1 o 2 errores. Encuéntralos.',
              frases: [
                { t: 'Gluconato cálcico al 10 %, 10 mL en 3 min, que repito a los 5 min si hace falta.' },
                { t: 'Pongo bicarbonato sódico en bolo para mover el K⁺ a las células.', mal: true,
                  c: 'En perfusiones cortas <span class="hl-rojo">no cambia el K⁺</span> sin acidosis metabólica y forma complejos con el calcio: contraproducente.' },
                { t: 'Cambio el gluconato por cloruro cálcico, que da más calcio, para la hiperpotasemia.', mal: true,
                  c: 'El cloruro cálcico (triple de calcio) se reserva para el <span class="hl">colapso circulatorio o la parada</span>; en general se usa el gluconato.' },
                { t: 'La insulina con glucosa baja el K⁺ al menos 0,6 mEq/L, con pico a los 30-60 min.' }],
              explicacion: 'Dos confusiones reales: el bicarbonato como tratamiento de la hiperpotasemia y el cloruro cálcico «por ser más potente».' } },
          { momento: 'Hora 2 · en diálisis', datos: { 'K⁺': '6,4 mEq/L', Técnica: 'hemodiálisis' }, nuevo: ['Técnica'],
            pregunta: { id: 'rin-ad-5', tipo: 'test', fuente: 'mr-hiperk-grave · mr-trr-comparar', origen: 'ficha · la cuenta, del caso (E págs. 28-29)', modelo: filtro('k-urgente,k0=6.4', 'Compruébalo en el filtro'),
              enunciado: 'Con K⁺ de 6,4 al empezar la hemodiálisis, ¿qué K⁺ esperas a la hora y a las 3 horas?',
              opciones: [
                { t: 'Hacia 5,4 a la hora y 4,4 a las 3 horas', ok: true },
                { t: 'Hacia 3,4 a la hora y 0,4 a las 3 horas', porque: 'Es el doble de lo que baja (1 mEq/L en 1 h y 2 mEq/L en 3 h): esperar un K⁺ imposible te haría sospechar un fallo y sacarla del tratamiento antes de tiempo.' },
                { t: 'Hacia 6,2 a la hora: la hemodiálisis es lenta', porque: 'La lenta es la hemofiltración. La hemodiálisis aclara rápido los solutos pequeños: pocas horas bastan para un potasio peligroso.' }],
              explicacion: 'La hemodiálisis baja el K⁺ <span class="hl">1 mEq/L en 1 h y 2 mEq/L en 3 h</span>: 6,4 → 5,4 → 4,4 (E págs. 28-29).' } },
        ],
        lleva: [
          'El calcio protege el corazón unos 30-60 minutos: dalo y a la vez mete y saca potasio.',
          'Bicarbonato en bolo y cloruro cálcico de rutina no son tratamiento de la hiperpotasemia.',
          'El potasio refractario es indicación de diálisis; la hemodiálisis baja 1 mEq/L en 1 h, mucho más rápido que la hemofiltración.'],
        volver: { nombre: 'Hemodiálisis y hemofiltración', ancla: 'mr-trr-comparar', modelo: { ...IR, tab: 'mr-trr', filtroVivo: 'k-urgente,k0=6.4', texto: 'Compruébalo en el filtro' } } },
    ],
    profundizar: [
      { id: 'mr-dirac', titulo: 'La ecuación de Dirac y el FRA' },
      { id: 'mr-cateter-hd', titulo: 'El catéter de hemodiálisis (Figura 34.5)' },
    ],
  },
};

// Estudiar (Texto | Estudiar) de las fichas del bloque 6b, grupo 6G · La vena, último recurso (Marino, cap. 50):
// mu-npt-soluciones (de consulta), mu-npt-pauta y mu-npt-complicaciones de js/modules/libros/marino-nutricion.html.
// La pinta js/core/mayeutica.js. Datos puros. Formato: el de js/data/mayeutica/b1-fluidos.js.
//
// Fuente: docs/marino-2024-nutricion-endocrino-caps48-51.pdf, págs. 36-45 (cap. 50); máximo de lípidos del cap. 48 (pág. 6),
// propofol del cap. 49 (pág. 25) y tiamina (Tabla 48.4, págs. 8 y 11). El número de página es el del PDF.
// Cada explicación y cada distractor dicen su página. Los pacientes se inventan. Cobertura: autonomo/bloques/b6b/cobertura-anexo.md.
// Las cifras de las calculadoras (mu-npt-calc, mu-real-calc) se han tecleado en la app (autonomo/bloques/b6b/herramientas/cifras-6g.mjs).

const NE = 'docs/marino-2024-nutricion-endocrino-caps48-51.pdf';
const pdf = (p, t = `PDF pág. ${p}`) => `<a class="biblio-link" href="${NE}#page=${p}" target="_blank" rel="noopener">${t}</a>`;
const NOTA_LIPIDOS = '<b>Nota de fuentes.</b> El libro da dos máximos de lípidos distintos: <span class="hl">1,5 g/kg/día</span> en el cap. 48 (' + pdf(6) + ') y <span class="hl">2,5 g/kg/día</span> (12,5 mL/kg/día de Intralipid al 20 %) en la Tabla 50.2 del cap. 50 (' + pdf(38) + '). Se muestran las dos; no se elige ganadora.';
const NOTA_PROPOFOL = '<b>Nota de fuentes.</b> El cap. 49 cuenta el propofol a <span class="hl">1,1 kcal/mL</span> (' + pdf(25) + ') y el cap. 50, a <span class="hl">1 kcal/mL</span> (' + pdf(40) + '). La calculadora de esta ficha usa 1; la pauta enteral, 1,1. Se muestran las dos; no se elige ganadora.';

export const MAYEUTICA_NPT = {
  /* =================================================================================================
     Ficha 9 · Soluciones y aditivos (NE págs. 36-39) — de consulta
     ================================================================================================= */
  'mu-npt-soluciones': {
    entrada: 'Qué lleva la bolsa de nutrición parenteral, por qué la glucosa concentrada solo cabe en una vena central y qué se queda corto en los aditivos.',
    guia: [
      { id: 'npt-s-g1', corto: 'D50 y lípidos', tipo: 'test', fuente: 'mu-npt-glucosa · mu-tabla-50-1 · mu-npt-lipidos',
        enunciado: 'Antes de mirar la tabla: ¿por qué la glucosa al 50 % exige una vena central y los lípidos pueden ir por una periférica?',
        opciones: [
          { t: 'La D50 tiene 2.525 mOsm/L y daña la vena; los lípidos son casi isotónicos (260 mOsm/L)', ok: true },
          { t: 'Los lípidos aportan más calorías por mL, así que caben en menos volumen y la vena periférica los tolera mejor', porque: 'Que 1 mL de lípido al 20 % dé 2 kcal no tiene que ver con la vena: lo que decide es la osmolaridad. Por esa idea pondrías la D50 por una periférica y la vena se dañaría (p. 36-37).' },
          { t: 'La glucosa se cristaliza en venas finas y los lípidos no', porque: 'No es un problema de cristales sino de osmolaridad: la D50 es muy hipertónica. Con esa explicación no sabrías cuándo una vena periférica sí vale (<900 mOsm/L, p. 44).' }],
        explicacion: 'La glucosa concentrada tiene una osmolaridad muy alta (D50: <span class="hl-rojo">2.525 mOsm/L</span>) que «obliga a infundir por venas centrales grandes»; las emulsiones lipídicas son casi isotónicas con el plasma (<span class="hl">260 mOsm/L</span> en la Tabla 50.2) y pueden ir por vía periférica (' + pdf(36) + ', ' + pdf(37) + ' y ' + pdf(38) + ').' },
      { id: 'npt-s-g2', corto: 'proteína por litro', tipo: 'test', fuente: 'mu-npt-aa',
        enunciado: 'Una solución de aminoácidos al 10 %. Predice: ¿cuánta proteína lleva cada litro?',
        opciones: [
          { t: '10 g', porque: 'Has leído «10 %» como 10 g por litro. Al 10 % son 10 g por 100 mL, es decir, 100 g por litro; con 10 g te quedarías diez veces corto en proteína (p. 37).' },
          { t: '100 g por litro', ok: true },
          { t: '16,5 g (lo que pone la etiqueta)', porque: 'Has confundido el nitrógeno con la proteína: 16,5 g es el nitrógeno por litro, no la proteína, que son 100 g. Con 16,5 g te quedarías seis veces corto en proteína (p. 37).' }],
        explicacion: 'Una solución al 10 % «proporciona <span class="hl-rojo">100 g de proteína por litro</span> (16,5 g de nitrógeno por litro según el libro)». Por eso 1 L cubre los 98 g del ejemplo de la ficha siguiente (' + pdf(37) + ').',
        nota: '<b>Nota de fidelidad.</b> El libro imprime 16,5 g de nitrógeno por litro en la pág. 37, pero el cap. 48 (pág. 6) dice que la proteína es un 16 % nitrógeno (100 g ÷ 6,25 = 16 g). Se reproduce la cifra impresa.' },
      { id: 'npt-s-g3', corto: 'ramificados', tipo: 'destapa', fuente: 'mu-npt-ramificados',
        enunciado: 'Las soluciones enriquecidas en aminoácidos ramificados tienen dos razones teóricas. ¿Cuáles y qué demostraron?',
        cuantas: 'son tres cosas',
        puntos: [
          'En el fallo hepático <span class="hl-azul">compiten con los aromáticos</span> por cruzar la barrera hematoencefálica y reducirían la encefalopatía.',
          'Se metabolizan en el músculo y <span class="hl-azul">facilitarían un balance nitrogenado positivo</span> en el estrés (trauma, sepsis).',
          '<span class="hl-rojo">No han mejorado el pronóstico</span> en ninguna de esas situaciones.'],
        explicacion: 'Dos teorías y ningún beneficio demostrado (' + pdf(37) + ').' },
      { id: 'npt-s-g4a', corto: 'oligoelementos', tipo: 'test', fuente: 'mu-tabla-50-3',
        enunciado: 'Un preparado de oligoelementos de los de la tabla, frente a las necesidades diarias. ¿Cuántos de los 7 oligoelementos quedan cortos?',
        opciones: [
          { t: 'Ninguno: está hecho para cubrir las necesidades', porque: 'El libro avisa de lo contrario: el preparado no las cubre. Si lo das por completo, tu paciente de nutrición parenteral larga puede quedarse corto sin que lo sospeches (p. 39).' },
          { t: '5 de los 7 oligoelementos de la tabla', ok: true },
          { t: 'Solo el hierro, que no lleva', porque: 'El texto habla de varios oligoelementos, no de uno solo. Corregir solo el hierro dejaría el resto sin vigilar (p. 39).' }],
        explicacion: '«Las necesidades diarias de <span class="hl-rojo">5 de los 7</span> oligoelementos no se cubren con este producto; las consecuencias de este desajuste no se conocen» (' + pdf(39) + ').',
        nota: '<b>Nota de fidelidad.</b> La tabla imprime el cobre como «1 µg» y el selenio y el zinc sin unidades. Con el cobre en 1 µg quedarían cortos seis, no cinco: se reproduce la tabla tal cual y el texto («5 of the 7»), sin corregirlos (' + pdf(39) + ').' },
    ],
    examen: [
      { id: 'npt-s-e1', corto: 'lípidos al 20 %', tipo: 'test', fuente: 'mu-npt-lipidos · mu-tabla-50-2',
        enunciado: 'Se prescriben 250 mL de lípidos de soja al 20 %. ¿Cuántas kcal aportan, y qué dice la Tabla 50.2 de su osmolaridad?',
        opciones: [
          { t: '250 kcal, porque son 1 kcal/mL', porque: 'Una kcal por mL es la emulsión al 10 %. Al 20 % son 2 kcal/mL; con 250 kcal creerías aportar la mitad y añadirías glucosa de más (p. 37-38).' },
          { t: '500 kcal; 260 mOsm/L, casi isotónica', ok: true },
          { t: '500 kcal; más de 2.000 mOsm/L, como la D50', porque: 'Los lípidos son casi isotónicos (260 mOsm/L); la hiperosmolaridad es de la glucosa. Si los tratas como la D50 renunciarás sin motivo a una vía periférica (p. 37-38).' }],
        explicacion: 'El 20 % da <span class="hl">2 kcal/mL</span>: 250 mL = <span class="hl-rojo">500 kcal</span>, y la emulsión de soja tiene <span class="hl">260 mOsm/L</span> (Tabla 50.2, ' + pdf(38) + ').' ,
        nota: NOTA_LIPIDOS },
      { id: 'npt-s-e2', corto: 'nota de la bolsa', tipo: 'error', fuente: 'mu-npt-glucosa · mu-tabla-50-1 · mu-npt-aa · mu-npt-lipidos · mu-tabla-50-2',
        enunciado: 'Una nota de farmacia sobre la bolsa. Encuentra los errores (puede haber 0, 1 o 2).',
        frases: [
          { t: 'La D50 da 1.700 kcal por litro y 2.525 mOsm/L: va por vía central.' },
          { t: 'Una solución de aminoácidos al 10 % lleva 100 g de proteína por litro.' },
          { t: 'Los lípidos al 20 % dan 1 kcal/mL y 260 mOsm/L, por eso van por vía periférica.', mal: true,
            c: 'El 20 % da <span class="hl-rojo">2 kcal/mL</span>; 1 kcal/mL es el 10 %. Lo de los 260 mOsm/L y la vía periférica es correcto (p. 37-38).' },
          { t: 'El preparado de oligoelementos deja cortos 5 de los 7 oligoelementos.' }],
        explicacion: 'D50 (' + pdf(36) + ' y ' + pdf(37) + '), aminoácidos (' + pdf(37) + '), lípidos (' + pdf(38) + ') y oligoelementos (' + pdf(39) + ').' },
    ],
    casos: [
      { id: 'npt-mac', titulo: 'Macaria, 59 años: una fístula que no deja comer', corto: 'Caso · Macaria (la bolsa)', sub: 'fístula de alto débito, NPT central',
        paciente: { Edad: '59 años', Motivo: 'fístula intestinal de alto débito tras una resección', Nutrición: 'intestino inutilizable por ahora' },
        pasos: [
          { momento: 'Día 1 · la vía', datos: { 'Plan': 'NPT completa, mezcla 3 en 1', 'Glucosa': 'D50 en la bolsa' }, nuevo: ['Plan', 'Glucosa'],
            pregunta: { id: 'npt-mac-1', tipo: 'test', fuente: 'mu-npt-glucosa · mu-tabla-50-1',
              enunciado: 'Quieren pasar la bolsa por una vía periférica «para no pinchar la yugular». La bolsa lleva D50. ¿Qué dices?',
              opciones: [
                { t: 'Vía central', ok: true },
                { t: 'Vale la periférica si se pasa despacio, 20 mL/h', porque: 'La osmolaridad de la D50 no depende del ritmo: sigue siendo muy alta, y el libro manda venas centrales grandes. La vena periférica se dañaría (p. 36).' },
                { t: 'Vale la periférica si se añaden lípidos para bajar la osmolaridad', porque: 'La periférica solo vale con una mezcla <900 mOsm/L, y eso lo consigue una nutrición con aminoácidos y glucosa diluidos, no añadir lípidos a una bolsa con D50 (p. 44).' }],
              explicacion: 'La D50 tiene <span class="hl-rojo">2.525 mOsm/L</span> («osmolaridad muy alta que obliga a venas centrales grandes», ' + pdf(36) + '). La periférica exige <900 mOsm/L (' + pdf(44) + ').' } },
          { momento: 'Día 1 · la mezcla', datos: { 'Lípidos': '250 mL al 20 %' }, nuevo: ['Lípidos'],
            pregunta: { id: 'npt-mac-2a', tipo: 'destapa', fuente: 'mu-npt-lipidos · mu-tabla-50-2',
              enunciado: 'Farmacia prepara la 3 en 1 con 250 mL de lípidos al 20 %. ¿Qué debes saber de ellos?',
              cuantas: 'son tres cosas',
              puntos: [
                'Dan <span class="hl">9 kcal/g</span>: 2 kcal/mL al 20 %, es decir, <span class="hl-rojo">500 kcal</span> en los 250 mL.',
                'Aportan en torno al <span class="hl-rojo">30 %</span> de la energía; la glucosa, ≈ 70 % de las calorías no proteicas.',
                'Son casi isotónicos (<span class="hl">260 mOsm/L</span>): la hiperosmolaridad de la bolsa es de la glucosa.'],
              explicacion: 'Lípidos (' + pdf(36) + ', ' + pdf(37) + ') y Tabla 50.2 (' + pdf(38) + ').' } },
          { momento: 'Día 3 · la glucemia', datos: { 'Glucemia': '240 mg/dL' }, nuevo: ['Glucemia'],
            pregunta: { id: 'npt-mac-3', tipo: 'test', fuente: 'mu-npt-hiperglucemia · mu-npt-insulina',
              enunciado: 'Macaria lleva la bolsa y la glucemia es 240 mg/dL. ¿Cómo la manejas?',
              opciones: [
                { t: 'Insulina regular en perfusión continua, a menudo dentro de la mezcla; objetivo 140-180 mg/dL', ok: true },
                { t: 'Parar la NPT y volver a empezar a los dos días', porque: 'La hiperglucemia es frecuente (glucemia >200 mg/dL en el 45 % en una serie) y se trata con insulina; parar la nutrición deja sin aporte a quien no tiene intestino (p. 41).' },
                { t: 'Dejarla: 240 es esperable con NPT y no se trata hasta pasar de 300 mg/dL', porque: 'El libro da 140-180 mg/dL como objetivo y trata la hiperglucemia con insulina; no fija 300 como umbral. Macaria seguiría hiperglucémica con la carga de glucosa de la bolsa (p. 41).' }],
              explicacion: '«Glucemia >200 mg/dL en el <span class="hl-rojo">45 %</span> de los pacientes con NPT»; mejor <span class="hl">insulina regular en perfusión continua</span>, que a menudo se añade a la mezcla; objetivo <span class="hl-rojo">140-180 mg/dL</span> (' + pdf(41) + ').' } },
          { momento: 'Día 6 · ya estable', datos: { 'Insulina': '40 U/día en perfusión (inventado)' }, nuevo: ['Insulina'],
            pregunta: { id: 'npt-mac-3b', tipo: 'test', fuente: 'mu-npt-insulina',
              enunciado: 'Macaria está estable, con glucemias de 150-170 mg/dL y 40 U/día de insulina en perfusión. ¿Qué cambias?',
              opciones: [
                { t: 'Pasar la mitad de la dosis diaria (20 U) a glargina, una vez al día', ok: true },
                { t: 'Pasar toda la dosis a glargina y retirar la perfusión', porque: 'El libro convierte la mitad de la dosis diaria, no toda, y solo cuando el paciente está estable. Con toda la dosis en un depósito de acción larga perderías la capacidad de ajustar (p. 41).' },
                { t: 'Suspender la insulina porque ya está en rango', porque: 'Está en rango gracias a la insulina y la bolsa sigue aportando glucosa (fisiología general): sin ella la glucemia volvería a subir (p. 41).' }],
              explicacion: 'Cuando el paciente está clínicamente estable, la mitad de la necesidad diaria de insulina puede pasar a <span class="hl-rojo">glargina una vez al día</span> (' + pdf(41) + '). La cifra de 40 U es inventada.' } },
          { momento: 'Día 7 · la nota de guardia', datos: { 'Nota': 'resumen de la NPT' }, nuevo: ['Nota'],
            pregunta: { id: 'npt-mac-6', tipo: 'error', fuente: 'mu-npt-glucosa · mu-npp-limite · mu-npt-hiperglucemia',
              enunciado: 'La nota del residente de guardia. Encuentra los errores (puede haber 0, 1 o 2).',
              frases: [
                { t: 'NPT por vía central por la D50, de 2.525 mOsm/L.' },
                { t: 'La nutrición periférica usa aminoácidos y glucosa diluidos, con una osmolaridad <900 mOsm/L.' },
                { t: 'Objetivo de glucemia 140-180 mg/dL con insulina regular en perfusión.' },
                { t: 'Estable: la mitad de la dosis diaria de insulina puede pasar a glargina.' }],
              explicacion: 'Esta nota no tiene errores: vía central (' + pdf(36) + '), límite periférico (' + pdf(44) + '), glucemia e insulina (' + pdf(41) + ').' } },
        ],
        lleva: [
          'La D50 (2.525 mOsm/L) va por vía central; los lípidos, casi isotónicos, y la nutrición periférica (<900 mOsm/L) pueden ir por una vena.',
          'En la 3 en 1, los lípidos aportan en torno al 30 % de la energía (2 kcal/mL al 20 %) y la glucosa, el 70 % de las calorías no proteicas.',
          'Con NPT, glucemia 140-180 mg/dL con insulina regular en perfusión; estable, la mitad de la dosis puede pasar a glargina.'],
        volver: { nombre: 'Glucosa y vía central', ancla: 'mu-npt-glucosa' } },
    ],
    profundizar: [
      { id: 'mu-npt-ramificados', titulo: 'Aminoácidos ramificados (sin beneficio demostrado)' },
      { id: 'mu-npt-clinolipid', titulo: 'Clinolipid® y su nota de fuentes' },
      { id: 'mu-npt-smoflipid', titulo: 'Smoflipid® y su nota de fidelidad' },
      { id: 'mu-npt-omegaven', titulo: 'Omegaven®' },
    ],
  },

  /* =================================================================================================
     Ficha 10 · Crear una NPT paso a paso (NE págs. 39-41 y 44-45)
     ================================================================================================= */
  'mu-npt-pauta': {
    entrada: 'Cómo se construye la bolsa: calorías y proteína, aminoácidos, primero lípidos y luego glucosa, el ritmo, y qué cambia con propofol o con riesgo de realimentación.',
    guia: [
      { id: 'npt-p-g2', corto: 'propofol 15 mL/h', tipo: 'test', fuente: 'mu-npt-paso1 · mu-nota-propofol',
        enunciado: 'Un adulto de 70 kg lleva propofol a 15 mL/h. Predice: ¿qué le quitas a las calorías de su NPT, con la cuenta del cap. 50?',
        opciones: [
          { t: '15 kcal al día', porque: 'Has tomado los mL/h como kcal al día. Son kcal por hora: 15 kcal/h × 24 h = 360 kcal. Con 15 darías 345 kcal de más y sobrealimentarías (p. 40).' },
          { t: '360 kcal al día: 15 mL/h = 15 kcal/h', ok: true },
          { t: 'Nada: el propofol es sedante, no nutriente', porque: 'El propofol va en una emulsión lipídica al 10 % y aporta calorías de lípido. Ignorarlas es darle más calorías de las que necesita (p. 40).' }],
        explicacion: 'El propofol va en una emulsión al 10 % (1 kcal/mL en el cap. 50): <span class="hl">los mL/h son las kcal/h</span>. 15 mL/h × 24 h = <span class="hl-rojo">360 kcal</span> a restar de las 1.750 kcal: quedan 1.390 kcal (' + pdf(40) + ').',
        nota: NOTA_PROPOFOL },
      { id: 'npt-p-g1', corto: 'primero los lípidos', tipo: 'test', fuente: 'mu-npt-paso3 · mu-npt-calc',
        enunciado: 'Para repartir las calorías no proteicas, ¿por qué el libro empieza por los lípidos y deja la glucosa para después?',
        opciones: [
          { t: 'Los lípidos se fijan en una cantidad estándar (250 mL al 20 % = 500 kcal) y la D50 rellena el resto', ok: true },
          { t: 'Porque los lípidos son la fuente principal, el 70 % de las calorías, y la glucosa solo un complemento', porque: 'El 70 % de las calorías no proteicas lo pone la glucosa; los lípidos, en torno al 30 %. Con la idea cambiada darías de más grasa y de menos glucosa (p. 36-37).' },
          { t: 'Porque la D50 no se puede mezclar con los aminoácidos', porque: 'Los aminoácidos «se pueden mezclar con las soluciones de glucosa y las emulsiones lipídicas» en la 3 en 1; no es un problema de compatibilidad sino de orden de cálculo (p. 37).' }],
        explicacion: 'Paso 3: «empieza por los lípidos»: 250 mL al 20 % = 500 kcal. Quedan 1.750 − 500 = <span class="hl">1.250 kcal</span> de glucosa; la D50 da 1,7 kcal/mL: 1.250 ÷ 1,7 = <span class="hl-rojo">735 mL</span> (' + pdf(40) + ').' },
      { id: 'npt-p-g3', corto: '42 mL/h', tipo: 'test', fuente: 'mu-npt-paso4 · mu-npt-calc',
        enunciado: 'La bolsa del ejemplo del libro sale a 84 mL/h. ¿Por qué empezar a 42 mL/h si hay riesgo de realimentación?',
        opciones: [
          { t: 'La ASPEN aconseja empezar al 40-50 % y subir con fosfato, potasio y magnesio', ok: true },
          { t: 'Porque a 84 mL/h la vía central se obstruye', porque: 'El motivo no es el catéter sino la carga de glucosa en quien tiene reservas bajas de fosfato, potasio, magnesio y tiamina. Con esa idea bajarías el ritmo sin vigilar los iones (p. 40 y 44).' },
          { t: 'Porque conviene empezar al 10 % del objetivo para no pasarse', porque: 'La recomendación es del 40-50 % (o 10-15 kcal/kg); el 10 % del objetivo dejaría a un desnutrido sin aporte suficiente durante días (p. 40 y 44).' }],
        explicacion: 'Con riesgo de realimentación: empezar al <span class="hl-rojo">40-50 %</span> del objetivo y avanzar «según lo permitan el fosfato, el potasio y el magnesio (4-7 días)». Al 50 % de 84 mL/h: <span class="hl">42 mL/h</span> (' + pdf(40) + ' y ' + pdf(44) + ').' },
      { id: 'npt-p-g5', corto: 'lípidos por kilo', tipo: 'test', fuente: 'mu-nota-lipidos · mu-npt-calc',
        enunciado: 'A 70 kg, 250 mL de lípidos al 20 % son 50 g al día. Predice: ¿cuántos g/kg/día y dónde queda frente a los máximos del libro?',
        opciones: [
          { t: '0,7 g/kg/día, por debajo de 1,5 y de 2,5', ok: true },
          { t: '1,6 g/kg/día, por encima del máximo de 1,5', porque: 'Has dividido 50 g entre 31 kg o has contado más volumen. Con 1,6 recortarías unos lípidos que no pasan de 0,7 y subirías la glucosa sin necesidad (p. 6 y 38).' },
          { t: '3,5 g/kg/día, por encima de los dos máximos', porque: 'Has mezclado gramos con mL: 250 mL al 20 % son 50 g, no 250. Con 3,5 pararías unos lípidos seguros (p. 38).' }],
        explicacion: '250 mL × 0,2 = 50 g; 50 ÷ 70 = <span class="hl-rojo">0,7 g/kg/día</span> (cálculo propio). El libro da un máximo de 1,5 (cap. 48, ' + pdf(6) + ') y de 2,5 g/kg/día (Tabla 50.2, ' + pdf(38) + ').',
        nota: NOTA_LIPIDOS },
    ],
    examen: [
      { id: 'npt-p-e1', corto: '1.750 kcal y 98 g', tipo: 'test', fuente: 'mu-npt-paso1',
        enunciado: 'Adulto de 70 kg sin propofol, proteína a 1,4 g/kg. ¿Qué calorías y proteína diarias da el paso 1?',
        opciones: [
          { t: '2.800 kcal y 98 g', porque: 'Has multiplicado 70 por 40 en vez de por 25. Con 2.800 kcal sobrealimentarías con riesgo de hipercapnia y esteatosis (p. 40 y 42).' },
          { t: '1.750 kcal y 98 g', ok: true },
          { t: '1.750 kcal y 140 g', porque: 'Has usado 2 g/kg como si fueran los 1,4 g/kg del ejemplo. La proteína de la bolsa quedaría un 43 % por encima de lo calculado (p. 40).' }],
        explicacion: 'GER = <span class="hl">25 × peso</span> = 1.750 kcal/día; proteína 1,4 g/kg × 70 = <span class="hl-rojo">98 g/día</span> (' + pdf(40) + ').' },
      { id: 'npt-p-e2', corto: 'D50 en mL', tipo: 'test', fuente: 'mu-npt-paso3',
        enunciado: 'Con lípidos 250 mL al 20 % y 1.750 kcal totales, ¿cuántos mL de D50 (1,7 kcal/mL) hacen falta?',
        opciones: [
          { t: '735 mL, que dan las 1.250 kcal que quedan', ok: true },
          { t: '1.029 mL: 1.750 ÷ 1,7, sin restar los lípidos', porque: 'Has cubierto todas las calorías con glucosa y has olvidado las 500 kcal de los lípidos. La bolsa pasaría de calorías y de volumen (p. 40).' },
          { t: '294 mL: 500 ÷ 1,7, las calorías de los lípidos', porque: 'Has hecho la cuenta con las calorías de los lípidos, no con las que quedan por cubrir. La bolsa se quedaría muy corta de energía (p. 40).' }],
        explicacion: '1.750 − 500 = 1.250 kcal; 1.250 ÷ 1,7 = <span class="hl-rojo">735 mL de D50</span> (' + pdf(40) + ').' },
      { id: 'npt-p-e3', corto: 'ritmo 84 mL/h', tipo: 'test', fuente: 'mu-npt-paso4',
        enunciado: 'En el ejemplo del libro, ¿qué volumen total tiene la bolsa y a qué ritmo va?',
        opciones: [
          { t: '2.015 mL en 24 h: 84 mL/h', ok: true },
          { t: '2.015 mL en 12 h: 168 mL/h', porque: 'La NPT del ejemplo se infunde en 24 h. En 12 h doblarías el ritmo de glucosa y empeorarías la hiperglucemia y la hipofosfatemia (p. 40-41).' },
          { t: '1.000 mL en 24 h: 42 mL/h', porque: 'Eso es solo el litro de aminoácidos, o el ritmo al 50 %. La bolsa completa suma aminoácidos, lípidos, D50 y 30 mL de aditivos (p. 40-41).' }],
        explicacion: '1 L + 250 mL + 735 mL + 30 mL = 2.015 mL; ÷ 24 = <span class="hl-rojo">84 mL/h</span> (' + pdf(40) + ').' },
      { id: 'npt-p-e4', corto: 'NPP y osmolaridad', tipo: 'test', fuente: 'mu-npp-limite · mu-npp-pauta', modeloVivo: { murallaViva: 'enteral' },
        enunciado: 'Una vía periférica para nutrición parenteral. ¿Qué osmolaridad máxima admite y qué calorías da la pauta clásica?',
        opciones: [
          { t: '<900 mOsm/L; 850 kcal de glucosa + 500 de lípidos = 1.350 kcal', ok: true },
          { t: '<900 mOsm/L; 500 kcal de glucosa y 850 de lípidos, en total 1.350 kcal', porque: 'Has intercambiado las cifras: 2,5 L de la mezcla dan 850 kcal de glucosa y 250 mL de lípidos al 20 %, 500 kcal. El reparto cambiaría la osmolaridad (p. 44-45).' },
          { t: '<2.500 mOsm/L, lo que tolera la D50', porque: 'La D50 tiene 2.525 mOsm/L y exige vía central. Con 2.500 por una periférica dañarías la vena (p. 36 y 44).' }],
        explicacion: 'Osmolaridad <span class="hl-rojo"><900 mOsm/L</span>, pH 7,2-7,4 (' + pdf(44) + '). Pauta: aminoácidos al 3 % + glucosa al 20 % (final 1,5 % y 10 %), 500 mOsm/L; 2,5 L = 850 kcal; con 250 mL de Intralipid 20 % (+500) = <span class="hl">1.350 kcal/día</span> (' + pdf(45) + ').' },
      { id: 'npt-p-e5', corto: 'nota de la pauta', tipo: 'error', fuente: 'mu-npt-pasos · mu-npt-paso1 · mu-npt-paso3 · mu-npt-paso4',
        enunciado: 'La nota de Froilán tras diseñar su bolsa. Encuentra los errores (puede haber 0, 1 o 2).',
        frases: [
          { t: 'GER 25 × 70 = 1.750 kcal; proteínas 1,4 × 70 = 98 g.' },
          { t: 'Del propofol a 10 mL/h se restan 10 kcal al día.', mal: true,
            c: '10 mL/h son <span class="hl-rojo">10 kcal/h</span>: 240 kcal al día (p. 40).' },
          { t: 'Se pone primero 250 mL de lípidos al 20 % (500 kcal) y la D50 cubre el resto.' },
          { t: 'Con riesgo de realimentación se empieza al 40-50 %.' }],
        explicacion: 'Propofol: los mL/h son kcal/h (' + pdf(40) + '); orden lípidos y D50 (' + pdf(40) + '); 40-50 % (' + pdf(40) + ' y ' + pdf(44) + ').' },
    ],
    casos: [
      { id: 'npt-fro', titulo: 'Froilán, 52 años: la bolsa de una isquemia intestinal', corto: 'Caso · Froilán (la pauta)', sub: 'isquemia intestinal, 70 kg, propofol',
        paciente: { Edad: '52 años', Motivo: 'isquemia intestinal, intestino fuera de uso', Peso: '70 kg', Antes: 'una semana casi sin comer', Sedación: 'propofol 10 mL/h' },
        pasos: [
          { momento: 'Día 3 · calorías y proteína', datos: { 'Peso': '70 kg', 'Proteína': '1,4 g/kg' }, nuevo: ['Peso', 'Proteína'], calculadora: { ir: 'mu-npt-calc', nombre: 'Construir la NPT' },
            pregunta: { id: 'npt-fro-1', tipo: 'test', fuente: 'mu-npt-paso1 · mu-npt-calc',
              enunciado: 'Sin propofol aún, con 70 kg y 1,4 g/kg: ¿calorías y proteínas del día?',
              opciones: [
                { t: '1.750 kcal y 98 g de proteína', ok: true },
                { t: '1.400 kcal y 98 g de proteína, con 20 kcal/kg de peso', porque: 'Has usado 20 kcal/kg (la cifra de la NPP del adulto no estresado). Para la NPT completa se parte de 25 × peso; te quedarías 350 kcal corto (p. 40 y 45).' },
                { t: '1.750 kcal y 70 g de proteína', porque: 'Has usado 1 g/kg, por debajo del rango de 1,2-2,0 g/kg. Con 70 g no cubrirías su catabolismo (p. 40).' }],
              explicacion: 'REE = 25 × 70 = 1.750 kcal; proteína = 1,4 × 70 = <span class="hl-rojo">98 g</span> (' + pdf(40) + '). La calculadora da 1.750 kcal y 98 g.' } },
          { momento: 'Día 3 · el propofol', datos: { 'Propofol': '10 mL/h' }, nuevo: ['Propofol'], calculadora: { ir: 'mu-npt-calc', nombre: 'Construir la NPT' },
            pregunta: { id: 'npt-fro-2', tipo: 'test', fuente: 'mu-npt-paso1 · mu-npt-calc · mu-nota-propofol',
              enunciado: 'Teclea 10 mL/h de propofol en la calculadora. ¿Cuántas kcal le quedan por cubrir con la NPT?',
              opciones: [
                { t: '1.510 kcal: 1.750 − 240', ok: true },
                { t: '1.740 kcal: 1.750 − 10', porque: 'Has restado los mL/h sin multiplicar por 24 h. Cubrirías 230 kcal más de las que le tocan y lo sobrealimentarías (p. 40).' },
                { t: '1.750 kcal: el propofol no cuenta', porque: 'El propofol va en una emulsión lipídica de 1 kcal/mL y sus calorías cuentan. Ignorarlas es sobrealimentar con riesgo de hipertrigliceridemia (p. 40 y 42).' }],
              explicacion: '10 mL/h × 1 kcal/mL × 24 = <span class="hl">240 kcal</span>; 1.750 − 240 = <span class="hl-rojo">1.510 kcal</span> (calculadora).',
              nota: NOTA_PROPOFOL } },
          { momento: 'Día 3 · los aminoácidos', datos: { 'Proteína': '98 g/día' },
            pregunta: { id: 'npt-fro-3', tipo: 'destapa', fuente: 'mu-npt-paso2',
              enunciado: 'La solución de aminoácidos es al 10 %. ¿Qué volumen pides y qué debes saber del redondeo?',
              cuantas: 'son tres cosas',
              puntos: [
                'Al 10 % son <span class="hl">100 g de proteína por litro</span>.',
                '98 g piden <span class="hl-rojo">980 mL</span> (calculadora); el libro lo redondea a 1 L.',
                'Es la misma cuenta: solo cambia el redondeo (2.015 mL en el libro, 1.995 en la calculadora).'],
              explicacion: 'Paso 2 y paso 4 (' + pdf(40) + ').' } },
          { momento: 'Día 3 · lípidos y glucosa', datos: { 'Lípidos': '250 mL al 20 %' }, nuevo: ['Lípidos'], calculadora: { ir: 'mu-npt-calc', nombre: 'Construir la NPT' },
            pregunta: { id: 'npt-fro-4', tipo: 'test', fuente: 'mu-npt-paso3 · mu-npt-calc',
              enunciado: 'Con 250 mL de lípidos y 1.510 kcal por cubrir, ¿cuánta D50 pides?',
              opciones: [
                { t: '594 mL: quedan 1.010 kcal ÷ 1,7', ok: true },
                { t: '735 mL: son los del ejemplo del libro sin propofol', porque: 'Los 735 mL son para 1.750 kcal. Aquí el propofol ya aporta 240 kcal, y usarías glucosa de más (hiperglucemia, p. 40-41).' },
                { t: '888 mL: 1.510 ÷ 1,7, sin restar los lípidos', porque: 'Has olvidado las 500 kcal de los lípidos. La glucosa se pasaría por 294 mL y subiría la glucemia (p. 40-41).' }],
              explicacion: '1.510 − 500 = 1.010 kcal; 1.010 ÷ 1,7 = <span class="hl-rojo">594 mL de D50</span> (calculadora). La cuenta es la de ' + pdf(40) + ' con el propofol restado.' } },
          { momento: 'Día 3 · el ritmo', datos: { 'Volumen': '980 + 250 + 594 + 30 = 1.854 mL' }, nuevo: ['Volumen'], calculadora: { ir: 'mu-npt-calc', nombre: 'Construir la NPT' },
            pregunta: { id: 'npt-fro-5', tipo: 'test', fuente: 'mu-npt-paso4 · mu-npt-calc',
              enunciado: 'Marca «riesgo de realimentación: sí» (lleva días sin comer). ¿A qué ritmo se infunde la bolsa completa y a cuánto se empieza?',
              opciones: [
                { t: '77 mL/h completo; empezar al 40-50 %: 31-39 mL/h', ok: true },
                { t: '84 mL/h completo; empezar a 42 mL/h', porque: 'Son las cifras del ejemplo del libro sin propofol. A Froilán, con 240 kcal de propofol menos, le tocaría una bolsa más pequeña (p. 40-41).' },
                { t: '77 mL/h desde el primer día, para no retrasar la nutrición', porque: 'Con riesgo de realimentación la ASPEN aconseja empezar al 40-50 % y subir con el fosfato, potasio y magnesio; a ritmo pleno arriesgas hipofosfatemia y arritmias (p. 40 y 44).' }],
              explicacion: '1.854 mL ÷ 24 = <span class="hl-rojo">77 mL/h</span>; al 40-50 %, 31-39 mL/h, y subir en 4-7 días (calculadora; criterio de ' + pdf(40) + ' y ' + pdf(44) + ').' } },
          { momento: 'Día 5 · los triglicéridos', datos: { 'Triglicéridos': '480 mg/dL (cifra del caso; el libro no da umbral)', 'Propofol': '10 mL/h', 'Lípidos': '250 mL al 20 %' }, nuevo: ['Triglicéridos', 'Propofol', 'Lípidos'],
            pregunta: { id: 'npt-fro-8', tipo: 'test', fuente: 'mu-nota-propofol · mu-npt-sobrecarga · mu-propofol',
              enunciado: 'Triglicéridos de 480 con propofol y 250 mL de lípidos. ¿Qué haces?',
              opciones: [
                { t: 'El propofol ya es lípido (1 kcal/mL): vigilar los triglicéridos y, si hay sobrecarga lipídica, suspender temporalmente los lípidos de la bolsa', ok: true },
                { t: 'Quitar la D50: la glucosa es la que sube los triglicéridos', porque: 'La glucosa pone en torno al 70 % de las calorías no proteicas, pero aquí la fuente de grasa es doble, propofol y bolsa; quitarla dejaría sin energía a Froilán y los lípidos seguirían sumando (p. 36 y 40).' },
                { t: 'Subir el ritmo de la bolsa para diluirlos', porque: 'Más ritmo es más lípido por hora: empeoras la sobrecarga lipídica, que puede resolverse cuando se suspenden temporalmente los lípidos (p. 43).' }],
              explicacion: 'El propofol va en una emulsión lipídica (<span class="hl">1 kcal/mL</span>, ' + pdf(40) + ') y se cuenta como grasa; puede dar hipertrigliceridemia y hay que vigilar los triglicéridos (' + pdf(5) + '). El síndrome de sobrecarga lipídica <span class="hl-rojo">puede resolverse al suspender temporalmente los lípidos</span> (' + pdf(43) + '). Cifra del caso: inventada.' } },
          { momento: 'Día 6 · si fuera solo una semana', datos: { 'Pregunta': '¿una vía periférica?' }, nuevo: ['Pregunta'],
            pregunta: { id: 'npt-fro-6', tipo: 'test', fuente: 'mu-npp-que · mu-npp-limite · mu-npp-pauta', modeloVivo: { murallaViva: 'enteral' },
              enunciado: 'Un compañero propone pasar la bolsa por una vena periférica «unos días». ¿Qué pides?',
              opciones: [
                { t: 'Osmolaridad <900 mOsm/L: no vale la D50; la NPP no es para el hipercatabólico', ok: true },
                { t: 'Nada: la bolsa completa va bien por una vena periférica si se pasa en 24 horas y con buen flujo', porque: 'La bolsa completa lleva D50 (2.525 mOsm/L) y daña la vena. La periférica admite <900 mOsm/L (p. 36 y 44).' },
                { t: 'Cambiar a lípidos solos, que son isotónicos', porque: 'La NPP combina aminoácidos y glucosa diluidos con lípidos; solo con lípidos no cubrirías la proteína de un hipercatabólico (p. 44-45).' }],
              explicacion: 'Periférica: <span class="hl-rojo"><900 mOsm/L</span>; la NPP aporta calorías no proteicas que ahorran proteína, y «no está pensada para el hipercatabólico ni el desnutrido» (' + pdf(44) + ' y ' + pdf(45) + ').' } },
          { momento: 'Día 7 · la nota de evolución', datos: { 'Nota': 'resumen de la pauta' }, nuevo: ['Nota'],
            pregunta: { id: 'npt-fro-7', tipo: 'error', fuente: 'mu-npt-pasos · mu-npt-paso1 · mu-npt-paso3 · mu-npt-paso4',
              enunciado: 'La nota de Froilán. Encuentra los errores (puede haber 0, 1 o 2).',
              frases: [
                { t: 'Del GER de 1.750 kcal se restan 240 kcal por el propofol a 10 mL/h.' },
                { t: 'Se pautan 250 mL de lípidos al 20 % (500 kcal) y 735 mL de D50.', mal: true,
                  c: 'Con el propofol restado quedan 1.010 kcal: son <span class="hl-rojo">594 mL de D50</span>. Los 735 mL son los del libro sin propofol (p. 40).' },
                { t: 'Por el riesgo de realimentación se arranca al 100 % del ritmo calculado (77 mL/h) para no perder días.', mal: true,
                  c: 'Con riesgo de realimentación se empieza al <span class="hl-rojo">40-50 %</span> y se sube en 4-7 días según fosfato, potasio y magnesio (p. 40 y 44).' },
                { t: 'La bolsa completa lleva D50 y va por vía central.' }],
              explicacion: 'Propofol y orden de los lípidos (' + pdf(40) + '), arranque al 40-50 % (' + pdf(40) + ' y ' + pdf(44) + '), D50 y vía central (' + pdf(36) + ').' } },
        ],
        lleva: [
          'Primero lípidos (250 mL al 20 % = 500 kcal) y luego D50 para el resto; en la calculadora, 594 mL con propofol a 10 mL/h.',
          'El propofol cuenta: los mL/h son kcal/h (1 kcal/mL en el cap. 50; 1,1 en el cap. 49).',
          'Con riesgo de realimentación se empieza al 40-50 % y se sube en 4-7 días según fosfato, potasio y magnesio; el propofol y la bolsa suman lípidos: vigilar triglicéridos.'],
        volver: { nombre: 'Construir la NPT', ancla: 'mu-npt-calc', modelo: { murallaViva: 'enteral' } } },
    ],
    profundizar: [
      { id: 'mu-npp-que', titulo: 'Nutrición parenteral periférica: qué es' },
      { id: 'mu-npp-pauta', titulo: 'Pauta de la NPP: 1.350 kcal' },
      { id: 'mu-npt-final', titulo: 'La última palabra: evitarla' },
    ],
  },

  /* =================================================================================================
     Ficha 11 · Complicaciones y realimentación (NE págs. 41-45)
     ================================================================================================= */
  'mu-npt-complicaciones': {
    entrada: 'Qué se tuerce con la glucosa y los lípidos de la bolsa, qué mata en la realimentación, y qué corregir antes de nutrir a un desnutrido.',
    guia: [
      { id: 'npt-c-g5', corto: 'meta de glucemia', tipo: 'test', fuente: 'mu-npt-hiperglucemia · mu-npt-insulina · mu-comparativa-glucemia',
        enunciado: 'La glucemia en NPT: ¿qué objetivo y qué insulina en el crítico?',
        opciones: [
          { t: 'Control estricto de 80-110 mg/dL con insulina en bolos', porque: 'El control estricto no se recomienda en el crítico: la hipoglucemia tiene peores consecuencias que la hiperglucemia (p. 41). El libro no da cifras de ese control; 80-110 es un ejemplo inventado.' },
          { t: '140-180 mg/dL, insulina regular en perfusión', ok: true },
          { t: '250 mg/dL con insulina NPH', porque: 'El libro no admite 250 como objetivo, y la NPH (inicio de 1-2 h, duración de 16-24 h, Tabla 50.4) es poco manejable en el crítico. Dejarías al paciente hiperglucémico (p. 41-42).' }],
        explicacion: 'Objetivo hospitalario <span class="hl-rojo">140-180 mg/dL</span>; en el crítico, <span class="hl">insulina regular en perfusión continua</span>, a menudo añadida a la mezcla (' + pdf(41) + '). La comparativa con el Manual UMI está en la ficha.' },
      { id: 'npt-c-g1', corto: 'el fosfato baja', tipo: 'test', fuente: 'mu-npt-fosfato · mu-real-que',
        enunciado: 'Al empezar la NPT, el fosfato baja. Antes de leer: ¿por qué baja al meter glucosa?',
        opciones: [
          { t: 'El fosfato entra en la célula con la glucosa, para cofactores como el pirofosfato de tiamina', ok: true },
          { t: 'Porque el riñón lo elimina de golpe cuando empieza la glucosa y deja al paciente sin reservas', porque: 'El mecanismo es un desplazamiento hacia el interior de la célula, no una pérdida renal. Si piensas en el riñón, no vigilarás el fosfato al empezar la NPT (p. 42).' },
          { t: 'Porque la D50 lo precipita en la bolsa y llega menos fosfato al paciente de lo previsto', porque: 'No es un problema de la bolsa. El fosfato baja en la sangre porque la glucosa lo arrastra a la célula; sin vigilarlo, aparece debilidad y arritmias (p. 42-43).' }],
        explicacion: 'El movimiento de la glucosa a las células se acompaña de fosfato (cofactores como el <span class="hl-azul">pirofosfato de tiamina</span>): hipofosfatemia progresiva, «un componente importante del síndrome de realimentación» (' + pdf(42) + ').' },
      { id: 'npt-c-g4', corto: 'colecistitis sin grasa', tipo: 'test', fuente: 'mu-npt-colestasis',
        enunciado: '¿Por qué una NPT larga puede acabar en colecistitis alitiásica?',
        opciones: [
          { t: 'Sin lípidos en el intestino proximal no hay colecistocinina y la vesícula no se contrae', ok: true },
          { t: 'Por los cálculos que forma la glucosa en la vesícula al cabo de varias semanas de perfusión', porque: 'Es una colecistitis alitiásica, sin cálculos; la causa es la ausencia de lípidos en el intestino, no la glucosa. Tratarías un cálculo que no existe (p. 43).' },
          { t: 'Por la infección del catéter central, que se extiende a la vía biliar por contigüidad', porque: 'Las complicaciones del catéter están en otros capítulos (2 y 3). Esta es una complicación metabólica de la NPT por ausencia de estímulo intestinal (p. 41 y 43).' }],
        explicacion: 'Colestasis, que puede llevar a colecistitis alitiásica por la «ausencia de lípidos en el intestino delgado proximal, que impide la contracción de la vesícula mediada por colecistocinina» (' + pdf(43) + ').' },
      { id: 'npt-c-g2', corto: 'qué mata', tipo: 'destapa', fuente: 'mu-real-clinica · mu-tabla-50-5 · mu-real-recomendaciones',
        enunciado: 'En la realimentación, ¿qué manifestaciones graves ves y qué tres cosas vigilas al subir la nutrición?',
        cuantas: 'son cuatro cosas',
        puntos: [
          'Taquiarritmias por <span class="hl-rojo">hipopotasemia e hipomagnesemia</span>; la Tabla 50.5 añade hipotensión.',
          'Alteración mental y acidosis láctica por <span class="hl-rojo">déficit de tiamina</span>; debilidad por el fosfato.',
          'Edema pulmonar por la retención de sodio.',
          'Se vigilan <span class="hl">fosfato, potasio y magnesio</span> mientras se avanza en 4-7 días.'],
        explicacion: 'Manifestaciones (' + pdf(43) + ' y ' + pdf(44) + '); vigilancia al avanzar (' + pdf(44) + '). El orden de vigilancia es el de la recomendación del libro: fosfato, potasio, magnesio.',
        nota: '<b>Nota de fidelidad.</b> La Tabla 50.5 imprime «Hidroxizina» y «Multivitaminas» entre los mecanismos: parecen un error de maquetación (la tabla 49.6 los trae como fármacos). Se reproduce la tabla tal cual (' + pdf(44) + ').' },
      { id: 'npt-c-g3', corto: 'tiamina antes', tipo: 'test', fuente: 'mu-real-recomendaciones · mu-tiamina', modeloVivo: { acidobaseVivo: 'lactica' },
        enunciado: 'Un desnutrido de alto riesgo va a empezar NPT. ¿Qué haces con la tiamina y con qué pauta?',
        opciones: [
          { t: 'Tiamina antes de nutrir, con la pauta de la Tabla 48.4', ok: true },
          { t: '100-200 mg de tiamina al día, como dice la ASPEN', porque: 'El libro califica esa dosis de insuficiente para corregir el déficit y propone la pauta de la Tabla 48.4. Con ella el déficit seguiría y la glucosa lo empeoraría (p. 44).' },
          { t: 'Después de la primera semana de NPT, cuando haya estabilidad', porque: 'La tiamina se empieza antes de la nutrición: la carga de glucosa agota unas reservas escasas (unos 30 mg). Esperar una semana arriesga encefalopatía y acidosis láctica (p. 8 y 44).' }],
        explicacion: '«Antes de empezar la nutrición se corrigen los electrolitos y se <span class="hl-rojo">empieza la tiamina</span>»: la ASPEN da 100-200 mg/día, <span class="hl">inadecuado para corregir el déficit</span>; es más apropiada la pauta de la Tabla 48.4 (' + pdf(44) + ' y ' + pdf(8) + ').' },
    ],
    examen: [
      { id: 'npt-c-e1', corto: 'hiperglucemia', tipo: 'test', fuente: 'mu-npt-hiperglucemia',
        enunciado: 'En una serie de pacientes con NPT, ¿qué proporción tuvo glucemias >200 mg/dL?',
        opciones: [
          { t: 'El 45 %', ok: true },
          { t: 'El 15 %: pocos pacientes', porque: 'Subestimas la frecuencia: la serie dio el 45 %, y el libro la llama frecuente. Con el 15 % no pensarías en vigilar la glucemia desde el primer día de la bolsa (p. 41).' },
          { t: 'El 75 %: la mayoría', porque: 'Sobrestimas la frecuencia: la serie dio el 45 %. Con el 75 % creerías que la insulina es siempre obligatoria y no ajustarías a cada paciente (p. 41).' }],
        explicacion: '«Glucemia >200 mg/dL en el <span class="hl-rojo">45 %</span> de los pacientes con NPT» (' + pdf(41) + ').' },
      { id: 'npt-c-e4', corto: 'lípidos y SDRA', tipo: 'test', fuente: 'mu-npt-inflamacion',
        enunciado: 'Un modelo animal de SDRA se hace con ácido oleico. ¿Qué enseña eso de los lípidos de soja de la NPT?',
        opciones: [
          { t: 'Que sus ω-6 y ω-9 inflaman y se asocian a peor oxigenación y fallo respiratorio', ok: true },
          { t: 'Que la soja solo empeora el SDRA si se pasa de 1,5 g/kg/día; por debajo es inocua', porque: 'Es un umbral inventado como distractor: el libro asocia los ω-6 y ω-9 con peor oxigenación y fallo respiratorio más largo sin fijar una dosis segura para eso. Con esa idea darías soja sin cautela a un SDRA por quedarte bajo 1,5 (p. 43).' },
          { t: 'Que los ω-3 del pescado son proinflamatorios y por eso se añaden a las emulsiones modernas', porque: 'Es al revés: los ω-3 del pescado tienen actividad antiinflamatoria, y por eso se incorporan a emulsiones como Smoflipid® (p. 43).' }],
        explicacion: 'El aceite de soja es rico en <span class="hl">ω-6 y ω-9</span>, precursores de eicosanoides; el <span class="hl-rojo">ácido oleico</span> (ω-9) infundido en la arteria pulmonar es un modelo animal de SDRA (' + pdf(43) + ').' },
      { id: 'npt-c-e2', corto: 'criterios ASPEN', tipo: 'test', fuente: 'mu-real-calc · mu-real-clinica',
        enunciado: 'Alto riesgo de realimentación según el libro. ¿Cuál NO es uno de los cinco criterios?',
        opciones: [
          { t: 'Haber perdido un 5 % del peso en los últimos 6 meses', ok: true },
          { t: 'IMC ≤18,5 kg/m²', porque: 'Sí es un criterio: IMC ≤18,5. Si lo descartases, nutrirías a ritmo pleno a un desnutrido de riesgo (p. 44).' },
          { t: 'Ingesta pobre en los últimos 5 días', porque: 'Sí es un criterio. Si lo ignoras no pides los electrolitos ni la tiamina antes de nutrir (p. 44).' }],
        explicacion: 'Los cinco: pérdida de peso del <span class="hl-rojo">5 % en un mes</span> o >10 % en 6 meses (un 5 % en 6 meses no cuenta); <span class="hl-rojo">IMC ≤18,5</span>; ingesta pobre 5 días; potasio, fosfato o magnesio bajos de entrada; alto riesgo de desnutrición (p. ej. drogas) (' + pdf(44) + ').' },
      { id: 'npt-c-e3', corto: 'cuánto empezar', tipo: 'test', fuente: 'mu-real-recomendaciones',
        enunciado: 'Alto riesgo de realimentación. ¿Con cuánto se empieza la nutrición y en cuánto tiempo se sube?',
        opciones: [
          { t: '40-50 % del objetivo (10-15 kcal/kg/día) o 150 g de glucosa; 4-7 días', ok: true },
          { t: '100 % del objetivo desde el primer día, para recuperar cuanto antes el déficit acumulado', porque: 'Es lo que provoca el síndrome: carga de glucosa sobre reservas de fosfato, potasio, magnesio y tiamina al límite. Arritmias y edema pulmonar (p. 43-44).' },
          { t: '25 kcal/kg el primer día y 40 kcal/kg a la semana', porque: 'Las 25 kcal/kg son la meta plena del ejemplo, no el comienzo del que tiene riesgo. Las cifras de arranque son 10-15 kcal/kg (p. 40 y 44).' }],
        explicacion: '40-50 % de lo necesario (o <span class="hl-rojo">10-15 kcal/kg/día</span>), o glucosa a <span class="hl">150 g/día (300 mL de D50)</span>, y avanzar durante <span class="hl">4-7 días</span> vigilando fosfato, potasio y magnesio (' + pdf(44) + ').' },
      { id: 'npt-c-e5', corto: 'nota de nutrición', tipo: 'error', fuente: 'mu-real-calc · mu-real-recomendaciones · mu-npt-hiperglucemia',
        enunciado: 'Una nota de evolución. Encuentra los errores (puede haber 0, 1 o 2).',
        frases: [
          { t: 'Glucemia objetivo 140-180 mg/dL con insulina regular en perfusión.' },
          { t: 'Se empieza al 40-50 % del objetivo y se avanza en 4-7 días.' },
          { t: 'Para cubrir el déficit de tiamina bastan los 100-200 mg/día de la ASPEN.', mal: true,
            c: 'El libro dice que esa dosis es <span class="hl-rojo">inadecuada</span> para corregir el déficit; se usa la pauta de la Tabla 48.4 (p. 44).' },
          { t: 'La hipofosfatemia es un componente importante del síndrome de realimentación.' }],
        explicacion: 'Glucemia (' + pdf(41) + '), arranque y tiamina (' + pdf(44) + '), fosfato (' + pdf(42) + ').' },
    ],
    casos: [
      { id: 'npt-eng', titulo: 'Engracia, 38 años: una anorexia y una bolsa con prisa', corto: 'Caso · Engracia (realimentación)', sub: 'anorexia grave, ayuno de 7 días',
        paciente: { Edad: '38 años', Motivo: 'anorexia nerviosa, ingesta nula 7 días', Peso: '40 kg', Talla: '163 cm (IMC 15)' },
        pasos: [
          { momento: 'Ingreso · el riesgo', datos: { 'IMC': '15', 'Ingesta': 'nula 7 días' }, nuevo: ['IMC', 'Ingesta'], calculadora: { ir: 'mu-real-calc', nombre: '¿Alto riesgo de realimentación?' },
            pregunta: { id: 'npt-eng-1', tipo: 'test', fuente: 'mu-real-calc',
              enunciado: 'Marca en la calculadora lo que cumple Engracia. ¿Qué dos criterios de la ASPEN reúne y qué resultado da?',
              opciones: [
                { t: 'IMC ≤18,5 e ingesta pobre 5 días: alto riesgo', ok: true },
                { t: 'Ninguno: el IMC solo cuenta si hay pérdida de peso reciente', porque: 'El IMC ≤18,5 es un criterio por sí solo. Si lo ignoras empiezas a ritmo pleno a una paciente de 40 kg y le provocas hipofosfatemia (p. 44).' },
                { t: 'Solo la ingesta: el IMC es criterio de la enteral, no de la parenteral', porque: 'Los criterios de riesgo valen para cualquier soporte nutricional. Con esa idea nutrirías sin electrolitos ni tiamina previos (p. 44).' }],
              explicacion: 'IMC 15 (≤18,5) e ingesta pobre más de 5 días: <span class="hl-rojo">alto riesgo de realimentación</span> (' + pdf(44) + ').' } },
          { momento: 'Ingreso · la analítica', datos: { 'Fosfato': '1,1 mg/dL', 'Potasio': '3,0 mEq/L', 'Magnesio': '1,5 mg/dL' }, nuevo: ['Fosfato', 'Potasio', 'Magnesio'], calculadora: { ir: 'mu-real-calc', nombre: '¿Alto riesgo de realimentación?' },
            pregunta: { id: 'npt-eng-2', tipo: 'destapa', fuente: 'mu-real-recomendaciones · mu-real-que',
              enunciado: 'Fosfato, potasio y magnesio bajos de entrada. Marca ese criterio. ¿Qué haces antes de poner un solo gramo de glucosa?',
              cuantas: 'son tres cosas',
              puntos: [
                '<span class="hl-rojo">Corregir los electrolitos</span> (fosfato, potasio, magnesio) antes de empezar.',
                '<span class="hl-rojo">Empezar la tiamina</span> antes de nutrir.',
                'Un criterio más de la ASPEN: tres en total, y la glucosa de la NPT agravaría los tres iones.'],
              explicacion: 'Antes de iniciar el soporte nutricional: corregir los electrolitos y empezar la tiamina (' + pdf(44) + '). Cifras del caso: inventadas, bajas respecto a los rangos habituales.' } },
          { momento: 'Ingreso · la tiamina', datos: { 'Tiamina': '100-200 mg/día (ASPEN)', 'Fosfato tras reponer': '2,6 mg/dL' }, nuevo: ['Tiamina', 'Fosfato tras reponer'],
            pregunta: { id: 'npt-eng-3', tipo: 'test', fuente: 'mu-real-recomendaciones · mu-tiamina', modeloVivo: { acidobaseVivo: 'lactica' },
              enunciado: 'Quieren pautar tiamina oral 100 mg al día. ¿Qué propones?',
              opciones: [
                { t: 'La pauta de la Tabla 48.4 (IV al principio)', ok: true },
                { t: 'Esa pauta de 100-200 mg: es la de la ASPEN', porque: 'El libro la considera inadecuada para corregir el déficit. Engracia seguiría con déficit de tiamina y, con la glucosa, aparecería encefalopatía y acidosis láctica (p. 44).' },
                { t: 'Aplazarla hasta que coma sola y esté estable', porque: 'La tiamina se empieza antes de nutrir. Aplazarla es dejar a una paciente con reservas escasas (unos 30 mg) frente a una carga de glucosa (p. 8 y 44).' }],
              explicacion: 'Pauta de la Tabla 48.4 (ver la ficha de tiamina): la dosis ASPEN de 100-200 mg es <span class="hl-rojo">inadecuada</span> para corregir el déficit (' + pdf(44) + ' y ' + pdf(11) + '). Con la reposición se corrige también el magnesio para que la tiamina se pueda utilizar (' + pdf(11) + ').' } },
          { momento: 'Día 1 · cuánto nutrir', datos: { 'Peso': '40 kg' }, nuevo: ['Peso'], calculadora: { ir: 'mu-real-calc', nombre: '¿Alto riesgo de realimentación?' },
            pregunta: { id: 'npt-eng-4', tipo: 'test', fuente: 'mu-real-recomendaciones · mu-real-calc',
              enunciado: 'Con el peso de 40 kg tecleado, ¿cuánto das el primer día y cómo subes?',
              opciones: [
                { t: '400-600 kcal/día (10-15 kcal/kg), o 150 g de glucosa; subir en 4-7 días', ok: true },
                { t: '1.000 kcal/día (25 kcal/kg) para recuperar peso cuanto antes y salir de la UCI', porque: 'Eso es la meta plena (25 kcal/kg), no el arranque. Con 1.000 kcal el primer día la carga de glucosa causaría hipofosfatemia, arritmias y edema pulmonar (p. 40 y 43-44).' },
                { t: '150 kcal/día durante dos semanas, hasta que el peso esté estable y el fosfato normal', porque: 'El libro no propone un ayuno parcial mantenido: se avanza en 4-7 días según fosfato, potasio y magnesio. Dos semanas a 150 kcal prolongarían la desnutrición (p. 44).' }],
              explicacion: '10-15 kcal/kg × 40 kg = <span class="hl-rojo">400-600 kcal/día</span> (calculadora); 150 g de glucosa son 300 mL de D50, y se sube en <span class="hl">4-7 días</span> (' + pdf(44) + ').' } },
          { momento: 'Día 1 · el plan del residente', datos: { 'Plan': 'propuesta escrita' }, nuevo: ['Plan'],
            pregunta: { id: 'npt-eng-5', tipo: 'error', fuente: 'mu-real-recomendaciones · mu-real-que',
              enunciado: 'El plan que propone el R1. Encuentra los errores (puede haber 0, 1 o 2).',
              frases: [
                { t: 'Corregir fosfato, potasio y magnesio y empezar la tiamina antes de nutrir.' },
                { t: 'Empezar a 25 kcal/kg el primer día y vigilar el fosfato semanalmente.', mal: true,
                  c: 'Se empieza al <span class="hl-rojo">40-50 %</span> (10-15 kcal/kg/día) y se vigilan fosfato, potasio y magnesio mientras se avanza durante 4-7 días, no una vez por semana (p. 44).' },
                { t: 'Alternativa de arranque: glucosa a 150 g/día (300 mL de D50).' },
                { t: 'La tiamina por la pauta de la Tabla 48.4, no por 100-200 mg.' }],
              explicacion: 'Recomendaciones de realimentación (' + pdf(44) + ').' } },
          { momento: 'Día 2 · la debilidad', datos: { 'Fosfato': '1,2 mg/dL', 'Clínica': 'debilidad generalizada' }, nuevo: ['Fosfato', 'Clínica'],
            pregunta: { id: 'npt-eng-6', tipo: 'test', fuente: 'mu-tabla-50-5 · mu-npt-fosfato · mu-real-clinica',
              enunciado: 'Engracia, con 400 kcal desde ayer, está débil y el fosfato ha bajado de 2,6 (tras reponerlo) a 1,2 mg/dL. ¿Qué haces?',
              opciones: [
                { t: 'Frenar el avance de la nutrición y reponer el fosfato: hipofosfatemia por la glucosa', ok: true },
                { t: 'Subir a 1.000 kcal: la debilidad es de la desnutrición y mejorará al darle más energía', porque: 'La debilidad generalizada es la manifestación de la hipofosfatemia en la Tabla 50.5. Subir la glucosa empeoraría el fosfato: la glucosa arrastra fosfato a la célula (p. 42; Tabla 50.5, p. 43-44).' },
                { t: 'Suspender la tiamina por si la debilidad es un efecto secundario de la perfusión', porque: 'La debilidad no viene de la tiamina; su déficit da alteración mental y acidosis láctica. Retirarla expondría a la paciente a una encefalopatía (p. 43-44).' }],
              explicacion: 'Debilidad generalizada = <span class="hl-rojo">hipofosfatemia</span> (Tabla 50.5), glucosa-dependiente (' + pdf(42) + ' y ' + pdf(44) + '). El libro manda avanzar solo «según lo permitan» fosfato, potasio y magnesio (' + pdf(41) + '); la reposición, sin cifra aquí, está en la ficha de fósforo del Cap. 38 (Tabla 38.5, pág. 51): <button type="button" class="especialidad-link" data-especialidad="libros" data-view="marinoRenal" data-panel="panel-marino-renal-tabs" data-tab="mr-fosforo">Hipofosfatemia y su reposición →</button>. Cifras del caso: inventadas.' } },
          { momento: 'Día 4 · el peso sube', datos: { 'Peso': '+2 kg en 48 h', 'Disnea': 'leve, crepitantes' }, nuevo: ['Peso', 'Disnea'],
            pregunta: { id: 'npt-eng-7', tipo: 'test', fuente: 'mu-real-clinica · mu-real-que',
              enunciado: 'Dos kilos en dos días, crepitantes y disnea leve, sin infección. ¿Qué componente del síndrome piensas?',
              opciones: [
                { t: 'Retención de sodio: edema pulmonar', ok: true },
                { t: 'Hipomagnesemia: taquiarritmia', porque: 'La hipomagnesemia con la hipopotasemia da taquiarritmias, no edema ni ganancia de peso. Mirarías el monitor y no la sobrecarga de sodio (p. 43-44).' },
                { t: 'Déficit de tiamina: acidosis láctica', porque: 'El déficit de tiamina da alteración mental y acidosis láctica. Con ese diagnóstico buscarías el lactato y no frenarías el aporte de sodio ni de líquidos (p. 43-44).' }],
              explicacion: 'Retención renal de sodio (quizá por la hipoalbuminemia de la desnutrición) → <span class="hl-rojo">edema pulmonar</span> (' + pdf(43) + ' y ' + pdf(44) + ').' } },
        ],
        lleva: [
          'IMC ≤18,5 e ingesta pobre 5 días: alto riesgo; electrolitos y tiamina (pauta de la Tabla 48.4, no 100-200 mg) antes de nutrir.',
          'Se empieza al 40-50 % (10-15 kcal/kg/día) o con 150 g de glucosa y se sube en 4-7 días vigilando fosfato, potasio y magnesio.',
          'Debilidad = fosfato; arritmias = potasio y magnesio; alteración mental y lactato = tiamina; edema pulmonar = sodio.'],
        volver: { nombre: '¿Alto riesgo de realimentación?', ancla: 'mu-real-calc', modelo: { acidobaseVivo: 'lactica' } } },
    ],
    profundizar: [
      { id: 'mu-tabla-50-4', titulo: 'Tabla 50.4 · Insulinas y su duración' },
      { id: 'mu-npt-sobrecarga', titulo: 'Síndrome de sobrecarga lipídica' },
      { id: 'mu-comparativa-glucemia', titulo: 'Glucemia: Marino y el Manual UMI' },
      { id: 'mu-npt-esteatosis', titulo: 'Esteatosis hepática' },
    ],
  },
};

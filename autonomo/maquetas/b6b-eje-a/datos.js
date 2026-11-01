// Datos del eje hormonal (opción A «El termostato hormonal»). Fuente: Marino 2024, cap. 51 (docs/marino-2024-nutricion-endocrino-caps48-51.pdf; página = página del PDF).
// Lo que Marino no dice (retroalimentación, TRH→TSH→T4→T3, desyodasas, recuperación del eje) se rotula con su fuente: LA = Libro Azul cap. 45; Younes 2017; Huang-Bianco 2008.
export const PDF = '../../docs/marino-2024-nutricion-endocrino-caps48-51.pdf';
export const LA = 'LA p. 4-6';
// c = 'página:id de la ficha' ; pagDe / fichaDe lo separan
export const pagDe = (c) => +String(c).split(':')[0];
export const fichaDe = (c) => String(c).split(':')[1] || 'mu-suprarrenal';
export const PRESETS = {
  tori: { nombre: 'Toribio 61 · shock séptico', gl: 'adr', estres: 3, circi: true, txt: 'Toribio, 61: shock séptico, noradrenalina 0,4 tras 3 L. La hipotensión no responde al volumen: el eje suprarrenal está bloqueado en tres puntos.' },
  bibi: { nombre: 'Bibiana 74 · prednisona un año', gl: 'adr', estres: 1, dias: 365, txt: 'Bibiana, 74: un año con prednisona 10 mg y hoy la operan. El eje lleva meses sin trabajar y la glándula está encogida.' },
  sinf: { nombre: 'Sinforoso 82 · dormido y en FA', gl: 'tir', pat: 'graves', txt: 'Sinforoso, 82: letargia y fibrilación auricular nueva. Hipertiroidismo primario apático: la glándula va sola y la TSH se apaga.' },
  lucr: { nombre: 'Lucrecia 31 · Graves + neumonía', gl: 'tir', pat: 'graves', estres: 1, asma: true, txt: 'Lucrecia, 31: Graves con neumonía, T 40,8 °C y FC 152. Tormenta tiroidea; asma leve.' },
  poli: { nombre: 'Policarpo 70 · amiodarona', gl: 'tir', farm: 'amio', txt: 'Policarpo, 70: amiodarona por FA, T4 libre 2,4 con TSH normal. La tijera T4→T3 está bloqueada, no la glándula.' },
  obdu: { nombre: 'Obdulia 77 · hallada en casa', gl: 'tir', pat: 'hipoP', estres: 1, txt: 'Obdulia, 77: T 33,5 °C, Na⁺ 122, FC 48 y confusa. Hipotiroidismo primario con coma mixedematoso.' },
  fulg: { nombre: 'Fulgencio 66 · UCI día 5', gl: 'tir', estres: 3, txt: 'Fulgencio, 66: día 5 de UCI por neumonía. T3 y T4 libres bajas con TSH normal: la tijera se oxida, la glándula está bien.' },
};
export const IDEA = ['Tres estaciones y un cable: el hipotálamo manda a la hipófisis, la hipófisis a la glándula, y la hormona final vuelve por el cable a frenar a las dos primeras. Cada enfermedad corta o estira un sitio.', '47:mu-sr-eje'];
export const TABLA512 = [['normal', 'Normal', '0,8-1,8 ng/dL', '0,3-4,5 mU/mL'], ['hyper', 'Hipertiroidismo primario', '↑', '↓'], ['t3tox', 'T3-toxicosis', 'N', '↓'], ['hiperx', 'Hipertiroxinemia eutiroidea', '↑', 'N'], ['hipoP', 'Hipotiroidismo primario', '↓', '↑'], ['hipoS', 'Hipotiroidismo secundario', '↓', '↓'], ['euS', 'Eutiroideo enfermo', '↓', 'N']];
export const FUENTES = [['Marino 2024, cap. 51: eje y cortisol', 47], ['Marino: CIRCI, diagnóstico y Fig. 51.1', 50], ['Marino: tratamiento y retirada', 51], ['Marino: T4, T3, TSH y Tabla 51.2', 52], ['Marino: tormenta, amiodarona, betabloqueantes', 54], ['Marino: antitiroideos, yodo, hipotiroidismo', 55], ['Marino: coma mixedematoso y eutiroideo enfermo', 56]];
export const FUENTES_EXT = [
  'LA = Libro Azul, Sección VI, cap. 45 «Respuesta endocrina al estrés» (docs/libro-azul-seccion-vi-endocrino.pdf, PDF p. 4-6): la cadena CRH→ACTH→cortisol, TRH→TSH→T4/T3 y la retroalimentación negativa.',
  'Younes AK, Younes NK. Recovery of steroid induced adrenal insufficiency. Transl Pediatr 2017;6(4):269-273 (PMID 29184808): el corticoide frena hipotálamo e hipófisis, la suprarrenal se atrofia; recuperación de 6-12 meses. Es pediátrico.',
  'Huang SA, Bianco AC. Reawakened interest in type III iodothyronine deiodinase in critical illness and injury. Nat Clin Pract Endocrinol Metab 2008 (PMID 18212764): D1/D2 activan T4→T3, D3 la inactiva (rT3).'];
export const NOTAS = [
  ['fuentes discrepan', 'La TSH: la Tabla 51.2 usa mU/mL (0,3-4,5) y el texto habla de «<0,01 mU/dL» y «>10 mU/dL» (p. 53, 56). La maqueta usa mU/mL de la tabla.'],
  ['fuente no lo dice', 'Marino no trae la retroalimentación negativa ni la cadena TRH→TSH→T4→T3. El cable y las flechas de hormona vienen del Libro Azul (LA p. 4-6), de Younes y de Huang-Bianco, rotulados así en la pantalla.'],
  ['fuente no lo dice', 'Propranolol IV en la tormenta: la Tabla 51.3 dice «60-80 mg IV o PO cada 4 h» sin más detalle (p. 54). No se dibuja un bolo: la maqueta ofrece propranolol oral.'],
  ['fuente no lo dice', 'Marino no da el cortisol normal en reposo ni los valores de T3. Los números del monitor que no están en la ficha están rotulados «ilustrativo». Los tiempos de recuperación del eje en el adulto por dosis y duración: hueco.'],
  ['opinión del autor', 'Marino cierra el capítulo con «Much ado about not much» (p. 57): el cortisol del crítico y el eutiroideo enfermo tendrían poca relevancia clínica. La maqueta enseña el mecanismo; lo que se hace lo dice cada página citada.'],
  ['fuente no lo dice', 'Una Δ ≥9 tras ACTH no descarta la insuficiencia secundaria (p. 51); la ACTH plasmática la diagnostica y casi no se pide en la UCI.']];
export const PROFUNDIZAR = ['La metilprednisolona frente a la dexametasona como antiinflamatorio (ficha «Esteroides como antiinflamatorios», p. 51).', 'Hiponatremia e hiperpotasemia: raras en la supresión del crítico (p. 50).', 'Causas raras de hipotiroidismo: Sheehan, tetraciclinas (p. 55-56); la obesidad no es consecuencia (p. 56).', 'Esmolol en la tirotoxicosis: 50-100 µg/kg/min (Tabla 51.3, p. 54).', 'Cuánto tarda en volver el eje en el adulto: sin cifra en Marino ni en las fuentes abiertas (hueco).'];
export const CRECERA = ['Calculadoras de la ficha (cortisol, tiroides, tormenta, levotiroxina): el eje abre la calculadora y copia su resultado.', 'Receptor vivo del glucocorticoide y shock vivo: el eje enlaza a ellos para el shock séptico.', 'Mayéutica completa y examen de las tres fichas.'];

// Cráneo vivo · opción C «El flujo». Datos: fuentes, pacientes, notas. Cada cifra con su página (N = Marino 2024, caps. 45-47).
export const PDF = '../../docs/marino-2024-neurologia-caps45-47.pdf';
// página del PDF → párrafo de la ficha (data-resaltar); el sufijo «:id» de una cita fuerza otro párrafo de la misma página
export const FICHA = { 14: 'mn-me-calc', 16: 'mn-me-apnea-pasos', 34: 'mn-isq-oxigeno', 35: 'mn-isq-o2-recomendacion', 36: 'mn-isq-hta', 37: 'mn-isq-hipotension', 38: 'mn-isq-aspirina', 39: 'mn-isq-hemorragia', 40: 'mn-isq-edema', 45: 'mn-hic-ppc', 47: 'mn-hsa-inmediato', 48: 'mn-hsa-vigilar' };
export const fichaDe = (c) => { const [p, id] = String(c).split(':'); return id || FICHA[p] || 'mn-ictus-soporte'; };
export const pagDe = (c) => String(c).split(':')[0];
// Umbrales (una sola vez): PIC <20 y PPC = PAM − PIC, objetivo 50-70 (N p. 45); PPC <50 «a evitar» (Manual UMI, ficha umi-pic); PAM >65 (N p. 37)
export const UMBRALES = { pic: 20, ppcMin: 50, ppcMax: 70, pamMin: 65, pasSin: 220, pasTpa: 180, padTpa: 105, sat: 94, satMin: 90, glu: [140, 180], gluBaja: 70, febril: 38 };
// Cifras ilustrativas (Marino da la dirección, no la magnitud): se rotulan así en pantalla
export const ILUS = { vpp: 4, nitro: 5, o2Max: 0.225, vasoMax: 0.25, dtc0: 60, dtcVaso: 1.5, anillos: [90, 78, 66], tMax: 40.5, gluMax: 400 };
export const PRESETS = {
  herme: { nombre: 'Hermenegildo · con tPA', s: { pam: 136, pp0: 78, pic: 12, fio2: 21, sat0: 93, glu: 215, temp: 37.4, dia: 0, tpa: true, hsa: false }, txt: 'Hermenegildo, 58 años: ictus de la cerebral media izquierda, tPA en urgencias. PA 188/110, SaO₂ 93 % sin O₂, glucosa 215.' },
  sin: { nombre: 'Hermenegildo · sin tPA', s: { pam: 140, pp0: 90, pic: 12, fio2: 21, sat0: 93, glu: 150, temp: 37.2, dia: 0, tpa: false, hsa: false }, txt: 'Hermenegildo en urgencias, ictus sin trombólisis: PA 200/110.' },
  err: { nombre: 'Hermenegildo · 6 h tras tPA', s: { pam: 134, pp0: 78, pic: 12, fio2: 21, sat0: 97, glu: 210, temp: 37.3, dia: 0, tpa: true, hsa: false }, txt: 'Hermenegildo, tPA hace 6 h: PA 186/108, SaO₂ 97 %, glucosa 210.' },
  petro: { nombre: 'Petronila · HSA', s: { pam: 125, pp0: 60, pic: 14, fio2: 21, sat0: 97, glu: 130, temp: 37.0, dia: 0, tpa: false, hsa: true }, txt: 'Petronila, 48 años: cefalea en trueno, GCS 14, sangre en las cisternas. PA 165/95. Día 0 de la hemorragia subaracnoidea.' },
};
export const IDEA = ['La sangre llega al cerebro empujada por la presión de perfusión: PPC = PAM − PIC. En un ictus la autorregulación está rota y el flujo de la penumbra depende de esa presión.', '45:mn-hic-ppc'];
export const FUENTES = [['Marino 2024, cap. 47: ictus (oxígeno, ventilación, PA, glucosa, fiebre)', 34], ['Autorregulación alterada y recomendaciones de PA (Tabla 47.2)', 36], ['Hipotensión, glucosa y fiebre', 37], ['Hemorragia tras trombólisis 6,4-8,8 % (Fig. 47.2)', 39], ['PIC <20 y PPC = PAM − PIC (Ec. 47.1)', 45], ['Isquemia diferida de la HSA y Doppler transcraneal', 48], ['Manual UMI (PPC <70 pronóstico, <50 evitar; Doppler transcraneal): ficha umi-pic en la app', 0]];
export const NOTAS = [
  ['fuente no lo dice', 'Marino no trae la curva de autorregulación del cerebro sano ni el efecto del CO₂ sobre la PIC. La meseta del gráfico es una forma ilustrativa, sin cifras; otra fuente, pendiente.'],
  ['fuente no lo dice', 'Marino no da un objetivo de PPC en el ictus isquémico (solo 50-70 en la hemorragia intracerebral, p. 45). El monitor muestra la PPC y avisa por debajo de 50 con el Manual UMI como fuente.'],
  ['fuente no lo dice', 'Cuánto sube la PIC con la presión positiva o el nitroprusiato, cuánto baja el flujo con cada punto de PA y las velocidades del Doppler son ilustrativas: el libro da la dirección (p. 35-36, 48). El 15-30 % de caída con O₂ al 100 % sí es del libro (p. 34).'],
  ['fuente no lo dice', 'Marino escribe «>220/120» y «<180/105» sin decir si basta una de las dos cifras. El modelo salta cuando cualquiera de las dos se pasa.'],
  ['opinión del autor', 'Marino prefiere SaO₂ 90-92 % porque la guía pide mantener >94 % (p. 35), y recomienda algo de albúmina al 5 % en la reanimación (p. 37).'],
  ['fuente no lo dice', 'Marino no fija la cifra de hipoglucemia ni de fiebre. Se usan 70 mg/dL y 38 °C (fisiología general; cita pendiente).'],
];
export const PROFUNDIZAR = ['Hematoma que crece, edema y hernia: el cráneo de otras fichas (hemorragia intracerebral p. 41-45; edema p. 40-41).', 'Tabla del Doppler transcraneal y cambios de velocidad: Manual UMI (ficha umi-pic).', 'Hiponatremia de la HSA (35 %, p. 48): iones vivos.'];
export const CRECERA = ['El pulmón y el respirador: PaCO₂ y PIC, cuando haya otra fuente.', 'Pupilas y cara de Glasgow en el cráneo (herniación).', 'El bolo de salino hipertónico (Tabla 47.3) como mando.'];

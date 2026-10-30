// Fármacos de la cabecera de la disección aórtica (Marino cap. 20, p. 46-47, 51-52; docs/marino-2024-cardiac-disorders-caps18-21.pdf).
// Sin DOM. La DIRECCIÓN de cada efecto es de la ficha; la MAGNITUD de cada constante es ilustrativa (la fuente no la da).
//   · Betabloqueo (esmolol, labetalol, metoprolol): baja la FC y la contractilidad (p. 46-47, 51) y embota el reflejo
//     taquicárdico del barorreceptor (por eso el vasodilatador «solo con betabloqueo»: p. 52).
//   · Nicardipino (calcioantagonista, vasodilatador arterial): baja las resistencias; solo, la PA baja y el reflejo da
//     taquicardia y más gasto, que es la cizalla que se quiere evitar (p. 52).
//   · Nitroprusiato: vasodilatador arterial y venoso (p. 52). Opioide: quita el dolor y baja un poco FC y PA (p. 52).
// Devuelve factores sobre lo basal del paciente: { fR, fVu, fCao, fEes, fFc, bloqueo (0-1: cuánto del reflejo de FC se anula) }.
export const DISEC = {
  esmolol: { max: 200, paso: 25, ini: 50, bolo: 500 },            // µg/kg/min; bolo 500 µg/kg (p. 51)
  nicardipino: { max: 15, paso: 2.5, ini: 5 },                    // mg/h (p. 52)
  labetalol: { max: 300 },                                        // mg acumulados (p. 52)
  nitroprusiato: { aviso: 3, max: 5, ini: 0.2 },                  // µg/kg/min (p. 52)
};
const k = {
  esmolFc: 0.0034, esmolEes: 0.0026, esmolBloq: 0.0100,           // por µg/kg/min de esmolol (ilustrativo)
  nicR: 0.031, nicC: 0.06,                                                   // fracción de RVS por mg/h de nicardipino (ilustrativo)
  labFc: 0.0011, labEes: 0.0007, labR: 0.0010, labBloq: 0.0050, // por mg de labetalol (β y α, 1:7 por vía IV)
  nitR: 0.07, nitC: 0.12, nitVu: 0.03,                                        // por µg/kg/min de nitroprusiato
  opR: 0.07, opFc: 0.07,                                          // opioide puesto (p. 52): baja el dolor, la FC y la PA
};
export function factoresDiseccion(a) {
  const es = a.esmolol || 0, ni = a.nicardipino || 0, lab = a.labetalol || 0, nit = a.nitroprusiato || 0, op = a.opioide ? 1 : 0;
  const bloq = Math.min(1, es * k.esmolBloq + lab * k.labBloq);
  return {
    fR: Math.max(0.35, 1 - ni * k.nicR - lab * k.labR - nit * k.nitR - op * k.opR),
    fVu: 1 + nit * k.nitVu,
    fCao: 1 + (ni * k.nicC + nit * k.nitC),   // el vasodilatador arterial ablanda la aorta rígida: el pulso se estrecha (ilustrativo)
    fEes: Math.max(0.5, 1 - es * k.esmolEes - lab * k.labEes),
    fFc: Math.max(0.5, 1 - es * k.esmolFc - lab * k.labFc - op * k.opFc),
    bloqueo: bloq,
  };
}

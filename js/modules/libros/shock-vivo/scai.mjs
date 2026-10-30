// Estadio SCAI del shock vivo: función pura, sin DOM. Fuente: Guía ESC 2026 de IC, parte 1, p. 44 (pdf 44): Tabla 13
// (A-E, definiciones cualitativas, «no specific blood pressure cut-off») y el texto del apartado 7.3.4 «lactato >2 mmol/L»
// como marcador de hipoperfusión. La Tabla 13 no lleva ninguna cifra: el >2 sale del texto 7.3.4.
// REGLA DEL MODELO sobre esa definición (no es de la ficha): C/D/E según las intervenciones puestas y cuánto tarda el lactato.
export const LACTATO_HIPOPERFUSION = 2;   // mmol/L, ESC 2026 p. 44 (texto 7.3.4)
export const PAM_INESTABLE = 65;           // mmHg, Marino Tabla 14.5 (la que ya usa el modelo para marcar el objetivo)
export const NOMBRES = { A: 'En riesgo', B: 'Inicial / pre-shock', C: 'Clásico', D: 'Deteriorante', E: 'Extremis' };

// R: lectura del monitor (R.pam). ajuste: {na, vaso, dobuta, soporte, venteo}. lab: {lact, horas, baja}
// (horas = tiempo desde el inicio; baja = el lactato desciende respecto a la última medida). parada: opcional (el modelo no la pinta).
export function estadioScai(R, ajuste = {}, lab = {}, parada = false) {
  const lact = lab.lact, hipo = lact > LACTATO_HIPOPERFUSION;
  const farmaco = (ajuste.na > 0) || !!ajuste.vaso || !!ajuste.dobuta;
  const mecanico = (ajuste.soporte && ajuste.soporte !== 'no') || (ajuste.venteo && ajuste.venteo !== 'no');
  const n = (farmaco ? 1 : 0) + (mecanico ? 1 : 0);
  const lac = String(lact?.toFixed ? lact.toFixed(1) : lact).replace('.', ',');
  let letra, porque, nombre;
  if (parada) { letra = 'E'; porque = 'parada cardíaca'; }
  else if (!hipo && n > 0) { letra = 'C'; nombre = 'respondiendo al tratamiento'; porque = `lactato ${lac} (≤2) con una intervención aún puesta; la Tabla 13 no define el estadio tras responder, el modelo no lo baja a A mientras siga el tratamiento`; }
  else if (!hipo) {
    if (R.pam < PAM_INESTABLE) { letra = 'B'; porque = `PAM ${R.pam} (<65) y lactato ${lac} (≤2): inestable sin hipoperfusión`; }
    else { letra = 'A'; porque = `PAM ${R.pam} y lactato ${lac} (≤2): sin hipoperfusión ni inestabilidad`; }
  } else if (n === 0) { letra = 'C'; porque = `lactato ${lac} (>2) y aún sin tratamiento`; }
  else if (n >= 2) { letra = 'E'; porque = `lactato ${lac} (>2) con varias intervenciones a la vez y la hipoperfusión sigue (la Tabla 13 llama E al shock refractario o la parada con varias intervenciones, incluida la RCP)`; }
  else if (lab.baja || !(lab.horas > 0)) { letra = 'C'; porque = `lactato ${lac} (>2) con una intervención que aún actúa`; }
  else { letra = 'D'; porque = `lactato ${lac} (>2) que persiste con una intervención puesta`; }
  return { letra, nombre: nombre || NOMBRES[letra], porque };
}

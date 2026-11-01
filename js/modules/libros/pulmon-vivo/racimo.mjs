// El racimo de alvéolos con histéresis (E2): 4 unidades que el motor (pulmon.mjs) abre y cierra según la presión alveolar.
// Sin DOM. TODAS las presiones de aquí son ILUSTRATIVAS: el libro da el fenómeno, no las cifras.
//   · Cada unidad se ABRE cuando la presión alveolar llega a su presión de apertura (pAp) y se CIERRA cuando baja de su presión
//     de cierre (pCi), que es MÁS BAJA: abrir pide más presión que mantener abierto (histéresis; Libro azul IV, pp. 450-451).
//   · Una unidad que se abre gana volumen poco a poco (RAMPA cmH₂O por encima de su apertura) y en la espiración conserva ese
//     volumen hasta su cierre: a igual presión, la rama espiratoria lleva ≥ volumen que la inspiratoria.
//   · Por encima de su presión de sobredistensión (pSob) la unidad se pone rígida: la curva se aplana (cola; LA2 pdf 87: punto de
//     inflexión superior) y su compliance cae a KAPPA de la normal.
// El volumen de la unidad abierta: V = C₀ · w · g(p), con g(p) = p hasta pSob y pSob + KAPPA·(p − pSob) después.
export const ORIGEN_RACIMO = 'ilustrativo';
export const RAMPA = 8;       // cmH₂O por encima de la apertura hasta que la unidad aporta todo su volumen
export const KAPPA = 0.5;     // pendiente de la cola (fracción de la compliance normal)
const u = (pAp, pCi, pSob) => ({ w: 0.25, pAp, pCi, pSob });
export const RACIMOS = {
  // sin colapso: ninguna unidad se cierra ni se sobredistiende; es el pulmón de un compartimento de siempre
  sano: { nombre: 'Sin colapso', lineal: true, unidades: [u(-99, -99, 999), u(-99, -99, 999), u(-99, -99, 999), u(-99, -99, 999)] },
  // SDRA reclutable: la primera unidad (zona no dependiente) siempre está abierta; las otras tres se abren a 16, 20 y 24 y se cierran a 5, 4 y 3
  sdra: { nombre: 'SDRA reclutable', lineal: false, unidades: [u(-99, -99, 26), u(16, 5, 27), u(20, 4, 28), u(24, 3, 29)] },
};
export const perfilRacimo = (k) => RACIMOS[k] || RACIMOS.sano;
export const g = (un, p) => (p <= un.pSob ? p : un.pSob + KAPPA * (p - un.pSob));
const suave = (x) => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
// peso con el que aporta una unidad abierta, según la mayor presión que ha visto desde que se abrió
export const pesoApertura = (un, pMax) => (un.pAp < -90 ? 1 : suave((pMax - un.pAp) / RAMPA));

// volumen del racimo a la presión p (mL por encima de presión cero) con el estado de las unidades: est[i] = { eff }
export function volumenRacimo(perfil, est, c0, p) { let v = 0; perfil.unidades.forEach((un, i) => { v += c0 * un.w * est[i].eff * g(un, p); }); return v; }
// presión que corresponde a un volumen (inversa; la curva es creciente)
export function presionDe(perfil, est, c0, V) {
  if (perfil.lineal) { let s = 0; perfil.unidades.forEach((un, i) => { s += un.w * est[i].eff; }); return V / (c0 * s); }
  let a = 0, b = 200;
  for (let k = 0; k < 40; k++) { const m = (a + b) / 2; if (volumenRacimo(perfil, est, c0, m) < V) a = m; else b = m; }
  return (a + b) / 2;
}
// compliance lineal de las unidades abiertas (para la constante de tiempo)
export const complianceRacimo = (perfil, est, c0) => perfil.unidades.reduce((s, un, i) => s + c0 * un.w * est[i].eff, 0);
// estado de reposo a la PEEP: abierta la unidad cuya presión de cierre no supera la PEEP
export const estadoInicial = (perfil, peep) => perfil.unidades.map((un) => { const ab = peep >= un.pCi; return { abierta: ab, pMax: ab ? Math.max(peep, un.pAp + RAMPA) : 0, eff: ab ? 1 : 0, abrio: false, cerro: false }; });
// volumen de reposo a la PEEP (las unidades que quedan abiertas al final de la espiración)
export function volumenReposo(perfil, c0, peep) { let v = 0; perfil.unidades.forEach((un) => { if (peep >= un.pCi) v += c0 * un.w * g(un, peep); }); return v; }

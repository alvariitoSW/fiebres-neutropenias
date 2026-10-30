// Histéresis P-V (maqueta mv-papel-pulmon, lámina 2). Sin DOM. Todo ILUSTRATIVO: ninguna cifra de aquí sale de una ficha.
// Idea (LA1 pdf 66-67): las unidades alveolares tienen presiones de apertura distintas y la presión que las mantiene
// abiertas (cierre) es menor que la que las abrió (histéresis). 4 unidades; cada una es una curva sigmoide.
//   Unidad cerrada: no recibe volumen. Se abre si la presión supera pAp; se cierra si baja de pCi (< pAp).
//   Rama inspiratoria de una unidad que se abre en este ciclo: su curva abierta × una rampa que va de 0 (en pAp) a 1 (8 cmH₂O
//   después); la espiratoria, la curva abierta completa hasta pCi, empalmada con la inspiratoria en la meseta: siempre ≥ ella.
//   Una unidad que ya estaba abierta (PEEP ≥ pCi) no cierra: inspira y espira por la misma curva (sin histéresis).
import { pbw } from '../b3-pulmon/pulmon.mjs';

export const ORIGEN = 'ilustrativo';
export const TOPES = { peepMax: 20, peepAviso: 16, vtMin: 4, vtMax: 8, vtSello: 8, vtTope: 10, mesetaSello: 30, presionMax: 50 };
const COLA = 0.012;                          // cola lineal (por mL de vu): el pulmón sobredistendido se pone rígido en vez de saturarse
const S = (u, p) => 1 / (1 + Math.exp(-(p - u.pm) / u.k)) + COLA * p;
const unidad = (pAp, pCi, vu, pm, k) => ({ pAp, pCi, vu, pm, k });
export const PERFILES = {
  normal: { nombre: 'Pulmón normal', unidades: [0, 1, 2, 3].map(() => unidad(-99, -99, 350, 12, 6)), abiertas: true },
  sdra: { nombre: 'SDRA reclutable', abiertas: false, unidades: [
    unidad(16, 6, 450, 14, 5), unidad(18, 7, 450, 14, 5), unidad(22, 9, 450, 14, 5), unidad(24, 10, 450, 14, 5)] },
};

export function crearHisteresis(perfil = 'sdra') {
  const pf = PERFILES[perfil];
  let est = pf.unidades.map((u) => ({ abierta: pf.abiertas }));
  const vAb = (u, e, p) => (e.abierta ? u.vu * (S(u, p) - S(u, u.pCi)) : 0);
  const sm = (x) => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
  const wIns = (u, p) => sm((p - u.pAp) / 8);   // una unidad que se abre gana volumen poco a poco (continuo)
  const total = (p) => pf.unidades.reduce((s, u, i) => s + vAb(u, est[i], p), 0);
  // Un ciclo VCV: vtMl a PEEP peep. Devuelve el bucle y el estado de cada unidad.
  function ciclo(peep, vtMl) {
    const abiertaIni = est.map((e) => e.abierta);
    const nuevo = est.map(() => false);
    const v0 = total(peep), insp = [{ p: peep, v: 0 }];
    let P = peep, vv = 0;
    while (vv < vtMl && P < TOPES.presionMax) {
      P = Math.min(TOPES.presionMax, P + 0.25);
      pf.unidades.forEach((u, i) => { if (!est[i].abierta && P >= u.pAp) { est[i].abierta = true; nuevo[i] = true; } });
      vv = pf.unidades.reduce((s, u, i) => s + (nuevo[i] ? vAb(u, est[i], P) * wIns(u, P) : vAb(u, est[i], P)), 0) - v0;
      insp.push({ p: P, v: Math.max(0, vv) });
    }
    const pTop = P, vTop = Math.max(0, vv);
    // espiración: las nuevas, reescaladas para encontrarse con la inspiración arriba; las viejas, por su curva
    const esp = [];
    for (let p = pTop; p >= peep - 1e-9; p -= 0.25) {
      const v = pf.unidades.reduce((s, u, i) => s + (est[i].abierta && p >= u.pCi ? vAb(u, est[i], p) * (nuevo[i] ? wIns(u, pTop) + (1 - wIns(u, pTop)) * (1 - Math.max(0, Math.min(1, (p - u.pCi) / (pTop - u.pCi)))) : 1) : 0), 0) - v0;
      esp.push({ p, v: Math.max(0, v) });
    }
    // las unidades cuya pCi queda por encima de la PEEP se cierran al final de la espiración
    const unidades = pf.unidades.map((u, i) => {
      const cierra = est[i].abierta && peep < u.pCi;
      if (cierra) est[i].abierta = false;
      const abreCierra = nuevo[i] && cierra;
      const sobre = (abiertaIni[i] || nuevo[i]) && pTop > u.pm + 2.2 * u.k;
      return { estado: sobre ? 'sobre' : abreCierra ? 'abre-cierra' : (abiertaIni[i] || nuevo[i]) ? 'abierto' : 'cerrado', abreCierra };
    });
    const dp = pTop - peep;
    const pm = pf.unidades[0].pm, k = pf.unidades[0].k;
    return {
      insp, esp, peep, pMeseta: pTop, vt: vTop, dp, cstat: dp > 0 ? vTop / dp : null, unidades,
      nAbreCierra: unidades.filter((u) => u.abreCierra).length,
      infInf: Math.max(0, pm - 1.317 * k), infSup: pm + 1.317 * k,   // máxima curvatura de la sigmoide (ilustrativo)
    };
  }
  return { ciclo, reiniciar() { est = pf.unidades.map(() => ({ abierta: pf.abiertas })); }, get perfil() { return pf; } };
}

// Estado estable: n ciclos seguidos desde cero (para las pruebas y para cada cambio de mando)
export function simularHisteresis({ perfil = 'sdra', peep = 5, vtKg = 6, talla = 175, sexo = 'v', ciclos = 4 } = {}) {
  const h = crearHisteresis(perfil), vt = Math.round(vtKg * pbw(talla, sexo));
  let c; for (let i = 0; i < ciclos; i++) c = h.ciclo(peep, vt);
  return c;
}

// Sellos (REGLAS §1.14): qué se le pasa al paciente. Devuelve null o { clave, titulo, texto, origen, cita }.
export function selloHisteresis(c, { vtKg, peep }) {
  if (vtKg > TOPES.vtSello) return { clave: 'vt', titulo: 'Fuera de la protectora', origen: 'ficha', cita: 'M27 pdf 13-14',
    texto: `Vt de ${String(vtKg).replace('.', ',')} mL/kg: el protocolo empieza en 8 y baja a 6 (4 si la meseta pasa de 30). Con más volumen cada ciclo estira más el pulmón.` };
  if (c.pMeseta > TOPES.mesetaSello) return { clave: 'meseta', titulo: 'Meseta por encima de 30', origen: 'ficha', cita: 'M27 pdf 4',
    texto: `Meseta de ${Math.round(c.pMeseta)} cmH₂O: el objetivo de la ficha es ≤30 para no lesionar el alvéolo. Baja el Vt.` };
  if (c.nAbreCierra > 0 && peep < Math.max(...PERFILES.sdra.unidades.map((u) => u.pCi)))
    return { clave: 'atelectrauma', titulo: 'Abre y cierra cada ciclo', origen: 'ficha', cita: 'M22 pdf 48; LA1 pdf 67',
      texto: `${c.nAbreCierra} de 4 unidades se abren al inspirar y se colapsan al espirar: es el atelectrauma, que daña la vía aérea pequeña. Con tantas respiraciones al día (unas 30 000), la lesión se acumula.` };
  if (peep >= TOPES.peepMax) return { clave: 'peep', titulo: 'PEEP en el tope', origen: 'ficha', cita: 'M27 pdf 10',
    texto: 'PEEP de 20 cmH₂O: la ficha llega hasta 20 para abrir lo colapsado, pero la misma PEEP sobredistiende las zonas sanas (volutrauma). No se sube más.' };
  return null;
}

// Genera guyton-tablas.mjs: la curva de función cardíaca (GC frente a PVC) de cada escenario, precalculada para que el
// móvil nunca la calcule al vuelo. No forma parte de la app (no hay build): se ejecuta a mano, desde la raíz del repo,
// y su salida se guarda en el repositorio. Hay que volver a ejecutarla si cambia el motor o un escenario.
//
//   node js/modules/eco/herramientas/curvas-guyton.mjs
//
// Para cada escenario: el mismo estado que ve la app (motor normal 12 s, se aplica el escenario y se deja asentar),
// después se suma o se resta volumen en las venas (de −600 a +900 mL) y se deja correr 40 s con el barorreflejo, hasta
// el nuevo estado estable. Cada punto es (PVC, GC) de ese estado: la curva de Frank-Starling del paciente tal como la
// produce el motor (fisiología general; las cifras son las del modelo).
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { crearMotor } from '../motor.mjs';
import { ESCENARIOS, ASENTAR_FORMA } from '../escenarios.mjs';

export const VOLUMENES = [-600, -450, -300, -150, 0, 150, 300, 450, 600, 750, 900];
export const ASENTAR_PUNTO = 40;
const r2 = (x) => Math.round(x * 100) / 100;

export function puntoGuyton(clave, dv) {
  const m = crearMotor(); m.correr(12); ESCENARIOS[clave].aplicar(m);
  if (clave !== 'normal') m.correr(ESCENARIOS[clave].forma ? ASENTAR_FORMA : 10);
  m.s.vven += dv; m.correr(ASENTAR_PUNTO);
  const u = m.ultimo;
  return { pvc: r2(u.pvc), gc: r2(u.gc), pms: r2(u.pmls), vs: r2(u.vs) };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const tablas = {};
  for (const clave of Object.keys(ESCENARIOS)) {
    const pts = VOLUMENES.map(dv => puntoGuyton(clave, dv));
    tablas[clave] = { dv: VOLUMENES, pvc: pts.map(p => p.pvc), gc: pts.map(p => p.gc), pms: pts.map(p => p.pms), vs: pts.map(p => p.vs) };
    console.log(clave, pts.map(p => `${p.pvc}/${p.gc}`).join(' '));
  }
  const salida = `// GENERADO por herramientas/curvas-guyton.mjs: no se edita a mano (se vuelve a generar si cambia el motor).
// Curva de función cardíaca de cada escenario: con dv mL más o menos en las venas, el estado estable del motor
// (barorreflejo encendido): PVC (mmHg), GC (L/min), Pms (mmHg) y VS (mL). Fisiología general: cifras del modelo.
export const CURVAS_GUYTON = ${JSON.stringify(tablas, null, 0).replace(/\},"/g, '},\n  "').replace(/^\{/, '{\n  ').replace(/\}$/, '\n}')};
`;
  const destino = new URL('../guyton-tablas.mjs', import.meta.url);
  writeFileSync(destino, salida);
  console.log('escrito', fileURLToPath(destino));
}

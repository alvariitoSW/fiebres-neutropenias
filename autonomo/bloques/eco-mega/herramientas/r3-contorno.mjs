// R3 (eco-mega, parada 3) · contorno endocárdico del VI en el PSAX de papilares (TEP a fondo): ángulo mínimo interior y excentricidad.
// uso: node r3-contorno.mjs   (exporta anguloMinimoVi para la prueba)
import { crearMotor } from '../../../../js/modules/eco/motor.mjs';
import { construirCorazon } from '../../../../js/modules/eco/corazon-geo.mjs';
import { estadoGeo, extraDeMotor } from '../../../../js/modules/eco/formas.mjs';
import { aplicarEscenario } from '../../../../js/modules/eco/escenarios.mjs';
import { planoVista, cortarPieza } from '../../../../js/modules/eco/ecografia.mjs';
import { bucleMayor, remuestrear, angulos } from './saco-contorno.mjs';
export function pacienteTep(g = 1) { const m = crearMotor(); m.correr(12); aplicarEscenario(m, 'tep', g); m.correr(40); return { m, o: m.onda, ex: extraDeMotor(m) }; }
// estado con el tabique más aplanado del latido
export const septoMax = (p) => { const es = p.o.map(s => estadoGeo(s, p.ex)); return es.reduce((a, b) => (b.septo > a.septo ? b : a)); };
export function anguloMinimoVi(est, opciones = { pericardio: true, detalle: true }, paso = 1.5, vista = 'psaxPm') {
  const geo = construirCorazon(est, opciones), P = planoVista(vista, est), pz = geo.partes.find(q => q.nombre === 'VI endocardio');
  const pts = remuestrear(bucleMayor(cortarPieza(pz, P).seg), paso), ang = angulos(pts, 3);
  const xs = pts.map(q => q[0]), ys = pts.map(q => q[1]);
  return { min: Math.min(...ang), n: pts.length, ancho: Math.max(...xs) - Math.min(...xs), alto: Math.max(...ys) - Math.min(...ys), pts };
}
if (process.argv[1]?.endsWith('r3-contorno.mjs')) {
  const p = pacienteTep(), e = septoMax(p), r = anguloMinimoVi(e);
  console.log('septo', e.septo.toFixed(2), 'puntos', r.n, 'ángulo mínimo', r.min.toFixed(0), '° ejes', r.ancho.toFixed(0), r.alto.toFixed(0));
}

// Los topes de los mandos del corazón eléctrico (autonomo/bloques/b3/limites-ritmo.md). Una función pura: del estado
// de la sesión (S), el reloj (simT) y el motor (mo) sale lo que toca poner. pagina.js lo pasa a la pieza común
// js/core/tope.js (avisos y sellos) y apaga los botones de `off`. Cada tope lleva su origen tal como lo da la tabla.
import { C } from '../../../data/ritmo-vivo-data.js';
export const ADE = ['ade6', 'ade12', 'ade-tv', 'ade-ab'];
export const CHOQUES = ['cv-fa', 'cv-wpw', 'desf-wpw', 'cv-tv', 'desf-tdp', 'choque'];
const SIN_SINUSAL = ['cv-fa', 'cv-wpw', 'desf-wpw', 'cv-tv', 'desf-tdp'];
export const MAX = { ade: 3, vagal: 3, meto: 3, veraMg: 20, veraPorToque: 5, amioTv: 2, amioPcr: 2, tv: 3, intervaloAdre: 180, parada: 1800, paradaAviso: 1200 };
export const ENERGIA_TV = ['100 J', '100 J', '200 J'];   // 100 → 100 bifásico → 200 J (p. 32)
export const mmss = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
export const cargando = (S, simT) => !!(S.desfib && (S.desfib.esperaQRS || !S.desfib.tChoque || simT < S.desfib.tChoque + 0.5));

export function calcularTopes(S, simT, mo) {
  const off = new Set(), rot = {}, D = S.dosis || {}, p = S.parada, m = mo ? mo.m : null;
  // Cada tope lleva `deshabilita` con los mandos que apagó justo antes de ponerse (la pieza común los apaga y reapaga al repintar el dock).
  let pend = [];
  const apaga = (...l) => l.flat().forEach((a) => { off.add(a); pend.push(`#rtv-dock-panel [data-acc="${a}"]`); });
  const T = new Proxy({}, { set(o, k, v) { v.deshabilita = [...new Set([...(o[k]?.deshabilita || []), ...pend])]; pend = []; o[k] = v; return true; } });
  // 1) adenosina: 6 → 12 → 12 mg; entre bolos, esperar a que acabe el cerrojo
  const nA = D.ade || 0, actua = !!(m && simT < m.cerrojoFin);
  if (nA >= MAX.ade) { apaga(ADE); T.ade = { nivel: 'sello', titulo: 'Tope de adenosina', texto: 'Tres bolos (6, 12 y 12 mg) son las dosis de la tabla: la ficha no da una cuarta. Si el ritmo sigue, la adenosina ya no lo corta.', cita: C.t194, origen: 'ficha · Tabla 19.4, p. 30 · "si el ritmo sigue": fisiología general' }; }
  else if (actua) { apaga(ADE); T.ade = { nivel: 'aviso', titulo: 'Adenosina actuando', texto: 'Espera a que acabe el cerrojo del nodo antes del siguiente bolo (la ficha deja 2 min entre ellos).', cita: C.t194, origen: 'ficha · Tabla 19.4, p. 30' }; }
  else if (nA === 2) { T.ade = { nivel: 'aviso', titulo: 'Última dosis', texto: 'Tras 6 y 12 mg queda un último bolo de 12 mg; por vía central, la mitad.', cita: C.t194, origen: 'ficha · Tabla 19.4, p. 30' }; rot.ade12 = 'última dosis (12 mg)'; }
  if (nA === 1 && !actua) rot.ade12 = '12 mg · 2.ª dosis';
  // 2) diltiazem en bolo (nodal): uno
  if ((D['dilt-nodo'] || 0) >= 1) { apaga('dilt-nodo'); T.dilt = { nivel: 'aviso', titulo: 'Un solo bolo', texto: 'Bolo de 0,25 mg/kg y luego perfusión de 5-15 mg/h. Otro bolo no está en la ficha, y el diltiazem baja la presión (hipotensión en el 20-30 %).', cita: C.dilt, origen: 'ficha · Tabla 19.1, p. 22-23 · un 2.º bolo: la fuente no lo dice' }; }
  // 3) maniobras vagales: 3 intentos cada una
  const pc = { 'vagal-v': '24 %', 'vagal-m': '44 %', 'vagal-c': '9 %' };
  for (const a of Object.keys(pc)) { const n = D[a] || 0; if (n) rot[a] = `${pc[a]} · intento ${Math.min(n + 1, MAX.vagal)}/${MAX.vagal}`; if (n >= MAX.vagal) { apaga(a); rot[a] = `${pc[a]} · 3/3`; T.vagal = { nivel: 'aviso', titulo: 'No insistas', texto: 'Tres intentos de la misma maniobra ya son bastantes: pasa a la adenosina.', cita: C.vagal, origen: 'ficha · p. 29 (cada intento es una tirada) · el 3: ilustrativo' }; } }
  // 4) choques: uno por carga, ninguno sobre un sinusal, 3 en la TV (100 → 100 → 200 J, nunca 360)
  const carga = cargando(S, simT);
  if (carga) { apaga(CHOQUES); T.carga = { nivel: 'aviso', titulo: 'Cargando', texto: 'El desfibrilador tarda unos segundos en cargar y descargar: un choque por carga.', origen: 'ilustrativo' }; }
  const nTV = S.choquesTV || 0;
  if (S.sinusal && !p) { apaga(SIN_SINUSAL); T.sinusal = { nivel: 'aviso', titulo: 'Ya en sinusal', texto: 'Un choque ahora puede inducir una FV.', origen: 'fisiología general' }; }
  else if (S.clave === 'tv' && nTV >= MAX.tv) { apaga('cv-tv'); T.energia = { nivel: 'sello', titulo: 'Tope de energía', texto: 'Tres choques (100, 100 bifásico y 200 J): nunca 360 J, que daña el miocardio.', cita: C.f198, origen: 'ficha · p. 32' }; }
  else if (S.clave === 'tv' && nTV === 2) T.energia = { nivel: 'aviso', titulo: 'Último choque', texto: 'El siguiente es de 200 J, el último: no se usan 360 J.', cita: C.f198, origen: 'ficha · p. 32' };
  if (S.clave === 'tv') rot['cv-tv'] = nTV >= MAX.tv ? '3/3 choques' : nTV === 2 ? 'último: 200 J' : `${ENERGIA_TV[nTV]}${nTV ? '' : ' sinc.'}`;
  // 5) los tres frenos del WPW con FA: uno ya es el error
  if (S.wpwNodo) { apaga('w-dilt', 'w-bb', 'w-digo'); T.freno = { nivel: 'aviso', titulo: 'No sigas frenando', texto: 'Un freno del nodo ya es el error que enseña esta pantalla: más no frenan el atajo y pueden precipitar una FV.', cita: C.wpw, origen: 'ficha · p. 28' }; }
  // 6) TAM: magnesio una pauta; metoprolol 3 dosis; verapamilo hasta 20 mg
  if ((D['mg-tam'] || 0) >= 1) { apaga('mg-tam'); T.mg = { nivel: 'aviso', titulo: 'Pauta completa', texto: '2 g en 15 min y 6 g en 6 h son la pauta. Repetirla sería hipermagnesemia.', cita: C.tam, origen: 'ficha · p. 28 · la hipermagnesemia: ilustrativo; una revisión de 2025 no halló efectos graves del magnesio (0 de 46; Sangawa, PMID 41216399)' }; }
  if ((D['mg-tdp'] || 0) >= 1) { apaga('mg-tdp'); T.mgTdp = { nivel: 'aviso', titulo: 'Pauta completa', texto: 'Una pauta de 1-2 g en 15 min (la dosis no tiene consenso). Repetirla sin que vuelva la torsade sería hipermagnesemia.', cita: C.tdpManejo, origen: 'ficha · p. 35 · el tope y la hipermagnesemia: ilustrativo; una revisión de 2025 no halló efectos graves del magnesio (0 de 46; Sangawa, PMID 41216399)' }; }
  const nM = D['meto-tam'] || 0;
  if (nM) rot['meto-tam'] = `dosis ${Math.min(nM, MAX.meto)}/${MAX.meto} · 2,5-5 mg`;
  if (nM >= MAX.meto) { apaga('meto-tam'); T.meto = { nivel: 'aviso', titulo: 'Tope de metoprolol', texto: 'Tres dosis de 2,5-5 mg IV: ya no se da más.', cita: C.t191, origen: 'ficha · Tabla 19.1, p. 23' }; }
  const mgV = (D['vera-tam'] || 0) * MAX.veraPorToque;
  if (mgV) rot['vera-tam'] = `hasta ${mgV}/${MAX.veraMg} mg`;
  if (mgV >= MAX.veraMg) { apaga('vera-tam'); T.vera = { nivel: 'sello', titulo: 'Tope de verapamilo', texto: '20 mg es el máximo de la ficha: dar más no está previsto (es inotrópico negativo; bradicardia e hipotensión, por fisiología general).', cita: C.tam, origen: 'ficha · p. 28 (total 20 mg) · bradicardia e hipotensión: fisiología general; en la TSV estable la hipotensión por verapamilo es rara (Cochrane 2017, Alabed, PMID 29025197)' }; }
  else if (mgV >= 15) T.vera = { nivel: 'aviso', titulo: 'Cerca del tope', texto: `Vas por ${mgV} de los 20 mg de verapamilo: más es inotrópico negativo.`, cita: C.tam, origen: 'ficha · p. 28 (inotrópico negativo; total 20 mg)' };
  // 7) amiodarona de la TV: 150 mg, repetible una vez
  const nT = D['amio-tv'] || 0;
  if (nT) rot['amio-tv'] = nT >= MAX.amioTv ? '2/2 dosis' : '150 mg · repetible 1 vez';
  if (nT >= MAX.amioTv) { apaga('amio-tv'); T.amioTv = { nivel: 'aviso', titulo: 'Bolos completos', texto: 'Dos bolos de 150 mg en 10 min: sigue 1 mg/min 6 h y 0,5 mg/min 18 h, sin pasar de 2,2 g al día. La ficha admite dosis extra de 150 mg cada 10 min si hace falta: el límite de dos bolos es de esta pantalla.', cita: C.f198, origen: 'ficha · Fig. 19.8, p. 33 · el tope de 2 bolos: ilustrativo (ninguna guía lo fija)' }; }
  // 8) la parada: adrenalina cada 3-5 min del reloj, amiodarona 300 + 150, reloj con tope y nada tras el pulso
  if (p) {
    const adre = ['adre'], amio = ['amio-pcr'];
    if (p.rce) { apaga(adre, amio); T.rce = { nivel: 'aviso', titulo: 'Ya hay pulso', texto: 'Con pulso, otra adrenalina sube la presión y dispara la FC (taquiarritmia): se apagan adrenalina y amiodarona de la parada.', cita: C.adrenalina, origen: 'ficha · p. 59 y p. 62 · con pulso: fisiología general' }; }
    else {
      if (p.adreReloj != null && p.reloj - p.adreReloj < MAX.intervaloAdre) { apaga(adre); rot.adre = `siguiente en ${mmss(MAX.intervaloAdre - (p.reloj - p.adreReloj))}`; T.adre = { nivel: 'aviso', titulo: 'Adrenalina cada 3-5 min', texto: 'Aún no toca la siguiente dosis de 1 mg (el reloj de la parada va 10 veces más deprisa).', cita: C.adrenalina, origen: 'ficha · p. 59-60' }; }
      if ((p.amio || 0) >= MAX.amioPcr) { apaga(amio); T.amioPcr = { nivel: 'aviso', titulo: 'Amiodarona completa', texto: '300 mg y 150 mg: son las dos dosis de la ficha.', cita: C.algoritmo, origen: 'ficha · p. 59' }; }
      if (S.clave === 'fv' && p.escenario === 'refractaria' && p.choques >= 3) T.refractaria = { nivel: 'sello', titulo: 'FV refractaria', texto: `${p.choques} choques sin éxito: buen resultado solo en el 5 %; ECMO si se dispone.`, cita: C.refractaria, origen: 'ficha · p. 59-60' };
      if (p.reloj >= MAX.parada) { apaga(adre, amio, 'comp', 'choque', 'causa-0', 'causa-1', 'causa-2', 'causa-3'); T.reloj = { nivel: 'sello', titulo: 'Sin RCE a los 30 min', texto: 'Media hora de reanimación sin recuperar el pulso: el caso se detiene. Tras tres choques sin éxito, el buen resultado es del 5 %.', cita: C.refractaria, origen: 'ficha · p. 60 · los 30 min: ilustrativo; Goldberger 2012 (PMID 22958912) no puede definir una duración óptima de la reanimación' }; }
      else if (p.reloj >= MAX.paradaAviso) T.reloj = { nivel: 'aviso', titulo: 'Veinte minutos', texto: 'Más de 20 min de parada sin pulso; a los 30 min se acaba el caso.', origen: 'ilustrativo; el orden de magnitud sale de Goldberger 2012 (PMID 22958912): mediana de 20 min en los que no sobreviven' };
    }
  }
  const sello = T.reloj?.nivel === 'sello' ? T.reloj : Object.values(T).find((t) => t.nivel === 'sello');
  return { T, off, rot, frase: sello ? [`<b>${sello.titulo}.</b> ${sello.texto}`, sello.origen] : null };
}

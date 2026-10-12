// Sangre en movimiento: partículas que llenan las cavidades y corren por los vasos.
// Cada partícula vale VOL_PARTICULA mL. Cuántas pasan por cada válvula sale del flujo real del motor
// (qMit, qAo, qTri, qPul) y cuántas entran por las venas, de qVp (venas pulmonares) y qRet (cavas).
// Dentro de una cavidad, la partícula guarda coordenadas normalizadas, así que se mueve con las paredes.
// Todo ilustrativo (las velocidades de los vasos se exageran poco para que se vea el pulso).
export const VOL_PARTICULA = 2.5;
const OX = 'ox', VEN = 'ven';
const CAMARA = { ai: OX, vi: OX, ad: VEN, vd: VEN };
const VIA_SANGRE = (n) => (n === 'ao' || n.startsWith('vp')) ? OX : VEN;
// entra por cada válvula: de dónde a dónde
const PASOS = [
  { q: 'qMit', de: 'ai', a: 'vi', valvula: 'mitral' },
  { q: 'qTri', de: 'ad', a: 'vd', valvula: 'tricus' },
  { q: 'qAo', de: 'vi', via: () => 'ao', valvula: 'aortica' },
  { q: 'qPul', de: 'vd', via: () => Math.random() < 0.55 ? 'apD' : 'apI', valvula: 'pulmonar' },
];
const azar = () => [Math.random(), Math.random(), Math.sqrt(Math.random())];
const DUR_TRANSITO = 0.09;    // s simulados para cruzar una válvula

export function crearFlujo() {
  let ps = [];
  const acum = { qMit: 0, qTri: 0, qAo: 0, qPul: 0, vp: 0, cava: 0 };
  let tReconciliar = 0, iniciado = false;

  const enCamara = (de) => ps.filter(p => p.lugar === de);
  function poblar(s, flujo) {
    ps = [];
    for (const c of ['ai', 'vi', 'ad', 'vd']) { const n = Math.round(s['v' + c] / VOL_PARTICULA); for (let i = 0; i < n; i++) ps.push({ lugar: c, n: azar() }); }
    // vasos ya con sangre corriendo
    for (const [via, n] of [['ao', 40], ['apD', 14], ['apI', 12], ['vcs', 6], ['vci', 5], ['vp0', 3], ['vp1', 3], ['vp2', 3], ['vp3', 3]])
      for (let i = 0; i < n; i++) ps.push({ lugar: 'via', via, t: Math.random(), destino: via.startsWith('vp') ? 'ai' : via.startsWith('vc') ? 'ad' : null });
    iniciado = true;
  }
  // velocidad por vía (mm/s): base + parte proporcional al flujo que la mueve
  const velocidad = (via, s) => via === 'ao' ? 90 + 0.5 * Math.max(0, s.qAo) : via.startsWith('ap') ? 80 + 0.55 * Math.max(0, s.qPul)
    : via.startsWith('vp') ? 40 + 0.9 * Math.max(0, s.qVp) : 40 + 0.6 * Math.max(0, s.qRet);

  return {
    get particulas() { return ps; },
    reiniciar() { iniciado = false; },
    // pasado: mL que han pasado por cada válvula/vena desde la última llamada (integrados paso a paso en el
    // motor; con pocos fotogramas por segundo, muestrear el flujo instantáneo perdería eyecciones enteras)
    actualizar(dt, s, flujo, pasado = null) {
      const vol = (k) => pasado ? pasado[k] : Math.max(0, s[k]) * dt;
      if (!flujo) return;
      if (!iniciado) poblar(s, flujo);
      if (dt <= 0) return;
      // entradas por las venas
      acum.vp += vol('qVp') / VOL_PARTICULA;
      while (acum.vp >= 1) { acum.vp--; ps.push({ lugar: 'via', via: 'vp' + Math.floor(Math.random() * 4), t: 0, destino: 'ai' }); }
      acum.cava += vol('qRet') / VOL_PARTICULA;
      while (acum.cava >= 1) { acum.cava--; ps.push({ lugar: 'via', via: Math.random() < 0.4 ? 'vcs' : 'vci', t: 0, destino: 'ad' }); }
      // paso por las válvulas
      for (const k of PASOS) {
        acum[k.q] += vol(k.q) / VOL_PARTICULA;
        while (acum[k.q] >= 1) {
          acum[k.q]--;
          const fuente = enCamara(k.de); if (!fuente.length) { acum[k.q] = 0; break; }
          const p = fuente[Math.floor(Math.random() * fuente.length)];
          p.ancla = [{ cam: k.de, n: p.n }, { valvula: k.valvula }];
          if (k.a) { p.n = azar(); p.n[0] *= 0.6; p.ancla.push({ cam: k.a, n: p.n }); p.siguiente = { lugar: k.a }; }
          else { const via = k.via(); p.ancla.push({ via, t: 0 }); p.siguiente = { lugar: 'via', via, t: 0, destino: null }; }
          p.lugar = 'transito'; p.prog = 0;
        }
      }
      // movimiento
      for (const p of ps) {
        if (p.lugar === 'transito') {
          p.prog += dt / DUR_TRANSITO;
          if (p.prog >= 1) { Object.assign(p, p.siguiente); delete p.ancla; delete p.siguiente; }
        } else if (p.lugar === 'via') {
          p.t += velocidad(p.via, s) * dt / flujo.largo(p.via);
          if (p.t >= 1) { if (p.destino) { p.lugar = p.destino; p.n = azar(); p.n[0] = 0.15 + 0.5 * Math.random(); delete p.destino; } else p.muerta = true; }
        } else if (p.n) { p.n[1] += (Math.random() - 0.5) * 0.02 * dt * 60; }   // leve deriva en la cavidad
      }
      ps = ps.filter(p => !p.muerta);
      // cada 0,5 s se corrige el número de partículas de cada cavidad con su volumen real
      tReconciliar += dt;
      if (tReconciliar > 0.5) { tReconciliar = 0;
        for (const c of ['ai', 'vi', 'ad', 'vd']) {
          const lista = enCamara(c), obj = Math.round(s['v' + c] / VOL_PARTICULA);
          for (let i = lista.length; i < obj - 2; i++) ps.push({ lugar: c, n: azar() });
          if (lista.length > obj + 2) { const sobran = new Set(lista.slice(0, lista.length - obj)); ps = ps.filter(p => !sobran.has(p)); }
        } }
    },
    // posiciones en coordenadas del modelo (ya deformadas) y colores
    puntos(flujo, opciones = {}) {
      const pos = [], tipo = [];
      const enAncla = (a) => a.cam ? flujo.enCamara[a.cam](a.n) : a.valvula ? flujo.valvulas[a.valvula] : flujo.enVia(a.via, a.t);
      // en la vista de la base se retiran aurículas y grandes vasos: su sangre tampoco se dibuja
      const oculto = (lugar, via) => opciones.vistaBase && (lugar === 'ai' || lugar === 'ad' || !!via);
      for (const p of ps) {
        let q, sangre;
        if (p.lugar === 'transito') {
          const n = p.ancla.length - 1, x = p.prog * n, i = Math.min(n - 1, Math.floor(x));
          q = (() => { const a = enAncla(p.ancla[i]), b = enAncla(p.ancla[i + 1]), t = x - i; return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; })();
          sangre = CAMARA[p.ancla[0].cam];
        } else if (p.lugar === 'via') {
          if (oculto(null, p.via)) continue;
          q = flujo.enVia(p.via, p.t); sangre = VIA_SANGRE(p.via);
        } else { if (oculto(p.lugar)) continue; q = flujo.enCamara[p.lugar](p.n); sangre = CAMARA[p.lugar]; }
        if (!flujo.visible(q)) continue;
        const w = flujo.transformar(q); pos.push(w[0], w[1], w[2]); tipo.push(sangre === OX ? 1 : 0);
      }
      return { pos: new Float32Array(pos), tipo: new Uint8Array(tipo) };
    },
  };
}
